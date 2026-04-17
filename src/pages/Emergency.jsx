import { useState, useEffect, useRef } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload, Camera, Edit3 } from 'lucide-react'

const ACTION_GUIDES = {
  'CPR': {
    title: '심폐소생술 및 AED 사용',
    protocol: 'SOP-CPR-01',
    hasMetronome: true,
    steps: [
      { 
        title: '의식 및 호흡 동시 확인 (10초 이내)', 
        desc: '어깨를 두드리며 말을 걸고 가슴의 움직임(호흡)을 관찰하십시오.', 
        tip: '의식이 없고 호흡이 없거나 비정상적(꺽꺽거림)일 때만 시행합니다.' 
      },
      { title: '도움 및 AED 요청', desc: '주변 사람을 지목하여 신고를 부탁하고 AED를 가져오게 하십시오.' },
      { title: '가슴 압박 시행', desc: '가슴 중앙을 5cm 깊이로 강하고 빠르게 압박하십시오.', tip: '팔꿈치를 펴고 체중을 실어 수직으로 압박' },
      { title: 'AED 전원 켜기', desc: '도착한 AED의 전원을 켜고 기계의 음성 지시에 따르십시오.' }
    ],
    dos: ['의식과 가슴 움직임을 5~10초간 보세요', '1초당 2번 속도로 강하게 압박하세요'],
    donts: ['맥박을 잡으려고 시간을 허비하지 마세요', '의식이 있는 환자에게 압박을 하지 마세요'],
    warning: '환자가 눈을 뜨거나 움직일 때까지 절대 멈추지 마십시오.',
    color: '#ef4444'
  },
  '지혈/압박': {
    title: '출혈 부위 직접 압박',
    protocol: 'SOP-BLD-02',
    steps: [
      { title: '상처 부위 확인', desc: '옷을 자르거나 걷어내어 정확한 출혈 지점을 확인하십시오.' },
      { title: '직접 압박', desc: '멸균 거즈나 깨끗한 천으로 출혈 부위를 손바닥 전체로 누르십시오.' },
      { title: '지혈대 적용(필요시)', desc: '사지 절단 등 대량 출혈 시에만 상단 5cm 지점에 지혈대를 조이십시오.' }
    ],
    dos: ['심장보다 높은 위치로 환부를 올리세요', '압박 붕대를 감은 뒤에도 계속 관찰하세요'],
    donts: ['상처에 박힌 칼이나 유리 조각을 뽑지 마세요 (대량 출혈 위험)', '상처에 가루약이나 된장 등을 바르지 마세요'],
    warning: '지혈대 사용 시 반드시 착용 시간을 환자 몸에 기록하십시오.',
    color: '#ff3b5c'
  },
  '기도 확보': {
    title: '기도 유지 및 호흡 보조',
    protocol: 'SOP-AIR-03',
    steps: [
      { title: '기도 개방', desc: '머리를 뒤로 젖히고 턱을 들어 올려 기도를 확보하십시오.' },
      { title: '이물질 제거', desc: '입안에 눈에 보이는 이물질이 있다면 손가락으로 제거하십시오.' },
      { title: '산소 공급', desc: '산소 마스크를 밀착시키고 유량을 15L로 조절하십시오.' }
    ],
    dos: ['환자를 옆으로 눕히는 회복 자세를 취하세요', '구토 시 즉시 몸을 옆으로 돌리세요'],
    donts: ['경추 손상이 의심되면 머리를 과하게 젖히지 마세요', '의식이 없는 환자에게 물을 먹이지 마세요'],
    warning: '호흡음이 거칠거나 청색증이 보이면 즉시 CPR을 준비하십시오.',
    color: '#00d4aa'
  },
  '부목 고정': {
    title: '골절 부위 고정 및 보호',
    protocol: 'SOP-FRC-04',
    steps: [
      { title: '안정화', desc: '환자가 통증을 가장 적게 느끼는 자세로 유지시키십시오.' },
      { title: '부목 적용', desc: '나무판자나 종이박스를 이용해 관절 위아래를 고정하십시오.' },
      { title: '말단 순환 체크', desc: '고정 후 손발 끝을 눌러 혈액이 잘 통하는지 확인하십시오.' }
    ],
    dos: ['빈 공간에 옷이나 수건을 채워 흔들림을 방지하세요', '개방된 상처가 있다면 먼저 덮으세요'],
    donts: ['부러진 뼈를 억지로 맞추려 하지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
    warning: '신경 손상을 방지하기 위해 과도한 움직임은 엄금합니다.',
    color: '#38bdf8'
  },
  '상처 세척': {
    title: '환부 세척 및 감염 방지',
    protocol: 'SOP-WND-05',
    steps: [
      { title: '식염수 세척', desc: '멸균 식염수나 흐르는 물로 이물질을 충분히 씻어내십시오.' },
      { title: '거즈 드레싱', desc: '연고 없이 멸균 거즈로 덮고 반창고로 고정하십시오.' }
    ],
    dos: ['처치 전 반드시 위생 장갑을 착용하세요', '상처 주변 피부 위주로 소독하세요'],
    donts: ['얼음을 환부에 직접 대지 마세요 (동상 위험)', '물집을 억지로 터뜨리지 마세요'],
    warning: '깊은 자상은 내부 세척을 하지 말고 겉면만 보호하십시오.',
    color: '#2dd4bf'
  }
}

export default function Emergency({ patient }) {
  const [triageStep, setTriageStep] = useState('CHECK') 
  const [activeAction, setActiveAction] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [sessionLogs, setSessionLogs] = useState([])
  const [showPhotoAlert, setShowPhotoAlert] = useState(false)
  const [bpm, setBpm] = useState(110)
  const [beat, setBeat] = useState(false)

  // 수동 입력 바이탈 관리
  const [vitals, setVitals] = useState({ hr: 96, spo2: 94, bp: '158/95', temp: 37.6, rr: 24 })
  const [editingVital, setEditingVital] = useState(null) // 'bp' | 'temp'

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
    if (activeAction === 'CPR') {
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
    { label: '부르면 대답을 하나요?', desc: '언어 반응 (Verbal)', action: '부목 고정', color: '#38bdf8' },
    { label: '꼬집을 때만 반응하나요?', desc: '통증 반응 (Pain)', action: '기도 확보', color: '#00d4aa' },
    { label: '전혀 반응이 없나요?', desc: '무반응 (Unresponsive)', action: 'CPR', color: '#ef4444' },
  ]

  if (triageStep === 'CHECK') {
    return (
      <div style={{ height: 'calc(100vh - 72px)', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ fontSize: 16, color: '#ef4444', fontWeight: 950, letterSpacing: 4, marginBottom: 16 }}>CRITICAL SITUATION DECLARED</div>
        <h1 style={{ fontSize: 48, fontWeight: 950, color: '#fff', marginBottom: 60, textAlign: 'center' }}>환자의 현재 의식 수준을 판별하십시오</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1000, width: '100%' }}>
          {triageData.map((t, i) => (
            <button key={i} onClick={() => handleTriageSelect(t.action)} style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: 40, textAlign: 'left', cursor: 'pointer', transition: '0.2s'
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

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '420px 1.2fr 440px', gap: '20px', padding: '20px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* [LEFT] 법적 증빙 블랙박스 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: 24, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', marginBottom: 12 }}><Shield size={20} /><span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1 }}>LEGAL DEFENSE MODE</span></div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.5 }}>본 시스템은 의료인 부재 시 수행된 선원의 구조 활동을 실시간 기록합니다.</div>
          </div>

          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: '#00d4aa' }}><FileText size={20}/><span style={{ fontWeight: 900 }}>사고 대응 타임라인 (자동 기록)</span></div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sessionLogs.length > 0 ? sessionLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: 13, color: log.type === 'ALERT' ? '#ef4444' : '#64748b', fontWeight: 800, whiteSpace: 'nowrap' }}>[{log.time}]</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: log.type === 'ALERT' ? '#fda4af' : '#e2e8f0' }}>{log.text}</div>
                </div>
              )) : <div style={{ color: '#475569', textAlign: 'center', marginTop: 40 }}>처치 동작 수행 시 즉시 기록됩니다</div>}
            </div>
          </div>
        </section>

        {/* [CENTER] 자율 처치 통제실 */}
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

              {activeAction === 'CPR' && (
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
                  return (
                    <div key={i} onClick={() => handleStepToggle(i)} style={{ 
                      display: 'flex', gap: 20, padding: 24, borderRadius: 24, cursor: 'pointer', 
                      background: completedSteps.includes(i) ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)', 
                      border: `2px solid ${completedSteps.includes(i) ? '#38bdf8' : isFirstPending ? '#38bdf8' : 'rgba(255,255,255,0.06)'}`, 
                      transition: '0.2s', position: 'relative',
                      animation: isFirstPending ? 'step-guide-pulse 2s infinite' : 'none',
                      boxShadow: isFirstPending ? '0 0 20px rgba(56,189,248,0.2)' : 'none'
                    }}>
                      <div style={{ 
                        width: 36, height: 36, borderRadius: '50%', 
                        background: completedSteps.includes(i) ? '#38bdf8' : isFirstPending ? '#38bdf8' : 'rgba(255,255,255,0.1)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, 
                        fontWeight: 950, color: (completedSteps.includes(i) || isFirstPending) ? '#000' : '#fff',
                        fontSize: 18
                      }}>
                        {completedSteps.includes(i) ? <CheckCircle2 size={20}/> : i+1}
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 950, marginBottom: 6, color: (completedSteps.includes(i) || isFirstPending) ? '#fff' : '#94a3b8' }}>{step.title}</div>
                        <div style={{ fontSize: 16, color: completedSteps.includes(i) ? '#fff' : '#64748b', fontWeight: 600, lineHeight: 1.5 }}>{step.desc}</div>
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

        {/* [RIGHT] 정보 자산 및 기록물 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 28 }}>
             <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden' }}><img src={patient?.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 950 }}>{patient?.name}</div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 800 }}>ID: {patient?.id} | 혈액형: {patient?.blood}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <VitalMini label="심박수" value={vitals.hr} unit="BPM" color="#ef4444" icon={<HeartPulse size={14}/>} />
              <VitalMini label="산소포화도" value={vitals.spo2} unit="%" color="#38bdf8" icon={<Wind size={14}/>} />
              
              <div style={{ position: 'relative' }}>
                <VitalMini 
                  label="혈압" value={vitals.bp} unit="mmHg" color="#c084fc" icon={<Activity size={14}/>} 
                  onClick={() => setEditingVital('bp')} 
                  isManual 
                />
                {editingVital === 'bp' && (
                  <div style={{ position: 'absolute', inset: 0, background: '#1e293b', borderRadius: 16, padding: 12, display: 'flex', gap: 8, zIndex: 10 }}>
                    <input autoFocus placeholder="120/80" onBlur={e => updateVital('bp', e.target.value)} onKeyDown={e => e.key === 'Enter' && updateVital('bp', e.target.value)} style={{ width: '100%', background: 'transparent', border: '1px solid #38bdf8', color: '#fff', outline: 'none', padding: '0 8px', borderRadius: 8, fontSize: 14 }} />
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <VitalMini 
                  label="체온" value={vitals.temp} unit="°C" color="#fb923c" icon={<Thermometer size={14}/>} 
                  onClick={() => setEditingVital('temp')} 
                  isManual 
                />
                {editingVital === 'temp' && (
                  <div style={{ position: 'absolute', inset: 0, background: '#1e293b', borderRadius: 16, padding: 12, display: 'flex', gap: 8, zIndex: 10 }}>
                    <input autoFocus placeholder="36.5" type="number" step="0.1" onBlur={e => updateVital('temp', e.target.value)} onKeyDown={e => e.key === 'Enter' && updateVital('temp', e.target.value)} style={{ width: '100%', background: 'transparent', border: '1px solid #38bdf8', color: '#fff', outline: 'none', padding: '0 8px', borderRadius: 8, fontSize: 14 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* [BOTTOM] 우선순위 버튼 바 */}
        <section style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, paddingTop: 10 }}>
          {Object.keys(ACTION_GUIDES).map(key => (
            <button key={key} onClick={() => {setActiveAction(key); setCompletedSteps([])}} style={{ 
              background: activeAction === key ? `linear-gradient(135deg, ${ACTION_GUIDES[key].color}, ${ACTION_GUIDES[key].color}dd)` : 'rgba(255,255,255,0.05)', border: activeAction === key ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '28px 24px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: 18
            }} className="action-btn">
              <div style={{ color: activeAction === key ? '#000' : ACTION_GUIDES[key].color }}><ActionButtonIcon label={key} /></div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 28, fontWeight: 950, color: activeAction === key ? '#000' : '#fff', letterSpacing: '-0.5px' }}>{key}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: activeAction === key ? '#000' : '#64748b', opacity: 0.7, marginTop: 2 }}>프로토콜 활성화</div>
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
    <div 
      onClick={onClick}
      style={{ 
        background: 'rgba(255,255,255,0.02)', padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)',
        cursor: isManual ? 'pointer' : 'default', position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color, opacity: 0.9 }}>{icon}</span>
        <div style={{ fontSize: 17, color: '#94a3b8', fontWeight: 900, letterSpacing: '-0.3px' }}>{label}</div>
        {status && (
          <div style={{ 
            marginLeft: 'auto', background: `${color}15`, color, padding: '2px 8px', borderRadius: '6px', 
            fontSize: '11px', fontWeight: 950, letterSpacing: '0.5px', border: `1px solid ${color}30` 
          }}>
            {status}
          </div>
        )}
        {isManual && !status && <Edit3 size={10} color="#64748b" style={{ marginLeft: 'auto' }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 950, color }}>{value}</span>
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 800 }}>{unit}</span>
      </div>
    </div>
  )
}

function ActionButtonIcon({ label }) {
  const size = 24
  if (label === 'CPR') return <Heart size={size} />
  if (label === '지혈/압박') return <Zap size={size} />
  if (label === '기도 확보') return <Wind size={size} />
  if (label === '부목 고정') return <Shield size={size} />
  if (label === '상처 세척') return <Droplets size={size} />
  return <Info size={size} />
}
