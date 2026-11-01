import { useRef, useState, useCallback } from 'react'

/**
 * BloomCore — the flower door.
 * A tuggable leaf (SVG, pointer-tracked, spring-back) that triggers a
 * 2.0s bloom expansion when pulled past a tension threshold and released.
 * No physics library — just a clamped drag offset + CSS/SVG transforms.
 */

const TENSION_THRESHOLD = 70 // px of pull before release triggers bloom
const MAX_PULL = 110 // px — leaf stops following the pointer past this

export default function BloomCore({ onBloom, reduceMotion = false }) {
  const leafRef = useRef(null)
  const dragStart = useRef(null)
  const [pull, setPull] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [blooming, setBlooming] = useState(false)

  const tension = Math.min(
    1,
    Math.sqrt(pull.x * pull.x + pull.y * pull.y) / MAX_PULL
  )

  const handlePointerDown = useCallback((e) => {
    if (blooming) return
    dragStart.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
    leafRef.current?.setPointerCapture?.(e.pointerId)
  }, [blooming])

  const handlePointerMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamped = Math.min(dist, MAX_PULL)
    const scale = dist === 0 ? 0 : clamped / dist
    setPull({ x: dx * scale, y: dy * scale })
  }, [dragging])

  const triggerBloom = useCallback(() => {
    setBlooming(true)
    setPull({ x: 0, y: 0 })
    const duration = reduceMotion ? 0 : 2000
    window.setTimeout(() => {
      onBloom?.()
    }, duration)
  }, [onBloom, reduceMotion])

  const handlePointerUp = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    const dist = Math.sqrt(pull.x * pull.x + pull.y * pull.y)
    if (dist >= TENSION_THRESHOLD) {
      triggerBloom()
    } else {
      // spring back
      setPull({ x: 0, y: 0 })
    }
    dragStart.current = null
  }, [dragging, pull, triggerBloom])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <svg
        viewBox="0 0 300 300"
        width="min(70vw, 340px)"
        height="min(70vw, 340px)"
        style={{ overflow: 'visible' }}
      >
        {/* stem */}
        <line x1="150" y1="300" x2="150" y2="170" stroke="#3a2a1d" strokeWidth="4" />

        {/* bloom burst — scales in over ~2s, dissolves if tapped again elsewhere */}
        <g
          style={{
            transformOrigin: '150px 140px',
            transform: blooming ? 'scale(1)' : 'scale(0)',
            opacity: blooming ? 1 : 0,
            transition: reduceMotion
              ? 'none'
              : 'transform 2000ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1600ms ease-out',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x2 = 150 + Math.cos(angle) * 60
            const y2 = 140 + Math.sin(angle) * 60
            return (
              <ellipse
                key={i}
                cx={(150 + x2) / 2}
                cy={(140 + y2) / 2}
                rx="26"
                ry="14"
                fill="#F0B35E"
                opacity="0.85"
                transform={`rotate(${(angle * 180) / Math.PI} ${(150 + x2) / 2} ${(140 + y2) / 2})`}
              />
            )
          })}
          <circle cx="150" cy="140" r="18" fill="#1F2A38" />
        </g>

        {/* tuggable leaf — hidden once blooming starts */}
        {!blooming && (
          <g
            ref={leafRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          >
            <path
              d={`M150,200
                  C ${150 + pull.x * 0.6},${200 + pull.y * 0.6}
                    ${110 + pull.x},${210 + pull.y}
                    ${90 + pull.x * 1.1},${190 + pull.y * 1.1}
                  C ${80 + pull.x * 1.1},${175 + pull.y}
                    ${110 + pull.x * 0.6},${160}
                    150,200 Z`}
              fill="#33261D"
              stroke="#F0B35E"
              strokeWidth={1 + tension * 2}
              opacity={0.9}
              style={{
                transition: dragging ? 'none' : 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </g>
        )}
      </svg>

      {!blooming && (
        <p
          style={{
            position: 'absolute',
            bottom: '8%',
            color: '#F0B35E',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            opacity: 0.6,
            letterSpacing: '0.04em',
            pointerEvents: 'none',
          }}
        >
          tug the leaf
        </p>
      )}
    </div>
  )
}
