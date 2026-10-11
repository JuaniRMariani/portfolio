/**
 * Skills Breakout — dependency-free canvas engine.
 * Bricks are the real skill labels; React only mounts/unmounts it and
 * renders the end screens. DPR-aware, resize-safe, rAF-driven.
 */

export interface BrickSpec {
  label: string
  /** Hex color, e.g. "#ff7a29". */
  color: string
}

export interface BreakoutText {
  launch: string
  paused: string
  score: string
  lives: string
  combo: string
}

export interface BreakoutResult {
  won: boolean
  score: number
  maxCombo: number
}

export interface BreakoutOptions {
  canvas: HTMLCanvasElement
  bricks: BrickSpec[]
  text: BreakoutText
  /** Drop trails, particles and shake (prefers-reduced-motion). */
  reducedMotion: boolean
  onEnd: (result: BreakoutResult) => void
  /** Fired the first time the player uses keys that would scroll the page. */
  onKeyboard?: () => void
}

interface Brick extends BrickSpec {
  x: number
  y: number
  w: number
  h: number
  alive: boolean
  spawn: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
}

interface Popup {
  x: number
  y: number
  text: string
  life: number
  color: string
}

const LIVES = 3
const EMBER = "#ff7a29"
const AMBER = "#f8b82e"
const CORAL = "#f2483a"
const CREAM = "#f6efe6"

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function cssFont(el: Element, variable: string, fallback: string) {
  const value = getComputedStyle(el).getPropertyValue(variable).trim()
  return value ? `${value}, ${fallback}` : fallback
}

export class BreakoutGame {
  private ctx: CanvasRenderingContext2D
  private opts: BreakoutOptions
  private mono: string
  private display: string
  private w = 0
  private h = 0
  private dpr = 1
  private grid: HTMLCanvasElement | null = null

  private bricks: Brick[] = []
  private paddle = { x: 0, y: 0, w: 110, h: 10, target: 0, flash: 0 }
  private ball = { x: 0, y: 0, vx: 0, vy: 0, r: 6, stuck: true, speed: 420 }
  private trail: { x: number; y: number }[] = []
  private particles: Particle[] = []
  private popups: Popup[] = []

  private score = 0
  private lives = LIVES
  private combo = 0
  private maxCombo = 0
  private broken = 0
  private shake = 0
  private time = 0
  private paused = false
  private over: "won" | "lost" | null = null
  private keys = { left: false, right: false }
  private keyboardNotified = false
  private touch: { id: number; startX: number; paddleX: number } | null = null

  private raf = 0
  private last = 0
  private observer: ResizeObserver

  constructor(opts: BreakoutOptions) {
    const ctx = opts.canvas.getContext("2d")
    if (!ctx) throw new Error("2D canvas unavailable")
    this.ctx = ctx
    this.opts = opts
    this.mono = cssFont(opts.canvas, "--font-commit", "ui-monospace, monospace")
    this.display = cssFont(opts.canvas, "--font-bricolage", "ui-sans-serif, sans-serif")
    this.bricks = opts.bricks.map((spec, i) => ({ ...spec, x: 0, y: 0, w: 0, h: 0, alive: true, spawn: i * 0.035 }))

    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(opts.canvas)
    this.resize()
    this.resetBall()

    opts.canvas.addEventListener("pointerdown", this.onPointerDown)
    window.addEventListener("pointermove", this.onPointerMove, { passive: true })
    window.addEventListener("pointerup", this.onPointerUp)
    window.addEventListener("pointercancel", this.onPointerUp)
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("blur", this.pause)
    document.addEventListener("visibilitychange", this.onVisibility)

    this.last = performance.now()
    this.raf = requestAnimationFrame(this.loop)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.observer.disconnect()
    this.opts.canvas.removeEventListener("pointerdown", this.onPointerDown)
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerup", this.onPointerUp)
    window.removeEventListener("pointercancel", this.onPointerUp)
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("blur", this.pause)
    document.removeEventListener("visibilitychange", this.onVisibility)
  }

  /* ─── layout ─── */

