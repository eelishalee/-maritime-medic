import { useState } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'
import Main from './pages/Main'
import PatientChart from './pages/PatientChart'
import CrewManagement from './pages/CrewManagement'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'
import CameraModal from './components/CameraModal'
import MaritimeBackground from './components/MaritimeBackground'

const PAGES = {
  main: Main,
  chart: PatientChart,
  crew: CrewManagement,
  emergency: Emergency,
  settings: Settings,
}

export default function App() {
  const [auth, setAuth] = useState(null) // { serialNo, deviceNo, shipNo }
  const [activePage, setActivePage] = useState('main')
  const [showCamera, setShowCamera] = useState(false)
  const PageComponent = PAGES[activePage] || Main

  if (!auth) {
    return <Login onLogin={setAuth} />
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden', position: 'relative' }}>
      <MaritimeBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Layout
        activePage={activePage}
        onNavigate={setActivePage}
        auth={auth}
      />
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <PageComponent key={activePage} />
      </main>

      {/* Floating camera button */}
      <button
        onClick={() => setShowCamera(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(13,217,197,0.4)',
          zIndex: 100, fontSize: 22,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        title="외상 촬영 — AI 분석"
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(13,217,197,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,217,197,0.4)' }}
      >
        📷
      </button>

      {showCamera && <CameraModal onClose={() => setShowCamera(false)} />}
      </div>
    </div>
  )
}
