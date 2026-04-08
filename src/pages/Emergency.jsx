import { useState, useEffect, useRef } from 'react'
import { ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Zap, Clock, Heart, Activity } from 'lucide-react'

// ── 응급 유형 탭 ──
const TABS = [
  { id: 'cpr',      label: '심폐소생술',   icon: '🫀', color: '#ff4d6d',  urgency: 'critical' },
  { id: 'cardiac',  label: '심근경색',     icon: '💓', color: '#ff4d6d',  urgency: 'critical' },
  { id: 'bleed',    label: '지혈 처치',    icon: '🩸', color: '#ff9f43',  urgency: 'high' },
  { id: 'shock',    label: '쇼크 대응',    icon: '⚡', color: '#a55eea',  urgency: 'high' },
  { id: 'fracture', label: '골절 고정',    icon: '🦴', color: '#4fc3f7',  urgency: 'medium' },
  { id: 'burn',     label: '화상 처치',    icon: '🔥', color: '#ff9f43',  urgency: 'medium' },
]

const GUIDES = {
  cpr: {
    title: '심폐소생술 (CPR) 표준 처치',
    color: '#ff4d6d',
    urgency: 'critical',
    description: '의식과 호흡이 없는 경우 즉시 시행. 골든타임 4분 이내 시작 필수.',
    steps: [
      {
        title: '의식 확인 및 도움 요청',
        desc: '환자의 어깨를 두드리며 "괜찮으세요?"라고 묻고, 반응이 없으면 즉시 119 신고 및 AED 확보를 주변에 요청합니다.',
        img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        duration: 15,
        tip: '큰 소리로 "여기 사람 쓰러졌습니다! AED 가져오세요!"',
        icon: '🔍',
        animation: 'bounce',
      },
      {
        title: '강력한 가슴 압박 30회',
        desc: '흉골 아래쪽 1/2 지점에 깍지 낀 두 손을 대고, 분당 100~120회 속도로 5~6cm 깊이로 강하게 압박합니다.',
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        duration: 20,
        tip: '팔꿈치를 펴고 체중을 실어 압박. "하나, 둘, 셋..." 세어가며 시행',
        icon: '💪',
        animation: 'pulse',
        hasCPRTimer: true,
      },
      {
        title: '인공호흡 2회 실시',
        desc: '기도를 확보(머리 뒤로 젖히기)한 상태에서 코를 막고 환자의 입에 숨을 1초 동안 불어넣기를 2회 실시합니다.',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=800',
        duration: 10,
        tip: '가슴이 올라오는지 확인. 과호흡 금지.',
        icon: '💨',
        animation: 'breathe',
      },
      {
        title: 'AED 부착 및 작동',
        desc: 'AED 도착 즉시 전원 켜고 음성 안내에 따라 패드를 부착합니다. 분석 중 및 충격 시 모두 환자에게서 손을 뗍니다.',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        duration: 30,
        tip: '패드 1: 오른쪽 쇄골 아래 / 패드 2: 왼쪽 겨드랑이 아래',
        icon: '⚡',
        animation: 'flash',
      },
    ],
  },
  cardiac: {
    title: '급성 심근경색 응급 처치',
    color: '#ff4d6d',
    urgency: 'critical',
    description: '흉통, 호흡곤란, 식은땀 등 심근경색 의심 시 즉시 시행.',
    steps: [
      {
        title: '환자 안정 및 활동 중단',
        desc: '환자를 즉시 앉히거나 눕히고 모든 신체 활동을 중단시킵니다. 옷깃을 느슨하게 풀어줍니다.',
        img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        duration: 60,
        tip: '심장에 부담을 줄이려면 반좌위 자세(45도)가 적합합니다',
        icon: '🛏',
        animation: 'fadeIn',
      },
      {
        title: '아스피린 투여 (알레르기 확인 필수)',
        desc: '아스피린 알레르기가 없다면 아스피린 300mg을 씹어서 복용하게 합니다. 알레르기 있을 경우 투여하지 마세요.',
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        duration: 120,
        tip: '⚠ 현재 환자: 아스피린 알레르기 있음 — 투여 금지!',
        tipColor: '#ff4d6d',
        icon: '💊',
        animation: 'shake',
      },
      {
        title: '12유도 심전도 측정',
        desc: '심전도 기기를 환자에게 연결하고 측정합니다. 결과를 즉시 원격의료팀에 전송합니다.',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        duration: 180,
        tip: '전극 부착 위치: 흉부 6곳 + 사지 4곳',
        icon: '📊',
        animation: 'pulse',
      },
      {
        title: '원격 의료진 연결 및 보고',
        desc: '위성통신으로 원격의료센터에 연결하고 바이탈 수치, 심전도, 증상 발현 시간을 보고합니다.',
        img: 'https://images.unsplash.com/photo-1603398938378-e54ecb44638c?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '골든타임: 증상 발생 후 90분 이내 혈관 재개통 필요',
        icon: '📡',
        animation: 'flash',
      },
    ],
  },
  bleed: {
    title: '외상 및 대출혈 지혈',
    color: '#ff9f43',
    urgency: 'high',
    description: '대량 출혈 시 수 분 내 쇼크 발생 가능. 신속한 지혈이 생명을 구합니다.',
    steps: [
      {
        title: '직접 압박 지혈',
        desc: '깨끗한 거즈를 상처에 대고 손바닥 전체로 강하게 압박합니다. 거즈가 젖어도 제거하지 말고 위에 덧댑니다.',
        img: 'https://images.unsplash.com/photo-1603398938378-e54ecb44638c?auto=format&fit=crop&q=80&w=800',
        duration: 600,
        tip: '최소 10분 이상 압박 유지. 손을 떼면 출혈 재발.',
        icon: '✋',
        animation: 'pulse',
      },
      {
        title: '지혈대(Tourniquet) 적용',
        desc: '직접 압박으로 지혈되지 않는 팔다리 대출혈 시, 상처 5~7cm 위쪽에 지혈대를 단단히 조입니다.',
        img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        duration: 300,
        tip: '적용 시각을 기록하세요. 2시간 이상 유지 금지.',
        icon: '⏱',
        animation: 'shake',
      },
      {
        title: '상처 부위 거상',
        desc: '출혈 부위를 심장보다 높게 유지하여 혈압을 낮추고 출혈 속도를 늦춥니다.',
        img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '골절 의심 시 거상 전 부목 고정을 먼저 시행하세요.',
        icon: '⬆',
        animation: 'bounce',
      },
    ],
  },
  shock: {
    title: '쇼크 예방 및 응급 처치',
    color: '#a55eea',
    urgency: 'high',
    description: '피부 창백·냉습, 의식저하, 맥박 약화 시 쇼크를 의심합니다.',
    steps: [
      {
        title: '환자 수평 유지',
        desc: '환자를 편안하게 눕히고 다리를 심장보다 20~30cm 높게 들어올려 뇌로 가는 혈류를 증가시킵니다.',
        img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '의식 없으면 회복 자세(옆으로 눕히기)를 취합니다.',
        icon: '🛏',
        animation: 'fadeIn',
      },
      {
        title: '보온 유지',
        desc: '담요나 옷으로 환자를 덮어 체온 손실을 막고 저체온증을 예방합니다.',
        img: 'https://images.unsplash.com/photo-1581594650039-362f30e7c06d?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '차가운 바닥에 직접 눕히지 마세요.',
        icon: '🌡',
        animation: 'breathe',
      },
      {
        title: '바이탈 지속 관찰',
        desc: '의료진이 도착할 때까지 환자의 의식, 호흡, 맥박 상태를 1분 단위로 체크하고 기록합니다.',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '이상 변화 발생 시 즉시 원격의료팀에 보고합니다.',
        icon: '📋',
        animation: 'pulse',
      },
    ],
  },
  fracture: {
    title: '골절 및 탈구 고정',
    color: '#4fc3f7',
    urgency: 'medium',
    description: '골절 의심 시 함부로 움직이지 말고 즉시 고정합니다.',
    steps: [
      {
        title: '손상 부위 부목 고정',
        desc: '골절 부위의 위아래 관절이 움직이지 않도록 충분히 긴 부목을 대고 붕대로 고정합니다.',
        img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '부목이 없으면 판자, 우산 등 단단한 물건으로 대체.',
        icon: '🔧',
        animation: 'fadeIn',
      },
      {
        title: '냉찜질 실시',
        desc: '부기와 통증을 줄이기 위해 부목 고정 후 얼음주머니로 냉찜질을 시행합니다.',
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        duration: 1200,
        tip: '얼음을 직접 피부에 대지 마세요. 수건으로 감싸서 사용.',
        icon: '🧊',
        animation: 'breathe',
      },
      {
        title: '말단 순환 확인',
        desc: '고정 후 손톱/발톱을 눌러 혈액순환이 잘 되는지, 감각이 있는지 확인합니다.',
        img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '손톱 눌렀다 놓으면 2초 내 혈색 회복되어야 정상.',
        icon: '🩺',
        animation: 'pulse',
      },
    ],
  },
  burn: {
    title: '화상 긴급 냉각 및 보호',
    color: '#ff9f43',
    urgency: 'medium',
    description: '즉각적인 냉각이 조직 손상 범위를 최소화합니다.',
    steps: [
      {
        title: '흐르는 물에 냉각 15분',
        desc: '화상 부위를 15~20°C의 흐르는 찬물에 15분 이상 충분히 노출시켜 열기를 식힙니다.',
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        duration: 900,
        tip: '얼음물은 사용 금지. 저체온증 유발 위험.',
        icon: '💧',
        animation: 'breathe',
        hasCoolTimer: true,
      },
      {
        title: '의복 및 장신구 제거',
        desc: '피부가 붓기 전 반지, 시계 등을 신속히 제거하되 피부에 붙은 옷은 억지로 떼지 않습니다.',
        img: 'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '무리하게 당기면 피부가 함께 벗겨질 수 있습니다.',
        icon: '💍',
        animation: 'shake',
      },
      {
        title: '멸균 드레싱 보호',
        desc: '상처 부위를 깨끗한 거즈로 느슨하게 덮습니다. 물집은 절대로 터뜨리지 않습니다.',
        img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        duration: 0,
        tip: '연고나 치약 도포 금지. 감염 유발.',
        icon: '🩹',
        animation: 'fadeIn',
      },
    ],
  },
}

