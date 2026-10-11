"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { fx } from "./store"

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/* Domain-warped fbm plasma: deep navy night with drifting ember veins.
   uHeat blends between cold (navy/frost) and hot (amber/coral) grading. */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uHeat;
  uniform float uBurst;
  uniform float uShock;
  uniform vec2 uShockAt;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 m = uMouse * 0.5 * vec2(aspect, 1.0);

    float t = uTime * 0.045;
    // cursor gently bends the field (screen space)
    float md = length(p - m);
    p += (p - m) * 0.08 * exp(-md * 2.5);
    // scroll drifts the field upward like rising heat
    p.y -= uScroll * 2.2;

    vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p * 1.4 + 3.0 * q + vec2(1.7, 9.2) + t * 1.3),
                  fbm(p * 1.4 + 3.0 * q + vec2(8.3, 2.8) - t * 0.9));
    float f = fbm(p * 1.2 + 3.5 * r);

    // ember veins: thin bright ridges in the warped field
    float veins = pow(smoothstep(0.55, 0.95, f + 0.25 * length(r)), 2.4);
    veins *= 0.55 + 0.45 * sin(uTime * 0.6 + f * 9.0);

    vec3 night = vec3(0.022, 0.035, 0.085);
    vec3 deep  = vec3(0.05, 0.085, 0.2);
    vec3 frost = vec3(0.16, 0.42, 0.62);
    vec3 amber = vec3(1.0, 0.72, 0.28);
    vec3 ember = vec3(1.0, 0.42, 0.1);
    vec3 coral = vec3(0.95, 0.22, 0.16);

    vec3 col = mix(night, deep, smoothstep(0.2, 0.8, f));
    col += frost * 0.12 * smoothstep(0.55, 0.9, q.y) * (1.0 - uHeat * 0.6);
    vec3 hot = mix(coral, mix(ember, amber, smoothstep(0.6, 1.0, f)), smoothstep(0.3, 0.9, veins));
    col += hot * veins * (0.3 + 0.5 * uHeat);

    // cursor warmth
    col += ember * 0.12 * exp(-md * 3.2) * (0.6 + 0.4 * uHeat);

    // global burst: ember storm floods the screen, then recedes
    col += mix(ember, amber, f) * uBurst * (0.35 + veins * 1.6);

    // click shockwave ring
    float sd = length((uv - 0.5) * vec2(aspect, 1.0) - uShockAt * 0.5 * vec2(aspect, 1.0));
    float ring = uShock * smoothstep(0.06, 0.0, abs(sd - (1.0 - uShock) * 1.2));
    col += amber * ring * 0.5;

    // soft highlight roll-off keeps flames rich but never blown out behind text
    col = col / (1.0 + max(col.r, max(col.g, col.b)) * 0.55);

    // vignette
    float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
    col *= 0.45 + 0.55 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`

export function EmberField() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const target = useRef(new THREE.Vector2())
  const size = useThree((state) => state.size)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uHeat: { value: fx.heat },
      uBurst: { value: 0 },
      uShock: { value: 0 },
      uShockAt: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  )

  useFrame((_, delta) => {
    if (!material.current) return
    const u = material.current.uniforms
    const now = performance.now()
    u.uTime.value += fx.live ? Math.min(delta, 0.05) : 0
    u.uRes.value.set(size.width, size.height)
    u.uMouse.value.lerp(target.current.set(fx.mouse.x, fx.mouse.y), 0.06)
    u.uScroll.value += (fx.scroll - u.uScroll.value) * 0.08
    u.uHeat.value += (fx.heat - u.uHeat.value) * 0.03
    u.uBurst.value = Math.max(0, 1 - (now - fx.burstAt) / 2600)
    u.uShock.value = Math.max(0, 1 - (now - fx.shockAt) / 1100)
    u.uShockAt.value.set(fx.shock.x, fx.shock.y)
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
