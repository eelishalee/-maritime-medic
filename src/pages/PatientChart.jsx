import { useState, useEffect, useRef } from 'react'
import { 
  Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle, 
  Stethoscope, ClipboardList, Pill, Camera, ChevronRight, CheckCircle2,
  AlertCircle, Info, Search, User, ChevronDown, ShieldAlert, Zap, ThermometerSnowflake,
  History, RotateCcw, MapPin, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, ShieldCheck, Phone
} from 'lucide-react'

// 확장된 선원 데이터 (메인 데이터와 동기화)
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
  { id: 'm1', name: '해열진통제 (타이레놀)', type: '통증/발열' },
  { id: 'm2', name: '소화제', type: '소화불량' },
  { id: 'm3', name: '제산제 (겔포스 등)', type: '속쓰림' },
  { id: 'm4', name: '항히스타민제', type: '알레르기' },
  { id: 'm5', name: '연고 (마데카솔/후시딘)', type: '외상' },
  { id: 'm6', name: '소독액 (베타딘/알코올)', type: '살균' },
]

export default function PatientChart({ patient: activePatientProp }) {
  // 선내 담당자 목록 불러오기
  const [managers] = useState(() => {
    try {
      const saved = localStorage.getItem('mdts_managers')
      return saved ? JSON.parse(saved) : [
        { id: 'm1', name: '이선장', role: '안전책임자' },
        { id: 'm2', name: '박기관', role: '의료담당자' },
      ]
    } catch { return [] }
  })

  const [selectedId, setSelectedId] = useState(activePatientProp?.id || 'S26-003')
  const [selectedDoctor, setSelectedDoctor] = useState(managers[0] || { name: '미지정', role: '-' })
  const [isDoctorOpen, setIsDoctorOpen] = useState(false)
  const doctorSelectRef = useRef(null)
  const selectRef = useRef(null)
  
  const patient = ALL_CREW.find(c => c.id === selectedId) || ALL_CREW[0]
  
  // 바이탈 상태 판별 로직
  const getVitalStatus = (type, value) => {
    if (type === 'bp') {
        const sys = parseInt(value.split('/')[0])
        if (sys >= 160) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (sys >= 140) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (sys >= 130) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'hr') {
        if (value >= 110 || value <= 50) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (value >= 100 || value <= 60) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (value >= 90) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'temp') {
        if (value >= 39.0 || value <= 35.0) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (value >= 38.0) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (value >= 37.3) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    if (type === 'spo2') {
        if (value < 90) return { label: '위험', color: '#ff4d6d', bg: 'rgba(255,77,109,0.15)' }
        if (value < 95) return { label: '주의', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' }
        if (value < 97) return { label: '관찰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' }
        return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
    }
    return { label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }
  }

  const [painAreas, setPainAreas] = useState([])
  const [ampm, setAmpm] = useState('오후')
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [occurrenceTime, setOccurrenceTime] = useState('오후 12:00')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [detailedNote, setDetailedNote] = useState('')
  const [selectedMeds, setSelectedMeds] = useState([])
  const [otherActions, setOtherActions] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)

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
  }

  const toggleSymptom = (s) => {
    const isSelecting = !selectedSymptoms.includes(s)
    setSelectedSymptoms(isSelecting ? [...selectedSymptoms, s] : selectedSymptoms.filter(item => item !== s))
    if (isSelecting) setDetailedNote(prev => prev ? `${prev}, ${s}` : s)
    else setDetailedNote(prev => prev.replace(new RegExp(`, ${s}|${s}, |${s}`, 'g'), '').trim().replace(/^,|,$/g, ''))
  }

  const handlePainAreaClick = (area) => {
    const isSelecting = !painAreas.includes(area)
    const newAreas = isSelecting ? [...painAreas, area] : painAreas.filter(a => a !== area)
    setPainAreas(newAreas)
    const areaText = `${area} 통증`
    if (isSelecting) setDetailedNote(prev => prev ? `${areaText}, ${prev}` : areaText)
    else setDetailedNote(prev => prev.replace(new RegExp(`, ${areaText}|${areaText}, |${areaText}`, 'g'), '').trim().replace(/^,|,$/g, ''))
  }

  const toggleMed = (medName) => {
    if (selectedMeds.includes(medName)) setSelectedMeds(selectedMeds.filter(m => m !== medName))
    else setSelectedMeds([...selectedMeds, medName])
  }

  const handleSave = () => {
    alert(`[관찰 기록 저장 완료]\n환자: ${patient.name}\n담당: ${selectedDoctor.name}\n발생시각: ${occurrenceTime}\n상태 요약: ${selectedSymptoms.join(', ')}`)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelectOpen(false)
      if (doctorSelectRef.current && !doctorSelectRef.current.contains(e.target)) setIsDoctorOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div style={{ padding: '0', height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* 상단 헤더 */}
      <div style={{ position: 'relative', zIndex: 100, background: 'rgba(7, 15, 30, 0.98)', backdropFilter: 'blur(15px)', borderBottom: '1.5px solid rgba(255,255,255,0.1)', padding: '16px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <div ref={selectRef} style={{ position: 'relative', width: '360px' }}>
            <div onClick={() => setIsSelectOpen(!isSelectOpen)} style={{ background: 'rgba(56,189,248,0.05)', border: `2px solid ${isSelectOpen ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', color: '#fff', padding: '12px 20px', fontSize: '22px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><User size={24} color="#38bdf8" /><span>{patient.name} ({patient.role})</span></div>
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
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 600 }}>최근 내원일 : {patient.last_visit}</div>
                <div ref={doctorSelectRef} style={{ position: 'relative', marginTop: 4 }}>
                    <div onClick={() => setIsDoctorOpen(!isDoctorOpen)} style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${isDoctorOpen ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: '0.2s' }}>
                        <span style={{ fontSize: '17px', color: '#fff', fontWeight: 800 }}>담당 : {selectedDoctor.name}</span>
                        <ChevronDown size={16} style={{ transform: isDoctorOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', color: '#64748b' }} />
                    </div>
                    {isDoctorOpen && (
                        <div style={{ position: 'absolute', top: '110%', right: 0, width: '210px', background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(15px)', border: '1.5px solid rgba(56,189,248,0.3)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1001 }}>
                            {managers.map(d => (
                                <div key={d.id} onClick={() => { setSelectedDoctor(d); setIsDoctorOpen(false); }} style={{ padding: '10px 14px', fontSize: '15.5px', fontWeight: 700, cursor: 'pointer', background: selectedDoctor.id === d.id ? 'rgba(56,189,248,0.15)' : 'transparent', color: selectedDoctor.id === d.id ? '#38bdf8' : '#fff' }}>
                                    {d.name} <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 6 }}>{d.role}</span>
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
                        <img src={patient.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="P" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                            <div style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-0.5px', color: '#fff' }}>{patient.name}</div>
                            <div style={{ fontSize: 20, color: '#38bdf8', fontWeight: 800 }}>{patient.role}</div>
                        </div>
                        <div style={{ fontSize: 16, color: '#475569', fontWeight: 700 }}>ID : {patient.id}</div>
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
                        {patient.allergies.split(',').map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                                <span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span>
                            </div>
                        ))}
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
                            <div style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{patient.workLocation}</div>
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
                            <span style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{patient.emergencyContact?.name}</span>
                            <span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{patient.emergencyContact?.relation}</span>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>{patient.emergencyContact?.phone}</div>
                    </div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
                <button style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}>
                    <AlertTriangle size={28} /> 응급 처치 액션 시작
                </button>
            </div>
        </aside>

        {/* [Right] Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 35, padding: '40px 60px', overflowY: 'auto' }}>
          {/* 활력 징후 입력 확인 섹션 */}
          <SectionCard title="현재 활력 징후 확인 (실시간 센서 데이터)" icon={<HeartPulse size={36} color="#ff4d6d"/>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 25, background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: 24, border: '1.5px solid rgba(255,255,255,0.05)' }}>
                <VitalField label="혈압(BP)" value={patient.vitals.bp} status={getVitalStatus('bp', patient.vitals.bp)} />
                <VitalField label="맥박(PR)" value={`${patient.vitals.hr} bpm`} status={getVitalStatus('hr', patient.vitals.hr)} />
                <VitalField label="호흡(RR)" value={`${patient.vitals.rr} /min`} status={{ label: '정상', color: '#26de81', bg: 'rgba(38,222,129,0.15)' }} />
                <VitalField label="체온(BT)" value={`${patient.vitals.temp} °C`} status={getVitalStatus('temp', patient.vitals.temp)} />
                <VitalField label="산소(SpO2)" value={`${patient.vitals.spo2} %`} status={getVitalStatus('spo2', patient.vitals.spo2)} />
            </div>
          </SectionCard>
          <SectionCard title="1. 현재 상태 관찰 (SOAP 기록)" icon={<Stethoscope size={36} color="#38bdf8"/>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                <InputBox label="주호소 (Chief Complaint)" placeholder='예: "3일 전부터 시작된 하복부 통증"' />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}><label style={{ fontSize: '21px', color: '#94a3b8', fontWeight: 800 }}>증상 발생 시각</label><button onClick={setNowTime} style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(56,189,248,0.2)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '16px', fontWeight: 900, cursor: 'pointer' }}>현재 시각</button></div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '15px', display: 'flex', gap: 15, alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: 950, color: '#38bdf8' }}>{occurrenceTime}</span>
                    <button style={{ padding: '8px 15px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>변경</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: '21px', color: '#94a3b8', fontWeight: 800 }}>호소하는 통증 부위 (중복 선택 가능)</label>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '25px', border: '1.5px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                  <PainAreaGroup label="머리 / 목" areas={['머리(두통)', '얼굴', '목', '어깨']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="몸통" areas={['가슴(흉통)', '상복부', '하복부', '등(상부)', '옆구리']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="하체 / 척추" areas={['허리(요통)', '골반', '왼쪽 다리', '오른쪽 다리']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                  <PainAreaGroup label="팔 / 기타" areas={['왼쪽 팔', '오른쪽 팔', '손목/손', '전신 통증']} selectedAreas={painAreas} onClick={handlePainAreaClick} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                <div>
                  <div style={{ fontSize: '21px', color: '#94a3b8', fontWeight: 800, marginBottom: 15 }}>관찰된 증상 (객관적 지표)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {['의식 변화', '호흡 곤란', '출혈', '구토', '발열', '창백함'].map(s => {
                      const active = selectedSymptoms.includes(s)
                      return (<button key={s} onClick={() => toggleSymptom(s)} style={{ padding: '12px 20px', borderRadius: 14, background: active ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, color: active ? '#38bdf8' : '#fff', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}>{s}</button>)
                    })}
                  </div>
                </div>
                <InputBox label="상세 관찰 및 경과 기록 (History of Present Illness)" placeholder="증상의 발생 시기, 양상, 심화 요인 등을 입력하세요" isTextArea value={detailedNote} onChange={setDetailedNote} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="2. 조치 및 계획 (Plan)" icon={<Pill size={36} color="#26de81"/>}>
            <div style={{ marginBottom: 25, padding: '15px 22px', background: 'rgba(38,222,129,0.05)', borderRadius: 18, border: '1.5px solid rgba(38,222,129,0.2)', fontSize: '18px', color: '#26de81', fontWeight: 700 }}>
                ※ 비의료진은 의사의 지시 없는 전문의약품 투여가 불가하며, 상비약 및 응급 처치만 기록합니다.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 25 }}>
              {OTC_MEDS.map(m => (<button key={m.id} onClick={() => toggleMed(m.name)} style={{ padding: '15px 10px', borderRadius: 15, textAlign: 'center', cursor: 'pointer', background: selectedMeds.includes(m.name) ? 'rgba(38,222,129,0.15)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${selectedMeds.includes(m.name) ? '#26de81' : 'rgba(255,255,255,0.1)'}` }}><div style={{ fontSize: '17px', fontWeight: 900, color: selectedMeds.includes(m.name) ? '#26de81' : '#fff' }}>{m.name}</div></button>))}
            </div>
            <InputBox label="추가 처치 및 향후 계획 (원격 의사 지시 사항 등)" placeholder="처치 내용이나 향후 관찰 계획을 입력하세요" isTextArea value={otherActions} onChange={setOtherActions} />
          </SectionCard>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 22, paddingBottom: 40 }}><button onClick={handleSave} style={{ padding: '24px 50px', borderRadius: 20, background: '#38bdf8', color: '#020617', border: 'none', fontWeight: 950, fontSize: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 15, boxShadow: '0 10px 30px rgba(56,189,248,0.2)' }}><CheckCircle2 size={32}/> 관찰 기록 저장</button></div>
        </div>
      </div>
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

