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

  // ─── 환자 교체 시 상태 초기화 ───
  useEffect(() => {
    if (!patient) return
    
    // 선원별로 고유한 베이스라인 바이탈 설정 (데이터가 없는 경우를 위한 다양성 부여)
    const seed = patient.id.split('-').pop() || '0'
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
    
    setChat(getInitialChat(patient))
    setPrompt('')
  }, [patient])

  // ─── 외상 분석 상태 ───
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState(null)

  // ─── 실시간 바이탈 시뮬레이션 (모든 바이탈에 미세 변화 적용) ───
  useEffect(() => {
    const t = setInterval(() => {
      setHr(h => Math.max(60, Math.min(110, h + Math.round((Math.random() - 0.5) * 2))))
      setSpo2(s => {
        const val = parseFloat(s)
        return Math.max(94, Math.min(100, val + (Math.random() - 0.5) * 0.2)).toFixed(1)
      })
      setRr(r => Math.max(12, Math.min(22, r + Math.round((Math.random() - 0.5) * 1))))
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
      onSwitchPatient={onSwitchPatient}
    />
  )
}

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  const name = patient?.name || '환자'
  const bp = patient?.bp || patient?.vitals?.bp || '120/80'
  const hr = patient?.hr || patient?.vitals?.hr || 80
  const spo2 = patient?.spo2 || patient?.vitals?.spo2 || 98
  const temp = patient?.temp || patient?.vitals?.temp || 36.5
  const chronic = (patient?.chronic || '').toLowerCase()
  const allergies = patient?.allergies || '없음'
  const role = patient?.role || '선원'
  const loc = patient?.location || '미지정'
  const sbp = parseInt(bp.split('/')[0]) || 120

  // ── 심정지 / CPR ──
  if (t.includes('심정지') || t.includes('cpr') || t.includes('심폐소생') || t.includes('쓰러') || t.includes('의식없'))
    return `⚠ 심정지 의심 — 즉각 행동 필요\n\n${name} 선원의 의식·호흡을 즉시 확인하십시오.\n\n처치 순서 :\n1. 어깨를 두드리며 반응 확인\n2. 반응 없으면 주변에 AED 요청\n3. 가슴 중앙 강하게 30회 압박 (100~120회/분)\n4. AED 도착 시 즉시 부착·작동\n\n${chronic.includes('고혈압') ? `⚠ 기저질환(고혈압) 보유자 — 아드레날린 반응 가능성 고려\n` : ''}알레르기 : ${allergies}\n\n[CONFIDENCE: 97%]\n[EVIDENCE: 의식 손실 + 심박 미감지 패턴]\n[GUIDE: SOP-CPR-01]`

  // ── 혈압 / 고혈압 ──
  if (t.includes('혈압') || t.includes('고혈압') || t.includes('bp'))
    return `혈압 분석 : ${bp} mmHg\n\n${sbp >= 160 ? `⚠ 수축기 ${sbp}mmHg — 고혈압성 위기 범위입니다. 즉시 안정시키고 원격 의료팀에 연락하십시오.` : sbp >= 140 ? `주의 : 수축기 ${sbp}mmHg — 고혈압 범위. 안정 유지 및 모니터링이 필요합니다.` : `현재 혈압은 정상 범위입니다.`}\n\n${chronic.includes('고혈압') ? `기저질환(고혈압) 보유자로 복용 약물(${patient?.lastMed || '미확인'}) 투여 여부를 확인하십시오.\n` : ''}권장 조치 : 반좌위(45°) 유지, 15분 간격 재측정, 스트레스·통증 자극 최소화\n알레르기(${allergies}) 확인 후 진통제 투여 검토\n\n[CONFIDENCE: 91%]\n[EVIDENCE: 현재 BP ${bp} + 기저질환 이력 교차 분석]\n[GUIDE: SOP-MED-02]`

  // ── 산소포화도 / 호흡 ──
  if (t.includes('산소') || t.includes('spo2') || t.includes('호흡') || t.includes('숨'))
    return `산소포화도 분석 : SpO₂ ${spo2}%\n\n${Number(spo2) < 90 ? `🚨 위험 : SpO₂ ${spo2}% — 즉시 원격 의료팀에 연락하십시오.` : Number(spo2) < 95 ? `⚠ 주의 : SpO₂ ${spo2}% — 정상 하한 미달. 원격 의료팀 연결을 준비하십시오.` : `SpO₂ ${spo2}% — 정상 범위입니다.`}\n\n처치 가이드 :\n• 기도 개방(머리 기울이기-턱 올리기)\n• 체위 : 상체 30° 거상\n• 호흡음 청진으로 기흉 여부 확인\n• 안정 취하게 하고 불필요한 움직임 제한\n${loc.includes('기관') || loc.includes('엔진') ? '• 기관실 환경 → 유해가스 흡입 가능성 배제, 신선한 공기 있는 곳으로 이동\n' : ''}\n[CONFIDENCE: 94%]\n[EVIDENCE: SpO₂ 추세 + 호흡수 ${hr} 패턴 분석]\n[GUIDE: SOP-AIR-03]`

  // ── 골절 / 외상 ──
  if (t.includes('골절') || t.includes('늑골') || t.includes('쇄골') || t.includes('뼈') || t.includes('부러'))
    return `외상 분석 : 골절 의심\n\n${name} 선원(${loc} 근무) 골절 관련 처치 지침:\n\n처치 순서 :\n1. 다친 부위 손으로 받쳐 고정\n2. 나무판·박스로 부목 제작 후 위아래 관절 포함 고정\n3. 얼음팩(수건에 싸서) 15분 냉찜질\n4. 손발끝 혈색·온도 확인 (창백 시 부목 즉시 이완)\n\n⚠ 주의 : 척추 손상 의심 시 절대 이동 금지\n${chronic.includes('고혈압') ? '혈압 상승 → 통증 반응 가능성, 진통제 투여 검토\n' : ''}\n[CONFIDENCE: 89%]\n[EVIDENCE: 외상 기전 + 부위 촉진 소견 종합]\n[GUIDE: SOP-FRC-04]`

  // ── 출혈 / 지혈 ──
  if (t.includes('출혈') || t.includes('피') || t.includes('지혈') || t.includes('상처'))
    return `출혈 처치 지침\n\n${name} 선원 출혈 대응 프로토콜:\n\n처치 순서 :\n1. 위생 장갑 착용 후 옷을 잘라 출혈 부위 노출\n2. 멸균 거즈(없으면 깨끗한 천)로 강하게 직접 압박\n   → 거즈 젖어도 절대 떼지 말고 덧댈 것\n3. 출혈 부위를 심장보다 높게 거상\n4. 직접 압박 5분 후에도 지혈 안 될 시 지혈대(T-kit) 적용\n   → 적용 시각을 환자 이마에 반드시 기록\n\n⛔ 금기 : 상처에 박힌 이물질 억지로 제거 금지\n알레르기(${allergies}) 확인 필수\n\n[CONFIDENCE: 93%]\n[EVIDENCE: 출혈 기전 + 바이탈 추세 분석]\n[GUIDE: SOP-BLD-02]`

  // ── 화상 ──
  if (t.includes('화상') || t.includes('뜨거') || t.includes('불'))
    return `화상 처치 지침\n\n처치 순서 :\n1. 12~25°C 흐르는 물로 20분 이상 냉각 (얼음 금지)\n2. 가위로 의복 제거 (피부에 달라붙은 옷은 주변만 자름)\n3. 부종 전에 반지·시계 즉시 제거\n4. 열감이 가라앉은 후 화상 연고 도포 + 느슨하게 거즈 덮기\n5. 환부 심장보다 거상, 수분 공급\n\n⚠ 안면 화상·연기 흡입 시 → 즉시 원격 의료팀 연결\n⛔ 민간요법(된장·치약) 절대 금지\n${chronic.includes('당뇨') ? '⚠ 당뇨 기저질환 → 감염 위험 높음, 드레싱 상태 집중 관찰\n' : ''}\n[CONFIDENCE: 96%]\n[EVIDENCE: 화상 처치 프로토콜 적용]\n[GUIDE: SOP-BRN-08]`

  // ── 발열 / 체온 ──
  if (t.includes('열') || t.includes('체온') || t.includes('발열') || t.includes('오한'))
    return `체온 분석 : ${temp}°C\n\n${Number(temp) >= 39 ? `🚨 고열(${temp}°C) — 패혈증 가능성. 즉시 원격 의료팀 연결 필요.` : Number(temp) >= 38 ? `⚠ 발열(${temp}°C) — 감염 의심. 원격 의료팀에 투약 지시 요청.` : `체온 정상 범위(${temp}°C)입니다.`}\n\n처치 지침 :\n• 미온수 수건으로 겨드랑이·사타구니 냉각\n• 투약 필요 시 원격 의료팀 지시에 따라 시행 (알레르기 : ${allergies})\n• 수분 충분히 공급\n• 30분 간격 체온 재측정\n\n${chronic.includes('당뇨') ? '⚠ 당뇨 환자 → 감염 악화 속도 빠름, 집중 관찰 필요\n' : ''}\n[CONFIDENCE: 88%]\n[EVIDENCE: 체온 ${temp}°C + 감염 지표 패턴 분석]\n[GUIDE: SOP-FVR-05]`

  // ── 의식 / 기절 ──
  if (t.includes('의식') || t.includes('기절') || t.includes('졸도') || t.includes('반응없') || t.includes('깨어나'))
    return `의식 저하 대응 지침\n\n${name} 선원 의식 상태 평가 (AVPU):\n• A (Alert) : 자발적 눈 뜸\n• V (Voice) : 부르면 반응\n• P (Pain) : 꼬집을 때만 반응\n• U (Unresponsive) : 반응 없음 → 즉시 CPR 준비\n\n처치 순서 :\n1. 기도 확보 (머리 기울이기-턱 올리기)\n2. 자발 호흡 확인\n3. 회복 자세로 옆으로 눕히기\n4. 혈당 측정 가능 시 저혈당 여부 확인\n\n${chronic.includes('당뇨') ? '⚠ 당뇨 기저질환 → 저혈당성 의식 저하 가능성 우선 확인\n' : ''}${chronic.includes('고혈압') ? '⚠ 고혈압 기저질환 → 뇌졸중 가능성 배제 필요\n' : ''}\n[CONFIDENCE: 92%]\n[EVIDENCE: 의식 수준 평가 + 기저질환 교차 분석]\n[GUIDE: SOP-UNC-04]`

  // ── 통증 / 흉통 ──
  if (t.includes('통증') || t.includes('흉통') || t.includes('가슴') || t.includes('아파') || t.includes('고통'))
    return `통증 평가 : ${name} 선원\n\n통증 위치에 따른 판단 :\n• 가슴(흉부) → 심근경색·협심증·기흉 의심 → 즉각 처치\n• 복부(상복부) → 위궤양·췌장염 가능성\n• 등·허리 → 근골격계 또는 신장 관련\n\n현재 바이탈 : HR ${hr}bpm · BP ${bp} · SpO₂ ${spo2}%\n${sbp >= 150 || Number(hr) > 100 ? '⚠ 혈압·심박 상승 → 심장 관련 원인 우선 고려\n' : ''}${chronic.includes('고혈압') ? `기저질환(고혈압) 보유자 → 심혈관 원인 배제 필수\n` : ''}\n즉시 조치 :\n1. 안정 자세 유지 (반좌위)\n2. 불필요한 움직임 제한, 옷 느슨하게 풀기\n3. 원격 의료팀 즉시 연결\n\n알레르기(${allergies}) 의료팀에 함께 고지\n\n[CONFIDENCE: 87%]\n[EVIDENCE: 통증 패턴 + 현재 바이탈 종합 분석]\n[GUIDE: SOP-PAI-06]`

  // ── 하임리히 / 기도 이물질 ──
  if (t.includes('이물') || t.includes('하임리히') || t.includes('목막') || t.includes('기도막') || t.includes('질식'))
    return `기도 폐쇄 대응 — 즉각 시행\n\n${name} 선원 기도 이물질 처치:\n\n처치 순서 :\n1. 기침 가능 시 → 계속 기침하게 유도\n2. 기침 불가 시 → 하임리히법 즉시 시행\n   • 뒤에서 양팔로 허리를 감쌈\n   • 주먹을 배꼽과 명치 사이에 위치\n   • 안쪽 위(J자) 방향으로 강하게 반복\n3. 의식 잃으면 → 즉시 바닥에 눕히고 CPR 전환\n\n⛔ 금지 : 입안에 손가락 넣어 더듬기\n임산부 → 복부가 아닌 흉부 압박 적용\n\n[CONFIDENCE: 98%]\n[EVIDENCE: 기도 폐쇄 프로토콜]\n[GUIDE: SOP-HEI-07]`

  // ── 익수 / 저체온 ──
  if (t.includes('익수') || t.includes('저체온') || t.includes('물에') || t.includes('빠졌') || t.includes('떨어'))
    return `익수·저체온 대응 지침\n\n${name} 선원 저체온 처치:\n\n처치 순서 :\n1. 바람 없는 따뜻한 곳으로 이동\n2. 젖은 옷 가위로 제거 후 마른 수건으로 닦기\n3. 담요로 전신 감싸기\n4. 온팩을 겨드랑이·사타구니·목에 적용\n5. 의식 있으면 따뜻한 단 음료 소량 제공\n\n⚠ 절대 금지 :\n• 팔다리 주무르기 (차가운 혈액이 심장으로)\n• 뜨거운 물 직접 담그기\n• 갑작스러운 자세 변경\n\n현재 체온 : ${temp}°C\n${Number(temp) < 35 ? '🚨 심부 저체온증 — 즉시 원격 의료팀 연결\n' : ''}\n[CONFIDENCE: 95%]\n[EVIDENCE: 저체온 기전 + 체온 데이터 분석]\n[GUIDE: SOP-HYP-05]`

  // ── 알레르기 / 두드러기 ──
  if (t.includes('알레르기') || t.includes('두드러기') || t.includes('아나필') || t.includes('부어'))
    return `알레르기 반응 평가 : ${name} 선원\n\n등록된 알레르기 : ${allergies}\n\n경증(두드러기·가려움) 처치 :\n• 원인 물질 즉시 차단\n• 증상 악화 여부 모니터링\n• 원격 의료팀에 투약 지시 요청\n\n중증(호흡곤란·혈압저하·의식저하) — 아나필락시스 :\n1. 즉시 원격 의료팀 연결\n2. 수평 자세 유지 (다리 거상)\n3. 기도 개방 확인 (머리 기울이기-턱 올리기)\n4. 의식 잃으면 즉시 CPR 준비\n\n⚠ ${allergies !== '없음' ? `등록 알레르기(${allergies}) 유발 약물 투여 절대 금지` : '알레르기 이력 없음 — 첫 반응 가능성 주의'}\n\n[CONFIDENCE: 93%]\n[EVIDENCE: 알레르기 이력 + 증상 패턴 분석]\n[GUIDE: SOP-ANA-09]`

  // ── 약물 / 투약 ──
  if (t.includes('약') || t.includes('투약') || t.includes('처방') || t.includes('복용'))
    return `투약 안내 : ${name} 선원\n\n현재 복용 약물 : ${patient?.lastMed || '미확인'}\n기저질환 : ${patient?.chronic || '없음'}\n알레르기 : ${allergies}\n\n⚠ 투약 전 필수 확인 사항 :\n1. 알레르기 성분 포함 여부\n2. 기존 복용 약물과의 상호작용\n3. 현재 바이탈 상태 (HR ${hr}, BP ${bp})\n\n⚠ 투약 주의 :\n• 원격 의료팀 처방 없이 임의 투약 금지\n• 투약이 필요한 경우 반드시 원격 의료팀 지시 후 시행\n\n즉시 조치 :\n1. 원격 의료팀 연결\n2. 현재 증상과 바이탈 고지\n3. 알레르기(${allergies}) 및 기저질환 정보 전달\n\n[CONFIDENCE: 90%]\n[EVIDENCE: 투약 이력 + 알레르기 데이터 분석]\n[GUIDE: SOP-MED-03]`

  // ── 구토 / 메스꺼움 ──
  if (t.includes('구토') || t.includes('메스꺼') || t.includes('울렁') || t.includes('토') )
    return `소화기 증상 평가 : ${name} 선원\n\n처치 지침 :\n1. 반측위(옆으로 눕히기) → 흡인 방지\n2. 구토 후 입안 헹구기\n3. 탈수 예방 — 소량 수분 자주 공급\n4. 복부 촉진으로 압통 부위 확인\n\n주의 징후 (즉각 보고) :\n• 혈액 섞인 구토 (커피찌꺼기 색)\n• 심한 복통 동반\n• 의식 저하\n\n현재 바이탈 : HR ${hr} · BP ${bp}\n${sbp < 90 ? '⚠ 저혈압 → 탈수성 쇼크 가능성 주의\n' : ''}증상 지속 시 원격 의료팀 연결, 알레르기(${allergies}) 함께 고지\n\n[CONFIDENCE: 84%]\n[EVIDENCE: 소화기 증상 패턴 분석]\n[GUIDE: SOP-GAS-10]`

  // ── 어지러움 / 현기증 ──
  if (t.includes('어지') || t.includes('현기') || t.includes('핑') || t.includes('쓰러질'))
    return `현기증 평가 : ${name} 선원\n\n원인별 감별 :\n• 기립성 저혈압 : 갑작스런 자세 변화 후 발생\n• 저혈당 : 식사 미섭취, 당뇨 환자 주의\n• 내이 문제 : 회전감 동반\n• 심혈관 원인 : 고혈압·부정맥 동반\n\n현재 바이탈 : BP ${bp} · HR ${hr} · SpO₂ ${spo2}%\n${chronic.includes('고혈압') ? '⚠ 고혈압 기저질환 → 혈압 변동 확인 필수\n' : ''}${chronic.includes('당뇨') ? '⚠ 당뇨 기저질환 → 즉시 혈당 측정 필요\n' : ''}\n즉시 조치 : 앉히거나 눕히기, 낙상 방지, 활력징후 재측정\n\n[CONFIDENCE: 82%]\n[EVIDENCE: 현기증 감별 진단 + 바이탈 데이터]\n[GUIDE: SOP-DZZ-11]`

  // ── 기본 응답 ──
  const alertItems = []
  if (sbp >= 140) alertItems.push(`혈압 ${bp}mmHg (고혈압 범위)`)
  if (Number(spo2) < 95) alertItems.push(`SpO₂ ${spo2}% (정상 하한 미달)`)
  if (Number(hr) > 100) alertItems.push(`심박수 ${hr}bpm (빈맥)`)
  if (Number(temp) >= 38) alertItems.push(`체온 ${temp}°C (발열)`)

  return `${name} ${role} 선원 현재 바이탈\n\n• 심박수 : ${hr} bpm\n• 혈압 : ${bp} mmHg\n• 산소포화도 : ${spo2}%\n• 체온 : ${temp}°C\n\n${alertItems.length > 0 ? `⚠ 주의 항목 :\n${alertItems.map(i => `• ${i}`).join('\n')}\n\n` : '현재 바이탈 전 항목 정상 범위입니다.\n\n'}기저질환 : ${patient?.chronic || '없음'} | 알레르기 : ${allergies}\n\n증상이나 처치법에 대해 구체적으로 질문해 주세요.\n예) "혈압이 높아요", "골절 처치법 알려줘", "화상 응급처치"\n\n[CONFIDENCE: 100%]\n[EVIDENCE: 실시간 센서 데이터 수신 중]\n[GUIDE: SOP-GEN-01]`
}

function getInitialChat(patient) {
  const initialMsgs = [
    {
      role: 'ai',
      text: `${patient?.name || '김항해'} ${patient?.role || '선원'} (${patient?.age || '45'}세) 환자 데이터가 로드되었습니다.\n\n⚠ 현재 상황 모니터링 중입니다.`
    }
  ]
  
  try {
    const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
    const latest = records.find(r => r.patientId === patient?.id)
    if (latest) {
      initialMsgs.push({
        role: 'ai',
        text: `📋 최근 저장된 차트 기록 요약\n\n• 주요 증상 : ${latest.mainComplaint}\n• 세부 증상 : ${latest.selectedSymptoms.join(', ') || '관찰 중'}\n• 시행 조치 : ${latest.prescribedMeds.join(', ') || '경과 관찰'}\n\n[CONFIDENCE: 100%]\n[EVIDENCE: 사용자 최종 기록 데이터 동기화 완료]\n[GUIDE: SOP-GEN-01]`
      })
    }
  } catch(e) {}
  
  return initialMsgs
}
