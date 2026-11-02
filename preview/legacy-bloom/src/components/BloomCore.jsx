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
 *
 * Reskinned to match Danny's desert-poppy reference photo (color/glow
 * only — still 9 procedurally-drawn petals, no video asset, no change
 * to the breathing math): pale-gold-to-rust petal gradient, rim-light
 * glow, rust vein line per petal, amber backlight haze, a ring of
 * golden stamen filaments, and an olive-brown seed-pod core.
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

      // Desert-poppy backlight: soft amber haze behind the whole bloom,
      // standing in for the sunlit glow in the reference photo.
      const haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 2.6)
      haze.addColorStop(0, 'rgba(255, 176, 85, 0.35)')
      haze.addColorStop(0.5, 'rgba(255, 140, 50, 0.12)')
      haze.addColorStop(1, 'rgba(255, 140, 50, 0)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, width, height)

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

        // Poppy petal: pale-gold at the rim fading to burnt rust at the
        // base, with a warm rim-light glow — matches the backlit petal
        // veining in the reference photo instead of the old flat fill.
        const petalGradient = ctx.createRadialGradient(
          0, 0, 0,
          0, 0, petalLen * 0.5
        )
        petalGradient.addColorStop(0, '#FFE1A0')
        petalGradient.addColorStop(0.45, '#FFA940')
        petalGradient.addColorStop(1, '#C1501E')

        ctx.shadowColor = 'rgba(255, 150, 60, 0.65)'
        ctx.shadowBlur = baseRadius * 0.18
        ctx.fillStyle = petalGradient
        ctx.beginPath()
        ctx.ellipse(0, 0, petalLen * 0.5, petalWidth * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Faint rust vein line down the petal's spine, echoing the
        // reference photo's radiating petal veins.
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(140, 60, 20, 0.45)'
        ctx.lineWidth = Math.max(1, petalWidth * 0.04)
        ctx.beginPath()
        ctx.moveTo(-petalLen * 0.45, 0)
        ctx.lineTo(petalLen * 0.45, 0)
        ctx.stroke()

        ctx.restore()
      }

      ctx.globalAlpha = 1

      // Stamens: thin golden-orange filaments fanning out from the pod,
      // standing in for the dense stamen ring in the reference photo.
      const stamenCount = 16
      ctx.strokeStyle = 'rgba(255, 190, 90, 0.8)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < stamenCount; i++) {
        const a = (i / stamenCount) * Math.PI * 2 + t * 0.05
        const r1 = baseRadius * 0.16
        const r2 = baseRadius * 0.27
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
        ctx.stroke()
      }

      // Seed-pod core: olive-brown, like the poppy's center disc.
      ctx.fillStyle = '#4A3B22'
      ctx.beginPath()
      ctx.arc(cx, cy, baseRadius * 0.15, 0, Math.PI * 2)
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
