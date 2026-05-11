import { useState, useEffect, useRef } from 'react'
import { Activity, History, RotateCcw, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, ChevronDown, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize, Thermometer, Wind } from 'lucide-react'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'
import { updateVital } from '../../../utils/api'

function getPatientTimeline(patient) {
  if (!patient) return []
  // TODO: [BACKEND] 실제 DB의 tb_logs 또는 별도 히스토리 테이블에서 환자별 사고 이력을 조회하여 구성해야 함
  const id = patient.id || ''
  const note = patient.note || ''
  const chronic = patient.chronic || '없음'
  const allergies = patient.allergies || '없음'
  const isEmergency = patient.isEmergency

  // 환자별 상황 기록 맵 (박기관만 하드코딩)
  const scenarios = {
    'S26-003': [
      { time: '14:10', title: '작업 중 외상 사고 발생', color: '#f43f5e', detail: `• 사고: 기계실 파이프 정비 중 파손된 파편에 우측 팔꿈치 아래가 깊게 베임` },
      { time: '14:15', title: '상처 확인 및 손상 평가', color: '#fb923c', detail: `• 손상: 약 6cm 가량의 깊은 절상 — 선홍색 피가 솟구치는 활동성 출혈 관찰` },
      { time: '14:25', title: '지혈 조치 및 상태 확인', color: '#facc15', detail: `• 상태: 사고 직후 빠른 압박 지혈로 현재는 출혈이 멎었으나 환부 주변이 부어오름` },
      { time: '14:40', title: '집중 감시 및 주의사항 설정', color: '#38bdf8', detail: `• 주의: 고혈압이 있으며 지혈 상태를 15분 간격으로 재확인해야 함` },
    ],
  }

  if (scenarios[id]) return scenarios[id]

  // 기본 기록 — 증상/평소질환 기반 자동 생성
  const timeline = []
  if (isEmergency) {
    timeline.push({ time: '09:00', title: '이상 증상 처음 보고됨', color: '#f43f5e', detail: `• ${note || '몸 상태가 좋지 않음을 감지'}\n• 선의에게 알리고 직접 확인 요청함` })
    timeline.push({ time: '09:10', title: '선의 1차 확인 완료', color: '#fb923c', detail: `• 평소 질환 확인: ${chronic}\n• 알레르기: ${allergies}\n• 몸 상태 측정 및 계속 지켜보기 지시` })
  }
  if (chronic !== '없음') {
    timeline.push({ time: '08:30', title: '평소 질환 상태 점검', color: '#facc15', detail: `• ${chronic} 관련 정기적인 확인 시행\n• 드시는 약에 이상 반응이 있는지 확인` })
  }
  timeline.push({ time: '09:12', title: '건강 모니터링 시스템 연결', color: '#64748b', detail: `• 몸 상태 측정 장비 연결 완료\n• 알레르기(${allergies}) 약 사용 주의 표시` })
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
  questions.push('응급처치 가이드 기록해줘')
  questions.push('현재까지의 타임라인 정리해줘')

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
  isScanning, scanProgress, scanStatus, setScanStatus, scanError,
  scanResult, confirmTraumaAnalysis, setIsScanning, onLowConfidenceAlert,
  setBp, setBt, onSwitchPatient
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const scanOverlayRef = useRef(null)
  const chatEndRef = useRef(null)

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat])

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
  }, [activePatient?.id])

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
    if (editTarget === 'bp') {
      setBp(editValue)
      // 박기관 제외: 서버 DB에도 저장
      if (activePatient && activePatient.id !== 'S26-003') {
        const crewDbId = activePatient.crewDbId || parseInt(activePatient.id?.split('-')[1]);
        updateVital(crewDbId, { blood_pressure: editValue }).catch(() => {});
      }
    }
    if (editTarget === 'bt') {
      setBt(editValue)
      // 박기관 제외: 서버 DB에도 저장
      if (activePatient && activePatient.id !== 'S26-003') {
        const crewDbId = activePatient.crewDbId || parseInt(activePatient.id?.split('-')[1]);
        updateVital(crewDbId, { temperature: parseFloat(editValue) }).catch(() => {});
      }
    }
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
        detail: `• 주요증상: ${(Array.isArray(r.selectedSymptoms) ? r.selectedSymptoms : []).join(', ') || '관찰 중'}\n• 조치내용: ${(Array.isArray(r.prescribedMeds) ? r.prescribedMeds : []).join(', ') || '경과 관찰'}\n• 특이사항: ${r.otherActions || '없음'}`
      }))

      const baseTimeline = getPatientTimeline(activePatient)
      setDynamicTimeline([...baseTimeline])
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

  const isCapScanning = scanStatus === 'scanning'
  const isCapSuccess  = scanStatus === 'success'
  const isCapError    = scanStatus === 'error'
  const isCapRefer    = scanStatus === 'refer'

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: '100%', position: 'relative', background: '#020408', cursor: 'default' }}>

      {isScanning && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {cameraError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10002, gap: 20 }}>
              <AlertTriangle size={56} color="#ff4d6d" />
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', textAlign: 'center', maxWidth: 400, lineHeight: 1.6, padding: '20px 30px', background: 'rgba(255,77,109,0.15)', borderRadius: 16, border: '1.5px solid rgba(255,77,109,0.4)' }}>{cameraError}</div>
              <button onClick={() => { setCameraError(null); setIsScanning(false) }} style={{ padding: '14px 32px', borderRadius: 12, background: '#ff4d6d', color: '#fff', border: 'none', fontSize: 18, fontWeight: 900, cursor: 'pointer' }}>닫기</button>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0, 10, 20, 0.7) 100%)', pointerEvents: 'none' }} />
          
          {isCapScanning && (
            <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, zIndex: 10001 }}>
              <div style={{ background: 'rgba(0, 20, 30, 0.85)', padding: '20px 60px', borderRadius: '15px', color: '#fff', fontSize: 24, fontWeight: 900, border: '1.5px solid #00e5cc', boxShadow: '0 0 40px rgba(0, 229, 204, 0.4)', backdropFilter: 'blur(10px)' }}>진단 부위를 원형 프레임 내부에 맞춰주세요</div>
            </div>
          )}

          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '600px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderTop: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, borderLeft: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 60, height: 60, borderRight: '4px solid #00e5cc', borderBottom: '4px solid #00e5cc' }} />
              <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0, 229, 204, 0.3)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', width: '92%', height: '92%', border: '2px dashed rgba(0, 229, 204, 0.2)', borderRadius: '50%', animation: 'spin 10s infinite linear' }} />
              
              {isCapScanning && (
                <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '2px', background: 'linear-gradient(to right, transparent, #fff, #00e5cc, #fff, transparent)', boxShadow: '0 0 20px #00e5cc', animation: 'scanMoveInner 2.5s infinite ease-in-out', zIndex: 10005 }} />
              )}
              
              <div style={{ position: 'absolute', width: 40, height: 2, background: '#00e5cc' }} />
              <div style={{ position: 'absolute', width: 2, height: 40, background: '#00e5cc' }} />
            </div>

            {/* 결과 모달 (Success) */}
            {isCapSuccess && (
              <div style={{ position: 'absolute', width: 560, background: 'rgba(8,16,30,0.97)', borderRadius: 32, padding: '52px 48px', color: '#fff', textAlign: 'center', zIndex: 10002, border: '1px solid rgba(38,222,129,0.2)', backdropFilter: 'blur(40px)', animation: 'slideUp 0.4s ease' }}>

                {/* 외상명 */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 72, fontWeight: 950, color: '#fff', letterSpacing: '-3px', lineHeight: 1 }}>{scanResult?.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: '#26de81' }}>{scanResult?.labelEn}</span>
                </div>

                {/* 설명 */}
                <div style={{ fontSize: 22, color: '#475569', lineHeight: 1.7, marginBottom: 36 }}>
                  {({
                    '찰과상': '피부 표면이 긁혀 쓸린 상처입니다.',
                    '타박상': '충격으로 멍이 드는 상처입니다.',
                    '화상': '열이나 화학물질로 피부가 손상된 상처입니다.',
                    '절상': '날카로운 물체에 베인 상처입니다.',
                    '열상': '피부가 불규칙하게 찢어진 상처입니다.',
                    '자창': '뾰족한 물체에 찔린 상처입니다.',
                  })[scanResult?.label] || '외상 유형이 분류되었습니다.'}
                </div>

                {/* 신뢰도 */}
                <div style={{ fontSize: 64, fontWeight: 950, color: '#26de81', letterSpacing: '-3px', lineHeight: 1, marginBottom: 8 }}>
                  {scanResult?.confidence}<span style={{ fontSize: 28, fontWeight: 700, color: 'rgba(38,222,129,0.5)', marginLeft: 12 }}>%</span>
                </div>
                <div style={{ fontSize: 13, color: '#334155', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 36 }}>AI 분석 정확도</div>

                {/* 버튼 */}
                <button onClick={confirmTraumaAnalysis} style={{ width: '100%', padding: '22px', borderRadius: 16, border: 'none', background: '#26de81', color: '#001a10', fontWeight: 950, fontSize: 20, cursor: 'pointer' }}>
                  응급처치 Start
                </button>

                {/* 면책 */}
                <div style={{ marginTop: 20, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  본 결과는 AI 분석 참고용이며 의료 진단이 아닙니다.
                </div>
              </div>
            )}

            {/* 결과 모달 (Error) */}
            {isCapError && (
              <div style={{ position: 'absolute', width: 580, background: 'rgba(2, 15, 25, 0.98)', padding: '52px 56px', borderRadius: '40px', color: '#fff', textAlign: 'center', zIndex: 10002, border: '3px solid #ff4d6d', boxShadow: '0 0 80px rgba(255,77,109,0.4)', backdropFilter: 'blur(40px)', animation: 'slideUp 0.4s ease' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,77,109,0.15)', border: '2px solid #ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                  <AlertCircle size={52} color="#ff4d6d" />
                </div>
                <div style={{ fontSize: 36, fontWeight: 950, color: '#ff4d6d', marginBottom: 20 }}>다시 촬영해 주세요</div>
                <div style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.8, marginBottom: 44, fontWeight: 600 }}>화면이 흐리거나 빛이 강해 분석이 어렵습니다.<br/>밝은 곳에서 흔들림 없이 다시 촬영해 주세요.</div>
                <button onClick={handleTraumaAnalysis} style={{ width: '100%', padding: '26px', borderRadius: '20px', border: 'none', background: '#ff4d6d', color: '#fff', fontWeight: 950, fontSize: 24, cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,77,109,0.4)' }}>다시 촬영하기</button>
              </div>
            )}

            {/* 결과 모달 (Refer — 전문의 진료 권고) */}
            {isCapRefer && (
              <div style={{ position: 'absolute', width: 580, background: 'rgba(2, 15, 25, 0.98)', padding: '52px 56px', borderRadius: '40px', color: '#fff', textAlign: 'center', zIndex: 10002, border: '3px solid #facc15', boxShadow: '0 0 80px rgba(250,204,21,0.3)', backdropFilter: 'blur(40px)', animation: 'slideUp 0.4s ease' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(250,204,21,0.1)', border: '2px solid #facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                  <AlertTriangle size={52} color="#facc15" />
                </div>
                <div style={{ fontSize: 28, fontWeight: 950, color: '#facc15', marginBottom: 24, lineHeight: 1.4 }}>정확한 판단을 위해<br/>의료진 확인이 필요한 상태입니다.</div>
                <div style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.8, fontWeight: 600 }}>현재 상태는 AI 분석만으로는<br/>판단이 조심스러운 단계입니다.</div>
              </div>
            )}
          </div>

          {isCapScanning && (
            <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', width: 400, zIndex: 10001 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#00e5cc', fontSize: 18, fontWeight: 900 }}>
                <span>AI 이미지 분석 중...</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${scanProgress}%`, background: 'linear-gradient(90deg, #00e5cc, #38bdf8)', borderRadius: 5, transition: 'width 0.1s' }} />
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10010 }}>
            <button onClick={() => { setIsScanning(false); setScanStatus(null); }} style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '18px 60px', borderRadius: '100px', color: '#fff', fontSize: 18, fontWeight: 900, border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', backdropFilter: 'blur(15px)' }}>진단 모드 종료</button>
          </div>
        </div>
      )}

      <aside id="tuto-patient-info" style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
                  </div>
                ))}
              </div>
            )}
          </div>

          <div key={activePatient?.id} style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <ProfileImage avatar={activePatient?.avatar} name={activePatient?.name} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-0.5px', color: '#fff' }}>{activePatient?.name || '-'}</div>
                <div style={{ fontSize: 20, color: '#38bdf8', fontWeight: 800 }}>{activePatient?.role || '기관장'}</div>
              </div>
              <div style={{ fontSize: 16, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id || 'S2026-026'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 55}세 / ${activePatient?.gender || '남'}`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood || 'A+형'} size="xl_ultra" />
            <InfoItem label="신장" value={`${activePatient?.height || 178} cm`} size="xl_ultra" />
            <InfoItem label="몸무게" value={`${activePatient?.weight || 82} kg`} size="xl_ultra" />
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 120px 28px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><History size={20}/> 과거력</div>
            <div style={{ fontSize: 19, fontWeight: 750, color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              {(activePatient?.pastHistory || activePatient?.history || activePatient?.chronic || '기록 없음').split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#00d2ff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><RotateCcw size={20}/> 최근 진료 이력</div>
            <div 
              onClick={() => {
                // 이미 메인이므로 상세 기록 재현 상태임
              }}
              style={{ 
                cursor: activePatient?.recentHistory ? 'pointer' : 'default',
                background: 'rgba(0, 210, 255, 0.04)', 
                borderRadius: 16, 
                padding: '20px', 
                border: '1px solid rgba(0, 210, 255, 0.15)',
                transition: '0.2s',
              }}
              onMouseOver={e => { if(activePatient?.recentHistory) e.currentTarget.style.background = 'rgba(0, 210, 255, 0.1)' }}
              onMouseOut={e => { if(activePatient?.recentHistory) e.currentTarget.style.background = 'rgba(0, 210, 255, 0.04)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 850, color: '#00d2ff' }}>{activePatient?.recentHistory?.date || '기록 없음'}</span>
                <span style={{ fontSize: 15, color: '#4a6080', fontWeight: 700 }}>{activePatient?.recentHistory?.title || '-'}</span>
              </div>
              <div style={{ fontSize: 16, color: '#8da2c0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{activePatient?.recentHistory?.detail || '저장된 진료 기록이 없습니다.'}</div>
              {activePatient?.recentHistory && (
                <div style={{ marginTop: 12, textAlign: 'right', fontSize: 13, color: '#38bdf8', fontWeight: 800 }}>
                  상세 기록 재현 중...
                </div>
              )}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
            <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(activePatient?.allergies || '없음').split(',').map((a, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} /><span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span></div>))}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Pill size={20}/> 복용 중인 약물</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(() => {
                const meds = activePatient?.meds?.length > 0 ? activePatient.meds : (activePatient?.lastMed && activePatient.lastMed !== '없음' ? activePatient.lastMed.split(',').map(m => ({ name: m.trim(), purpose: '처방약' })) : []);
                return meds.length > 0 ? meds.map((drug, i) => (
                  <div key={i} style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 14, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 17, fontWeight: 850, color: '#fed7aa' }}>{drug.name}</span>
                      <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 800 }}>{drug.purpose}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: 16, fontWeight: 700 }}>복용 중인 약물 없음</div>
                );
              })()}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#26de81', fontSize: 18, fontWeight: 800, marginBottom: 14 }}><Phone size={20}/> 비상 연락망</div>
            <div style={{ background: 'rgba(38,222,129,0.06)', border: '1px solid rgba(38,222,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><span style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{emergency.name}</span><span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{emergency.relation}</span></div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>{emergency.phone}</div>
            </div>
          </div>
        </div>
        <div id="tuto-emergency-btn" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={() => startEmergencyAction('CPR')} style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}><AlertTriangle size={28} /> 응급 처치 액션 시작</button>
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div id="tuto-vitals" style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 1.4fr 1.4fr', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff4d6d" live valueSize={38} />
            <div onClick={toggleSpo2Status} style={{ cursor: 'pointer' }}><DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live isConnected={spo2Status === 'normal'} valueSize={38} /></div>
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#8b5cf6" live valueSize={38} />
            <DashboardVital label="혈압(입력)" value={bp} unit="mmHg" color="#eab308" editable onEdit={() => openEdit('bp', bp)} valueSize={40} />
            <DashboardVital label="체온(입력)" value={bt} unit="°C" color="#f97316" editable onEdit={() => openEdit('bt', bt)} valueSize={40} />
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
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}><div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0' }}><Sparkles size={20} color="#38bdf8" /> MDTS 응급 처치 가이드 어시스턴트</div><div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', overflow: 'hidden' }}><div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 229, 204, 0.2), #00e5cc, rgba(0, 229, 204, 0.2), transparent)', boxShadow: '0 0 12px #00e5cc', animation: 'flowingLight 5s infinite linear' }} /></div></div>
          <div id="tuto-ai-chat" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 120px 20px', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.role === 'ai' ? <Sparkles size={14} color="#000" /> : <User size={14} color="#fff" />}</div>
                <div style={{ flex: 1, maxWidth: '92%' }}><div style={{ padding: '16px 22px', borderRadius: m.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px', background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.03)', border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: '#e2e8f0' }}><AiMessageRenderer text={m.text} /></div></div>
              </div>
            ))}
            <div ref={chatEndRef} style={{ height: 40, flexShrink: 0 }} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 24px 20px 24px', background: 'linear-gradient(to top, #05070a 80%, transparent)', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
            {/* 예시 질문 칩 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', maxWidth: '100%' }}>
              {getExampleQuestions(activePatient).slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => setPrompt(q)}
                  style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 15, fontWeight: 700,
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
            <div style={{ width: '100%', background: '#0a0f1e', borderRadius: '20px', padding: '6px 6px 6px 24px', display: 'flex', alignItems: 'center', gap: 15, border: '1px solid rgba(56,189,248,0.25)', height: 80, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
              <input placeholder="응급처치 가이드를 질문하거나 상황 대응 타임라인을 작성해보세요" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 20, fontWeight: 500 }} />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 40px', height: 'calc(100% - 4px)', borderRadius: '16px', border: 'none', background: '#38bdf8', color: '#000', fontWeight: 950, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#7dd3fc'} onMouseOut={e => e.currentTarget.style.background = '#38bdf8'}>입력 <ArrowUp size={24} strokeWidth={3} /></button>
            </div>
          </div>
        </div>
      </section>

      <aside id="tuto-timeline" style={{ width: 480, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flexShrink: 0, padding: '24px 28px 16px 28px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={22}/> 상황 대응 타임라인</div></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 120px 28px', scrollbarWidth: 'none' }}><div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}><div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #facc15, #38bdf8)' }} />{dynamicTimeline.map((item, idx) => (<div key={idx} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 40 }}><div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#05070a', border: `3px solid ${item.color}`, zIndex: 2 }} /><div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.time}</div><div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{item.title}</div>{item.detail && <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 8, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.detail}</div>}</div>))}</div></div>
        <div style={{ position: 'absolute', bottom: 128, right: 28, display: 'flex', flexDirection: 'column', gap: 14, zIndex: 11 }}>
          <button onClick={() => startEmergencyAction('CPR')} title="심폐소생술" style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 18, fontWeight: 800, lineHeight: 1 }}><HeartPulse size={32} /><span>CPR</span></button>
          <button onClick={() => startEmergencyAction('Heimlich')} title="하임리히법" style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 18, fontWeight: 800, lineHeight: 1 }}><Wind size={32} /><span>하임리히</span></button>
        </div>
        <div id="tuto-trauma-btn" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(56,189,248,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}><button onClick={handleTraumaAnalysis} style={{ width: '100%', height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)' }}><Camera size={28} /> 외상 촬영 및 AI 분석</button></div>
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

function ProfileImage({ avatar }) {
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
  const confMatch = text.match(/\[ACCURACY: (.*?)\]/);
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
                <span style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18}/> AI 분석 정확도</span>
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
