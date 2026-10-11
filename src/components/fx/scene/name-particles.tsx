"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { fx, onFx } from "./store"

const vertex = /* glsl */ `
  attribute float aSeed;
  attribute float aHeat;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  uniform float uFade;
  varying float vSeed;
  varying float vHeat;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 40.0);
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (1.0 + aHeat * 0.8);
    vSeed = aSeed;
    vHeat = aHeat;
    vAlpha = twinkle * uFade;
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying float vSeed;
  varying float vHeat;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    vec3 amber = vec3(1.0, 0.76, 0.34);
    vec3 ember = vec3(1.0, 0.45, 0.12);
    vec3 coral = vec3(0.98, 0.25, 0.18);
    vec3 col = mix(coral, ember, smoothstep(0.0, 0.55, vSeed));
    col = mix(col, amber, smoothstep(0.6, 1.0, vSeed));
    col = mix(col, vec3(1.0, 0.95, 0.85), vHeat * 0.7);
    gl_FragColor = vec4(col * (0.9 + vHeat * 1.6), core * core * vAlpha);
  }
`

interface Sample {
  /** Home positions in page pixels (x, pageY). */
  home: Float32Array
  count: number
}

/** Rasterizes the hero `<h1>` lines offscreen and samples filled pixels. */
function sampleHeroName(maxCount: number): Sample | null {
  const lines = document.querySelectorAll<HTMLElement>("#hero-name [data-line]")
  if (!lines.length) return null
  const vw = window.innerWidth
  const scrollY = window.scrollY
  const first = lines[0].getBoundingClientRect()
  const last = lines[lines.length - 1].getBoundingClientRect()
  const top = Math.floor(first.top + scrollY) - 40
  const height = Math.ceil(last.bottom - first.top) + 80

  const canvas = document.createElement("canvas")
  canvas.width = vw
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.fillStyle = "#fff"
  ctx.textBaseline = "alphabetic"

  // Draw word by word at the exact boxes the browser laid out, so wrapped
  // lines and letter-spacing match the DOM heading pixel for pixel.
  lines.forEach((line) => {
    const style = getComputedStyle(line)
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const spacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing
    ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = spacing
    ctx.textAlign = "left"
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? ""
      for (const match of text.matchAll(/\S+/g)) {
        const range = document.createRange()
        range.setStart(node, match.index)
        range.setEnd(node, match.index + match[0].length)
        const rect = range.getBoundingClientRect()
        const word = match[0].toUpperCase()
        const metrics = ctx.measureText(word)
        const content = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
        const baseline = rect.top + scrollY - top + (rect.height - content) / 2 + metrics.fontBoundingBoxAscent
        ctx.fillText(word, rect.left, baseline)
      }
    }
  })

  const data = ctx.getImageData(0, 0, vw, height).data
  const fontPx = parseFloat(getComputedStyle(lines[0]).fontSize)
  const step = Math.max(2, Math.round(fontPx / 34))
  // small type needs tighter dots to stay legible
  const jitter = fontPx < 80 ? 0.5 : 1.1
  const points: number[] = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < vw; x += step) {
      if (data[(y * vw + x) * 4 + 3] > 140) points.push(x + (Math.random() - 0.5) * step * jitter, y + top + (Math.random() - 0.5) * step * jitter)
    }
  }
  let count = points.length / 2
  // random subsample down to budget
  if (count > maxCount) {
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[points[i * 2], points[j * 2]] = [points[j * 2], points[i * 2]]
      ;[points[i * 2 + 1], points[j * 2 + 1]] = [points[j * 2 + 1], points[i * 2 + 1]]
    }
    count = maxCount
  }
  return { home: Float32Array.from(points.slice(0, count * 2)), count }
}

const MAX_DESKTOP = 11000
const MAX_MOBILE = 7000

/**
 * The hero name as ~10k ember particles. Each particle springs toward its
 * glyph pixel; the pointer repels, clicks detonate, and scrolling past the
 * hero lifts them away like sparks. CPU spring sim, GPU sprites.
 */