  private resize() {
    const rect = this.opts.canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    if (w === this.w && h === this.h) return
    const sx = this.w ? w / this.w : 1
    const sy = this.h ? h / this.h : 1
    this.w = w
    this.h = h
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.opts.canvas.width = Math.round(w * this.dpr)
    this.opts.canvas.height = Math.round(h * this.dpr)

    const small = w < 520
    this.paddle.w = clamp(w * 0.2, 76, 130)
    this.paddle.h = small ? 9 : 10
    this.paddle.y = h - (small ? 34 : 42)
    this.paddle.x = clamp(this.paddle.x * sx || w / 2, this.paddle.w / 2, w - this.paddle.w / 2)
    this.paddle.target = this.paddle.x
    this.ball.r = small ? 5 : 6
    this.ball.speed = clamp(h * 0.78, 330, 560)
    this.ball.x *= sx
    this.ball.y *= sy
    this.trail = []

    this.layoutBricks()
    this.buildGrid()
  }

  private brickFont() {
    return `600 ${this.w < 520 ? 10 : 12}px ${this.mono}`
  }

  private layoutBricks() {
    const ctx = this.ctx
    const small = this.w < 520
    const margin = small ? 10 : 24
    const gap = small ? 5 : 7
    const pad = small ? 9 : 14
    const bh = small ? 22 : 28
    const top = small ? 46 : 58
    const maxW = this.w - margin * 2
    ctx.font = this.brickFont()

    const rows: Brick[][] = [[]]
    let rowW = 0
    for (const brick of this.bricks) {
      brick.w = Math.min(maxW, Math.ceil(ctx.measureText(brick.label).width) + pad * 2)
      brick.h = bh
      const row = rows[rows.length - 1]
      const needed = (row.length ? gap : 0) + brick.w
      if (row.length && rowW + needed > maxW) {
        rows.push([brick])
        rowW = brick.w
      } else {
        row.push(brick)
        rowW += needed
      }
    }
    rows.forEach((row, r) => {
      const total = row.reduce((sum, b) => sum + b.w, 0) + gap * (row.length - 1)
      // stretch rows to the full width so the wall reads as a wall
      const extra = row.length > 1 && r < rows.length - 1 ? (maxW - total) / row.length : 0
      let x = margin + (extra ? 0 : (maxW - total) / 2)
      for (const brick of row) {
        brick.w += extra
        brick.x = x
        brick.y = top + r * (bh + gap)
        x += brick.w + gap
      }
    })
  }

  private buildGrid() {
    const grid = document.createElement("canvas")
    grid.width = this.opts.canvas.width
    grid.height = this.opts.canvas.height
    const g = grid.getContext("2d")
    if (!g) return
    g.scale(this.dpr, this.dpr)
    g.strokeStyle = "rgba(120, 150, 230, 0.07)"
    g.lineWidth = 1
    const step = 32
    g.beginPath()
    for (let x = 0.5; x < this.w; x += step) {
      g.moveTo(x, 0)
      g.lineTo(x, this.h)
    }
    for (let y = 0.5; y < this.h; y += step) {
      g.moveTo(0, y)
      g.lineTo(this.w, y)
    }
    g.stroke()
    // danger line under the paddle
    g.setLineDash([4, 6])
    g.strokeStyle = "rgba(242, 72, 58, 0.35)"
    g.beginPath()
    g.moveTo(0, this.h - 10.5)
    g.lineTo(this.w, this.h - 10.5)
    g.stroke()
    this.grid = grid
  }

  /* ─── input ─── */

  private localX(clientX: number) {
    return clientX - this.opts.canvas.getBoundingClientRect().left
  }

  private onPointerDown = (event: PointerEvent) => {
    if (this.over) return
    if (this.paused) {
      this.paused = false
      return
    }
    if (event.pointerType === "mouse") {
      this.paddle.target = this.localX(event.clientX)
    } else {
      this.touch = { id: event.pointerId, startX: event.clientX, paddleX: this.paddle.x }
    }
    this.launch()
  }

  private onPointerMove = (event: PointerEvent) => {
    if (this.over || this.paused) return
    if (event.pointerType === "mouse") {
      const rect = this.opts.canvas.getBoundingClientRect()
      if (event.clientY < rect.top - 80 || event.clientY > rect.bottom + 80) return
      this.paddle.target = event.clientX - rect.left
    } else if (this.touch && event.pointerId === this.touch.id) {
      // relative drag so the finger never hides the paddle
      this.paddle.target = this.touch.paddleX + (event.clientX - this.touch.startX) * 1.25
    }
  }

