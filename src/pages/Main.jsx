import { useState, useEffect } from 'react'
import DashboardView from './Main/components/DashboardView'

export default function Main({ patient, onNavigate }) {
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
    {
      role: 'ai',
      text: `김선원 기관장 (55세, 고혈압·고지혈증) 환자 데이터가 로드되었습니다.\n\n⚠ 현재 사고 발생 중 — 기관실 제2엔진 추락 외상. 즉각 대응이 필요합니다.`
    },
    {
      role: 'user',
      text: '환자 현재 상태 요약'
    },
    {
      role: 'ai',
      text: `📋 현재 상태 요약\n\n• 사고 경위: 기관실 제2엔진 점검 중 약 1.8m 추락\n• 주요 소견: 좌측 흉부 압통, 어깨 변형, 호흡 시 통증 심화\n• AI 분석: 다발성 늑골·쇄골 골절 의심 (신뢰도 91%)\n• 바이탈: HR 96bpm / BP 158/95 / SpO₂ 94% / BT 37.6°C\n\n⚠ SpO₂ 94% — 저산소 경계선. 산소 공급 최우선.`
    },
    {
      role: 'user',
      text: '진통제 투여 가능 여부'
    },
    {
      role: 'ai',
      text: `💊 투약 주의사항\n\n• 아스피린 — 절대 금기 (알레르기 등록)\n• 케토로락 30mg 근주 — 09:22 투여 완료\n• 모르핀 계열 — 흉부 손상 시 호흡 억제 위험, 신중 투여 요\n\n권고: 추가 진통 필요 시 원격의료팀 지시 후 시행.`
    },
    {
      role: 'user',
      text: '기흉 동반 가능성'
    },
    {
      role: 'ai',
      text: `🫁 기흉 동반 위험 — 주의 요망\n\n다발성 늑골 골절 환자의 약 20~40%에서 기흉 동반.\n\n확인 징후:\n• 좌측 호흡음 감소 (청진기 확인)\n• 기관 편위 (목 중앙선 이탈)\n• 흉벽 역설적 움직임\n• SpO₂ 지속 하락 (현재 94% 유지 중)\n\n🔴 호흡음 감소 + SpO₂ 추가 하락 시 → 긴장성 기흉 가능. 즉시 원격의료팀 연결.`
    },
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
      const result = {
        analysis: '좌측 늑골 다발성 골절 및 쇄골 골절 의심',
        confidence: 91,
        action: { type: 'TRAUMA', label: '중증 외상 가이드' }
      }
      setScanResult(result)
      setTimeout(() => {
        setIsScanning(false)
        onNavigate && onNavigate('emergency')
      }, 1800)
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
      onBackToDashboard={() => setActiveTab('DASHBOARD')}
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
  if (t.includes('혈압') || t.includes('고혈압'))
    return `혈압 ${patient?.bp || '158/95'} mmHg — 고혈압 기저질환 감안 시 외상 통증 반응 범위입니다.\n현재 암로디핀 복용 중이며 추가 강압제 투여는 원격의료팀 지시 후 시행하세요.`
  if (t.includes('산소') || t.includes('spo2') || t.includes('포화도'))
    return `현재 SpO₂ ${patient?.spo2 || 94}%로 정상 하한(95%) 미달 상태입니다.\n비재호흡 마스크 15L/min 공급을 유지하고, 2분 간격으로 재측정하세요. 93% 이하 하락 시 즉시 보고 바랍니다.`
  if (t.includes('골절') || t.includes('늑골') || t.includes('쇄골'))
    return `AI 분석 결과 좌측 늑골 다발성 골절 및 쇄골 골절 의심 (신뢰도 91%).\n\n처치 원칙:\n• 환부 고정 — 탄력 붕대로 흉부 보조 고정\n• 자가 호흡 유지 중이므로 고정 과도하게 조이지 말 것\n• 이송 시 척추 보드 + 경추 보호대 필수`
  if (t.includes('진통') || t.includes('약') || t.includes('투약'))
    return `⚠ 아스피린 알레르기 등록 — 절대 투여 금지.\n\n현재 케토로락 30mg 근주 완료 (09:22). 추가 진통이 필요할 경우 트라마돌 50mg 경구 또는 근주를 원격의료팀과 협의하세요.`
  if (t.includes('기흉') || t.includes('호흡'))
    return `기흉 의심 체크리스트:\n✓ 좌측 호흡음 감소 여부 청진\n✓ 기관 편위 확인\n✓ SpO₂ 추가 하락 모니터링\n\n현재 SpO₂ 94% 유지 중. 하락세 지속 시 즉시 원격의료팀 연결 및 긴장성 기흉 처치 준비 필요합니다.`
  if (t.includes('이송') || t.includes('헬기') || t.includes('후송'))
    return `현재 해경 헬기 후송 승인 완료 (10:15). 헬기 접근 중.\n\n이송 전 준비사항:\n• 수액 라인 고정 및 투여 지속\n• 경추 보호대·척추 보드 착용 상태 유지\n• 바이탈 기록지 및 투약 로그 출력 준비\n• 수신 병원(흉부외과)에 AI 분석 리포트 사전 전송`
  return `${patient?.name || '환자'} 기관장의 현재 바이탈을 분석합니다.\nHR ${patient?.hr || 96}bpm · BP ${patient?.bp || '158/95'} · SpO₂ ${patient?.spo2 || 94}%\n\n전반적으로 관찰이 필요한 상태입니다. 구체적인 증상이나 처치 관련 질의를 입력하세요.`
}
