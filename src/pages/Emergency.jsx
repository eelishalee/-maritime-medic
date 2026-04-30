import { useState, useEffect } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload, Camera, Edit3, Bone, Flame, RefreshCw, Send, Check, LayoutDashboard, AlertOctagon } from 'lucide-react'
import { CardiacIllustration, TraumaIllustration, UnconsciousIllustration, RespiratoryIllustration } from '../components/EmergencyIllustrations'
import CameraModal from '../components/CameraModal'

const ACTION_GUIDES = {
  '심폐소생술': {
    title: '심폐소생술 및 AED 사용',
    diagnosis: '심정지(Cardiac Arrest) 의심',
    riskLevel: '4',
    protocol: 'SOP-CPR-01',
    hasMetronome: true,
    steps: [
      { title: '의식 및 호흡 확인', desc: '어깨를 두드리며 "괜찮으세요?"라고 묻고, 가슴이 오르내리는지 10초간 확인하십시오.', tip: '숨을 안 쉬면 즉시 시작합니다.', stepImage: '/assets/Fracture_Dislocation/CPR-01.png' },
      { title: '도움 및 AED 요청', desc: '주변 사람 중 한 명을 지목해 "비상 상황 전파" 및 "AED(심장충격기)"를 가져와 달라고 지시하십시오.', stepImage: '/assets/Fracture_Dislocation/CPR-02.png' },
      { title: '가슴 압박 시행', desc: '가슴 중앙에 깍지 낀 손을 대고, 팔꿈치를 펴서 수직으로 5~6cm 깊이로 강하게 누르십시오.', tip: '분당 100~120회 속도를 유지하세요.', stepImage: '/assets/Fracture_Dislocation/CPR-03.png' },
      { title: 'AED 패드 부착', desc: '전원을 켜고 패드 하나는 오른쪽 쇄골 아래, 다른 하나는 왼쪽 옆구리에 붙인 뒤 음성 지시에 따르십시오.', tip: '분석 중에는 환자에게서 떨어지십시오.', stepImage: '/assets/Fracture_Dislocation/CPR-04.png' }
    ],
    dos: ['1초당 2번 속도로 강하게 압박하세요', '압박 후 가슴이 완전히 올라오게 하세요', 'AED의 음성 지시에 따라 행동하십시오'],
    donts: ['환자가 의식이 있다면 하지 마세요', '맥박 확인을 위해 시간을 허비하지 마세요', '압박 중 팔꿈치를 굽히지 마세요'],
    warning: '환자가 스스로 숨을 쉬거나 의료진이 올 때까지 중단하지 마십시오.',
    color: '#ef4444'
  },
  '하임리히법': {
    title: '기도 이물질 제거 (하임리히법)',
    diagnosis: '기도 폐쇄(Airway Obstruction)',
    riskLevel: '4',
    protocol: 'SOP-HEI-07',
    steps: [
      { title: '의식 및 상태 확인', desc: '환자 뒤로 가서 말을 걸어보세요. 목을 감싸고 말을 전혀 못 하면 즉시 처치를 시작합니다.', tip: '환자가 기침을 할 수 있다면 계속하게 하세요.', stepImage: '/assets/Fracture_Dislocation/Heimlich_Maneuver-01.png' },
      { title: '자세 잡고 지탱하기', desc: '환자 뒤에 서서 양팔로 허리를 감싸고, 내 한쪽 다리를 환자 다리 사이에 넣어 환자가 쓰러질 때를 대비해 지탱하세요.', stepImage: '/assets/Fracture_Dislocation/Heimlich_Maneuver-02.png' },
      { title: '손 모양과 위치 잡기', desc: '한쪽 주먹의 엄지손가락 쪽 면을 배꼽과 명치 사이에 대고, 다른 손으로 그 주먹을 꽉 움켜쥐십시오.', stepImage: '/assets/Fracture_Dislocation/Heimlich_Maneuver-03.png' },
      { title: '강하게 밀어 올리기', desc: '환자의 배를 안쪽 위 방향(J자 모양)으로 강하게 들어 올리듯 반복해서 당기십시오.', tip: '이물질이 나오거나 환자가 의식을 잃을 때까지 반복하세요.', stepImage: '/assets/Fracture_Dislocation/Heimlich_Maneuver-04.png' }
    ],
    dos: ['이물질이 튀어나올 때까지 최대한 강하게 하세요', '환자가 의식을 잃으면 즉시 바닥에 눕히고 심폐소생술을 시작하세요'],
    donts: ['입안에 이물질이 보이지 않는데 손가락을 넣어 쑤시지 마세요', '임산부는 복부가 아닌 가슴 부위를 압박하세요'],
    warning: '환자가 의식을 잃으면 즉시 기도를 확보하고 심폐소생술(CPR)로 전환하십시오.',
    color: '#ef4444'
  },
  '기도 확보': {
    title: '기도 유지 및 호흡 보조',
    diagnosis: '호흡 곤란 및 기도 폐쇄 위험',
    riskLevel: '3',
    protocol: 'SOP-AIR-03',
    steps: [
      { title: '머리 기울이기-턱 올리기', desc: '한 손을 이마에 대고 머리를 뒤로 젖히며, 다른 손가락으로 턱뼈를 들어 올려 기도를 확보하십시오.', stepImage: '/assets/Fracture_Dislocation/Airway_Management-01.png' },
      { title: '입안 이물질 제거', desc: '눈에 보이는 구토물이나 이물질이 있다면 머리를 옆으로 돌려 손가락으로 가볍게 제거하십시오.', stepImage: '/assets/Fracture_Dislocation/Airway_Management-02.png' },
      { title: '의복 이완 및 조임 해제', desc: '넥타이, 벨트, 상의 단추 등 환자의 호흡을 방해하는 조이는 의복을 신속히 풀어주십시오.', tip: '흉부 팽창을 자유롭게 하여 자가 호흡을 돕습니다.', stepImage: '/assets/Fracture_Dislocation/Airway_Management-03.png' },
      { title: '회복 자세 유지', desc: '환자가 스스로 숨을 쉰다면 몸을 옆으로 돌려 눕혀 기도가 막히지 않도록 조치하십시오.', tip: '혀가 뒤로 말리거나 구토물에 의한 질식을 예방합니다.', stepImage: '/assets/Fracture_Dislocation/Airway_Management-04.png' }
    ],
    dos: ['환자가 자가 호흡 중이면 옆으로 눕히세요', '구토 시 즉시 몸 전체를 옆으로 돌리세요'],
    donts: ['의식이 없는 환자에게 물을 먹이지 마세요', '머리 밑에 베개를 넣어 기도를 꺾지 마세요'],
    warning: '호흡음이 거칠거나 청색증이 보이면 즉시 심폐소생술을 준비하십시오.',
    color: '#ef4444'
  },
  '지혈/압박': {
    title: '출혈 부위 직접 압박',
    diagnosis: '외상성 대량 출혈(Hemorrhage)',
    riskLevel: '3',
    protocol: 'SOP-BLD-02',
    steps: [
      { title: '상처 노출 및 확인', desc: '옷을 가위로 잘라 상처 부위를 완전히 드러내고 정확한 출혈 지점을 확인하십시오.', stepImage: '/assets/Fracture_Dislocation/Bleeding_Control-01.png' },
      { title: '직접 압박 시행', desc: '멸균 거즈나 깨끗한 천을 대고 손바닥 전체로 체중을 실어 강하게 누르십시오.', tip: '거즈가 피에 젖어도 떼지 말고 위에 계속 덧대세요.', stepImage: '/assets/Fracture_Dislocation/Bleeding_Control-02.png' },
      { title: '지혈대(T-kit) 적용', desc: '대량 출혈이 직접 압박으로 멈추지 않을 때만 상처 5~10cm 위쪽(심장 방향)에 지혈대를 감고 막대를 돌려 고정하십시오.', tip: '최종 수단이며, 착용 시각을 환자의 이마 등에 반드시 기록하십시오.', stepImage: '/assets/Fracture_Dislocation/Bleeding_Control-03.png?v=2' }    ],
    dos: ['출혈 부위를 심장보다 높게 유지하세요', '지혈대 사용 시 착용 시각을 환자의 몸에 기록하세요', '피부에 직접 닿게 꽉 조이십시오'],
    donts: ['상처에 박힌 칼 등을 억지로 뽑지 마세요', '가루약, 된장 등 이물질을 바르지 마세요', '지혈대를 옷 위에 감지 마세요'],
    warning: '지혈대는 최후의 수단이며, 한 번 조이면 의료진의 지시 없이 절대 풀지 마십시오.',
    color: '#ff3b5c'
  },
  '화상': {
    title: '피부 속 열기 배출 및 조직 손상 방지',
    diagnosis: '열상성 화상(Burn Injury)',
    riskLevel: '2',
    protocol: 'SOP-BRN-08',
    steps: [
      { title: '흐르는 물 냉각 (20분)', desc: '12~25℃ 찬물에 20분 이상 식히십시오. 수압은 약하게 유지하여 추가적인 조직 손상을 방지하십시오.', tip: '이 단계를 클릭하면 냉각 타이머가 시작됩니다. 얼음물은 절대 금기입니다.', stepImage: '/assets/Fracture_Dislocation/Burn-01.png' },
      { title: '의복 및 장신구 제거', desc: '가위로 옷을 자르되, 피부에 달라붙은 옷은 억지로 떼지 말고 주변만 자르십시오.', tip: '부종이 생기기 전에 반지, 시계 등을 신속히 제거하는 것이 필수입니다.', stepImage: '/assets/Fracture_Dislocation/Burn-02.png' },
      { title: '화상 연고 및 드레싱', desc: '처치 부위의 열감이 주변 피부와 비슷해진 것을 확인한 후, 멸균 면봉으로 연고를 얹듯이 바르십시오. 랩이나 거즈는 절대 꽉 조이지 않게 느슨하게 덮으십시오.', tip: '화기가 남은 상태에서 연고를 바르면 열이 갇혀 상처가 깊어집니다.', stepImage: '/assets/Fracture_Dislocation/Burn-03.png' },
      { title: '환부 거상 및 보고', desc: '환부를 심장보다 높게 유지하고, 환자에게 수분을 공급하십시오. 즉시 긴급 의료 지원을 요청(육상 의료 지원팀 연계)하고 환자 상태를 상세히 기록하십시오.', tip: '처치 내용과 환자 상태 변화를 기록하여 보존하십시오.', stepImage: '/assets/Fracture_Dislocation/Burn-04.png' }
      ],
    dos: ['물집이 터지지 않도록 최대한 조심하세요', '통증 완화를 위해 수평을 유지하며 안정시키세요', '화학 화상 시 오염된 옷을 즉시 제거하세요'],
    donts: ['민간요법(된장, 소주, 치약 등)은 절대 금물입니다', '얼음을 직접 환부에 대거나 문지르지 마세요', '환부에 직접 손을 대지 마세요'],
    warning: '안면 화상이나 연기 흡입 시 산소를 공급하십시오. 화학 화상 시에는 더 많은 양의 물로 씻어내십시오.',
    color: '#f59e0b'
  },
  '익수 / 저체온': {
    title: '익수자 구조 및 체온 관리',
    diagnosis: '심부 저체온증(Hypothermia)',
    riskLevel: '2',
    protocol: 'SOP-HYP-05',
    steps: [
      { title: '젖은 의복 제거', desc: '바람이 없는 따뜻하고 건조한 곳으로 이동하고, 젖은 옷을 가위로 잘라 제거한 뒤 마른 수건으로 몸을 닦으십시오.', stepImage: '/assets/Fracture_Dislocation/Drowning_Hypothermia-01.png' },
      { title: '중심 체온 가온', desc: '담요로 몸을 감싸고, 온팩을 겨드랑이, 사타구니, 목 등 굵은 혈관 부위에 대십시오.', stepImage: '/assets/Fracture_Dislocation/Drowning_Hypothermia-02.png' },
      { title: '안정 및 수평 이동', desc: '환자를 갑자기 일으키거나 팔다리를 주무르지 마십시오. 차가운 피가 심장으로 흘러가면 위험합니다.', stepImage: '/assets/Fracture_Dislocation/Drowning_Hypothermia-03.png' }
    ],
    dos: ['의식이 있다면 따뜻하고 단 음료를 주십시오', '환자를 아주 조심스럽게(수평으로) 옮기십시오'],
    donts: ['팔다리를 문지르거나 주무르지 마세요', '뜨거운 물에 환자를 직접 담그지 마세요'],
    warning: '심한 저체온증 환자는 작은 충격에도 심정지가 올 수 있으니 달걀 다루듯 조심하십시오.',
    color: '#f97316'
  },
  '골절 / 탈구': {
    title: '골절 부위 고정 및 보호',
    diagnosis: '골절 및 신경 손상 의심',
    riskLevel: '1',
    protocol: 'SOP-FRC-04',
    steps: [
      { title: '상처 확인 및 안정화', desc: '다친 부위를 손으로 받쳐 움직이지 않게 고정하고, 환자가 통증을 가장 적게 느끼는 편안한 자세를 유지하게 하십시오.', stepImage: '/assets/Fracture_Dislocation/Fracture_Dislocation-01.png' },
      { title: '부목 고정', desc: '나무판자나 종이박스로 다친 관절의 위아래를 충분히 포함하도록 대고 끈이나 붕대로 움직이지 않게 묶으십시오.', tip: '너무 꽉 조여 혈액 순환을 방해하지 않도록 주의하십시오.', stepImage: '/assets/Fracture_Dislocation/Fracture_Dislocation-02.png' },
      { title: '냉찜질 (부종 방지)', desc: '부종과 통증을 줄이기 위해 얼음팩을 수건에 싸서 환부에 15분간 대어 주십시오. 얼음이 피부에 직접 닿지 않게 하십시오.', tip: '냉찜질은 혈관을 수축시켜 내부 출혈과 붓기를 완화합니다.', stepImage: '/assets/Fracture_Dislocation/Fracture_Dislocation-03.png' },
      { title: '순환 확인 및 보고', desc: '손발가락 끝의 혈색과 온도를 확인하며 환부를 고정 상태로 유지하십시오. 즉시 긴급 의료 지원을 요청(육상 의료 지원팀 연계)하십시오.', tip: '감각이 없거나 창백해지면 부목을 즉시 느슨하게 조정하십시오.', stepImage: '/assets/Fracture_Dislocation/Fracture_Dislocation-04.png' }
    ],
    dos: ['뼈가 튀어나왔다면 멸균 거즈로 먼저 덮으세요', '다친 부위를 심장보다 높게 올리십시오', '환자가 안정을 취하도록 돕고 체온을 유지하세요'],
    donts: ['부러진 뼈를 맞추려 하거나 억지로 밀어 넣지 마세요', '탈구된 관절을 직접 끼우려 하지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
    warning: '척추 손상이 의심되거나 의식이 없는 경우 환자를 절대로 움직이지 마십시오.',
    color: '#38bdf8'
  },
  '상처 세척': {
    title: '외상 부위 세척 및 감염 방지',
    diagnosis: '국소 외상 및 찰과상',
    riskLevel: '1',
    protocol: 'SOP-WND-06',
    steps: [
      { title: '충분한 세척 (5~10분)', desc: '흐르는 수돗물이나 멸균 식염수로 5~10분간 상처 속 이물질을 충분히 씻어내십시오.', tip: '상처 속 흙이나 오염 물질이 남으면 감염의 원인이 됩니다.', stepImage: '/assets/Fracture_Dislocation/Wound_Cleaning-01.png' },
      { title: '연고 및 멸균 드레싱', desc: '깨끗한 거즈로 주변 물기를 닦고 항생제 연고를 바른 뒤 멸균 거즈로 환부를 덮으십시오.', tip: '상처에 직접 손을 대지 말고 멸균 면봉을 사용하십시오.', stepImage: '/assets/Fracture_Dislocation/Wound_Cleaning-02.png' }
    ],
    dos: ['처치 전 위생 장갑을 반드시 착용하세요', '거즈가 없다면 깨끗한 손수건을 사용하세요', '상처 주변 피부를 청결히 유지하세요'],
    donts: ['상처 내부에 소독액(알코올 등)을 직접 붓지 마세요', '상처에 가루약이나 된장 등을 바르지 마세요', '상처에 솜(탈지면)을 직접 대지 마세요'],
    warning: '깊은 자상, 동물에 물린 상처, 녹슨 금속에 의한 상처는 세척 후 즉시 의료진의 처치를 받으십시오.',
    color: '#10b981'
  }
}

const FOLLOWUP_GUIDES = {
  '심폐소생술': [
    '즉시 원격 의료진에 연락하여 추가 지침을 받으십시오.',
    '환자 의식 회복 여부를 2분마다 확인하십시오.',
    'AED 패드를 부착한 채 유지하고 재충격에 대비하십시오.',
  ],
  '하임리히법': [
    '이물질 제거 후에도 호흡 상태를 지속 모니터링하십시오.',
    '목 통증 또는 삼킴 곤란이 지속되면 원격 의료팀에 보고하십시오.',
    '의식 상태 및 산소포화도를 30분간 집중 관찰하십시오.',
  ],
  '기도 확보': [
    '회복 자세를 유지하며 호흡음을 30초마다 확인하십시오.',
    '구토 발생 즉시 기도를 다시 확보하십시오.',
    '의식 수준 변화를 기록하여 의료진에게 전달하십시오.',
  ],
  '지혈/압박': [
    '지혈 상태를 유지하며 드레싱이 젖으면 위에 덧대십시오.',
    '지혈대 착용 시각을 기록하고 2시간 초과 전 의료진에게 보고하십시오.',
    '쇼크 징후(창백, 냉습, 의식 저하)를 지속 모니터링하십시오.',
  ],
  '화상': [
    '냉각 완료 후 멸균 드레싱 상태를 유지하십시오.',
    '환부를 심장보다 높게 유지하고 수분을 보충하십시오.',
    '수포 파열 방지 및 2차 감염 여부를 지속 관찰하십시오.',
  ],
  '익수 / 저체온': [
    '체온을 30분마다 측정하고 기록하십시오.',
    '담요 보온을 유지하고 따뜻한 수분을 지속 공급하십시오.',
    '의식 변화 또는 심부정맥 징후 발생 시 즉시 CPR을 준비하십시오.',
  ],
  '골절 / 탈구': [
    '부목 상태와 말단 혈색을 15분마다 확인하십시오.',
    '부종 증가 시 부목을 느슨하게 조정하십시오.',
    '척추 손상 가능성이 있는 경우 절대 이동하지 마십시오.',
  ],
  '상처 세척': [
    '드레싱 상태를 8시간마다 점검하고 교체하십시오.',
    '붉어짐·고름·악취 등 감염 징후를 매일 확인하십시오.',
    '상처가 깊거나 오염이 심하면 원격 의료팀에 추가 상담하십시오.',
  ],
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
  const [selectedStepIndex, setSelectedStepIndex] = useState(null)
  const SESSION_KEY = `emergency_logs_${patient?.id || 'unknown'}`
  const [sessionLogs, setSessionLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showCompletionPanel, setShowCompletionPanel] = useState(false)
  const [startTime] = useState(new Date())
  const [endTime, setEndTime] = useState(null)
  
  const [bpm] = useState(120)
  const [beat, setBeat] = useState(false)
  
  const [vitals, setVitals] = useState({ 
    hr: 96, 
    spo2: '94.2', 
    bp: '158/95', 
    temp: '37.6', 
    rr: 24 
  })

  const [editTarget, setEditTarget] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const handleOpenEdit = (key, label, currentVal, unit) => {
    setEditTarget({ key, label, unit })
    setInputValue(currentVal)
  }

  const handleSaveVital = () => {
    if (!editTarget) return
    const val = inputValue.trim()
    if (!val) return
    if (editTarget.key === 'bp') {
      const parts = val.split('/')
      if (parts.length !== 2 || isNaN(parseInt(parts[0])) || isNaN(parseInt(parts[1]))) {
        alert('혈압 형식이 올바르지 않습니다. 예: 120/80')
        return
      }
    } else if (isNaN(parseFloat(val))) {
      alert('숫자를 입력하세요.')
      return
    }
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    setVitals(prev => ({ ...prev, [editTarget.key]: val }))
    setSessionLogs([{
      time: now,
      text: `${editTarget.label} 수동 업데이트 : ${val}${editTarget.unit}`,
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
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionLogs))
    } catch {
      // Ignore storage errors
    }
  }, [sessionLogs, SESSION_KEY])

  // 모든 스텝 이미지 사전 로드 (첫 클릭 시 지연 방지)
  useEffect(() => {
    Object.values(ACTION_GUIDES).forEach(guide => {
      guide.steps.forEach(step => {
        if (step.stepImage) {
          const img = new window.Image()
          img.src = step.stepImage
        }
      })
    })
  }, [])

  useEffect(() => {
    if (activeAction === '심폐소생술') {
      const interval = setInterval(() => setBeat(b => !b), 60000 / bpm / 2)
      return () => clearInterval(interval)
    }
  }, [activeAction, bpm])

  const handleStepToggle = (index) => {
    const isDone = completedSteps.includes(index)
    const now = new Date().toLocaleTimeString('ko-KR', { hour12: false })
    
    // 마지막 클릭한 번호 고정
    setSelectedStepIndex(index)

    if (activeAction === '화상' && index === 0) {
      setIsBurnTimerActive(true)
    }
    if (activeAction === '골절 / 탈구' && index === 2) {
      setColdTimer(900)
      setIsColdTimerActive(true)
    }
    if (activeAction === '상처 세척' && index === 0) {
      setWashTimer(300)
      setIsWashTimerActive(true)
    }

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
    setSelectedStepIndex(null)
    setTriageStep('CHECK')
  }

  const [burnTimer, setBurnTimer] = useState(1200)
  const [isBurnTimerActive, setIsBurnTimerActive] = useState(false)
  const [coldTimer, setColdTimer] = useState(900)
  const [isColdTimerActive, setIsColdTimerActive] = useState(false)
  const [washTimer, setWashTimer] = useState(300)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isWashTimerActive, setIsWashTimerActive] = useState(false)

  useEffect(() => {
    let interval;
    if (activeAction === '화상' && isBurnTimerActive && burnTimer > 0) {
      interval = setInterval(() => {
        setBurnTimer(prev => prev - 1)
      }, 1000)
    }
    if (activeAction === '골절 / 탈구' && isColdTimerActive && coldTimer > 0) {
      interval = setInterval(() => {
        setColdTimer(prev => prev - 1)
      }, 1000)
    }
    if (activeAction === '상처 세척' && isWashTimerActive && washTimer > 0) {
      interval = setInterval(() => {
        setWashTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeAction, isBurnTimerActive, burnTimer, isColdTimerActive, coldTimer, isWashTimerActive, washTimer])

  const formatBurnTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const currentActionData = activeAction ? ACTION_GUIDES[activeAction] : null
  
  // 이미지 표시 우선순위 : 마지막으로 클릭한 인덱스 > 첫 번째 미완료 단계
  const activeDisplayIndex = selectedStepIndex !== null
    ? selectedStepIndex
    : (currentActionData?.steps.findIndex((_, i) => !completedSteps.includes(i)) ?? 0)

  const stepNum = activeDisplayIndex + 1

  useEffect(() => { setImgLoaded(false) }, [activeAction, activeDisplayIndex])

  if (triageStep === 'CHECK') {
    const triageData = [
      { label: '눈을 뜨고 말을 하나요?', desc: '정상 의식', sub: '일반적인 대화 가능', action: '상처 세척', color: '#2dd4bf', icon: <CheckCircle2 size={32}/> },
      { label: '부르면 대답을 하나요?', desc: '언어 반응', sub: '부르는 소리에 반응', action: '기도 확보', color: '#fb923c', icon: <Mic size={32}/> },
      { label: '꼬집을 때만 반응하나요?', desc: '통증 반응', sub: '강한 자극에만 반응', action: '기도 확보', color: '#fb923c', icon: <Zap size={32}/> },
      { label: '전혀 반응이 없나요?', desc: '무반응 (긴급)', sub: '의식 및 반응 없음', action: '심폐소생술', color: '#f43f5e', icon: <AlertOctagon size={32}/> },
    ]
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(244,63,94,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 46, fontWeight: 950, color: '#fff', marginBottom: 16, letterSpacing: '-1.5px', textShadow: '0 4px 12px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>환자의 현재 의식 수준을 판별하십시오</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ height: 2, width: 30, background: '#38bdf8' }} />
            <p style={{ fontSize: 22, color: '#94a3b8', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>골든타임 확보를 위한 AI 긴급 프로토콜 가동</p>
            <div style={{ height: 2, width: 30, background: '#38bdf8' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 1140, width: '100%', position: 'relative', zIndex: 10 }}>
          {triageData.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTriageSelect(t)}
              onMouseEnter={() => {
                const guide = ACTION_GUIDES[t.action]
                if (guide) guide.steps.forEach(s => { if (s.stepImage) { const img = new window.Image(); img.src = s.stepImage } })
              }}
              style={{ 
                background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '32px 32px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }} 
              className="triage-btn"
            >
              <div style={{ width: 72, height: 72, borderRadius: 22, background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color, border: `2.5px solid ${t.color}40`, flexShrink: 0, boxShadow: `0 0 20px ${t.color}15` }}>{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 21, fontWeight: 900, color: t.color, letterSpacing: '1.5px', marginBottom: 6, opacity: 0.9, whiteSpace: 'nowrap' }}>{t.sub}</div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#fff', marginBottom: 4, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>{t.label}</div>
                <div style={{ fontSize: 20, color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>{t.desc}</div>
              </div>
              <ChevronRight size={32} color="#1e293b" style={{ opacity: 0.5, flexShrink: 0 }} />
              <div className="btn-glow" style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${t.color}15, transparent)`, opacity: 0, transition: '0.3s' }} />
            </button>
          ))}
        </div>
        <style>{`
          .triage-btn:hover { background: rgba(255,255,255,0.05) !important; transform: translateY(-8px) scale(1.02); border-color: rgba(255,255,255,0.2) !important; boxShadow: 0 20px 40px rgba(0,0,0,0.4); }
          .triage-btn:hover .btn-glow { opacity: 1 !important; }
          .triage-btn:hover svg { transform: scale(1.1); transition: 0.3s; }
        `}</style>
      </div>
    )
  }

  if (triageStep === 'SUMMARY') {
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 850, width: '100%', background: 'rgba(2, 12, 27, 0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: 48, position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'absolute', top: 0, left: '-150%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.1), rgba(255,255,255,0.2), rgba(56,189,248,0.1), transparent)', transform: 'skewX(-30deg)', animation: 'shimmerFlow 3.5s infinite linear', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #38bdf8, #22c55e)', zIndex: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 8, fontSize: 13, fontWeight: 900, border: '1px solid rgba(34,197,94,0.3)' }}>SESSION COMPLETED</div>
                <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>종료 시각 : {new Date().toLocaleTimeString()}</div>
              </div>
              <h2 style={{ fontSize: 42, fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>응급 처치 세션 종료 보고</h2>
            </div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #22c55e', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}><Check size={44} color="#22c55e" strokeWidth={3}/></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40, position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 800, marginBottom: 20 }}>처치 결과 요약</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#64748b', fontSize: 22, fontWeight: 700 }}>대상 선원</span><span style={{ fontWeight: 800, color: '#fff', fontSize: 22 }}>{patient?.name} ({patient?.role})</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}><span style={{ color: '#64748b', fontSize: 22, fontWeight: 700 }}>처치 내용</span><span style={{ fontWeight: 800, color: '#38bdf8', fontSize: 22 }}>{activeAction || '상태 판별'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}><span style={{ color: '#64748b', fontSize: 22, fontWeight: 700 }}>시작 시각</span><span style={{ fontWeight: 800, color: '#fff', fontSize: 22 }}>{startTime.toLocaleTimeString('ko-KR', {hour12:false})}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}><span style={{ color: '#64748b', fontSize: 22, fontWeight: 700 }}>종료 시각</span><span style={{ fontWeight: 800, color: '#fff', fontSize: 22 }}>{endTime?.toLocaleTimeString('ko-KR', {hour12:false})}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}><span style={{ color: '#64748b', fontSize: 22, fontWeight: 700 }}>소요 시간</span><span style={{ fontWeight: 900, color: '#38bdf8', fontSize: 26 }}>{getDuration()}</span></div>
              </div>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.06)', padding: 24, borderRadius: 24, border: '1px solid rgba(56,189,248,0.2)' }}>
              <div style={{ fontSize: 15, color: '#38bdf8', fontWeight: 800, marginBottom: 16 }}>AI 후속 지침 — {activeAction || '처치'} 완료 후</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(FOLLOWUP_GUIDES[activeAction] || [
                  '환자 상태 안정 시까지 바이탈을 지속적으로 모니터링하십시오.',
                  '2차 감염 방지를 위해 외상 부위를 보호하고 체온을 유지하십시오.',
                  '환자의 의식 변화와 추가 증상을 상세히 기록하여 보존하십시오.',
                ]).map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
                    <AlertCircle size={18} color="#38bdf8" style={{flexShrink:0}}/>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 2 }}>
            <button onClick={handleResetSession} style={{ flex: 1, padding: '20px', borderRadius: 16, background: '#fff', color: '#000', border: 'none', fontWeight: 950, fontSize: 19, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}><RefreshCw size={20}/> 새로운 처치 시작</button>
            <button onClick={() => onNavigate('main')} style={{ flex: 1, padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 950, fontSize: 19, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><LayoutDashboard size={20}/> 메인 대시보드로 복귀</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', background: '#020617', color: '#fff', position: 'relative', overflow: 'hidden', fontFamily: '"Pretendard", sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020617 98%)' }} />
      
      {selectedTriage && (
        <div style={{ position: 'relative', zIndex: 10, background: `${selectedTriage.color}15`, borderBottom: `1px solid ${selectedTriage.color}30`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 14, fontWeight: 800, color: selectedTriage.color, opacity: 0.8 }}>TRIAGE RESULT :</span><span style={{ fontSize: 18, fontWeight: 950, color: '#fff' }}>{selectedTriage.desc} ({selectedTriage.label})</span></div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 14, fontWeight: 800, color: selectedTriage.color, opacity: 0.8 }}>AI PROTOCOL :</span><span style={{ fontSize: 18, fontWeight: 950, color: selectedTriage.color }}>{currentActionData?.title} 가동 중</span></div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={() => {setTriageStep('CHECK'); setSelectedTriage(null)}} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 8, color: '#64748b', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>의식 재판별</button>
          </div>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '480px 1fr 440px', gridTemplateRows: '1fr 110px', gap: '10px', padding: '10px', boxSizing: 'border-box' }}>
        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 18, fontWeight: 950 }}>처치 동작 시각 가이드</div></div>
            <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {currentActionData?.steps[activeDisplayIndex]?.stepImage && (
                <img
                  key={`${activeAction}-${activeDisplayIndex}`}
                  src={currentActionData.steps[activeDisplayIndex].stepImage}
                  onLoad={() => setImgLoaded(true)}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition:
                      (activeAction === '심폐소생술' && activeDisplayIndex === 0) ? '20% 20%' :
                      (activeAction === '심폐소생술' && activeDisplayIndex === 2) ? '50% 0%' :
                      (activeAction === '심폐소생술' && activeDisplayIndex === 3) ? 'center 60%' :
                      (activeAction === '기도 확보' && activeDisplayIndex === 1) ? '20% center' :
                      (activeAction === '기도 확보' && activeDisplayIndex === 3) ? '0% 60%' :
                      'center center',
                    transform:
                      (activeAction === '심폐소생술' && activeDisplayIndex === 2) ? 'scale(1.2) translateY(-10%)' :
                      (activeAction === '기도 확보' && activeDisplayIndex === 1) ? 'scale(1.3)' :
                      (activeAction === '기도 확보' && activeDisplayIndex === 3) ? 'scale(1.25)' :
                      'none',
                    transition: 'transform 0.3s ease-out'
                  }}
                  alt={currentActionData.steps[activeDisplayIndex].title}
                />
              )}
              
              {activeAction === '심폐소생술' && stepNum === 3 && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: beat ? '#ef4444' : '#b91c1c', borderRadius: '0 0 32px 32px', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.1s', zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)', borderTop: 'none' }}>
                  <Zap size={36} fill="#fff" color="#fff" /><div style={{ fontSize: 32, fontWeight: 950, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(0,0,0,0.3)', letterSpacing: '-1px' }}>깜빡임 속도에 맞춰 압박하세요</div>
                </div>
              )}

              {activeAction === '화상' && burnTimer >= 0 && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8%', 
                  right: '3%', 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  background: 'rgba(2, 6, 23, 0.9)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  zIndex: 60,
                  border: `8px solid ${burnTimer === 0 ? '#22c55e' : '#ef4444'}`,
                  boxShadow: `0 15px 40px ${burnTimer === 0 ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.6)'}`,
                  animation: (isBurnTimerActive && burnTimer > 0) ? 'pulse 1.5s infinite' : 'none',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{ position: 'absolute', top: '30px', fontSize: 22, fontWeight: 900, color: burnTimer === 0 ? '#22c55e' : '#ef4444', letterSpacing: '-0.5px', transition: 'all 0.5s ease' }}>{burnTimer === 0 ? '냉각 완료' : '냉각 시간'}</div>
                  <div style={{ fontSize: 48, fontWeight: 950, color: '#fff', lineHeight: 1, fontFamily: '"Pretendard", sans-serif', marginTop: '10px' }}>{formatBurnTime(burnTimer)}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setBurnTimer(1200); setIsBurnTimerActive(false); }}
                    style={{ 
                      position: 'absolute',
                      bottom: '15px',
                      background: 'rgba(255,255,255,0.1)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: 32, 
                      height: 32, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      color: '#fff',
                      transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    title="타이머 리셋"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}

              {activeAction === '골절 / 탈구' && activeDisplayIndex === 2 && coldTimer >= 0 && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8%', 
                  right: '3%', 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  background: 'rgba(2, 6, 23, 0.9)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  zIndex: 60,
                  border: `8px solid ${coldTimer === 0 ? '#22c55e' : '#38bdf8'}`,
                  boxShadow: `0 15px 40px ${coldTimer === 0 ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.6)'}`,
                  animation: (isColdTimerActive && coldTimer > 0) ? 'pulse 1.5s infinite' : 'none',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{ position: 'absolute', top: '30px', fontSize: 22, fontWeight: 900, color: coldTimer === 0 ? '#22c55e' : '#38bdf8', letterSpacing: '-0.5px', transition: 'all 0.5s ease' }}>{coldTimer === 0 ? '찜질 완료' : '냉찜질 시간'}</div>
                  <div style={{ fontSize: 48, fontWeight: 950, color: '#fff', lineHeight: 1, fontFamily: '"Pretendard", sans-serif', marginTop: '10px' }}>{formatBurnTime(coldTimer)}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setColdTimer(900); setIsColdTimerActive(false); }}
                    style={{ 
                      position: 'absolute',
                      bottom: '15px',
                      background: 'rgba(255,255,255,0.1)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: 32, 
                      height: 32, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      color: '#fff',
                      transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    title="타이머 리셋"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}

              {activeAction === '상처 세척' && activeDisplayIndex === 0 && washTimer >= 0 && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '8%', 
                  right: '3%', 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  background: 'rgba(2, 6, 23, 0.9)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  zIndex: 60,
                  border: `8px solid ${washTimer === 0 ? '#22c55e' : '#10b981'}`,
                  boxShadow: `0 15px 40px ${washTimer === 0 ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.6)'}`,
                  animation: (isWashTimerActive && washTimer > 0) ? 'pulse 1.5s infinite' : 'none',
                  transition: 'all 0.5s ease'
                }}>
                  <div style={{ position: 'absolute', top: '30px', fontSize: 22, fontWeight: 900, color: washTimer === 0 ? '#22c55e' : '#10b981', letterSpacing: '-0.5px', transition: 'all 0.5s ease' }}>{washTimer === 0 ? '세척 완료' : '세척 시간'}</div>
                  <div style={{ fontSize: 48, fontWeight: 950, color: '#fff', lineHeight: 1, fontFamily: '"Pretendard", sans-serif', marginTop: '10px' }}>{formatBurnTime(washTimer)}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setWashTimer(300); setIsWashTimerActive(false); }}
                    style={{ 
                      position: 'absolute',
                      bottom: '15px',
                      background: 'rgba(255,255,255,0.1)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: 32, 
                      height: 32, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      color: '#fff',
                      transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    title="타이머 리셋"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section style={{ gridRow: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {activeAction ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ background: currentActionData.color, color: '#000', padding: '4px 12px', borderRadius: 8, fontSize: 14, fontWeight: 950 }}>RISK LEVEL {currentActionData.riskLevel}</div>
                    <div style={{ color: currentActionData.color, fontSize: 18, fontWeight: 800 }}>AI 진단 : {currentActionData.diagnosis}</div>
                  </div>
                  <h2 style={{ fontSize: 52, fontWeight: 950, letterSpacing: '-2px', margin: 0 }}>{currentActionData.title}</h2>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: 18 }}><div style={{ color: '#22c55e', fontSize: 20, fontWeight: 900, marginBottom: 10 }}>권고 사항</div>{currentActionData.dos.map((d, i) => <div key={i} style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#e2e8f0', display: 'flex', gap: '8px' }}><span style={{ flexShrink: 0 }}>•</span><span>{d}</span></div>)}</div>
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 20, padding: 18 }}><div style={{ color: '#ef4444', fontSize: 20, fontWeight: 900, marginBottom: 10 }}>절대 금기</div>{currentActionData.donts.map((d, i) => <div key={i} style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6, display: 'flex', gap: '8px' }}><span style={{ flexShrink: 0 }}>•</span><span>{d}</span></div>)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{currentActionData.steps.map((step, i) => (
                <div key={i} onClick={() => handleStepToggle(i)} style={{ display: 'flex', gap: 20, padding: '20px 24px', borderRadius: 24, cursor: 'pointer', background: selectedStepIndex === i ? 'rgba(56,189,248,0.15)' : completedSteps.includes(i) ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.03)', border: `2px solid ${selectedStepIndex === i ? '#38bdf8' : completedSteps.includes(i) ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.06)'}`, transition: '0.2s' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedStepIndex === i ? '#38bdf8' : completedSteps.includes(i) ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: 24, flexShrink: 0, color: (selectedStepIndex === i || completedSteps.includes(i)) ? '#000' : '#fff', display: 'flex' }}>{i+1}</div>
                  <div><div style={{ fontSize: 30, fontWeight: 950, marginBottom: 4, color: (selectedStepIndex === i || completedSteps.includes(i)) ? '#fff' : '#e2e8f0', letterSpacing: '-1px' }}>{step.title}</div><div style={{ fontSize: 22, color: (selectedStepIndex === i || completedSteps.includes(i)) ? '#fff' : '#94a3b8', fontWeight: 600, lineHeight: 1.4 }}>{step.desc}</div></div>
                </div>
              ))}</div>
              {showCompletionPanel && (
                <div style={{ marginTop: 24, padding: '28px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ width: 72, height: 72, background: '#38bdf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56,189,248,0.4)' }}><Send size={36} color="#000"/></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 24, fontWeight: 950, color: '#fff', marginBottom: 4 }}>처치 및 바이탈 데이터 전송</div><div style={{ fontSize: 18, color: '#94a3b8', fontWeight: 700, lineHeight: 1.5 }}>전송 대기 : <span style={{ color: '#38bdf8' }}>{sessionLogs.length}건</span></div></div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={handleSyncData} style={{ background: '#38bdf8', color: '#000', border: 'none', padding: '16px 28px', borderRadius: 14, fontWeight: 950, cursor: 'pointer', fontSize: 19, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 16px rgba(56,189,248,0.2)' }}><RefreshCw size={20}/> 데이터 전송</button>
                      <button onClick={() => setTriageStep('SUMMARY')} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: 14, fontWeight: 950, cursor: 'pointer', fontSize: 19 }}>처치 종료</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><AlertTriangle size={70} color="#ef4444"/></div>
              <h2 style={{ fontSize: 48, fontWeight: 950, marginBottom: 12 }}>비의료인 자율 대응 모드</h2>
              <p style={{ fontSize: 26, color: '#94a3b8', fontWeight: 700, maxWidth: 650, lineHeight: 1.5 }}>환자의 의식 수준 판별을 통해<br/>적절한 응급처치 가이드를 활성화하십시오.</p>
            </div>
          )}
        </section>
        <aside style={{ gridRow: '1', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, overflow: 'hidden' }}>
          {/* Patient Profile - Top Priority Anchor */}
          <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }}><img src={patient?.avatar || 'CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><div style={{ fontSize: 24, fontWeight: 950, color: '#fff' }}>{patient?.name}</div><div style={{ fontSize: 15, color: '#38bdf8', fontWeight: 800 }}>{patient?.role}</div></div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>ID : {patient?.id}</div>
            </div>
            {patient?.allergies && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12 }}>
                <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 900 }}>알레르기 : {patient.allergies}</span>
              </div>
            )}
          </div>

          {/* Vitals Section - Unified & Simplified */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <VitalMini label="심박수" value={vitals.hr} unit="bpm" color="#ff3b5c" icon={<HeartPulse size={16}/>} isAlert={checkAlert('hr', vitals.hr)} range="60-100" />
              <VitalMini label="산소포화도" value={vitals.spo2} unit="%" color="#38bdf8" icon={<Wind size={16}/>} isAlert={checkAlert('spo2', vitals.spo2)} range="95-100" />
              <VitalMini label="호흡수" value={vitals.rr || 24} unit="/min" color="#10b981" icon={<Activity size={16}/>} isAlert={checkAlert('rr', vitals.rr || 24)} range="12-20" />
              <VitalMini label="혈압(직접)" value={vitals.bp} unit="mmHg" color="#8b5cf6" icon={<Zap size={16}/>} isManual isAlert={checkAlert('bp', vitals.bp)} range="90/60-140/90" onClick={() => handleOpenEdit('bp', '혈압', vitals.bp, 'mmHg')} />
              <VitalMini label="체온(직접)" value={vitals.temp} unit="°C" color="#f59e0b" icon={<Thermometer size={16}/>} isManual isAlert={checkAlert('temp', vitals.temp)} range="36.1-37.2" onClick={() => handleOpenEdit('temp', '체온', vitals.temp, '°C')} />
              
              {/* 환자 의식 상태 요약 (6번째 칸 활용) */}
              <div style={{ background: 'rgba(56,189,248,0.05)', border: '1.5px dashed rgba(56,189,248,0.2)', borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 4 }}>
                <div style={{ fontSize: 16, color: '#38bdf8', fontWeight: 800 }}>의식 수준</div>
                <div style={{ fontSize: 25, fontWeight: 950, color: '#fff' }}>{selectedTriage?.desc || '판별 전'}</div>
              </div>
            </div>
            
            {editTarget && (
              <div style={{
                position: 'absolute', 
                top: editTarget.key === 'temp' ? '40%' : '60%', 
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000, 
                width: 360, 
                background: '#1e293b', 
                border: '2px solid #38bdf8', 
                borderRadius: 24, 
                padding: 28, 
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
                animation: 'fadeIn 0.2s ease', 
                backdropFilter: 'blur(25px)' 
              }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {editTarget.key === 'bp' ? <Zap size={20} /> : <Thermometer size={20} />}
                  {editTarget.label} 직접 입력
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 12 }}>
                  정상 범위 : {editTarget.key === 'bp' ? '90/60 - 140/90' : '36.1 - 37.2'} {editTarget.unit}
                </div>
                <input 
                  value={inputValue} 
                  autoFocus 
                  placeholder={editTarget.key === 'bp' ? '예 : 120/80' : '예 : 36.5'} 
                  onChange={e => setInputValue(e.target.value)} 
                  onKeyDown={e => { 
                    if (e.key === 'Enter') handleSaveVital(); 
                    if (e.key === 'Escape') setEditTarget(null); 
                  }} 
                  style={{ 
                    width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: 14, padding: '16px 20px', color: '#fff', fontSize: 24, fontWeight: 800, 
                    outline: 'none', marginBottom: 20, textAlign: 'center', letterSpacing: '1px', boxSizing: 'border-box'
                  }} 
                />
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>취소</button>
                  <button onClick={handleSaveVital} style={{ flex: 2, padding: '14px', borderRadius: 12, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 950, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>데이터 저장</button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', minHeight: 0 }}>
            <div style={{ fontWeight: 900, marginBottom: 16, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}><History size={18} /><span>대응 타임라인</span></div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {sessionLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#020617', border: `3px solid ${log.type === 'SUCCESS' ? '#22c55e' : '#38bdf8'}`, flexShrink: 0, marginTop: '6px' }} />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '16px', color: '#e2e8f0', fontWeight: 750, lineHeight: 1.3 }}>{log.text}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600 }}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <section style={{ gridColumn: '1 / 4', gridRow: '2', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', marginTop: '4px' }}>
          {Object.keys(ACTION_GUIDES).map(key => (
            <button key={key} onClick={() => {setActiveAction(key); setCompletedSteps([]); setSelectedTriage(null); setShowCompletionPanel(false); setSelectedStepIndex(null); setIsBurnTimerActive(false); setBurnTimer(1200); setIsColdTimerActive(false); setColdTimer(900); setIsWashTimerActive(false); setWashTimer(300);}} style={{ background: activeAction === key ? `linear-gradient(135deg, ${ACTION_GUIDES[key].color}, ${ACTION_GUIDES[key].color}dd)` : `${ACTION_GUIDES[key].color}15`, border: '2px solid', borderColor: activeAction === key ? 'transparent' : `${ACTION_GUIDES[key].color}30`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><div style={{ color: activeAction === key ? '#fff' : ACTION_GUIDES[key].color }}><ActionButtonIcon label={key} size={26} /></div><div style={{ fontSize: 28, fontWeight: 950, color: '#fff', letterSpacing: '-1px' }}>{key}</div></button>
          ))}
        </section>
      </div>
      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes pulse-alert-border { 0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); } 50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); } 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}

function VitalMini({ label, value, unit, color, icon, onClick, isManual, isAlert, range }) {
  return (
    <div onClick={onClick} style={{ 
      position: 'relative',
      padding: '1px',
      borderRadius: '20px',
      background: isAlert ? '#ff3b5c' : 'rgba(255, 255, 255, 0.1)',
      cursor: isManual ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minHeight: 110,
      display: 'flex',
      flexDirection: 'column',
      animation: isAlert ? 'pulse-alert-border 1s infinite' : 'none',
      boxShadow: isAlert ? `0 0 25px ${color}66` : 'none'
    }}>
      {/* 내부 콘텐츠 카드 */}
      <div style={{ 
        flex: 1,
        background: isAlert ? 'rgba(40, 5, 10, 0.95)' : 'rgba(2, 12, 22, 0.95)', 
        backdropFilter: 'blur(40px)', 
        borderRadius: '19px', 
        padding: '14px 16px', 
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: isAlert ? '#fff' : color, display: 'flex', alignItems: 'center' }}>{icon}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontSize: 18, color: isAlert ? '#fff' : '#94a3b8', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: 12, color: isAlert ? 'rgba(255,255,255,0.6)' : 'rgba(148,163,184,0.4)', fontWeight: 500 }}>
                {range}
              </div>
            </div>
          </div>
        </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 'auto', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 40, fontWeight: 950, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 19, color: isAlert ? '#fff' : color, fontWeight: 400, opacity: 0.8 }}>{unit}</span>
          </div>
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

function IllustrationSelector({ action, step }) {
  if (action === '심폐소생술') {
    // Cardiac has steps 1, 2/3 (Press), 4 (AED)
    const s = step === 2 ? 1 : step === 3 ? 2 : step;
    return <CardiacIllustration step={s} />
  }
  if (action === '지혈/압박') {
    return <TraumaIllustration step={step} />
  }
  if (action === '기도 확보') {
    if (step === 1) return <UnconsciousIllustration step={1} />
    if (step === 2) return <UnconsciousIllustration step={2} />
  }
  return (
    <div style={{ textAlign: 'center', color: '#64748b' }}>
      <div style={{ fontSize: 22, fontWeight: 950, color: '#38bdf8' }}>{action} 일러스트 준비 중</div>
    </div>
  )
}