// 환자 상태 → 추천 응급유형
function getRecommendedTab(patient) {
  if (!patient) return null
  const chronic = (patient.chronic || '').toLowerCase()
  const hr = patient.hr || 0
  const temp = patient.temp || 0
  if (chronic.includes('고혈압') || hr > 90) return 'cardiac'
  if (temp >= 39) return 'shock'
  return null
}

// CPR 메트로놈 컴포넌트
function CPRMetronome() {
  const [active, setActive] = useState(false)
  const [beat, setBeat] = useState(false)
  const [count, setCount] = useState(0)
  const intervalRef = useRef(null)

  const toggle = () => {
    if (active) {
      clearInterval(intervalRef.current)
      setActive(false)
    } else {
      setActive(true)
      let c = 0
      intervalRef.current = setInterval(() => {
        setBeat(b => !b)
        c++
        setCount(c)
      }, 500) // 120bpm = 500ms
    }
  }
  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div style={{
      padding: '14px 18px', borderRadius: 16,
      background: 'rgba(255,77,109,0.1)',
      border: `2px solid ${active ? '#ff4d6d' : 'rgba(255,77,109,0.3)'}`,
      display: 'flex', alignItems: 'center', gap: 14,
      marginTop: 16,
    }}>
      <button
        onClick={toggle}
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: active ? '#ff4d6d' : 'rgba(255,77,109,0.2)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: active ? '#fff' : '#ff4d6d',
          transition: 'all 0.2s',
        }}
      >
        {active ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div>
        <div style={{ fontSize: 12, color: '#ff4d6d', fontWeight: 800, marginBottom: 3 }}>CPR 메트로놈 (120 bpm)</div>
        {active && <div style={{ fontSize: 11, color: '#8da2c0' }}>압박 횟수: <span style={{ color: '#fff', fontWeight: 900 }}>{count}</span></div>}
        {!active && <div style={{ fontSize: 11, color: '#4a6080' }}>시작하면 압박 리듬을 알려드립니다</div>}
      </div>
      {active && (
        <div style={{
          marginLeft: 'auto',
          width: 20, height: 20, borderRadius: '50%',
          background: beat ? '#ff4d6d' : 'rgba(255,77,109,0.2)',
          transition: 'all 0.05s',
          boxShadow: beat ? '0 0 12px #ff4d6d' : 'none',
        }} />
      )}
    </div>
  )
}

