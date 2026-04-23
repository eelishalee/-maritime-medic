import { useState, useEffect } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload, Camera, Edit3, Bone, Flame, RefreshCw, Send, Check, LayoutDashboard, AlertOctagon, ShieldCheck, Database } from 'lucide-react'
import { CardiacIllustration, TraumaIllustration, UnconsciousIllustration, RespiratoryIllustration } from '../components/EmergencyIllustrations'
import CameraModal from '../components/CameraModal'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  panel2: 'rgba(15, 15, 35, 0.99)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  dim: '#1a1a3a',
  success: '#00ffaa',
  warning: '#ffaa00',
  danger: '#ff0055',
  info: '#00d4ff',
  purple: '#bc00ff',
  cyan: '#00f7ff',
}

const ACTION_GUIDES = {
  '심폐소생술': {
    title: '심폐소생술 및 AED 사용',
    diagnosis: '심정지(Cardiac Arrest) 의심',
    riskLevel: '4',
    protocol: 'SOP-CPR-01',
    hasMetronome: true,
    steps: [
      { title: '의식 및 호흡 확인', desc: '어깨를 두드리며 "괜찮으세요?"라고 묻고, 가슴이 오르내리는지 10초간 확인하십시오.', tip: '숨을 안 쉬면 즉시 시작합니다.', stepImage: '/assets/CPR1.jpeg' },
      { title: '도움 및 AED 요청', desc: '주변 사람 중 한 명을 지목해 "비상 상황 전파" 및 "AED(심장충격기)"를 가져와 달라고 지시하십시오.', stepImage: '/assets/CPR2.jpeg' },
      { title: '가슴 압박 시행', desc: '가슴 중앙에 깍지 낀 손을 대고, 팔꿈치를 펴서 수직으로 5~6cm 깊이로 강하게 누르십시오.', tip: '분당 100~120회 속도를 유지하세요.', stepImage: '/assets/CPR3.jpeg' },
      { title: 'AED 패드 부착', desc: '전원을 켜고 패드 하나는 오른쪽 쇄골 아래, 다른 하나는 왼쪽 옆구리에 붙인 뒤 음성 지시에 따르십시오.', tip: '분석 중에는 환자에게서 떨어지십시오.', stepImage: '/assets/CPR4.jpeg' }
    ],
    dos: ['1초당 2번 속도로 강하게 압박하세요', '압박 후 가슴이 완전히 올라오게 하세요', 'AED의 음성 지시에 따라 행동하십시오'],
    donts: ['환자가 의식이 있다면 하지 마세요', '맥박 확인을 위해 시간을 허비하지 마세요', '압박 중 팔꿈치를 굽히지 마세요'],
    warning: '환자가 스스로 숨을 쉬거나 의료진이 올 때까지 중단하지 마십시오.',
    color: C.danger
  },
  '하임리히법': {
    title: '기도 이물질 제거 (하임리히법)',
    diagnosis: '기도 폐쇄(Airway Obstruction)',
    riskLevel: '4',
    protocol: 'SOP-HEI-07',
    steps: [
      { title: '의식 및 상태 확인', desc: '환자 뒤로 가서 말을 걸어보세요. 목을 감싸고 말을 전혀 못 하면 즉시 처치를 시작합니다.', tip: '환자가 기침을 할 수 있다면 계속하게 하세요.', stepImage: 'assets/Heimlich1.jpeg' },
      { title: '자세 잡고 지탱하기', desc: '환자 뒤에 서서 양팔로 허리를 감싸고, 내 한쪽 다리를 환자 다리 사이에 넣어 환자가 쓰러질 때를 대비해 지탱하세요.', stepImage: 'assets/Heimlich2.jpeg' },
      { title: '손 모양과 위치 잡기', desc: '한쪽 주먹의 엄지손가락 쪽 면을 배꼽과 명치 사이에 대고, 다른 손으로 그 주먹을 꽉 움켜쥐십시오.', stepImage: 'assets/Heimlich3.jpeg' },
      { title: '강하게 밀어 올리기', desc: '환자의 배를 안쪽 위 방향(J자 모양)으로 강하게 들어 올리듯 반복해서 당기십시오.', tip: '이물질이 나오거나 환자가 의식을 잃을 때까지 반복하세요.', stepImage: 'assets/Heimlich4.jpeg' }
    ],
    dos: ['이물질이 튀어나올 때까지 최대한 강하게 하세요', '환자가 의식을 잃으면 즉시 바닥에 눕히고 심폐소생술을 시작하세요'],
    donts: ['입안에 이물질이 보이지 않는데 손가락을 넣어 쑤시지 마세요', '임산부는 복부가 아닌 가슴 부위를 압박하세요'],
    warning: '환자가 의식을 잃으면 즉시 기도를 확보하고 심폐소생술(CPR)로 전환하십시오.',
    color: C.danger
  },
  '기도 확보': {
    title: '기도 유지 및 호흡 보조',
    diagnosis: '호흡 곤란 및 기도 폐쇄 위험',
    riskLevel: '3',
    protocol: 'SOP-AIR-03',
    steps: [
      { title: '머리 기울이기-턱 올리기', desc: '한 손을 이마에 대고 머리를 뒤로 젖히며, 다른 손가락으로 턱뼈를 들어 올려 기도를 확보하십시오.', stepImage: 'assets/Unconscious1.jpeg' },
      { title: '입안 이물질 제거', desc: '눈에 보이는 구토물이나 이물질이 있다면 머리를 옆으로 돌려 손가락으로 가볍게 제거하십시오.', stepImage: 'assets/Unconscious2.jpeg' },
      { title: '산소 마스크 공급', desc: '산소 마스크를 코와 입에 완전히 밀착시키고, 유량을 15L/min 이상으로 높게 설정하십시오.', stepImage: 'assets/Unconscious3.jpeg' }
    ],
    dos: ['환자가 자가 호흡 중이면 옆으로 눕히세요', '구토 시 즉시 몸 전체를 옆으로 돌리세요'],
    donts: ['의식이 없는 환자에게 물을 먹이지 마세요', '머리 밑에 베개를 넣어 기도를 꺾지 마세요'],
    warning: '호흡음이 거칠거나 청색증이 보이면 즉시 심폐소생술을 준비하십시오.',
    color: C.danger
  },
  '지혈/압박': {
    title: '출혈 부위 직접 압박',
    diagnosis: '외상성 대량 출혈(Hemorrhage)',
    riskLevel: '3',
    protocol: 'SOP-BLD-02',
    steps: [
      { title: '상처 노출 및 확인', desc: '옷을 가위로 잘라 상처 부위를 완전히 드러내고 정확한 출혈 지점을 확인하십시오.', stepImage: 'assets/Trauma1.jpeg' },
      { title: '직접 압박 시행', desc: '멸균 거즈나 깨끗한 천을 대고 손바닥 전체로 체중을 실어 강하게 누르십시오.', tip: '거즈가 피에 젖어도 떼지 말고 위에 계속 덧대세요.', stepImage: 'assets/Trauma2.jpeg' },
      { title: '지혈대(T-kit) 적용', desc: '대량 출혈이 멈추지 않는 팔/다리 상처 시, 상처 5~10cm 위쪽에 지혈대를 감고 막대를 돌려 고정하십시오.', stepImage: 'assets/Trauma3.jpeg' }
    ],
    dos: ['출혈 부위를 심장보다 높게 유지하세요', '지혈대 사용 시 착용 시각을 환자의 몸에 기록하세요'],
    donts: ['상처에 박힌 칼 등을 억지로 뽑지 마세요', '가루약, 된장 등 이물질을 바르지 마세요'],
    warning: '지혈대는 최후의 수단이며, 한 번 조이면 의료진이 올 때까지 절대 풀지 마십시오.',
    color: C.danger
  },
  '화상': {
    title: '화상 부위 냉각 및 보호',
    diagnosis: '열상성 화상(Burn Injury)',
    riskLevel: '2',
    protocol: 'SOP-BRN-08',
    steps: [
      { title: '즉시 흐르는 물 냉각', desc: '흐르는 찬물에 20분 이상 외상 부위의 열을 식히십시오. 얼음물은 피하십시오.', stepImage: 'assets/Burn1.jpeg' },
      { title: '의복 및 장신구 제거', desc: '상처 부위 옷을 가위로 자르고, 부종이 생기기 전 반지나 시계를 신속히 제거하십시오.', tip: '피부에 붙은 옷은 억지로 떼지 마세요.', stepImage: 'assets/Burn2.jpeg' },
      { title: '외상 부위 보호', desc: '연고를 바르지 말고, 깨끗한 거즈나 비닐 랩으로 외상 부위를 느슨하게 덮어 외부 오염을 차단하십시오.', stepImage: 'assets/Burn3.jpeg' }
    ],
    dos: ['물집이 있다면 터뜨리지 말고 보호하세요', '통증이 심하면 시원한 물수건으로 계속 덮으세요'],
    donts: ['얼음을 외상 부위에 직접 대지 마세요', '버터, 치약, 간장 등을 바르는 민간요법은 금물입니다'],
    warning: '안면 화상이나 연기 흡입 시 즉시 산소를 공급하고 호흡을 감시하십시오.',
    color: C.warning
  },
  '익수 / 저체온': {
    title: '익수자 구조 및 체온 관리',
    diagnosis: '심부 저체온증(Hypothermia)',
    riskLevel: '2',
    protocol: 'SOP-HYP-05',
    steps: [
      { title: '젖은 의복 제거', desc: '바람이 없는 따뜻하고 건조한 곳으로 이동하고, 젖은 옷을 가위로 잘라 제거한 뒤 마른 수건으로 몸을 닦으십시오.', stepImage: 'assets/Hypothermia1.jpeg' },
      { title: '중심 체온 가온', desc: '담요로 몸을 감싸고, 온팩을 겨드랑이, 사타구니, 목 등 굵은 혈관 부위에 대십시오.', stepImage: 'assets/Hypothermia2.jpeg' },
      { title: '안정 및 수평 이동', desc: '환자를 갑자기 일으키거나 팔다리를 주무르지 마십시오. 차가운 피가 심장으로 흘러가면 위험합니다.', stepImage: 'assets/Hypothermia3.jpeg' }
    ],
    dos: ['의식이 있다면 따뜻하고 단 음료를 주십시오', '환자를 아주 조심스럽게(수평으로) 옮기십시오'],
    donts: ['팔다리를 문지르거나 주무르지 마세요', '뜨거운 물에 환자를 직접 담그지 마세요'],
    warning: '심한 저체온증 환자는 작은 충격에도 심정지가 올 수 있으니 달걀 다루듯 조심하십시오.',
    color: C.warning
  },
  '골절 / 탈구': {
    title: '골절 부위 고정 및 보호',
    diagnosis: '골절 및 신경 손상 의심',
    riskLevel: '1',
    protocol: 'SOP-FRC-04',
    steps: [
      { title: '골절 부위 안정화', desc: '다친 부위를 고정하고, 환자가 통증을 가장 적게 느끼는 자세를 손으로 받쳐주거나 유지하게 하십시오.', stepImage: 'assets/Fracture1.jpeg' },
      { title: '부목 적용', desc: '나무판자나 종이박스로 다친 관절의 위아래를 포함하도록 대고 끈으로 묶어 고정하십시오.', stepImage: 'assets/Fracture2.jpeg' },
      { title: '말단 순환 확인', desc: '고정 후 손가락이나 발가락 끝을 눌러 혈색이 돌아오는지 확인하고 감각을 체크하십시오.', stepImage: 'assets/Fracture3.jpeg' }
    ],
    dos: ['뼈가 튀어나왔다면 멸균 거즈로 먼저 덮으세요', '외상 부위를 심장보다 높게 올리세요'],
    donts: ['부러진 뼈를 맞추려 하거나 밀어 넣지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
    warning: '척추 손상이 의심되는 경우 절대로 환자를 움직이지 마십시오.',
    color: C.info
  },
  '상처 세척': {
    title: '외상 부위 세척 및 감염 방지',
    diagnosis: '국소 외상 및 찰과상',
    riskLevel: '1',
    protocol: 'SOP-WND-06',
    steps: [
      { title: '이물질 세척', desc: '멸균 식염수나 흐르는 수돗물로 상처 부위의 흙이나 이물질을 충분히 씻어내십시오.', stepImage: 'assets/Wound1.jpeg' },
      { title: '멸균 드레싱', desc: '상처에 달라붙지 않는 멸균 거즈로 덮고, 반창고나 붕대로 고정하십시오.', stepImage: 'assets/Wound2.jpeg' }
    ],
    dos: ['처치 전 위생 장갑을 반드시 착용하세요', '거즈가 없다면 깨끗한 손수건을 사용하세요'],
    donts: ['상처에 솜(탈지면)을 직접 대지 마세요', '입으로 상처를 빨아내지 마세요'],
    warning: '깊은 자상이나 오염된 상처는 세척만 한 뒤 즉시 의료진에게 넘기십시오.',
    color: C.success
  }
}

export default function Emergency({ patient, initialAction, onNavigate }) {
  const [triageStep, setTriageStep] = useState(() => {
    if (initialAction) {
      const mapping = {
        'CARDIAC': '심폐소생술',
        'TRAUMA': '지혈/압박',
        'UNCONSCIOUS': '기도 확보',
        'RESPIRATORY': '기도 확보'
      }
      const targetAction = mapping[initialAction] || initialAction
      if (ACTION_GUIDES[targetAction]) return 'GUIDE'
    }
    return 'CHECK'
  })

  const [activeAction, setActiveAction] = useState(() => {
    if (initialAction) {
      const mapping = {
        'CARDIAC': '심폐소생술',
        'TRAUMA': '지혈/압박',
        'UNCONSCIOUS': '기도 확보',
        'RESPIRATORY': '기도 확보'
      }
      const targetAction = mapping[initialAction] || initialAction
      if (ACTION_GUIDES[targetAction]) return targetAction
    }
    return null
  })

  const [selectedTriage, setSelectedTriage] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [sessionLogs, setSessionLogs] = useState([])
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null)
  const [showCompletionPanel, setShowCompletionPanel] = useState(false)
  const [startTime] = useState(new Date())
  const [endTime, setEndTime] = useState(null)
  
  const [bpm] = useState(110)
  const [beat, setBeat] = useState(false)
  
  const [vitals, setVitals] = useState({ 
    hr: 96, 
    spo2: '94.2', 
    bp: '158/95', 
    temp: '37.6', 
    rr: 24 
  })

  // ─── 수동 입력 상태 ───
  const [editTarget, setEditTarget] = useState(null) // { key, label, value, unit }
  const [inputValue, setInputValue] = useState('')

  const handleOpenEdit = (key, label, currentVal, unit) => {
    setEditTarget({ key, label, unit })
    setInputValue(currentVal)
  }

  const handleSaveVital = () => {
    if (!editTarget) return
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    setVitals(prev => ({ ...prev, [editTarget.key]: inputValue }))
    setSessionLogs([{ 
      time: now, 
      text: `${editTarget.label} 수동 업데이트 : ${inputValue}${editTarget.unit}`, 
      type: 'INFO' 
    }, ...sessionLogs])
    setEditTarget(null)
  }

  const handleSyncData = () => {
    const now = new Date()
    setEndTime(now)
    const logTime = now.toLocaleTimeString('ko-KR', { hour12: false })
    setSessionLogs([{ time: logTime, text: "모든 처치 데이터 동기화 및 전송 완료 (tb_logs)", type: 'SUCCESS' }, ...sessionLogs])
    setTriageStep('SUMMARY')
  }

  const handleFinish = () => {
    setEndTime(new Date())
    setTriageStep('SUMMARY')
  }

  const getDuration = () => {
    if (!startTime || !endTime) return '0분 0초'
    const diff = Math.floor((endTime - startTime) / 1000)
    const m = Math.floor(diff / 60)
    const s = diff % 60
    return `${m}분 ${s}초`
  }

  const checkAlert = (key, value) => {
    if (!value) return false;
    const numVal = parseFloat(value);
    if (key === 'hr') return numVal < 60 || numVal > 100;
    if (key === 'spo2') return numVal < 95;
    if (key === 'rr') return numVal < 12 || numVal > 20;
    if (key === 'temp') return numVal < 36.0 || numVal > 37.8;
    if (key === 'bp') {
      const parts = String(value).split('/');
      if (parts.length !== 2) return false;
      const sys = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      return sys > 140 || sys < 90 || dia > 90 || dia < 60;
    }
    return false;
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
    if (activeAction && ACTION_GUIDES[activeAction] && !isDone) {
      const stepTitle = ACTION_GUIDES[activeAction].steps[index].title
      setSessionLogs([{ time: now, text: `${stepTitle} 완료`, type: 'SUCCESS' }, ...sessionLogs])
      setCompletedSteps([...completedSteps, index])
      setShowCompletionPanel(true)
    }
  }

  const handleTriageSelect = (triage) => {
    setSelectedTriage(triage)
    setActiveAction(triage.action)
    setTriageStep('GUIDE')
    
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    setSessionLogs([{ time: now, text: `의식 수준 판별 완료: ${triage.label} (${triage.desc})`, type: 'INFO' }, ...sessionLogs])
  }

  const handleResetSession = () => {
    setActiveAction(null)
    setCompletedSteps([])
    setSelectedTriage(null)
    setShowCompletionPanel(false)
    setTriageStep('CHECK')
  }

  // 1. 의식 판별 화면 (CHECK)
  if (triageStep === 'CHECK') {
    const triageData = [
      { label: '눈을 뜨고 말을 하나요?', desc: '정상 의식', action: '상처 세척', color: C.success },
      { label: '부르면 대답을 하나요?', desc: '언어 반응', action: '골절 / 탈구', color: C.info },
      { label: '꼬집을 때만 반응하나요?', desc: '통증 반응', action: '기도 확보', color: C.cyan },
      { label: '전혀 반응이 없나요?', desc: '무반응', action: '심폐소생술', color: C.danger },
    ]
    return (
      <div className="cyber-bg" style={{ height: 'calc(100vh - 72px)', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: 144, height: 144, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 46, border: `1px solid ${C.border}`, boxShadow: `0 0 30px ${C.info}22` }}><Brain size={72} color={C.cyan}/></div>
        <h1 style={{ fontSize: 68, fontWeight: 950, color: '#fff', marginBottom: 18, letterSpacing: '-2px', textShadow: `0 0 20px ${C.cyan}44` }}>환자의 현재 의식 수준을 판별하십시오</h1>
        <p style={{ fontSize: 28, color: C.sub, fontWeight: 600, marginBottom: 68 }}>AI 가이드 활성화를 위한 첫 번째 단계입니다.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, maxWidth: 1400, width: '100%' }}>
          {triageData.map((t, i) => (
            <button key={i} onClick={() => handleTriageSelect(t)} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 40, padding: 46, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }} className="triage-btn">
              <div style={{ fontSize: 34, fontWeight: 950, color: '#fff', marginBottom: 11 }}>{t.label}</div>
              <div style={{ fontSize: 28, color: t.color, fontWeight: 800, textShadow: `0 0 10px ${t.color}44` }}>• {t.desc}</div>
            </button>
          ))}
        </div>
        <style>{`.triage-btn:hover { background: ${C.panel2} !important; transform: translateY(-6px); border-color: ${C.cyan}66 !important; boxShadow: 0 10px 30px rgba(0,0,0,0.5); }`}</style>
      </div>
    )
  }

  // 2. 처치 완료 요약 화면 (SUMMARY)
  if (triageStep === 'SUMMARY') {
    return (
      <div className="cyber-bg" style={{ height: 'calc(100vh - 72px)', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 1200, width: '100%', background: C.panel, backdropFilter: 'blur(32px)', border: `1px solid ${C.border}`, borderRadius: 46, padding: 68, position: 'relative', overflow: 'hidden', boxShadow: '0 43px 86px -18px rgba(0,0,0,0.8)' }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, left: '-150%', width: '60%', height: '100%', 
            background: `linear-gradient(90deg, transparent, ${C.cyan}11, rgba(255,255,255,0.2), ${C.cyan}11, transparent)`, 
            transform: 'skewX(-30deg)',
            animation: 'shimmerFlow 3.5s infinite linear',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 9, background: `linear-gradient(90deg, ${C.cyan}, ${C.success})`, zIndex: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 58, position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                <div style={{ padding: '9px 18px', background: `${C.success}18`, color: C.success, borderRadius: 11, fontSize: 18, fontWeight: 900, border: `1px solid ${C.success}44` }}>SESSION COMPLETED</div>
                <div style={{ fontSize: 20, color: C.sub, fontWeight: 700 }}>종료 시각 : {new Date().toLocaleTimeString()}</div>
              </div>
              <h2 style={{ fontSize: 60, fontWeight: 950, color: '#fff', letterSpacing: '-1.5px', textShadow: `0 0 20px ${C.success}44` }}>응급 처치 세션 종료 보고</h2>
            </div>
            <div style={{ width: 115, height: 115, borderRadius: '50%', background: `${C.success}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${C.success}`, boxShadow: `0 0 30px ${C.success}33` }}>
              <Check size={65} color={C.success} strokeWidth={4}/>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, marginBottom: 58, position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: 46, borderRadius: 34, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, color: C.sub, fontWeight: 800, marginBottom: 29 }}>처치 결과 요약</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: C.sub, fontSize: 28, fontWeight: 700 }}>대상 선원</span>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: 28 }}>{patient?.name} ({patient?.role})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
                  <span style={{ color: C.sub, fontSize: 28, fontWeight: 700 }}>처치 내용</span>
                  <span style={{ fontWeight: 800, color: C.cyan, fontSize: 28 }}>{activeAction || '상태 판별'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
                  <span style={{ color: C.sub, fontSize: 28, fontWeight: 700 }}>소요 시간</span>
                  <span style={{ fontWeight: 900, color: C.cyan, fontSize: 36, textShadow: `0 0 10px ${C.cyan}44` }}>{getDuration()}</span>
                </div>
              </div>
            </div>
            <div style={{ background: `${C.info}08`, padding: 34, borderRadius: 34, border: `1px solid ${C.info}33` }}>
              <div style={{ fontSize: 22, color: C.info, fontWeight: 800, marginBottom: 22 }}>AI 후속 지침</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 14, fontSize: 22, fontWeight: 700, color: C.text }}><AlertCircle size={25} color={C.info} style={{flexShrink:0}}/> <span>환자 상태 안정 시까지 바이탈을 지속적으로 모니터링하십시오.</span></div>
                <div style={{ display: 'flex', gap: 14, fontSize: 22, fontWeight: 700, color: C.text }}><AlertCircle size={25} color={C.info} style={{flexShrink:0}}/> <span>2차 감염 방지를 위해 외상 부위를 보호하고 체온을 유지하십시오.</span></div>
                <div style={{ display: 'flex', gap: 14, fontSize: 22, fontWeight: 700, color: C.text }}><AlertCircle size={25} color={C.info} style={{flexShrink:0}}/> <span>환자의 의식 변화와 추가 증상을 상세히 기록하여 보존하십시오.</span></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, position: 'relative', zIndex: 2 }}>
            <button onClick={handleResetSession} style={{ flex: 1, padding: '28px', borderRadius: 22, background: '#fff', color: '#000', border: 'none', fontWeight: 950, fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, boxShadow: '0 14px 28px rgba(255,255,255,0.1)' }}>
              <RefreshCw size={28}/> 새로운 처치 시작
            </button>
            <button onClick={() => onNavigate('main')} style={{ flex: 1, padding: '28px', borderRadius: 22, background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${C.border}`, fontWeight: 950, fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <LayoutDashboard size={28}/> 메인 대시보드로 복귀
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 3. 가이드 화면 (GUIDE)
  const currentActionData = activeAction ? ACTION_GUIDES[activeAction] : null
  const activeDisplayIndex = hoveredStepIndex !== null ? hoveredStepIndex : (currentActionData?.steps.findIndex((_, i) => !completedSteps.includes(i)) ?? 0)
  const stepNum = activeDisplayIndex + 1
  const stepImage = currentActionData?.steps[activeDisplayIndex]?.stepImage || currentActionData?.image

  return (
    <div className="cyber-bg" style={{ height: 'calc(100vh - 72px)', width: '100%', background: C.bg, color: C.text, position: 'relative', overflow: 'hidden', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020204 98%)' }} />

      {/* 상단 긴급 브리핑 바 */}
      {selectedTriage && (
        <div style={{ position: 'relative', zIndex: 10, background: `${selectedTriage.color}15`, borderBottom: `1px solid ${selectedTriage.color}33`, padding: '18px 34px', display: 'flex', alignItems: 'center', gap: 28, backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: selectedTriage.color, opacity: 0.8 }}>TRIAGE RESULT :</span>
            <span style={{ fontSize: 25, fontWeight: 950, color: '#fff' }}>{selectedTriage.desc} ({selectedTriage.label})</span>
          </div>
          <div style={{ width: 1, height: 22, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: selectedTriage.color, opacity: 0.8 }}>AI PROTOCOL :</span>
            <span style={{ fontSize: 25, fontWeight: 950, color: selectedTriage.color, textShadow: `0 0 10px ${selectedTriage.color}44` }}>{currentActionData?.title} 가동 중</span>
          </div>
          <button onClick={() => {setTriageStep('CHECK'); setSelectedTriage(null)}} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.sub, fontSize: 18, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>재판별</button>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '680px 1fr 620px', gridTemplateRows: '1fr 158px', gap: '14px', padding: '14px', height: selectedTriage ? 'calc(100% - 68px)' : '100%', boxSizing: 'border-box' }}>
        
        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: C.panel, borderRadius: 34, border: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '22px 28px', borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: 25, fontWeight: 950 }}>처치 동작 시각 가이드</div>
            </div>
            <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {activeAction && stepImage ? (
                <img src={stepImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SOP" />
              ) : (
                <div style={{ textAlign: 'center', color: C.sub }}>
                  <div style={{ fontSize: 32, fontWeight: 950, color: C.cyan }}>{activeAction} 일러스트 준비 중</div>
                </div>
              )}
              {activeAction === '심폐소생술' && stepNum >= 3 && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: beat ? C.danger : '#b91c1c', borderRadius: '0 0 34px 34px', padding: '11px 34px', display: 'flex', alignItems: 'center', gap: 18, transition: '0.1s', zIndex: 20, boxShadow: `0 0 20px ${C.danger}66` }}>
                  <Heart size={25} fill="#fff" color="#fff" />
                  <div style={{ fontSize: 25, fontWeight: 950, color: '#fff' }}>박자에 맞춰 가슴을 힘껏 누르세요</div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none' }}>
          {activeAction ? (
            <div style={{ background: C.panel, borderRadius: 34, border: `1px solid ${C.border}`, padding: '34px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 11 }}>
                    <div style={{ background: currentActionData.color, color: '#000', padding: '6px 18px', borderRadius: 11, fontSize: 20, fontWeight: 950 }}>RISK LEVEL {currentActionData.riskLevel}</div>
                    <div style={{ color: currentActionData.color, fontSize: 25, fontWeight: 800 }}>AI 진단 : {currentActionData.diagnosis}</div>
                  </div>
                  <h2 style={{ fontSize: 72, fontWeight: 950, letterSpacing: '-3px', margin: 0, textShadow: `0 0 20px ${currentActionData.color}44` }}>{currentActionData.title}</h2>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 34 }}>
                <div style={{ background: `${C.success}0a`, border: `1px solid ${C.success}33`, borderRadius: 28, padding: 25 }}>
                  <div style={{ color: C.success, fontSize: 28, fontWeight: 900, marginBottom: 14 }}>권고 사항</div>
                  {currentActionData.dos.map((d, i) => <div key={i} style={{ fontSize: 28, fontWeight: 700, marginBottom: 9, color: C.text }}>• {d}</div>)}
                </div>
                <div style={{ background: `${C.danger}0d`, border: `1px solid ${C.danger}44`, borderRadius: 28, padding: 25 }}>
                  <div style={{ color: C.danger, fontSize: 28, fontWeight: 900, marginBottom: 14 }}>절대 금기</div>
                  {currentActionData.donts.map((d, i) => <div key={i} style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 9 }}>• {d}</div>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {currentActionData.steps.map((step, i) => (
                  <div key={i} onClick={() => handleStepToggle(i)} onMouseEnter={() => setHoveredStepIndex(i)} onMouseLeave={() => setHoveredStepIndex(null)} style={{ display: 'flex', gap: 28, padding: '28px 34px', borderRadius: 34, cursor: 'pointer', background: completedSteps.includes(i) ? `${C.cyan}11` : 'rgba(255,255,255,0.03)', border: `2px solid ${completedSteps.includes(i) ? C.cyan : C.border}`, transition: '0.2s', boxShadow: completedSteps.includes(i) ? `0 0 20px ${C.cyan}22` : 'none' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: completedSteps.includes(i) ? C.cyan : 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: 34, flexShrink: 0, color: completedSteps.includes(i) ? '#000' : '#fff', display: 'flex', boxShadow: completedSteps.includes(i) ? `0 0 15px ${C.cyan}` : 'none' }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize: 43, fontWeight: 950, marginBottom: 6, color: completedSteps.includes(i) ? '#fff' : C.text, letterSpacing: '-1.5px' }}>{step.title}</div>
                      <div style={{ fontSize: 32, color: completedSteps.includes(i) ? '#fff' : C.sub, fontWeight: 600, lineHeight: 1.4 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              {showCompletionPanel && (
                <div style={{ marginTop: 34, padding: '40px', background: `${C.cyan}0a`, border: `1px solid ${C.cyan}44`, borderRadius: 34, backdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                    <div style={{ width: 104, height: 104, background: C.cyan, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${C.cyan}66` }}><Send size={52} color="#000"/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 34, fontWeight: 950, color: '#fff', marginBottom: 6 }}>처치 및 바이탈 데이터 전송</div>
                      <div style={{ fontSize: 25, color: C.sub, fontWeight: 700, lineHeight: 1.5 }}>
                        전송 대기 : <span style={{ color: C.cyan }}>{sessionLogs.length}건</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 18 }}>
                      <button onClick={handleSyncData} style={{ background: C.cyan, color: '#000', border: 'none', padding: '22px 40px', borderRadius: 20, fontWeight: 950, cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', gap: 11, boxShadow: `0 11px 22px ${C.cyan}44` }}><RefreshCw size={28}/> 데이터 전송</button>
                      <button onClick={() => setTriageStep('SUMMARY')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${C.border}`, padding: '22px 34px', borderRadius: 20, fontWeight: 950, cursor: 'pointer', fontSize: 28 }}>처치 종료</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 28 }}>
              <div style={{ width: 172, height: 172, borderRadius: '50%', background: `${C.danger}0d`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 34, border: `2px solid ${C.danger}33` }}><AlertTriangle size={100} color={C.danger}/></div>
              <h2 style={{ fontSize: 68, fontWeight: 950, marginBottom: 18, color: '#fff', textShadow: `0 0 20px ${C.danger}44` }}>비의료인 자율 대응 모드</h2>
              <p style={{ fontSize: 36, color: C.sub, fontWeight: 700, maxWidth: 900, lineHeight: 1.5 }}>환자의 의식 수준 판별을 통해<br/>적절한 응급처치 가이드를 활성화하십시오.</p>
            </div>
          )}
        </section>

        <aside style={{ gridRow: '1', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '28px', background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, flexShrink: 0, backdropFilter: 'blur(10px)' }}>
             <div style={{ display: 'flex', gap: 22, marginBottom: 28, alignItems: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: 22, overflow: 'hidden', border: `3px solid ${C.cyan}`, boxShadow: `0 0 15px ${C.cyan}33` }}><img src={patient?.avatar || 'CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <div style={{ fontSize: 36, fontWeight: 950, color: '#fff' }}>{patient?.name}</div>
                  <div style={{ fontSize: 22, color: C.cyan, fontWeight: 800 }}>{patient?.role}</div>
                </div>
                <div style={{ fontSize: 20, color: C.sub, fontWeight: 700 }}>ID : {patient?.id}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11 }}>
                <VitalMini label="심박수" value={vitals.hr} unit="bpm" color={C.danger} icon={<HeartPulse size={20}/>} isAlert={checkAlert('hr', vitals.hr)} />
                <VitalMini label="산소포화도" value={vitals.spo2} unit="%" color={C.info} icon={<Wind size={20}/>} isAlert={checkAlert('spo2', vitals.spo2)} />
                <VitalMini label="호흡수" value={vitals.rr || 24} unit="/min" color={C.success} icon={<Activity size={20}/>} isAlert={checkAlert('rr', vitals.rr || 24)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                <VitalMini label="혈압" value={vitals.bp} unit="mmHg" color={C.purple} icon={<Activity size={22}/>} isManual isAlert={checkAlert('bp', vitals.bp)} onClick={() => handleOpenEdit('bp', '혈압', vitals.bp, 'mmHg')} />
                <VitalMini label="체온" value={vitals.temp} unit="°C" color="#f97316" icon={<Thermometer size={22}/>} isManual isAlert={checkAlert('temp', vitals.temp)} onClick={() => handleOpenEdit('temp', '체온', vitals.temp, '°C')} />
              </div>
              {editTarget && (
                <div style={{ 
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%) translateY(22px)', 
                  zIndex: 1000, width: 520, background: C.panel, border: `2px solid ${C.info}`, borderRadius: 32,
                  padding: 40, boxShadow: `0 30px 72px rgba(0,0,0,0.8)`, animation: 'fadeIn 0.2s ease', backdropFilter: 'blur(20px)'
                }}>
                  <div style={{ fontSize: 25, fontWeight: 900, color: '#fff', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 14 }}>
                    {editTarget.key === 'bp' ? <Activity size={28} color={C.info} /> : <Thermometer size={28} color={C.info} />}
                    {editTarget.label} 입력
                  </div>
                  <input 
                    autoFocus
                    value={inputValue} 
                    placeholder={editTarget.key === 'bp' ? '예: 120/80' : '예: 36.5'}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveVital()}
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${C.border}`,
                      borderRadius: 20, padding: '22px 28px', color: '#fff', fontSize: 34, fontWeight: 800,
                      outline: 'none', marginBottom: 28, textAlign: 'center', letterSpacing: '1.5px', boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '20px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', color: C.sub, border: 'none', fontWeight: 800, fontSize: 22, cursor: 'pointer' }}>취소</button>
                    <button onClick={handleSaveVital} style={{ flex: 2, padding: '20px', borderRadius: 18, background: C.info, color: '#000', border: 'none', fontWeight: 950, fontSize: 22, cursor: 'pointer', boxShadow: `0 8px 20px ${C.info}44` }}>데이터 저장</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1, background: C.panel, borderRadius: 34, padding: '28px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: `1px solid ${C.border}`, minHeight: 0, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontWeight: 900, marginBottom: 22, color: C.cyan, display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, fontSize: 25 }}>
              <History size={25} />
              <span>대응 타임라인</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
              {sessionLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: C.bg, border: `4px solid ${log.type === 'SUCCESS' ? C.success : C.cyan}`, flexShrink: 0, marginTop: '6px', boxShadow: `0 0 10px ${log.type === 'SUCCESS' ? C.success : C.cyan}66` }} />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '25px', color: C.text, fontWeight: 750, lineHeight: 1.3 }}>{log.text}</div>
                    <div style={{ fontSize: '18px', color: C.sub, whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600 }}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section style={{ gridColumn: '1 / 4', gridRow: '2', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '11px', marginTop: '6px' }}>
          {Object.keys(ACTION_GUIDES).map(key => (
            <button key={key} onClick={() => {setActiveAction(key); setCompletedSteps([]); setSelectedTriage(null); setShowCompletionPanel(false);}} style={{ background: activeAction === key ? `linear-gradient(135deg, ${ACTION_GUIDES[key].color}, ${ACTION_GUIDES[key].color}dd)` : `${ACTION_GUIDES[key].color}15`, border: '2px solid', borderColor: activeAction === key ? 'transparent' : `${ACTION_GUIDES[key].color}33`, borderRadius: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '11px', transition: '0.2s', boxShadow: activeAction === key ? `0 8px 20px ${ACTION_GUIDES[key].color}44` : 'none' }}>
              <div style={{ color: activeAction === key ? '#fff' : ACTION_GUIDES[key].color }}><ActionButtonIcon label={key} size={36} /></div>
              <div style={{ fontSize: 32, fontWeight: 950, color: '#fff', letterSpacing: '-1.5px' }}>{key}</div>
            </button>
          ))}
        </section>
      </div>

      <style>{`
        @keyframes shimmerFlow {
          0% { left: -150%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 200%; opacity: 0; }
        }
        @keyframes pulse-alert {
          0% { background: rgba(255, 0, 85, 0.15); border-color: rgba(255, 0, 85, 0.4); }
          50% { background: rgba(255, 0, 85, 0.35); border-color: rgba(255, 0, 85, 1); box-shadow: 0 0 20px rgba(255, 0, 85, 0.4); }
          100% { background: rgba(255, 0, 85, 0.15); border-color: rgba(255, 0, 85, 0.4); }
        }
      `}</style>
    </div>
  )
}

