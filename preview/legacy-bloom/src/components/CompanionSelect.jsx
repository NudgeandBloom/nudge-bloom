import { useState, useCallback } from 'react'

/**
 * CompanionSelect — the binary Gus/June picker, bound directly beneath
 * the breathing bloom.
 *
 * Step 2 of NEXT-BUILD-SEQUENCE.md: "Bind the binary companion select
 * (Gus card vs. June card) directly beneath the bloom."
 *
 * Follows UI-SPEC-GATE-COMPANION-FORK.md:
 * - Both choices visible at once. No carousel, no scrolling between them.
 * - Single tap executes the choice... but the spec also calls for a
 *   confirm step before the lock ("Confirm prompt -> Lock companion ID
 *   to session state"). Tapping a card once previews/highlights it;
 *   tapping the SAME card again is that confirm, and locks it. No
 *   popup dialog, no extra button — the second tap on the same card
 *   is the confirm.
 * - Zero re-entry or mid-session switching: once onLock fires, the
 *   parent (App.jsx) never remounts this component for that session.
 *
 * Transition, per Jett's spec: cards dissolve instantly, no spinner.
 */

const COMPANIONS = [
  {
    id: 'GUS',
    name: 'Gus',
    tagline: 'Diner counter. Gritty, direct, no fuss.',
  },
  {
    id: 'JUNE',
    name: 'June',
    tagline: 'Grounded warmth. Calm, steady presence.',
  },
]

export default function CompanionSelect({ onLock }) {
  const [pendingId, setPendingId] = useState(null)
  const [locking, setLocking] = useState(false)

  const handleTap = useCallback(
    (id) => {
      if (locking) return
      if (pendingId === id) {
        setLocking(true)
        // Dissolve, no spinner — then the lock actually takes effect.
        window.setTimeout(() => onLock?.(id), 380)
      } else {
        setPendingId(id)
      }
    },
    [pendingId, locking, onLock]
  )

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        width: 'min(90vw, 480px)',
        margin: '0 auto',
        opacity: locking ? 0 : 1,
        transform: locking ? 'scale(0.96)' : 'scale(1)',
        transition: 'opacity 380ms ease, transform 380ms ease',
      }}
    >
      {COMPANIONS.map((c) => {
        const isPending = pendingId === c.id
        return (
          <button
            key={c.id}
            onClick={() => handleTap(c.id)}
            disabled={locking}
            style={{
              flex: 1,
              background: isPending ? 'rgba(240,179,94,0.18)' : 'rgba(31,42,56,0.55)',
              border: isPending ? '1px solid #F0B35E' : '1px solid rgba(240,179,94,0.25)',
              borderRadius: 14,
              padding: '18px 14px',
              color: '#F5E6D0',
              fontFamily: 'system-ui, sans-serif',
              cursor: locking ? 'default' : 'pointer',
              textAlign: 'center',
              transition: 'background 200ms ease, border-color 200ms ease',
            }}
          >
            <div style={{ fontSize: 17, color: '#F0B35E', marginBottom: 6 }}>{c.name}</div>
            <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.4 }}>{c.tagline}</div>
            {isPending && (
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.85 }}>
                Tap once more to lock in {c.name} — no switching once it's set.
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
