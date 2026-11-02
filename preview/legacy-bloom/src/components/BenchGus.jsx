import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * BenchGus — Gus at the counter, Bench only.
 *
 * Step 3 of NEXT-BUILD-SEQUENCE.md: autonomous silence detection wired
 * to the Bench client view. No hold-to-talk (traps on Chromebook via
 * right-click), no "type here" text fallback — both are hard
 * prohibitions in MODULE-SPEC-THE-BENCH-RUNTIME.md.
 *
 * What's real here: the mic listens on its own the moment the Bench
 * opens. Web Audio API measures live volume every frame. Once you've
 * spoken and then gone quiet for 8-10s, Gus answers automatically —
 * no button, no hold, no typing.
 *
 * What's still stubbed: there's no live model or ElevenLabs voice
 * wired in yet (RUNTIME-SPEC-v1.md Section 3/4 needs real API keys
 * Danny/Jett have to supply). So "Gus answers" here just advances to
 * the next canned line as a placeholder — the INPUT side (silence
 * detection replacing hold-to-talk) is the real, functioning part of
 * this step. Swapping the stubbed reply for a real model call is a
 * drop-in change once keys exist — this component doesn't need to
 * change shape for that.
 */

const SILENCE_THRESHOLD_MS = 9000 // mid-point of the 8.0-10.0s spec range
const VOICE_RMS_THRESHOLD = 0.02 // rough mic-noise floor; needs real-device tuning

const GUS_LINES = [
  { id: 'greet', text: "Do you leave it all here, or we can talk you through it?" },
  { id: 'circuit-breaker', text: "Step off the gas a second. Cut the power to the loop." },
  { id: 'ledger', text: "Whatever score you're keeping tonight, close the book. It can sit quiet till morning." },
  { id: 'cold-coffee', text: "Burnout's not a fuse blowing. It's walking away from yourself till you go cold." },
]

export default function BenchGus({ audioEnabled = true }) {
  // mic lifecycle: idle -> listening, or denied / unsupported if it can't start
  const [micStatus, setMicStatus] = useState('idle')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [gusState, setGusState] = useState('waiting') // waiting | replying
  const [lineIndex, setLineIndex] = useState(0)
  const [retryTick, setRetryTick] = useState(0)

  const audioCtxRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const lastSpeechAtRef = useRef(null)
  const hasSpokenRef = useRef(false)
  const busyRef = useRef(false)

  const currentLine = GUS_LINES[lineIndex] ?? GUS_LINES[0]

  const triggerReply = useCallback(() => {
    busyRef.current = true
    hasSpokenRef.current = false
    lastSpeechAtRef.current = null
    setGusState('replying')
    setLineIndex((i) => (i + 1) % GUS_LINES.length)
    window.setTimeout(() => {
      busyRef.current = false
      setGusState('waiting')
    }, 2600)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function startListening() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicStatus('unsupported')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream

        const AudioCtx = window.AudioContext || window.webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)

        setMicStatus('listening')

        const data = new Float32Array(analyser.fftSize)
        const tick = () => {
          analyser.getFloatTimeDomainData(data)
          let sumSquares = 0
          for (let i = 0; i < data.length; i++) sumSquares += data[i] * data[i]
          const rms = Math.sqrt(sumSquares / data.length)
          const now = performance.now()

          if (rms > VOICE_RMS_THRESHOLD) {
            setIsSpeaking(true)
            hasSpokenRef.current = true
            lastSpeechAtRef.current = now
          } else {
            setIsSpeaking(false)
            if (
              !busyRef.current &&
              hasSpokenRef.current &&
              lastSpeechAtRef.current !== null &&
              now - lastSpeechAtRef.current >= SILENCE_THRESHOLD_MS
            ) {
              triggerReply()
            }
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      } catch (err) {
        setMicStatus('denied')
      }
    }

    startListening()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
    // retryTick lets the "allow microphone" retry button re-run this effect
  }, [triggerReply, retryTick])

  const statusLine = (() => {
    if (micStatus === 'unsupported') return "This browser can't take mic input here."
    if (micStatus === 'denied') return 'Microphone access is off — Gus needs it to hear you at the Bench.'
    if (gusState === 'replying') return 'Gus is answering.'
    if (isSpeaking) return 'Go on — Gus is listening.'
    return "Gus is listening. Talk when you're ready."
  })()

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
            Voice is off in Settings — text only, no sound yet either way.
          </p>
        )}
      </div>

      {/* Autonomous listening indicator — no button, nothing to hold.
          A soft amber pulse, not a camera-style record light. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {(micStatus === 'listening') && (
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#F0B35E',
              opacity: isSpeaking ? 1 : 0.35,
              boxShadow: isSpeaking ? '0 0 10px 3px rgba(240,179,94,0.6)' : 'none',
              transition: 'opacity 150ms ease, box-shadow 150ms ease',
              flexShrink: 0,
            }}
          />
        )}
        <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>{statusLine}</p>
      </div>

      {micStatus === 'denied' && (
        <button
          onClick={() => setRetryTick((n) => n + 1)}
          style={{
            alignSelf: 'flex-start',
            marginTop: 12,
            background: 'transparent',
            color: '#F0B35E',
            border: '1px solid #F0B35E',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Allow microphone
        </button>
      )}
    </div>
  )
}