  private onPointerUp = (event: PointerEvent) => {
    if (this.touch && event.pointerId === this.touch.id) this.touch = null
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    const interactive = !!target?.closest("button, a, input, textarea, select")
    const key = event.key
    if (key === "ArrowLeft" || key === "a" || key === "A") this.keys.left = true
    else if (key === "ArrowRight" || key === "d" || key === "D") this.keys.right = true
    else if (key === "p" || key === "P") this.paused = !this.paused
    else if ((key === " " || key === "ArrowUp") && !interactive) {
      if (this.paused) this.paused = false
      else this.launch()
    } else return

    if (key.startsWith("Arrow") || (key === " " && !interactive)) {
      event.preventDefault()
      if (!this.keyboardNotified) {
        this.keyboardNotified = true
        this.opts.onKeyboard?.()
      }
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key
    if (key === "ArrowLeft" || key === "a" || key === "A") this.keys.left = false
    if (key === "ArrowRight" || key === "d" || key === "D") this.keys.right = false
  }

  private pause = () => {
    if (!this.over) this.paused = true
    this.keys.left = this.keys.right = false
  }

  private onVisibility = () => {
    if (document.hidden) this.pause()
  }

  /* ─── game logic ─── */

  private resetBall() {
    this.ball.stuck = true
    this.ball.vx = 0
    this.ball.vy = 0
    this.trail = []
  }

  private launch() {
    if (!this.ball.stuck || this.over) return
    const angle = (Math.random() - 0.5) * 0.7
    this.ball.stuck = false
    this.ball.vx = Math.sin(angle) * this.ball.speed
    this.ball.vy = -Math.cos(angle) * this.ball.speed
  }

  private currentSpeed() {
    return this.ball.speed * (1 + Math.min(0.45, this.broken * 0.018))
  }

  private loop = (now: number) => {
    const dt = Math.min(1 / 30, (now - this.last) / 1000)
    this.last = now
    if (!this.paused) this.update(dt)
    this.draw()
    this.raf = requestAnimationFrame(this.loop)
  }

  private update(dt: number) {
    this.time += dt
    const { paddle, ball } = this

    // paddle
    const keyDir = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0)
    if (keyDir) paddle.target += keyDir * Math.max(620, this.w * 1.2) * dt
    paddle.target = clamp(paddle.target, paddle.w / 2, this.w - paddle.w / 2)
    paddle.x += (paddle.target - paddle.x) * Math.min(1, dt * 22)
    paddle.flash = Math.max(0, paddle.flash - dt * 3)

    if (!this.over) {
      if (ball.stuck) {
        ball.x = paddle.x
        ball.y = paddle.y - ball.r - 2
      } else {
        const dist = Math.hypot(ball.vx, ball.vy) * dt
        const steps = Math.max(1, Math.ceil(dist / (ball.r * 0.75)))
        for (let i = 0; i < steps && !ball.stuck && !this.over; i++) this.step(dt / steps)
        if (!this.opts.reducedMotion) {
          this.trail.push({ x: ball.x, y: ball.y })
          if (this.trail.length > 14) this.trail.shift()
        }
      }
    } else if (this.over === "won" && !this.opts.reducedMotion && Math.random() < dt * 5) {
      this.spark(Math.random() * this.w, Math.random() * this.h * 0.6, [AMBER, EMBER, CORAL][(Math.random() * 3) | 0], 26, 1.6)
    }

    // particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= dt
      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }
      p.vy += 520 * dt
      p.vx *= 0.985
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i]
      pop.life -= dt
      pop.y -= 34 * dt
      if (pop.life <= 0) this.popups.splice(i, 1)
    }
    this.shake = Math.max(0, this.shake - dt * 18)
  }

  private step(dt: number) {
    const { ball, paddle } = this
    ball.x += ball.vx * dt
    ball.y += ball.vy * dt

    // walls
    if (ball.x < ball.r) {
      ball.x = ball.r
      ball.vx = Math.abs(ball.vx)
    } else if (ball.x > this.w - ball.r) {
      ball.x = this.w - ball.r
      ball.vx = -Math.abs(ball.vx)
    }
    if (ball.y < ball.r) {
      ball.y = ball.r
      ball.vy = Math.abs(ball.vy)
    }

    // paddle
    const halfW = paddle.w / 2
    if (
      ball.vy > 0 &&
      ball.y + ball.r >= paddle.y &&
      ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= paddle.x - halfW - ball.r &&
      ball.x <= paddle.x + halfW + ball.r
    ) {
      const hit = clamp((ball.x - paddle.x) / halfW, -1, 1)
      const angle = hit * 1.05
      const speed = this.currentSpeed()
      ball.vx = Math.sin(angle) * speed
      ball.vy = -Math.cos(angle) * speed
      ball.y = paddle.y - ball.r
      paddle.flash = 1
      this.combo = 0
    }

    // bottom → lose a life
    if (ball.y - ball.r > this.h) {
      this.lives -= 1
      this.combo = 0
      this.shake = this.opts.reducedMotion ? 0 : 6
      if (this.lives <= 0) this.finish("lost")
      else this.resetBall()
      return
    }

    // bricks (one per sub-step keeps the response predictable)
    for (const brick of this.bricks) {
      if (!brick.alive) continue
      const nx = clamp(ball.x, brick.x, brick.x + brick.w)
      const ny = clamp(ball.y, brick.y, brick.y + brick.h)
      const dx = ball.x - nx
      const dy = ball.y - ny
      if (dx * dx + dy * dy > ball.r * ball.r) continue

      const overlapX = ball.r + brick.w / 2 - Math.abs(ball.x - (brick.x + brick.w / 2))
      const overlapY = ball.r + brick.h / 2 - Math.abs(ball.y - (brick.y + brick.h / 2))
      if (overlapX < overlapY) {
        ball.vx = ball.x < brick.x + brick.w / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx)
      } else {
        ball.vy = ball.y < brick.y + brick.h / 2 ? -Math.abs(ball.vy) : Math.abs(ball.vy)
      }
      this.breakBrick(brick)
      break
    }
  }

  private breakBrick(brick: Brick) {
    brick.alive = false
    this.broken += 1
    this.combo += 1
    this.maxCombo = Math.max(this.maxCombo, this.combo)
    this.score += 10 * this.combo
    const cx = brick.x + brick.w / 2
    const cy = brick.y + brick.h / 2
    if (!this.opts.reducedMotion) {
      this.spark(cx, cy, brick.color, 16, 1)
      this.shake = Math.min(5, 1.5 + this.combo * 0.5)
    }
    if (this.combo > 1) {
      this.popups.push({ x: cx, y: cy, text: `×${this.combo}`, life: 0.9, color: brick.color })
    }
    // keep the rally speed in sync with progress
    const speed = this.currentSpeed()
    const len = Math.hypot(this.ball.vx, this.ball.vy) || 1
    this.ball.vx = (this.ball.vx / len) * speed
    this.ball.vy = (this.ball.vy / len) * speed
    if (this.broken === this.bricks.length) this.finish("won")
  }

  private spark(x: number, y: number, color: string, count: number, power: number) {
    for (let i = 0; i < count && this.particles.length < 500; i++) {
      const a = Math.random() * Math.PI * 2
      const v = (60 + Math.random() * 260) * power
      const max = 0.4 + Math.random() * 0.6
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 80,
        life: max,
        max,
        size: 1 + Math.random() * 2.2,
        color: Math.random() < 0.25 ? CREAM : color,
      })
    }
  }

  private finish(result: "won" | "lost") {
    this.over = result
    this.ball.stuck = true
    this.trail = []
    this.opts.onEnd({ won: result === "won", score: this.score + (result === "won" ? this.lives * 100 : 0), maxCombo: this.maxCombo })
  }

  /* ─── render ─── */

  private draw() {
    const { ctx, w, h } = this
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    if (this.grid) ctx.drawImage(this.grid, 0, 0, w, h)

    ctx.save()
    if (this.shake > 0) ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake)

    this.drawBricks()
    this.drawPaddle()
    if (!this.over) this.drawBall()
    this.drawParticles()
    this.drawPopups()
    ctx.restore()

    this.drawHud()
    if (!this.over && this.ball.stuck && !this.paused) this.drawCenterText(this.opts.text.launch, 0.55 + 0.45 * Math.sin(this.time * 4))
    if (this.paused) {
      ctx.fillStyle = "rgba(8, 12, 32, 0.6)"
      ctx.fillRect(0, 0, w, h)
      this.drawCenterText(this.opts.text.paused, 1)
    }
  }

  private drawBricks() {
    const ctx = this.ctx
    ctx.font = this.brickFont()
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (const b of this.bricks) {
      if (!b.alive) continue
      // drop-in intro
      const t = this.opts.reducedMotion ? 1 : clamp((this.time - b.spawn) / 0.5, 0, 1)
      if (t <= 0) continue
      const ease = 1 - Math.pow(1 - t, 3)
      const y = b.y - (1 - ease) * 40
      ctx.globalAlpha = ease
      roundRect(ctx, b.x, y, b.w, b.h, 4)
      ctx.fillStyle = b.color + "24"
      ctx.fill()
      ctx.strokeStyle = b.color + "cc"
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = b.color + "55"
      ctx.fillRect(b.x + 4, y + 1, b.w - 8, 1)
      ctx.fillStyle = b.color
      ctx.fillText(b.label, b.x + b.w / 2, y + b.h / 2 + 0.5)
    }
    ctx.globalAlpha = 1
  }

  private drawPaddle() {
    const { ctx, paddle } = this
    const x = paddle.x - paddle.w / 2
    const grad = ctx.createLinearGradient(x, 0, x + paddle.w, 0)
    grad.addColorStop(0, AMBER)
    grad.addColorStop(0.5, EMBER)
    grad.addColorStop(1, CORAL)
    ctx.save()
    ctx.shadowColor = EMBER
    ctx.shadowBlur = 14 + paddle.flash * 22
    roundRect(ctx, x, paddle.y, paddle.w, paddle.h, paddle.h / 2)
    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()
    // CAD tick marks
    ctx.fillStyle = "rgba(246, 239, 230, 0.35)"
    ctx.fillRect(paddle.x - 0.5, paddle.y + paddle.h + 4, 1, 5)
  }

  private drawBall() {
    const { ctx, ball } = this
    ctx.save()
    ctx.globalCompositeOperation = "lighter"
    this.trail.forEach((p, i) => {
      const k = (i + 1) / this.trail.length
      ctx.globalAlpha = k * 0.35
      ctx.fillStyle = i > this.trail.length * 0.6 ? AMBER : EMBER
      ctx.beginPath()
      ctx.arc(p.x, p.y, ball.r * (0.35 + k * 0.75), 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    const glow = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.r * 4.5)
    glow.addColorStop(0, "rgba(255, 170, 80, 0.55)")
    glow.addColorStop(1, "rgba(255, 122, 41, 0)")
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r * 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = "#fff6e8"
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawParticles() {
    if (!this.particles.length) return
    const ctx = this.ctx
    ctx.save()
    ctx.globalCompositeOperation = "lighter"
    for (const p of this.particles) {
      ctx.globalAlpha = clamp(p.life / p.max, 0, 1)
      ctx.fillStyle = p.color
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
    }
    ctx.restore()
  }

  private drawPopups() {
    const ctx = this.ctx
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = `800 ${this.w < 520 ? 16 : 20}px ${this.display}`
    for (const pop of this.popups) {
      ctx.globalAlpha = clamp(pop.life / 0.9, 0, 1)
      ctx.fillStyle = pop.color
      ctx.fillText(pop.text, pop.x, pop.y)
    }
    ctx.globalAlpha = 1
  }

  private drawHud() {
    const { ctx, w } = this
    const small = w < 520
    const y = small ? 22 : 28
    const pad = small ? 10 : 24
    ctx.font = `500 ${small ? 10 : 11}px ${this.mono}`
    ctx.textBaseline = "middle"
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px"

    ctx.textAlign = "left"
    ctx.fillStyle = "rgba(190, 200, 225, 0.75)"
    ctx.fillText(`${this.opts.text.score} `, pad, y)
    const labelW = ctx.measureText(`${this.opts.text.score} `).width
    ctx.fillStyle = AMBER
    ctx.fillText(String(this.score).padStart(5, "0"), pad + labelW, y)

    ctx.textAlign = "right"
    const dots = "●".repeat(Math.max(0, this.lives)) + "○".repeat(Math.max(0, LIVES - this.lives))
    ctx.fillStyle = CORAL
    ctx.fillText(dots, w - pad, y)
    const dotsW = ctx.measureText(dots).width
    ctx.fillStyle = "rgba(190, 200, 225, 0.75)"
    ctx.fillText(`${this.opts.text.lives} `, w - pad - dotsW, y)

    if (this.combo > 1) {
      ctx.textAlign = "center"
      ctx.fillStyle = EMBER
      ctx.fillText(`${this.opts.text.combo} ×${this.combo}`, w / 2, y)
    }
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"
  }

  private drawCenterText(text: string, alpha: number) {
    const { ctx, w, h } = this
    ctx.globalAlpha = alpha
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = `500 ${w < 520 ? 10 : 12}px ${this.mono}`
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "3px"
    ctx.fillStyle = CREAM
    ctx.fillText(text.toUpperCase(), w / 2, h * 0.68)
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"
    ctx.globalAlpha = 1
  }
}
