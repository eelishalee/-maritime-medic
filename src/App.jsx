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
  const [auth, setAuth] = useState({ serial: 'SN-0001', device: 'MED-01', ship: 'KOREA STAR' })
  const [page, setPage] = useState('main')

  const [activePatient, setActivePatient] = useState({
    id: 'S26-003',
    name: '박기관',
    age: 55,
    role: '기관장',
    dept: '기관부',
    blood: 'B+',
    dob: '1971-08-05',
    height: 172,
    weight: 70,
    chronic: '고혈압, 고지혈증',
    pastHistory: '2021년 고혈압 진단',
    allergies: '아스피린',
    lastMed: '암로디핀 5mg',
    location: '엔진 제어실 (ECR)',
    emergencyName: '양정희',
    emergency: '010-8765-4321 (배우자)',
    emergencyContact: {
      name: '양정희',
      phone: '010-8765-4321',
      relation: '배우자'
    },
    recentHistory: {
      date: '2026-04-10',
      title: '혈압 상승 및 두통',
      detail: '처방 : 혈압조절제 증량\n특이사항 : 원격 진료 통한 상태 확인'
    },
    hr: 82, bp: '128/84', temp: 36.7, spo2: 98,
    avatar: '/CE.jpeg',
    isEmergency: true
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
  )
}
