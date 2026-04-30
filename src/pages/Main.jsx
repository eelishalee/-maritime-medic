import { useState, useEffect } from 'react'
import DashboardView from './Main/components/DashboardView'

export default function Main({ patient, onNavigate, onSwitchPatient }) {
  // ─── 바이탈 데이터 상태 ───
  const [hr, setHr] = useState(patient?.hr || 82)
  const [spo2, setSpo2] = useState(patient?.spo2 || 98)
  const [rr, setRr] = useState(patient?.rr || 17)
  const [bp, setBp] = useState(patient?.bp || '128/84')
  const [bt, setBt] = useState(patient?.temp || '36.7')

  // ─── AI 어시스턴트 상태 ───
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState(() => getInitialChat(patient))

  // 환자 교체 시 상태 초기화 (Render-time adjustment)
  const [prevPatientId, setPrevPatientId] = useState(patient?.id)
  if (patient?.id !== prevPatientId) {
    setPrevPatientId(patient?.id)
    
    // 선원별로 고유한 베이스라인 바이탈 설정
    const seed = patient?.id?.split('-').pop() || '0'
    const baseHr = patient?.hr || (70 + (parseInt(seed) % 15))
    const baseSpo2 = patient?.spo2 || (96 + (parseInt(seed) % 4))
    const baseRr = patient?.rr || (14 + (parseInt(seed) % 6))
    const baseBp = patient?.bp || `${115 + (parseInt(seed) % 20)}/${75 + (parseInt(seed) % 15)}`
    const baseBt = patient?.temp || (36.4 + (parseInt(seed) % 6) / 10).toFixed(1)

    setHr(baseHr)
    setSpo2(baseSpo2)
    setRr(baseRr)
    setBp(baseBp)
    setBt(baseBt)
    
    // 채팅 초기화
    setChat(getInitialChat(patient))
    setPrompt('')
  }

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState(null)

  // ─── 실시간 바이탈 시뮬레이션 (모든 바이탈에 미세 변화 적용) ───
  useEffect(() => {
    const t = setInterval(() => {
      setHr(h => {
        const val = typeof h === 'number' ? h : parseInt(h)
        return Math.max(60, Math.min(110, val + Math.round((Math.random() - 0.5) * 2)))
      })
      setSpo2(s => {
        const val = parseFloat(s)
        return Math.max(94, Math.min(100, val + (Math.random() - 0.5) * 0.2)).toFixed(1)
      })
      setRr(r => {
        const val = typeof r === 'number' ? r : parseInt(r)
        return Math.max(12, Math.min(22, val + Math.round((Math.random() - 0.5) * 1)))
      })
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
      setBp={setBp}
      setBt={setBt}
      onSwitchPatient={onSwitchPatient}
    />
  )
}

// ─── 초기 채팅 생성 ───
function getInitialChat(patient) {
  if (!patient) return []
  const initialMsgs = [
    { role: 'ai', text: `안녕하세요. ${patient.name} ${patient.role}님의 현재 바이탈 데이터 동기화가 완료되었습니다. 질문이나 분석이 필요하시면 말씀해 주세요.` }
  ]
  
  try {
    const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
    const lastRecord = records.find(r => r.patientId === patient.id)
    if (lastRecord) {
      initialMsgs.push({
        role: 'ai',
        text: `[가장 최근 기록 요약 - ${new Date(lastRecord.timestamp).toLocaleDateString()}]\n• 주증상 : ${lastRecord.mainComplaint || '관찰 중'}\n• 시행 조치 : ${lastRecord.prescribedMeds.join(', ') || '경과 관찰'}\n\n상태 변화를 지속적으로 체크하고 있습니다.`
      })
    } else {
      const chronic = patient.chronic || '기록 없음'
      const allergies = patient.allergies || '없음'
      const temp = patient.temp || 36.5
      initialMsgs.push({
        role: 'ai',
        text: `현재 환자 정보 :\n• 기저 질환 : ${chronic}\n• 알레르기 : ${allergies}\n• 기초 활력 징후 : 체온 ${temp}°C\n\n특별한 이상 징후 발생 시 실시간 분석 리포트를 제공하겠습니다.`
      })
    }
  } catch(err) {
    console.error("Initial chat load failed:", err)
  }
  
  return initialMsgs
}

// ─── AI 답변 시뮬레이션 ───
function getAiReply(q, patient) {
  if (!patient) return "대상 환자가 선택되지 않았습니다."
  
  const chronic = patient.chronic || '없음'
  const allergies = patient.allergies || '없음'

  if (q.includes('안녕')) return "안녕하세요. MDTS 어시스턴트입니다. 무엇을 도와드릴까요?"
  if (q.includes('상태') || q.includes('어때')) return `현재 ${patient.name} 환자의 상태는 안정적입니다. 기저 질환인 ${chronic}에 유의하며 모니터링 중입니다.`
  if (q.includes('약') || q.includes('처방')) return `${patient.name} 환자는 ${allergies} 알레르기가 있으므로 처방 시 주의가 필요합니다.`
  
  return `분석 결과 :\n• 대상 : ${patient.name} (${patient.role})\n• 특이사항 : ${chronic !== '없음' ? '기저 질환 관리 필요' : '특이 기저질환 없음'}\n• 주의 : 알레르기 (${allergies})\n\n[CONFIDENCE: 92%]\n[EVIDENCE: 통합 환자 DB 연동 및 실시간 바이탈 패턴 분석]\n[GUIDE: SOP-GEN-01]`
}
