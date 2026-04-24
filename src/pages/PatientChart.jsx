import { useState, useEffect, useRef } from 'react'
import { 
  Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle, 
  Stethoscope, ClipboardList, Pill, Camera, ChevronRight, CheckCircle2,
  AlertCircle, Info, Search, User, ChevronDown, ShieldAlert, Zap, ThermometerSnowflake,
  History, RotateCcw, MapPin, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, ShieldCheck, Phone, Pencil
} from 'lucide-react'

// 확장된 선원 데이터 (메인 데이터와 동기화용)
const ALL_CREW = [
  { 
    id: 'S26-003', name: '박기관', age: 55, gender: '남', dob: '1971-08-05', role: '기관장', dept: '기관부', 
    blood: 'B+', height: 172, weight: 70, 
    chronic: '고혈압 (2022~), 고지혈증',
    history: '고혈압 (2022~)\n아스피린 알레르기 있음',
    allergies: '아스피린, 먼지', 
    vitals: { bp: '158/95', hr: 92, rr: 18, temp: 37.8, spo2: 94 }, 
    last_visit: '2026-04-10', doctor: '김원격 (화상협진)',
    workLocation: '제2엔진실 (Engine Room B2)',
    emergency_contact: '양정희 (010-8765-4321)', 
    emergencyContact: { name: '양정희', phone: '010-8765-4321', relation: '배우자' },
    recentHistory: {
        date: '2026-04-10',
        title: '혈압 상승 및 두통',
        detail: '처방 : 혈압조절제 증량\n특이사항 : 원격 진료 통한 상태 확인'
    },
    isEmergency: true, avatar: '/CE.jpeg' 
  },
  { 
    id: 'S26-001', name: '이선장', age: 52, gender: '남', dob: '1974-05-12', role: '선장', dept: '항해부', 
    blood: 'O+', height: 175, weight: 78, 
    chronic: '고혈압', history: '고혈압', allergies: '없음',
    vitals: { bp: '138/85', hr: 78, rr: 16, temp: 36.5, spo2: 98 }, 
    last_visit: '2026-03-22', doctor: '이원격 (화상협진)',
    workLocation: '브릿지 (Bridge)',
    emergency_contact: '배우자 (010-1234-5678)',
    emergencyContact: { name: '배우자', phone: '010-1234-5678', relation: '가족' },
    recentHistory: {
        date: '2026-03-22',
        title: '정기 검진',
        detail: '특이사항 없음'
    },
    isEmergency: false, avatar: '/CE.jpeg' 
  },
]

const OTC_MEDS = [
  { id: 'm1', name: '해열·진통·소염제', type: '통증 관리' },
  { id: 'm2', name: '항히스타민제', type: '독충/알레르기' },
  { id: 'm3', name: '스테로이드 연고', type: '피부 손상' },
  { id: 'm4', name: '화상 연고', type: '화상 처치' },
  { id: 'm5', name: '연고/소독액', type: '살균/소독' },
  { id: 'm6', name: '파스/근육통약', type: '근육 손상' },
  { id: 'm7', name: '인공눈물/세척액', type: '안구 외상' },
  { id: 'm8', name: '압박붕대/거즈', type: '지혈/고정' },
  { id: 'm9', name: '부목/삼각건', type: '골절 처치' },
]

