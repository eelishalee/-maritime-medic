import { Edit3, ChevronRight, AlertCircle } from 'lucide-react'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  panel2: 'rgba(15, 15, 35, 0.99)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  dim: '#1a1a3a',
  success: '#00ffaa',
  warning: '#ffaa00',
  danger: '#ff0055',
  info: '#00d4ff',
  purple: '#bc00ff',
  cyan: '#00f7ff',
}

export function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      background: 'none', border: 'none', padding: '0 36px', height: '100%',
      color: active ? C.cyan : C.sub, fontSize: 32, fontWeight: 950,
      borderBottom: `6px solid ${active ? C.cyan : 'transparent'}`,
      textShadow: active ? `0 0 15px ${C.cyan}88` : 'none',
      cursor: 'pointer', transition: '0.2s'
    }}>{label}</button>
  )
}

export function DashboardVital({ label, value, unit, color, editable, onEdit, live, isConnected = true }) {
  return (
    <div style={{
      background: isConnected 
        ? C.panel 
        : `${C.warning}0a`,
      borderRadius: 22, padding: '24px 22px',
      border: isConnected 
        ? `1px solid ${C.border}` 
        : `1px solid ${C.warning}44`,
      textAlign: 'center', position: 'relative',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      boxShadow: isConnected ? '0 8px 32px rgba(0,0,0,0.4)' : `0 0 20px ${C.warning}22`
    }}>
      {live && isConnected && (
        <div style={{
          position: 'absolute', top: 18, right: 18,
          width: 12, height: 12, borderRadius: '50%',
          background: color,
          boxShadow: `0 0 12px ${color}`,
          animation: 'blink 2s ease-in-out infinite'
        }} />
      )}
      
      {!isConnected && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          color: C.warning,
          animation: 'blink 2s infinite'
        }}>
          <AlertCircle size={22} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, marginBottom: 9, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: isConnected ? C.sub : C.warning, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</div>
        {editable && isConnected && (
          <button onClick={onEdit} style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <Edit3 size={22} />
          </button>
        )}
      </div>
      
      {isConnected ? (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 9, position: 'relative', zIndex: 1 }}>
          <span style={{ 
            fontSize: 48, fontWeight: 950, color: color, letterSpacing: '-1.5px', whiteSpace: 'nowrap',
            textShadow: `0 0 15px ${color}66`
          }}>{value}</span>
          <span style={{ fontSize: 20, color: color, fontWeight: 900, flexShrink: 0, opacity: 0.8 }}>{unit}</span>
        </div>
      ) : (
        <div style={{ padding: '6px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 950, color: C.warning, letterSpacing: '-0.4px' }}>센서 점검 필요</div>
          <div style={{ fontSize: 16, color: `${C.warning}88`, fontWeight: 800, marginTop: 6 }}>데이터 수신 대기 중</div>
        </div>
      )}
    </div>
  )
}

export function TimelineItem({ time, label, detail, highlight }) {
  const color = highlight ? C.danger : C.info
  return (
    <div style={{ marginBottom: 68, position: 'relative' }}>
      <div style={{ 
        position: 'absolute', left: -58, top: 14, width: 25, height: 25, borderRadius: '50%', 
        background: color, 
        boxShadow: `0 0 25px ${color}` 
      }} />
      <div style={{ fontSize: 22, color: C.sub, marginBottom: 11, fontWeight: 700 }}>{time}</div>
      <div style={{ 
        fontSize: 28, fontWeight: 950, color: highlight ? C.danger : C.text, 
        letterSpacing: '-0.7px', lineHeight: 1.3,
        textShadow: highlight ? `0 0 10px ${C.danger}44` : 'none'
      }}>{label}</div>
      <div style={{ fontSize: 25, color: '#94a3b8', marginTop: 14, lineHeight: 1.6 }}>{detail}</div>
    </div>
  )
}

export function StepItem({ num, title, desc, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', gap: 28, padding: 28, borderRadius: 24, cursor: 'pointer',
        background: active ? `${C.info}11` : C.panel2,
        border: `1px solid ${active ? `${C.info}44` : C.border}`,
        transition: 'all 0.2s',
        boxShadow: active ? `0 0 20px ${C.info}22` : 'none'
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: active ? `linear-gradient(135deg, ${C.info}, ${C.cyan})` : C.dim,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 900, color: active ? '#000' : C.sub,
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 25, fontWeight: 800, marginBottom: 6, color: active ? C.info : C.text }}>{title}</div>
        <div style={{ fontSize: 22, color: active ? '#cbd5e1' : C.sub, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

export function SymptomTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 32px', borderRadius: 14, border: `1px solid ${active ? C.cyan : C.border}`,
        background: active ? C.cyan : C.panel2,
        color: active ? '#000' : C.sub,
        fontWeight: 800, fontSize: 24, cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: active ? `0 0 15px ${C.cyan}44` : 'none'
      }}
    >{label}</button>
  )
}

