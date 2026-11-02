import { useState, useCallback } from 'react'
import { Settings } from 'lucide-react'
import BloomCore from './components/BloomCore.jsx'
import CompanionSelect from './components/CompanionSelect.jsx'
import BenchGus from './components/BenchGus.jsx'
import SettingsModal from './components/SettingsModal.jsx'

const SANCTUARIES = [
  { id: 'flower', label: 'Flower Garden', video: '/flower.mp4', poster: '/flower-poster.webp' },
  { id: 'ocean', label: 'Ocean Drift', video: '/ocean.mp4', poster: '/ocean-poster.webp' },
  { id: 'zen', label: 'Zen Garden', video: '/zen.mp4', poster: '/zen-poster.webp' },
  { id: 'celestial', label: 'Celestial', video: '/celestial.mp4', poster: '/celestial-poster.webp' },
]

const COMPANION_STORAGE_KEY = 'nb-companion-v1'

// Minimal stand-in for the "local client SQLite/IndexedDB" persistence
// RUNTIME-SPEC-v1.md calls for. This is just localStorage — enough to
// prove the lock sticks across a reload. Swapping it for a real
// IndexedDB/SQLite store later doesn't change anything that reads
// `companion` from App's state.
function readStoredCompanion() {
  try {
    const v = window.localStorage.getItem(COMPANION_STORAGE_KEY)
    return v === 'GUS' || v === 'JUNE' ? v : null
  } catch {
    return null
  }
}

function storeCompanion(id) {
  try {
    window.localStorage.setItem(COMPANION_STORAGE_KEY, id)
  } catch {
    // best-effort only — private mode / storage blocked shouldn't crash the app
  }
}

const GREETING = {
  GUS: "Alright. Grab a stool. What's going on today?",
  JUNE: 'Alright. We’re here. What’s the rhythm today?',
}

// Screens: 'door' -> 'sanctuary' (swipe through SANCTUARIES) -> 'bench' (swipe down)
export default function App() {
  const [companion, setCompanion] = useState(() => readStoredCompanion())
  // Returning session with a companion already locked skips the door
  // entirely — per UI-SPEC-COMPANION-SELECTION-STAGE.md: immutable per
  // active profile, zero re-entry.
  const [screen, setScreen] = useState(() => (readStoredCompanion() ? 'sanctuary' : 'door'))
  const [greeting, setGreeting] = useState(null)
  const [sanctuaryIndex, setSanctuaryIndex] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    audioEnabled: false, // off by default — voices are not live yet
    videosEnabled: true,
    reduceMotion: false,
    textSize: 'md',
  })

  const handleLock = useCallback((id) => {
    setCompanion(id)
    storeCompanion(id)
    setGreeting(GREETING[id])
    setScreen('sanctuary')
    window.setTimeout(() => setGreeting(null), 2600)
  }, [])

  const goToSanctuary = (dir) => {
    setSanctuaryIndex((i) => {
      const next = (i + dir + SANCTUARIES.length) % SANCTUARIES.length
      return next
    })
  }

  const current = SANCTUARIES[sanctuaryIndex]

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0f0d0a',
        position: 'relative',
        overflow: 'hidden',
        fontSize: settings.textSize === 'sm' ? 14 : settings.textSize === 'lg' ? 18 : 16,
      }}
    >
      {/* Settings is reachable from every screen */}
      <button
        onClick={() => setSettingsOpen(true)}
        aria-label="Open settings"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 20,
          background: 'rgba(31,42,56,0.6)',
          border: '1px solid rgba(240,179,94,0.3)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Settings size={18} color="#F0B35E" />
      </button>

      {screen === 'door' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <BloomCore reduceMotion={settings.reduceMotion} />
          </div>
          {/* Companion select, directly beneath the bloom */}
          <div style={{ paddingBottom: '10%' }}>
            <CompanionSelect onLock={handleLock} />
          </div>
        </div>
      )}

      {screen === 'sanctuary' && (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {settings.videosEnabled && (
            <video
              key={current.id}
              src={current.video}
              poster={current.poster}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.85,
              }}
              onError={(e) => {
                // Asset not wired in this preview yet — fail silently to a dark bg.
                e.currentTarget.style.display = 'none'
              }}
            />
          )}

          {greeting && (
            <div
              style={{
                position: 'absolute',
                top: '18%',
                left: 0,
                width: '100%',
                textAlign: 'center',
                padding: '0 24px',
                boxSizing: 'border-box',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <span
                style={{
                  color: '#F5E6D0',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 17,
                  background: 'rgba(15,13,10,0.55)',
                  padding: '10px 16px',
                  borderRadius: 10,
                }}
              >
                {greeting}
              </span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 24,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => goToSanctuary(-1)} style={navBtnStyle}>
                ‹
              </button>
              <span
                style={{
                  color: '#F5E6D0',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.08em',
                  fontSize: 13,
                  textTransform: 'uppercase',
                  alignSelf: 'center',
                }}
              >
                {current.label}
              </span>
              <button onClick={() => goToSanctuary(1)} style={navBtnStyle}>
                ›
              </button>
            </div>

            <button
              onClick={() => setScreen('bench')}
              style={{
                alignSelf: 'center',
                background: 'rgba(31,42,56,0.6)',
                border: '1px solid rgba(240,179,94,0.3)',
                borderRadius: 999,
                color: '#F0B35E',
                padding: '10px 20px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ↓ swipe down to the Bench
            </button>
          </div>
        </div>
      )}

      {screen === 'bench' && (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {settings.videosEnabled && (
            <video
              src="/bench.mp4"
              poster="/bench-poster.webp"
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.6,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0 }}>
            <BenchGus audioEnabled={settings.audioEnabled} companion={companion ?? 'GUS'} />
          </div>
          <button
            onClick={() => setScreen('sanctuary')}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 20,
              ...navBtnStyle,
            }}
          >
            ↑
          </button>
        </div>
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  )
}

const navBtnStyle = {
  background: 'rgba(31,42,56,0.6)',
  border: '1px solid rgba(240,179,94,0.3)',
  borderRadius: '50%',
  width: 36,
  height: 36,
  color: '#F0B35E',
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
