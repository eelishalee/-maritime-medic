import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import AIAnalysis from './pages/AIAnalysis'
import Settings from './pages/Settings'
import Patients from './pages/Patients'

// 골든타임 매핑 (분)
const GOLDEN_TIME = {
  cardiac: 90,
  stroke:  270,
  bleed:   30,
  default: 60,
}

function getGoldenKey(patient) {
  if (!patient) return 'default'
  const c = (patient.chronic || '').toLowerCase()
  if (c.includes('고혈압') || (patient.hr && patient.hr > 90)) return 'cardiac'
  if (c.includes('뇌') || c.includes('혈전')) return 'stroke'
  return 'default'
}

export default function App() {
  const [auth, setAuth] = useState(false)
  const [authInfo, setAuthInfo] = useState(null)
  const [page, setPage] = useState('main')
  const [emergencyStart] = useState(Date.now())

  const [activePatient, setActivePatient] = useState({
    id: 'S2026-026', name: '김태양', age: 55, role: '기관장', blood: 'A+',
    dob: '1971-08-22', height: 174, weight: 76, gender: '남',
    chronic: '고혈압, 고지혈증',
    allergies: '아스피린 (과민반응)',
    lastMed: '암로디핀 5mg (08:00)',
    location: '기관실 제2엔진 인근 데크 B-4',
    contact: '010-1001-0026',
    emergency: '이미래 (배우자) 010-2001-0026',
    embark: '2024-01-10',
    note: '심근경색 과거력 (2022년). 정기 투약 중.',
    hr: 96, bp: '158/95', temp: 37.6, spo2: 94,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  })

  // 남은 골든타임 계산 (초)
  const [goldenLeft, setGoldenLeft] = useState(() => {
    const key = getGoldenKey(activePatient)
    return GOLDEN_TIME[key] * 60
  })
  useEffect(() => {
    const t = setInterval(() => setGoldenLeft(g => Math.max(0, g - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogin = (info) => {
    setAuthInfo(info)
    setAuth(true)
  }

  if (!auth) return <Login onLogin={handleLogin} />

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <Layout
        activePage={page}
        onNavigate={setPage}
        auth={authInfo}
        goldenLeft={goldenLeft}
        patient={activePatient}
      />
      <div style={{ flex:1, overflow:'hidden' }}>
        {page === 'main'      && <Main patient={activePatient} onNavigate={setPage} />}
        {page === 'patients'  && <Patients onSelectPatient={p => { setActivePatient(p); setPage('main') }} />}
        {page === 'crew'      && <CrewManagement onSelectPatient={p => { setActivePatient(p); setPage('main') }} />}
        {page === 'emergency' && <Emergency patient={activePatient} />}
        {page === 'ai'        && <AIAnalysis patient={activePatient} onNavigate={setPage} />}
        {page === 'settings'  && <Settings auth={authInfo} />}
      </div>
    </div>
  )
}
