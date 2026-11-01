import { useState, useCallback, useRef } from 'react'

/**
 * BenchGus — Gus at the counter, Bench only.
 * Audio is STUBBED per spec: Danny hasn't cleared live voice assets yet.
 * This drives a mock playback state machine (isPlaying, currentLine,
 * toggleAudio) against plain text scripts, so the component structure
 * is ready to wire real audio in later without changing its shape.
 */

// Canonical Gus lines — short-order cook, counter warmth, plain talk,
// zero cheerleading. Never "I totally understand."
const GUS_LINES = [
  { id: 'greet', text: "Pull up a stool. Coffee's fresh." },
  { id: 'circuit-breaker', text: "Step off the gas a second. Cut the power to the loop." },
  { id: 'ledger', text: "Whatever score you're keeping tonight, close the book. It can sit quiet till morning." },
  { id: 'cold-coffee', text: "Burnout's not a fuse blowing. It's walking away from yourself till you go cold." },
]

export default function BenchGus({ audioEnabled = true }) {
  const [currentLineId, setCurrentLineId] = useState(GUS_LINES[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const stubTimer = useRef(null)

  const currentLine = GUS_LINES.find((l) => l.id === currentLineId) ?? GUS_LINES[0]

  // Mock playback — no audio file wired yet. Simulates a line "playing"
  // for a few seconds so the UI state machine is exercised end to end.
  const toggleAudio = useCallback(() => {
    if (!audioEnabled) return
    if (isPlaying) {
      setIsPlaying(false)
      if (stubTimer.current) clearTimeout(stubTimer.current)
      return
    }
    setIsPlaying(true)
    stubTimer.current = window.setTimeout(() => {
      setIsPlaying(false)
    }, 2600)
  }, [isPlaying, audioEnabled])

  const selectLine = useCallback((id) => {
    setIsPlaying(false)
    if (stubTimer.current) clearTimeout(stubTimer.current)
    setCurrentLineId(id)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px',
        boxSizing: 'border-box',
        background:
          'linear-gradient(180deg, rgba(15,13,10,0.2) 0%, rgba(15,13,10,0.85) 70%)',
        fontFamily: 'system-ui, sans-serif',
        color: '#F0B35E',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 12, letterSpacing: '0.12em', opacity: 0.6 }}>
          THE BENCH · OPEN 24 HRS
        </span>
      </div>

      <div
        style={{
          background: 'rgba(31,42,56,0.55)',
          border: '1px solid rgba(240,179,94,0.25)',
          borderRadius: 12,
          padding: '16px 18px',
          marginBottom: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: '#F5E6D0' }}>
          {currentLine.text}
        </p>
        {!audioEnabled && (
          <p style={{ margin: '8px 0 0', fontSize: 12, opacity: 0.5 }}>
            Voice is off in Settings — text only.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {GUS_LINES.map((line) => (
          <button
            key={line.id}
            onClick={() => selectLine(line.id)}
            style={{
              background: line.id === currentLineId ? '#F0B35E' : 'transparent',
              color: line.id === currentLineId ? '#1F2A38' : '#F0B35E',
              border: '1px solid rgba(240,179,94,0.4)',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {line.id.replace('-', ' ')}
          </button>
        ))}
      </div>

      <button
        onClick={toggleAudio}
        disabled={!audioEnabled}
        style={{
          alignSelf: 'flex-start',
          background: isPlaying ? '#F0B35E' : 'transparent',
          color: isPlaying ? '#1F2A38' : '#F0B35E',
          border: '1px solid #F0B35E',
          borderRadius: 8,
          padding: '10px 16px',
          fontSize: 14,
          cursor: audioEnabled ? 'pointer' : 'not-allowed',
          opacity: audioEnabled ? 1 : 0.4,
        }}
      >
        {isPlaying ? 'Playing…' : 'Play line (stub)'}
      </button>
    </div>
  )
}
