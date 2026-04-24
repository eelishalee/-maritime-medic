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
      width: '100dvw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 100% 90% at 82% 52%, #041c2e 0%, #020e1c 55%, #010810 100%)',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(1,8,16,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(32px, 5vw, 80px)',
        maxWidth: '90vw',
        width: '100%',
        padding: '0 clamp(20px, 4vw, 60px)',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* 좌측 헤드라인 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
            background: 'rgba(0,229,200,0.08)',
            padding: '5px var(--sp-4)',
            borderRadius: '30px',
            border: '1px solid rgba(0,229,200,0.25)',
            marginBottom: 'var(--sp-4)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00e5cc', boxShadow: '0 0 8px #00e5cc', flexShrink: 0,
            }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700, color: '#00e5cc',
              letterSpacing: '1.5px', whiteSpace: 'nowrap',
            }}>MDTS (Medical + Digitising)</span>
          </div>

          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <h1 style={{
              fontSize: 'var(--text-hero)',
              fontWeight: 950,
              lineHeight: 1.25,
              letterSpacing: '-1px',
              margin: 0, color: '#fff',
            }}>
              선박용 엣지 AI<br />
              <span style={{
                fontSize: 'var(--text-hero)',
                background: 'linear-gradient(90deg, #39ff6a 0%, #00ffcc 55%, #00e5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}>
                응급진단 및 처치 가이드 KIT
              </span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 60px)', flexWrap: 'wrap' }}>
            <StatItem val="24H" label="실시간 바이탈" />
            <StatItem val="AI 8종" label="응급처치 분류" />
            <StatItem val="25단계" label="처치 프로토콜" />
          </div>
        </div>

        {/* 우측 로그인 카드 */}
        <div style={{ width: 'clamp(280px, 28vw, 380px)', flexShrink: 0, position: 'relative' }}>
          <div style={{
            position: 'relative',
            padding: '1.5px',
            borderRadius: 'var(--r-2xl)',
            background: 'rgba(0,229,200,0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '-50%',
              width: '200%', height: '200%',
              background: 'conic-gradient(transparent, transparent, transparent, #00e5cc)',
              animation: 'borderRotate 4s linear infinite',
              transformOrigin: 'center',
            }} />
            <div style={{
              background: 'rgba(2,12,22,0.92)',
              backdropFilter: 'blur(40px)',
              borderRadius: 'calc(var(--r-2xl) - 1.5px)',
              padding: 'var(--sp-8) var(--sp-6)',
              position: 'relative', zIndex: 2,
            }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                  <img
                    src={logoImg}
                    alt="MDTS Logo"
                    style={{ width: 'clamp(56px, 6vw, 80px)', height: 'clamp(56px, 6vw, 80px)', objectFit: 'contain' }}
                  />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 900, letterSpacing: '0.3px',
                  marginBottom: 'var(--sp-2)', color: '#fff',
                }}>MDTS</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,200,180,0.75)', fontWeight: 600, margin: 0 }}>
                  바다 위 어디서든, 멈추지 않는 의료 AI
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <LoginInput
                  icon={<Database size="var(--icon-md)" />}
                  placeholder="시리얼 넘버"
                  value={loginData.serial}
                  onChange={v => setLoginData({ ...loginData, serial: v })}
                  focused={focusedField === 'serial'}
                  onFocus={() => setFocusedField('serial')}
                  onBlur={() => setFocusedField(null)}
                />
                <LoginInput
                  icon={<Settings size="var(--icon-md)" />}
                  placeholder="기기 번호"
                  value={loginData.device}
                  onChange={v => setLoginData({ ...loginData, device: v })}
                  focused={focusedField === 'device'}
                  onFocus={() => setFocusedField('device')}
                  onBlur={() => setFocusedField(null)}
                />
                <LoginInput
                  icon={<Ship size="var(--icon-md)" />}
                  placeholder="선박 번호"
                  value={loginData.ship}
                  onChange={v => setLoginData({ ...loginData, ship: v })}
                  focused={focusedField === 'ship'}
                  onFocus={() => setFocusedField('ship')}
                  onBlur={() => setFocusedField(null)}
                />

                <button
                  type="submit"
                  style={{
                    marginTop: 'var(--sp-2)',
                    height: 'var(--touch-lg)',
                    borderRadius: 'var(--r-lg)',
                    background: 'linear-gradient(90deg, #00c9b1, #00a8e8)',
                    color: '#000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: 'var(--text-md)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(0,200,180,0.4)',
                    transition: 'all 0.2s ease',
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
    </div>
  )
}

function StatItem({ val, label }) {
  return (
    <div>
      <div style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 950, color: '#fff',
        lineHeight: 1, letterSpacing: '-0.5px', whiteSpace: 'nowrap',
      }}>{val}</div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'rgba(255,255,255,0.4)',
        marginTop: 4, fontWeight: 700, whiteSpace: 'nowrap',
      }}>{label}</div>
    </div>
  )
}

function LoginInput({ icon, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--r-lg)',
      padding: '0 var(--sp-4)',
      border: `1.5px solid ${focused ? '#00e5cc' : 'rgba(255,255,255,0.08)'}`,
      height: 'var(--touch-lg)',
      transition: 'all 0.2s',
      boxShadow: focused ? '0 0 15px rgba(0,229,200,0.1)' : 'none',
    }}>
      <div style={{ color: focused ? '#00e5cc' : '#64748b', transition: 'color 0.2s', flexShrink: 0 }}>
        {icon}
      </div>
      <input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          flex: 1, background: 'none', border: 'none',
          color: '#fff', fontSize: 'var(--text-base)',
          outline: 'none', fontWeight: 500, minWidth: 0,
        }}
      />
    </div>
  )
}
