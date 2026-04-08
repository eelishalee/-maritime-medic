import { useState } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'

export default function App() {
  const [auth, setAuth] = useState(true)
  const [page, setPage] = useState('main')
  
  // 환자 기본 데이터 (김선원, 55세, 기관장)
  const [activePatient, setActivePatient] = useState({
    id: 'S2026-026', name: '김선원', age: 55, role: '기관장', blood: 'A+',
    dob: '1971-08-22', height: 174, weight: 76,
    chronic: '고혈압, 고지혈증',
    allergies: '아스피린 (민감)',
    lastMed: '암로디핀 (08:00)',
    location: '기관실 제2엔진 인근 데크',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  })

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  return (
    <Layout activePage={page} onPageChange={setPage}>
      {page === 'main' && activePatient && <Main patient={activePatient} />}
      {page === 'crew' && (
        <CrewManagement 
          onSelectPatient={(p) => {
            setActivePatient(p);
            setPage('main');
          }} 
        />
      )}
      {page === 'emergency' && <Emergency />}
      {page === 'settings' && <Settings />}
    </Layout>
  )
}
