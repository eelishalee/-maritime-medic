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

export default function App() {
  const [auth, setAuth] = useState(null)
  const [page, setPage] = useState('main')
// ... (rest of state ...)
  const [activePatient, setActivePatient] = useState({
// ... (rest of patient info ...)
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
