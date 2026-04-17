import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import Patients from './pages/Patients'
import Settings from './pages/Settings'

export default function App() {
  const [auth, setAuth] = useState(null)
  const [page, setPage] = useState('main')
  const [capturedImage, setCapturedImage] = useState(null)

  const [activePatient, setActivePatient] = useState({
    id: 'S26-003', name: '박기관', age: 48, role: '기관장', blood: 'B+',
    dob: '1978-05-12', height: 176, weight: 78,
    chronic: '고지혈증, 가벼운 고혈압',
    allergies: '아스피린 (민감)',
    lastMed: '리피토 (21:00)',
    location: '기관실 제2엔진',
    hr: 96, bp: '158/95', temp: 37.6, spo2: 94,
    avatar: '/CE.jpeg'
  })

  // 페이지 전환 로직
  const handleNavigate = (newPage, data = null) => {
    if (newPage === 'emergency') {
      setCapturedImage(data?.image || null)
    } else {
      setCapturedImage(null)
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
      />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {page === 'main'      && <Main patient={activePatient} onNavigate={handleNavigate} />}
        {page === 'patients'  && (
          <Patients onSelectPatient={p => { setActivePatient(p); handleNavigate('main') }} />
        )}
        {page === 'crew'      && (
          <CrewManagement onSelectPatient={p => { setActivePatient(p); handleNavigate('main') }} />
        )}
        {page === 'emergency' && (
          <Emergency patient={activePatient} />
        )}
        {page === 'settings'  && <Settings />}
      </div>
    </div>
  )
}