function InfoItem({ label, value, size }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 800 }}>{label}</span>
            <span style={{ fontSize: size === 'xl_ultra' ? '22px' : '18px', fontWeight: 950, color: '#fff' }}>{value}</span>
        </div>
    )
}

function SectionCard({ title, icon, children }) {
  return (<div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: 36, padding: '35px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}><div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div><div style={{ fontSize: '28px', fontWeight: 950 }}>{title}</div></div>{children}</div>)
}

function PainAreaGroup({ label, areas, selectedAreas, onClick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: '18px', color: '#64748b', fontWeight: 800 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {areas.map(area => {
          const isActive = selectedAreas.includes(area)
          return (
            <button key={area} onClick={() => onClick(area)} style={{ padding: '12px 8px', borderRadius: 12, background: isActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${isActive ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`, color: isActive ? '#38bdf8' : '#e2e8f0', fontSize: '16.5px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>{area}</button>
          )
        })}
      </div>
    </div>
  )
}

function InputBox({ label, placeholder, isTextArea, value, onChange }) {
  return (<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><label style={{ fontSize: '21px', color: '#94a3b8', fontWeight: 800 }}>{label}</label>{isTextArea ? (<textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', minHeight: 120, background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '20px', color: '#fff', fontSize: '20px', outline: 'none', resize: 'none', lineHeight: 1.5 }} />) : (<input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '18px 25px', color: '#fff', fontSize: '20px', outline: 'none' }} />)}</div>)
}

function VitalField({ label, value, status }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                <span style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <span style={{ padding: '3px 12px', borderRadius: 8, background: status.bg, color: status.color, fontSize: '14px', fontWeight: 900, border: `1px solid ${status.color}40`, whiteSpace: 'nowrap' }}>{status.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: '32px', fontWeight: 950, color: status.color, letterSpacing: '-1px', lineHeight: 1 }}>{value.split(' ')[0]}</span>
                {value.includes(' ') && <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 800 }}>{value.split(' ')[1]}</span>}
            </div>
        </div>
    )
}
