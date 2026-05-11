import { useState, useEffect, useRef } from 'react'
import DashboardView from './Main/components/DashboardView'
import MainTutorial from './Main/components/MainTutorial'
import { fetchLatestVital, mapVitalToFrontend } from '../utils/api'


export default function Main({ patient, onNavigate, onSwitchPatient, historicalRecord, tutorialShown, setTutorialShown }) {
  // ─── 튜토리얼 상태 ───
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (!tutorialShown) {
      const t = setTimeout(() => setShowTutorial(true), 600)
      return () => clearTimeout(t)
    }
  }, [tutorialShown])

  const finishTutorial = () => {
    setTutorialShown(true)
    setShowTutorial(false)
  }

  // ─── 바이탈 데이터 상태 ───
  const [hr, setHr] = useState('-')
  const [spo2, setSpo2] = useState('-')
  const [rr, setRr] = useState('-')
  const [bp, setBp] = useState('-')
  const [bt, setBt] = useState('-')

  // ─── AI 어시스턴트 상태 ───
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState([])

  // ─── 데이터 동기화 ───
  useEffect(() => {
    if (!patient) return

    if (patient.id === 'S26-003') {
      // 박기관: 하드코딩
      setHr(patient.hr || 95)
      setSpo2(patient.spo2 || 97)
      setRr(patient.rr || 18)
      setBp(patient.bp || '142/88')
      setBt(patient.temp || '37.2')
    } else {
      // 나머지 선원: 초기값 '-' (측정 전)
      setHr('-'); setSpo2('-'); setRr('-'); setBp('-'); setBt('-');
      // API에서 실제 센서 데이터 조회
      const crewDbId = patient.crewDbId || parseInt(patient.id?.split('-').pop());
      fetchLatestVital(crewDbId).then(data => {
        if (data) {
          const v = mapVitalToFrontend(data);
          setHr(v.hr); setSpo2(v.spo2); setRr(v.rr); setBp(v.bp); setBt(v.temp);
        }
      }).catch(() => {});
    }

    setChat(getInitialChat(patient))
    setPrompt('')
  }, [patient?.id, historicalRecord?.timestamp])

  // 실시간 바이탈 폴링 (박기관 제외)
  useEffect(() => {
    if (!patient || patient.id === 'S26-003') return;
    const crewDbId = patient.crewDbId || parseInt(patient.id?.split('-').pop());
    const poll = setInterval(() => {
      fetchLatestVital(crewDbId).then(data => {
        if (data) {
          const v = mapVitalToFrontend(data);
          setHr(v.hr); setSpo2(v.spo2); setRr(v.rr); setBp(v.bp); setBt(v.temp);
        }
      }).catch(() => {});
    }, 5000);
    return () => clearInterval(poll);
  }, [patient?.id]);

  // 렌더링 시점에 환자 정보 확장 (최근 기록 주입)
  const getActivePatientWithHistory = () => {
    if (!patient) return null
    try {
      const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
      const latestRecord = records.find(r => r.patientId === patient.id)
      if (latestRecord) {
        return {
          ...patient,
          recentHistory: {
            date: new Date(latestRecord.timestamp).toLocaleDateString('ko-KR'),
            title: latestRecord.mainComplaint || '진료 기록',
            detail: `• 증상: ${(latestRecord.selectedSymptoms || []).join(', ') || '없음'}\n• 처치: ${(latestRecord.prescribedMeds || []).join(', ') || '없음'}\n• 특이: ${latestRecord.otherActions || '없음'}`
          }
        }
      }
    } catch (e) {}
    return patient
  }

  const activePatientWithHistory = getActivePatientWithHistory()

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState(null) // 'scanning' | 'success' | 'error' | 'refer'
  const [scanError, setScanError] = useState(null)
  const [scanResult, setScanResult] = useState(null) // { label: '절상', labelEn: 'Laceration', confidence: 98 }
  const [lowConfidencePopup, setLowConfidencePopup] = useState(false)
  const isScanningRef = useRef(false)
  const scanTimerRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '2' && isScanningRef.current) {
        e.preventDefault()
        if (scanTimerRef.current) {
          clearInterval(scanTimerRef.current)
          scanTimerRef.current = null
        }
        isScanningRef.current = false
        setIsScanning(false)
        setScanStatus(null)
        setLowConfidencePopup(true)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])



  // ─── 박기관 전용: 실시간 바이탈 시뮬레이션 ───
  useEffect(() => {
    if (!patient || patient.id !== 'S26-003') return;
    const t = setInterval(() => {
      setHr(h => {
        const val = typeof h === 'number' ? h : parseInt(h)
        if (isNaN(val)) return '-'
        return Math.max(60, Math.min(110, val + Math.round((Math.random() - 0.5) * 2)))
      })
      setSpo2(s => {
        const val = parseFloat(s)
        if (isNaN(val)) return '-'
        return Math.max(94, Math.min(100, val + (Math.random() - 0.5) * 0.2)).toFixed(1)
      })
      setRr(r => {
        const val = typeof r === 'number' ? r : parseInt(r)
        if (isNaN(val)) return '-'
        return Math.max(12, Math.min(22, val + Math.round((Math.random() - 0.5) * 1)))
      })
    }, 3000)
    return () => clearInterval(t)
  }, [patient?.id])

  // ─── AI 분석 실행 ───
  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return
    const userMsg = { role: 'user', text: prompt }
    setChat(prev => [...prev, userMsg])
    const q = prompt
    setPrompt('')
    
    // TODO: [BACKEND] 실제 AI 추론 서버(LLM API) 호출 및 환자 컨텍스트(patient 데이터) 전달 로직 구현 필요
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
    isScanningRef.current = true
    setIsScanning(true)
    setScanStatus('scanning')
    setScanProgress(0)
    setScanError(null)
    
    let p = 0
    scanTimerRef.current = setInterval(() => {
      p += Math.random() * 8 + 4
      if (p >= 100) {
        clearInterval(scanTimerRef.current)
        scanTimerRef.current = null
        setScanProgress(100)
        setTimeout(() => {
          // 실제 AI 모델 연동 시 이 값을 모델 응답으로 교체
          const results = [
            { label: '절상', labelEn: 'Laceration', confidence: 98 },
            { label: '자창', labelEn: 'Stab Wound', confidence: 96 },
            { label: '열상', labelEn: 'Tear', confidence: 94 },
            { label: '화상', labelEn: 'Burn', confidence: 99 },
            { label: '타박상', labelEn: 'Bruise', confidence: 92 },
            { label: '찰과상', labelEn: 'Abrasion', confidence: 95 }
          ]
          const randomResult = results[Math.floor(Math.random() * results.length)]
          setScanResult(randomResult)
          setScanStatus('success')
        }, 600)
      } else {
        setScanProgress(p)
      }
    }, 80)
  }

  const confirmTraumaAnalysis = () => {
    isScanningRef.current = false
    setIsScanning(false)
    setScanStatus(null)
    onNavigate && onNavigate('emergency', {
      traumaType: scanResult?.labelEn || 'TRAUMA',
    })
  }

  return (
    <>
      <DashboardView
        activePatient={activePatientWithHistory}
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
        setIsScanning={(v) => { isScanningRef.current = v; setIsScanning(v) }}
        scanProgress={scanProgress}
        scanStatus={scanStatus}
        setScanStatus={setScanStatus}
        scanError={scanError}
        setScanError={setScanError}
        scanResult={scanResult}
        confirmTraumaAnalysis={confirmTraumaAnalysis}
        onLowConfidenceAlert={() => setLowConfidencePopup(true)}
        setBp={setBp}
        setBt={setBt}
        onSwitchPatient={onSwitchPatient}
      />
      {showTutorial && <MainTutorial onFinish={finishTutorial} />}


      {lowConfidencePopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(2, 15, 25, 0.98)', border: '2px solid rgba(139,92,246,0.4)',
            borderRadius: 32, padding: '52px 56px', maxWidth: 520, width: '90%',
            boxShadow: '0 0 80px rgba(139,92,246,0.2)', textAlign: 'center',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(139,92,246,0.1)', border: '2px solid #8b5cf6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px', fontSize: 36
            }}>🩺</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.5, marginBottom: 20 }}>
              정확한 판단을 위해<br/>의료진 확인이 필요한 상태입니다.
            </div>
            <div style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.8, fontWeight: 600 }}>
              현재 상태는 AI 분석만으로는<br/>판단이 조심스러운 단계입니다.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── 초기 채팅 생성 ───
