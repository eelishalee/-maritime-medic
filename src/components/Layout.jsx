import { Wifi, WifiOff, Brain, LogOut, Database } from 'lucide-react'
import logoImg from '../assets/logo.png'

const NAV = [
  { id: 'main',      label: '메인' },
  { id: 'chart',     label: '환자 차트' },
  { id: 'crew',      label: '선원 관리' },
  { id: 'emergency', label: '응급 처치' },
  { id: 'settings',  label: '시스템 설정' },
]

export default function Layout({ activePage, onNavigate, auth, onLogout, isOnline = true }) {
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
      <div 
        onClick={() => {
          document.activeElement?.blur();
          onNavigate('main');
        }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: 12, marginRight: 48, flexShrink: 0,
          cursor: 'pointer' 
        }}
      >
        <img src={logoImg} alt="Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
        <span style={{ fontSize: 24, fontWeight: 950, color: '#fff', letterSpacing: '-0.8px' }}>MDTS</span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 8, flex: 1, height: '100%' }}>
        {NAV.map(({ id, label, badge }) => {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        
        {/* 데이터 동기화 상태 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8' }}>
            <Database size={16} />
            <span style={{ fontSize: 16, fontWeight: 900 }}>전송 대기 : 2건</span>
          </div>
          <div style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>최근 전송 : 10:24:15</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 24px', borderRadius: 12,
          background: isOnline ? 'rgba(38,222,129,0.1)' : 'rgba(244,63,94,0.15)',
          border: `2px solid ${isOnline ? 'rgba(38,222,129,0.4)' : 'rgba(244,63,94,0.5)'}`,
          animation: isOnline ? 'none' : 'blink 4s infinite',
          boxShadow: isOnline ? 'none' : '0 0 15px rgba(244,63,94,0.3)'
        }}>
          {isOnline ? <Wifi size={24} color="#26de81" /> : <WifiOff size={24} color="#f43f5e" />}
          <span style={{ fontSize: '20px', fontWeight: 900, color: isOnline ? '#26de81' : '#f43f5e', letterSpacing: '0.5px' }}>
            {isOnline ? '네트워크 온라인' : '오프라인 모드 작동 중'}
          </span>
        </div>
        <style>{`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}</style>
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
                padding: '6px', borderRadius: 6, transition: '0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

