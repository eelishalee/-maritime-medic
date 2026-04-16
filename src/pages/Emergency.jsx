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
  { id: 'MD-01', name: 'Fracture Detection', confidence: 94, color: '#f87171', label: 'CRITICAL' },
  { id: 'MD-02', name: 'Pneumothorax Risk', confidence: 61, color: '#fbbf24', label: 'WARNING' },
  { id: 'MD-03', name: 'Internal Bleeding', confidence: 28, color: '#22d3ee', label: 'MONITOR' }
]

const PROTOCOL_WORKFLOW = [
  { id: 1, title: 'Hemostatic Compression', desc: '의복 제거 후 환부 직접 압박 및 탄력 붕대로 흉벽을 고정합니다.', img: 'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800', note: '뼈 파편 직접 압박 절대 금지' },
  { id: 2, title: 'Shoulder Splinting', desc: '쇄골 및 어깨 관절을 포함하여 진공 부목 고정을 시행합니다.', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', note: '말단 순환(Radial Pulse) 상시 확인' },
  { id: 3, title: 'Oxygen Titration', desc: '비재호흡 마스크를 통해 고농도 산소(15L/min)를 공급합니다.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', note: '반좌위 자세(Fowler position) 유지' },
  { id: 4, title: 'Analgesic Administration', desc: '통증 조절을 위한 약물(케토로락 30mg) 근육 주사를 실시합니다.', img: 'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800', note: '⚠ 아스피린 투여 시 아나필락시스 위험' }
]

export default function Emergency({ patient }) {
  const [activeStep, setActiveStep] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // 시스템 초기화 시뮬레이션
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
            <div style={{ fontSize: 10, color: '#c084fc', fontWeight: 800, letterSpacing: 3, marginTop: -4 }}>ANALYZING...</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#475569', fontWeight: 600, letterSpacing: 2 }}>MDTS ULTIMATE ENGINE INITIALIZING</div>
          <div style={{ fontSize: 12, color: '#1e293b', marginTop: 8, fontFamily: 'monospace' }}>SECURE_LINK: STABLE | DATA_BUFFER: SYNCED</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, height: 'calc(100vh - 72px)', background: '#05070a', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* ── TOP NAVIGATION & STATUS ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, color: '#c084fc', fontWeight: 900, letterSpacing: 4, marginBottom: 4 }}>MARITIME MEDIC</div>
            <div style={{ fontSize: 32, fontWeight: 950, background: 'linear-gradient(to right, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ULTIMATE <span style={{ fontWeight: 300, opacity: 0.8 }}>ANALYSIS</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 6 }}>
            <SystemTag label="AI CONFIDENCE" value="HIGH" color="#22d3ee" />
            <SystemTag label="RISK LEVEL" value="CRITICAL" color="#f87171" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <StatusCard icon={<Wind size={14}/>} label="O2 SAT" value={`${patient?.spo2 || 94}%`} color="#22d3ee" />
          <StatusCard icon={<Heart size={14}/>} label="HR AVG" value={`${patient?.hr || 96}bpm`} color="#f87171" />
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.05)', margin: '0 8px' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 800 }}>HAESIN-07 | BRIDGE_LINK_ACTIVE</div>
          </div>
        </div>
      </header>

      {/* ── MAIN ANALYTICAL GRID ── */}
      <main style={{ display: 'grid', gridTemplateColumns: '360px 1fr 1fr 420px', gap: 16, flex: 1, minHeight: 0 }}>
        
        {/* SECTION 01: Crew Identity & Biometrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Crew Identity" icon={<Cpu size={16}/>} accent="#c084fc">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DataLine label="FULL NAME" value={patient?.name} />
              <DataLine label="DESIGNATION" value={patient?.role} />
              <DataLine label="SERVICE ID" value={patient?.id} />
              <div style={{ margin: '8px 0', height: 1, background: 'rgba(255,255,255,0.03)' }} />
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 800, marginBottom: 4 }}>CHRONIC CONDITIONS</div>
              <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600, lineHeight: 1.5 }}>{patient?.chronic}</div>
              <div style={{ marginTop: 8, padding: '12px', background: 'rgba(248,113,113,0.05)', border: '1.5px solid rgba(248,113,113,0.15)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', marginBottom: 4 }}>
                  <AlertCircle size={14} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>ALLERGY WARNING</span>
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 800 }}>ASPIRIN (High Sensitivity)</div>
              </div>
            </div>
          </Panel>

          <Panel title="Vital Streaming" icon={<Activity size={16}/>} accent="#22d3ee">
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
              <MiniStat label="BP" value={patient?.bp || '158/95'} />
              <MiniStat label="TEMP" value={`${patient?.temp || 37.6}°C`} />
              <MiniStat label="RR" value="18/min" />
            </div>
          </Panel>
        </div>

        {/* SECTION 02: AI Deep Diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="Diagnostic Intelligence" icon={<Brain size={18}/>} accent="#c084fc" highlighted>
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
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#475569' }}>PROBABILITY</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${model.confidence}%`, height: '100%', background: `linear-gradient(90deg, ${model.color}, #c084fc)`, borderRadius: 3, boxShadow: `0 0 10px ${model.color}40` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: '#c084fc', fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>CLINICAL REASONING</div>
                <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
                  좌측 흉부의 비정상적인 움직임과 호흡음의 좌우 불균형이 감지되었습니다. <span style={{ color: '#fff', fontWeight: 600 }}>늑골 4, 5, 6번의 전위 골절</span> 가능성이 매우 높으며, 이는 장기적으로 폐 허탈을 유발할 수 있습니다.
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* SECTION 03: Anatomical Mapping */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="Anatomical Precision" icon={<Shield size={16}/>} accent="#22d3ee">
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', borderRadius: 16 }}>
              <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" style={{ height: '90%', filter: 'grayscale(1) brightness(0.4) contrast(1.5)', opacity: 0.5 }} />
              {/* Hotspots */}
              <Hotspot top="22%" left="40%" color="#f87171" label="Fracture A" />
              <Hotspot top="46%" left="45%" color="#fbbf24" label="Risk Zone B" />
              <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 10, color: '#1e293b', fontFamily: 'monospace' }}>SCAN_ID: UX-2026-99</div>
            </div>
          </Panel>
        </div>

        {/* SECTION 04: Treatment Workflow */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel title="Treatment Workflow" icon={<Zap size={18}/>} accent="#fbbf24" highlighted>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {PROTOCOL_WORKFLOW.map((_, i) => (
                  <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: i <= activeStep ? '#fbbf24' : 'rgba(255,255,255,0.05)' }} />
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: 6 }}>STEP 0{activeStep + 1}</div>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', height: 200, background: '#000', border: '1.5px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
              <img src={PROTOCOL_WORKFLOW[activeStep].img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{PROTOCOL_WORKFLOW[activeStep].title}</div>
              <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>{PROTOCOL_WORKFLOW[activeStep].desc}</div>
              <div style={{ padding: '12px 16px', background: 'rgba(192,132,252,0.05)', borderLeft: '3px solid #c084fc', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#e2e8f0' }}>
                <span style={{ fontWeight: 800, color: '#c084fc', marginRight: 8 }}>NOTE:</span> {PROTOCOL_WORKFLOW[activeStep].note}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} style={{ flex: 1, height: 52, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 14, cursor: 'pointer' }}>PREVIOUS</button>
              <button onClick={() => setActiveStep(s => Math.min(PROTOCOL_WORKFLOW.length - 1, s + 1))} style={{ flex: 2, height: 52, background: 'linear-gradient(135deg, #c084fc, #38bdf8)', border: 'none', color: '#fff', fontWeight: 950, fontSize: 14, borderRadius: 14, cursor: 'pointer', boxShadow: '0 8px 20px rgba(192, 132, 252, 0.25)' }}>NEXT PROTOCOL</button>
            </div>
          </Panel>
        </div>

      </main>

      {/* ── FOOTER NAVIGATION ── */}
      <footer style={{ height: 52, display: 'flex', gap: 12 }}>
        {['SCAN_ENV', 'BIO_STREAMS', 'AI_REPORTS', 'COMM_CENTER', 'TERMINATE'].map((btn, i) => (
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
