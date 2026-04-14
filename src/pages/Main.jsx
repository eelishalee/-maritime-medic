import { useState, useEffect } from 'react'
import { Wifi, WifiOff, LogOut } from 'lucide-react'
import logoImg from '../assets/logo.png'
import MdtsLogo from '../components/MdtsLogo.jsx'
import { NavTab } from '../components/ui/index.jsx'

// 리팩토링된 컴포넌트 및 유틸리티 임포트
import { SHIP_INFO, INITIAL_CREW } from '../utils/constants.js'
import { calculateMEWS } from '../utils/healthUtils.js'
import LoginView from './Main/components/LoginView.jsx'
import DashboardView from './Main/components/DashboardView.jsx'
import CrewView from './Main/components/CrewView.jsx'
import SettingsView from './Main/components/SettingsView.jsx'

export default function Main() {
  const [view, setView] = useState('login')
  const [isOnline, setIsOnline] = useState(true)
  const [crewList, setCrewList] = useState(INITIAL_CREW || [])
  const [activePatient, setActivePatient] = useState(INITIAL_CREW ? INITIAL_CREW[0] : null)
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [mews, setMews] = useState(0)
  
  // States
  const [loginData, setLoginData] = useState({ serial: '', device: '', ship: '' })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [hr, setHr] = useState(82)
  const [spo2, setSpo2] = useState(98)
  const [rr, setRr] = useState(16)
  const [bp, setBp] = useState('128/84')
  const [bt, setBt] = useState('36.7')
  const [chat, setChat] = useState([
    { role: 'ai', text: 'MDTS 엣지 AI 활성화 및 시스템 정상 작동 상태' },
    { role: 'user', text: '환자 심박수 불안정 상태 분석 요청' },
    { role: 'ai', text: '분석 결과 : 최근 5분간 심박수 상승(82→104bpm) 및 산소포화도(98%) 정상 유지. 안색 및 흉부 통증 확인 요망' },
    { role: 'user', text: '가슴 압박 통증 호소 상황 발생' },
    { role: 'ai', text: '위험 신호 감지 : 급성 심근경색(AMI) 가능성 85%. 즉시 응급 처치 실시 및 KMCC 긴급 지원 요청 권고' }
  ])
  const [prompt, setPrompt] = useState('')
  const [activeEmergencyGuide, setActiveEmergencyGuide] = useState('CARDIAC')
  const [activeStep, setActiveStep] = useState(1)

  // Realtime Simulation
  useEffect(() => {
    if (view === 'dashboard') {
      const interval = setInterval(() => {
        setHr(h => h + Math.round((Math.random()-0.5)*4))
        setSpo2(s => Math.min(100, Math.max(90, s + Math.round((Math.random()-0.5)*1))))
        setRr(r => Math.min(30, Math.max(12, r + Math.round((Math.random()-0.5)*2))))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [view])

  useEffect(() => {
    if (bp && bt) {
      setMews(calculateMEWS(hr, rr, bp.split('/')[0], bt))
    }
  }, [hr, rr, bp, bt])

  const handleLogin = (e) => {
    if (e) e.preventDefault()
    setView('dashboard')
  }

  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return
    const newChat = [...chat, { role: 'user', text: prompt }]
    setChat(newChat)
    setPrompt('')
    setTimeout(() => {
      setChat([...newChat, { role: 'ai', text: '분석 결과 : 바이탈 정상 범위 내 유지 중입니다.' }])
    }, 1000)
  }

  const startEmergencyAction = (type) => {
    setActiveEmergencyGuide(type)
    setActiveTab('GUIDE')
    setView('dashboard')
  }

  if (view === 'login') {
    return <LoginView onLogin={handleLogin} loginData={loginData} setLoginData={setLoginData} mousePos={mousePos} setMousePos={setMousePos} />
  }

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', background: '#020408', color: '#e2e8f0', fontFamily: 'Pretendard' }}>
      <header style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 27px', height: 80, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img src={logoImg} alt="MDTS" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: 22 }}>MDTS <span style={{ color: '#38bdf8', fontWeight: 400 }}>엣지 AI</span></span>
        </div>
        <nav style={{ display: 'flex', gap: 8, height: '100%' }}>
          <NavTab label="종합 대시보드" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavTab label="선원 정보 관리" active={view === 'crew'} onClick={() => setView('crew')} />
          <NavTab label="시스템 설정" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 18px', borderRadius: 22, background: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
            {isOnline ? <Wifi size={18} color="#2dd4bf" /> : <WifiOff size={18} color="#fb7185" />}
            <span style={{ fontWeight: 700, color: isOnline ? '#2dd4bf' : '#fb7185' }}>{isOnline ? 'ON LINE' : 'OFF LINE'}</span>
          </div>
          <button 
            onClick={() => setView('login')} 
            className="nav-logout-btn"
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'dashboard' && activePatient && (
          <DashboardView 
            activePatient={activePatient} activeTab={activeTab} 
            hr={hr} spo2={spo2} rr={rr} bp={bp} bt={bt} 
            chat={chat} prompt={prompt} setPrompt={setPrompt} 
            handlePromptAnalysis={handlePromptAnalysis}
            startEmergencyAction={startEmergencyAction}
            activeEmergencyGuide={activeEmergencyGuide}
            setActiveEmergencyGuide={setActiveEmergencyGuide}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleTraumaAnalysis={() => {}}
          />
        )}
        {view === 'crew' && (
          <CrewView 
            crewList={crewList} 
            crewSearch="" setCrewSearch={() => {}}
            crewRoleTab="전체" setCrewRoleTab={() => {}}
            roles={['전체', '선장', '일등항해사', '기관장', '통신장', '조리장', '조타수', '갑판원']}
            filteredCrew={crewList}
            activePatient={activePatient} 
            switchPatient={(c) => { setActivePatient(c); setView('dashboard') }} 
            setShowModal={() => {}}
            setSelectedCrew={() => {}}
          />
        )}
        {view === 'settings' && <SettingsView SHIP_INFO={SHIP_INFO} />}
      </main>

      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .nav-logout-btn:hover { color: #475569 !important; transform: scale(1.05); }
        .nav-logout-btn:active { transform: scale(0.95); }
      `}</style>
    </div>
  )
}
