import { useState, useCallback } from 'react'
import { Settings } from 'lucide-react'
import BloomCore from './components/BloomCore.jsx'
import BenchGus from './components/BenchGus.jsx'
import SettingsModal from './components/SettingsModal.jsx'

const SANCTUARIES = [
  { id: 'flower', label: 'Flower Garden', video: '/flower.mp4', poster: '/flower-poster.webp' },
  { id: 'ocean', label: 'Ocean Drift', video: '/ocean.mp4', poster: '/ocean-poster.webp' },
  { id: 'zen', label: 'Zen Garden', video: '/zen.mp4', poster: '/zen-poster.webp' },
  { id: 'celestial', label: 'Celestial', video: '/celestial.mp4', poster: '/celestial-poster.webp' },
]

// Screens: 'door' -> 'sanctuary' (swipe through SANCTUARIES) -> 'bench' (swipe down)
export default function App() {
  const [screen, setScreen] = useState('door')
  const [sanctuaryIndex, setSanctuaryIndex] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    audioEnabled: false, // off by default — voices are not live yet
    videosEnabled: true,
    reduceMotion: false,
    textSize: 'md',
  })

  const handleBloom = useCallback(() => {
    setScreen('sanctuary')
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
        <BloomCore onBloom={handleBloom} reduceMotion={settings.reduceMotion} />
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
              ↓ swipe down to Gus
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
            <BenchGus audioEnabled={settings.audioEnabled} />
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
