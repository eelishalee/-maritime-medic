import { useState } from 'react'
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'

const TABS = [
  { id: 'cpr', label: '심폐소생술 (CPR)', icon: '🫀', color: '#ff4d6d' },
  { id: 'bleed', label: '지혈 처치', icon: '🩸', color: '#ff9f43' },
  { id: 'shock', label: '쇼크 대응', icon: '⚡', color: '#a55eea' },
  { id: 'fracture', label: '골절 및 고정', icon: '🦴', color: '#4fc3f7' },
  { id: 'burn', label: '화상 처치', icon: '🔥', color: '#ff9f43' },
]

const GUIDES = {
  cpr: {
    title: '심폐소생술(CPR) 표준 처치',
    steps: [
      { title: '의식 확인 및 도움 요청', desc: '환자의 어깨를 두드리며 "괜찮으세요?"라고 묻고, 119 신고 및 AED 확보를 주변에 요청합니다.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { title: '강력하고 빠른 가슴 압박', desc: '흉골 아래쪽 1/2 지점에 깍지 낀 두 손을 대고, 분당 100~120회 속도로 5~6cm 깊이로 강하게 압박합니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
      { title: '인공호흡 2회 실시', desc: '기도를 확보한 상태에서 코를 막고 환자의 입에 숨을 1초 동안 2회 불어넣습니다. (가슴 상승 확인)', img: 'https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  bleed: {
    title: '외상 및 대출혈 지혈',
    steps: [
      { title: '직접 압박 지혈', desc: '깨끗한 거즈를 상처에 대고 손바닥 전체로 강하게 압박합니다.', img: 'https://images.unsplash.com/photo-1603398938378-e54ecb44638c?auto=format&fit=crop&q=80&w=800' },
      { title: '지혈대(Tourniquet) 적용', desc: '직접 압박으로 지혈되지 않는 대출혈 시 상처 5~7cm 위쪽에 지혈대를 단단히 조입니다.', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800' },
      { title: '상처 부위 거상', desc: '출혈 부위를 심장보다 높게 유지하여 혈압을 낮추고 출혈 속도를 늦춥니다.', img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  shock: {
    title: '쇼크 예방 및 응급 처치',
    steps: [
      { title: '환자 안정 및 수평 유지', desc: '환자를 편안하게 눕히고 다리를 심장보다 20-30cm 높게 들어올려 뇌로 가는 혈류를 돕습니다.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { title: '보온 유지', desc: '담요나 옷으로 환자를 덮어 체온 손실을 막고 저체온증을 예방합니다.', img: 'https://images.unsplash.com/photo-1581594650039-362f30e7c06d?auto=format&fit=crop&q=80&w=800' },
      { title: '지속적인 관찰', desc: '의료진이 도착할 때까지 환자의 의식과 호흡 상태를 1분 단위로 체크합니다.', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  fracture: {
    title: '골절 및 탈구 고정',
    steps: [
      { title: '손상 부위 부목 고정', desc: '골절 부위의 위아래 관절이 움직이지 않도록 충분히 긴 부목을 대고 고정합니다.', img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800' },
      { title: '냉찜질 실시', desc: '부기와 통증을 줄이기 위해 부목 고정 후 얼음주머니로 냉찜질을 시행합니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
      { title: '말단 순환 확인', desc: '고정 후 손톱/발톱을 눌러 혈액순환이 잘 되는지, 감각이 있는지 확인합니다.', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  burn: {
    title: '화상 긴급 냉각 및 보호',
    steps: [
      { title: '흐르는 물에 냉각', desc: '화상 부위를 15~20도의 흐르는 찬물에 15분 이상 충분히 노출시켜 열기를 식힙니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
      { title: '의복 및 장신구 제거', desc: '피부가 붓기 전 반지, 시계 등을 신속히 제거하되 피부에 붙은 옷은 억지로 떼지 않습니다.', img: 'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800' },
      { title: '멸균 드레싱 보호', desc: '상처 부위를 깨끗한 거즈로 느슨하게 덮고 물집은 절대로 터뜨리지 않습니다.', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800' },
    ]
  }
}

export default function Emergency() {
  const [activeTab, setActiveTab] = useState('cpr')
  const [activeStep, setActiveStep] = useState(0)
  const guide = GUIDES[activeTab]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 46px)', overflow: 'hidden', background: '#050d1a' }}>
      <div style={{ display: 'flex', gap: 10, padding: '15px 30px', background: 'rgba(10,22,40,0.95)', borderBottom: '1.5px solid rgba(13,217,197,0.15)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveStep(0); }} style={{
            padding: '12px 24px', borderRadius: 12, border: '2.5px solid',
            borderColor: activeTab === t.id ? t.color : 'rgba(255,255,255,0.05)',
            background: activeTab === t.id ? `${t.color}20` : 'rgba(255,255,255,0.02)',
            color: activeTab === t.id ? '#fff' : '#8da2c0',
            fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
          }}><span>{t.icon}</span> {t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '550px 1fr', overflow: 'hidden' }}>
        {/* 왼쪽: 실사풍 액션 이미지 패널 */}
        <div style={{ borderRight: '1.5px solid rgba(13,217,197,0.15)', display: 'flex', flexDirection: 'column', padding: '40px', background: 'rgba(15,32,64,0.3)' }}>
          <div style={{ padding: '15px', borderRadius: 16, background: 'rgba(13,217,197,0.08)', border: '1px solid rgba(13,217,197,0.2)', marginBottom: 25, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: '#0dd9c5', fontWeight: 800 }}>STEP {activeStep + 1} 처치 실습 이미지</div>
          </div>
          
          <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }}>
            <img src={guide.steps[activeStep].img} alt="Action" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '25px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{guide.steps[activeStep].title}</div>
            </div>
          </div>
          <div style={{ marginTop: 25, padding: '15px', borderRadius: 12, background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.1)', color: '#ff4d6d', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={18}/> <span>정확한 동작으로 시행하여 주십시오.</span>
          </div>
        </div>

        {/* 오른쪽: 정적 리스트 (움직임 제거) */}
        <div style={{ padding: '50px', overflowY: 'auto', background: 'linear-gradient(135deg, #050d1a, #0a1628)' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 15 }}>
            <ShieldAlert size={36} color="#ff4d6d" /> {guide.title}
          </div>
          
          <div style={{ position: 'relative', marginLeft: '30px' }}>
            <div style={{ position: 'absolute', left: 31, top: 0, bottom: 0, width: 4, background: 'rgba(13,217,197,0.1)' }} />
            {guide.steps.map((step, i) => (
              <div key={i} onMouseEnter={() => setActiveStep(i)} onClick={() => setActiveStep(i)} style={{ display: 'flex', gap: 40, marginBottom: 45, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 66, height: 66, borderRadius: '50%', background: activeStep === i ? '#0dd9c5' : '#0a1628', border: `4px solid ${activeStep === i ? '#fff' : '#0dd9c5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: activeStep === i ? '#050d1a' : '#0dd9c5', zIndex: 2, boxShadow: activeStep === i ? '0 0 30px rgba(13,217,197,0.4)' : 'none' }}>{i + 1}</div>
                <div style={{ flex: 1, background: activeStep === i ? 'rgba(13,217,197,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeStep === i ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: activeStep === i ? '#fff' : '#8da2c0' }}>{step.title}</div>
                    {activeStep === i && <CheckCircle2 size={24} color="#0dd9c5" style={{ marginLeft: 'auto' }} />}
                  </div>
                  <div style={{ fontSize: 18, color: activeStep === i ? '#e8f0fe' : '#4a6080', lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