// 타이머 컴포넌트
function StepTimer({ seconds, label, color }) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    setRemaining(seconds)
    setRunning(false)
    clearInterval(intervalRef.current)
  }, [seconds])

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      setRunning(true)
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0 }
          return r - 1
        })
      }, 1000)
    }
  }
  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setRemaining(seconds) }
  useEffect(() => () => clearInterval(intervalRef.current), [])

  const pct = ((seconds - remaining) / seconds) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div style={{
      padding: '14px 18px', borderRadius: 16,
      background: `${color}10`, border: `1.5px solid ${color}30`,
      marginTop: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Clock size={15} color={color} />
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
          {mins}:{secs.toString().padStart(2,'0')}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={toggle} style={{
          flex: 1, padding: '8px', borderRadius: 10,
          background: running ? `${color}30` : `${color}20`,
          border: `1px solid ${color}40`,
          color, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
        }}>
          {running ? <><Pause size={13} /> 정지</> : <><Play size={13} /> 시작</>}
        </button>
        <button onClick={reset} style={{
          padding: '8px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#4a6080', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <RotateCcw size={13} /> 초기화
        </button>
      </div>
    </div>
  )
}

export default function Emergency({ patient }) {
  const recommended = getRecommendedTab(patient)
  const [activeTab, setActiveTab] = useState(recommended || 'cpr')
  const [activeStep, setActiveStep] = useState(0)
  const [prevStep, setPrevStep] = useState(null)
  const [animDir, setAnimDir] = useState('right') // 'right' | 'left'
  const guide = GUIDES[activeTab]
  const step = guide.steps[activeStep]

  const goTo = (i, dir = 'right') => {
    setAnimDir(dir)
    setPrevStep(activeStep)
    setActiveStep(i)
    setTimeout(() => setPrevStep(null), 400)
  }

  const next = () => { if (activeStep < guide.steps.length - 1) goTo(activeStep + 1, 'right') }
  const prev = () => { if (activeStep > 0) goTo(activeStep - 1, 'left') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 46px)', overflow: 'hidden', background: '#050d1a' }}>

      {/* 탭 바 */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 24px',
        background: 'rgba(10,22,40,0.95)',
        borderBottom: '1.5px solid rgba(13,217,197,0.15)',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {/* 환자 상태 기반 추천 배지 */}
        {recommended && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: 'rgba(255,77,109,0.12)',
            border: '1.5px solid rgba(255,77,109,0.35)',
            fontSize: 12, color: '#ff4d6d', fontWeight: 800, flexShrink: 0,
            animation: 'pulse-dot 2s infinite',
          }}>
            <Zap size={13} /> 현재 환자 상태 기반 추천
          </div>
        )}
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setActiveStep(0) }}
            style={{
              padding: '10px 18px', borderRadius: 11, border: '2px solid',
              borderColor: activeTab === t.id ? t.color : 'rgba(255,255,255,0.06)',
              background: activeTab === t.id ? `${t.color}20` : 'rgba(255,255,255,0.02)',
              color: activeTab === t.id ? '#fff' : '#8da2c0',
              fontSize: 13, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              position: 'relative', transition: 'all 0.2s',
            }}
          >
            <span>{t.icon}</span> {t.label}
            {t.id === recommended && activeTab !== t.id && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                width: 12, height: 12, borderRadius: '50%',
                background: '#ff4d6d', border: '2px solid #050d1a',
                animation: 'pulse-dot 1s infinite',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '520px 1fr', overflow: 'hidden' }}>

        {/* 좌측: 이미지 패널 */}
        <div style={{
          borderRight: '1.5px solid rgba(13,217,197,0.15)',
          display: 'flex', flexDirection: 'column',
          background: 'rgba(15,32,64,0.3)',
          overflow: 'hidden',
        }}>
          {/* 진행 표시줄 */}
          <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
              {guide.steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > activeStep ? 'right' : 'left')}
                  style={{
                    flex: 1, height: 5, borderRadius: 3, border: 'none', cursor: 'pointer',
                    background: i === activeStep
                      ? guide.color
                      : i < activeStep
                        ? `${guide.color}60`
                        : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: '#4a6080', fontWeight: 700, flexShrink: 0 }}>
                {activeStep + 1}/{guide.steps.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 6, background: `${guide.color}20`, color: guide.color, fontWeight: 800 }}>
                STEP {activeStep + 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{step.title}</span>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <img
              key={`${activeTab}-${activeStep}`}
              src={step.img}
              alt={step.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                animation: `imgSlide${animDir === 'right' ? 'In' : 'InLeft'} 0.4s ease both`
              }}
            />
            {/* 오버레이 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.2) 50%, transparent 100%)'
            }} />

            {/* 애니메이션 아이콘 */}
            <div style={{
              position: 'absolute', top: 20, right: 20,
              fontSize: 40,
              animation: getIconAnimation(step.animation),
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
            }}>{step.icon}</div>

            {/* 하단 텍스트 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{step.title}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 10,
                background: `${step.tipColor || '#ff9f43'}18`,
                border: `1px solid ${step.tipColor || '#ff9f43'}30`
              }}>
                <AlertTriangle size={14} color={step.tipColor || '#ff9f43'} />
                <span style={{ fontSize: 12, color: step.tipColor || '#ff9f43', fontWeight: 600 }}>{step.tip}</span>
              </div>
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div style={{
            padding: '16px 24px',
            background: 'rgba(5,13,26,0.9)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', gap: 12
          }}>
            <button
              onClick={prev}
              disabled={activeStep === 0}
              style={{
                padding: '12px 20px', borderRadius: 14,
                background: activeStep === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: activeStep === 0 ? '#4a6080' : '#e8f0fe',
                fontSize: 14, fontWeight: 700, cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            ><ChevronLeft size={17} /> 이전 단계</button>
            <button
              onClick={next}
              disabled={activeStep === guide.steps.length - 1}
              style={{
                flex: 1, padding: '12px', borderRadius: 14,
                background: activeStep === guide.steps.length - 1 ? 'rgba(255,255,255,0.03)' : guide.color,
                border: 'none',
                color: activeStep === guide.steps.length - 1 ? '#4a6080' : '#050d1a',
                fontSize: 14, fontWeight: 800, cursor: activeStep === guide.steps.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >다음 단계 <ChevronRight size={17} /></button>
          </div>
        </div>

        {/* 우측: 스텝 리스트 + 도구 */}
        <div style={{ overflowY: 'auto', background: 'linear-gradient(135deg, #050d1a, #0a1628)' }}>
          {/* 가이드 제목 */}
          <div style={{ padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <ShieldAlert size={26} color={guide.color} />
              <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{guide.title}</span>
            </div>
            <p style={{ fontSize: 13, color: '#8da2c0', lineHeight: 1.6, marginBottom: 24 }}>{guide.description}</p>
          </div>

          {/* 스텝 리스트 */}
          <div style={{ padding: '0 32px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 64, top: 0, bottom: 0, width: 2, background: 'rgba(13,217,197,0.08)' }} />

            {guide.steps.map((s, i) => {
              const isActive = i === activeStep
              const isDone = i < activeStep
              return (
                <div
                  key={i}
                  onClick={() => goTo(i, i > activeStep ? 'right' : 'left')}
                  style={{
                    display: 'flex', gap: 24, marginBottom: 20,
                    cursor: 'pointer',
                    animation: `slideInLeft 0.3s ease ${i * 0.06}s both`,
                  }}
                >
                  {/* 번호 원 */}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? guide.color : isDone ? `${guide.color}40` : '#0a1628',
                    border: `3px solid ${isActive ? '#fff' : isDone ? guide.color : 'rgba(13,217,197,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2, fontSize: isDone ? 18 : 20, fontWeight: 900,
                    color: isActive ? '#050d1a' : isDone ? guide.color : '#4a6080',
                    boxShadow: isActive ? `0 0 24px ${guide.color}60` : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {isDone ? '✓' : i + 1}
                  </div>

                  {/* 카드 */}
                  <div style={{
                    flex: 1,
                    background: isActive ? `${guide.color}12` : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isActive ? guide.color : isDone ? `${guide.color}25` : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 18, padding: '18px 22px',
                    transition: 'all 0.3s',
                    transform: isActive ? 'translateX(4px)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: isActive ? '#fff' : '#8da2c0' }}>{s.title}</span>
                      {isActive && <CheckCircle2 size={18} color={guide.color} style={{ marginLeft: 'auto' }} />}
                    </div>
                    <p style={{ fontSize: 13, color: isActive ? '#e8f0fe' : '#4a6080', lineHeight: 1.65 }}>{s.desc}</p>

                    {/* 타이머 (해당 스텝 활성 시) */}
                    {isActive && s.duration > 0 && (
                      <StepTimer seconds={s.duration} label={`${s.duration >= 60 ? Math.floor(s.duration / 60) + '분' : s.duration + '초'} 타이머`} color={guide.color} />
                    )}
                    {/* CPR 메트로놈 */}
                    {isActive && s.hasCPRTimer && <CPRMetronome />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 완료 상태 */}
          {activeStep === guide.steps.length - 1 && (
            <div style={{
              margin: '8px 32px 32px',
              padding: '18px 22px', borderRadius: 18,
              background: 'rgba(38,222,129,0.08)',
              border: '1.5px solid rgba(38,222,129,0.25)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <CheckCircle2 size={24} color="#26de81" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#26de81', marginBottom: 3 }}>모든 단계 완료</div>
                <div style={{ fontSize: 13, color: '#8da2c0' }}>처치 완료 후 원격 의료진에게 결과를 보고하세요.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getIconAnimation(type) {
  switch (type) {
    case 'pulse':   return 'stepPulse 1s ease-in-out infinite'
    case 'bounce':  return 'stepBounce 0.8s ease infinite'
    case 'breathe': return 'stepBreathe 2s ease-in-out infinite'
    case 'shake':   return 'stepShake 0.5s ease infinite'
    case 'flash':   return 'stepFlash 0.6s ease infinite'
    default:        return 'stepFadeIn 0.5s ease both'
  }
}
