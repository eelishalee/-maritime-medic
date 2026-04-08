import { useState, useEffect, useRef } from 'react'
import { ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Zap, Clock } from 'lucide-react'

const TABS = [
  { id:'cpr',      label:'심폐소생술',  icon:'🫀', color:'#ff4d6d', urgency:'critical' },
  { id:'cardiac',  label:'심근경색',    icon:'💓', color:'#ff4d6d', urgency:'critical' },
  { id:'bleed',    label:'지혈 처치',   icon:'🩸', color:'#ff9f43', urgency:'high' },
  { id:'shock',    label:'쇼크 대응',   icon:'⚡', color:'#a55eea', urgency:'high' },
  { id:'fracture', label:'골절 고정',   icon:'🦴', color:'#4fc3f7', urgency:'medium' },
  { id:'burn',     label:'화상 처치',   icon:'🔥', color:'#ff9f43', urgency:'medium' },
]

const GUIDES = {
  cpr: {
    title:'심폐소생술(CPR) 표준 처치',
    color:'#ff4d6d',
    desc:'의식·호흡 없을 때 즉시 시행. 골든타임 4분.',
    steps:[
      { title:'의식 확인 및 도움 요청', icon:'🔍', anim:'stepBounce', color:'#ff4d6d',
        desc:'어깨를 두드리며 "괜찮으세요?" 반응 없으면 즉시 119 신고 및 AED 확보 요청.',
        img:'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        tip:'큰 소리로 "사람 쓰러졌어요! AED 가져오세요!"', dur:0 },
      { title:'가슴 압박 30회', icon:'💪', anim:'stepPulse', color:'#ff4d6d',
        desc:'흉골 아래 1/2 지점, 두 손 깍지. 분당 100~120회, 5~6cm 깊이 압박.',
        img:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        tip:'팔꿈치 펴고 체중 실어 압박. "하나, 둘, 셋..." 세며 시행', dur:0, hasCPR:true },
      { title:'인공호흡 2회', icon:'💨', anim:'stepBreathe', color:'#ff9f43',
        desc:'기도 확보 후 코 막고 입에 1초씩 2회 불어넣기. 가슴 상승 확인.',
        img:'https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=800',
        tip:'과호흡 금지. 가슴이 올라오는지 반드시 확인.', dur:0 },
      { title:'AED 부착 및 작동', icon:'⚡', anim:'stepFlash', color:'#ff4d6d',
        desc:'AED 전원 ON → 음성 안내 따라 패드 부착 → 분석 중·충격 시 손 떼기.',
        img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        tip:'패드1: 오른쪽 쇄골 아래 / 패드2: 왼쪽 겨드랑이 아래', dur:0 },
    ],
  },
  cardiac: {
    title:'급성 심근경색 응급 처치',
    color:'#ff4d6d',
    desc:'흉통·호흡곤란·식은땀 등 증상 시 즉시 시행.',
    steps:[
      { title:'활동 중단 및 안정', icon:'🛏', anim:'fadeInUp', color:'#ff4d6d',
        desc:'즉시 앉히거나 눕히고 모든 신체활동 중단. 옷깃 느슨하게.',
        img:'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        tip:'반좌위(45도) 자세가 심장 부담 최소화에 적합', dur:0 },
      { title:'아스피린 투여 확인', icon:'💊', anim:'stepShake', color:'#ff9f43',
        desc:'아스피린 알레르기 없는 경우 300mg 씹어 복용. 알레르기 있으면 클로피도그렐 75mg.',
        img:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        tip:'⚠ 현재 환자 아스피린 알레르기 — 투여 금지!', tipColor:'#ff4d6d', dur:0 },
      { title:'12유도 심전도 측정', icon:'📊', anim:'stepPulse', color:'#0dd9c5',
        desc:'심전도 기기 연결 후 측정. 결과 즉시 원격의료팀에 전송.',
        img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        tip:'전극 부착: 흉부 6곳 + 사지 4곳', dur:0 },
      { title:'원격 의료진 연결', icon:'📡', anim:'stepFlash', color:'#0dd9c5',
        desc:'위성통신으로 원격의료센터 연결, 바이탈·심전도·증상 발현 시간 보고.',
        img:'https://images.unsplash.com/photo-1603398938378-e54ecb44638c?auto=format&fit=crop&q=80&w=800',
        tip:'골든타임: 증상 발생 후 90분 이내 혈관 재개통 필요', dur:0 },
    ],
  },
  bleed: {
    title:'외상 및 대출혈 지혈',
    color:'#ff9f43',
    desc:'대량 출혈 시 수 분 내 쇼크 발생. 신속한 지혈이 생명.',
    steps:[
      { title:'직접 압박 지혈', icon:'✋', anim:'stepPulse', color:'#ff9f43',
        desc:'깨끗한 거즈로 상처 강하게 압박. 거즈 젖어도 제거 말고 위에 덧댐.',
        img:'https://images.unsplash.com/photo-1603398938378-e54ecb44638c?auto=format&fit=crop&q=80&w=800',
        tip:'최소 10분 이상 압박 유지. 손 떼면 출혈 재발.', dur:600, timerLabel:'압박 유지 타이머' },
      { title:'지혈대 적용', icon:'⏱', anim:'stepShake', color:'#ff4d6d',
        desc:'압박으로 지혈 안 되는 팔다리 대출혈: 상처 5~7cm 위 지혈대 단단히 조임.',
        img:'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        tip:'적용 시각 기록 필수. 2시간 이상 유지 금지.', dur:0 },
      { title:'상처 부위 거상', icon:'⬆', anim:'stepBounce', color:'#ff9f43',
        desc:'출혈 부위를 심장보다 높게 유지해 혈압 낮추고 출혈 속도 감소.',
        img:'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800',
        tip:'골절 의심 시 부목 고정 후 거상.', dur:0 },
    ],
  },
  shock: {
    title:'쇼크 예방 및 응급 처치',
    color:'#a55eea',
    desc:'피부 창백·냉습, 의식저하, 맥박 약화 시 쇼크 의심.',
    steps:[
      { title:'환자 수평 유지', icon:'🛏', anim:'fadeInUp', color:'#a55eea',
        desc:'편안하게 눕히고 다리를 심장보다 20~30cm 높게 올려 뇌 혈류 증가.',
        img:'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        tip:'의식 없으면 회복 자세(옆으로 눕히기).', dur:0 },
      { title:'보온 유지', icon:'🌡', anim:'stepBreathe', color:'#a55eea',
        desc:'담요나 옷으로 덮어 체온 손실 방지. 저체온증 예방.',
        img:'https://images.unsplash.com/photo-1581594650039-362f30e7c06d?auto=format&fit=crop&q=80&w=800',
        tip:'차가운 바닥에 직접 눕히지 마세요.', dur:0 },
      { title:'바이탈 지속 관찰', icon:'📋', anim:'stepPulse', color:'#a55eea',
        desc:'의식, 호흡, 맥박을 1분 단위로 체크 및 기록. 이상 시 즉시 보고.',
        img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        tip:'변화 발생 즉시 원격의료팀 보고.', dur:0 },
    ],
  },
  fracture: {
    title:'골절 및 탈구 고정',
    color:'#4fc3f7',
    desc:'골절 의심 시 함부로 움직이지 말고 즉시 고정.',
    steps:[
      { title:'부목 고정', icon:'🔧', anim:'fadeInUp', color:'#4fc3f7',
        desc:'골절 위아래 관절 모두 고정되도록 충분히 긴 부목. 붕대로 단단히.',
        img:'https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800',
        tip:'부목 없으면 판자·우산 등 단단한 물건으로 대체.', dur:0 },
      { title:'냉찜질 실시', icon:'🧊', anim:'stepBreathe', color:'#4fc3f7',
        desc:'부목 고정 후 얼음주머니로 냉찜질. 부기와 통증 감소.',
        img:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        tip:'얼음 직접 접촉 금지. 수건으로 감싸 사용.', dur:1200, timerLabel:'냉찜질 타이머 (20분)' },
      { title:'말단 순환 확인', icon:'🩺', anim:'stepPulse', color:'#4fc3f7',
        desc:'손톱·발톱 눌러 혈액순환, 감각 확인. 2초 내 혈색 회복되면 정상.',
        img:'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        tip:'저림·마비 증상 있으면 즉시 원격진료 연결.', dur:0 },
    ],
  },
  burn: {
    title:'화상 긴급 냉각 및 보호',
    color:'#ff9f43',
    desc:'즉각적인 냉각이 조직 손상 최소화.',
    steps:[
      { title:'흐르는 물로 냉각', icon:'💧', anim:'stepBreathe', color:'#4fc3f7',
        desc:'15~20°C 흐르는 물에 15분 이상 노출. 열기 완전히 식히기.',
        img:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        tip:'얼음물 사용 금지. 저체온증 유발 위험.', dur:900, timerLabel:'냉각 타이머 (15분)' },
      { title:'의복·장신구 제거', icon:'💍', anim:'stepShake', color:'#ff9f43',
        desc:'붓기 전에 반지·시계 신속 제거. 피부에 붙은 옷은 억지로 떼지 않음.',
        img:'https://images.unsplash.com/photo-1581056310664-3d4d74630aa9?auto=format&fit=crop&q=80&w=800',
        tip:'무리하게 당기면 피부 함께 벗겨짐.', dur:0 },
      { title:'멸균 드레싱 보호', icon:'🩹', anim:'fadeInUp', color:'#ff9f43',
        desc:'깨끗한 거즈로 느슨하게 덮기. 물집 절대 터뜨리지 않음.',
        img:'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
        tip:'연고·치약 도포 금지. 감염 유발.', dur:0 },
    ],
  },
}

function getRecommended(patient) {
  if (!patient) return null
  const c = (patient.chronic||'').toLowerCase()
  if (c.includes('고혈압') || (patient.hr && patient.hr > 90)) return 'cardiac'
  return null
}

// ── CPR 메트로놈 ──
function CPRMetronome() {
  const [on, setOn]     = useState(false)
  const [beat, setBeat] = useState(false)
  const [cnt, setCnt]   = useState(0)
  const ref = useRef(null)
  const toggle = () => {
    if (on) { clearInterval(ref.current); setOn(false) }
    else {
      setOn(true); let c=0
      ref.current = setInterval(()=>{ setBeat(b=>!b); setCnt(++c) }, 500)
    }
  }
  useEffect(()=>()=>clearInterval(ref.current),[])
  return (
    <div style={{ marginTop:12, padding:'12px 14px', borderRadius:12, background:'rgba(255,77,109,0.08)', border:`1.5px solid ${on?'#ff4d6d':'rgba(255,77,109,0.25)'}`, display:'flex', alignItems:'center', gap:12 }}>
      <button onClick={toggle} style={{ width:38, height:38, borderRadius:10, background:on?'#ff4d6d':'rgba(255,77,109,0.18)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:on?'#fff':'#ff4d6d' }}>
        {on ? <Pause size={16}/> : <Play size={16}/>}
      </button>
      <div>
        <div style={{ fontSize:11, fontWeight:800, color:'#ff4d6d' }}>CPR 메트로놈 · 120bpm</div>
        <div style={{ fontSize:10, color:'#8da2c0' }}>{on ? `압박 횟수: ${cnt}` : '시작하면 리듬을 안내합니다'}</div>
      </div>
      {on && <div style={{ marginLeft:'auto', width:16, height:16, borderRadius:'50%', background:beat?'#ff4d6d':'rgba(255,77,109,0.2)', transition:'all 0.05s', boxShadow:beat?'0 0 10px #ff4d6d':'none' }}/>}
    </div>
  )
}

// ── 단계 타이머 ──
function StepTimer({ seconds, label, color }) {
  const [rem, setRem]   = useState(seconds)
  const [run, setRun]   = useState(false)
  const ref = useRef(null)
  useEffect(()=>{ setRem(seconds); setRun(false); clearInterval(ref.current) },[seconds])
  const toggle = () => {
    if (run) { clearInterval(ref.current); setRun(false) }
    else {
      setRun(true)
      ref.current = setInterval(()=>setRem(r=>{ if(r<=1){clearInterval(ref.current);setRun(false);return 0} return r-1 }),1000)
    }
  }
  const reset = () => { clearInterval(ref.current); setRun(false); setRem(seconds) }
  useEffect(()=>()=>clearInterval(ref.current),[])
  const m = Math.floor(rem/60), s = rem%60
  const pct = (seconds-rem)/seconds*100
  return (
    <div style={{ marginTop:12, padding:'12px 14px', borderRadius:12, background:`${color}0c`, border:`1.5px solid ${color}30` }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
        <Clock size={13} color={color}/>
        <span style={{ fontSize:11, fontWeight:800, color }}>{label}</span>
        <span style={{ marginLeft:'auto', fontSize:20, fontWeight:900, color, fontVariantNumeric:'tabular-nums' }}>{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>
      </div>
      <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden', marginBottom:10 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.5s' }}/>
      </div>
      <div style={{ display:'flex', gap:7 }}>
        <button onClick={toggle} style={{ flex:1, padding:'7px', borderRadius:8, background:run?`${color}25`:`${color}15`, border:`1px solid ${color}35`, color, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
          {run?<><Pause size={11}/>정지</>:<><Play size={11}/>시작</>}
        </button>
        <button onClick={reset} style={{ padding:'7px 11px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'#4a6080', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
          <RotateCcw size={11}/>초기화
        </button>
      </div>
    </div>
  )
}

export default function Emergency({ patient }) {
  const recommended = getRecommended(patient)
  const [tab, setTab] = useState(recommended || 'cpr')
  const [step, setStep] = useState(0)
  const [dir, setDir]   = useState('right')
  const guide = GUIDES[tab]
  const cur   = guide.steps[step]

  const goTo = (i, d='right') => { setDir(d); setStep(i) }
  const next = () => { if (step < guide.steps.length-1) goTo(step+1,'right') }
  const prev = () => { if (step > 0) goTo(step-1,'left') }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 44px)', overflow:'hidden', background:'#050d1a' }}>

      {/* ── 탭 바 ── */}
      <div style={{ display:'flex', gap:6, padding:'10px 20px', background:'rgba(8,18,35,0.97)', borderBottom:'1.5px solid rgba(13,217,197,0.13)', overflowX:'auto', flexShrink:0 }}>
        {recommended && tab !== recommended && (
          <div style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, background:'rgba(255,77,109,0.1)', border:'1.5px solid rgba(255,77,109,0.3)', fontSize:11, color:'#ff4d6d', fontWeight:800, flexShrink:0 }}>
            <Zap size={11}/> 현재 환자 상태 기반 추천
          </div>
        )}
        {TABS.map(t => (
          <button key={t.id} onClick={()=>{ setTab(t.id); setStep(0) }} style={{
            padding:'8px 16px', borderRadius:10, border:'2px solid',
            borderColor: tab===t.id ? t.color : 'rgba(255,255,255,0.06)',
            background: tab===t.id ? `${t.color}18` : 'rgba(255,255,255,0.02)',
            color: tab===t.id ? '#fff' : '#8da2c0',
            fontSize:12, fontWeight:800, cursor:'pointer',
            display:'flex', alignItems:'center', gap:6, flexShrink:0,
            position:'relative', transition:'all 0.2s',
          }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
            {t.id === recommended && tab !== t.id && (
              <span style={{ position:'absolute', top:-5, right:-5, width:10, height:10, borderRadius:'50%', background:'#ff4d6d', border:'2px solid #050d1a', animation:'pulse-dot 1s infinite' }}/>
            )}
          </button>
        ))}
      </div>

      {/* ── 2-panel ── */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'400px 1fr', overflow:'hidden' }}>

        {/* 좌: 이미지 + 진행 */}
        <div style={{ borderRight:'1.5px solid rgba(13,217,197,0.13)', display:'flex', flexDirection:'column', background:'rgba(12,25,50,0.4)' }}>
          {/* 진행 바 */}
          <div style={{ padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', flexShrink:0 }}>
            <div style={{ display:'flex', gap:5, marginBottom:8, alignItems:'center' }}>
              {guide.steps.map((_,i)=>(
                <button key={i} onClick={()=>goTo(i,i>step?'right':'left')} style={{ flex:1, height:4, borderRadius:2, border:'none', cursor:'pointer', background: i===step?guide.color:i<step?`${guide.color}55`:'rgba(255,255,255,0.07)', transition:'background 0.3s' }}/>
              ))}
              <span style={{ fontSize:11, color:'#4a6080', fontWeight:700, flexShrink:0, marginLeft:6 }}>{step+1}/{guide.steps.length}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:5, background:`${guide.color}18`, color:guide.color, fontWeight:800 }}>STEP {step+1}</span>
              <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{cur.title}</span>
            </div>
          </div>

          {/* 이미지 */}
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
            <img
              key={`${tab}-${step}`}
              src={cur.img} alt={cur.title}
              style={{ width:'100%', height:'100%', objectFit:'cover', animation:`${dir==='right'?'imgSlideIn':'imgSlideInLeft'} 0.4s ease both` }}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.1) 55%, transparent 100%)' }}/>

            {/* 애니메이션 아이콘 (CSS only, NO SVG) */}
            <div style={{ position:'absolute', top:16, right:16, fontSize:44, animation:`${cur.anim||'stepPulse'} 1.2s ease-in-out infinite`, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}>
              {cur.icon}
            </div>

            {/* 하단 오버레이 */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px' }}>
              <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:7 }}>{cur.title}</div>
              <div style={{ padding:'8px 12px', borderRadius:9, background:`${cur.tipColor||'#ff9f43'}15`, border:`1px solid ${cur.tipColor||'#ff9f43'}28`, display:'flex', gap:7, alignItems:'flex-start' }}>
                <AlertTriangle size={13} color={cur.tipColor||'#ff9f43'} style={{ flexShrink:0, marginTop:1 }}/>
                <span style={{ fontSize:11, color:cur.tipColor||'#ff9f43', fontWeight:600, lineHeight:1.5 }}>{cur.tip}</span>
              </div>
            </div>
          </div>

          {/* 네비 버튼 */}
          <div style={{ padding:'12px 18px', background:'rgba(5,13,26,0.9)', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', gap:10, flexShrink:0 }}>
            <button onClick={prev} disabled={step===0} style={{ padding:'10px 16px', borderRadius:11, background:step===0?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.07)', color:step===0?'#4a6080':'#e8f0fe', fontSize:13, fontWeight:700, cursor:step===0?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <ChevronLeft size={15}/> 이전
            </button>
            <button onClick={next} disabled={step===guide.steps.length-1} style={{ flex:1, padding:'10px', borderRadius:11, background:step===guide.steps.length-1?'rgba(255,255,255,0.03)':guide.color, border:'none', color:step===guide.steps.length-1?'#4a6080':'#050d1a', fontSize:13, fontWeight:800, cursor:step===guide.steps.length-1?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              다음 단계 <ChevronRight size={15}/>
            </button>
          </div>
        </div>

        {/* 우: 스텝 리스트 */}
        <div style={{ overflowY:'auto', background:'linear-gradient(135deg,#050d1a,#0a1628)', padding:'22px 26px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <ShieldAlert size={22} color={guide.color}/>
            <span style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{guide.title}</span>
          </div>
          <p style={{ fontSize:12, color:'#8da2c0', lineHeight:1.6, marginBottom:22 }}>{guide.desc}</p>

          <div style={{ position:'relative', marginLeft:6 }}>
            <div style={{ position:'absolute', left:27, top:0, bottom:0, width:2, background:'rgba(13,217,197,0.07)' }}/>
            {guide.steps.map((s,i)=>{
              const active = i===step, done = i<step
              return (
                <div key={i} onClick={()=>goTo(i,i>step?'right':'left')} style={{ display:'flex', gap:18, marginBottom:16, cursor:'pointer', animation:`slideInLeft 0.3s ease ${i*0.06}s both` }}>
                  {/* 번호 */}
                  <div style={{ width:54, height:54, borderRadius:'50%', flexShrink:0, background:active?guide.color:done?`${guide.color}35`:'#0a1628', border:`3px solid ${active?'#fff':done?guide.color:'rgba(13,217,197,0.18)'}`, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2, fontSize:done?18:17, fontWeight:900, color:active?'#050d1a':done?guide.color:'#4a6080', boxShadow:active?`0 0 20px ${guide.color}55`:'none', transition:'all 0.3s' }}>
                    {done?'✓':i+1}
                  </div>
                  {/* 카드 */}
                  <div style={{ flex:1, background:active?`${guide.color}0f`:'rgba(255,255,255,0.02)', border:`1.5px solid ${active?guide.color:done?`${guide.color}20`:'rgba(255,255,255,0.05)'}`, borderRadius:15, padding:'14px 18px', transition:'all 0.3s', transform:active?'translateX(4px)':'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:18 }}>{s.icon}</span>
                      <span style={{ fontSize:14, fontWeight:800, color:active?'#fff':'#8da2c0' }}>{s.title}</span>
                      {active && <CheckCircle2 size={15} color={guide.color} style={{ marginLeft:'auto' }}/>}
                    </div>
                    <p style={{ fontSize:12, color:active?'#e8f0fe':'#4a6080', lineHeight:1.65 }}>{s.desc}</p>
                    {/* 타이머 / CPR 메트로놈 */}
                    {active && s.dur > 0   && <StepTimer  seconds={s.dur} label={s.timerLabel||`타이머`} color={guide.color}/>}
                    {active && s.hasCPR    && <CPRMetronome/>}
                  </div>
                </div>
              )
            })}
          </div>

          {step === guide.steps.length-1 && (
            <div style={{ marginTop:8, padding:'14px 18px', borderRadius:14, background:'rgba(38,222,129,0.07)', border:'1.5px solid rgba(38,222,129,0.2)', display:'flex', alignItems:'center', gap:12 }}>
              <CheckCircle2 size={20} color="#26de81"/>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#26de81', marginBottom:2 }}>모든 단계 완료</div>
                <div style={{ fontSize:11, color:'#8da2c0' }}>처치 완료 후 원격 의료진에게 결과를 보고하세요.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
