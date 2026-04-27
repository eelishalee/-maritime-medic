import { useState, useEffect, useRef } from 'react'
import { Activity, History, RotateCcw, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, ChevronDown, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize, Thermometer, Wind } from 'lucide-react'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({
  activePatient, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, handleTraumaAnalysis,
  isScanning, scanError, setScanError, setIsScanning,
  setBp, setBt, onSwitchPatient
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

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

  // ─── 센서 상태 및 점검 안내 ───
  const [spo2Status, setSpo2Status] = useState('normal') 
  const [showSensorGuide, setShowSensorGuide] = useState(false)

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
    if (spo2Status === 'normal') {
      setSpo2Status('error')
      setShowSensorGuide(true)
    } else {
      setSpo2Status('normal')
      setShowSensorGuide(false)
    }
  }

  // 카메라 스트림 관리
  useEffect(() => {
    let activeStream = null
    async function startCamera() {
      if (isScanning) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: 1280, height: 720 } 
          })
          activeStream = s
          streamRef.current = s
          if (videoRef.current) videoRef.current.srcObject = s
          setIsCameraActive(true)
        } catch (err) {
          console.error("카메라 접근 실패:", err)
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        setIsCameraActive(false)
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
      // 현재 선택된 환자의 기록만 필터링
      const patientRecords = records.filter(r => r.patientId === activePatient?.id)
      
      const newTimeline = patientRecords.map(r => ({
        time: new Date(r.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        title: r.mainComplaint || '환자 상태 기록 업데이트',
        color: r.isEmergency ? '#f43f5e' : '#38bdf8',
        detail: `• 주요증상: ${r.selectedSymptoms.join(', ') || '관찰 중'}\n• 조치내용: ${r.prescribedMeds.join(', ') || '경과 관찰'}\n• 특이사항: ${r.otherActions || '없음'}`
      }))

      // 기본 타임라인 데이터와 병합 (최신순)
      const baseTimeline = [
        { time: '09:12', title: '상황 발생 감지', color: '#f43f5e', detail: '• 시스템 모니터링 시작\n• 바이탈 센서 연동 대기' },
      ]

      setDynamicTimeline([...newTimeline, ...baseTimeline])
    }

    loadRecords()
    // 1초마다 데이터 갱신 (저장 즉시 반영을 위함)
    const interval = setInterval(loadRecords, 1000)
    return () => clearInterval(interval)
  }, [activePatient])

  // 비상연락처 데이터 파싱 (Dashboard 전용)
  const getEmergencyDisplay = () => {
    let display = { name: '미지정', phone: '-', relation: '-' };
    
    // 보호자 성명 강제 매핑 (데이터 누락 방지)
    const PROTECTOR_MAP = {
      'S26-001': '김도윤', 'S26-002': '이서연', 'S26-003': '양정희', 'S26-004': '박지호',
      'S26-005': '최민준', 'S26-006': '정하윤', 'S26-007': '강준우', 'S26-008': '조예은',
      'S26-009': '임도현', 'S26-010': '장수빈', 'S26-011': '황지훈', 'S26-012': '한지민',
      'S26-013': '오세현', 'S26-014': '나혜지', 'S26-015': '송다희', 'S26-016': '김한혜'
    };

    const forcedName = PROTECTOR_MAP[activePatient?.id];

    // 1. 신규 선원 등록 시 저장되는 emergencyName 필드 또는 강제 매핑 확인
    if (activePatient?.emergencyName || forcedName) {
      display.name = forcedName || activePatient.emergencyName;
      
      // 연락처 문자열 파싱 (예: "010-1234-5678 (배우자)")
      if (activePatient?.emergency && typeof activePatient.emergency === 'string') {
        const parts = activePatient.emergency.split(' ');
        display.phone = parts[0] || '-';
        display.relation = parts[1] ? parts[1].replace(/[()]/g, '') : '가족';
      }
      return display;
    }

    // 2. 기존 객체 형태 데이터 확인
    if (activePatient?.emergencyContact && typeof activePatient.emergencyContact === 'object') {
      display = {
        name: forcedName || activePatient.emergencyContact.name || '미지정',
        phone: activePatient.emergencyContact.phone || '-',
        relation: activePatient.emergencyContact.relation || '-'
      };
    } 
    // 3. 문자열 형태 데이터 확인
    else if (activePatient?.emergency && typeof activePatient.emergency === 'string') {
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

      {/* [Overlay] 외상 스캐너 UI (오리지널 하이테크 스타일) */}
      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          
          {/* 스캐닝 비네트 및 HUD 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0, 10, 20, 0.7) 100%)', pointerEvents: 'none' }} />
          
          {/* 상단 안내 바 */}
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, zIndex: 10001 }}>
            <div style={{ 
              background: 'rgba(0, 20, 30, 0.85)', padding: '20px 60px', borderRadius: '15px', 
              color: '#fff', fontSize: 24, fontWeight: 900, border: '1.5px solid #00e5cc', 
              boxShadow: '0 0 40px rgba(0, 229, 204, 0.4)', backdropFilter: 'blur(10px)' 
            }}>
              진단 부위를 원형 프레임 내부에 맞춰주세요
            </div>
          </div>

          {/* 중앙 스캔 영역 (HUD 디자인) */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '600px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* 사각 코너 가이드 (L자 브래킷) - 애니메이션 제거 */}
              <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />

              {/* 중앙 원형 및 회전 대시 라인 */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0, 229, 204, 0.3)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', width: '92%', height: '92%', border: '2px dashed rgba(0, 229, 204, 0.2)', borderRadius: '50%', animation: 'spin 10s infinite linear' }} />
              
              {/* 실시간 스캔 레이저 라인 */}
              {!scanError && (
                <div style={{ 
                  position: 'absolute', top: '15%', left: '15%', width: '70%', height: '2px', 
                  background: 'linear-gradient(to right, transparent, #fff, #00e5cc, #fff, transparent)', 
                  boxShadow: '0 0 20px #00e5cc', animation: 'scanMoveInner 2.5s infinite ease-in-out', zIndex: 10005 
                }} />
              )}

              {/* 중앙 조준점 */}
              <div style={{ position: 'absolute', width: 40, height: 2, background: '#00e5cc' }} />
              <div style={{ position: 'absolute', width: 2, height: 40, background: '#00e5cc' }} />
            </div>

            {/* 에러 모달 */}
            {scanError && (
              <div style={{ position: 'absolute', width: 560, background: 'rgba(2, 15, 25, 0.98)', padding: '50px', borderRadius: '32px', color: '#fff', textAlign: 'center', zIndex: 10002, border: '3px solid #ff4d6d', boxShadow: '0 0 60px rgba(255, 77, 109, 0.4)', backdropFilter: 'blur(30px)' }}>
                <div style={{ fontSize: 36, fontWeight: 950, marginBottom: 20, color: '#ff4d6d' }}>스캔 분석 중단됨</div>
                <button onClick={() => setScanError(null)} style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 950, fontSize: 24, cursor: 'pointer' }}>다시 시도</button>
              </div>
            )}
          </div>

          {/* 하단 제어 버튼 */}
          <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10001 }}>
            <button onClick={() => setIsScanning(false)} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '18px 60px', borderRadius: '100px', color: '#fff', fontSize: 18, fontWeight: 900, border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', backdropFilter: 'blur(15px)' }}>진단 모드 종료</button>
          </div>
        </div>
      )}

      {/* [Left] Patient Info Panel */}
      <aside style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ flexShrink: 0, padding: '24px 28px 20px 28px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          
          {/* 환자 선택 셀렉트 박스 (PatientChart와 동일 디자인) */}
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

          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: 24, background: '#1e293b', border: '3px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src={activePatient?.avatar || '/CE.jpeg'} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activePatient?.name || 'User') + '&background=0ea5e9&color=fff&size=128'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
            </div>
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
          {/* 기저 질환 복원 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Activity size={20}/> 기저 질환 (Chronic)</div>
            <div style={{ fontSize: 19, fontWeight: 750, color: '#fed7aa', background: 'rgba(251,146,60,0.06)', padding: '16px', borderRadius: 16, border: '1px solid rgba(251,146,60,0.15)' }}>
              {activePatient?.chronic || '기록 없음'}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><History size={20}/> 과거력 (Past History)</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              {activePatient?.history ? activePatient.history.split('\n').map((line, i) => <div key={i}>{line}</div>) : '기록 없음'}
            </div>
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
            <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(activePatient?.allergies || '없음').split(',').map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} /><span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span></div>
              ))}
            </div>
          </div>

          {/* 작업 위치 복원 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><MapPin size={20}/> 환자 작업 위치</div>
            <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Anchor size={22} color="#38bdf8" />
              </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{activePatient?.location || activePatient?.workLocation || '미지정'}</div>
              <div style={{ fontSize: 14, color: '#4a6080', fontWeight: 700, marginTop: 2 }}>실시간 위치 트래킹 활성화됨</div>
            </div>
            </div>
          </div>

          {/* 비상 연락망 복원 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#26de81', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Phone size={20}/> 보호자 연락처</div>
            <div style={{ background: 'rgba(38,222,129,0.06)', border: '1px solid rgba(38,222,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{emergency.name}</span>
                <span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{emergency.relation}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>
                {emergency.phone}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={() => startEmergencyAction('CPR')} style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}><AlertTriangle size={28} /> 응급 처치 액션 시작</button>
        </div>
      </aside>

      {/* [Center] Vitals & AI Assistant */}
      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1.4fr 1.4fr', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff4d6d" live valueSize={38} />
            <div onClick={toggleSpo2Status} style={{ cursor: 'pointer' }}>
              <DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live isConnected={spo2Status === 'normal'} valueSize={38} />
            </div>
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#8b5cf6" live valueSize={38} />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#eab308" editable onEdit={() => openEdit('bp', bp)} valueSize={40} />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#f97316" editable onEdit={() => openEdit('bt', bt)} valueSize={40} />
          </div>

          {/* 모달 디자인을 PatientChart.jsx와 동일하게 복원 */}
          {editTarget && (
            <div style={{
              position: 'absolute', 
              top: '110%', 
              left: editTarget === 'bp' ? '70%' : 'auto', 
              right: editTarget === 'bt' ? '45px' : 'auto', 
              transform: editTarget === 'bp' ? 'translateX(-50%) translateY(15px)' : 'translateY(15px)', 
              zIndex: 1000, 
              width: 360, 
              background: '#1e293b', 
              border: '2px solid #38bdf8', 
              borderRadius: 24, 
              padding: 28, 
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
              animation: 'slideUp 0.2s ease', 
              backdropFilter: 'blur(25px)' 
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                {editTarget === 'bp' ? <Activity size={20} /> : <Thermometer size={20} />}
                {editTarget === 'bp' ? '혈압 직접 입력' : '체온 직접 입력'}
              </div>
              <input 
                value={editValue} 
                autoFocus 
                placeholder={editTarget === 'bp' ? '예: 120/80' : '예: 36.5'} 
                onChange={e => setEditValue(e.target.value)} 
                onKeyDown={e => { 
                  if (e.key === 'Enter') saveEdit(); 
                  if (e.key === 'Escape') setEditTarget(null); 
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0' }}><Sparkles size={20} color="#38bdf8" /> MDTS 진단 어시스턴트</div>
            <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 229, 204, 0.2), #00e5cc, rgba(0, 229, 204, 0.2), transparent)', boxShadow: '0 0 12px #00e5cc', animation: 'flowingLight 5s infinite linear' }} /></div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 120px 20px', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.role === 'ai' ? <Sparkles size={14} color="#000" /> : <User size={14} color="#fff" />}</div>
                <div style={{ flex: 1, maxWidth: '92%' }}><div style={{ padding: '16px 22px', borderRadius: m.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px', background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.03)', border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: '#e2e8f0' }}><AiMessageRenderer text={m.text} /></div></div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 24px 20px', background: 'linear-gradient(to top, #05070a 85%, transparent)', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
            <div style={{ width: '100%', background: '#0a0f1e', borderRadius: '20px', padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(56,189,248,0.2)', height: 72, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <input placeholder="질문하세요..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 18 }} />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 28px', height: '100%', borderRadius: '14px', border: 'none', background: '#38bdf8', color: '#000', fontWeight: 950, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                질문하기 <ArrowUp size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* [Right] Timeline */}
      <aside style={{ width: 480, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flexShrink: 0, padding: '32px 28px 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={22}/> 상황 대응 타임라인</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 120px 28px', scrollbarWidth: 'none' }}>
           <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
             <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #facc15, #38bdf8)' }} />
             {dynamicTimeline.map((item, idx) => (
               <div key={idx} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 40 }}>
                 <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#05070a', border: `3px solid ${item.color}`, zIndex: 2 }} />
                 <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.time}</div>
                 <div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{item.title}</div>
                 {item.detail && <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 8, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.detail}</div>}
               </div>
             ))}
           </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(56,189,248,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={handleTraumaAnalysis} style={{ width: '100%', height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)' }}><Camera size={28} /> 외상 촬영 및 AI 분석</button>
        </div>
      </aside>

      <style>{`
        @keyframes borderRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes flowingLight { 0% { left: -100%; } 50% { left: 0%; } 100% { left: 100%; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes scanMoveInner { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
        @keyframes bracketPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        input::placeholder { color: rgba(255, 255, 255, 0.2) !important; }
      `}</style>
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
          {guide && (
            <button style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={18} color="#38bdf8" /> 의학 가이드 확인 : {guide} <ChevronRight size={14}/>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