export function NameParticles() {
  const size = useThree((state) => state.size)
  const viewport = useThree((state) => state.viewport)
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const sim = useRef<{
    sample: Sample
    pos: Float32Array
    vel: Float32Array
    heat: Float32Array
    stiff: Float32Array
    geometry: THREE.BufferGeometry
    born: number
  } | null>(null)
  const assembled = useRef(false)

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: 1 },
      uSize: { value: 3 },
      uTime: { value: 0 },
      uFade: { value: 0 },
    }),
    [],
  )

  // (Re)build the particle system on mount and when the viewport width changes.
  useEffect(() => {
    let cancelled = false
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const build = async () => {
      await document.fonts.ready
      // let the heading's entrance transforms settle before measuring it
      await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 1700 - performance.now())))
      if (cancelled || !points.current) return
      const sample = sampleHeroName(coarse ? MAX_MOBILE : MAX_DESKTOP)
      if (!sample || !sample.count) return
      const n = sample.count
      const pos = new Float32Array(n * 3)
      const vel = new Float32Array(n * 3)
      const heat = new Float32Array(n)
      const stiff = new Float32Array(n)
      const seeds = new Float32Array(n)
      const previous = sim.current
      for (let i = 0; i < n; i++) {
        if (previous && i < previous.sample.count) {
          pos.set(previous.pos.subarray(i * 3, i * 3 + 3), i * 3)
        } else {
          // start as a wide ember cloud that collapses into the name
          const a = Math.random() * Math.PI * 2
          const r = 3 + Math.random() * 6
          pos[i * 3] = Math.cos(a) * r
          pos[i * 3 + 1] = Math.sin(a) * r * 0.6 - 2
          pos[i * 3 + 2] = (Math.random() - 0.5) * 6
        }
        stiff[i] = 0.5 + Math.random() * 0.7
        seeds[i] = Math.random()
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
      geometry.setAttribute("aHeat", new THREE.BufferAttribute(heat, 1).setUsage(THREE.DynamicDrawUsage))
      previous?.geometry.dispose()
      points.current.geometry = geometry
      sim.current = { sample, pos, vel, heat, stiff, geometry, born: performance.now() }
      assembled.current = false
    }
    build()

    let lastWidth = window.innerWidth
    let timer = 0
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 40) return
      lastWidth = window.innerWidth
      window.clearTimeout(timer)
      timer = window.setTimeout(build, 250)
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelled = true
      window.removeEventListener("resize", onResize)
      window.clearTimeout(timer)
    }
  }, [])

  // Click shockwave / scatter → radial impulse from the pointer.
  useEffect(
    () =>
      onFx((event) => {
        const s = sim.current
        if (!s || (event !== "shock" && event !== "scatter" && event !== "burst")) return
        const unit = viewport.height / size.height
        const mx = fx.shock.x * (viewport.width / 2)
        const my = fx.shock.y * (viewport.height / 2) - window.scrollY * unit
        const global = event !== "shock"
        for (let i = 0; i < s.sample.count; i++) {
          const ix = i * 3
          const dx = s.pos[ix] - mx
          const dy = s.pos[ix + 1] - my
          const d = Math.hypot(dx, dy) + 0.0001
          const power = global ? 1 : fx.shockPower
          const force = global ? 0.25 + Math.random() * 0.35 : Math.max(0, 1.6 * power - d) * 0.55 * power
          if (force <= 0) continue
          s.vel[ix] += (dx / d) * force * (0.6 + Math.random())
          s.vel[ix + 1] += (dy / d) * force * (0.6 + Math.random()) + (global ? 0.1 : 0)
          s.vel[ix + 2] += (Math.random() - 0.5) * force * 1.6
          s.heat[i] = 1
        }
      }),
    [viewport.width, viewport.height, size.height],
  )

  useFrame((_, delta) => {
    const s = sim.current
    const m = material.current
    if (!s || !m || !points.current) return
    const dt = Math.min(delta, 1 / 30) * 60
    const unit = viewport.height / size.height
    const halfW = size.width / 2
    const halfH = size.height / 2
    const scrollWorld = window.scrollY * unit
    const exit = fx.heroExit
    m.uniforms.uTime.value += delta
    m.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    m.uniforms.uSize.value = size.width < 640 ? 2.4 : 3.8
    const targetFade = exit >= 1 ? 0 : 1 - exit * 0.85
    m.uniforms.uFade.value += (targetFade - m.uniforms.uFade.value) * 0.06

    // the group rides the page scroll so the name stays glued to the hero
    points.current.position.y = scrollWorld
    const lookX = fx.mouse.x * 0.12 + fx.tilt.x * 0.35
    const lookY = fx.mouse.y * 0.08 + fx.tilt.y * 0.25
    points.current.rotation.y += (lookX - points.current.rotation.y) * 0.05
    points.current.rotation.x += (-lookY - points.current.rotation.x) * 0.05

    if (exit >= 1 && m.uniforms.uFade.value < 0.01) return

    // pointer in the group's local space
    const mx = fx.mouse.x * (viewport.width / 2)
    const my = fx.mouse.y * (viewport.height / 2) - scrollWorld
    const pointerActive = fx.pointer.x > -1000
    const radius = 0.55
    const age = (performance.now() - s.born) / 1000
    const settle = Math.min(1, age / 1.2)
    const rise = exit * exit

    let moving = 0
    const { pos, vel, heat, stiff, sample } = s
    for (let i = 0; i < sample.count; i++) {
      const ix = i * 3
      const hx = (sample.home[i * 2] - halfW) * unit
      const hy = -(sample.home[i * 2 + 1] - halfH) * unit
      let px = pos[ix]
      let py = pos[ix + 1]
      let pz = pos[ix + 2]
      const k = 0.012 * stiff[i] * (0.35 + settle * 0.65) * (1 - rise * 0.9)

      let ax = (hx - px) * k
      let ay = (hy - py) * k
      let az = -pz * k

      if (pointerActive) {
        const dx = px - mx
        const dy = py - my
        const d2 = dx * dx + dy * dy
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) + 0.0001
          const f = (1 - d / radius) * 0.045
          ax += (dx / d) * f
          ay += (dy / d) * f
          az += f * 0.6
          heat[i] = Math.min(1, heat[i] + 0.08)
        }
      }
      // leaving the hero: embers lift and swirl away
      if (rise > 0) {
        ay += rise * (0.004 + stiff[i] * 0.006)
        ax += Math.sin(py * 2.1 + i) * rise * 0.002
      }

      vel[ix] = (vel[ix] + ax * dt) * 0.9
      vel[ix + 1] = (vel[ix + 1] + ay * dt) * 0.9
      vel[ix + 2] = (vel[ix + 2] + az * dt) * 0.9
      px += vel[ix] * dt
      py += vel[ix + 1] * dt
      pz += vel[ix + 2] * dt
      pos[ix] = px
      pos[ix + 1] = py
      pos[ix + 2] = pz
      heat[i] *= 0.965
      moving += Math.abs(vel[ix]) + Math.abs(vel[ix + 1])
    }
    s.geometry.attributes.position.needsUpdate = true
    s.geometry.attributes.aHeat.needsUpdate = true

    // once the cloud has formed the name, hand over from the DOM heading
    if (!assembled.current && age > 1.4 && moving / sample.count < 0.004) {
      assembled.current = true
      document.documentElement.dataset.particles = ""
    }
  })

  // Off-hero DOM fallback keeps the real heading visible if we unmount.
  useEffect(
    () => () => {
      delete document.documentElement.dataset.particles
    },
    [],
  )

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Deterministic PRNG (mulberry32) so geometry building stays pure. */
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildSparks(count: number) {
  const rand = prng(20260611)
  const g = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 16
    pos[i * 3 + 1] = rand() * 10
    pos[i * 3 + 2] = -1 - rand() * 5
    seed[i] = rand()
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
  return g
}