export default function PatientChart({ patient: activePatientProp, onNavigate }) {
  // 선내 담당자 목록 불러오기 (시스템 설정 연동)
  const [managers] = useState(() => {
    try {
      const saved = localStorage.getItem('mdts_managers')
      return saved ? JSON.parse(saved) : [
        { id: 'm1', name: '이선장', role: '안전책임자' },
        { id: 'm2', name: '박기관', role: '의료담당자' },
      ]
    } catch { return [] }
  })

  // 환자 데이터 우선순위 : Props -> ALL_CREW -> 기본값
  const [selectedId, setSelectedId] = useState(activePatientProp?.id || 'S26-003')
  const patient = ALL_CREW.find(c => c.id === selectedId) || activePatientProp || ALL_CREW[0]

  const [selectedDoctor, setSelectedDoctor] = useState(managers[0] || { name: '미지정', role: '-' })
  const [isDoctorOpen, setIsDoctorOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)

  // 바이탈 입력 상태
  const [vitals, setVitals] = useState({
    bp: patient.vitals?.bp || '',
    hr: patient.vitals?.hr || '',
    rr: patient.vitals?.rr || '16',
    temp: patient.vitals?.temp || '',
    spo2: patient.vitals?.spo2 || ''
  })
  
  const doctorSelectRef = useRef(null)
  const timeModalRef = useRef(null)
  const selectRef = useRef(null)
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  // 시간 상태
  const [ampm, setAmpm] = useState('오후')
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [occurrenceTime, setOccurrenceTime] = useState('오후 12:00')

  // 증상 및 조치 상태
  const [patientRole, setPatientRole] = useState(patient.role)
  const [mainComplaint, setMainComplaint] = useState('')
  const [painAreas, setPainAreas] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [detailedNote, setDetailedNote] = useState('')
  const [selectedMeds, setSelectedMeds] = useState([])
  const [otherActions, setOtherActions] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [editValue, setEditValue] = useState('')

  const openEdit = (target, currentVal) => {
    setEditTarget(target)
    setEditValue(currentVal.toString().split(' ')[0]) // 단위 제외하고 값만
  }

  const saveEdit = () => {
    let finalValue = editValue;
    if (editTarget === 'bp') {
      finalValue = editValue.replace(/[^0-9\/]/g, '');
      setVitals(prev => ({ ...prev, [editTarget]: finalValue }))
    } else if (editTarget === 'temp') {
      setVitals(prev => ({ ...prev, [editTarget]: finalValue }))
    } else if (editTarget === 'role') {
      setPatientRole(finalValue)
    }
    setEditTarget(null)
    setShowPlan(false)
  }

  useEffect(() => {
    setOccurrenceTime(`${ampm} ${hour}:${minute}`)
  }, [ampm, hour, minute])

  const setNowTime = () => {
    const now = new Date()
    const h = now.getHours()
    const m = now.getMinutes()
    setAmpm(h >= 12 ? '오후' : '오전')
    setHour(String(h % 12 || 12))
    setMinute(String(Math.round(m / 10) * 10).padStart(2, '0').replace('60', '50'))
    setShowPlan(false)
  }

  const toggleSymptom = (s) => {
    setShowPlan(false)
    const isSelecting = !selectedSymptoms.includes(s)
    setSelectedSymptoms(isSelecting ? [...selectedSymptoms, s] : selectedSymptoms.filter(item => item !== s))
    if (isSelecting) setDetailedNote(prev => prev ? `${prev}, ${s}` : s)
    else setDetailedNote(prev => prev.replace(new RegExp(`, ${s}|${s}, |${s}`, 'g'), '').trim().replace(/^,|,$/g, ''))
  }

  const handlePainAreaClick = (area) => {
    setShowPlan(false)
    const isSelecting = !painAreas.includes(area)
    const newAreas = isSelecting ? [...painAreas, area] : painAreas.filter(a => a !== area)
    setPainAreas(newAreas)
    const areaText = `${area} 통증`
    if (isSelecting) setDetailedNote(prev => prev ? `${areaText}, ${prev}` : areaText)
    else setDetailedNote(prev => prev.replace(new RegExp(`, ${areaText}|${areaText}, |${areaText}`, 'g'), '').trim().replace(/^,|,$/g, ''))
  }

  const toggleMed = (medName) => {
    if (medName === '항히스타민제') {
      alert("⚠️ 주의: 항히스타민제는 졸음을 유발할 수 있으니 작업 전 주의하세요.");
    } else if (medName === '연고/소독액') {
      alert("ℹ️ 가이드: 개방된 큰 상처에는 직접 붓지 마세요.");
    }

    if (selectedMeds.includes(medName)) setSelectedMeds(selectedMeds.filter(m => m !== medName))
    else setSelectedMeds([...selectedMeds, medName])
  }

  const handleSave = () => {
    // 저장할 데이터 객체 생성
    const chartRecord = {
      patientId: patient.id,
      patientName: patient.name,
      doctorName: selectedDoctor.name,
      timestamp: new Date().toISOString(),
      occurrenceTime: occurrenceTime,
      vitals: { ...vitals },
      mainComplaint: mainComplaint,
      painAreas: painAreas,
      selectedSymptoms: selectedSymptoms,
      detailedNote: detailedNote,
      prescribedMeds: selectedMeds,
      otherActions: otherActions,
      isEmergency: selectedSymptoms.some(s => s.includes('위험') || s.includes('응급'))
    }

    try {
      // 기존 기록들 불러오기
      const existingRecords = JSON.parse(localStorage.getItem('mdts_patient_records') || '[]')
      // 새로운 기록 추가
      const updatedRecords = [chartRecord, ...existingRecords]
      // 다시 저장
      localStorage.setItem('mdts_patient_records', JSON.stringify(updatedRecords))
      
      // 환자의 최신 상태 업데이트 (ALL_CREW 시뮬레이션용 로컬 스토리지)
      const crewStatus = JSON.parse(localStorage.getItem('mdts_crew_status') || '{}')
      crewStatus[patient.id] = {
        lastVisit: new Date().toLocaleDateString(),
        currentStatus: selectedSymptoms[0] || '경과 관찰 중',
        isEmergency: chartRecord.isEmergency
      }
      localStorage.setItem('mdts_crew_status', JSON.stringify(crewStatus))

      alert(`[최종 기록 저장 완료]\n환자: ${patient.name}\n조치 내용이 성공적으로 시스템에 기록되었습니다.`)
      onNavigate?.('main')
    } catch (e) {
      console.error('저장 실패:', e)
      alert('기록 저장 중 오류가 발생했습니다.')
    }
  }

  // AI 동적 진단 로직
  const getAIDiagnosis = () => {
    const allKey = [...selectedSymptoms, ...painAreas]
    if (allKey.length === 0) return null

    let briefing = "입력된 데이터를 바탕으로 분석 중입니다. 활력 징후를 지속적으로 모니터링하십시오."
    let guide = ["환자를 편안한 자세로 안정", "수분 섭취 제한 및 경과 관찰", "추가 증상 발생 시 즉시 보고"]
    let meds = ["해열·진통·소염제"]

    // 특정 증상별 맞춤형 로직
    if (allKey.some(s => s.includes('머리') || s.includes('두통') || s.includes('얼굴'))) {
      briefing = "두부 통증은 뇌압 상승이나 단순 피로일 수 있습니다. 빛을 차단하고 안정을 취하게 하십시오."
      guide = ["조명을 어둡게 하고 절대 안정", "머리에 찬 수건으로 냉찜질", "의식 상태(말 어눌함 등) 수시 확인"]
      meds = ["해열·진통·소염제", "종합감기약"]
    } else if (allKey.some(s => s.includes('복부') || s.includes('구토') || s.includes('설사'))) {
      briefing = "위장관 염증 또는 식중독 의심 증상입니다. 탈수 방지가 중요하며 복부 압박을 피하십시오."
      guide = ["증상 호전 시까지 금식 권장", "따뜻한 물로 소량씩 수분 보충", "복부를 따뜻하게 유지"]
      meds = ["소화제/제산제", "지사제"]
    } else if (allKey.some(s => s.includes('발열') || s.includes('감기') || s.includes('목'))) {
      briefing = "감염성 질환으로 인한 고열 증세가 의심됩니다. 체온 조절과 격리 조치를 검토하십시오."
      guide = ["실내 환기 및 적정 습도 유지", "미온수로 몸을 닦아 체온 조절", "충분한 휴식과 비타민 섭취"]
      meds = ["해열·진통·소염제", "종합감기약", "콧물/기침약"]
    } else if (allKey.some(s => s.includes('어깨') || s.includes('다리') || s.includes('무릎') || s.includes('허리') || s.includes('손목'))) {
      briefing = "근골격계 손상 또는 염좌가 의심됩니다. 해당 부위의 움직임을 최소화하고 고정하십시오."
      guide = ["환부를 높게 올리고 이동 제한", "초기 24시간 냉찜질 권장", "압박 붕대로 환부 고정"]
      meds = ["해열·진통·소염제", "파스/근육통약", "연고/소독액"]
    } else if (allKey.some(s => s.includes('발진') || s.includes('가려움') || s.includes('피부'))) {
      briefing = "알레르기 반응 또는 접촉성 피부염 의심. 원인 물질(음식, 약물, 화학물)을 차단하십시오."
      guide = ["환부를 긁지 않도록 주의", "미온수로 가볍게 세척", "호흡 곤란 발생 시 즉시 보고"]
      meds = ["항히스타민제", "스테로이드 연고"]
    }

    return { briefing, guide, meds }
  }

  const aiResult = getAIDiagnosis()

  // 외부 클릭 닫기 로직
  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelectOpen(false)
      if (doctorSelectRef.current && !doctorSelectRef.current.contains(e.target)) setIsDoctorOpen(false)
      if (isTimeModalOpen && timeModalRef.current && !timeModalRef.current.contains(e.target)) {
          // 버튼 클릭 시에는 닫히지 않도록 (이벤트 전파 방지 처리 예정)
          setIsTimeModalOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isTimeModalOpen])

  // 바이탈 상태 판별 로직
  const getVitalStatus = (type, value) => {
    if (!value) return { label: '정보없음', color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
    if (type === 'bp') {
        const sys = parseInt(value.split('/')[0])
        if (sys >= 160) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (sys >= 140) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (sys >= 130) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'hr') {
        const val = parseInt(value)
        if (val >= 110 || val <= 50) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (val >= 100 || val <= 60) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (val >= 90) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'temp') {
        const val = parseFloat(value)
        if (val >= 39.0 || val <= 35.0) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (val >= 38.0) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (val >= 37.3) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'spo2') {
        const val = parseInt(value)
        if (val < 90) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (val < 95) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (val < 97) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
  }

  return (
    <div style={{ padding: '0', height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* 시간 선택 모달 */}
      {isTimeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div ref={timeModalRef} style={{ background: '#0f172a', border: '1.5px solid rgba(56,189,248,0.3)', borderRadius: '32px', padding: '40px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '30px', textAlign: 'center', color: '#38bdf8' }}>증상이 나타난 시각 선택</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {['오전', '오후'].map(a => (
                  <button key={a} onClick={() => setAmpm(a)} style={{ flex: 1, padding: '15px', borderRadius: 16, background: ampm === a ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${ampm === a ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: ampm === a ? '#38bdf8' : '#fff', fontSize: '20px', fontWeight: 800, cursor: 'pointer' }}>{a}</button>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 800, marginBottom: 12 }}>시간 (시)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {Array.from({length: 12}, (_, i) => String(i + 1)).map(h => (
                    <button key={h} onClick={() => setHour(h)} style={{ padding: '12px 0', borderRadius: 12, background: hour === h ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${hour === h ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: hour === h ? '#38bdf8' : '#fff', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}>{h}시</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 800, marginBottom: 12 }}>분 (10분 단위)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['00', '10', '20', '30', '40', '50'].map(m => (
                    <button key={m} onClick={() => setMinute(m)} style={{ padding: '12px 0', borderRadius: 12, background: minute === m ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${minute === m ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: minute === m ? '#38bdf8' : '#fff', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}>{m}분</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsTimeModalOpen(false)} style={{ marginTop: '10px', padding: '20px', borderRadius: 18, background: '#38bdf8', color: '#0f172a', border: 'none', fontSize: '22px', fontWeight: 950, cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(56,189,248,0.4)' }}>선택 완료</button>
            </div>
          </div>
        </div>
      )}

      {/* 상단 헤더 */}
      <div style={{ position: 'relative', zIndex: 100, background: 'rgba(7, 15, 30, 0.98)', backdropFilter: 'blur(15px)', borderBottom: '1.5px solid rgba(255,255,255,0.1)', padding: '16px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <div ref={selectRef} style={{ position: 'relative', width: '360px' }}>
            <div onClick={() => setIsSelectOpen(!isSelectOpen)} style={{ background: 'rgba(56,189,248,0.05)', border: `2px solid ${isSelectOpen ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', color: '#fff', padding: '12px 20px', fontSize: '22px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><User size={24} color="#38bdf8" /><span>{patient.name} ({patientRole})</span></div>
              <ChevronDown size={24} style={{ transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s', color: '#38bdf8' }} />
            </div>
            {isSelectOpen && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(56,189,248,0.3)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 1000 }}>
                {ALL_CREW.map(c => (
                  <div key={c.id} onClick={() => { setSelectedId(c.id); setIsSelectOpen(false); }} style={{ padding: '16px 20px', fontSize: '20px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: selectedId === c.id ? 'rgba(56,189,248,0.2)' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 10, height: 12, borderRadius: '50%', background: c.isEmergency ? '#ff4d6d' : '#26de81' }} />{c.name} ({c.role})</div>
                    {c.isEmergency && <AlertTriangle size={18} color="#ff4d6d" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 950, color: '#38bdf8' }}>환자 경과 기록 (Patient Chart)</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>최근 내원일 : {patient.last_visit || '-'}</div>
                <div ref={doctorSelectRef} style={{ position: 'relative', marginTop: 2 }}>
                    <div onClick={() => setIsDoctorOpen(!isDoctorOpen)} style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${isDoctorOpen ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: '0.2s' }}>
                        <span style={{ fontSize: '16px', color: '#fff', fontWeight: 800 }}>담당 : {selectedDoctor.name}</span>
                        <ChevronDown size={14} style={{ transform: isDoctorOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', color: '#64748b' }} />
                    </div>
                    {isDoctorOpen && (
                        <div style={{ position: 'absolute', top: '105%', right: 0, width: '180px', background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(15px)', border: '1.2px solid rgba(56,189,248,0.3)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.6)', zIndex: 1001, padding: '4px 0' }}>
                            {managers.map(d => (
                                <div key={d.id} onClick={() => { setSelectedDoctor(d); setIsDoctorOpen(false); }} style={{ padding: '6px 14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', background: selectedDoctor.id === d.id ? 'rgba(56,189,248,0.15)' : 'transparent', color: selectedDoctor.id === d.id ? '#38bdf8' : '#fff', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{d.name}</span>
                                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, background: 'rgba(255,255,255,0.03)', padding: '1px 5px', borderRadius: 4 }}>{d.role.substring(0,2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 0, height: 'calc(100% - 82px)' }}>
        
        {/* [Left] Patient Info Panel */}
        <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
            <div style={{ flexShrink: 0, padding: '24px 28px 20px 28px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                    <div style={{ width: 110, height: 110, borderRadius: 24, background: '#1e293b', border: '3px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        <img src={patient.avatar || '/CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="P" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                            <div style={{ fontSize: 40, fontWeight: 950, letterSpacing: '-0.5px', color: '#fff' }}>{patient.name}</div>
                            <div 
                              onClick={() => openEdit('role', patientRole)}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(56,189,248,0.05)', padding: '4px 12px', borderRadius: 10, border: '1px solid rgba(56,189,248,0.2)', transition: '0.2s' }}
                            >
                              <div style={{ fontSize: 22, color: '#38bdf8', fontWeight: 800 }}>{patientRole}</div>
                              <Pencil size={16} color="#38bdf8" />
                            </div>
                        </div>
                        <div style={{ fontSize: 17, color: '#475569', fontWeight: 700 }}>ID : {patient.id}</div>

                        {/* 직업(직책) 전용 플로팅 입력 모달 */}
                        {editTarget === 'role' && (
                          <div style={{
                            position: 'absolute', 
                            top: 100, left: 140,
                            zIndex: 1000,
                            width: 300, background: '#1e293b', border: '2px solid #38bdf8', borderRadius: 24,
                            padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'slideDown 0.2s ease'
                          }}>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Pencil size={18} /> 직책(직업) 직접 입력
                            </div>
                            <input 
                              autoFocus
                              value={editValue} 
                              placeholder='예: "기관장", "조리사"'
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveEdit();
                                }
                              }}
                              style={{
                                width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 20, fontWeight: 800,
                                outline: 'none', marginBottom: 16, textAlign: 'center'
                              }}
                            />
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                              <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>취소</button>
                              <button onClick={saveEdit} style={{ flex: 2, padding: '12px', borderRadius: 10, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 950, fontSize: 14, cursor: 'pointer' }}>입력 완료</button>
                            </div>
                          </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <InfoItem label="나이/성별" value={`${patient.age}세 / ${patient.gender}`} size="xl_ultra" />
                    <InfoItem label="혈액형" value={`${patient.blood}형`} size="xl_ultra" />
                    <InfoItem label="신장" value={`${patient.height} cm`} size="xl_ultra" />
                    <InfoItem label="몸무게" value={`${patient.weight} kg`} size="xl_ultra" />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '28px 28px 120px 28px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                        <History size={20}/> 과거력 (Past History)
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 750, color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {patient.history ? patient.history.split('\n').map((line, i) => (<div key={i}>{line}</div>)) : '기록 없음'}
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#00d2ff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                        <RotateCcw size={20}/> 최근 진료 이력
                    </div>
                    <div style={{ background: 'rgba(0, 210, 255, 0.04)', borderRadius: 16, padding: '20px', border: '1px solid rgba(0, 210, 255, 0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: 17, fontWeight: 850, color: '#00d2ff' }}>{patient.recentHistory?.date}</span>
                            <span style={{ fontSize: 15, color: '#4a6080', fontWeight: 700 }}>{patient.recentHistory?.title}</span>
                        </div>
                        <div style={{ fontSize: 16, color: '#8da2c0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{patient.recentHistory?.detail}</div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                        <AlertCircle size={20}/> 알레르기 / 주의사항
                    </div>
                    <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {patient.allergies?.split(',').map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                                <span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span>
                            </div>
                        )) || <span style={{color: '#64748b'}}>없음</span>}
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                        <MapPin size={20}/> 환자 작업 위치 (Work Location)
                    </div>
                    <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Anchor size={22} color="#38bdf8" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{patient.workLocation || '미지정'}</div>
                            <div style={{ fontSize: 14, color: '#4a6080', fontWeight: 700, marginTop: 2 }}>Main Deck · Sector B-2</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#26de81', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                        <Phone size={20}/> 비상 연락망 (Emergency Contact)
                    </div>
                    <div style={{ background: 'rgba(38,222,129,0.06)', border: '1px solid rgba(38,222,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{patient.emergencyContact?.name || '미지정'}</span>
                            <span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{patient.emergencyContact?.relation || '-'}</span>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>{patient.emergencyContact?.phone || '-'}</div>
                    </div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
                <button onClick={(e) => { e.stopPropagation(); if(confirm('응급 상황을 선포하고 처치 가이드 화면으로 이동하시겠습니까?')) onNavigate?.('emergency') }} style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}>
                    <AlertTriangle size={28} /> 응급 처치 액션 시작
                </button>
            </div>
        </aside>

        {/* [Right] Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 35, padding: '40px 60px', overflowY: 'auto' }}>
          {/* 활력 징후 입력 확인 섹션 */}
          <SectionCard title="현재 활력 징후 확인 (실시간 센서 데이터)" icon={<HeartPulse size={36} color="#ff4d6d"/>}>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 25, background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: 24, border: '1.5px solid rgba(255,255,255,0.05)' }}>
                <VitalField label="혈압(BP)" value={vitals.bp || '-'} status={getVitalStatus('bp', vitals.bp)} editable onEdit={() => openEdit('bp', vitals.bp)} />
                <VitalField label="맥박(PR)" value={`${vitals.hr || patient.vitals?.hr || '-'} bpm`} status={getVitalStatus('hr', vitals.hr || patient.vitals?.hr)} />
                <VitalField label="호흡(RR)" value={`${vitals.rr || 16} /min`} status={{ label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }} />
                <VitalField label="체온(BT)" value={`${vitals.temp || '-'} °C`} status={getVitalStatus('temp', vitals.temp)} editable onEdit={() => openEdit('temp', vitals.temp)} />
                <VitalField label="산소(SpO2)" value={`${vitals.spo2 || patient.vitals?.spo2 || '-'} %`} status={getVitalStatus('spo2', vitals.spo2 || patient.vitals?.spo2)} />

                {/* 인라인 플로팅 입력 모달 (메인 페이지 스타일) */}
                {editTarget && editTarget !== 'role' && (
                  <div style={{
                    position: 'absolute', 
                    top: '110%', 
                    left: editTarget === 'bp' ? '10%' : '70%',
                    zIndex: 1000,
                    width: 360, background: '#1e293b', border: '2px solid #38bdf8', borderRadius: 24,
                    padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'slideDown 0.2s ease'
                  }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {editTarget === 'bp' ? <Activity size={20} /> : <Droplets size={20} />}
                      {editTarget === 'bp' ? '혈압 직접 입력' : '체온 직접 입력'}
                    </div>
                    <input 
                      autoFocus
                      value={editValue} 
                      placeholder={editTarget === 'bp' ? '예: 120/80' : '예: 36.5'}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveEdit();
                        }
                      }}
                      style={{
                        width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 14, padding: '16px 20px', color: '#fff', fontSize: 24, fontWeight: 800,
                        outline: 'none', marginBottom: 20, textAlign: 'center', letterSpacing: '1px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>취소</button>
                      <button onClick={saveEdit} style={{ flex: 2, padding: '14px', borderRadius: 12, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 950, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>데이터 저장</button>
                    </div>
                  </div>
                )}
            </div>
          </SectionCard>
          
          <SectionCard title="1. 환자 상태 관찰 일지" icon={<Stethoscope size={36} color="#38bdf8"/>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div style={{ marginBottom: 5, padding: '18px 24px', background: 'rgba(56,189,248,0.05)', borderRadius: 16, border: '1px solid rgba(56,189,248,0.1)', fontSize: '23px', color: '#38bdf8', fontWeight: 700, lineHeight: 1.5 }}>
                💡 환자가 직접 말하는 증상과 관리자가 눈으로 본 내용을 차례대로 기록해 주세요.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'end' }}>
                <InputBox label="가장 불편한 곳 (어디가 아픈가요?)" placeholder='예: "심한 두통", "어깨 통증", "어지러움"' value={mainComplaint} onChange={(v) => { setMainComplaint(v); setShowPlan(false); }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}><label style={{ fontSize: '23px', color: '#94a3b8', fontWeight: 800 }}>증상이 나타난 시각</label><button onClick={(e) => { e.stopPropagation(); setNowTime(); }} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(56,189,248,0.2)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '17px', fontWeight: 900, cursor: 'pointer' }}>지금 시각으로 설정</button></div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <span style={{ fontSize: '28px', fontWeight: 950, color: '#38bdf8', letterSpacing: '1px' }}>{occurrenceTime}</span>
                    <button onClick={(e) => { e.stopPropagation(); setIsTimeModalOpen(true); }} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '16.5px', fontWeight: 700, cursor: 'pointer' }}>직접 변경</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: '23px', color: '#94a3b8', fontWeight: 800 }}>통증 부위 선택 (환자가 아프다고 하는 곳)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  <PainAreaGroup label="머리 / 목" icon={<User size={22} color="#38bdf8" />} areas={['머리(두통)', '얼굴', '목', '치아/잇몸']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="몸통 (앞/뒤)" icon={<Activity size={22} color="#38bdf8" />} areas={['가슴(흉통)', '어깨', '상복부', '하복부', '옆구리', '등/허리']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="하체" icon={<Zap size={22} color="#38bdf8" />} areas={['골반', '허벅지', '무릎', '종아리', '발목/발']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="팔 / 기타" icon={<Sparkles size={22} color="#38bdf8" />} areas={['팔꿈치', '팔(전체)', '손목/손', '항문/회음부', '전신 통증']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                <div>
                  <div style={{ fontSize: '23px', color: '#94a3b8', fontWeight: 800, marginBottom: 15 }}>눈에 보이는 증상 (관찰된 것)</div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '20px 30px', border: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <span style={{ fontSize: '17.5px', color: '#64748b', fontWeight: 800, whiteSpace: 'nowrap', width: '140px' }}>전신/의식 상태</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['의식 변화', '호흡 곤란', '구토', '발열', '식은땀', '청색증'].map(s => {
                          const active = selectedSymptoms.includes(s) || detailedNote.includes(s)
                          return (<button key={s} onClick={() => toggleSymptom(s)} style={{ padding: '10px 16px', borderRadius: 12, background: active ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: active ? '#38bdf8' : '#fff', fontSize: '17.5px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>{s}</button>)
                        })}
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <span style={{ fontSize: '17.5px', color: '#64748b', fontWeight: 800, whiteSpace: 'nowrap', width: '140px' }}>외상/환부 상태</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['출혈', '대량 출혈(위험)', '부종(부기)', '피부 발진', '마비/저림', '찰과상/열상', '총상/자상(초응급)', '변형(골절의심)'].map(s => {
                          const active = selectedSymptoms.includes(s) || detailedNote.includes(s)
                          return (<button key={s} onClick={() => toggleSymptom(s)} style={{ padding: '10px 16px', borderRadius: 12, background: active ? (s.includes('위험') || s.includes('응급') ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.25)') : 'rgba(255,255,255,0.03)', border: `1.5px solid ${active ? (s.includes('위험') || s.includes('응급') ? '#f43f5e' : '#38bdf8') : 'rgba(255,255,255,0.1)'}`, color: active ? (s.includes('위험') || s.includes('응급') ? '#ff4d6d' : '#38bdf8') : '#fff', fontSize: '17.5px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>{s}</button>)
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <InputBox label="상세한 증상 이야기 (언제부터, 어떻게 아픈가요?)" placeholder="증상이 시작된 계기나 통증의 느낌(콕콕 쑤심, 묵직함 등)을 자유롭게 적어주세요." isTextArea value={detailedNote} onChange={(v) => { setDetailedNote(v); setShowPlan(false); }} />
              </div>

              {!showPlan && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <button 
                    onClick={() => setShowPlan(true)} 
                    style={{ 
                      padding: '22px 60px', 
                      borderRadius: 24, 
                      background: selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) 
                        ? 'linear-gradient(135deg, #f43f5e 0%, #991b1b 100%)' 
                        : 'linear-gradient(135deg, #38bdf8 0%, #26de81 100%)', 
                      color: '#fff', 
                      border: 'none', 
                      fontWeight: 950, 
                      fontSize: '24px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 15, 
                      boxShadow: selectedSymptoms.some(s => s.includes('위험') || s.includes('응급'))
                        ? '0 10px 40px rgba(244,63,94,0.4)'
                        : '0 10px 40px rgba(56,189,248,0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    {selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? <ShieldAlert size={28} /> : <Sparkles size={28} />}
                    {selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? '초응급 모드 진단 실행' : 'AI 진단 및 처치 가이드 생성'}
                  </button>
                </div>
              )}
            </div>
          </SectionCard>
          
          {showPlan && (
            <div style={{ animation: 'slideDown 0.6s ease-out forwards', display: 'flex', flexDirection: 'column', gap: 35 }}>
              <SectionCard title={selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? "🚨 초응급 조치 명령 (EMERGENCY PLAN)" : "2. 조치 및 계획 (Plan)"} icon={<Pill size={36} color={selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? "#f43f5e" : "#26de81"}/>}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                  
                  {/* 비의료진 외상 처치 안전 수칙 안내 박스 (트라우마 특화) */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '2px solid #fb923c', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ background: 'linear-gradient(90deg, #fb923c 0%, #f59e0b 100%)', padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 20 }}>
                      <ShieldAlert size={40} color="#0f172a" />
                      <span style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>비의료진 외상 처치 안전 수칙 (필독)</span>
                    </div>
                    
                    <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <div style={{ display: 'flex', gap: 20 }}>
                          <div style={{ fontSize: '40px', fontWeight: 950, color: '#fb923c', opacity: 0.5, lineHeight: 1 }}>01</div>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fb923c', marginBottom: 8 }}>지혈 및 상처 보호</div>
                            <div style={{ fontSize: '21px', color: '#fff', lineHeight: 1.6, fontWeight: 700 }}>
                              출혈 부위는 멸균 거즈로 <span style={{ color: '#fb923c' }}>직접 압박</span>하여 지혈하며, 오염된 손으로 상처를 직접 만지지 마십시오.
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                          <div style={{ fontSize: '40px', fontWeight: 950, color: '#fb923c', opacity: 0.5, lineHeight: 1 }}>02</div>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fb923c', marginBottom: 8 }}>환부 고정 및 이동 제한</div>
                            <div style={{ fontSize: '21px', color: '#fff', lineHeight: 1.6, fontWeight: 700 }}>
                              골절이 의심될 경우 <span style={{ color: '#fb923c' }}>부목이나 삼각건</span>을 이용해 움직임을 최소화하고, 무리하게 환자를 옮기지 마십시오.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <div style={{ display: 'flex', gap: 20 }}>
                          <div style={{ fontSize: '40px', fontWeight: 950, color: '#fb923c', opacity: 0.5, lineHeight: 1 }}>03</div>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fb923c', marginBottom: 8 }}>바이탈 체크 및 쇼크 방지</div>
                            <div style={{ fontSize: '21px', color: '#fff', lineHeight: 1.6, fontWeight: 700 }}>
                              환자의 <span style={{ color: '#fb923c' }}>의식과 호흡</span>을 지속적으로 확인하며, 담요 등을 이용해 체온이 떨어지지 않도록 유지하십시오.
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 20, background: 'rgba(244, 63, 94, 0.1)', padding: '20px', borderRadius: '20px', border: '1.5px solid rgba(244, 63, 94, 0.3)' }}>
                          <div style={{ fontSize: '40px', fontWeight: 950, color: '#f43f5e', lineHeight: 1 }}>!</div>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: 900, color: '#f43f5e', marginBottom: 8 }}>경추 및 척추 손상 주의</div>
                            <div style={{ fontSize: '21px', color: '#fff', lineHeight: 1.6, fontWeight: 800 }}>
                              추락 사고 등 <span style={{ color: '#f43f5e', textDecoration: 'underline' }}>척추 손상</span>이 의심되는 경우 환자의 머리와 목을 절대 움직이지 않도록 고정해야 합니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI 분석 및 제안 섹션 */}
                  {selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? (
                    /* 초응급 RED ALERT 모드 UI */
                    <div style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(153, 27, 27, 0.3) 100%)', border: '2px solid #f43f5e', borderRadius: '24px', padding: '30px', position: 'relative', overflow: 'hidden', boxShadow: '0 0 30px rgba(244, 63, 94, 0.2)' }}>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', animation: 'pulse 2s infinite' }}><ShieldAlert size={80} color="#f43f5e" opacity={0.3} /></div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 25 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244, 63, 94, 0.6)', animation: 'pulse 1s infinite' }}>
                          <AlertTriangle size={30} color="#fff" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '24px', fontWeight: 950, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>CRITICAL EMERGENCY : 생명 위협 상황</div>
                          <div style={{ fontSize: '15px', color: '#fda4af', fontWeight: 700 }}>AI가 감지한 즉시 조치 프로토콜이 활성화되었습니다.</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
                        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: 18, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                          <div style={{ fontSize: '15px', color: '#ff4d6d', fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldAlert size={18}/> 1단계 : 지혈 (Hemostasis)</div>
                          <div style={{ fontSize: '17px', color: '#fff', fontWeight: 700, lineHeight: 1.6 }}>
                            상처 부위를 깨끗한 거즈로 <span style={{ color: '#ff4d6d', textDecoration: 'underline' }}>체중을 실어 직접 압박</span>하십시오. 지혈이 되지 않을 경우 상처 상단 5-10cm 지점에 지혈대(Tourniquet)를 사용하십시오.
                          </div>
                        </div>

                        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: 18, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                          <div style={{ fontSize: '15px', color: '#ff4d6d', fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={18}/> 2단계 : 쇼크 방지</div>
                          <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '16px', color: '#fda4af', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <li>환자를 눕히고 다리를 30cm 거상</li>
                            <li>체온 유지를 위해 담요 사용</li>
                            <li>의식 확인 및 지속적 말 걸기</li>
                          </ul>
                        </div>

                        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: 18, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                          <div style={{ fontSize: '15px', color: '#ff4d6d', fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={18}/> 3단계 : MEDEVAC 요청</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>해안의료 SOS 발신</button>
                            <button style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #f43f5e', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>원격 의사 화상 연결</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 일반 모드 AI 리포트 UI (기존 유지) */
                    <div style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(38, 222, 129, 0.1) 100%)', border: '1.5px solid rgba(56, 189, 248, 0.3)', borderRadius: '24px', padding: '25px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Sparkles size={120} color="#38bdf8" /></div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)' }}>
                          <Sparkles size={24} color="#0f172a" />
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          AI 실시간 증상 분석 리포트
                          <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: 6, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>BETA v2.0</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
                        {/* 분석 브리핑 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '15px', color: '#38bdf8', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={18}/> 분석 브리핑</div>
                          <div style={{ fontSize: '18px', color: '#e2e8f0', fontWeight: 700, lineHeight: 1.6 }}>
                            {painAreas.length > 0 || selectedSymptoms.length > 0 ? (
                              <>선택된 <span style={{ color: '#38bdf8' }}>{painAreas[0] || selectedSymptoms[0]}</span> 증상은 초기 대응이 중요합니다. 활력 징후가 안정적이므로 가이드에 따른 처치 후 경과를 관찰하십시오.</>
                            ) : (
                              <span style={{ color: '#64748b' }}>증상을 선택하면 AI 분석이 시작됩니다.</span>
                            )}
                          </div>
                        </div>

                        {/* 권장 처치 가이드 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '15px', color: '#26de81', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={18}/> 비의료진 권장 처치</div>
                          <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '16.5px', color: '#cbd5e1', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <li>환부를 높게 유지하고 안정</li>
                            <li>15분 간격 아이싱 (부종 완화)</li>
                            <li>심리적 안정 유도</li>
                          </ul>
                        </div>

                        {/* 제안 상비약 */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '15px', color: '#fb923c', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Pill size={18}/> AI 추천 상비약</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['타이레놀', '소염진통제'].map(m => (
                              <span key={m} style={{ fontSize: '14px', padding: '5px 12px', borderRadius: 8, background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.3)', fontWeight: 800 }}>{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>                    </div>
                  )}

                  <div>
                    <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 20 }}>
                      <label style={{ fontSize: '34px', color: '#94a3b8', fontWeight: 800 }}>실제 수행한 조치 내용</label>
                      <span style={{ fontSize: '16px', color: '#ff4d6d', fontWeight: 900, background: 'rgba(255, 77, 109, 0.1)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255, 77, 109, 0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={14} /> ※ 처방약 투여 시 반드시 기록
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
                      {OTC_MEDS.map(m => (<button key={m.id} onClick={() => toggleMed(m.name)} style={{ padding: '15px 10px', borderRadius: 15, textAlign: 'center', cursor: 'pointer', background: selectedMeds.includes(m.name) ? 'rgba(38,222,129,0.15)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${selectedMeds.includes(m.name) ? '#26de81' : 'rgba(255,255,255,0.1)'}`, transition: '0.2s' }}><div style={{ fontSize: '18.5px', fontWeight: 900, color: selectedMeds.includes(m.name) ? '#26de81' : '#fff' }}>{m.name}</div></button>))}
                    </div>
                    <InputBox label="" placeholder={selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? "초응급 처치 수행 내역과 원격 지시 사항을 상세히 기록하십시오." : "AI 제안 사항 중 수행한 내용이나, 원격 의사의 추가 지시 사항을 기록하세요."} isTextArea value={otherActions} onChange={(v) => { setOtherActions(v); }} />
                  </div>
                </div>
              </SectionCard>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 22, paddingBottom: 40 }}>
                <button 
                  onClick={() => setShowPlan(false)} 
                  style={{ padding: '24px 40px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, fontSize: '20px', cursor: 'pointer' }}
                >
                  기록 수정하기
                </button>
                <button 
                  onClick={handleSave} 
                  style={{ padding: '24px 50px', borderRadius: 20, background: selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? '#f43f5e' : '#38bdf8', color: '#fff', border: 'none', fontWeight: 950, fontSize: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 15, boxShadow: selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? '0 10px 30px rgba(244,63,94,0.3)' : '0 10px 30px rgba(56,189,248,0.2)' }}
                >
                  <CheckCircle2 size={32}/> {selectedSymptoms.some(s => s.includes('위험') || s.includes('응급')) ? "긴급 상황 보고 및 저장" : "최종 기록 저장"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0.6; transform: scale(1); } }
      `}</style>
    </div>
  )
}

function InfoItem({ label, value, size }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 800 }}>{label}</span>
            <span style={{ fontSize: size === 'xl_ultra' ? '24px' : '19px', fontWeight: 950, color: '#fff' }}>{value}</span>
        </div>
    )
}

function SectionCard({ title, icon, children }) {
  return (<div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: 36, padding: '35px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}><div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div><div style={{ fontSize: '28px', fontWeight: 950 }}>{title}</div></div>{children}</div>)
}

function PainAreaGroup({ label, areas, selectedAreas, onClick, icon }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '24px', border: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
        {icon}
        <div style={{ fontSize: '21px', color: '#e2e8f0', fontWeight: 850 }}>{label}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {areas.map(area => {
          const isActive = selectedAreas.includes(area)
          return (
            <button 
              key={area} 
              onClick={() => onClick(area)} 
              style={{ 
                padding: '11px 20px', 
                borderRadius: 14, 
                background: isActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)', 
                border: `1.5px solid ${isActive ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, 
                color: isActive ? '#38bdf8' : '#cbd5e1', 
                fontSize: '19px', 
                fontWeight: 700, 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
            >
              {area}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InputBox({ label, placeholder, isTextArea, value, onChange }) {
  return (<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><label style={{ fontSize: '24px', color: '#94a3b8', fontWeight: 800 }}>{label}</label>{isTextArea ? (<textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', minHeight: 120, background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '22px', color: '#fff', fontSize: '23px', outline: 'none', resize: 'none', lineHeight: 1.5 }} />) : (<input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '20px 28px', color: '#fff', fontSize: '23px', outline: 'none' }} />)}</div>)
}

function VitalField({ label, value, status, editable, onEdit }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '5px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
                <span style={{ fontSize: '23px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <span style={{ padding: '4px 14px', borderRadius: 8, background: status.bg, color: status.color, fontSize: '16px', fontWeight: 900, border: `1px solid ${status.color}40`, whiteSpace: 'nowrap' }}>{status.label}</span>
                {editable && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}
                  >
                    <Pencil size={14} color="#38bdf8" />
                  </button>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: '37px', fontWeight: 950, color: status.color, letterSpacing: '-1px', lineHeight: 1 }}>{value.split(' ')[0]}</span>
                {value.includes(' ') && <span style={{ fontSize: '18.5px', color: '#64748b', fontWeight: 800 }}>{value.split(' ')[1]}</span>}
            </div>
        </div>
    )
}
