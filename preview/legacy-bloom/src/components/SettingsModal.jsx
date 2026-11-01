export default function SettingsModal({
  open,
  onClose,
  settings,
  onChange,
}) {
  if (!open) return null

  const update = (key, value) => onChange({ ...settings, [key]: value })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,13,10,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(90vw, 360px)',
          background: '#1F2A38',
          border: '1px solid rgba(240,179,94,0.25)',
          borderRadius: 14,
          padding: 24,
          color: '#F5E6D0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#F0B35E' }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#F0B35E',
              fontSize: 18,
              cursor: 'pointer',
            }}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <Row label="Voice">
          <Toggle checked={settings.audioEnabled} onChange={(v) => update('audioEnabled', v)} />
        </Row>

        <Row label="Background videos">
          <Toggle checked={settings.videosEnabled} onChange={(v) => update('videosEnabled', v)} />
        </Row>

        <Row label="Reduce motion">
          <Toggle checked={settings.reduceMotion} onChange={(v) => update('reduceMotion', v)} />
        </Row>

        <Row label="Text size">
          <select
            value={settings.textSize}
            onChange={(e) => update('textSize', e.target.value)}
            style={{
              background: '#0f0d0a',
              color: '#F5E6D0',
              border: '1px solid rgba(240,179,94,0.3)',
              borderRadius: 6,
              padding: '4px 8px',
            }}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </Row>

        {!settings.audioEnabled && (
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}>
            Note: voice playback is still stubbed in this preview — turning this on
            doesn't play real audio yet.
          </p>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      }}
    >
      <span style={{ fontSize: 14 }}>{label}</span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        border: '1px solid rgba(240,179,94,0.4)',
        background: checked ? '#F0B35E' : 'transparent',
        position: 'relative',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: checked ? '#1F2A38' : '#F0B35E',
          transition: 'left 160ms ease',
        }}
      />
    </button>
  )
}
