import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, CheckCircle2, Heart, Droplets, Thermometer, Activity, Zap, Shield, ChevronRight, RotateCcw, ChevronLeft, Info, Pill, Clock, Cpu, HardDrive, Settings } from 'lucide-react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts'

// ── 데이터 정의 ──
const TREND_DATA = [
  { t: '09:00', hr: 92, bp: 142 }, { t: '09:05', hr: 98, bp: 148 }, { t: '09:10', hr: 105, bp: 152 }, { t: '09:15', hr: 112, bp: 155 }, { t: '09:20', hr: 118, bp: 158 }
]

const DIAGNOSES = [
  { confidence: 94, title: '다발성 늑골 및 쇄골 골절', status: 'CRITICAL', color: '#ef4444', desc: '좌측 흉벽 전위 골절 확인. 폐 실질 손상에 따른 외상성 기흉 진행 가능성 높음. 즉시 고정 필요.' },
  { confidence: 61, title: '외상성 기흉 (진행 중)', status: 'WARNING', color: '#fbbf24', desc: '호흡음 감소 및 산소포화도 저하 추이 관찰됨. 폐 허탈 방지 조치 요망.' }
]

const ACTION_STEPS = [
  { title: '환부 노출 및 흉벽 고정', desc: '의복 제거 후 탄력 붕대로 흉벽을 고정합니다.', img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800', tip: '뼈 파편 직접 압박 금지' },
  { title: '쇄골 부목(Splint) 적용', desc: '어깨 관절을 포함하여 부목 고정을 시행합니다.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', tip: '말단 순환 상시 확인' },
  { title: '산소 공급 (15L/min)', desc: '산소 마스크를 통해 고농도 산소를 공급합니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', tip: '반좌위 자세(45도) 유지' },
  { title: '긴급 약물(케토로락) 투여', desc: '통증 조절을 위한 약물 근주를 실시합니다.', img: 'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800', tip: '⚠ 아스피린 절대 금기' }
]

export default function Emergency({ patient }) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsFinished(true)
          return 100
        }
        return prev + 5
      })
    }, 30)
    return () => clearInterval(timer)
  }, [])

  if (!isFinished) {
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#0a0e1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: '#38bdf8', letterSpacing: 4, marginBottom: 20, fontWeight: 800 }}>INITIALIZING MDTS SYSTEM...</div>
        <div style={{ width: 300, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#38bdf8', transition: '0.1s linear' }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>LOADING BIOMETRIC DATA... {progress}%</div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, height: 'calc(100vh - 72px)', background: '#0a0e1a', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, color: '#e2e8f0', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            MDTS <span style={{ color: '#f97316', fontSize: 14, fontWeight: 400 }}>EZ MODE</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Version : MM-V2.40 (2026-04-16)</div>
        </div>
        
        <div style={{ display: 'flex', gap: 16 }}>
          <StatusBadge label="CPU TEMP" value="52.5 °C" color="#ef4444" />
          <StatusBadge label="O2 LEVEL" value="92.0 %" color="#3b82f6" />
          <StatusBadge label="VITAL VOLT" value="1.008 V" color="#fbbf24" />
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{new Date().toLocaleDateString('ko-KR')}</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 1fr 380px', gap: 12, flex: 1, minHeight: 0 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={<Cpu size={14}/>} title="선원 인적 정보" color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: 4, flex: 1 }}>
            <InfoRow label="NAME" value={patient?.name} color="#fff" />
            <InfoRow label="ROLE" value={patient?.role} color="#fff" />
            <InfoRow label="ID" value={patient?.id} color="#fff" />
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>기저 질환</div>
            <div style={{ fontSize: 13, color: '#fbbf24', lineHeight: 1.4 }}>{patient?.chronic}</div>
            <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 800, marginTop: 12 }}>⚠ 알레르기 : 아스피린</div>
          </div>

          <SectionTitle icon={<HardDrive size={14}/>} title="바이탈 정밀 추이" color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px', borderRadius: 4, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <XAxis dataKey="t" hide />
                <YAxis hide domain={[60, 130]} />
                <Area type="monotone" dataKey="hr" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={<Brain size={14}/>} title="AI 정밀 판독 결과" color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: 4, flex: 1 }}>
            {DIAGNOSES.map((d, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: d.color }}>{d.title}</span>
                  <span style={{ fontSize: 11, color: '#fff' }}>{d.confidence}%</span>
                </div>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${d.confidence}%`, height: '100%', background: d.color }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>의학적 세부 소견</div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
              {DIAGNOSES[0].desc}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={<Shield size={14}/>} title="정밀 해부학적 맵" color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" style={{ height: '90%', filter: 'grayscale(1) brightness(0.5)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '22%', left: '40%', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 15px #ef4444', animation: 'blink 1s infinite' }} />
            <div style={{ position: 'absolute', top: '46%', left: '45%', width: 16, height: 16, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 20px #ef4444', animation: 'blink 1.5s infinite' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle icon={<Settings size={14}/>} title="응급 처치 프로토콜" color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>STEP {activeStep + 1} OF {ACTION_STEPS.length}</div>
            <div style={{ borderRadius: 4, overflow: 'hidden', height: 140, background: '#fff' }}>
              <img src={ACTION_STEPS[activeStep].img} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{ACTION_STEPS[activeStep].title}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>{ACTION_STEPS[activeStep].desc}</div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} style={{ flex: 1, height: 36, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 12, cursor: 'pointer' }}>PREV</button>
              <button onClick={() => setActiveStep(prev => Math.min(ACTION_STEPS.length - 1, prev + 1))} style={{ flex: 2, height: 36, background: '#f97316', border: 'none', color: '#fff', fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>NEXT STEP</button>
            </div>
          </div>
        </div>

      </div>

      <div style={{ height: 40, display: 'flex', gap: 8 }}>
        {['Scan', 'Bio-Link', 'Reports', 'Settings', 'Exit'].map((btn, i) => (
          <button key={i} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            <span style={{ color: '#fbbf24' }}>F{i+1}</span> {btn}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}

function StatusBadge({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 4, display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>{label}</div>
      <div style={{ fontSize: 14, color, fontWeight: 900 }}>{value}</div>
    </div>
  )
}

function SectionTitle({ icon, title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 900, color, letterSpacing: 1 }}>{title.toUpperCase()}</div>
    </div>
  )
}

function InfoRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}
