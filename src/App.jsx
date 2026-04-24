import { useState } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import Patients from './pages/Patients'
import PatientChart from './pages/PatientChart'
import Settings from './pages/Settings'

export default function App() {
  const [auth, setAuth] = useState(null)
  const [page, setPage] = useState('main')

  const [activePatient, setActivePatient] = useState({
    id: 'S2026-026',
    name: '박기관',
    age: 55,
    role: '기관장',
    blood: 'A+',
    dob: '1971-04-23',
    height: 178,
    weight: 82,
    chronic: '고혈압 (2022~), 고지혈증',
    history: '고혈압 (2022~)\n페니실린 알레르기 있음',
    allergies: '페니실린 알레르기 있음',
    lastMed: '암로디핀 (08:00)',
    workLocation: '제2엔진실 (Engine Room B2)',
    emergencyContact: {
      name: '양정희',
      phone: '010-8765-4321',
      relation: '배우자'
    },
    recentHistory: {
      date: '2026-03-15',
      title: '단순 감기',
      detail: '처방 : 타이레놀 500mg\n특이사항 : 알레르기 반응 없음'
    },
    hr: 82, bp: '128/84', temp: 36.7, spo2: 98,
    avatar: '/CE.jpeg'
  })

  const [emergencyData, setEmergencyData] = useState(null)

  // 페이지 전환 로직
  const handleNavigate = (newPage, data = null) => {
    if (newPage === 'emergency') {
      setEmergencyData(data)
    } else {
      setEmergencyData(null)
    }
    setPage(newPage)
  }

  if (!auth) return <Login onLogin={setAuth} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Layout
        activePage={page}
        onNavigate={handleNavigate}
        auth={{ shipNo: auth.ship || 'MV KOREA STAR', deviceNo: auth.device || 'MED-001' }}
        onLogout={() => setAuth(null)}
        isOnline={page !== 'emergency'}
      />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {page === 'main'      && <Main patient={activePatient} onNavigate={handleNavigate} />}
        {page === 'crew'      && (
          <CrewManagement onSelectPatient={p => { setActivePatient(p); handleNavigate('main') }} />
        )}
        {page === 'emergency' && (
          <Emergency 
            patient={activePatient} 
            initialAction={emergencyData?.traumaType || emergencyData?.type} 
            onNavigate={handleNavigate}
          />
        )}
        {page === 'chart'     && (
          <PatientChart patient={activePatient} />
        )}
        {page === 'settings'  && <Settings />}
      </div>
    </div>
  )
}
