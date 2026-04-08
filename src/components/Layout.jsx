import { Wifi, WifiOff } from 'lucide-react'

const NAV = [
  { id: 'main', label: '메인' },
  { id: 'chart', label: '환자 차트' },
  { id: 'crew', label: '선원 관리' },
  { id: 'emergency', label: '응급처치' },
  { id: 'settings', label: '설정' },
]

export default function Layout({ activePage, onNavigate, auth }) {
  const isOnline = true // 실제로는 네트워크 상태 감지

  return (
    <header style={{
      height: 46,
      background: 'var(--navy-950)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 0,
      flexShrink: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 24, flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13,
        }}>⚓</div>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>MDTS</span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {NAV.map(({ id, label }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '6px 16px',
                borderRadius: 6, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(13,217,197,0.12)' : 'transparent',
                color: active ? 'var(--teal-400)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              {label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: -1, left: '20%', right: '20%',
                  height: 2, background: 'var(--teal-400)', borderRadius: 1,
                }} />
              )}
              {id === 'emergency' && (
                <span style={{
                  marginLeft: 5, background: 'var(--red-400)',
                  color: '#fff', fontSize: 9, fontWeight: 700,
                  padding: '1px 5px', borderRadius: 8, verticalAlign: 'middle',
                }}>1</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Right info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Online/Offline */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 6,
          background: isOnline ? 'rgba(38,222,129,0.1)' : 'rgba(255,77,109,0.1)',
          border: `1px solid ${isOnline ? 'rgba(38,222,129,0.3)' : 'rgba(255,77,109,0.3)'}`,
        }}>
          {isOnline
            ? <Wifi size={11} color="var(--green-400)" />
            : <WifiOff size={11} color="var(--red-400)" />
          }
          <span style={{ fontSize: 11, fontWeight: 600, color: isOnline ? 'var(--green-400)' : 'var(--red-400)' }}>
            {isOnline ? 'ON LINE' : 'OFF LINE'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{auth.shipNo}</span>
          <span style={{ margin: '0 6px', color: 'var(--border)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>{auth.deviceNo}</span>
        </div>
      </div>
    </header>
  )
}
