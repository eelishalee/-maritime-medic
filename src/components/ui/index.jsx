import { Edit3, ChevronRight, AlertCircle } from 'lucide-react'

export function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      background: 'none', border: 'none', padding: '0 28px', height: '100%',
      color: active ? '#38bdf8' : '#64748b', fontSize: 24, fontWeight: 900,
      borderBottom: `5px solid ${active ? '#38bdf8' : 'transparent'}`,
      cursor: 'pointer', transition: '0.2s'
    }}>{label}</button>
  )
}

export function DashboardVital({ label, value, unit, color, editable, onEdit, live, isConnected = true }) {
  return (
    <div style={{
      background: isConnected 
        ? 'rgba(255,255,255,0.03)' 
        : 'rgba(251, 191, 36, 0.03)',
      borderRadius: 18, padding: '16px 14px',
      border: isConnected 
        ? '1px solid rgba(255,255,255,0.07)' 
        : '1px solid rgba(251, 191, 36, 0.3)',
      textAlign: 'center', position: 'relative',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      {live && isConnected && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: color,
          animation: 'pulse-dot 1.4s ease-in-out infinite'
        }} />
      )}
      
      {!isConnected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          color: '#fbbf24',
          animation: 'pulse 2s infinite'
        }}>
          <AlertCircle size={16} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: isConnected ? '#e2e8f0' : '#fbbf24', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
        {editable && isConnected && (
          <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <Edit3 size={18} />
          </button>
        )}
      </div>
      
      {isConnected ? (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
          <span style={{ 
            fontSize: 34, fontWeight: 950, color: color, letterSpacing: '-1px', whiteSpace: 'nowrap'
          }}>{value}</span>
          <span style={{ fontSize: 15, color: color, fontWeight: 900, flexShrink: 0, opacity: 1 }}>{unit}</span>
        </div>
      ) : (
        <div style={{ padding: '4px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 950, color: '#fbbf24', letterSpacing: '-0.3px' }}>센서 점검 필요</div>
          <div style={{ fontSize: 11, color: 'rgba(251, 191, 36, 0.5)', fontWeight: 800, marginTop: 4 }}>데이터 수신 대기 중</div>
        </div>
      )}
    </div>
  )
}

export function TimelineItem({ time, label, detail, highlight }) {
  return (
    <div style={{ marginBottom: 48, position: 'relative' }}>
      <div style={{ position: 'absolute', left: -45, top: 12, width: 20, height: 20, borderRadius: '50%', background: highlight ? '#f43f5e' : '#38bdf8', boxShadow: highlight ? '0 0 25px #f43f5e' : '0 0 15px rgba(56,189,248,0.4)' }} />
      <div style={{ fontSize: 18.5, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{time}</div>
      <div style={{ fontSize: 22, fontWeight: 950, color: highlight ? '#fb7185' : '#e2e8f0', letterSpacing: '-0.5px', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 }}>{detail}</div>
    </div>
  )
}

export function StepItem({ num, title, desc, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', gap: 20, padding: 20, borderRadius: 20, cursor: 'pointer',
        background: active ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: active ? 'linear-gradient(135deg,#38bdf8,#0ea5e9)' : '#1e293b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 900, color: active ? '#000' : '#64748b',
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 18.5, fontWeight: 800, marginBottom: 4, color: active ? '#38bdf8' : '#fff' }}>{title}</div>
        <div style={{ fontSize: 17, color: active ? '#cbd5e1' : '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

export function SymptomTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px', borderRadius: 12, border: `1px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.05)'}`,
        background: active ? '#38bdf8' : 'rgba(255,255,255,0.03)',
        color: active ? '#000' : '#64748b',
        fontWeight: 800, fontSize: 20, cursor: 'pointer',
      }}
    >{label}</button>
  )
}

export function InfoItem({ label, value, span = 1, size }) {
  const valueSize = size === 'xl_ultra' ? 32 : (size === 'xl_max' ? 28 : (size === 'xl_plus' ? 25 : (size === 'xl' ? 22 : (size === 'large' ? 18 : 13))))
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 18, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 800 }}>{value}</div>
    </div>
  )
}

export function ActionBtn({ icon, label, highlight, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', padding: '16px 20px', borderRadius: 14, 
        background: active ? 'rgba(56,189,248,0.15)' : (highlight ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)'), 
        border: `1px solid ${active || highlight ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}`,
        color: active || highlight ? '#38bdf8' : '#94a3b8', 
        fontSize: 14, fontWeight: 800,
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
        transition: '0.2s',
      }}
    >
      <div style={{ color: active || highlight ? '#38bdf8' : '#64748b' }}>{icon}</div>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={16} style={{ transform: active ? 'rotate(90deg)' : 'none', transition: '0.2s', opacity: 0.5 }} />
    </button>
  )
}

export function LoginInput({ icon, placeholder, value, onChange, focused, setFocused }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: focused ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 13, padding: '0 18px', border: `1px solid ${focused ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.2s', boxShadow: focused ? '0 0 0 3px rgba(56,189,248,0.08)' : 'none' }}>
      <div style={{ color: focused ? '#38bdf8' : '#475569', transition: 'color 0.2s' }}>{icon}</div>
      <input
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, height: 52, outline: 'none' }}
      />
    </div>
  )
}

export function SettingCard({ icon, title, desc, children }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ color: '#38bdf8' }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>{desc}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function IdPhoto({ name, size = 52 }) {
  const bgColors = ['#e2e8f0', '#cbd5e1', '#d1d5db', '#bfdbfe']
  const bgColor = bgColors[name.length % bgColors.length]
  
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '12%', overflow: 'hidden', 
      background: bgColor, border: '1.5px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
    }}>
      <svg viewBox="0 0 100 100" style={{ width: '90%', height: '90%', marginTop: '10%' }}>
        {/* 머리 실루엣 (한국인 스타일의 단정한 헤어) */}
        <path d="M30 40 Q50 15 70 40 L75 55 Q75 65 50 65 Q25 65 25 55 Z" fill="#1a1a1a" />
        {/* 얼굴 */}
        <path d="M35 45 Q50 35 65 45 L65 65 Q50 80 35 65 Z" fill="#ffdbac" />
        {/* 목 */}
        <path d="M45 65 L55 65 L55 75 L45 75 Z" fill="#f1c27d" />
        {/* 정장/셔츠 카라 */}
        <path d="M20 85 Q50 70 80 85 L85 100 L15 100 Z" fill="#2d3748" />
        <path d="M45 75 L50 85 L55 75 Z" fill="#fff" /> {/* 와이셔츠 깃 */}
      </svg>
      {/* 증명사진 광택 효과 */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
    </div>
  )
}

export function ModalField({ label, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8, fontWeight: 700 }}>{label}</label>
      <input 
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ 
          width: '100%', background: readOnly ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', 
          color: readOnly ? '#475569' : '#fff', outline: 'none', fontSize: 16
        }} 
      />
    </div>
  )
}
