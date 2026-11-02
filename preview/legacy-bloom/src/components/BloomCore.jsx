import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * BloomCore — the flower door.
 *
 * Step 1 of NEXT-BUILD-SEQUENCE.md: "Lock the procedural flower asset
 * (generative canvas bloom, zero flat MP4 loops)."
 *
 * This is a <canvas> drawing every frame from math, not a video file
 * and not a static SVG path with one CSS transition. Each petal
 * breathes on three layered sine waves at incommensurate frequencies,
 * so the motion drifts and never exactly repeats the way an 8-second
 * looped clip does — per Danny's own words: "the flower must breathe
 * and vary, never a flat 8-second loop."
 *
 * The tug-to-advance gesture stays, for now, as the only way to move
 * past this screen. Per RUNTIME-SPEC-v1.md the real next step
 * (Step 2) is a binary Gus/June card pair rendered directly beneath
 * the breathing bloom — at that point this screen stops gating
 * progress by itself and just breathes while the picker underneath
 * does the advancing. Not built yet; flagged, not faked.
 */

const TENSION_THRESHOLD = 70 // px of pull before release commits
const MAX_PULL = 110 // px — pull stops tracking the pointer past this

export default function BloomCore({ onBloom, reduceMotion = false }) {
  const canvasRef = useRef(null)
  const dragStart = useRef(null)
  const pullRef = useRef({ x: 0, y: 0 })
  const releaseRef = useRef(null) // { startedAt } once threshold is crossed
  const rafRef = useRef(null)

  const [dragging, setDragging] = useState(false)
  const [released, setReleased] = useState(false)

  const handlePointerDown = useCallback((e) => {
    if (released) return
    dragStart.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }, [released])

  const handlePointerMove = useCallback((e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamped = Math.min(dist, MAX_PULL)
    const scale = dist === 0 ? 0 : clamped / dist
    pullRef.current = { x: dx * scale, y: dy * scale }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!dragStart.current) return
    setDragging(false)
    dragStart.current = null
    const { x, y } = pullRef.current
    const dist = Math.sqrt(x * x + y * y)
    if (dist >= TENSION_THRESHOLD) {
      setReleased(true)
      releaseRef.current = { startedAt: performance.now() }
      const duration = reduceMotion ? 0 : 2000
      window.setTimeout(() => onBloom?.(), duration)
    } else {
      pullRef.current = { x: 0, y: 0 }
    }
  }, [onBloom, reduceMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const petalCount = 9
    // Golden-angle-ish spacing per petal — an irrational-feeling offset
    // so no two petals' breathing cycles ever line up the same way twice.
    const phases = Array.from({ length: petalCount }, (_, i) => i * 1.3179)

    const start = performance.now()
    const easeOut = (p) => 1 - Math.pow(1 - p, 3)

    const render = (now) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height * 0.42
      const baseRadius = Math.min(width, height) * 0.22

      const pull = pullRef.current
      const pullDist = Math.sqrt(pull.x * pull.x + pull.y * pull.y)
      const tension = Math.min(1, pullDist / MAX_PULL)

      let bloomProgress = 0
      if (releaseRef.current) {
        const elapsed = now - releaseRef.current.startedAt
        bloomProgress = reduceMotion ? 1 : Math.min(1, elapsed / 2000)
      }
      const growth = easeOut(bloomProgress)

      // stem — bends toward the pull while dragging, straightens on release
      ctx.strokeStyle = '#3a2a1d'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx, height)
      ctx.quadraticCurveTo(
        cx + pull.x * 0.4,
        cy + baseRadius + 40 + pull.y * 0.4,
        cx,
        cy + baseRadius * 0.3
      )
      ctx.stroke()

      const radius = baseRadius * (1 + growth * 0.6 + tension * 0.1)

      for (let i = 0; i < petalCount; i++) {
        const phase = phases[i]
        const breathe =
          Math.sin(t * 0.55 + phase) * 0.07 +
          Math.sin(t * 0.337 + phase * 1.8) * 0.05 +
          Math.sin(t * 0.91 + phase * 0.6) * 0.03
        const sway = Math.sin(t * 0.12 + phase) * 0.15 // slow rotational drift

        const angle = (i / petalCount) * Math.PI * 2 + sway + pull.x * 0.002
        const petalLen = radius * (0.95 + breathe + growth * 0.4)
        const petalWidth = radius * (0.34 + breathe * 0.5)

        const px = cx + Math.cos(angle) * petalLen * 0.55
        const py = cy + Math.sin(angle) * petalLen * 0.55

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(angle)
        ctx.globalAlpha = Math.max(0, 0.78 + breathe * 0.6 + growth * 0.15)
        ctx.fillStyle = '#F0B35E'
        ctx.beginPath()
        ctx.ellipse(0, 0, petalLen * 0.5, petalWidth * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.globalAlpha = 1
      ctx.fillStyle = '#1F2A38'
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.22, 0, Math.PI * 2)
      ctx.fill()

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [reduceMotion])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: released ? 'default' : dragging ? 'grabbing' : 'grab',
        }}
      />
      {!released && (
        <p
          style={{
            position: 'absolute',
            bottom: '8%',
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: '#F0B35E',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            opacity: 0.6,
            letterSpacing: '0.04em',
            pointerEvents: 'none',
          }}
        >
          tug toward you — it breathes on its own either way
        </p>
      )}
    </div>
  )
}
