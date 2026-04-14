import { useState } from 'react'
import { Anchor, Lock, Monitor, Ship } from 'lucide-react'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ serialNo: '', deviceNo: '', shipNo: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.serialNo || !form.deviceNo || !form.shipNo) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(form)
    }, 1200)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--navy-950)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#0dd9c5" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={`v${i}`} x1={`${i * 4}%`} y1="0" x2={`${i * 4}%`} y2="100%" stroke="#0dd9c5" strokeWidth="0.5" />
        ))}
      </svg>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(13,217,197,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        background: 'rgba(15,32,64,0.92)',
        border: '1px solid rgba(13,217,197,0.2)',
        borderRadius: 20, padding: '40px 44px',
        width: 420, position: 'relative',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }} className="fade-in">
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
            boxShadow: '0 8px 24px rgba(13,217,197,0.3)',
          }}>
            <Anchor size={26} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MDTS</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Maritime Doctor Telemedicine System</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InputField
            icon={<Lock size={14} />}
            label="시리얼 번호"
            placeholder="MDTS-XXXX-XXXX"
            value={form.serialNo}
            onChange={set('serialNo')}
          />
          <InputField
            icon={<Monitor size={14} />}
            label="기기 번호"
            placeholder="DEV-XXXX"
            value={form.deviceNo}
            onChange={set('deviceNo')}
          />
          <InputField
            icon={<Ship size={14} />}
            label="선박 번호"
            placeholder="KS-7421"
            value={form.shipNo}
            onChange={set('shipNo')}
          />

          {error && (
            <div style={{ fontSize: 12, color: 'var(--red-400)', textAlign: 'center', padding: '8px', background: 'rgba(255,77,109,0.08)', borderRadius: 6 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '13px',
              background: loading ? 'var(--navy-600)' : 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff', fontSize: 14, fontWeight: 700,
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(13,217,197,0.3)',
            }}
          >
            {loading ? '인증 중...' : '시스템 접속'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
          본 시스템은 인가된 선박 의료진만 사용 가능합니다
        </div>
      </div>
    </div>
  )
}

function InputField({ icon, label, placeholder, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '11px 14px',
        transition: 'border-color 0.2s',
      }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--teal-400)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: 13, width: '100%',
            letterSpacing: '0.5px',
          }}
        />
      </div>
    </div>
  )
}
