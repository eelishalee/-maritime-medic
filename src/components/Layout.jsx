import { Wifi, WifiOff, Brain, LogOut, Database } from 'lucide-react'
import logoImg from '../assets/logo.png'

const NAV = [
  { id: 'main',      label: '메인' },
  { id: 'chart',     label: '환자 차트' },
  { id: 'patients',  label: '선원 환자' },
  { id: 'crew',      label: '선원 관리' },
  { id: 'emergency', label: '응급 처치' },
  { id: 'ai',        label: 'AI 분석' },
  { id: 'settings',  label: '시스템 설정' },
]

export default function Layout({ activePage, onNavigate, auth, onLogout, isOnline = true }) {
  return (
    <header style={{
      height: 'var(--header-h)',
      minHeight: 'var(--header-h)',
      background: 'var(--navy-950)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--sp-5)',
      gap: 0,
      flexShrink: 0,
      zIndex: 50,
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 'var(--sp-3)',
        marginRight: 'var(--sp-8)',
        flexShrink: 0,
      }}>
        <img
          src={logoImg}
          alt="Logo"
          style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)', objectFit: 'contain' }}
        />
        <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 950,
          color: '#fff',
          letterSpacing: '-0.8px',
        }}>MDTS</span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 'var(--sp-1)', flex: 1, height: '100%', minWidth: 0 }}>
        {NAV.map(({ id, label, badge }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '0 clamp(10px, 1.2vw, 18px)',
                height: '100%',
                minWidth: 'var(--touch-sm)',
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(13,217,197,0.1)' : 'transparent',
                color: active ? 'var(--teal-400)' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: active ? 700 : 500,
                transition: 'all 0.15s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 3, background: 'var(--teal-400)',
                }} />
              )}
              {badge && (
                <span style={{
                  marginLeft: 'var(--sp-1)',
                  background: 'var(--red-400)',
                  color: '#fff',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Right info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexShrink: 0 }}>

        {/* 데이터 동기화 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', color: '#38bdf8' }}>
            <Database size="var(--icon-sm)" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 900 }}>전송 대기 : 2건</span>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: '#475569', fontWeight: 700 }}>최근 전송 : 10:24:15</div>
        </div>

        {/* 오프라인 상태 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 'var(--r-xs)',
          background: 'rgba(255,77,109,0.1)',
          border: '1px solid rgba(255,77,109,0.3)',
          minHeight: 'var(--touch-sm)',
        }}>
          <WifiOff size={11} color="var(--red-400)" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--red-400)' }}>
            OFF LINE
          </span>
        </div>

        {/* 선박·기기 정보 + 로그아웃 */}
        {auth && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            borderLeft: '1px solid var(--border)',
            paddingLeft: 'var(--sp-3)',
          }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{auth.shipNo}</span>
              <span style={{ margin: '0 4px', color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--text-secondary)' }}>{auth.deviceNo}</span>
            </div>
            <button
              onClick={onLogout}
              title="로그아웃"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center',
                padding: 'var(--sp-2)',
                borderRadius: 'var(--r-sm)',
                transition: '0.2s',
                minWidth: 'var(--touch-sm)',
                minHeight: 'var(--touch-sm)',
                justifyContent: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size="var(--icon-md)" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