function getInitialChat(patient) {
  if (!patient) return []

  const chronic = patient.chronic || '없음'
  const allergies = patient.allergies || '없음'
  const note = patient.note || ''

  // 환자별 외상 시나리오 메시지 맵
  const scenarios = {
    'S26-003': [
      { role: 'ai', text: `박기관 기관장님의 바이탈 데이터 동기화가 완료되었습니다.\n\n[상태 요약]\n• 사고: 기계실 파이프 정비 중 파손된 파편에 우측 팔꿈치 아래가 깊게 베임\n• 손상: 약 6cm 가량의 깊은 절상 — 선홍색 피가 솟구치는 활동성 출혈 관찰\n• 상태: 사고 직후 빠른 압박 지혈로 현재는 출혈이 멎었으나 환부 주변이 부어오름\n• 주의: 고혈압이 있으며 지혈 상태를 15분 간격으로 재확인해야 함` },
      { role: 'ai', text: `[MDTS 권고사항]\n• 상처 부위를 심장보다 높게 유지하여 혈류 압력을 낮추세요\n• 지혈대를 사용했다면 착용 시각을 반드시 기록하고, 멸균 거즈로 환부를 보호하세요\n• 통증 조절을 위해 타이레놀 500mg을 복용시키되, 아스피린 알레르기가 있으므로 주의하세요\n• 환부 원위부(손끝)의 맥박과 감각을 30분마다 체크하세요\n\n[신뢰도: 96%] [가이드: 깊은 절상 및 출혈 대응]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[기록된 처치 내역 — 박기관 / 14:38~15:10]

① 지혈 및 세척
   → 생리식염수로 상처 내 이물질을 깨끗이 씻어냄
   → 멸균 거즈 도포 후 탄력 붕대로 압박 지혈 완료 (현재 출혈 멎음)

② 약 먹임
   → 아스피린 대신 타이레놀 500mg 한 알 복용함 (알레르기 대응)

③ 상처 관찰
   → 환부 주변 부종(부기) 관찰되나 손가락 감각 및 움직임은 정상임
   → 15분마다 거즈가 젖어드는지(재출혈) 확인 예정

④ 환경 조성
   → 안정을 위해 침상으로 이동 후 우측 팔을 거상(높게 들기) 상태로 유지` },
    ],
  }

  // 박기관(S26-003)만 하드코딩 채팅 반환, 나머지는 빈 배열
  return scenarios[patient.id] || []
}

// ─── AI 답변 시뮬레이션 ───
function getAiReply(q, patient) {
  if (!patient) return "대상 환자가 선택되지 않았습니다."
  
  const chronic = patient.chronic || '없음'
  const allergies = patient.allergies || '없음'

  if (q.includes('안녕')) return "안녕하세요. MDTS 응급 처치 가이드입니다. 무엇을 도와드릴까요?"
  if (q.includes('상태') || q.includes('어때')) return `현재 ${patient.name} 환자의 상태를 분석 중입니다. 기저 질환인 ${chronic}에 유의하며 모니터링을 유지하십시오.`
  if (q.includes('약') || q.includes('처방')) return `${patient.name} 환자는 ${allergies} 알레르기가 있으므로 처치 안내 시 주의가 필요합니다.`
  
  return `분석 결과 :\n• 대상 : ${patient.name} (${patient.role})\n• 특이사항 : ${chronic !== '없음' ? '기저 질환 관찰 필요' : '특이 기저질환 없음'}\n• 주의 : 알레르기 (${allergies})\n\n[ACCURACY: 92%]\n[EVIDENCE: 통합 환자 데이터 연동 및 실시간 바이탈 패턴 분석]\n[GUIDE: SOP-GEN-01]`
}