function VitalMini({ label, value, unit, color, icon, onClick, isManual, isAlert }) {
  return (
    <div onClick={onClick} style={{ 
      background: isAlert ? 'rgba(255,0,85,0.15)' : 'rgba(255,255,255,0.03)', 
      padding: '20px 18px', 
      borderRadius: 28, 
      border: isAlert ? `3px solid ${C.danger}` : `1px solid ${C.border}`, 
      cursor: isManual ? 'pointer' : 'default', 
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
      animation: isAlert ? 'pulse-alert 0.8s infinite' : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 122
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ color: isAlert ? C.danger : color, display: 'flex', alignItems: 'center' }}>{React.cloneElement(icon, { size: 20 })}</span>
          <div style={{ fontSize: 18, color: isAlert ? C.danger : C.sub, fontWeight: 800, letterSpacing: '0.7px', textTransform: 'uppercase', opacity: 0.8 }}>
            {label} {isManual && <span style={{ fontSize: 16, color: '#fff', marginLeft: 3 }}>(입력)</span>}
          </div>
        </div>
        {isManual && <Edit3 size={18} color={C.sub} style={{ opacity: 0.7 }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start', gap: 6 }}>
        <span style={{ 
          fontSize: 46, 
          fontWeight: 950, 
          color: isAlert ? '#fff' : color, 
          letterSpacing: '-1.5px',
          lineHeight: 1,
          textShadow: isAlert ? `0 0 10px ${C.danger}` : `0 0 10px ${color}44`
        }}>{value}</span>
        <span style={{ 
          fontSize: 18, 
          color: isAlert ? '#fff' : C.sub, 
          fontWeight: 800, 
          opacity: isAlert ? 0.9 : 0.6 
        }}>{unit}</span>
      </div>
    </div>
  )
}

function ActionButtonIcon({ label, size = 24 }) {
  if (label === '심폐소생술') return <Heart size={size} />
  if (label === '하임리히법') return <Zap size={size} />
  if (label === '지혈/압박') return <Activity size={size} />
  if (label === '기도 확보') return <Wind size={size} />
  if (label === '골절 / 탈구') return <Bone size={size} />
  if (label === '익수 / 저체온') return <Droplets size={size} />
  if (label === '상처 세척') return <Scissors size={size} />
  if (label === '화상') return <Flame size={size} />
  return <Info size={size} />
}
