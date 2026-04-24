import { useState, useEffect } from 'react'
import DashboardView from './Main/components/DashboardView'

export default function Main({ patient, onNavigate }) {
  // ─── 바이탈 데이터 상태 ───
  const [hr, setHr] = useState(patient?.hr || 82)
  const [spo2] = useState(patient?.spo2 || 98)
  const [rr] = useState(17)
  const [bp, setBp] = useState(patient?.bp || '128/84')
  const [bt, setBt] = useState(patient?.temp || '36.7')

  // ─── AI 어시스턴트 상태 ───
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState([
    {
      role: 'ai',
      text: `박기관 기관장 (55세, 고혈압·고지혈증) 환자 데이터가 로드되었습니다.\n\n⚠ 현재 사고 발생 중 — 기관실 제2엔진 추락 외상. 즉각 대응이 필요합니다.`
    },
    {
      role: 'user',
      text: '환자 현재 상태 요약'
    },
    {
      role: 'ai',
      text: `📋 현재 상태 요약\n\n• 사고 경위 : 기관실 제2엔진 점검 중 약 1.8m 추락\n• 주요 소견 : 좌측 흉부 압통, 어깨 변형, 호흡 시 통증 심화\n\n[CONFIDENCE: 91%]\n[EVIDENCE: 좌측 제4-6 늑골의 비정상적 굴곡(Step-off) 및 비대칭적 흉벽 움직임 포착]\n[GUIDE: SOP-TRA-01]`
    }
  ])

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState(null)

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
    onNavigate && onNavigate('emergency', { type })
  }

  // ─── 외상 촬영 및 분석 ───
  const handleTraumaAnalysis = () => {
    setIsScanning(true)
    setScanError(null)
    
    setTimeout(() => {
      // 30% 확률로 분석 실패 (디자인 테스트용)
      if (Math.random() < 0.3) {
        setScanError('LOW_LIGHT')
        return
      }

      setIsScanning(false)
      onNavigate && onNavigate('emergency', { 
        traumaType: 'TRAUMA',
        analysis: '다발성 늑골 골절 및 기흉 의심',
        evidence: '좌측 흉부 영상에서 늑골 배열의 불연속성 포착'
      })
    }, 1500)
  }

  // ─── 바이탈 수동 수정 핸들러 ───
  const handleBpEdit = () => {
    const newVal = window.prompt('새로운 혈압 수치를 입력하세요 (예: 120/80)', bp)
    if (newVal) setBp(newVal)
  }

  const handleBtEdit = () => {
    const newVal = window.prompt('새로운 체온 수치를 입력하세요 (예: 36.5)', bt)
    if (newVal) setBt(newVal)
  }

  return (
    <DashboardView
      activePatient={patient}
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
      handleTraumaAnalysis={handleTraumaAnalysis}
      isScanning={isScanning}
      setIsScanning={setIsScanning}
      scanError={scanError}
      setScanError={setScanError}
      onBpEdit={handleBpEdit}
      onBtEdit={handleBtEdit}
      setBp={setBp}
      setBt={setBt}
    />
  )
}

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  if (t.includes('혈압') || t.includes('고혈압'))
    return `분석 결과 : 혈압 ${patient?.bp || '158/95'} mmHg\n고혈압 기저질환 감안 시 외상 통증 반응 범위 내에 있습니다.\n\n[CONFIDENCE: 88%]\n[EVIDENCE: 기저질환(고혈압) 데이터와 현재 심박수 상승 패턴의 상관관계 분석 결과]\n[GUIDE: SOP-MED-02]`
  
  if (t.includes('산소') || t.includes('spo2'))
    return `분석 결과 : SpO₂ ${patient?.spo2 || 94}% (주의)\n정상 하한 미달 상태로 적극적 산소 공급이 필요합니다.\n\n[CONFIDENCE: 94%]\n[EVIDENCE: 흉부 외상으로 인한 Guarding(보호적 얕은 호흡) 및 SpO2 하락 경향성 포착]\n[GUIDE: SOP-AIR-03]`

  if (t.includes('골절') || t.includes('늑골') || t.includes('쇄골'))
    return `진단 : 좌측 늑골 다발성 골절 및 쇄골 골절 의심\n\n[CONFIDENCE: 91%]\n[EVIDENCE: 영상 분석상 좌측 쇄골 중위부 Step-off 변형 및 제4,5늑골 피하 기종 양상 포착]\n[GUIDE: SOP-TRA-01]`

  return `${patient?.name || '환자'} 선원의 실시간 바이탈을 분석 중입니다.\n구체적인 증상이나 처치 가이드에 대해 질문해 주세요.\n\n[CONFIDENCE: 100%]\n[EVIDENCE: 실시간 센서 데이터 정상 수신 중]\n[GUIDE: SOP-GEN-01]`
}
