import { useState, useEffect, useRef } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload, Camera, Edit3 } from 'lucide-react'
import { CardiacIllustration, TraumaIllustration, UnconsciousIllustration, RespiratoryIllustration } from '../components/EmergencyIllustrations'

const ACTION_GUIDES = {
  '심폐소생술': {
    title: '심폐소생술 및 AED 사용',
    protocol: 'SOP-CPR-01',
    hasMetronome: true,
    image: '/assets/CPR1.jpeg',
    steps: [
      { title: '의식 및 호흡 동시 확인', desc: '어깨를 두드리며 말을 걸고 가슴의 움직임(호흡)을 관찰하십시오.', tip: '의식과 호흡이 모두 없을 때만 시행합니다.', stepImage: '/assets/CPR1.jpeg' },
      { title: '도움 및 AED 요청', desc: '주변 사람을 지목하여 신고를 부탁하고 AED를 가져오게 하십시오.', stepImage: '/assets/CPR2.jpeg' },
      { title: '가슴 압박 시행', desc: '가슴 중앙을 5cm 깊이로 강하고 빠르게 압박하십시오.', tip: '팔꿈치를 펴고 체중을 실어 수직으로 압박', stepImage: '/assets/CPR3.jpeg' },
      { title: 'AED 전원 켜기', desc: '도착한 AED의 전원을 켜고 기계의 음성 지시에 따르십시오.', stepImage: '/assets/CPR4.jpeg' }
    ],
    dos: ['의식과 가슴 움직임을 10초간 확인하세요', '1초당 2번 속도로 강하게 압박하세요'],
    donts: ['맥박을 잡으려고 시간을 허비하지 마세요', '의식이 있는 환자에게 압박을 하지 마세요'],
    warning: '환자가 눈을 뜨거나 움직일 때까지 절대 멈추지 마십시오.',
    color: '#ef4444'
  },
  '지혈/압박': {
    title: '출혈 부위 직접 압박',
    protocol: 'SOP-BLD-02',
    steps: [
      { title: '상처 부위 확인', desc: '정확한 출혈 지점을 확인하기 위해 옷을 걷어내십시오.', stepImage: '/assets/Trauma1.jpeg' },
      { title: '직접 압박', desc: '멸균 거즈나 깨끗한 천으로 출혈 부위를 손바닥 전체로 누르십시오.', stepImage: '/assets/Trauma2.jpeg' },
      { title: '지혈대 적용', desc: '대량 출혈이 멈추지 않을 때만 상단 5cm 지점에 지혈대를 조이십시오.', stepImage: '/assets/Trauma3.jpeg' }
    ],
    dos: ['심장보다 높은 위치로 환부를 올리세요', '압박 붕대를 감은 뒤에도 계속 관찰하세요'],
    donts: ['상처에 박힌 칼이나 유리 조각을 뽑지 마세요', '상처에 가루약이나 된장 등을 바르지 마세요'],
    warning: '지혈대 사용 시 반드시 착용 시간을 환자 몸에 기록하십시오.',
    color: '#ff3b5c'
  },
  '기도 확보': {
    title: '기도 유지 및 호흡 보조',
    protocol: 'SOP-AIR-03',
    steps: [
      { title: '기도 개방', desc: '머리를 뒤로 젖히고 턱을 들어 올려 기도를 확보하십시오.', stepImage: '/assets/Unconscious1.jpeg' },
      { title: '이물질 제거', desc: '입안에 이물질이 있다면 즉시 제거하십시오.', stepImage: '/assets/Unconscious2.jpeg' },
      { title: '산소 공급', desc: '산소 마스크를 밀착시키고 유량을 15L로 조절하십시오.', stepImage: '/assets/Unconscious3.jpeg' }
    ],
    dos: ['환자를 옆으로 눕히는 회복 자세를 취하세요', '구토 시 즉시 몸을 옆으로 돌리세요'],
    donts: ['경추 손상이 의심되면 머리를 과하게 젖히지 마세요', '의식이 없는 환자에게 물을 먹이지 마세요'],
    warning: '호흡음이 거칠거나 청색증이 보이면 즉시 심폐소생술을 준비하십시오.',
    color: '#00d4aa'
  },
  '골절 / 탈구': {
    title: '골절 부위 고정 및 보호',
    protocol: 'SOP-FRC-04',
    steps: [
      { title: '안정화', desc: '환자가 통증을 가장 적게 느끼는 자세로 유지시키십시오.', stepImage: '/assets/Fracture1.jpeg' },
      { title: '부목 적용', desc: '나무판자나 종이박스를 이용해 관절 위아래를 고정하십시오.', stepImage: '/assets/Fracture2.jpeg' },
      { title: '순환 체크', desc: '고정 후 손발 끝을 눌러 혈액이 잘 통하는지 확인하십시오.', stepImage: '/assets/Fracture3.jpeg' }
    ],
    dos: ['빈 공간에 옷이나 수건을 채워 흔들림을 방지하세요', '개방된 상처가 있다면 먼저 덮으세요'],
    donts: ['부러진 뼈를 억지로 맞추려 하지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
    warning: '신경 손상을 방지하기 위해 과도한 움직임은 엄금합니다.',
    color: '#38bdf8'
  },
  '익수 / 저체온': {
    title: '익수자 구조 및 체온 관리',
    protocol: 'SOP-HYP-05',
    steps: [
      { title: '젖은 의복 제거', desc: '따뜻한 곳으로 옮기고 젖은 옷을 가위로 잘라 제거하십시오.', stepImage: '/assets/Hypothermia1.jpeg' },
      { title: '점진적 가온', desc: '담요로 전신을 감싸고 겨드랑이, 사타구니에 온팩을 대십시오.', stepImage: '/assets/Hypothermia2.jpeg' },
      { title: '건조 및 단열', desc: '몸을 마른 수건으로 닦고 차가운 바닥으로부터 단열시키십시오.', stepImage: '/assets/Hypothermia3.jpeg' }
    ],
    dos: ['의식이 있다면 따뜻하고 달콤한 음료를 주십시오', '실내 온도를 25도 이상으로 유지하세요'],
    donts: ['팔다리를 심하게 주무르지 마세요 (심장에 무리)', '뜨거운 물에 환자를 직접 담그지 마세요'],
    warning: '심한 저체온증 환자는 아주 약한 충격에도 심정지가 올 수 있으니 조심히 다루십시오.',
    color: '#a78bfa'
  },
  '상처 세척': {
    title: '환부 세척 및 감염 방지',
    protocol: 'SOP-WND-06',
    steps: [
      { title: '식염수 세척', desc: '멸균 식염수나 흐르는 물로 이물질을 충분히 씻어내십시오.', stepImage: '/assets/Wound1.jpeg' },
      { title: '거즈 드레싱', desc: '연고 없이 멸균 거즈로 덮고 반창고로 고정하십시오.', stepImage: '/assets/Wound2.jpeg' }
    ],
    dos: ['처치 전 반드시 위생 장갑을 착용하세요', '상처 주변 피부 위주로 소독하세요'],
    donts: ['얼음을 환부에 직접 대지 마세요 (동상 위험)', '물집을 억지로 터뜨리지 마세요'],
    warning: '깊은 자상은 내부 세척을 하지 말고 겉면만 보호하십시오.',
    color: '#2dd4bf'
  }
}

export default function Emergency({ patient, initialAction }) {
  const [triageStep, setTriageStep] = useState('CHECK') 
  const [activeAction, setActiveAction] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [sessionLogs, setSessionLogs] = useState([])
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null)

  // 초기 액션 매핑 및 설정
  useEffect(() => {
    if (initialAction) {
      const mapping = {
        'CARDIAC': '심폐소생술',
        'TRAUMA': '지혈/압박',
        'UNCONSCIOUS': '기도 확보',
        'RESPIRATORY': '기도 확보' // 호흡곤란도 일단 기도확보로 매핑하거나 적절한 항목 선택
      }
      const targetAction = mapping[initialAction] || initialAction
      if (ACTION_GUIDES[targetAction]) {
        setActiveAction(targetAction)
        setTriageStep('GUIDE')
        const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
        setSessionLogs([{ time: now, text: `외부 시스템으로부터 [${targetAction}] 프로토콜 수신`, type: 'INFO' }])
      }
    }
  }, [initialAction])

  const [showPhotoAlert, setShowPhotoAlert] = useState(false)
  const [bpm, setBpm] = useState(110)
  const [beat, setBeat] = useState(false)

  const [vitals, setVitals] = useState({ hr: 96, spo2: 94, bp: '158/95', temp: 37.6, rr: 24 })
  const [editingVital, setEditingVital] = useState(null)

  const updateVital = (key, value) => {
    if (!value) { setEditingVital(null); return; }
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    const labels = { bp: '혈압', temp: '체온' }
    const units = { bp: 'mmHg', temp: '°C' }
    setVitals({ ...vitals, [key]: value })
    setSessionLogs([{ time: now, text: `🔹 ${labels[key]} 측정값 수동 기록: ${value}${units[key]}`, type: 'INFO' }, ...sessionLogs])
    setEditingVital(null)
  }

  useEffect(() => {
    if (activeAction === '심폐소생술') {
      const interval = setInterval(() => setBeat(b => !b), 60000 / bpm / 2)
      return () => clearInterval(interval)
    }
  }, [activeAction, bpm])

  const handleStepToggle = (index) => {
    const isDone = completedSteps.includes(index)
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    const stepTitle = ACTION_GUIDES[activeAction].steps[index].title

    if (!isDone) {
      if (sessionLogs.length === 0) {
        setSessionLogs([
          { time: now, text: "⚠️ 의료인 부재 상황 - 자율 처치 프로토콜 개시", type: 'ALERT' },
          { time: now, text: `${stepTitle} 완료`, type: 'SUCCESS' }
        ])
      } else {
        setSessionLogs([{ time: now, text: `${stepTitle} 완료`, type: 'SUCCESS' }, ...sessionLogs])
      }
      setCompletedSteps([...completedSteps, index])
      setShowPhotoAlert(true)
    }
  }

  const handleTriageSelect = (actionKey) => {
    setActiveAction(actionKey)
    setTriageStep('GUIDE')
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    setSessionLogs([{ time: now, text: `의식 수준 판별에 따른 [${actionKey}] 자동 매칭`, type: 'INFO' }])
  }

  const triageData = [
    { label: '눈을 뜨고 말을 하나요?', desc: '정상 의식 (Alert)', action: '상처 세척', color: '#2dd4bf' },
    { label: '부르면 대답을 하나요?', desc: '언어 반응 (Verbal)', action: '골절 / 탈구', color: '#38bdf8' },
    { label: '꼬집을 때만 반응하나요?', desc: '통증 반응 (Pain)', action: '기도 확보', color: '#00d4aa' },
    { label: '전혀 반응이 없나요?', desc: '무반응 (Unresponsive)', action: '심폐소생술', color: '#ef4444' },
  ]

  if (triageStep === 'CHECK') {
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ fontSize: 16, color: '#ef4444', fontWeight: 950, letterSpacing: 4, marginBottom: 16 }}>CRITICAL SITUATION DECLARED</div>
        <h1 style={{ fontSize: 48, fontWeight: 950, color: '#fff', marginBottom: 60, textAlign: 'center' }}>환자의 현재 의식 수준을 판별하십시오</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1000, width: '100%' }}>
          {triageData.map((t, i) => (
            <button key={i} onClick={() => handleTriageSelect(t.action)} style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: 40, textAlign: 'center', cursor: 'pointer', transition: '0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }} className="triage-btn">
              <div style={{ fontSize: 24, fontWeight: 950, color: '#fff', marginBottom: 8 }}>{t.label}</div>
              <div style={{ fontSize: 18, color: t.color, fontWeight: 800 }}>• {t.desc}</div>
            </button>
          ))}
        </div>
        <style>{`.triage-btn:hover { transform: translateY(-5px); border-color: #ef4444; background: rgba(239,68,68,0.05) !important; }`}</style>
      </div>
    )
  }

  // 선택된 대응 항목의 데이터
  const currentActionData = activeAction ? ACTION_GUIDES[activeAction] : null
  
  // 현재 진행해야 할 단계(미완료된 첫 번째 단계)
  const nextStepIndex = currentActionData?.steps.findIndex((_, i) => !completedSteps.includes(i))
  
  // 표시할 단계 결정 (호버 중인 단계가 있으면 우선, 없으면 진행 예정 단계)
  const activeDisplayIndex = hoveredStepIndex !== null ? hoveredStepIndex : (nextStepIndex !== -1 ? nextStepIndex : currentActionData?.steps.length - 1)
  const stepNum = activeDisplayIndex + 1

  // 이미지 파일이 있는지 확인
  const stepImage = (currentActionData && activeDisplayIndex !== -1 && currentActionData.steps[activeDisplayIndex]?.stepImage) 
    ? currentActionData.steps[activeDisplayIndex].stepImage 
    : currentActionData?.image

  // 일러스트 렌더러
  const renderIllustration = () => {
    if (activeAction === '심폐소생술') return <CardiacIllustration step={stepNum} />
    if (activeAction === '지혈/압박' || activeAction === '골절 / 탈구') return <TraumaIllustration step={stepNum} />
    if (activeAction === '기도 확보') return <UnconsciousIllustration step={stepNum} />
    return <RespiratoryIllustration step={stepNum} />
  }

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020617 98%)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '480px 1fr 440px', gridTemplateRows: '1fr 120px', gap: '30px', padding: '24px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* [1열 - LEFT] 시각적 처치 가이드 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeAction ? (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 900, letterSpacing: 1.5, marginBottom: 4 }}>VISUAL REFERENCE</div>
                    <div style={{ fontSize: 18, fontWeight: 950 }}>처치 동작 시각 가이드</div>
                  </div>
                  
                  {activeAction === '심폐소생술' ? (
                    <div style={{ 
                      background: 'rgba(239,68,68,0.15)', 
                      borderRadius: 16, 
                      padding: '8px 16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      border: `1px solid ${beat ? '#ef4444' : 'rgba(239,68,68,0.3)'}`, 
                      transition: '0.1s' 
                    }}>
                      <Heart size={18} fill={beat ? '#ef4444' : 'none'} color="#ef4444" style={{ animation: beat ? 'pulse 0.2s' : 'none' }} />
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#ef4444', whiteSpace: 'nowrap' }}>110 BPM 박자 가이드</div>
                    </div>
                  ) : hoveredStepIndex !== null && (
                    <div style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>미리보기 중</div>
                  )}
                </div>
              </div>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stepImage ? (
                  <img 
                    key={stepImage} 
                    src={stepImage} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                    alt="처치 가이드"
                  />
                ) : (
                  <div style={{ width: '80%', height: '80%' }}>
                    {renderIllustration()}
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 24px', background: 'linear-gradient(to top, rgba(2,6,23,0.9), transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0dd9c5' }}>
                    <Info size={18} />
                    <span style={{ fontSize: 15, fontWeight: 800 }}>
                      {activeDisplayIndex !== -1 && currentActionData.steps[activeDisplayIndex]
                        ? `${hoveredStepIndex !== null ? '[확인 중]' : '현재 단계'} : ${currentActionData.steps[activeDisplayIndex].title}`
                        : '모든 처치 단계를 완료하였습니다.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: 32, border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Camera size={32} color="#475569" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#475569' }}>대응 항목을 선택하면<br/>시각 가이드가 표시됩니다.</div>
            </div>
          )}
        </section>

        {/* [2열 - CENTER] 메인 가이드 영역 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
          {activeAction ? (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', padding: 32, position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 14, color: '#38bdf8', fontWeight: 900, letterSpacing: 2 }}>SOP AUTONOMOUS GUIDANCE</div>
                  <h2 style={{ fontSize: 36, fontWeight: 950, margin: '4px 0' }}>{ACTION_GUIDES[activeAction].title}</h2>
                </div>
                <button onClick={() => {setActiveAction(null); setCompletedSteps([])}} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', padding: 12, borderRadius: '50%' }}><X/></button>
              </div>

              {activeAction === '심폐소생술' && (
                <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 20, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, border: `2px solid ${beat ? '#ef4444' : 'transparent'}`, transition: '0.1s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: beat ? '#ef4444' : 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={24} fill={beat ? '#fff' : 'none'} color="#fff" /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#ef4444' }}>압박 박자 가이드 (110 BPM)</div>
                    <div style={{ fontSize: 20, fontWeight: 950 }}>심장 아이콘이 깜빡일 때 가슴을 누르세요</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', marginBottom: 12, fontSize: 14, fontWeight: 900 }}><CheckCircle2 size={16}/> 권고 사항 (DO)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{ACTION_GUIDES[activeAction].dos.map((d, i) => <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>• {d}</div>)}</div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 20, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginBottom: 12, fontSize: 14, fontWeight: 900 }}><AlertTriangle size={16}/> 절대 금기 (위험)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{ACTION_GUIDES[activeAction].donts.map((d, i) => <div key={i} style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>• {d}</div>)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ACTION_GUIDES[activeAction].steps.map((step, i) => {
                  const isFirstPending = i === 0 && !completedSteps.includes(i);
                  const isHovered = hoveredStepIndex === i;
                  const isCompleted = completedSteps.includes(i);
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleStepToggle(i)} 
                      onMouseEnter={() => setHoveredStepIndex(i)}
                      onMouseLeave={() => setHoveredStepIndex(null)}
                      style={{ 
                        display: 'flex', gap: 20, padding: 24, borderRadius: 24, cursor: 'pointer', 
                        background: isCompleted ? 'rgba(56,189,248,0.1)' : isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', 
                        border: `2px solid ${isCompleted ? '#38bdf8' : (isFirstPending || isHovered) ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`, 
                        transition: '0.2s', position: 'relative',
                        animation: (isFirstPending && !isHovered) ? 'step-guide-pulse 2s infinite' : 'none',
                        boxShadow: (isFirstPending || isHovered) ? '0 0 20px rgba(56,189,248,0.2)' : 'none',
                        transform: isHovered ? 'translateX(5px)' : 'none'
                      }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: isCompleted ? '#38bdf8' : (isFirstPending || isHovered) ? '#38bdf8' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 950, color: (isCompleted || isFirstPending || isHovered) ? '#000' : '#fff', fontSize: 18 }}>
                        {isCompleted ? <CheckCircle2 size={20}/> : i+1}
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 950, marginBottom: 6, color: (isCompleted || isFirstPending || isHovered) ? '#fff' : '#94a3b8' }}>{step.title}</div>
                        <div style={{ fontSize: 16, color: (isCompleted || isHovered) ? '#fff' : '#64748b', fontWeight: 600, lineHeight: 1.5 }}>{step.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {showPhotoAlert && (
                <div style={{ marginTop: 'auto', padding: '24px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 20, animation: 'pulse 2s infinite' }}>
                  <Camera size={36} color="#fff"/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 950 }}>환부 사진 촬영 필수</div>
                    <div style={{ fontSize: 15, opacity: 0.9, fontWeight: 800 }}>법적 보호를 위해 처치 후 상태를 반드시 남기십시오.</div>
                  </div>
                  <button style={{ background: '#fff', color: '#b91c1c', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 950, cursor: 'pointer', fontSize: 16 }}>사진 촬영</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}><AlertTriangle size={70} color="#ef4444"/></div>
              <h2 style={{ fontSize: 42, fontWeight: 950, marginBottom: 16 }}>비의료인 자율 대응 모드 활성</h2>
              <p style={{ fontSize: 19, color: '#94a3b8', maxWidth: 600, fontWeight: 700, lineHeight: 1.6 }}>원격 의료진 지원이 불가능한 구역입니다.<br/>의식 수준 판별을 통해 가이드를 활성화하십시오.</p>
            </div>
          )}
        </section>

        {/* [3열 - RIGHT] 바이탈 및 기록 영역 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          {/* 환자 정보 및 바이탈 */}
          <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 28 }}>
             <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden' }}><img src={patient?.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 950 }}>{patient?.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>ID: {patient?.id} | 혈액형: {patient?.blood}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <VitalMini label="심박수" value={vitals.hr} unit="BPM" color="#ef4444" icon={<HeartPulse size={12}/>} status="주의" />
              <VitalMini label="산소" value={vitals.spo2} unit="%" color="#38bdf8" icon={<Wind size={12}/>} status="위험" />
              <div style={{ position: 'relative' }}>
                <VitalMini label="혈압" value={vitals.bp} unit="mmHg" color="#c084fc" icon={<Activity size={12}/>} onClick={() => setEditingVital('bp')} isManual />
                {editingVital === 'bp' && (
                  <div style={{ position: 'absolute', inset: 0, background: '#1e293b', borderRadius: 16, padding: 12, display: 'flex', gap: 8, zIndex: 10 }}>
                    <input autoFocus placeholder="120/80" onBlur={e => updateVital('bp', e.target.value)} onKeyDown={e => e.key === 'Enter' && updateVital('bp', e.target.value)} style={{ width: '100%', background: 'transparent', border: '1px solid #38bdf8', color: '#fff', outline: 'none', padding: '0 8px', borderRadius: 8, fontSize: 14 }} />
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <VitalMini label="체온" value={vitals.temp} unit="°C" color="#fb923c" icon={<Thermometer size={12}/>} onClick={() => setEditingVital('temp')} isManual />
                {editingVital === 'temp' && (
                  <div style={{ position: 'absolute', inset: 0, background: '#1e293b', borderRadius: 16, padding: 12, display: 'flex', gap: 8, zIndex: 10 }}>
                    <input autoFocus placeholder="36.5" type="number" step="0.1" onBlur={e => updateVital('temp', e.target.value)} onKeyDown={e => e.key === 'Enter' && updateVital('temp', e.target.value)} style={{ width: '100%', background: 'transparent', border: '1px solid #38bdf8', color: '#fff', outline: 'none', padding: '0 8px', borderRadius: 8, fontSize: 14 }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LEGAL DEFENSE MODE (슬림화) */}
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={18} color="#ef4444" />
            <div style={{ fontSize: 13, fontWeight: 900, color: '#ef4444', letterSpacing: 0.5 }}>LEGAL DEFENSE MODE : 자동 기록 중</div>
          </div>

          {/* 사고 대응 타임라인 */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 28, padding: 24, display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: '#00d4aa' }}><FileText size={20}/><span style={{ fontWeight: 900 }}>사고 대응 타임라인 (자동 기록)</span></div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }} className="timeline-scroll">
              {sessionLogs.length > 0 ? sessionLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 12, color: log.type === 'ALERT' ? '#ef4444' : '#64748b', fontWeight: 800, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>[{log.time}]</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: log.type === 'ALERT' ? '#fda4af' : '#e2e8f0', lineHeight: 1.4 }}>{log.text}</div>
                </div>
              )) : <div style={{ color: '#475569', textAlign: 'center', marginTop: 40, fontSize: 14 }}>처치 동작 수행 시 즉시 기록됩니다</div>}
            </div>
          </div>
        </aside>

        {/* [BOTTOM] 우선순위 버튼 바 */}
        <section style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, paddingTop: 10 }}>
          {Object.keys(ACTION_GUIDES).map(key => (
            <button key={key} onClick={() => {setActiveAction(key); setCompletedSteps([])}} style={{ 
              background: activeAction === key ? `linear-gradient(135deg, ${ACTION_GUIDES[key].color}, ${ACTION_GUIDES[key].color}dd)` : 'rgba(255,255,255,0.05)', 
              border: '2px solid',
              borderColor: activeAction === key ? 'transparent' : 'rgba(255,255,255,0.1)',
              borderRadius: 24, 
              height: '104px', // 고정 높이
              padding: '0 12px',
              cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              width: '100%', minWidth: 0, boxSizing: 'border-box', overflow: 'hidden'
            }} className="action-btn">
              <div style={{ color: activeAction === key ? '#000' : ACTION_GUIDES[key].color, flexShrink: 0 }}>
                <ActionButtonIcon label={key} size={30} />
              </div>
              <div style={{ textAlign: 'center', minWidth: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 950, color: activeAction === key ? '#000' : '#fff', letterSpacing: '-1.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>{key}</div>
              </div>
            </button>
          ))}
        </section>
      </div>

      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes step-guide-pulse {
          0% { box-shadow: 0 0 0px rgba(56,189,248,0); transform: scale(1); }
          50% { box-shadow: 0 0 25px rgba(56,189,248,0.4); transform: scale(1.01); }
          100% { box-shadow: 0 0 0px rgba(56,189,248,0); transform: scale(1); }
        }
        .action-btn:hover { transform: translateY(-5px); filter: brightness(1.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}

function VitalMini({ label, value, unit, color, icon, onClick, isManual, status }) {
  return (
    <div onClick={onClick} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)', cursor: isManual ? 'pointer' : 'default', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color, opacity: 0.9 }}>{icon}</span>
        <div style={{ fontSize: 17, color: '#94a3b8', fontWeight: 900, letterSpacing: '-0.3px' }}>{label}</div>
        {status && <div style={{ marginLeft: 'auto', background: `${color}15`, color, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 950, border: `1px solid ${color}30` }}>{status}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 950, color }}>{value}</span>
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 800 }}>{unit}</span>
      </div>
    </div>
  )
}

function ActionButtonIcon({ label, size = 24 }) {
  if (label === '심폐소생술') return <Heart size={size} />
  if (label === '지혈/압박') return <Zap size={size} />
  if (label === '기도 확보') return <Wind size={size} />
  if (label === '골절 / 탈구') return <Shield size={size} />
  if (label === '익수 / 저체온') return <Droplets size={size} />
  if (label === '상처 세척') return <Scissors size={size} />
  return <Info size={size} />
}
