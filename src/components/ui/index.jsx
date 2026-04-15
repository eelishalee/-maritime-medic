import { Edit3, ChevronRight } from 'lucide-react'

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

export function DashboardVital({ label, value, unit, color, editable, onEdit, live }) {
  return (
    <div style={{
      background: `linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
      borderRadius: 16, padding: '14px 14px',
      border: `1px solid rgba(255,255,255,0.07)`,
      textAlign: 'center', position: 'relative'
    }}>
      {live && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: color,
          animation: 'pulse-dot 1.4s ease-in-out infinite'
        }} />
      )}
      <div style={{ fontSize: 19, fontWeight: 700, color: '#94a3b8', marginBottom: 2, letterSpacing: '0.3px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 38, fontWeight: 950, color, letterSpacing: '-1px' }}>{value}</span>
        <span style={{ fontSize: 16, color: `${color}99`, fontWeight: 600 }}>{unit}</span>
      </div>
      {editable && (
        <button onClick={onEdit} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <Edit3 size={18} />
        </button>
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
