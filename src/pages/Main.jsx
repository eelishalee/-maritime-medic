import { useState, useEffect } from 'react'
import DashboardView from './Main/components/DashboardView'
import MainTutorial from './Main/components/MainTutorial'

export default function Main({ patient, onNavigate, onSwitchPatient, historicalRecord }) {
  // ─── 튜토리얼 상태 ───
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // [테스트 모드] 확인을 위해 매번 노출되도록 설정
    const t = setTimeout(() => setShowTutorial(true), 600)
    return () => clearTimeout(t)
  }, [])

  const finishTutorial = () => {
    // localStorage.setItem('mdts_tutorial_seen_v2', 'true') // 테스트 중에는 저장하지 않음
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

  // ─── 환자 데이터 및 과거 기록 로드 로직 ───
  const [activePatientWithHistory, setActivePatientWithHistory] = useState(patient)

  useEffect(() => {
    if (!patient) return

    let latestRecord = null
    try {
      const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
      latestRecord = records.find(r => r.patientId === patient.id)
    } catch (e) {}

    if (latestRecord) {
      // 사이드바 '최근 진료 이력' 카드에 표시될 데이터 주입
      setActivePatientWithHistory({
        ...patient,
        recentHistory: {
          date: new Date(latestRecord.timestamp).toLocaleDateString('ko-KR'),
          title: latestRecord.mainComplaint || '진료 기록',
          detail: `• 증상: ${(latestRecord.selectedSymptoms || []).join(', ') || '없음'}\n• 처치: ${(latestRecord.prescribedMeds || []).join(', ') || '없음'}\n• 특이: ${latestRecord.otherActions || '없음'}`
        }
      })

      // 바이탈 동기화 (NaN 방지를 위해 fallback 추가)
      setHr(latestRecord.vitals?.hr || '-')
      setSpo2(latestRecord.vitals?.spo2 || '-')
      setRr(latestRecord.vitals?.rr || '-')
      setBp(latestRecord.vitals?.bp || '-')
      setBt(latestRecord.vitals?.temp || '-')
    } else {
      setActivePatientWithHistory(patient)
      
      const seed = patient.id?.split('-').pop() || '0'
      const baseHr = patient.hr || (70 + (parseInt(seed) % 15))
      const baseSpo2 = patient.spo2 || (96 + (parseInt(seed) % 4))
      const baseRr = patient.rr || (14 + (parseInt(seed) % 6))
      const baseBp = patient.bp || `${115 + (parseInt(seed) % 20)}/${75 + (parseInt(seed) % 15)}`
      const baseBt = patient.temp || (36.4 + (parseInt(seed) % 6) / 10).toFixed(1)

      setHr(baseHr)
      setSpo2(baseSpo2)
      setRr(baseRr)
      setBp(baseBp)
      setBt(baseBt)
    }

    // 진단 어시스턴트는 항상 초기 환자 상태 기반으로 설정 (이전 기록 불러오지 않음)
    setChat(getInitialChat(patient))
    setPrompt('')
  }, [patient?.id, historicalRecord?.timestamp])

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState(null) // 'scanning' | 'success' | 'error'
  const [scanError, setScanError] = useState(null)

  // ─── 실시간 바이탈 시뮬레이션 (모든 바이탈에 미세 변화 적용) ───
  useEffect(() => {
    const t = setInterval(() => {
      setHr(h => {
        if (h === '-') return '-'
        const val = typeof h === 'number' ? h : parseInt(h)
        if (isNaN(val)) return '-'
        return Math.max(60, Math.min(110, val + Math.round((Math.random() - 0.5) * 2)))
      })
      setSpo2(s => {
        if (s === '-') return '-'
        const val = parseFloat(s)
        if (isNaN(val)) return '-'
        return Math.max(94, Math.min(100, val + (Math.random() - 0.5) * 0.2)).toFixed(1)
      })
      setRr(r => {
        if (r === '-') return '-'
        const val = typeof r === 'number' ? r : parseInt(r)
        if (isNaN(val)) return '-'
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
    setScanStatus('scanning')
    setScanProgress(0)
    setScanError(null)
    
    let p = 0
    const timer = setInterval(() => {
      p += Math.random() * 8 + 4
      if (p >= 100) {
        clearInterval(timer)
        setScanProgress(100)
        
        setTimeout(() => {
          if (Math.random() < 0.2) {
            setScanStatus('error')
            setScanError('이미지 해상도가 낮거나 조명이 부족하여 분석을 완료할 수 없습니다.')
          } else {
            setScanStatus('success')
          }
        }, 600)
      } else {
        setScanProgress(p)
      }
    }, 80)
  }

  const confirmTraumaAnalysis = () => {
    setIsScanning(false)
    setScanStatus(null)
    onNavigate && onNavigate('emergency', { 
      traumaType: 'TRAUMA',
      analysis: '다발성 늑골 골절 및 기흉 의심',
      evidence: '좌측 흉부 영상에서 늑골 배열의 불연속성 포착'
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
        setIsScanning={setIsScanning}
        scanProgress={scanProgress}
        scanStatus={scanStatus}
        setScanStatus={setScanStatus}
        scanError={scanError}
        setScanError={setScanError}
        confirmTraumaAnalysis={confirmTraumaAnalysis}
        setBp={setBp}
        setBt={setBt}
        onSwitchPatient={onSwitchPatient}
      />
      {showTutorial && <MainTutorial onFinish={finishTutorial} />}
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
      { role: 'ai', text: `박기관 기관장님의 바이탈 데이터 동기화가 완료되었습니다.\n\n[상태 요약]\n• 사고: 계단 3층 높이(약 2.5m)에서 바닥으로 떨어짐\n• 손상: 오른쪽 가슴을 누르면 몹시 아파함 — 갈비뼈가 여러 개 부러진 것으로 의심됨\n• 상태: 숨을 쉴 때마다 가슴이 아파서 얕고 빠르게 숨을 몰아쉬는 상태임\n• 주의: 고혈압이 있고 아스피린에 알레르기가 있음` },
      { role: 'ai', text: `[MDTS 권고사항]\n• 가슴 주위를 압박 붕대로 감싸서 통증을 줄여주세요\n• 아스피린은 절대 주지 말고 타이레놀 500mg으로 대체하세요\n• 환자가 편안하게 숨을 쉴 수 있도록 상체를 45도 정도 일으켜 세워주세요\n• 숨소리가 작아지거나 입술이 파래지는지 계속 지켜보세요\n\n[신뢰도: 96%] [가이드: 가슴 부상 대응]` },
      { role: 'user', text: '처치 내용 기록해줘' },
      { role: 'ai', text: `[기록된 처치 내역 — 박기관 / 14:38~15:10]

① 가슴 고정
   → 탄력 붕대로 오른쪽 가슴 부위를 고정함
   → 환자가 숨쉬기 편하게 상체를 약간 일으킨 자세 유지

② 약 먹임
   → 아스피린 대신 타이레놀 500mg 한 알 복용함

③ 호흡 관찰
   → 현재 산소 수치는 정상임
   → 호흡 곤란 증상이 심해지는지 밀착 감시 중

④ 숨소리 확인
   → 양쪽 폐의 숨소리가 모두 들림 — 폐에 구멍이 난 증거는 없음
   → 30분마다 숨소리 다시 체크 예정` },
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

  if (q.includes('안녕')) return "안녕하세요. MDTS 어시스턴트입니다. 무엇을 도와드릴까요?"
  if (q.includes('상태') || q.includes('어때')) return `현재 ${patient.name} 환자의 상태는 안정적입니다. 기저 질환인 ${chronic}에 유의하며 모니터링 중입니다.`
  if (q.includes('약') || q.includes('처방')) return `${patient.name} 환자는 ${allergies} 알레르기가 있으므로 처방 시 주의가 필요합니다.`
  
  return `분석 결과 :\n• 대상 : ${patient.name} (${patient.role})\n• 특이사항 : ${chronic !== '없음' ? '기저 질환 관리 필요' : '특이 기저질환 없음'}\n• 주의 : 알레르기 (${allergies})\n\n[CONFIDENCE: 92%]\n[EVIDENCE: 통합 환자 DB 연동 및 실시간 바이탈 패턴 분석]\n[GUIDE: SOP-GEN-01]`
}
