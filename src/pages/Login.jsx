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
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 100% 90% at 82% 52%, #041c2e 0%, #020e1c 55%, #010810 100%)', 
      color: '#fff', fontFamily: 'Pretendard, sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      
      {/* 배경 장식 (은은한 빛) */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(1, 8, 16, 0.6) 100%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '100px', maxWidth: '1300px', width: '100%', padding: '0 60px', position: 'relative', zIndex: 10 }}>
        
        {/* 좌측 헤드라인 섹션 */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '10px', 
            background: 'rgba(0, 229, 200, 0.08)', padding: '6px 16px', 
            borderRadius: '30px', border: '1px solid rgba(0, 229, 200, 0.25)',
            marginBottom: '16px'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00e5cc', boxShadow: '0 0 8px #00e5cc' }} />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#00e5cc', letterSpacing: '2.5px' }}>Maritime Medical AI System</span>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '60px', fontWeight: '950', lineHeight: '1.1', letterSpacing: '-2px', margin: 0 }}>
              선박 탑재형<br />엣지 의료 지원
            </h1>
            <h2 style={{ 
              fontSize: '60px', fontWeight: '800', lineHeight: '1.1', fontStyle: 'italic', 
              letterSpacing: '-1px', marginTop: '8px', 
              background: 'linear-gradient(90deg, #39ff6a 0%, #00ffcc 55%, #00e5ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              AI Medical System
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            <StatItem val="24H" label="실시간 바이탈" />
            <StatItem val="4종" label="응급처치 분류" />
            <StatItem val="99%" label="오프라인 가용" />
            <StatItem val="12단계" label="처치 프로토콜" />
          </div>
        </div>

        {/* 우측 로그인 카드 섹션 (흐르는 빛 효과 구현) */}
        <div style={{ width: '460px', position: 'relative' }}>
          <div style={{ 
            position: 'relative', padding: '1.5px', borderRadius: '28px', 
            background: 'rgba(0, 229, 200, 0.1)', overflow: 'hidden' 
          }}>
            {/* 회전하는 빛 레이어 */}
            <div style={{ 
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', 
              background: 'conic-gradient(transparent, transparent, transparent, #00e5cc)', 
              animation: 'borderRotate 4s linear infinite', transformOrigin: 'center' 
            }} />

            {/* 내부 폼 카드 */}
            <div style={{ 
              background: 'rgba(2, 12, 22, 0.92)', backdropFilter: 'blur(40px)', 
              borderRadius: '26.5px', padding: '48px 44px', position: 'relative', zIndex: 2 
            }}>
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <img src={logoImg} alt="MDTS Logo" style={{ width: '86px', height: '86px', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
                <h3 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '0.3px', marginBottom: '7px', color: '#fff' }}>MDTS</h3>
                <p style={{ fontSize: '20.8px', color: 'rgba(0, 200, 180, 0.75)', fontWeight: '600' }}>
                  바다 위 어디서든, 멈추지 않는 의료 AI
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <LoginInput icon={<Database size={20}/>} placeholder="시리얼 넘버" value={loginData.serial} onChange={v => setLoginData({...loginData, serial: v})} focused={focusedField === 'serial'} onFocus={() => setFocusedField('serial')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Settings size={20}/>} placeholder="기기 번호" value={loginData.device} onChange={v => setLoginData({...loginData, device: v})} focused={focusedField === 'device'} onFocus={() => setFocusedField('device')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Ship size={20}/>} placeholder="선박 번호" value={loginData.ship} onChange={v => setLoginData({...loginData, ship: v})} focused={focusedField === 'ship'} onFocus={() => setFocusedField('ship')} onBlur={() => setFocusedField(null)} />
                
                <button type="submit" style={{
                  marginTop: '10px', padding: '22px', borderRadius: '18px', 
                  background: 'linear-gradient(90deg, #00c9b1, #00a8e8)', color: '#000', 
                  border: 'none', fontWeight: '900', fontSize: '19px', cursor: 'pointer',
                  boxShadow: '0 4px 28px rgba(0, 200, 180, 0.4)'
                }}>
                  시스템 접속
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes borderRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function StatItem({ val, label }) {
  return (
    <div>
      <div style={{ fontSize: '26px', fontWeight: '950', color: '#fff', lineHeight: '1', letterSpacing: '-0.5px' }}>{val}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '3px' }}>{label}</div>
    </div>
  )
}

function LoginInput({ icon, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px', padding: '0 20px', 
      border: `1.5px solid ${focused ? '#00e5cc' : 'rgba(255, 255, 255, 0.08)'}`,
      height: '60px', transition: 'all 0.2s',
      boxShadow: focused ? '0 0 15px rgba(0, 229, 200, 0.1)' : 'none'
    }}>
      <div style={{ color: focused ? '#00e5cc' : '#64748b', transition: 'color 0.2s' }}>{icon}</div>
      <input
        placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', fontWeight: '500' }}
      />
    </div>
  )
}
