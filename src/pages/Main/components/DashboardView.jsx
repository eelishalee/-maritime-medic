import { useState, useEffect, useRef } from 'react'
import { Activity, History, RotateCcw, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, ChevronDown, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize, Thermometer, Wind } from 'lucide-react'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

function getPatientTimeline(patient) {
  if (!patient) return []
  const id = patient.id || ''
  const note = patient.note || ''
  const chronic = patient.chronic || '없음'
  const allergies = patient.allergies || '없음'
  const isEmergency = patient.isEmergency

  // 환자별 시나리오 맵
  const scenarios = {
    'S26-001': [
      { time: '11:15', title: '두부 외상 사고 발생', color: '#f43f5e', detail: `• 위치: 항해 브릿지 내부 계단\n• 미끄러져 우측 측두부 강타 (철제 손잡이)\n• 두피 열상 약 4cm, 출혈 중등도` },
      { time: '11:19', title: '의식 확인 및 도움 요청', color: '#f43f5e', detail: `• 일시적 의식 혼탁 약 30초 후 자발 회복\n• 보조항해사가 발견, 선의 긴급 호출\n• 뇌진탕 의심 — 이동 금지 조치` },
      { time: '11:25', title: '선의 1차 평가', color: '#fb923c', detail: `• 동공 반응 정상, 복시 없음\n• 두통·오심 호소, 구토 1회\n• 기저 고혈압(암로디핀 복용) 확인` },
      { time: '11:33', title: '지혈 처치 및 모니터링 개시', color: '#facc15', detail: `• 두피 열상 직접 압박 지혈 후 멸균 거즈 고정\n• HR 88 · BP 154/96 · SpO₂ 99%\n• 아세트아미노펜 투여 (아스피린 금기)` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 두개내압 상승 징후 감시 모드 활성화` },
    ],
    'S26-002': [
      { time: '13:22', title: '상지 외상 사고 발생', color: '#f43f5e', detail: `• 위치: 메인 데크 화물 관리구역\n• 컨테이너 고박 와이어 로프 반동으로 좌측 전완부 강타\n• 심한 부종 및 변형 관찰, 개방 상처 없음` },
      { time: '13:26', title: '선의 현장 도착', color: '#fb923c', detail: `• 좌측 요골 골절 의심\n• 말초 맥박 감소 없음 — 혈관 손상 배제\n• 페니실린 알레르기 확인 → 대체 항생제 검토` },
      { time: '13:35', title: '부목 고정 및 냉찜질 처치', color: '#facc15', detail: `• 팔꿈치~손목 부목 고정 후 심장 위 거상\n• 냉찜질 20분 적용\n• HR 92 · BP 122/78 · SpO₂ 98%` },
      { time: '13:50', title: '진통 및 경과 관찰', color: '#38bdf8', detail: `• 이부프로펜 400mg 투여 (페니실린 교차 반응 없음)\n• 30분 후 말초 순환·감각 재확인 예정\n• 원격 의료 자문 요청 중` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 페니실린 투약 금지 플래그 활성화` },
    ],
    'S26-003': [
      { time: '14:38', title: '추락 사고 발생', color: '#f43f5e', detail: `• 위치: 엔진 제어실 (ECR) 3층 철제 계단\n• 높이 약 2.5m 낙하 추정\n• 즉각 의식 있음 확인` },
      { time: '14:41', title: '선의 현장 도착 및 1차 평가', color: '#fb923c', detail: `• 우측 흉부 강한 압통 호소\n• 호흡 시 통증 악화 (늑골 골절 의심)\n• 피부 찰과상 다수, 출혈 경미` },
      { time: '14:47', title: '바이탈 측정 및 모니터링 개시', color: '#facc15', detail: `• HR 95 · BP 142/88 · SpO₂ 97%\n• 기저 고혈압 감안 혈압 경계치\n• 산소 투여 준비 지시` },
      { time: '15:02', title: '진통제 투여 및 고정 처치', color: '#38bdf8', detail: `• 아스피린 알레르기 확인 → 투여 금지\n• 아세트아미노펜 500mg 경구 투여\n• 흉부 탄력 압박 붕대 고정` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 실시간 추적 개시` },
    ],
    'S26-004': [
      { time: '09:45', title: '하지 압궤 사고 발생', color: '#f43f5e', detail: `• 위치: 선수 갑판 (Forecastle Deck) 하역 구역\n• 800kg 파렛트 낙하로 좌측 하퇴부 압궤\n• 심한 변형·부종, 개방성 골절 의심` },
      { time: '09:50', title: '출혈 통제 및 선의 호출', color: '#f43f5e', detail: `• 동료 선원이 직접 압박으로 출혈 임시 통제\n• 의식 있음, 극심한 통증 호소\n• 기저 허리디스크 — 척추 손상 동반 배제 필요` },
      { time: '09:58', title: '선의 1차 평가 및 쇼크 예방', color: '#fb923c', detail: `• 좌측 경골 골절 확정 의심\n• HR 108 · BP 98/62 — 저혈량 쇼크 전구\n• 수액 라인 확보, 500mL 생리식염수 투여 개시` },
      { time: '10:12', title: '부목 고정 및 이송 준비', color: '#facc15', detail: `• 전신 부목 고정 후 척추 보호대 착용\n• 지혈대 적용 (착용 시각 09:58 기록)\n• HR 96 · BP 108/70 — 안정화 추세` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 쇼크 경보 모드 활성화` },
    ],
    'S26-008': [
      { time: '10:30', title: '화상 사고 발생', color: '#f43f5e', detail: `• 위치: 상부 데크 조리실 (Galley)\n• 고압 증기 배관 파열 — 우측 상지·안면부 화상\n• 화상 범위 약 12% BSA (2~3도 혼재)` },
      { time: '10:34', title: '냉각 처치 즉시 시행', color: '#fb923c', detail: `• 흐르는 물 20분 냉각 시작\n• 수포 형성 관찰 (2도 화상 확인)\n• 기저 당뇨 — 감염 합병증 위험 경고` },
      { time: '10:55', title: '선의 1차 평가 및 드레싱', color: '#facc15', detail: `• 냉각 완료 후 멸균 거즈 드레싱\n• HR 102 · BP 132/84 · SpO₂ 97%\n• 혈당 측정 168 mg/dL — 스트레스 반응 상승` },
      { time: '11:10', title: '수액 및 감염 예방 처치', color: '#38bdf8', detail: `• Parkland formula 기반 수액 보충 계획 수립\n• 세팔로스포린 항생제 투여 (알레르기 없음)\n• 혈당 1시간 간격 모니터링 지시` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 화상 집중 관리 모드 활성화` },
    ],
    'S26-005': [
      { time: '16:10', title: '복부 둔상 사고 발생', color: '#f43f5e', detail: `• 위치: 조타실 (Wheel House)\n• 악천후 롤링 중 조타 계기판에 우상복부 강타\n• 즉각 극심한 복통 호소, 육안 출혈 없음` },
      { time: '16:14', title: '선의 긴급 호출 및 안정 조치', color: '#f43f5e', detail: `• 의식 명료, 통증으로 기립 불가\n• 우상복부 압통 및 근육 방어 반응\n• 금식 및 절대 안정 지시` },
      { time: '16:22', title: '선의 1차 평가', color: '#fb923c', detail: `• 간·비장 둔상 가능성 검토\n• 반발 압통 경미 — 복막염 초기 배제\n• 알레르기(조개류) 확인 — 수액 성분 점검` },
      { time: '16:35', title: '바이탈 모니터링 및 경과 관찰', color: '#facc15', detail: `• HR 98 · BP 112/72 · SpO₂ 99%\n• 활력징후 15분 간격 체크 지시\n• 아세트아미노펜 경구 투여 (조개류 성분 없음 확인)` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 내출혈 경보 모드 활성화` },
    ],
    'S26-012': [
      { time: '08:45', title: '안면·수부 오일 화상 발생', color: '#f43f5e', detail: `• 위치: 청정기실 (Purifier Room)\n• 연료유 필터 교체 중 고압 오일 역류 분사\n• 우측 안면·양손 화상 (1~2도), 우안 이물질 진입` },
      { time: '08:49', title: '안구 세척 즉시 시행', color: '#fb923c', detail: `• 생리식염수로 우측 안구 세척 시작\n• 시력 저하 및 충혈 지속 — 안구 손상 의심\n• 초임 사관 — 보호구 미착용 확인됨` },
      { time: '09:02', title: '선의 1차 평가 및 드레싱', color: '#facc15', detail: `• 안구 세척 15분 완료 후 패치 미착용 유지\n• 안면 화상 부위 냉각 및 멸균 거즈 처치\n• 땅콩 알레르기 확인 — 투약 성분 점검` },
      { time: '09:18', title: '원격 안과 진료 연결 요청', color: '#38bdf8', detail: `• HR 88 · BP 118/74 · SpO₂ 99%\n• 원격 의료 자문 요청 전송\n• 안연고 투여 보류 — 원격 지시 대기 중` },
      { time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 안구 외상 집중 관리 모드 활성화` },
    ],
  }

  if (scenarios[id]) return scenarios[id]

  // 기본 더미 — 증상/기저질환 기반 자동 생성
  const timeline = []
  if (isEmergency) {
    timeline.push({ time: '09:00', title: '이상 증상 최초 보고', color: '#f43f5e', detail: `• ${note || '비정상 증상 감지'}\n• 선의 호출 및 현장 확인 요청` })
    timeline.push({ time: '09:10', title: '선의 1차 평가 완료', color: '#fb923c', detail: `• 기저질환 확인: ${chronic}\n• 알레르기: ${allergies}\n• 바이탈 측정 및 모니터링 지시` })
  }
  if (chronic !== '없음') {
    timeline.push({ time: '08:30', title: '기저질환 상태 점검', color: '#facc15', detail: `• ${chronic} 관련 정기 점검 시행\n• 복용 약물 이상 반응 여부 확인` })
  }
  timeline.push({ time: '09:12', title: 'MDTS 모니터링 개시', color: '#64748b', detail: `• 바이탈 센서 연동 완료\n• 알레르기(${allergies}) 주의 플래그 설정` })
  return timeline
}

function getExampleQuestions(patient) {
  const questions = []
  const chronic = patient?.chronic || ''
  const allergies = patient?.allergies || ''
  const note = patient?.note || ''
  const isEmergency = patient?.isEmergency

  // 1. 사고/증상 기반 질문 (note에서 파생)
  if (note.includes('골절')) questions.push('골절 의심 시 응급처치 방법은?')
  else if (note.includes('추락') || note.includes('낙상')) questions.push('추락 사고 후 초기 평가 방법은?')
  else if (note.includes('화상')) questions.push('화상 환자 응급처치 순서는?')
  else if (note.includes('출혈')) questions.push('외상 출혈 지혈 방법은?')
  else if (note.includes('의식')) questions.push('의식 저하 환자 대응 방법은?')
  else if (note.includes('당뇨') || chronic.includes('당뇨')) questions.push('당뇨 환자 저혈당 응급처치는?')
  else if (note.includes('디스크') || chronic.includes('디스크')) questions.push('허리디스크 환자 이동 시 주의사항은?')
  else if (note.includes('습진') || chronic.includes('습진')) questions.push('피부 알레르기 악화 시 처치 방법은?')
  else if (isEmergency) questions.push('현재 응급 상태 악화 징후 확인 방법은?')
  else questions.push('현재 건강 상태 이상 징후 확인 방법은?')

  // 2. 바이탈 분석 질문 (항상 포함)
  questions.push('현재 바이탈 이상 여부 분석해줘')

  // 3. 기저질환 기반 질문
  if (chronic.includes('고혈압') && chronic.includes('고지혈')) questions.push('고혈압·고지혈증 환자 통증 관리 방법은?')
  else if (chronic.includes('고혈압')) questions.push('고혈압 환자 응급 상황 대응 방법은?')
  else if (chronic.includes('당뇨')) questions.push('당뇨 환자 활력징후 해석 방법은?')
  else if (chronic.includes('디스크')) questions.push('척추 질환 환자 자세 관리 방법은?')
  else if (chronic.includes('비염')) questions.push('비염 환자 호흡 곤란 시 대처법은?')
  else if (chronic.includes('치질')) questions.push('장기 항해 중 만성 질환 관리 방법은?')
  else if (chronic === '없음' || !chronic) questions.push('해상 환경에서 탈수 예방 방법은?')
  else questions.push(`${chronic} 환자 주의사항은?`)

  // 4. 알레르기 기반 질문
  if (allergies && allergies !== '없음') questions.push(`${allergies} 알레르기 환자 대체 약물은?`)
  else questions.push('선내 상비약 투여 시 주의사항은?')

  return questions
}

export default function DashboardView({
  activePatient, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, handleTraumaAnalysis,
  isScanning, scanError, setScanError, setIsScanning,
  setBp, setBt, onSwitchPatient
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // ─── 환자 선택 드롭다운 상태 ───
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [dynamicCrewList, setDynamicCrewList] = useState([])
  const selectRef = useRef(null)

  useEffect(() => {
    const loadPatients = () => {
      const savedCrew = JSON.parse(localStorage.getItem('mdts_crew_list') || '[]')
      const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
      const recordedIds = new Set(records.map(r => r.patientId))
      
      const activePatients = savedCrew.filter(c => 
        c.isEmergency || recordedIds.has(c.id) || c.id === activePatient?.id
      )
      setDynamicCrewList(activePatients)
    }
    loadPatients()
  }, [activePatient])

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelectOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ─── 센서 상태 판별 ───
  const [spo2Status, setSpo2Status] = useState('normal') 

  // ─── 편집 모달 상태 ───
  const [editTarget, setEditTarget] = useState(null) 
  const [editValue, setEditValue] = useState('')

  const openEdit = (type, currentVal) => {
    setEditTarget(type)
    setEditValue(currentVal)
  }

  const saveEdit = () => {
    if (editTarget === 'bp') setBp(editValue)
    if (editTarget === 'bt') setBt(editValue)
    setEditTarget(null)
  }

  const toggleSpo2Status = () => {
    setSpo2Status(prev => prev === 'normal' ? 'error' : 'normal')
  }

  // 카메라 스트림 관리
  const [cameraError, setCameraError] = useState(null)
  useEffect(() => {
    let activeStream = null
    async function startCamera() {
      if (isScanning) {
        setCameraError(null)
        try {
          const s = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: 1280, height: 720 }
          })
          activeStream = s
          streamRef.current = s
          if (videoRef.current) videoRef.current.srcObject = s
        } catch (err) {
          console.error("카메라 접근 실패:", err)
          const msg = err.name === 'NotAllowedError' ? '카메라 접근이 거부되었습니다. 브라우저 설정에서 허용해주세요.'
            : err.name === 'NotFoundError' ? '카메라 장치를 찾을 수 없습니다.'
            : '카메라를 시작할 수 없습니다. 다른 앱이 사용 중일 수 있습니다.'
          setCameraError(msg)
        }
      } else {
        setCameraError(null)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }
    }
    startCamera()
    return () => {
      if (activeStream) activeStream.getTracks().forEach(track => track.stop())
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [isScanning])

  // ─── 타임라인 및 진단 데이터 로드 ───
  const [dynamicTimeline, setDynamicTimeline] = useState([])

  useEffect(() => {
    const loadRecords = () => {
      const records = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
      const patientRecords = records.filter(r => r.patientId === activePatient?.id)
      
      const newTimeline = patientRecords.map(r => ({
        time: new Date(r.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        title: r.mainComplaint || '환자 상태 기록 업데이트',
        color: r.isEmergency ? '#f43f5e' : '#38bdf8',
        detail: `• 주요증상: ${r.selectedSymptoms.join(', ') || '관찰 중'}\n• 조치내용: ${r.prescribedMeds.join(', ') || '경과 관찰'}\n• 특이사항: ${r.otherActions || '없음'}`
      }))

      const baseTimeline = getPatientTimeline(activePatient)

      setDynamicTimeline([...baseTimeline, ...newTimeline])
    }

    loadRecords()
    const interval = setInterval(loadRecords, 1000)
    return () => clearInterval(interval)
  }, [activePatient?.id])

  // 비상연락처 데이터 파싱
  const getEmergencyDisplay = () => {
    let display = { name: '미지정', phone: '-', relation: '-' };
    const PROTECTOR_MAP = {
      'S26-001': '김도윤', 'S26-002': '김도장', 'S26-003': '양정희', 'S26-004': '박지호',
      'S26-005': '정민준', 'S26-006': '정하윤', 'S26-007': '강준우', 'S26-008': '조예은',
      'S26-009': '임도현', 'S26-010': '장수빈', 'S26-011': '황지훈', 'S26-012': '한지민',
      'S26-013': '오세현', 'S26-014': '나혜지', 'S26-015': '송다희', 'S26-016': '김한혜'
    };
    const forcedName = PROTECTOR_MAP[activePatient?.id];
    if (activePatient?.emergencyName || forcedName) {
      display.name = forcedName || activePatient.emergencyName;
      if (activePatient?.emergency && typeof activePatient.emergency === 'string') {
        const parts = activePatient.emergency.split(' ');
        display.phone = parts[0] || '-';
        display.relation = parts[1] ? parts[1].replace(/[()]/g, '') : '가족';
      }
      return display;
    }
    if (activePatient?.emergencyContact && typeof activePatient.emergencyContact === 'object') {
      display = {
        name: forcedName || activePatient.emergencyContact.name || '미지정',
        phone: activePatient.emergencyContact.phone || '-',
        relation: activePatient.emergencyContact.relation || '-'
      };
    } else if (activePatient?.emergency && typeof activePatient.emergency === 'string') {
      const parts = activePatient.emergency.split(' ');
      display.phone = parts[0] || '-';
      display.relation = parts[1] ? parts[1].replace(/[()]/g, '') : '가족';
      display.name = forcedName || activePatient.emergencyName || '보호자';
    }
    return display;
  };
  const emergency = getEmergencyDisplay();

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: '100%', position: 'relative', background: '#020408' }}>

      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {cameraError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10002, gap: 20 }}>
              <AlertTriangle size={56} color="#ff4d6d" />
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', textAlign: 'center', maxWidth: 400, lineHeight: 1.6, padding: '20px 30px', background: 'rgba(255,77,109,0.15)', borderRadius: 16, border: '1.5px solid rgba(255,77,109,0.4)' }}>{cameraError}</div>
              <button onClick={() => { setCameraError(null); setIsScanning(false) }} style={{ padding: '14px 32px', borderRadius: 12, background: '#ff4d6d', color: '#fff', border: 'none', fontSize: 18, fontWeight: 900, cursor: 'pointer' }}>닫기</button>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0, 10, 20, 0.7) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, zIndex: 10001 }}>
            <div style={{ background: 'rgba(0, 20, 30, 0.85)', padding: '20px 60px', borderRadius: '15px', color: '#fff', fontSize: 24, fontWeight: 900, border: '1.5px solid #00e5cc', boxShadow: '0 0 40px rgba(0, 229, 204, 0.4)', backdropFilter: 'blur(10px)' }}>진단 부위를 원형 프레임 내부에 맞춰주세요</div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '600px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0, 229, 204, 0.3)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', width: '92%', height: '92%', border: '2px dashed rgba(0, 229, 204, 0.2)', borderRadius: '50%', animation: 'spin 10s infinite linear' }} />
              {!scanError && (
                <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '2px', background: 'linear-gradient(to right, transparent, #fff, #00e5cc, #fff, transparent)', boxShadow: '0 0 20px #00e5cc', animation: 'scanMoveInner 2.5s infinite ease-in-out', zIndex: 10005 }} />
              )}
              <div style={{ position: 'absolute', width: 40, height: 2, background: '#00e5cc' }} />
              <div style={{ position: 'absolute', width: 2, height: 40, background: '#00e5cc' }} />
            </div>
            {scanError && (
              <div style={{ position: 'absolute', width: 560, background: 'rgba(2, 15, 25, 0.98)', padding: '50px', borderRadius: '32px', color: '#fff', textAlign: 'center', zIndex: 10002, border: '3px solid #ff4d6d', boxShadow: '0 0 60px rgba(255, 77, 109, 0.4)', backdropFilter: 'blur(30px)' }}>
                <div style={{ fontSize: 36, fontWeight: 950, marginBottom: 20, color: '#ff4d6d' }}>스캔 분석 중단됨</div>
                <button onClick={() => setScanError(null)} style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 950, fontSize: 24, cursor: 'pointer' }}>다시 시도</button>
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10001 }}>
            <button onClick={() => setIsScanning(false)} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '18px 60px', borderRadius: '100px', color: '#fff', fontSize: 18, fontWeight: 900, border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', backdropFilter: 'blur(15px)' }}>진단 모드 종료</button>
          </div>
        </div>
      )}

      <aside style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ flexShrink: 0, padding: '24px 28px 20px 28px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          <div ref={selectRef} style={{ position: 'relative', width: '100%', marginBottom: 24 }}>
            <div onClick={() => setIsSelectOpen(!isSelectOpen)} style={{ background: 'rgba(56,189,248,0.05)', border: `2px solid ${isSelectOpen ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', color: '#fff', padding: '12px 20px', fontSize: '20px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><User size={22} color="#38bdf8" /><span>{activePatient?.name} ({activePatient?.role})</span></div>
              <ChevronDown size={22} style={{ transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s', color: '#38bdf8' }} />
            </div>
            {isSelectOpen && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(56,189,248,0.3)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 1000 }}>
                {dynamicCrewList.map(c => (
                  <div key={c.id} onClick={() => { onSwitchPatient?.(c); setIsSelectOpen(false); }} style={{ padding: '16px 20px', fontSize: '18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: activePatient?.id === c.id ? 'rgba(56,189,248,0.2)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: c.isEmergency ? '#ff4d6d' : '#26de81' }} />{c.name} ({c.role})</div>
                    {c.isEmergency && <AlertTriangle size={16} color="#ff4d6d" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div key={activePatient?.id} style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <ProfileImage avatar={activePatient?.avatar} name={activePatient?.name} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-0.5px', color: '#fff' }}>{activePatient?.name || '김항해'}</div>
                <div style={{ fontSize: 20, color: '#38bdf8', fontWeight: 800 }}>{activePatient?.role || '기관장'}</div>
              </div>
              <div style={{ fontSize: 16, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id || 'S2026-026'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 55}세 / 남`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood || 'A+형'} size="xl_ultra" />
            <InfoItem label="신장" value={`${activePatient?.height || 178} cm`} size="xl_ultra" />
            <InfoItem label="몸무게" value={`${activePatient?.weight || 82} kg`} size="xl_ultra" />
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 120px 28px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Activity size={20}/> 기저 질환</div>
            <div style={{ fontSize: 19, fontWeight: 750, color: '#fed7aa', background: 'rgba(251,146,60,0.06)', padding: '16px', borderRadius: 16, border: '1px solid rgba(251,146,60,0.15)' }}>{activePatient?.chronic || '기록 없음'}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><History size={20}/> 과거력</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>{activePatient?.history ? activePatient.history.split('\n').map((line, i) => <div key={i}>{line}</div>) : '기록 없음'}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#00d2ff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><RotateCcw size={20}/> 최근 진료 이력</div>
            <div style={{ background: 'rgba(0, 210, 255, 0.04)', borderRadius: 16, padding: '20px', border: '1px solid rgba(0, 210, 255, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 850, color: '#00d2ff' }}>{activePatient?.recentHistory?.date || '2026-03-15'}</span>
                <span style={{ fontSize: 15, color: '#4a6080', fontWeight: 700 }}>{activePatient?.recentHistory?.title || '단순 감기'}</span>
              </div>
              <div style={{ fontSize: 16, color: '#8da2c0', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{activePatient?.recentHistory?.detail || '- 처방 : 타이레놀 500mg\n- 특이사황 : 알레르기 반응 없음'}</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
            <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>{(activePatient?.allergies || '없음').split(',').map((a, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} /><span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span></div>))}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><MapPin size={20}/> 환자 작업 위치</div>
            <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Anchor size={22} color="#38bdf8" /></div>
              <div><div style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{activePatient?.location || activePatient?.workLocation || '미지정'}</div><div style={{ fontSize: 14, color: '#4a6080', fontWeight: 700, marginTop: 2 }}>실시간 위치 트래킹 활성화됨</div></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#26de81', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Phone size={20}/> 보호자 연락처</div>
            <div style={{ background: 'rgba(38,222,129,0.06)', border: '1px solid rgba(38,222,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><span style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{emergency.name}</span><span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{emergency.relation}</span></div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>{emergency.phone}</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={() => startEmergencyAction('CPR')} style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}><AlertTriangle size={28} /> 응급 처치 액션 시작</button>
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1.4fr 1.4fr', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff4d6d" live valueSize={38} />
            <div onClick={toggleSpo2Status} style={{ cursor: 'pointer' }}><DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live isConnected={spo2Status === 'normal'} valueSize={38} /></div>
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#8b5cf6" live valueSize={38} />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#eab308" editable onEdit={() => openEdit('bp', bp)} valueSize={40} />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#f97316" editable onEdit={() => openEdit('bt', bt)} valueSize={40} />
          </div>
          {editTarget && (
            <div style={{ position: 'absolute', top: '110%', left: editTarget === 'bp' ? '70%' : 'auto', right: editTarget === 'bt' ? '45px' : 'auto', transform: editTarget === 'bp' ? 'translateX(-50%) translateY(15px)' : 'translateY(15px)', zIndex: 1000, width: 360, background: '#1e293b', border: '2px solid #38bdf8', borderRadius: 24, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'slideUp 0.2s ease', backdropFilter: 'blur(25px)' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>{editTarget === 'bp' ? <Activity size={20} /> : <Thermometer size={20} />}{editTarget === 'bp' ? '혈압 직접 입력' : '체온 직접 입력'}</div>
              <input value={editValue} autoFocus placeholder={editTarget === 'bp' ? '예: 120/80' : '예: 36.5'} onChange={e => setEditValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditTarget(null); }} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 20px', color: '#fff', fontSize: 24, fontWeight: 800, outline: 'none', marginBottom: 20, textAlign: 'center', letterSpacing: '1px' }} />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>취소</button><button onClick={saveEdit} style={{ flex: 2, padding: '14px', borderRadius: 12, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 950, fontSize: 16, cursor: 'pointer' }}>데이터 저장</button></div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}><div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0' }}><Sparkles size={20} color="#38bdf8" /> MDTS 진단 어시스턴트</div><div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 229, 204, 0.2), #00e5cc, rgba(0, 229, 204, 0.2), transparent)', boxShadow: '0 0 12px #00e5cc', animation: 'flowingLight 5s infinite linear' }} /></div></div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 120px 20px', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.role === 'ai' ? <Sparkles size={14} color="#000" /> : <User size={14} color="#fff" />}</div>
                <div style={{ flex: 1, maxWidth: '92%' }}><div style={{ padding: '16px 22px', borderRadius: m.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px', background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.03)', border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: '#e2e8f0' }}><AiMessageRenderer text={m.text} /></div></div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px 20px 20px', background: 'linear-gradient(to top, #05070a 80%, transparent)', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
            {/* 예시 질문 칩 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {getExampleQuestions(activePatient).map((q) => (
                <button
                  key={q}
                  onClick={() => setPrompt(q)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 700,
                    background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.25)',
                    color: '#7dd3fc', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.18)'; e.currentTarget.style.borderColor = '#38bdf8'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.07)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
            <div style={{ width: '100%', background: '#0a0f1e', borderRadius: '20px', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(56,189,248,0.2)', height: 72, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <input placeholder="질문하세요..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 18 }} />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 28px', height: '100%', borderRadius: '14px', border: 'none', background: '#38bdf8', color: '#000', fontWeight: 950, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>질문하기 <ArrowUp size={20} strokeWidth={3} /></button>
            </div>
          </div>
        </div>
      </section>

      <aside style={{ width: 480, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flexShrink: 0, padding: '24px 28px 16px 28px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={22}/> 상황 대응 타임라인</div></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 120px 28px', scrollbarWidth: 'none' }}><div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}><div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #facc15, #38bdf8)' }} />{dynamicTimeline.map((item, idx) => (<div key={idx} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 40 }}><div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#05070a', border: `3px solid ${item.color}`, zIndex: 2 }} /><div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.time}</div><div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{item.title}</div>{item.detail && <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 8, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.detail}</div>}</div>))}</div></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(56,189,248,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}><button onClick={handleTraumaAnalysis} style={{ width: '100%', height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)' }}><Camera size={28} /> 외상 촬영 및 AI 분석</button></div>
      </aside>

      <style>{`
        @keyframes flowingLight { 0% { left: -100%; } 50% { left: 0%; } 100% { left: 100%; } }
        @keyframes borderRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanMoveInner { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
        input::placeholder { color: rgba(255, 255, 255, 0.2) !important; }
      `}</style>
    </div>
  )
}

function ProfileImage({ avatar, name }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div style={{ width: 110, height: 110, borderRadius: 24, background: '#1e293b', border: '3px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      {!imgError ? (
        <img 
          src={avatar || '/CE.jpeg'} 
          onError={() => setImgError(true)} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          alt="Profile" 
        />
      ) : (
        <div style={{ fontSize: 14, fontWeight: 800, color: '#475569', textAlign: 'center' }}>이미지 로드 중</div>
      )}
    </div>
  )
}

function AiMessageRenderer({ text }) {
  if (!text) return null;
  const confMatch = text.match(/\[CONFIDENCE: (.*?)\]/);
  const evidenceMatch = text.match(/\[EVIDENCE: (.*?)\]/);
  const guideMatch = text.match(/\[GUIDE: (.*?)\]/);
  const confidence = confMatch ? confMatch[1] : null;
  const evidence = evidenceMatch ? evidenceMatch[1] : null;
  const guide = guideMatch ? guideMatch[1] : null;
  const cleanText = text.replace(/\[.*?\]/g, '').trim();

  const formattedText = cleanText.split('\n').map((line, i) => {
    if (line.includes(':')) {
      const [label, content] = line.split(':');
      return <div key={i}><span style={{ fontWeight: 900, color: '#fff' }}>{label}:</span>{content}</div>;
    }
    return <div key={i} style={{ marginBottom: 8 }}>{line}</div>;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ whiteSpace: 'pre-line', fontSize: 22 }}>{formattedText}</div>
      {(confidence || evidence || guide) && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {confidence && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18}/> AI 진단 신뢰도</span>
                <span style={{ fontSize: 20, fontWeight: 950, color: '#38bdf8' }}>{confidence}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: confidence, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 3 }} /></div>
            </div>
          )}
          {evidence && (
            <div style={{ background: 'rgba(56,189,248,0.08)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(56,189,248,0.25)' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}><Info size={18}/> AI 분석 판단 근거</div>
              <div style={{ fontSize: 18, color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{evidence}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
