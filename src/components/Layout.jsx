import { Wifi, WifiOff, Brain, LogOut } from 'lucide-react'
import logoImg from '../assets/logo_new.png'

const NAV = [
  { id: 'main',      label: '메인' },
  { id: 'patients',  label: '환자 차트' },
  { id: 'crew',      label: '선원 관리' },
  { id: 'emergency', label: '응급처치', badge: '1' },
  { id: 'ai',        label: 'AI 분석', isAI: true },
  { id: 'settings',  label: '설정' },
]

export default function Layout({ activePage, onNavigate, auth, onLogout }) {
  const isOnline = true

  return (
    <header style={{
      height: 72,
      background: 'var(--navy-950)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: 0,
      flexShrink: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 48, flexShrink: 0 }}>
        <img src={logoImg} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <span style={{ fontSize: 24, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.8px' }}>MDTS</span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 8, flex: 1, height: '100%' }}>
        {NAV.map(({ id, label, badge, isAI }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '0 32px',
                height: '100%',
                border: 'none', cursor: 'pointer',
                background: active ? 'rgba(13,217,197,0.1)' : 'transparent',
                color: active ? 'var(--teal-400)' : 'var(--text-secondary)',
                fontSize: 28, fontWeight: active ? 950 : 500,
                transition: 'all 0.15s',
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              {isAI && <Brain size={24} />}
              {label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 4, background: 'var(--teal-400)',
                }} />
              )}
              {badge && (
                <span style={{
                  marginLeft: 6, background: 'var(--red-400)',
                  color: '#fff', fontSize: 14, fontWeight: 900,
                  padding: '2px 9px', borderRadius: 12,
                }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Right info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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
        {auth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{auth.shipNo}</span>
              <span style={{ margin: '0 6px', color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--text-secondary)' }}>{auth.deviceNo}</span>
            </div>
            <button 
              onClick={onLogout}
              title="로그아웃"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                padding: '4px', borderRadius: 4, transition: '0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

