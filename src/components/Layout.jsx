import { Wifi, WifiOff, Brain, LogOut, Database } from 'lucide-react'
import logoImg from '../assets/logo.png'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  cyan: '#00f7ff',
  danger: '#ff0055',
  success: '#00ffaa',
  info: '#00d4ff',
}

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
      height: 86,
      background: 'rgba(5, 7, 10, 0.95)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
      gap: 0,
      flexShrink: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginRight: 58, flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, background: `${C.cyan}11`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.cyan}33`, boxShadow: `0 0 15px ${C.cyan}22` }}>
          <img src={logoImg} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        </div>
        <span style={{ fontSize: 32, fontWeight: 950, color: '#fff', letterSpacing: '-1px', textShadow: `0 0 10px ${C.cyan}44` }}>MDTS</span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: 'flex', gap: 11, flex: 1, height: '100%' }}>
        {NAV.map(({ id, label, badge }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '0 36px',
                height: '100%',
                border: 'none', cursor: 'pointer',
                background: active ? `${C.cyan}0a` : 'transparent',
                color: active ? C.cyan : C.sub,
                fontSize: 32, fontWeight: active ? 950 : 500,
                transition: 'all 0.2s',
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 11,
                textShadow: active ? `0 0 15px ${C.cyan}66` : 'none'
              }}
            >
              {label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 5, background: C.cyan,
                  boxShadow: `0 0 15px ${C.cyan}`
                }} />
              )}
              {badge && (
                <span style={{
                  marginLeft: 9, background: C.danger,
                  color: '#fff', fontSize: 16, fontWeight: 900,
                  padding: '3px 11px', borderRadius: 14,
                  boxShadow: `0 0 10px ${C.danger}66`
                }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Right info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexShrink: 0 }}>
        
        {/* 데이터 동기화 상태 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: C.info }}>
            <Database size={20} />
            <span style={{ fontSize: 20, fontWeight: 900 }}>전송 대기 : 2건</span>
          </div>
          <div style={{ fontSize: 16, color: C.sub, fontWeight: 700 }}>최근 전송 : 10:24:15</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 14px', borderRadius: 9,
          background: `${C.danger}11`,
          border: `1px solid ${C.danger}44`,
          boxShadow: `0 0 10px ${C.danger}22`
        }}>
          <WifiOff size={16} color={C.danger} />
          <span style={{ fontSize: 16, fontWeight: 800, color: C.danger }}>
            OFF LINE
          </span>
        </div>
        {auth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, borderLeft: `1px solid ${C.border}`, paddingLeft: 18 }}>
            <div style={{ fontSize: 16, color: C.sub }}>
              <span style={{ color: C.text, fontWeight: 700 }}>{auth.shipNo}</span>
              <span style={{ margin: '0 9px', color: C.border }}>|</span>
              <span style={{ color: C.text, fontWeight: 700 }}>{auth.deviceNo}</span>
            </div>
            <button 
              onClick={onLogout}
              title="로그아웃"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.sub, display: 'flex', alignItems: 'center',
                padding: '9px', borderRadius: 9, transition: '0.2s',
              }}
              onMouseEnter={e => {e.currentTarget.style.background = `${C.danger}11`; e.currentTarget.style.color = C.danger;}}
              onMouseLeave={e => {e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.sub;}}
            >
              <LogOut size={25} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
