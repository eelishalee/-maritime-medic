import { useState, useEffect } from 'react'
import DashboardView from './Main/components/DashboardView'

export default function Main({ patient }) {
  // ─── 탭 및 상태 관리 ───
  const [activeTab, setActiveTab] = useState('DASHBOARD') // DASHBOARD | GUIDE
  const [activeEmergencyGuide, setActiveEmergencyGuide] = useState('CARDIAC')
  const [activeStep, setActiveStep] = useState(1)

  // ─── 바이탈 데이터 상태 ───
  const [hr, setHr] = useState(patient?.hr || 82)
  const [spo2, setSpo2] = useState(patient?.spo2 || 98)
  const [rr, setRr] = useState(17)
  const [bp, setBp] = useState(patient?.bp || '128/84')
  const [bt, setBt] = useState(patient?.temp || '36.7')

  // ─── AI 어시스턴트 상태 ───
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState([
    { role: 'ai', text: `${patient?.name || '김항해'} 환자의 데이터가 로드되었습니다. 현재 상태에 대해 궁금한 점을 입력하세요.` }
  ])

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)

  // ─── 실시간 바이탈 시뮬레이션 ───
  useEffect(() => {
    const t = setInterval(() => {
      setHr(h => Math.max(60, Math.min(120, h + Math.round((Math.random() - 0.5) * 3))))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  // ─── AI 분석 실행 ───
  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return
    const userMsg = { role: 'user', text: prompt }
    setChat(prev => [...prev, userMsg])
    const q = prompt
    setPrompt('')
    
    setTimeout(() => {
      const reply = getAiReply(q, patient)
      setChat(prev => [...prev, { role: 'ai', text: reply }])
    }, 800)
  }

  // ─── 응급 처치 액션 시작 ───
  const startEmergencyAction = (type) => {
    setActiveEmergencyGuide(type)
    setActiveStep(1)
    setActiveTab('GUIDE')
  }

  // ─── 외상 촬영 및 분석 ───
  const handleTraumaAnalysis = () => {
    setIsScanning(true)
    setScanResult(null)
    setTimeout(() => {
      setScanResult({
        analysis: '열상(Laceration) 및 활동성 출혈 감지',
        action: { type: 'TRAUMA', label: '중증 외상 가이드' }
      })
    }, 2500)
  }

  const confirmTraumaResult = () => {
    if (scanResult) {
      startEmergencyAction(scanResult.action.type)
      setIsScanning(false)
    }
  }

  return (
    <DashboardView 
      activePatient={{
        ...patient,
        history: patient?.chronic || '고혈압 (2022~)\n페니실린 알레르기 있음'
      }}
      activeTab={activeTab}
      hr={hr}
      spo2={spo2}
      rr={rr}
      bp={bp}
      bt={bt}
      chat={chat}
      prompt={prompt}
      setPrompt={setPrompt}
      handlePromptAnalysis={handlePromptAnalysis}
      startEmergencyAction={startEmergencyAction}
      activeEmergencyGuide={activeEmergencyGuide}
      setActiveEmergencyGuide={setActiveEmergencyGuide}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleTraumaAnalysis={handleTraumaAnalysis}
      isScanning={isScanning}
      setIsScanning={setIsScanning}
      scanResult={scanResult}
      confirmTraumaResult={confirmTraumaResult}
    />
  )
}

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  if (t.includes('흉통') || t.includes('가슴')) return `환자의 흉통 증상은 기존 병력과 연관될 수 있습니다. 즉시 심전도 측정 및 원격진료 연결을 권고합니다.`
  if (t.includes('혈압') || t.includes('고혈압')) return `현재 혈압 측정값은 정상 범위입니다. 지속적인 모니터링을 유지하세요.`
  return `현재 ${patient?.name || '환자'}의 활력징후를 분석합니다. 전반적으로 안정적인 상태입니다.`
}
