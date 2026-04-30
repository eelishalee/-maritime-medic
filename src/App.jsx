import { useState } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import Patients from './pages/Patients'
import PatientChart from './pages/PatientChart'
import Settings from './pages/Settings'
import { SHIP_INFO, DEVICE_INFO } from './utils/constants'
import { AlertProvider } from './utils/AlertContext'
import parkAvatar from './assets/photo/003.jpeg'

export default function App() {
  const [auth, setAuth] = useState(null)
  const [page, setPage] = useState('main')
  const [activePatient, setActivePatient] = useState({
    id: 'S26-003',
    name: '박기관',
    age: 55,
    role: '기관장',
    dept: '기관부',
    blood: 'B+',
    chronic: '고혈압, 고지혈증',
    allergies: '아스피린',
    contact: '010-2600-0003',
    emergencyName: '양정희',
    emergency: '010-8765-4321 (배우자)',
    avatar: parkAvatar,
    isEmergency: true,
    height: 172,
    weight: 70,
    boardingDate: '2024-03-01',
    location: '엔진 제어실 (ECR)',
    pastHistory: '2021년 고혈압 진단',
    dob: '1971-08-05',
    gender: '남',
    lastMed: '암로디핀 5mg',
    note: '기관실 추락 사고 발생 (늑골 골절 의심)',
    hr: 95,
    bp: '142/88',
    temp: 37.2,
    spo2: 97,
    rr: 18,
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
    <AlertProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <Layout
          activePage={page}
          onNavigate={handleNavigate}
          auth={{ shipNo: auth.ship || 'MV KOREA STAR', deviceNo: auth.device || 'MED-001' }}
          onLogout={() => setAuth(null)}
          isOnline={false}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {page === 'main'      && <Main patient={activePatient} onNavigate={handleNavigate} onSwitchPatient={setActivePatient} />}
          {page === 'crew'      && (
            <CrewManagement onSelectPatient={p => { setActivePatient(p); handleNavigate('chart') }} />
          )}
          {page === 'emergency' && (
            <Emergency
              patient={activePatient}
              initialAction={emergencyData?.traumaType || emergencyData?.type}
              onNavigate={handleNavigate}
            />
          )}
          {page === 'chart'     && (
            <PatientChart patient={activePatient} onNavigate={handleNavigate} onSwitchPatient={setActivePatient} />
          )}
          {page === 'settings'  && <Settings />}
        </div>
      </div>
    </AlertProvider>
  )
}
