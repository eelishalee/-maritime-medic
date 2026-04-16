import { useState, useEffect, useMemo } from 'react'
import { Brain, Heart, Activity, Zap, Shield, Cpu, HardDrive, Settings, ChevronRight, Clock, AlertCircle, CheckCircle2, Waves, Wind, ThermometerSnowflake } from 'lucide-react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Cell } from 'recharts'

// ── 데이터 엔진 (Data Engine) ──
const VITAL_HISTORY = [
  { t: '09:00', hr: 92, bp: 142, spo2: 96 },
  { t: '09:05', hr: 98, bp: 148, spo2: 95 },
  { t: '09:10', hr: 105, bp: 152, spo2: 95 },
  { t: '09:15', hr: 112, bp: 155, spo2: 94 },
  { t: '09:20', hr: 118, bp: 158, spo2: 94 }
]

const AI_DIAGNOSIS_MODELS = [
  { id: 'MD-01', name: '골절 감지 분석', confidence: 94, color: '#f87171', label: '위험' },
  { id: 'MD-02', name: '기흉 발생 위험', confidence: 61, color: '#fbbf24', label: '경고' },
  { id: 'MD-03', name: '내출혈 모니터링', confidence: 28, color: '#22d3ee', label: '관찰' }
]

const PROTOCOL_WORKFLOW = [
  { id: 1, title: '지혈 및 흉벽 압박 고정', desc: '상처 부위 노출 후 깨끗한 거즈로 직접 압박을 가하고, 탄력 붕대로 흉벽 전체를 보조 고정합니다.', img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800', note: '돌출된 뼈 파편을 직접 압박하지 않도록 주의하십시오.' },
  { id: 2, title: '쇄골 및 어깨 부목 고정', desc: '좌측 어깨와 쇄골 부위의 움직임을 최소화하기 위해 진공 부목 또는 삼각건을 이용하여 고정합니다.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', note: '손목 맥박(요골동맥)을 수시로 확인하여 순환 장애 여부를 체크하십시오.' },
  { id: 3, title: '고농도 산소 투여 (15L/min)', desc: '비재호흡 마스크를 착용시키고 산소 유량을 최대(15L)로 유지하여 저산소증을 방지합니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', note: '환자가 숨쉬기 편하도록 상체를 45도 정도 세운 자세를 유지하십시오.' },
  { id: 4, title: '긴급 통증 조절 (약물 투여)', desc: '극심한 통증 완화를 위해 케토로락 30mg을 근육 주사(IM)합니다. 투여 시간을 반드시 기록하십시오.', img: 'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800', note: '⚠ 아스피린 알레르기가 등록된 환자입니다. 아스피린 계열 절대 금기.' }
]

export default function Emergency({ patient }) {
  const [activeStep, setActiveStep] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress(p => {
        if (p >= 100) { clearInterval(timer); setTimeout(() => setIsReady(true), 400); return 100; }
        return p + 4;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#05070a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 240, height: 240 }}>
          <svg style={{ transform: 'rotate(-90deg)', width: 240, height: 240 }}>
            <circle cx="120" cy="120" r="110" stroke="rgba(192, 132, 252, 0.05)" strokeWidth="4" fill="none" />
            <circle cx="120" cy="120" r="110" stroke="#c084fc" strokeWidth="4" fill="none" strokeDasharray="690" strokeDashoffset={690 - (690 * loadProgress) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: -2 }}>{loadProgress}%</div>
            <div style={{ fontSize: 10, color: '#c084fc', fontWeight: 800, letterSpacing: 3, marginTop: -4 }}>분석 중...</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#475569', fontWeight: 600, letterSpacing: 2 }}>MDTS 정밀 분석 엔진 초기화 중</div>
          <div style={{ fontSize: 12, color: '#1e293b', marginTop: 8, fontFamily: 'monospace' }}>네트워크: 안정 | 데이터 동기화: 완료</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, height: 'calc(100vh - 72px)', background: '#05070a', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, color: '#f8fafc', fontFamily: '"Pretendard", "Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* ── 상단 내비게이션 및 상태 ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, color: '#c084fc', fontWeight: 900, letterSpacing: 4, marginBottom: 4 }}>MARITIME MEDIC</div>
            <div style={{ fontSize: 32, fontWeight: 950, background: 'linear-gradient(to right, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              정밀 <span style={{ fontWeight: 300, opacity: 0.8 }}>판독 리포트</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 6 }}>
            <SystemTag label="AI 신뢰도" value="높음" color="#22d3ee" />
            <SystemTag label="위험 수준" value="위급 (CRITICAL)" color="#f87171" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <StatusCard icon={<Wind size={14}/>} label="산소포화도" value={`${patient?.spo2 || 94}%`} color="#22d3ee" />
          <StatusCard icon={<Heart size={14}/>} label="평균 심박수" value={`${patient?.hr || 96}bpm`} color="#f87171" />
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.05)', margin: '0 8px' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 800 }}>HAESIN-07 | 원격 의료팀 연결됨</div>
          </div>
        </div>
      </header>

      {/* ── 메인 분석 그리드 ── */}
      <main style={{ display: 'grid', gridTemplateColumns: '360px 1fr 1fr 420px', gap: 16, flex: 1, minHeight: 0 }}>
        
        {/* 섹션 01: 선원 신원 및 바이탈 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="선원 신원 확인" icon={<Cpu size={16}/>} accent="#c084fc">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DataLine label="성명" value={patient?.name} />
              <DataLine label="직책" value={patient?.role} />
              <DataLine label="선원 번호" value={patient?.id} />
              <div style={{ margin: '8px 0', height: 1, background: 'rgba(255,255,255,0.03)' }} />
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 800, marginBottom: 4 }}>기저 질환</div>
              <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600, lineHeight: 1.5 }}>{patient?.chronic}</div>
              <div style={{ marginTop: 8, padding: '12px', background: 'rgba(248,113,113,0.05)', border: '1.5px solid rgba(248,113,113,0.15)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', marginBottom: 4 }}>
                  <AlertCircle size={14} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>알레르기 경고</span>
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 800 }}>아스피린 (중증 민감도)</div>
              </div>
            </div>
          </Panel>

          <Panel title="바이탈 스트리밍" icon={<Activity size={16}/>} accent="#22d3ee">
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VITAL_HISTORY}>
                  <defs>
                    <linearGradient id="vitalFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="hr" stroke="#22d3ee" fill="url(#vitalFlow)" strokeWidth={3} dot={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <MiniStat label="혈압" value={patient?.bp || '158/95'} />
              <MiniStat label="체온" value={`${patient?.temp || 37.6}°C`} />
              <MiniStat label="호흡수" value="18회/분" />
            </div>
          </Panel>
        </div>

        {/* 섹션 02: AI 정밀 진단 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="AI 진단 지능 리포트" icon={<Brain size={18}/>} accent="#c084fc" highlighted>
            <div style={{ marginTop: 12 }}>
              {AI_DIAGNOSIS_MODELS.map((model, i) => (
                <div key={i} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#475569', fontWeight: 800, letterSpacing: 1 }}>{model.id}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{model.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: model.color }}>{model.confidence}%</div>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#475569' }}>발생 확률</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${model.confidence}%`, height: '100%', background: `linear-gradient(90deg, ${model.color}, #c084fc)`, borderRadius: 3, boxShadow: `0 0 10px ${model.color}40` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: '#c084fc', fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>의학적 추론 소견</div>
                <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
                  좌측 흉부의 비정상적인 움직임과 호흡음의 좌우 불균형이 감지되었습니다. <span style={{ color: '#fff', fontWeight: 600 }}>늑골 4, 5, 6번의 전위 골절</span> 가능성이 매우 높으며, 이는 장기적으로 폐 허탈을 유발할 수 있습니다.
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* 섹션 03: 해부학적 매핑 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="해부학적 정밀 매핑" icon={<Shield size={16}/>} accent="#22d3ee">
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', borderRadius: 16 }}>
              <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" style={{ height: '90%', filter: 'grayscale(1) brightness(0.4) contrast(1.5)', opacity: 0.5 }} />
              {/* 핫스팟 */}
              <Hotspot top="22%" left="40%" color="#f87171" label="골절 부위 A" />
              <Hotspot top="46%" left="45%" color="#fbbf24" label="위험 영역 B" />
              <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 10, color: '#1e293b', fontFamily: 'monospace' }}>스캔 코드: UX-2026-99</div>
            </div>
          </Panel>
        </div>

        {/* 섹션 04: 응급 처치 워크플로우 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="응급 처치 프로토콜" icon={<Zap size={18}/>} accent="#fbbf24" highlighted>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {PROTOCOL_WORKFLOW.map((_, i) => (
                  <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: i <= activeStep ? '#fbbf24' : 'rgba(255,255,255,0.05)' }} />
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: 6 }}>단계 0{activeStep + 1}</div>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', height: 200, background: '#000', border: '1.5px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
              <img src={PROTOCOL_WORKFLOW[activeStep].img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{PROTOCOL_WORKFLOW[activeStep].title}</div>
              <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>{PROTOCOL_WORKFLOW[activeStep].desc}</div>
              <div style={{ padding: '12px 16px', background: 'rgba(192,132,252,0.05)', borderLeft: '3px solid #c084fc', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#e2e8f0' }}>
                <span style={{ fontWeight: 800, color: '#c084fc', marginRight: 8 }}>주의:</span> {PROTOCOL_WORKFLOW[activeStep].note}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} style={{ flex: 1, height: 52, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 14, cursor: 'pointer' }}>이전 단계</button>
              <button onClick={() => setActiveStep(s => Math.min(PROTOCOL_WORKFLOW.length - 1, s + 1))} style={{ flex: 2, height: 52, background: 'linear-gradient(135deg, #c084fc, #38bdf8)', border: 'none', color: '#fff', fontWeight: 950, fontSize: 14, borderRadius: 14, cursor: 'pointer', boxShadow: '0 8px 20px rgba(192, 132, 252, 0.25)' }}>다음 처치 단계</button>
            </div>
          </Panel>
        </div>

      </main>

      {/* ── 하단 내비게이션 ── */}
      <footer style={{ height: 52, display: 'flex', gap: 12 }}>
        {['환경 스캔', '바이탈 스트림', 'AI 리포트', '통신 센터', '시스템 종료'].map((btn, i) => (
          <button key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: 12, fontWeight: 900, letterSpacing: 1, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}>
            <span style={{ color: i === 4 ? '#f87171' : '#c084fc', fontSize: 10 }}>F{i+1}</span> {btn}
          </button>
        ))}
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;950&display=swap');
        @keyframes blink-glow { 0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px currentColor; } 50% { opacity: 0.4; transform: scale(0.8); box-shadow: 0 0 5px currentColor; } }
        button:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.15) !important; color: #fff !important; }
      `}</style>
    </div>
  )
}

function Panel({ title, icon, accent, children, highlighted = false }) {
  return (
    <div style={{ 
      flex: 1, 
      background: 'rgba(255,255,255,0.02)', 
      border: `1.5px solid ${highlighted ? `${accent}40` : 'rgba(255,255,255,0.05)'}`, 
      borderRadius: 20, 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      boxShadow: highlighted ? `0 0 40px ${accent}10` : 'none'
    }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '1.5px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: highlighted ? 0.6 : 0.2 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ color: accent, display: 'flex', alignItems: 'center' }}>{icon}</div>
        <div style={{ fontSize: 12, fontWeight: 950, color: accent, letterSpacing: 2, textTransform: 'uppercase' }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

function SystemTag({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
      <span style={{ fontSize: 9, color: '#475569', fontWeight: 900, letterSpacing: 1 }}>{label}</span>
      <span style={{ fontSize: 11, color, fontWeight: 950 }}>{value}</span>
    </div>
  )
}

function StatusCard({ icon, label, value, color }) {
  return (
    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.01)', padding: '4px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ color, opacity: 0.8 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 950, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}

function DataLine({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: '#475569', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#fff', fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#475569', fontWeight: 900, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{value}</div>
    </div>
  )
}

function Hotspot({ top, left, color, label }) {
  return (
    <div style={{ position: 'absolute', top, left, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, animation: 'blink-glow 1.5s infinite', color }} />
      <div style={{ marginTop: 4, fontSize: 9, color, fontWeight: 900, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{label}</div>
    </div>
  )
}
