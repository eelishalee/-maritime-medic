import { Timer } from 'lucide-react'
import { StepItem, SymptomTab } from '../../../components/ui'
import { CardiacIllustration, TraumaIllustration, UnconsciousIllustration, RespiratoryIllustration } from '../../../components/EmergencyIllustrations'
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

const Anim3D = ({ activeEmergencyGuide, activeStep }) => {
  const props = { step: activeStep }
  if (activeEmergencyGuide === 'CARDIAC') return <CardiacIllustration {...props} />
  if (activeEmergencyGuide === 'TRAUMA') return <TraumaIllustration {...props} />
  if (activeEmergencyGuide === 'UNCONSCIOUS') return <UnconsciousIllustration {...props} />
  if (activeEmergencyGuide === 'RESPIRATORY') return <RespiratoryIllustration {...props} />
  return <div style={{ width: 240, height: 260, background: 'rgba(255,255,255,0.03)', borderRadius: 20 }} />
}

export default function EmergencyGuide({ activeEmergencyGuide, setActiveEmergencyGuide, activeStep, setActiveStep }) {
  const GUIDES = {
    CARDIAC: {
      steps: [
        { title: '의식 확인 · 도움 요청', desc: '어깨 가볍게 두드림 · 의식 여부 확인 · 주변 도움 요청' },
        { title: '흉부 압박', desc: '100~120회/분 · 5cm 깊이 · 강하고 빠른 압박' },
        { title: 'AED 사용', desc: '자동심장충격기 도착 즉시 패드 부착 · 안내 음성 준수' },
      ],
      illustrations: [
        { color: C.info, bg: `${C.info}08`,  border: `${C.info}22`,  label: '의식 확인 가이드' },
        { color: C.info, bg: `${C.info}08`,  border: `${C.info}22`,  label: 'CPR 가이드' },
        { color: C.warning, bg: `${C.warning}08`,  border: `${C.warning}22`, label: 'AED 사용 가이드' },
      ],
    },
    TRAUMA: {
      steps: [
        { title: '출혈 부위 압박 · 지혈', desc: '거즈 또는 깨끗한 천 · 상처 강하게 압박 · 지혈 유지' },
        { title: '환부 고정 · 거상', desc: '손상 사지 심장보다 높게 유지 · 고정 및 부동화' },
        { title: '쇼크 예방 · 보온', desc: '수평 눕힘 · 보온 유지 · 음식·음료 금지' },
      ],
      illustrations: [
        { color: C.danger, bg: `${C.danger}08`,   border: `${C.danger}22`,  label: '지혈 처치 가이드' },
        { color: C.danger, bg: `${C.danger}08`,   border: `${C.danger}22`,  label: '환부 고정 가이드' },
        { color: C.sub, bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.15)',label: '쇼크 예방 가이드' },
      ],
    },
    UNCONSCIOUS: {
      steps: [
        { title: '기도 확보', desc: '머리 후굴 · 턱 거상 · 기도 개방' },
        { title: '회복 자세 유지', desc: '측와위 자세 · 기도 폐쇄 방지 · 발 거상' },
        { title: '지속 모니터링', desc: '호흡·맥박 지속 확인 · 의식 회복 여부 관찰' },
      ],
      illustrations: [
        { color: C.warning, bg: `${C.warning}08`,  border: `${C.warning}22`, label: '기도 확보 가이드' },
        { color: C.warning, bg: `${C.warning}08`,  border: `${C.warning}22`, label: '회복 자세 가이드' },
        { color: C.success, bg: `${C.success}08`,  border: `${C.success}22`, label: '모니터링 가이드' },
      ],
    },
    RESPIRATORY: {
      steps: [
        { title: '상체 거상 · 안정', desc: '좌위 또는 반좌위 유지 · 호흡 편의 확보' },
        { title: '산소 공급', desc: '산소 마스크 착용 · 10~15L/분 공급' },
        { title: '기관지 확장제 투여', desc: '천식·COPD 병력 확인 · 흡입 보조' },
      ],
      illustrations: [
        { color: C.success, bg: `${C.success}08`, border: `${C.success}22`, label: '상체 거상 가이드' },
        { color: C.success, bg: `${C.success}08`, border: `${C.success}22`, label: '산소 공급 가이드' },
        { color: C.success, bg: `${C.success}08`, border: `${C.success}22`, label: '기관지 확장제 가이드' },
      ],
    },
  }

  const guide = GUIDES[activeEmergencyGuide]
  if (!guide) return null
  const illus = guide.illustrations[activeStep - 1]
  const { color, bg, border, label } = illus

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <h2 style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-1px' }}>증상별 응급 처치 가이드</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px', background: `${C.danger}11`, borderRadius: 22, border: `1px solid ${C.danger}33`, boxShadow: `0 0 15px ${C.danger}22` }}>
          <Timer size={28} color={C.danger} />
          <span style={{ fontSize: 25, fontWeight: 900, color: C.danger, textShadow: `0 0 10px ${C.danger}66` }}>골든타임 : 42:15</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
        <SymptomTab label="흉통 / 심정지" active={activeEmergencyGuide === 'CARDIAC'} onClick={() => { setActiveEmergencyGuide('CARDIAC'); setActiveStep(1) }} />
        <SymptomTab label="중증 외상 / 출혈" active={activeEmergencyGuide === 'TRAUMA'} onClick={() => { setActiveEmergencyGuide('TRAUMA'); setActiveStep(1) }} />
        <SymptomTab label="의식 저하" active={activeEmergencyGuide === 'UNCONSCIOUS'} onClick={() => { setActiveEmergencyGuide('UNCONSCIOUS'); setActiveStep(1) }} />
        <SymptomTab label="호흡 곤란" active={activeEmergencyGuide === 'RESPIRATORY'} onClick={() => { setActiveEmergencyGuide('RESPIRATORY'); setActiveStep(1) }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 34 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {guide.steps.map((s, i) => (
            <StepItem key={i} num={i + 1} title={s.title} desc={s.desc} active={activeStep === i + 1} onClick={() => setActiveStep(i + 1)} />
          ))}
        </div>
        <div style={{ background: bg, borderRadius: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px solid ${border}`, minHeight: 340, boxShadow: `0 11px 43px ${color}11`, position: 'relative', overflow: 'hidden', padding: '34px 22px', backdropFilter: 'blur(10px)' }}>
          <Anim3D activeEmergencyGuide={activeEmergencyGuide} activeStep={activeStep} />
          <div style={{ fontSize: 20, color, fontWeight: 900, letterSpacing: '1px', marginTop: 18, textAlign: 'center', textTransform: 'uppercase' }}>{label}</div>
          {/* 장식용 코너 라인 */}
          <div style={{ position: 'absolute', top: 20, left: 20, width: 20, height: 20, borderTop: `4px solid ${color}`, borderLeft: `4px solid ${color}`, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20, width: 20, height: 20, borderBottom: `4px solid ${color}`, borderRight: `4px solid ${color}`, opacity: 0.5 }} />
        </div>
      </div>
    </div>
  )
}
