import { useState } from 'react'
import { Database, Settings, Ship } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ serial: 'SN-0001', device: 'MED-01', ship: 'KOREA STAR' })
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(loginData)
  }

  return (
    <div style={{
      height: '800px', width: '1280px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 100% 90% at 82% 52%, #041c2e 0%, #020e1c 55%, #010810 100%)',
      color: '#fff', fontFamily: 'Pretendard, sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(1,8,16,0.6) 100%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '60px', maxWidth: '1200px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 10 }}>

        {/* 좌측 헤드라인 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,229,200,0.08)', padding: '5px 14px',
            borderRadius: '30px', border: '1px solid rgba(0,229,200,0.25)',
            marginBottom: '14px'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5cc', boxShadow: '0 0 8px #00e5cc', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#00e5cc', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>MDTS (Medical + Digitising)</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '34px', fontWeight: '950', lineHeight: '1.25', letterSpacing: '-1px', margin: 0, color: '#fff' }}>
              선박용 엣지 AI<br />
              <span style={{
                fontSize: '34px',
                background: 'linear-gradient(90deg, #39ff6a 0%, #00ffcc 55%, #00e5ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                display: 'inline-block'
              }}>
                응급진단 및 처치 가이드 KIT
              </span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            <StatItem val="24H" label="실시간 바이탈" />
            <StatItem val="AI 8종" label="응급처치 분류" />
            <StatItem val="25단계" label="처치 프로토콜" />
          </div>
        </div>

        {/* 우측 로그인 카드 */}
        <div style={{ width: '360px', flexShrink: 0, position: 'relative' }}>
          <div style={{
            position: 'relative', padding: '1.5px', borderRadius: '24px',
            background: 'rgba(0,229,200,0.1)', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'conic-gradient(transparent, transparent, transparent, #00e5cc)',
              animation: 'borderRotate 4s linear infinite', transformOrigin: 'center'
            }} />
            <div style={{
              background: 'rgba(2,12,22,0.92)', backdropFilter: 'blur(40px)',
              borderRadius: '22.5px', padding: '32px 28px', position: 'relative', zIndex: 2
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  <img src={logoImg} alt="MDTS Logo" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '0.3px', marginBottom: '6px', color: '#fff' }}>MDTS</h3>
                <p style={{ fontSize: '13px', color: 'rgba(0,200,180,0.75)', fontWeight: '600', margin: 0 }}>
                  바다 위 어디서든, 멈추지 않는 의료 AI
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <LoginInput icon={<Database size={18}/>} placeholder="시리얼 넘버" value={loginData.serial} onChange={v => setLoginData({...loginData, serial: v})} focused={focusedField === 'serial'} onFocus={() => setFocusedField('serial')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Settings size={18}/>} placeholder="기기 번호" value={loginData.device} onChange={v => setLoginData({...loginData, device: v})} focused={focusedField === 'device'} onFocus={() => setFocusedField('device')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Ship size={18}/>} placeholder="선박 번호" value={loginData.ship} onChange={v => setLoginData({...loginData, ship: v})} focused={focusedField === 'ship'} onFocus={() => setFocusedField('ship')} onBlur={() => setFocusedField(null)} />

                <button
                  type="submit"
                  style={{
                    marginTop: '8px', padding: '16px', borderRadius: '14px',
                    background: 'linear-gradient(90deg, #00c9b1, #00a8e8)', color: '#000',
                    border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(0,200,180,0.4)', transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  시스템 접속
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function StatItem({ val, label }) {
  return (
    <div>
      <div style={{ fontSize: '24px', fontWeight: '950', color: '#fff', lineHeight: '1', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>{val}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontWeight: '700', whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

function LoginInput({ icon, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)',
      borderRadius: '14px', padding: '0 16px',
      border: `1.5px solid ${focused ? '#00e5cc' : 'rgba(255,255,255,0.08)'}`,
      height: '52px', transition: 'all 0.2s',
      boxShadow: focused ? '0 0 15px rgba(0,229,200,0.1)' : 'none'
    }}>
      <div style={{ color: focused ? '#00e5cc' : '#64748b', transition: 'color 0.2s', flexShrink: 0 }}>{icon}</div>
      <input
        placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', fontWeight: '500', minWidth: 0 }}
      />
    </div>
  )
}