export function InfoItem({ label, value, span = 1, size }) {
  const valueSize = size === 'xl_ultra' ? 44 : (size === 'xl_max' ? 39 : (size === 'xl_plus' ? 34 : (size === 'xl' ? 28 : (size === 'large' ? 22 : 18))))
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 20, color: C.sub, marginBottom: 9, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 800, color: C.text }}>{value}</div>
    </div>
  )
}

export function ActionBtn({ icon, label, highlight, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', padding: '22px 28px', borderRadius: 18, 
        background: active ? `${C.info}22` : (highlight ? `${C.info}11` : C.panel2), 
        border: `1px solid ${active || highlight ? `${C.info}44` : C.border}`,
        color: active || highlight ? C.info : C.sub, 
        fontSize: 20, fontWeight: 800,
        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left',
        transition: '0.2s',
        boxShadow: active ? `0 0 15px ${C.info}44` : 'none'
      }}
    >
      <div style={{ color: active || highlight ? C.info : C.sub }}>{icon}</div>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={22} style={{ transform: active ? 'rotate(90deg)' : 'none', transition: '0.2s', opacity: 0.5 }} />
    </button>
  )
}

export function LoginInput({ icon, placeholder, value, onChange, focused, setFocused }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: 14, 
      background: focused ? `${C.info}11` : C.panel2, 
      borderRadius: 16, padding: '0 25px', 
      border: `1px solid ${focused ? C.info : C.border}`, 
      transition: 'all 0.2s', 
      boxShadow: focused ? `0 0 15px ${C.info}33` : 'none' 
    }}>
      <div style={{ color: focused ? C.info : C.sub, transition: 'color 0.2s' }}>{icon}</div>
      <input
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, background: 'none', border: 'none', color: C.text, fontSize: 20, height: 72, outline: 'none' }}
      />
    </div>
  )
}

export function SettingCard({ icon, title, desc, children }) {
  return (
    <div style={{ 
      background: C.panel, borderRadius: 32, padding: 43, 
      border: `1px solid ${C.border}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ color: C.cyan }}>{React.cloneElement(icon, { size: 48 })}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 11, color: C.text }}>{title}</h3>
          <p style={{ fontSize: 20, color: C.sub, marginBottom: 24 }}>{desc}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function IdPhoto({ name, size = 72 }) {
  const bgColors = ['#e2e8f0', '#cbd5e1', '#d1d5db', '#bfdbfe']
  const bgColor = bgColors[name.length % bgColors.length]
  
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '15%', overflow: 'hidden', 
      background: bgColor, border: `2px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      boxShadow: `0 4px 12px rgba(0,0,0,0.3)`
    }}>
      <svg viewBox="0 0 100 100" style={{ width: '90%', height: '90%', marginTop: '10%' }}>
        <path d="M30 40 Q50 15 70 40 L75 55 Q75 65 50 65 Q25 65 25 55 Z" fill="#1a1a1a" />
        <path d="M35 45 Q50 35 65 45 L65 65 Q50 80 35 65 Z" fill="#ffdbac" />
        <path d="M45 65 L55 65 L55 75 L45 75 Z" fill="#f1c27d" />
        <path d="M20 85 Q50 70 80 85 L85 100 L15 100 Z" fill="#2d3748" />
        <path d="M45 75 L50 85 L55 75 Z" fill="#fff" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
    </div>
  )
}

export function ModalField({ label, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label style={{ fontSize: 18, color: C.sub, display: 'block', marginBottom: 11, fontWeight: 700 }}>{label}</label>
      <input 
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ 
          width: '100%', background: readOnly ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', 
          border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 25px', 
          color: readOnly ? C.sub : C.text, outline: 'none', fontSize: 22,
          transition: 'all 0.2s',
          boxShadow: readOnly ? 'none' : `inset 0 0 10px rgba(0,0,0,0.2)`
        }} 
      />
    </div>
  )
}
