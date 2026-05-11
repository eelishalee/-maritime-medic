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
    'S26-001': [
      { role: 'ai', text: `이선장 선장님의 바이탈 데이터 동기화가 완료되었습니다.\n\n[상태 요약]\n• 사고: 항해 브릿지 계단에서 미끄러져 머리 오른쪽을 강하게 부딪힘\n• 상처: 머리 가죽이 약 4cm 찢어져 피가 나고 있음\n• 상태: 잠시 정신이 흐릿했다가 돌아옴 — 충격으로 인한 뇌진탕 증세 관찰\n• 혈압이 높으므로 머리 내부 압력이 올라가지 않도록 주의가 필요함` },
      { role: 'ai', text: `[MDTS 권고사항]\n• 머리를 움직이지 않게 하고 조용히 쉬게 하세요\n• 상처 부위를 깨끗한 거즈로 꾹 눌러서 피를 멈추게 하세요\n• 15분마다 눈동자 움직임, 구토 여부, 정신이 맑은지 확인하세요\n• 아스피린은 피하고 타이레놀(아세트아미노펜)을 주시는 것이 안전합니다\n\n[신뢰도: 95%] [가이드: 머리 부상 대응]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[기록된 처치 내역 — 이선장 / 11:15~11:40]

① 지혈(피 멈춤) 처치
   → 거즈로 15분간 꾹 눌러 피가 멈춘 것을 확인
   → 붕대로 머리를 감싸 고정 완료

② 약 먹임
   → 타이레놀 500mg 한 알 복용 (혈압약과 같이 먹어도 안전함 확인)
   → 평소 드시는 혈압약 그대로 복용 유지

③ 상태 확인
   → 눈동자 움직임 양쪽 모두 정상, 사물이 두 개로 보이지 않음
   → 정신이 완전히 맑아진 상태임 (정상 대화 가능)

④ 관찰 지시
   → 15분마다 정신 상태와 혈압 체크
   → 토하거나 두통이 심해지면 즉시 다시 알려주세요` },
    ],
    'S26-002': [
      { role: 'ai', text: `김항해 1등 항해사의 바이탈 데이터 동기화가 완료되었습니다.\n\n[상태 요약]\n• 사고: 화물 고박 작업 중 튕겨 나온 와이어에 왼쪽 팔뚝을 강하게 맞음\n• 손상: 왼쪽 손목 위 뼈가 부러진 것으로 보임 — 많이 부어 있고 팔 모양이 휘어짐\n• 상태: 겉으로 드러난 상처는 없으나, 손끝까지 피가 잘 통하는지 확인이 필요함\n• 주의: 페니실린 항생제에 부작용이 있으므로 약 사용 시 주의해야 함` },
      { role: 'ai', text: `[MDTS 권고사항]\n• 부목을 대서 팔꿈치부터 손목까지 움직이지 않게 고정하고 심장보다 높게 들어주세요\n• 부기를 빼기 위해 20분 정도 찬찜질을 하세요 (얼음을 살에 직접 대지는 마세요)\n• 페니실린 약은 절대 쓰지 말고 다른 종류의 항생제를 사용하세요\n• 30분마다 손가락 끝이 저린지, 맥박이 잘 뛰는지 확인하세요\n\n[신뢰도: 93%] [가이드: 뼈 부러짐 대응]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[기록된 처치 내역 — 김항해 / 13:22~13:55]

① 뼈 고정
   → 팔 전체에 부목을 대어 고정 완료
   → 삼각건을 이용해 팔을 가슴 높이로 매달아 둠

② 찬찜질
   → 수건으로 감싼 찬 팩을 20분간 적용함

③ 약 먹임
   → 진통제(이부프로펜) 400mg 복용
   → 페니실린 부작용 환자로 영구 등록함

④ 손끝 확인
   → 30분 후 맥박 정상 확인, 손가락 감각 돌아옴
   → 육지에 있는 의사에게 상담 요청 보냄` },
    ],
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
    'S26-004': [
      { role: 'ai', text: `최갑판 갑판장의 바이탈 데이터 동기화가 완료되었습니다.\n\n[외상 초기 분석]\n• 사고: 선수 갑판 중량물 하역 중 800kg 파렛트 낙하로 좌측 하퇴부 압궤\n• 좌측 경골 골절 의심 — 심한 변형 및 부종\n• 기저 허리디스크로 척추 2차 손상 가능성 주의\n• 쇼크 전구 증상(창백·냉한·빈맥) 모니터링 중` },
      { role: 'ai', text: `[MDTS 긴급 권고]\n• 하지 부목 고정 및 거상 유지\n• 출혈 의심 시 지혈대 적용 (착용 시각 기록 필수)\n• 수액 라인 확보 — 저혈량 쇼크 대비\n• 척추 보호대 착용 후 이동 (디스크 기저력 감안)\n\n[CONFIDENCE: 94%] [GUIDE: SOP-FX-03]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[시행된 처치 내역 — 최갑판 / 09:45~10:20]

① 지혈 및 고정
   → 지혈대 적용 (착용 시각 09:58 기록)
   → 전신 부목 고정 완료, 하지 거상 유지

② 쇼크 대응
   → 정맥 라인 확보 (우측 전완부)
   → 생리식염수 500mL 급속 투여
   → HR 108 → 96으로 안정화 확인

③ 척추 보호
   → 경추 보호대 및 척추 보드 착용 완료

④ 통증 관리
   → 아세트아미노펜 500mg 경구 투여` },
    ],
    'S26-008': [
      { role: 'ai', text: `윤조리 조리장의 바이탈 데이터 동기화가 완료되었습니다.\n\n[외상 초기 분석]\n• 사고: 조리실 고압 증기 배관 파열로 우측 상지·안면부 2~3도 화상\n• 화상 범위 약 12% BSA (체표면적) 추정\n• 수포 형성 및 삼출액 관찰 — 감염 위험 높음\n• 기저 당뇨로 상처 회복 지연 및 감염 합병증 위험 증가` },
      { role: 'ai', text: `[MDTS 긴급 권고]\n• 흐르는 물 20분 냉각 즉시 시행 (얼음 금지)\n• 수포 절대 터뜨리지 말 것\n• 멸균 거즈로 느슨하게 덮고 연고 도포\n• 당뇨 환자 — 혈당 급등 가능, 1시간 간격 혈당 모니터링\n• 12% 이상 화상: 수액 보충 필수 (Parkland formula 적용)\n\n[CONFIDENCE: 97%] [GUIDE: SOP-BRN-08]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[시행된 처치 내역 — 윤조리 / 10:30~11:15]

① 냉각 처치
   → 흐르는 물(15~20℃) 20분 냉각 완료

② 드레싱
   → 수포 보존 — 멸균 거즈 느슨하게 도포
   → 은 성분 항균 드레싱 시트 적용

③ 수액 보충
   → Parkland formula 기반 수액 3,648mL 계획
   → 첫 8시간 1,824mL 링거 젖산액 투여 개시

④ 감염 예방 및 혈당 관리
   → 세팔로스포린 항생제 투여
   → 혈당 168 → 142 mg/dL 추세 확인
   → 1시간 간격 혈당 모니터링 지속` },
    ],
    'S26-005': [
      { role: 'ai', text: `정조타 조타사의 바이탈 데이터 동기화가 완료되었습니다.\n\n[외상 초기 분석]\n• 사고: 악천후 항해 중 급격한 선체 롤링으로 조타실 계기판에 복부 강타\n• 우상복부 압통 및 근육 방어 반응 — 간·비장 둔상 가능성 검토\n• 육안 출혈 없음, 내부 출혈 징후 지속 관찰 필요\n• 알레르기(조개류) 확인 — 해산물 성분 수액 사용 주의` },
      { role: 'ai', text: `[MDTS 긴급 권고]\n• 절대 안정 및 금식 지시 (복부 외상 원칙)\n• 복부 촉진 시 반발 압통 여부 확인 — 복막염 배제\n• 활력징후 15분 간격 모니터링 (저혈압·빈맥 = 내출혈 경보)\n• 조개류 유래 성분 약물·수액 투여 금지\n\n[CONFIDENCE: 92%] [GUIDE: SOP-ABD-04]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[시행된 처치 내역 — 정조타 / 16:10~16:45]

① 안정 및 금식
   → 침상 안정 지시, 금식 시행
   → 무릎 굴곡 자세로 복부 근육 이완

② 복부 평가
   → 반발 압통 경미 — 복막염 초기 배제
   → 장음 청진 정상 — 장폐색 현재 배제

③ 약물 투여
   → 아세트아미노펜 500mg 경구 투여
   → 조개류 유래 성분 수액 금지 확인

④ 모니터링
   → HR 98 · BP 112/72 유지
   → 15분 간격 활력징후 측정` },
    ],
    'S26-012': [
      { role: 'ai', text: `서기관 3등 기관사의 바이탈 데이터 동기화가 완료되었습니다.\n\n[외상 초기 분석]\n• 사고: 청정기실 연료유 필터 교체 작업 중 고압 오일 역류 분사\n• 우측 안면부 및 양손 오일 화상 (1~2도)\n• 우측 안구 이물질 진입 — 시력 저하 및 충혈 호소\n• 초임 사관 — 보호구 미착용 가능성 확인 필요` },
      { role: 'ai', text: `[MDTS 긴급 권고]\n• 안구 세척: 생리식염수 500mL로 15분 이상 즉시 세척\n• 눈 비비지 말 것, 패치 착용 금지 (압박 금기)\n• 안면 화상 부위 흐르는 물 냉각 15분 후 멸균 드레싱\n• 땅콩 알레르기 확인 — 투약 전 성분 확인 필수\n• 원격 안과 진료 연결 요청\n\n[CONFIDENCE: 91%] [GUIDE: SOP-EYE-02]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[시행된 처치 내역 — 서기관 / 08:45~09:25]

① 안구 세척
   → 생리식염수 500mL 지속 세척 15분 완료
   → 안대·패치 착용 금지 유지

② 안면·수부 화상 처치
   → 흐르는 물 냉각 15분 완료
   → 멸균 거즈 드레싱 (비접착형)

③ 약물 투여
   → 아세트아미노펜 500mg 경구 (땅콩 성분 없음 확인)

④ 원격 진료
   → 안과 자문 요청 전송 완료
   → 응답 대기 중 — 시력 악화 시 즉시 재평가` },
    ],
  }

  if (scenarios[patient.id]) return scenarios[patient.id]

  // 기본 더미 — 기저질환/알레르기/응급 여부 기반 자동 생성
  const msgs = []
  msgs.push({
    role: 'ai',
    text: `${patient.name} ${patient.role}님의 바이탈 데이터 동기화가 완료되었습니다.\n\n[초기 분석 요약]\n• 기저질환: ${chronic}\n• 알레르기: ${allergies}\n${note && note !== '특이사항 없음' ? `• 특이사항: ${note}` : '• 현재 특이 이상 징후 없음'}`
  })

  try {
    const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
    const lastRecord = records.find(r => r.patientId === patient.id)
    if (lastRecord) {
      msgs.push({
        role: 'ai',
        text: `[가장 최근 기록 요약 - ${new Date(lastRecord.timestamp).toLocaleDateString()}]\n• 주증상: ${lastRecord.mainComplaint || '관찰 중'}\n• 시행 조치: ${(lastRecord.prescribedMeds || []).join(', ') || '경과 관찰'}\n\n상태 변화를 지속적으로 체크하고 있습니다.`
      })
    } else if (patient.isEmergency) {
      msgs.push({
        role: 'ai',
        text: `[MDTS 긴급 권고]\n• 현재 집중 관리 대상으로 등록되어 있습니다.\n• 알레르기(${allergies}) 확인 후 처방하십시오.\n• 이상 징후 감지 시 응급 처치 가이드를 즉시 활성화하십시오.\n\n[CONFIDENCE: 88%]`
      })
    } else {
      msgs.push({
        role: 'ai',
        text: `[MDTS 자동 권고]\n• ${chronic !== '없음' ? `${chronic} 관련 정기 점검을 유지하십시오.` : '특별한 기저질환 없음 — 정상 모니터링 중입니다.'}\n• 알레르기(${allergies}) 투약 주의 플래그가 설정되어 있습니다.\n\n[CONFIDENCE: 90%]`
      })
    }
  } catch (e) {
    console.error("채팅 초기화 오류:", e)
  }

  return msgs
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