/**
 * Ambient sparks drifting up through the whole page — stateless, fully
 * animated in the vertex shader.
 */
export function Sparks({ count = 420 }: { count?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const geometry = useMemo(() => buildSparks(count), [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uBurst: { value: 0 } }), [])

  useFrame((_, delta) => {
    const m = material.current
    if (!m) return
    m.uniforms.uTime.value += fx.live ? delta * (1 + Math.min(4, Math.abs(fx.velocity) * 0.08)) : 0
    m.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    m.uniforms.uBurst.value = Math.max(0, 1 - (performance.now() - fx.burstAt) / 2600)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uBurst;
          varying float vA;
          void main() {
            vec3 p = position;
            float speed = 0.12 + aSeed * 0.35 + uBurst * 1.5;
            p.y = mod(p.y + uTime * speed, 10.0) - 5.0;
            p.x += sin(uTime * (0.4 + aSeed) + aSeed * 30.0) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.5 + aSeed * 3.5) * uPixelRatio * (1.0 + uBurst);
            float edge = smoothstep(-5.0, -3.5, p.y) * smoothstep(5.0, 3.0, p.y);
            vA = edge * (0.25 + 0.55 * aSeed) * (0.6 + 0.4 * sin(uTime * 3.0 + aSeed * 50.0)) + uBurst * 0.4;
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float c = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vec3(1.0, 0.55, 0.2) * 1.4, c * c * vA);
          }
        `}
      />
    </points>
  )
}
