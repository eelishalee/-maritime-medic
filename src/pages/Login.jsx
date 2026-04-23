import { useState } from 'react'
import { Database, Settings, Ship, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import logoImg from '../assets/logo.png'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  cyan: '#00f7ff',
  success: '#00ffaa',
  info: '#00d4ff',
  purple: '#bc00ff',
}

export default function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ serial: 'SN-0001', device: 'MED-01', ship: 'KOREA STAR' })
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(loginData)
  }

  return (
    <div className="cyber-bg" style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: C.bg, color: C.text, fontFamily: 'Pretendard, sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      
      {/* 배경 그리드 장식 */}
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, #020204 85%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '120px', maxWidth: '1600px', width: '100%', padding: '0 80px', position: 'relative', zIndex: 10 }}>
        
        {/* 좌측 헤드라인 섹션 */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '14px', 
            background: `${C.cyan}11`, padding: '9px 22px', 
            borderRadius: '40px', border: `1px solid ${C.cyan}33`,
            marginBottom: '34px', boxShadow: `0 0 15px ${C.cyan}22`
          }}>
            <Sparkles size={18} color={C.cyan} />
            <span style={{ fontSize: '18px', fontWeight: '800', color: C.cyan, letterSpacing: '2px' }}>MDTS : MEDICAL DIGITISING SYSTEM</span>
          </div>

          <div style={{ marginBottom: '58px' }}>
            <h1 style={{ fontSize: '78px', fontWeight: 950, lineHeight: '1.1', letterSpacing: '-3px', margin: 0, color: '#fff', textShadow: `0 0 30px rgba(255,255,255,0.1)` }}>
              해상 특화 엣지 AI<br />
              <span style={{
                background: `linear-gradient(90deg, ${C.success} 0%, ${C.cyan} 55%, ${C.info} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                display: 'inline-block'
              }}>
                응급 진단 및 처치 가이드
              </span>
            </h1>
            <p style={{ fontSize: '28px', color: C.sub, marginTop: '28px', fontWeight: 600, maxWidth: '800px', lineHeight: 1.5 }}>
              인터넷이 단절된 극한의 해상 환경에서도 <br/>
              선원의 생명을 지키는 최첨단 의료 인공지능 솔루션
            </p>
          </div>

          <div style={{ display: 'flex', gap: '68px' }}>
            <StatItem val="24H" label="실시간 바이탈" />
            <StatItem val="AI 8종" label="응급 상황 분류" />
            <StatItem val="Step 25" label="심층 프로토콜" />
          </div>
        </div>

        {/* 우측 로그인 카드 섹션 */}
        <div style={{ width: '580px', position: 'relative' }}>
          <div style={{ 
            position: 'relative', padding: '2px', borderRadius: '43px', 
            background: `${C.cyan}22`, overflow: 'hidden',
            boxShadow: `0 43px 86px rgba(0,0,0,0.6)`
          }}>
            {/* 회전하는 빛 효과 */}
            <div style={{ 
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', 
              background: `conic-gradient(transparent, transparent, transparent, ${C.cyan})`, 
              animation: 'borderRotate 6s linear infinite', transformOrigin: 'center' 
            }} />

            {/* 내부 폼 카드 */}
            <div style={{ 
              background: 'rgba(5, 7, 15, 0.95)', backdropFilter: 'blur(30px)', 
              borderRadius: '41px', padding: '68px 58px', position: 'relative', zIndex: 2 
            }}>
              <div style={{ textAlign: 'center', marginBottom: '46px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                  <div style={{ width: 144, height: 144, background: `${C.cyan}0d`, borderRadius: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.cyan}33`, boxShadow: `0 0 30px ${C.cyan}22` }}>
                    <img src={logoImg} alt="MDTS Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                  </div>
                </div>
                <h3 style={{ fontSize: '36px', fontWeight: '950', letterSpacing: '2px', marginBottom: '11px', color: '#fff' }}>SYSTEM ACCESS</h3>
                <p style={{ fontSize: '22px', color: C.sub, fontWeight: '700' }}>
                  시스템 인증 정보를 입력하여 접속하십시오
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <LoginInput icon={<Database size={25}/>} placeholder="SERIAL NUMBER" value={loginData.serial} onChange={v => setLoginData({...loginData, serial: v})} focused={focusedField === 'serial'} onFocus={() => setFocusedField('serial')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Settings size={25}/>} placeholder="DEVICE ID" value={loginData.device} onChange={v => setLoginData({...loginData, device: v})} focused={focusedField === 'device'} onFocus={() => setFocusedField('device')} onBlur={() => setFocusedField(null)} />
                <LoginInput icon={<Ship size={25}/>} placeholder="VESSEL NAME" value={loginData.ship} onChange={v => setLoginData({...loginData, ship: v})} focused={focusedField === 'ship'} onFocus={() => setFocusedField('ship')} onBlur={() => setFocusedField(null)} />
                
                <button 
                  type="submit"
                  style={{
                    marginTop: '14px', padding: '28px', borderRadius: '22px', 
                    background: `linear-gradient(90deg, ${C.success}, ${C.cyan})`, color: '#000', 
                    border: 'none', fontWeight: '950', fontSize: '25px', cursor: 'pointer',
                    boxShadow: `0 14px 28px ${C.cyan}44`,
                    transition: '0.2s', letterSpacing: '1px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                >
                  보안 네트워크 접속
                </button>
              </form>

              <div style={{ marginTop: '43px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', color: C.sub, fontSize: '16px', fontWeight: 800 }}>
                <ShieldCheck size={18} /> 암호화된 종단간 연결 활성화됨
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function StatItem({ val, label }) {
  return (
    <div style={{ borderLeft: `3px solid ${C.cyan}`, paddingLeft: '22px' }}>
      <div style={{ fontSize: '46px', fontWeight: '950', color: '#fff', lineHeight: '1', letterSpacing: '-1px', textShadow: `0 0 15px ${C.cyan}44` }}>{val}</div>
      <div style={{ fontSize: '18px', color: C.sub, marginTop: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
    </div>
  )
}

function LoginInput({ icon, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '22px', background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '18px', padding: '0 28px', 
      border: `2px solid ${focused ? C.cyan : C.border}`,
      height: '82px', transition: '0.2s',
      boxShadow: focused ? `0 0 20px ${C.cyan}11` : 'none'
    }}>
      <div style={{ color: focused ? C.cyan : C.sub, transition: 'color 0.2s' }}>{icon}</div>
      <input
        placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '22px', outline: 'none', fontWeight: '700', letterSpacing: '1px' }}
      />
    </div>
  )
}
