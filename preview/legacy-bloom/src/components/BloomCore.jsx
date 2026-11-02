import { useRef, useEffect } from 'react'

/**
 * BloomCore — the flower door.
 *
 * Step 1 (NEXT-BUILD-SEQUENCE.md): a procedural <canvas> bloom, zero
 * video/image asset. Each petal breathes on three layered sine waves
 * at incommensurate frequencies, so the motion drifts and never
 * exactly repeats the way a flat looped clip does.
 *
 * Changed for Step 2: this no longer gates anything by itself. The
 * tug-to-advance drag I used as a placeholder in Step 1 is retired —
 * now that CompanionSelect exists, tapping a companion card is the
 * real way to advance (per UI-SPEC-GATE-COMPANION-FORK.md). The
 * flower's only job now is to breathe, continuously, while the picker
 * sits beneath it (NEXT-BUILD-SEQUENCE.md Step 2: "directly beneath
 * the bloom").
 */
export default function BloomCore({ reduceMotion = false }) {
  const canvasRef = useRef(null)

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
    let rafId

    const render = (now) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height * 0.4
      const baseRadius = Math.min(width, height) * 0.2

      ctx.strokeStyle = '#3a2a1d'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx, height)
      ctx.quadraticCurveTo(cx, cy + baseRadius + 40, cx, cy + baseRadius * 0.3)
      ctx.stroke()

      for (let i = 0; i < petalCount; i++) {
        const phase = phases[i]
        const breathe =
          Math.sin(t * 0.55 + phase) * 0.07 +
          Math.sin(t * 0.337 + phase * 1.8) * 0.05 +
          Math.sin(t * 0.91 + phase * 0.6) * 0.03
        const sway = Math.sin(t * 0.12 + phase) * 0.15 // slow rotational drift

        const angle = (i / petalCount) * Math.PI * 2 + sway
        const petalLen = baseRadius * (0.95 + breathe)
        const petalWidth = baseRadius * (0.34 + breathe * 0.5)

        const px = cx + Math.cos(angle) * petalLen * 0.55
        const py = cy + Math.sin(angle) * petalLen * 0.55

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(angle)
        ctx.globalAlpha = Math.max(0, 0.78 + breathe * 0.6)
        ctx.fillStyle = '#F0B35E'
        ctx.beginPath()
        ctx.ellipse(0, 0, petalLen * 0.5, petalWidth * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.globalAlpha = 1
      ctx.fillStyle = '#1F2A38'
      ctx.beginPath()
      ctx.arc(cx, cy, baseRadius * 0.22, 0, Math.PI * 2)
      ctx.fill()

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [reduceMotion])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
