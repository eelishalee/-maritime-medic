import { useState, useEffect, useRef } from 'react'
import { 
  Send, Mic, Upload, Activity, Anchor, Radio, Clipboard, Shield, Pill, 
  History, Camera, AlertTriangle, CheckCircle, Info, ChevronRight, 
  User, Settings, LogOut, Plus, Trash2, Edit3, Heart, Thermometer, 
  Droplets, Wind, Timer, Navigation, Ship, Database, Wifi, WifiOff, Search
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import MdtsLogo from '../components/MdtsLogo'

// --- Mock Data & Constants ---
const SHIP_INFO = {
  name: '해신-호 (HAESIN-07)',
  type: '컨테이너선 (14,000 TEU)',
  id: 'IMO 9876543',
  status: '항해 중 (북태평양)'
}

const INITIAL_CREW = Array.from({ length: 26 }, (_, i) => ({
  id: `CREW-${100 + i}`,
  name: [`김항해`, `이갑판`, `박기관`, `정통신`, `최조리`, `강항해`, `윤보급`, `임안전`, `한앵커`, `오레이더`, `조소나`, `배엔진`, `고갑판`, `문해역`, `송나침`, `양프로`, `백키`, `권로그`, `황비콘`, `서구명`, `어그물`, `남항구`, `유파도`, `심해안`, `노부표`, `장윈치`][i] || `선원-${i+1}`,
  role: ['선장', '일등항해사', '기관장', '통신장', '조리장', '조타수', '갑판원'][i % 7],
  age: i === 0 ? 52 : 30 + (i % 25),
  blood: ['A+', 'B+', 'O+', 'AB+'][i % 4],
  history: i === 0 ? '고혈압 (2022~)\n페니실린 알레르기 있음' : '특이사항 없음',
  status: '건강'
}))

// --- MEWS Scoring Logic ---
function calculateMEWS(hr, rr, sbp, bt) {
  let score = 0;
  if (hr <= 40 || hr >= 130) score += 3;
  else if (hr >= 111 || hr <= 50) score += 2;
  else if (hr >= 101 || hr <= 41) score += 1;
  if (rr >= 30 || rr < 9) score += 3;
  else if (rr >= 21 || rr <= 14) score += 2;
  const bpValue = parseInt(sbp);
  if (bpValue <= 70) score += 3;
  else if (bpValue <= 80 || bpValue >= 200) score += 2;
  else if (bpValue <= 100) score += 1;
  const temp = parseFloat(bt);
  if (temp < 35 || temp >= 38.5) score += 2;
  return score;
}

export default function Main() {
  const [view, setView] = useState('login') // login, dashboard, crew, settings
  const [isOnline, setIsOnline] = useState(true)
  const [crewList, setCrewList] = useState(INITIAL_CREW)
  const [activePatient, setActivePatient] = useState(INITIAL_CREW[0])
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [mews, setMews] = useState(0)
  
  // Login States
  const [loginData, setLoginData] = useState({ serial: '', device: '', ship: '' })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // Dashboard States
  const [hr, setHr] = useState(82)
  const [spo2, setSpo2] = useState(98)
  const [rr, setRr] = useState(16)
  const [bp, setBp] = useState('128/84')
  const [bt, setBt] = useState('36.7')
  const [history, setHistory] = useState(Array.from({ length: 30 }, (_, i) => ({ t: i, v: 80 + Math.random()*10 })))
  
  const [activeEmergencyGuide, setActiveEmergencyGuide] = useState(null) // null, 'CARDIAC', 'TRAUMA', 'RESP'
  const [activeStep, setActiveStep] = useState(2)
  const [expandedSection, setExpandedSection] = useState(null) // null, 'HISTORY', 'LOG', 'TRANSFER'
  const [prompt, setPrompt] = useState('')
  const [chat, setChat] = useState([{ role: 'ai', text: 'MDTS 엣지 AI 활성화 완료 · 환자 상태 실시간 분석 중' }])
  const [crewSearch, setCrewSearch] = useState('')
  const [crewRoleTab, setCrewRoleTab] = useState('전체')
  
  // Modal States
  const [showModal, setShowModal] = useState(null) // 'create', 'edit', 'delete'
  const [selectedCrew, setSelectedCrew] = useState(null)

  const roles = ['전체', '선장/항해사', '기관부', '통신/보급', '조리/기타']
  const filteredCrew = crewList.filter(c => {
    const matchesSearch = c.name.includes(crewSearch) || c.id.includes(crewSearch)
    if (crewRoleTab === '전체') return matchesSearch
    if (crewRoleTab === '선장/항해사') return matchesSearch && (c.role.includes('선장') || c.role.includes('항해사'))
    if (crewRoleTab === '기관부') return matchesSearch && (c.role.includes('기관'))
    if (crewRoleTab === '통신/보급') return matchesSearch && (c.role.includes('통신') || c.role.includes('보급'))
    return matchesSearch && (c.role.includes('조리') || c.role.includes('갑판') || c.role.includes('안전'))
  })


  // Realtime Simulation
  useEffect(() => {
    if (view === 'dashboard') {
      const interval = setInterval(() => {
        setHr(h => h + Math.round((Math.random()-0.5)*4))
        setSpo2(s => Math.min(100, Math.max(90, s + Math.round((Math.random()-0.5)*1))))
        setRr(r => Math.min(30, Math.max(12, r + Math.round((Math.random()-0.5)*2))))
        setHistory(prev => [...prev.slice(1), { t: Date.now(), v: hr }])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [view, hr])

  useEffect(() => {
    setMews(calculateMEWS(hr, rr, bp.split('/')[0], bt))
  }, [hr, rr, bp, bt])

  const handleLogin = (e) => {
    e.preventDefault()
    setView('dashboard')
  }

  const switchPatient = (crew) => {
    setActivePatient(crew)
    setView('dashboard')
    setActiveTab('DASHBOARD')
    setChat([{ role: 'ai', text: `${crew.name} ${crew.role} · 환자 전환 완료 · 과거 이력 로드 중` }])
  }

  const startEmergencyAction = (type) => {
    setActiveEmergencyGuide(type)
    setActiveTab('GUIDE')
  }

  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return;
    const newChat = [...chat, { role: 'user', text: prompt }];
    setChat(newChat);
    const userInput = prompt.toLowerCase();
    setPrompt('');

    setTimeout(() => {
      let aiResponse = '입력 내용 분석 중 · 증상 상세 입력 시 정밀 판정 대기';
      if (userInput.includes('아프') || userInput.includes('통증') || userInput.includes('결려')) {
        aiResponse = '심혈관 전조 증상 의심 · 바이탈 안정 · 즉시 안정 및 산소 공급 권고';
      } else if (userInput.includes('피') || userInput.includes('다치') || userInput.includes('베였')) {
        aiResponse = '출혈 감지 · 상처 압박 지혈 필요 · AI 외상 분석 촬영 권고 · 원격 의료진 호출 대기';
      } else if (userInput.includes('어지럽') || userInput.includes('쓰러')) {
        aiResponse = '의식 저하 가능성 · 기도 확보 및 하체 거상 처치 권고 · MEWS 위험도 모니터링';
      }
      setChat([...newChat, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  // --- Views ---
  
  if (view === 'login') {
    return (
      <div
        style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#06111e', color:'#fff', fontFamily:'Pretendard', overflow:'hidden', position:'relative', cursor:'default' }}
        onMouseMove={e => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })}
      >
        {/* ══ 오션 배경 레이어 ══ */}
        {/* 상단 하늘 - 짙은 네이비 */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, #04101e 0%, #071828 38%, #082030 42%, #093040 100%)', pointerEvents:'none' }}/>
        {/* 하단 수중 - 청록 그라디언트 */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, height:'60%', background:'linear-gradient(180deg, #093040 0%, #0a3848 15%, #083040 40%, #051e2c 75%, #030f1c 100%)', pointerEvents:'none' }}/>
        {/* 수면 빛 굴절 효과 */}
        <div style={{ position:'absolute', left:0, right:0, top:'38%', height:'25%', background:'linear-gradient(180deg, rgba(14,200,210,0.04) 0%, rgba(8,160,175,0.08) 30%, rgba(5,120,140,0.04) 100%)', pointerEvents:'none' }}/>
        {/* 마우스 패럴랙스 빛 오브 */}
        <div style={{ position:'absolute', width:600, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,220,200,0.07) 0%, transparent 70%)', top:`${30 + mousePos.y * 10}%`, left:`${20 + mousePos.x * 20}%`, transform:'translate(-50%,-50%)', transition:'top 0.8s ease, left 0.8s ease', pointerEvents:'none' }}/>

        {/* ══ 상단 네비 바 ══ */}
        <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 48px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,229,200,0.22)', border:'1px solid rgba(0,229,200,0.22)', background:'rgba(4,18,32,0.6)' }}>
              <MdtsLogo size={30} />
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(56,189,248,0.7)', letterSpacing:2.5 }}>MEDITISING</div>
              <div style={{ fontSize:15, fontWeight:900, letterSpacing:0.5, lineHeight:1 }}>MDTS</div>
            </div>
          </div>
          <div/>
          <div/>
        </div>

        {/* ══ 물결 애니메이션 (수면) ══ */}
        <div style={{ position:'absolute', left:0, right:0, top:'36%', zIndex:5, pointerEvents:'none',
          transform:`translateY(${(mousePos.y - 0.5) * 12}px)`, transition:'transform 0.6s ease' }}>
          {/* 물결 레이어 3 - 가장 뒤, 느림 */}
          <svg style={{ display:'block', width:'200%', animation:'waveFlow3 9s linear infinite', opacity:0.3 }} height="60" viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,30 C180,10 360,50 540,30 C720,10 900,50 1080,30 C1260,10 1440,50 1620,30 C1800,10 1980,50 2160,30 C2340,10 2520,50 2700,30 C2880,10 2880,10 2880,10 L2880,60 L0,60Z" fill="#0c6a78"/>
          </svg>
          {/* 물결 레이어 2 - 중간 */}
          <svg style={{ display:'block', width:'200%', marginTop:-44, animation:'waveFlow2 6s linear infinite', opacity:0.45 }} height="60" viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,20 C240,48 480,5 720,28 C960,50 1200,8 1440,25 C1680,45 1920,5 2160,22 C2400,42 2640,8 2880,20 L2880,60 L0,60Z" fill="#0e7a8a"/>
          </svg>
          {/* 물결 레이어 1 - 가장 앞, 빠름 */}
          <svg style={{ display:'block', width:'200%', marginTop:-40, animation:'waveFlow1 4s linear infinite', opacity:0.65 }} height="70" viewBox="0 0 2880 70" preserveAspectRatio="none">
            <path d="M0,35 C160,8 320,58 480,35 C640,8 800,58 960,35 C1120,8 1280,58 1440,35 C1600,8 1760,58 1920,35 C2080,8 2240,58 2400,35 C2560,8 2720,58 2880,35 L2880,70 L0,70Z" fill="#10909e"/>
          </svg>
          {/* 물결 위 반짝임 */}
          <svg style={{ display:'block', width:'200%', marginTop:-58, animation:'waveFlow1 4s linear infinite', opacity:0.4 }} height="20" viewBox="0 0 2880 20" preserveAspectRatio="none">
            <path d="M0,10 C160,2 320,18 480,10 C640,2 800,18 960,10 C1120,2 1280,18 1440,10 C1600,2 1760,18 1920,10 C2080,2 2240,18 2400,10 C2560,2 2720,18 2880,10 L2880,20 L0,20Z" fill="rgba(100,230,240,0.5)"/>
          </svg>
        </div>

        {/* ══ 메인 콘텐츠 영역 ══ */}
        <div style={{ position:'relative', zIndex:6, flex:1 }}>

          {/* 좌측 중간: 헤드라인 + 설명 + 스탯 */}
          <div style={{ position:'absolute', left:52, top:'50%', transform:'translateY(-50%)' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16, background:'rgba(0,229,200,0.08)', border:'1px solid rgba(0,229,200,0.25)', borderRadius:30, padding:'6px 16px' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#00e5cc', boxShadow:'0 0 8px #00e5cc', animation:'loginPulse 2s infinite' }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#00e5cc', letterSpacing:2.5 }}>Maritime Medical AI System</span>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:76, fontWeight:950, lineHeight:0.95, letterSpacing:-2,
                color:'#ffffff',
                filter:'drop-shadow(0 4px 24px rgba(255,255,255,0.18))' }}>선박 의료</div>
              <div style={{ fontSize:64, fontWeight:800, lineHeight:1.05, fontStyle:'italic', letterSpacing:-1, marginTop:10,
                background:'linear-gradient(90deg, #39ff6a 0%, #00ffcc 55%, #00e5ff 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                filter:'drop-shadow(0 2px 20px rgba(0,255,180,0.4))' }}>AI Medical System</div>
            </div>
            <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.38)', maxWidth:380, lineHeight:1.6, marginBottom:28 }}>
              네트워크 독립형 엣지 AI 기반 실시간 진단 및 응급처치 지원 플랫폼
            </p>
            <div style={{ display:'flex', gap:30 }}>
              {[{val:'24H',label:'실시간 바이탈'},{val:'4종',label:'응급처치 분류'},{val:'99%',label:'오프라인 가용'},{val:'12단계',label:'처치 프로토콜'}].map(({val,label})=>(
                <div key={val}>
                  <div style={{ fontSize:28, fontWeight:950, color:'#fff', lineHeight:1, letterSpacing:-0.5 }}>{val}</div>
                  <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.36)', marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 화면 정중앙: 로그인 폼 카드 */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:460 }}>
            <div style={{ background:'rgba(5,14,28,0.88)', backdropFilter:'blur(32px)', borderRadius:28, border:'1px solid rgba(0,229,200,0.15)', boxShadow:'0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)', padding:'48px 44px' }}>
              <div style={{ textAlign:'center', marginBottom:36 }}>
                <div style={{ width:72, height:72, borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(0,229,200,0.28)', border:'1px solid rgba(0,229,200,0.22)', background:'rgba(4,18,32,0.7)' }}>
                  <MdtsLogo size={60} />
                </div>
                <div style={{ fontSize:22, fontWeight:900, letterSpacing:0.3, marginBottom:6 }}>MDTS 시스템 접속</div>
                <div style={{ display:'inline-block' }}>
                <div style={{ fontSize:13.5, color:'rgba(100,116,139,0.9)' }}>바다 위 어디서든, 멈추지 않는 의료 AI</div>
                {/* 심장박동 ECG 라인 — 텍스트 너비에 맞춤 */}
                <div style={{ position:'relative', height:18, margin:'6px 0 0', overflow:'hidden' }}>
                  <svg
                    width="200%" height="18"
                    viewBox="0 0 800 18"
                    preserveAspectRatio="none"
                    style={{ position:'absolute', left:0, top:0, animation:'ecgScroll 5s linear infinite' }}
                  >
                    <defs>
                      <linearGradient id="ecg-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="rgba(0,229,200,0)"/>
                        <stop offset="20%"  stopColor="rgba(0,229,200,0.15)"/>
                        <stop offset="45%"  stopColor="#00e5cc"/>
                        <stop offset="55%"  stopColor="#00d4ff"/>
                        <stop offset="80%"  stopColor="rgba(0,212,255,0.15)"/>
                        <stop offset="100%" stopColor="rgba(0,212,255,0)"/>
                      </linearGradient>
                      <filter id="ecg-glow">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#00e5cc" floodOpacity="0.6"/>
                      </filter>
                    </defs>
                    {/* QRS 스파이크 2회 반복 (400 unit/cycle) */}
                    <path
                      d="M0,9 L175,9 L178,12 L182,1 L186,17 L190,9 L400,9 L575,9 L578,12 L582,1 L586,17 L590,9 L800,9"
                      stroke="url(#ecg-grad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#ecg-glow)"
                    />
                  </svg>
                </div>
                </div>
              </div>
              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:13 }}>
                <LoginInput icon={<Database size={16}/>} placeholder="시리얼 넘버 (Serial Number)" value={loginData.serial} onChange={v=>setLoginData({...loginData,serial:v})}/>
                <LoginInput icon={<Settings size={16}/>} placeholder="기기 번호 (Device Number)" value={loginData.device} onChange={v=>setLoginData({...loginData,device:v})}/>
                <LoginInput icon={<Ship size={16}/>} placeholder="선박 번호 (Ship Number)" value={loginData.ship} onChange={v=>setLoginData({...loginData,ship:v})}/>
                <button type="submit"
                  style={{ marginTop:8, padding:'18px', borderRadius:15, background:'linear-gradient(90deg,#00c9b1,#00a8e8)', color:'#000', fontWeight:900, border:'none', cursor:'pointer', fontSize:16, boxShadow:'0 4px 28px rgba(0,200,180,0.4)', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 36px rgba(0,200,180,0.62)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 28px rgba(0,200,180,0.4)' }}>
                  시스템 접속
                </button>
              </form>
              <div style={{ marginTop:20, display:'flex', justifyContent:'center', gap:12 }}>
                {['v2.1 Edge'].map(t=>(
                  <span key={t} style={{ fontSize:11.5, color:'#334155', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'4px 12px' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 기능 태그 스트립 */}
        <div style={{ position:'relative', zIndex:7, display:'flex', gap:10, padding:'14px 48px', borderTop:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(8px)', background:'rgba(4,14,26,0.5)', overflowX:'auto' }}>
          {['오프라인 독립 운영','원격 의료 연동','MEWS 자동 산출','외상 AI 촬영','ECG 심전도 분석'].map(t=>(
            <span key={t} style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:30, padding:'6px 16px', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.2s', cursor:'default' }}
              onMouseEnter={e=>{ e.currentTarget.style.color='rgba(0,229,200,0.9)'; e.currentTarget.style.borderColor='rgba(0,229,200,0.3)'; e.currentTarget.style.background='rgba(0,229,200,0.08)' }}
              onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}>
              {t}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes waveFlow1 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes waveFlow2 { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
          @keyframes waveFlow3 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes loginPulse { 0%,100%{opacity:1;box-shadow:0 0 6px #00e5cc} 50%{opacity:0.4;box-shadow:0 0 14px #00e5cc} }
          @keyframes ecgScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', background: '#020408', color: '#e2e8f0', fontFamily: 'Pretendard', fontSize: '135.47%' }}>
      
      {/* --- Top Status Bar & Navigation --- */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 27px', height: 80, display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(56,189,248,0.28)', background:'rgba(4,18,32,0.6)', flexShrink:0 }}>
            <MdtsLogo size={32} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 22 }}>MDTS <span style={{ color: '#38bdf8', fontWeight: 400 }}>엣지 AI</span></span>
        </div>

        <nav style={{ display: 'flex', gap: 8, height: '100%' }}>
          <NavTab label="종합 대시보드" active={activeTab === 'DASHBOARD'} onClick={() => { setActiveTab('DASHBOARD'); setView('dashboard') }} />
          <NavTab label="선원 정보 관리" active={activeTab === 'CREW'} onClick={() => { setActiveTab('CREW'); setView('crew') }} />
          <NavTab label="처치 가이드" active={activeTab === 'GUIDE'} onClick={() => { setActiveTab('GUIDE'); setView('dashboard') }} />
          <NavTab label="시스템 설정" active={activeTab === 'SETTINGS'} onClick={() => { setActiveTab('SETTINGS'); setView('settings') }} />
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 18px', borderRadius: 22, background: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
            {isOnline ? <Wifi size={18} color="#2dd4bf" /> : <WifiOff size={18} color="#fb7185" />}
            <span style={{ fontWeight: 700, color: isOnline ? '#2dd4bf' : '#fb7185' }}>{isOnline ? 'ON LINE' : 'OFF LINE'}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{SHIP_INFO.name}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{SHIP_INFO.status}</div>
          </div>
          <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><LogOut size={24} /></button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {view === 'dashboard' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 440px', overflow: 'hidden' }}>
            
            {/* [Left] Patient Info Panel */}
            <aside style={{ 
              borderRight: '1px solid rgba(255,255,255,0.05)', 
              background: '#05070a',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: '100%'
            }}>
              
              {/* Left Scrollable Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                {/* Patient Profile Box */}
                <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 24, padding: '24px 24px 20px 24px', marginBottom: 30 }}>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                    <div style={{ width: 110, height: 110, borderRadius: 27, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }}>
                      {activePatient.id.includes('100') ? (
                        <img 
                          src="photo.jpeg" 
                          alt="Captain" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 5px' }} 
                          onError={(e) => { e.target.src = ''; e.target.style.display='none'; }}
                        />
                      ) : (
                        <User size={68} color="#38bdf8" />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 37, fontWeight: 950, marginBottom: 4, letterSpacing: '-0.6px' }}>{activePatient.name}</div>
                      <div style={{ fontSize: 23, color: '#38bdf8', fontWeight: 800, marginBottom: 2 }}>{activePatient.role}</div>
                      <div style={{ fontSize: 18, color: '#475569', fontWeight: 700 }}>ID : {activePatient.id}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <InfoItem label="나이/성별" value={`${activePatient.age}세 / 남`} size="xl_ultra" />
                    <InfoItem label="혈액형" value={activePatient.blood} size="xl_ultra" />
                    <div style={{ gridColumn: 'span 2', marginTop: 0 }}>
                      <div style={{ fontSize: 17, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>과거력 (Past History)</div>
                      <div style={{ fontSize: 21, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{activePatient.history}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 21, fontWeight: 800 }}>
                      <History size={26}/> 최근 진료 이력
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)', fontSize: 20, color: '#94a3b8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontWeight: 800, color: '#38bdf8' }}>2026-03-15</span>
                        <span>단순 감기</span>
                      </div>
                      <div style={{ lineHeight: 1.6 }}>- 처방 : 타이레놀 500mg <br/>- 특이사항 : 알레르기 반응 없음</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 21, fontWeight: 800 }}>
                      <Droplets size={26}/> 투약/처치 로그
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)', fontSize: 20, color: '#94a3b8' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ padding: '4px 12px', borderRadius: 6, background: '#38bdf830', color: '#38bdf8', fontSize: 16, fontWeight: 900 }}>14:10</span>
                        <span style={{ fontWeight: 800, color: '#e2e8f0' }}>아스피린 300mg 투여</span>
                      </div>
                      <div style={{ lineHeight: 1.6 }}>처치자 : 이갑판 (일등항해사)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2dd4bf', fontSize: 21, fontWeight: 800 }}>
                      <Upload size={26}/> 데이터 전송 상태
                    </div>
                    <div style={{ padding: '22px', background: 'rgba(45, 212, 191, 0.05)', borderRadius: 18, border: '1px solid rgba(45, 212, 191, 0.1)', fontSize: 20, color: '#2dd4bf' }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>육상 의료 센터 동기화</div>
                      <div style={{ lineHeight: 1.6 }}>- 바이탈 데이터 실시간 전송 중 <br/>- 처치 로그 전송 완료 (14:12)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Fixed Footer (Button) */}
              <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05070a', flexShrink: 0, zIndex: 10 }}>
                <button 
                  onClick={() => startEmergencyAction('CARDIAC')}
                  className="emergency-action-btn"
                  style={{ 
                    width: '100%', padding: '22px', borderRadius: 18, 
                    background: '#f43f5e', color: '#fff', border: 'none', 
                    fontWeight: 900, cursor: 'pointer', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: 14, 
                    fontSize: 20, transition: '0.2s'
                  }}
                >
                  <AlertTriangle size={26} /> 응급 처치 액션 시작
                </button>
              </div>
            </aside>

            {/* [Center] Vitals, Timeline, Chat */}
            <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Center Vitals Row */}
              <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
                <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Activity size={24} color="#38bdf8" />
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8', letterSpacing: '1px' }}>VITAL SENSOR REAL-TIME MONITORING</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  <DashboardVital label="심박수" value={hr} unit="bpm" color="#fb7185" live />
                  <DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live />
                  <DashboardVital label="호흡수" value={rr} unit="/min" color="#2dd4bf" live />
                  <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#e2e8f0" editable onEdit={() => {}} />
                  <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#fbbf24" editable onEdit={() => {}} />
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 45px 45px 45px' }}>
                {activeTab === 'DASHBOARD' && (
                  <div style={{ position: 'relative', paddingLeft: 45 }}>
                    <div style={{ position: 'absolute', left: 8.5, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.05)' }} />
                    <TimelineItem time="14:02" label="급성 흉부 통증 발생 및 최초 발견" detail="선교 내 이동 중 갑작스러운 심장 쪼임 호소하며 쓰러짐" />
                    <TimelineItem time="14:05" label="AI 분석 : 심근경색(STEMI) 고위험 판정" detail="ECG 데이터 및 증상 기반 엣지 AI 정밀 분석 완료" highlight />
                    <TimelineItem time="14:08" label="응급 처치 액션 개시 및 산소 공급" detail="환자 안정 유도 및 비재호흡 마스크 산소 투여" />
                    <TimelineItem time="14:10" label="아스피린 300mg 설하 투여 완료" detail="처치자 : 이갑판 (일등항해사)" />
                  </div>
                )}

                {activeTab === 'GUIDE' && (
                  <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h2 style={{ fontSize: 32, fontWeight: 900 }}>증상별 응급 처치 가이드</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: 'rgba(251,113,133,0.1)', borderRadius: 18, border: '1px solid rgba(251,113,133,0.2)' }}>
                        <Timer size={24} color="#fb7185" />
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#fb7185' }}>골든타임 : 42:15</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
                      <SymptomTab label="흉통/심정지" active={activeEmergencyGuide === 'CARDIAC'} onClick={() => { setActiveEmergencyGuide('CARDIAC'); setActiveStep(1) }} />
                      <SymptomTab label="중증 외상/출혈" active={activeEmergencyGuide === 'TRAUMA'} onClick={() => { setActiveEmergencyGuide('TRAUMA'); setActiveStep(1) }} />
                      <SymptomTab label="의식 저하" active={activeEmergencyGuide === 'UNCONSCIOUS'} onClick={() => { setActiveEmergencyGuide('UNCONSCIOUS'); setActiveStep(1) }} />
                      <SymptomTab label="호흡 곤란" active={activeEmergencyGuide === 'RESPIRATORY'} onClick={() => { setActiveEmergencyGuide('RESPIRATORY'); setActiveStep(1) }} />
                    </div>

                    {(() => {
                      const GUIDES = {
                        CARDIAC: {
                          steps: [
                            { title: '의식 확인 · 도움 요청', desc: '어깨 가볍게 두드림 · 의식 여부 확인 · 주변 도움 요청' },
                            { title: '흉부 압박', desc: '100~120회/분 · 5cm 깊이 · 강하고 빠른 압박' },
                            { title: 'AED 사용', desc: '자동심장충격기 도착 즉시 패드 부착 · 안내 음성 준수' },
                          ],
                          illustrations: [
                            { color: '#38bdf8', bg: 'rgba(56,189,248,0.05)',  border: 'rgba(56,189,248,0.1)',  label: '의식 확인 가이드' },
                            { color: '#38bdf8', bg: 'rgba(56,189,248,0.05)',  border: 'rgba(56,189,248,0.1)',  label: 'CPR 가이드' },
                            { color: '#fbbf24', bg: 'rgba(251,191,36,0.05)',  border: 'rgba(251,191,36,0.15)', label: 'AED 사용 가이드' },
                          ],
                        },
                        TRAUMA: {
                          steps: [
                            { title: '출혈 부위 압박 · 지혈', desc: '거즈 또는 깨끗한 천 · 상처 강하게 압박 · 지혈 유지' },
                            { title: '환부 고정 · 거상', desc: '손상 사지 심장보다 높게 유지 · 고정 및 부동화' },
                            { title: '쇼크 예방 · 보온', desc: '수평 눕힘 · 보온 유지 · 음식·음료 금지' },
                          ],
                          illustrations: [
                            { color: '#f43f5e', bg: 'rgba(244,63,94,0.05)',   border: 'rgba(244,63,94,0.15)',  label: '지혈 처치 가이드' },
                            { color: '#f43f5e', bg: 'rgba(244,63,94,0.05)',   border: 'rgba(244,63,94,0.15)',  label: '환부 고정 가이드' },
                            { color: '#94a3b8', bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.15)',label: '쇼크 예방 가이드' },
                          ],
                        },
                        UNCONSCIOUS: {
                          steps: [
                            { title: '기도 확보', desc: '머리 후굴 · 턱 거상 · 기도 개방' },
                            { title: '회복 자세 유지', desc: '측와위 자세 · 기도 폐쇄 방지 · 발 거상' },
                            { title: '지속 모니터링', desc: '호흡·맥박 지속 확인 · 의식 회복 여부 관찰' },
                          ],
                          illustrations: [
                            { color: '#fbbf24', bg: 'rgba(251,191,36,0.05)',  border: 'rgba(251,191,36,0.15)', label: '기도 확보 가이드' },
                            { color: '#fbbf24', bg: 'rgba(251,191,36,0.05)',  border: 'rgba(251,191,36,0.15)', label: '회복 자세 가이드' },
                            { color: '#2dd4bf', bg: 'rgba(45,212,191,0.05)',  border: 'rgba(45,212,191,0.15)', label: '모니터링 가이드' },
                          ],
                        },
                        RESPIRATORY: {
                          steps: [
                            { title: '상체 거상 · 안정', desc: '좌위 또는 반좌위 유지 · 호흡 편의 확보' },
                            { title: '산소 공급', desc: '산소 마스크 착용 · 10~15L/분 공급' },
                            { title: '기관지 확장제 투여', desc: '천식·COPD 병력 확인 · 흡입 보조' },
                          ],
                          illustrations: [
                            { color: '#2dd4bf', bg: 'rgba(45,212,191,0.05)', border: 'rgba(45,212,191,0.15)', label: '상체 거상 가이드' },
                            { color: '#2dd4bf', bg: 'rgba(45,212,191,0.05)', border: 'rgba(45,212,191,0.15)', label: '산소 공급 가이드' },
                            { color: '#2dd4bf', bg: 'rgba(45,212,191,0.05)', border: 'rgba(45,212,191,0.15)', label: '기관지 확장제 가이드' },
                          ],
                        },
                      }
                      const guide = GUIDES[activeEmergencyGuide]
                      if (!guide) return null
                      const illus = guide.illustrations[activeStep - 1]
                      const { color, bg, border, label } = illus
                      const key = `${activeEmergencyGuide}-${activeStep}`

                      const Anim3D = () => {
                        const S = { width: 240, height: 260 }
                        const vb = "0 0 240 260"
                        // shared defs component
                        const Defs = ({id}) => (
                          <defs>
                            <linearGradient id={`sk${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="50%" stopColor="#f5cba0"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                            <linearGradient id={`sk${id}d`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e8a87c"/><stop offset="100%" stopColor="#f5cba0"/></linearGradient>
                            <linearGradient id={`sc${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38a3c8"/><stop offset="100%" stopColor="#1e6a8a"/></linearGradient>
                            <linearGradient id={`gl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                            <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1b2a"/><stop offset="100%" stopColor="#06101a"/></linearGradient>
                            <filter id={`sh${id}`}><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/></filter>
                          </defs>
                        )
                        const Arrow = ({x1,y1,x2,y2,id}) => {
                          const aid = `ar${id}`
                          return (<>
                            <defs><marker id={aid} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 Z" fill="#ef4444"/></marker></defs>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" markerEnd={`url(#${aid})`}/>
                          </>)
                        }
                        const CalloutBox = ({x,y,w,h,label,children}) => (<>
                          <rect x={x} y={y} width={w} height={h} rx="6" fill="#0f1f30" stroke="rgba(56,189,248,0.4)" strokeWidth="1.2"/>
                          <text x={x+w/2} y={y+11} textAnchor="middle" fontSize="7.5" fill="#38bdf8" fontWeight="800" letterSpacing="0.8">{label}</text>
                          {children}
                        </>)
                        // CARDIAC 1
                        if (activeEmergencyGuide === 'CARDIAC' && activeStep === 1) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="scC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4db8d4"/><stop offset="100%" stopColor="#1e6a8a"/></linearGradient>
                              <linearGradient id="glC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <filter id="shC1"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <path d="M28 160 Q28 142 50 140 L200 140 Q220 140 220 158 Q220 176 200 178 L50 178 Q28 178 28 160Z" fill="url(#skC1)" filter="url(#shC1)"/>
                            <circle cx="210" cy="158" r="22" fill="url(#skC1)" filter="url(#shC1)"/>
                            <path d="M194 144 Q210 136 226 144" fill="#3d2b1f"/>
                            <ellipse cx="204" cy="159" rx="4" ry="4.5" fill="#fff"/><ellipse cx="216" cy="159" rx="4" ry="4.5" fill="#fff"/>
                            <circle cx="205" cy="160" r="2.5" fill="#1e1e2e"/><circle cx="217" cy="160" r="2.5" fill="#1e1e2e"/>
                            <path d="M75 52 Q75 36 110 32 Q145 36 145 52 L148 138 Q148 148 110 150 Q72 148 72 138Z" fill="url(#scC1)" filter="url(#shC1)"/>
                            <circle cx="110" cy="20" r="20" fill="url(#skC1)" filter="url(#shC1)"/>
                            <path d="M93 10 Q110 2 127 10" fill="#3d2b1f"/>
                            <path d="M75 90 Q52 100 38 128 Q42 140 55 136 Q66 112 82 104Z" fill="url(#glC1)" filter="url(#shC1)"/>
                            <ellipse cx="36" cy="132" rx="13" ry="10" fill="url(#glC1)"/>
                            <circle cx="36" cy="132" r="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" style={{animation:'pingRing 1.8s infinite'}}/>
                            <rect x="14" y="56" width="72" height="54" rx="6" fill="#0a1628" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2"/>
                            <text x="50" y="68" textAnchor="middle" fontSize="7" fill="#38bdf8" fontWeight="800" letterSpacing="0.5">SHOULDER TAP</text>
                            <text x="50" y="80" textAnchor="middle" fontSize="7" fill="#94a3b8">어깨 두드리며</text>
                            <text x="50" y="91" textAnchor="middle" fontSize="7" fill="#94a3b8">의식 여부 확인</text>
                            <line x1="86" y1="76" x2="40" y2="130" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // CARDIAC 2
                        if (activeEmergencyGuide === 'CARDIAC' && activeStep === 2) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="scC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4db8d4"/><stop offset="100%" stopColor="#1e6a8a"/></linearGradient>
                              <linearGradient id="glC2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <filter id="shC2"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35"/></filter>
                              <marker id="arC2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#ef4444"/></marker>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <path d="M20 172 Q20 154 42 152 L196 152 Q218 152 218 170 Q218 188 196 190 L42 190 Q20 190 20 172Z" fill="url(#skC2)" filter="url(#shC2)"/>
                            <circle cx="206" cy="168" r="22" fill="url(#skC2)" filter="url(#shC2)"/>
                            <path d="M190 154 Q206 145 222 154" fill="#3d2b1f"/>
                            <path d="M72 48 Q72 32 110 28 Q148 32 148 48 L150 150 Q150 162 110 164 Q70 162 70 150Z" fill="url(#scC2)" filter="url(#shC2)"/>
                            <circle cx="110" cy="16" r="20" fill="url(#skC2)" filter="url(#shC2)"/>
                            <path d="M93 6 Q110 -2 127 6" fill="#3d2b1f"/>
                            <path d="M72 108 L90 150" stroke="#4db8d4" strokeWidth="14" strokeLinecap="round" style={{animation:'cprPress 0.55s infinite alternate'}}/>
                            <path d="M148 108 L150 150" stroke="#4db8d4" strokeWidth="14" strokeLinecap="round" style={{animation:'cprPress 0.55s infinite alternate'}}/>
                            <rect x="86" y="148" width="48" height="16" rx="6" fill="url(#glC2)" filter="url(#shC2)" style={{animation:'cprPress 0.55s infinite alternate'}}/>
                            <rect x="90" y="158" width="40" height="10" rx="4" fill="#1d4ed8" style={{animation:'cprPress 0.55s infinite alternate'}}/>
                            <line x1="110" y1="128" x2="110" y2="146" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arC2)" style={{animation:'cprPress 0.55s infinite alternate'}}/>
                            <line x1="92" y1="162" x2="76" y2="162" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arC2)"/>
                            <line x1="128" y1="162" x2="144" y2="162" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arC2)"/>
                            <rect x="148" y="48" width="80" height="60" rx="6" fill="#0a1628" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2"/>
                            <text x="188" y="60" textAnchor="middle" fontSize="7" fill="#38bdf8" fontWeight="800" letterSpacing="0.5">STERNUM</text>
                            <rect x="158" y="66" width="60" height="30" rx="4" fill="url(#skC2)"/>
                            <rect x="170" y="72" width="36" height="18" rx="4" fill="url(#glC2)"/>
                            <line x1="158" y1="74" x2="150" y2="82" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arC2)"/>
                            <line x1="218" y1="74" x2="226" y2="82" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arC2)"/>
                            <text x="188" y="106" textAnchor="middle" fontSize="7" fill="#94a3b8">100~120회/분 · 5cm</text>
                            <line x1="148" y1="78" x2="112" y2="150" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                            <path d="M100 100 Q103 93 110 100 Q117 93 120 100 Q120 108 110 116 Q100 108 100 100Z" fill="#f43f5e" style={{animation:'heartBeat 0.55s infinite alternate'}}/>
                          </svg>
                        )
                        // CARDIAC 3
                        if (activeEmergencyGuide === 'CARDIAC' && activeStep === 3) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="aedC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
                              <linearGradient id="glC3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <filter id="shC3"><feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/></filter>
                              <marker id="arC3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#ef4444"/></marker>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <path d="M18 185 Q18 167 40 165 L194 165 Q216 165 216 183 Q216 201 194 203 L40 203 Q18 203 18 185Z" fill="url(#skC3)" filter="url(#shC3)"/>
                            <circle cx="205" cy="182" r="22" fill="url(#skC3)" filter="url(#shC3)"/>
                            <path d="M189 168 Q205 159 221 168" fill="#3d2b1f"/>
                            <rect x="22" y="60" width="92" height="118" rx="12" fill="url(#aedC3)" filter="url(#shC3)"/>
                            <rect x="26" y="64" width="84" height="110" rx="10" fill="#fbbf24"/>
                            <rect x="32" y="72" width="72" height="48" rx="7" fill="#020617"/>
                            <polyline points="35,96 44,96 49,76 54,116 59,76 64,96 76,96 81,84 86,108 91,96 100,96" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" style={{animation:'ecgAnim 1.1s linear infinite'}}/>
                            <circle cx="68" cy="152" r="18" fill="#dc2626" filter="url(#shC3)"/>
                            <circle cx="68" cy="152" r="13" fill="#ef4444"/>
                            <path d="M64 144 L70 152 L65 152 L71 160 L65 152 L70 152Z" fill="#fff"/>
                            <path d="M92 110 Q112 104 130 116" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M92 122 Q114 128 132 142" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round"/>
                            <rect x="120" y="106" width="50" height="28" rx="8" fill="url(#glC3)" filter="url(#shC3)"/>
                            <rect x="120" y="144" width="50" height="28" rx="8" fill="url(#glC3)" filter="url(#shC3)"/>
                            <line x1="145" y1="104" x2="145" y2="86" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arC3)"/>
                            <line x1="145" y1="174" x2="145" y2="192" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arC3)"/>
                            <rect x="148" y="46" width="82" height="46" rx="6" fill="#0a1628" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2"/>
                            <text x="189" y="58" textAnchor="middle" fontSize="7" fill="#38bdf8" fontWeight="800" letterSpacing="0.5">AED PADS</text>
                            <text x="189" y="70" textAnchor="middle" fontSize="7" fill="#94a3b8">우측 쇄골 하단</text>
                            <text x="189" y="81" textAnchor="middle" fontSize="7" fill="#94a3b8">좌측 옆구리 부착</text>
                            <circle cx="220" cy="46" r="5" fill="#22c55e" style={{animation:'vitalPulse 1s infinite'}}/>
                          </svg>
                        )
                        // TRAUMA 1
                        if (activeEmergencyGuide === 'TRAUMA' && activeStep === 1) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skT1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="glT1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <linearGradient id="gzT1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#cbd5e1"/></linearGradient>
                              <filter id="shT1"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                              <marker id="arT1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#ef4444"/></marker>
                            </defs>
                            <ellipse cx="120" cy="248" rx="75" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <path d="M55 72 Q48 68 46 85 L46 210 Q46 224 70 226 Q94 228 104 226 Q128 224 132 210 L136 85 Q136 68 126 72 Q116 68 95 66 Q74 65 55 72Z" fill="url(#skT1)" filter="url(#shT1)"/>
                            <ellipse cx="91" cy="148" rx="24" ry="15" fill="#be123c"/>
                            <path d="M72 148 Q91 136 110 148" fill="#9f1239"/>
                            <rect x="64" y="126" width="54" height="38" rx="7" fill="url(#gzT1)" filter="url(#shT1)" style={{animation:'pressDown 0.8s infinite alternate'}}/>
                            <line x1="91" y1="128" x2="91" y2="162" stroke="#94a3b8" strokeWidth="1.5"/>
                            <line x1="66" y1="145" x2="116" y2="145" stroke="#94a3b8" strokeWidth="1.5"/>
                            <path d="M44 112 Q34 118 30 132 Q30 148 46 148 L64 144 Q64 130 68 122Z" fill="url(#glT1)" filter="url(#shT1)" style={{animation:'pressDown 0.8s infinite alternate'}}/>
                            <path d="M138 112 Q148 118 152 132 Q152 148 136 148 L118 144 Q118 130 114 122Z" fill="url(#glT1)" filter="url(#shT1)" style={{animation:'pressDown 0.8s infinite alternate'}}/>
                            <line x1="91" y1="108" x2="91" y2="124" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arT1)" style={{animation:'pressDown 0.8s infinite alternate'}}/>
                            <circle cx="84" cy="175" r="4" fill="#be123c" style={{animation:'dropFall 1.1s infinite'}}/>
                            <circle cx="99" cy="180" r="3" fill="#be123c" style={{animation:'dropFall 1.1s 0.35s infinite'}}/>
                            <rect x="148" y="60" width="82" height="56" rx="6" fill="#0a1628" stroke="rgba(244,63,94,0.5)" strokeWidth="1.2"/>
                            <text x="189" y="72" textAnchor="middle" fontSize="7" fill="#f43f5e" fontWeight="800" letterSpacing="0.5">DIRECT PRESSURE</text>
                            <text x="189" y="84" textAnchor="middle" fontSize="7" fill="#94a3b8">거즈 강하게 압박</text>
                            <text x="189" y="95" textAnchor="middle" fontSize="7" fill="#94a3b8">지혈 유지</text>
                            <line x1="148" y1="84" x2="116" y2="138" stroke="rgba(244,63,94,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // TRAUMA 2
                        if (activeEmergencyGuide === 'TRAUMA' && activeStep === 2) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skT2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="bdT2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                              <linearGradient id="spT2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#92400e"/></linearGradient>
                              <filter id="shT2"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                              <marker id="arT2u" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#ef4444"/></marker>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="14" y="195" width="212" height="16" rx="6" fill="#1e293b" filter="url(#shT2)"/>
                            <path d="M22 175 Q22 158 44 156 L148 156 Q170 156 170 174 Q170 192 148 194 L44 194 Q22 194 22 175Z" fill="url(#bdT2)" filter="url(#shT2)"/>
                            <circle cx="182" cy="173" r="22" fill="url(#skT2)" filter="url(#shT2)"/>
                            <path d="M165 160 Q182 151 199 160" fill="#3d2b1f"/>
                            <path d="M22 162 Q22 146 36 144 L78 144 Q92 146 92 162 L92 178 Q78 182 36 182Z" fill="url(#skT2)" filter="url(#shT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <path d="M78 142 Q88 125 92 106 L108 107 Q104 128 90 148Z" fill="url(#skT2)" filter="url(#shT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <rect x="24" y="174" width="6" height="38" rx="3" fill="url(#spT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <rect x="84" y="140" width="6" height="38" rx="3" fill="url(#spT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <rect x="24" y="184" width="66" height="5" rx="2" fill="url(#spT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <rect x="24" y="163" width="66" height="5" rx="2" fill="url(#spT2)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <line x1="56" y1="132" x2="56" y2="106" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arT2u)" style={{animation:'legRaise 2.2s ease-in-out infinite alternate'}}/>
                            <rect x="148" y="52" width="82" height="52" rx="6" fill="#0a1628" stroke="rgba(251,191,36,0.5)" strokeWidth="1.2"/>
                            <text x="189" y="64" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="800" letterSpacing="0.5">ELEVATION</text>
                            <text x="189" y="76" textAnchor="middle" fontSize="7" fill="#94a3b8">심장보다 높게 유지</text>
                            <text x="189" y="87" textAnchor="middle" fontSize="7" fill="#94a3b8">부동화 및 고정</text>
                            <line x1="148" y1="76" x2="90" y2="130" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // TRAUMA 3
                        if (activeEmergencyGuide === 'TRAUMA' && activeStep === 3) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skT3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="blT3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6b7280"/><stop offset="100%" stopColor="#374151"/></linearGradient>
                              <filter id="shT3"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="14" y="200" width="212" height="14" rx="5" fill="#1e293b" filter="url(#shT3)"/>
                            <path d="M20 162 Q20 146 42 144 L178 144 Q200 144 200 160 Q200 196 178 198 L42 198 Q20 198 20 180Z" fill="url(#blT3)" filter="url(#shT3)"/>
                            <circle cx="40" cy="162" r="22" fill="url(#skT3)" filter="url(#shT3)"/>
                            <path d="M24 150 Q40 141 56 150" fill="#3d2b1f"/>
                            <ellipse cx="34" cy="163" rx="4" ry="4.5" fill="#fff"/><ellipse cx="46" cy="163" rx="4" ry="4.5" fill="#fff"/>
                            <circle cx="35" cy="164" r="2.5" fill="#1e1e2e"/><circle cx="47" cy="164" r="2.5" fill="#1e1e2e"/>
                            <path d="M84 132 Q92 118 100 132" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" style={{animation:'heatWave 1.4s infinite'}}/>
                            <path d="M110 128 Q120 112 130 128" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" style={{animation:'heatWave 1.4s 0.35s infinite'}}/>
                            <path d="M140 132 Q148 118 156 132" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" style={{animation:'heatWave 1.4s 0.7s infinite'}}/>
                            <circle cx="185" cy="114" r="22" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="2"/>
                            <path d="M175 100 Q185 95 195 100 L195 112 Q185 118 175 112Z" fill="none" stroke="#ef4444" strokeWidth="1.8"/>
                            <line x1="172" y1="98" x2="198" y2="130" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                            <rect x="54" y="50" width="82" height="52" rx="6" fill="#0a1628" stroke="rgba(251,191,36,0.5)" strokeWidth="1.2"/>
                            <text x="95" y="62" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="800" letterSpacing="0.5">SHOCK PREVENTION</text>
                            <text x="95" y="74" textAnchor="middle" fontSize="7" fill="#94a3b8">수평 눕힘 · 보온 유지</text>
                            <text x="95" y="85" textAnchor="middle" fontSize="7" fill="#94a3b8">음식 · 음료 금지</text>
                          </svg>
                        )
                        // UNCONSCIOUS 1
                        if (activeEmergencyGuide === 'UNCONSCIOUS' && activeStep === 1) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skU1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="bdU1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                              <linearGradient id="glU1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <filter id="shU1"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                              <marker id="arU1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 Z" fill="#fbbf24"/></marker>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <path d="M22 185 Q22 167 44 165 L196 165 Q218 165 218 183 Q218 201 196 203 L44 203 Q22 203 22 185Z" fill="url(#bdU1)" filter="url(#shU1)"/>
                            <circle cx="52" cy="178" r="24" fill="url(#skU1)" filter="url(#shU1)" style={{animation:'headTilt 2.5s ease-in-out infinite alternate'}}/>
                            <path d="M34 164 Q52 155 70 164" fill="#3d2b1f"/>
                            <path d="M42 201 Q42 216 52 220 Q62 216 62 201Z" fill="url(#skU1)"/>
                            <path d="M24 192 Q16 184 20 172 L46 200 Q36 202 24 192Z" fill="url(#glU1)" filter="url(#shU1)"/>
                            <ellipse cx="52" cy="154" rx="18" ry="10" fill="url(#glU1)" filter="url(#shU1)"/>
                            <line x1="52" y1="152" x2="52" y2="116" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5,4" markerEnd="url(#arU1)" style={{animation:'airArrow 1.2s infinite alternate'}}/>
                            <rect x="74" y="52" width="84" height="56" rx="6" fill="#0a1628" stroke="rgba(251,191,36,0.5)" strokeWidth="1.2"/>
                            <text x="116" y="64" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="800" letterSpacing="0.5">HEAD-TILT CHIN-LIFT</text>
                            <circle cx="102" cy="88" r="14" fill="url(#skU1)"/>
                            <path d="M88 80 Q102 73 116 80" fill="#3d2b1f"/>
                            <line x1="102" y1="74" x2="102" y2="58" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arU1)"/>
                            <text x="138" y="88" textAnchor="middle" fontSize="7" fill="#94a3b8">기도 개방</text>
                            <line x1="74" y1="80" x2="52" y2="158" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // UNCONSCIOUS 2
                        if (activeEmergencyGuide === 'UNCONSCIOUS' && activeStep === 2) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skU2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="bdU2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b5998"/><stop offset="100%" stopColor="#1e3060"/></linearGradient>
                              <filter id="shU2"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="12" y="200" width="216" height="12" rx="5" fill="#1e293b" filter="url(#shU2)"/>
                            <path d="M28 172 Q28 154 50 152 L158 152 Q180 152 184 164 Q188 178 172 186 L50 192 Q28 192 28 172Z" fill="url(#bdU2)" filter="url(#shU2)"/>
                            <circle cx="50" cy="164" r="22" fill="url(#skU2)" filter="url(#shU2)"/>
                            <path d="M33 152 Q50 143 67 152" fill="#3d2b1f"/>
                            <ellipse cx="43" cy="165" rx="4" ry="4.5" fill="#fff"/><ellipse cx="57" cy="165" rx="4" ry="4.5" fill="#fff"/>
                            <circle cx="44" cy="166" r="2.5" fill="#1e1e2e"/><circle cx="58" cy="166" r="2.5" fill="#1e1e2e"/>
                            <path d="M58 152 Q72 132 96 128 Q112 128 114 138 Q110 148 88 152Z" fill="url(#skU2)" filter="url(#shU2)"/>
                            <path d="M100 158 Q120 148 142 152 Q156 158 152 170 Q136 178 112 172Z" fill="url(#bdU2)" filter="url(#shU2)"/>
                            <path d="M150 165 Q170 156 188 161 Q196 168 192 178 Q176 186 158 178Z" fill="url(#bdU2)" filter="url(#shU2)"/>
                            <rect x="128" y="50" width="98" height="60" rx="6" fill="#0a1628" stroke="rgba(251,191,36,0.5)" strokeWidth="1.2"/>
                            <text x="177" y="62" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="800" letterSpacing="0.5">RECOVERY POSITION</text>
                            <text x="177" y="74" textAnchor="middle" fontSize="7" fill="#94a3b8">측와위 · 기도 확보</text>
                            <text x="177" y="85" textAnchor="middle" fontSize="7" fill="#94a3b8">구토물 기도폐쇄 방지</text>
                            <line x1="128" y1="74" x2="92" y2="150" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // UNCONSCIOUS 3
                        if (activeEmergencyGuide === 'UNCONSCIOUS' && activeStep === 3) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="mnU3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e293b"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
                              <linearGradient id="skU3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="bdU3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                              <filter id="shU3"><feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="30" y="22" width="180" height="128" rx="12" fill="url(#mnU3)" filter="url(#shU3)"/>
                            <rect x="34" y="26" width="172" height="120" rx="10" fill="#020617"/>
                            <rect x="96" y="150" width="48" height="20" rx="4" fill="#1e293b"/>
                            <rect x="72" y="166" width="96" height="8" rx="4" fill="#1e293b"/>
                            <text x="54" y="50" fontSize="8" fill="#475569" fontWeight="700" letterSpacing="0.5">HEART RATE</text>
                            <text x="54" y="72" fontSize="26" fill="#38bdf8" fontWeight="900" style={{animation:'vitalPulse 1s infinite'}}>78</text>
                            <text x="148" y="50" fontSize="8" fill="#475569" fontWeight="700" letterSpacing="0.5">SpO2</text>
                            <text x="148" y="72" fontSize="26" fill="#2dd4bf" fontWeight="900">96%</text>
                            <polyline points="36,122 50,122 56,100 62,144 68,100 74,122 92,122 98,108 104,136 110,122 130,122 136,106 142,122 162,122 168,108 174,122 194,122" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'ecgAnim 1.1s linear infinite'}}/>
                            <path d="M22 208 Q22 190 44 188 L196 188 Q218 188 218 206 Q218 224 196 226 L44 226 Q22 226 22 208Z" fill="url(#bdU3)" filter="url(#shU3)"/>
                            <circle cx="48" cy="205" r="20" fill="url(#skU3)" filter="url(#shU3)"/>
                            <path d="M110 150 Q100 162 84 185" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,3"/>
                            <circle cx="84" cy="185" r="5" fill="#38bdf8" opacity="0.8"/>
                          </svg>
                        )
                        // RESPIRATORY 1
                        if (activeEmergencyGuide === 'RESPIRATORY' && activeStep === 1) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skR1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="scR1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#065f46"/></linearGradient>
                              <filter id="shR1"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="158" y="108" width="22" height="120" rx="10" fill="#1e293b" filter="url(#shR1)"/>
                            <rect x="152" y="212" width="52" height="14" rx="6" fill="#1e293b"/>
                            <path d="M72 118 Q72 100 110 96 Q148 100 148 118 L152 210 Q152 224 110 226 Q68 224 68 210Z" fill="url(#scR1)" filter="url(#shR1)"/>
                            <circle cx="110" cy="76" r="26" fill="url(#skR1)" filter="url(#shR1)"/>
                            <path d="M88 62 Q110 52 132 62" fill="#3d2b1f"/>
                            <ellipse cx="101" cy="78" rx="5" ry="5.5" fill="#fff"/><ellipse cx="119" cy="78" rx="5" ry="5.5" fill="#fff"/>
                            <circle cx="102" cy="79" r="3" fill="#1e1e2e"/><circle cx="120" cy="79" r="3" fill="#1e1e2e"/>
                            <path d="M72 138 Q48 148 36 170 Q40 182 52 178 Q62 160 80 150Z" fill="url(#scR1)" filter="url(#shR1)"/>
                            <path d="M148 138 Q172 148 184 170 Q180 182 168 178 Q158 160 140 150Z" fill="url(#scR1)" filter="url(#shR1)"/>
                            <ellipse cx="34" cy="174" rx="13" ry="10" fill="url(#skR1)"/>
                            <ellipse cx="186" cy="174" rx="13" ry="10" fill="url(#skR1)"/>
                            <path d="M84 52 Q110 36 136 52" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" style={{animation:'breathe 2.2s infinite'}}/>
                            <path d="M74 40 Q110 18 146 40" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" opacity="0.6" style={{animation:'breathe 2.2s 0.5s infinite'}}/>
                            <path d="M64 27 Q110 0 156 27" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" style={{animation:'breathe 2.2s 1s infinite'}}/>
                            <rect x="14" y="58" width="72" height="50" rx="6" fill="#0a1628" stroke="rgba(45,212,191,0.5)" strokeWidth="1.2"/>
                            <text x="50" y="70" textAnchor="middle" fontSize="7" fill="#2dd4bf" fontWeight="800" letterSpacing="0.5">SEMI-FOWLER</text>
                            <text x="50" y="82" textAnchor="middle" fontSize="7" fill="#94a3b8">45도 반좌위 유지</text>
                            <text x="50" y="93" textAnchor="middle" fontSize="7" fill="#94a3b8">호흡 편의 확보</text>
                            <line x1="86" y1="82" x2="80" y2="108" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // RESPIRATORY 2
                        if (activeEmergencyGuide === 'RESPIRATORY' && activeStep === 2) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skR2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="tnR2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94a3b8"/><stop offset="100%" stopColor="#334155"/></linearGradient>
                              <linearGradient id="bdR2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
                              <filter id="shR2"><feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.35"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="160" y="50" width="52" height="150" rx="26" fill="url(#tnR2)" filter="url(#shR2)"/>
                            <rect x="165" y="56" width="42" height="138" rx="21" fill="#64748b"/>
                            <rect x="170" y="42" width="32" height="18" rx="9" fill="#94a3b8"/>
                            <text x="186" y="112" textAnchor="middle" fontSize="12" fill="#2dd4bf" fontWeight="900">O2</text>
                            <circle cx="186" cy="140" r="20" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.5"/>
                            <text x="186" y="136" textAnchor="middle" fontSize="7" fill="#64748b">FLOW</text>
                            <text x="186" y="148" textAnchor="middle" fontSize="10" fill="#2dd4bf" fontWeight="900">15L</text>
                            <path d="M160 88 Q134 80 104 86 Q86 90 76 108" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round"/>
                            <path d="M160 88 Q134 80 104 86 Q86 90 76 108" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M36 132 Q36 114 68 108 Q100 104 104 114 L106 210 Q106 224 70 226 Q34 224 34 210Z" fill="url(#bdR2)" filter="url(#shR2)"/>
                            <circle cx="70" cy="86" r="26" fill="url(#skR2)" filter="url(#shR2)"/>
                            <path d="M50 73 Q70 63 90 73" fill="#3d2b1f"/>
                            <path d="M50 92 Q70 84 90 92 Q96 106 90 120 Q70 128 50 120 Q44 106 50 92Z" fill="rgba(45,212,191,0.2)" stroke="#2dd4bf" strokeWidth="2"/>
                            <circle cx="112" cy="88" r="4" fill="#2dd4bf" style={{animation:'o2Flow 1.4s infinite'}}/>
                            <circle cx="124" cy="85" r="3" fill="#2dd4bf" style={{animation:'o2Flow 1.4s 0.3s infinite'}}/>
                            <circle cx="104" cy="96" r="3" fill="#2dd4bf" style={{animation:'o2Flow 1.4s 0.6s infinite'}}/>
                            <rect x="14" y="38" width="74" height="50" rx="6" fill="#0a1628" stroke="rgba(45,212,191,0.5)" strokeWidth="1.2"/>
                            <text x="51" y="50" textAnchor="middle" fontSize="7" fill="#2dd4bf" fontWeight="800" letterSpacing="0.5">OXYGEN MASK</text>
                            <text x="51" y="62" textAnchor="middle" fontSize="7" fill="#94a3b8">10~15L/분</text>
                            <text x="51" y="73" textAnchor="middle" fontSize="7" fill="#94a3b8">비재호흡 마스크</text>
                            <line x1="88" y1="62" x2="60" y2="100" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        // RESPIRATORY 3
                        if (activeEmergencyGuide === 'RESPIRATORY' && activeStep === 3) return (
                          <svg viewBox={vb} {...S}>
                            <defs>
                              <linearGradient id="skR3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde8c8"/><stop offset="60%" stopColor="#f0b07a"/><stop offset="100%" stopColor="#c47d45"/></linearGradient>
                              <linearGradient id="ihR3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#3730a3"/></linearGradient>
                              <linearGradient id="glR3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
                              <filter id="shR3"><feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/></filter>
                            </defs>
                            <ellipse cx="120" cy="248" rx="80" ry="8" fill="rgba(0,0,0,0.18)"/>
                            <rect x="82" y="36" width="76" height="120" rx="24" fill="url(#ihR3)" filter="url(#shR3)"/>
                            <rect x="87" y="41" width="66" height="110" rx="20" fill="#6366f1"/>
                            <rect x="92" y="24" width="56" height="20" rx="10" fill="#4338ca"/>
                            <rect x="100" y="18" width="40" height="12" rx="6" fill="#818cf8"/>
                            <rect x="94" y="58" width="52" height="64" rx="8" fill="rgba(255,255,255,0.08)"/>
                            <text x="120" y="74" textAnchor="middle" fontSize="8" fill="#c7d2fe" fontWeight="700">BRONCHO</text>
                            <text x="120" y="86" textAnchor="middle" fontSize="8" fill="#c7d2fe" fontWeight="700">DILATOR</text>
                            <path d="M104 108 Q100 96 108 90 Q120 86 132 90 Q140 96 136 108 Q130 118 120 120 Q110 118 104 108Z" fill="rgba(129,140,248,0.25)" stroke="#818cf8" strokeWidth="1.2" style={{animation:'lungExpand 2s infinite'}}/>
                            <rect x="94" y="152" width="52" height="26" rx="10" fill="#312e81" filter="url(#shR3)"/>
                            <rect x="102" y="158" width="36" height="14" rx="6" fill="#1e1b4b"/>
                            <circle cx="120" cy="182" r="5" fill="#a5b4fc" style={{animation:'spray 0.9s infinite'}}/>
                            <circle cx="107" cy="190" r="4" fill="#a5b4fc" style={{animation:'spray 0.9s 0.15s infinite'}}/>
                            <circle cx="133" cy="190" r="4" fill="#a5b4fc" style={{animation:'spray 0.9s 0.3s infinite'}}/>
                            <circle cx="112" cy="200" r="3.5" fill="#818cf8" style={{animation:'spray 0.9s 0.45s infinite'}}/>
                            <circle cx="128" cy="201" r="3.5" fill="#818cf8" style={{animation:'spray 0.9s 0.6s infinite'}}/>
                            <path d="M82 110 Q66 116 56 132 Q58 146 70 148 Q84 140 88 126Z" fill="url(#glR3)" filter="url(#shR3)"/>
                            <path d="M158 110 Q174 116 184 132 Q182 146 170 148 Q156 140 152 126Z" fill="url(#glR3)" filter="url(#shR3)"/>
                            <rect x="14" y="40" width="74" height="56" rx="6" fill="#0a1628" stroke="rgba(129,140,248,0.5)" strokeWidth="1.2"/>
                            <text x="51" y="52" textAnchor="middle" fontSize="7" fill="#818cf8" fontWeight="800" letterSpacing="0.5">INHALER ASSIST</text>
                            <text x="51" y="64" textAnchor="middle" fontSize="7" fill="#94a3b8">천식·COPD 병력 확인</text>
                            <text x="51" y="75" textAnchor="middle" fontSize="7" fill="#94a3b8">흡입 보조 · 심호흡 유도</text>
                            <line x1="88" y1="66" x2="90" y2="110" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
                          </svg>
                        )
                        return null
                        return null
                      }

                      return (
                        <div key={key} className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 36 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {guide.steps.map((s, i) => (
                              <StepItem key={i} num={i + 1} title={s.title} desc={s.desc}
                                active={activeStep === i + 1}
                                onClick={() => setActiveStep(i + 1)}
                              />
                            ))}
                          </div>
                          <div style={{
                            background: bg, borderRadius: 28,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            border: `1px solid ${border}`, minHeight: 280,
                            boxShadow: `0 8px 40px ${color}22`,
                            position: 'relative', overflow: 'hidden',
                            padding: '24px 16px'
                          }}>
                            {/* 3D perspective bg rings */}
                            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', border: `1px solid ${color}18`, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotateX(60deg)', pointerEvents: 'none' }}/>
                            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `1px solid ${color}28`, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotateX(60deg)', pointerEvents: 'none' }}/>
                            <div style={{ filter: `drop-shadow(0 8px 24px ${color}55)` }}>
                              <Anim3D />
                            </div>
                            <div style={{ fontSize: 14, color, fontWeight: 800, letterSpacing: '0.04em', marginTop: 8, textAlign: 'center' }}>{label}</div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Fixed Bottom Chat Bar */}
              <div style={{ padding: '20px 40px 36px 40px', background: 'transparent', zIndex: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(8, 14, 28, 0.75)',
                  borderRadius: 24, padding: '10px 14px 10px 18px',
                  border: '1px solid rgba(56,189,248,0.25)',
                  boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                }}>
                  <button style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <Mic size={20} color="#38bdf8" />
                  </button>
                  <input
                    placeholder="환자 증상 입력 또는 AI 의료 어시스턴트에게 질문하기..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                    style={{ flex: 1, background: 'none', border: 'none', color: '#e2e8f0', fontSize: 18, outline: 'none', padding: '8px 4px', letterSpacing: '0.01em' }}
                  />
                  <button onClick={handlePromptAnalysis} style={{
                    padding: '10px 28px', borderRadius: 16,
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                    color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: 17,
                    boxShadow: '0 4px 20px rgba(56,189,248,0.35)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <Activity size={18} /> 분석 실행
                  </button>
                </div>
              </div>
            </section>

            {/* [Right] AI Assistant Panel */}
            <aside style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden', height: '100%' }}>
              <div style={{ padding: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Activity size={22} color="#38bdf8" /> MDTS AI 의료 어시스턴트
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Edge-AI Diagnostic Center</div>
                </div>
                <div className="flow-light-bar"></div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chat.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                    {m.role === 'ai' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Activity size={13} color="#000" />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>MDTS AI</span>
                      </div>
                    )}
                    <div
                      className={m.role === 'ai' ? 'ai-message-highlight' : ''}
                      style={{
                        padding: '12px 16px',
                        borderRadius: m.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                        background: m.role === 'ai'
                          ? 'rgba(56,189,248,0.1)'
                          : 'rgba(99,102,241,0.18)',
                        border: `1px solid ${m.role === 'ai' ? 'rgba(56,189,248,0.22)' : 'rgba(99,102,241,0.3)'}`,
                        maxWidth: '88%',
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: m.role === 'ai' ? '#e2e8f0' : '#c7d2fe',
                        boxShadow: m.role === 'ai'
                          ? '0 2px 12px rgba(56,189,248,0.08)'
                          : '0 2px 12px rgba(99,102,241,0.1)',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {m.text}
                    </div>
                    {m.role === 'user' && (
                      <span style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>의료진</span>
                    )}
                  </div>
                ))}
                <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, lineHeight: 1.8, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>예)</span>{' '}
                  <span style={{ color: '#94a3b8' }}>"흉통 호소"</span>
                  <span style={{ color: '#475569', margin: '0 6px' }}>·</span>
                  <span style={{ color: '#94a3b8' }}>"혈압 140/90, 심박수 110"</span>
                </div>
              </div>
              <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080b12', flexShrink: 0, zIndex: 10 }}>
                <button
                  onClick={() => {
                    setView('dashboard')
                    setActiveTab('DASHBOARD')
                    setChat(prev => [...prev, { role: 'ai', text: '외상 이미지 분석 시작 · MobileNet V3 활성' }])
                    setTimeout(() => {
                      setChat(prev => [...prev, { role: 'ai', text: '분석 완료 · 중증 열상(Laceration) 감지 · 즉각 지혈 처치 가이드 확인 요망' }])
                      setActiveEmergencyGuide('TRAUMA')
                      setActiveTab('GUIDE')
                    }, 2000)
                  }}
                  className="trauma-capture-btn"
                  style={{
                    width: '100%', padding: '22px', borderRadius: 18,
                    background: '#0ea5e9', color: '#fff', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer',
                    fontWeight: 800, fontSize: 20, transition: '0.2s'
                  }}
                >
                  <Camera size={26} /> 외상 촬영 & AI 분석
                </button>
              </div>
            </aside>
          </div>
        )}

        {view === 'crew' && (
          <div style={{ flex: 1, padding: 45, overflowY: 'auto', background: '#05070a' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ marginBottom: 45 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 27 }}>선원 정보 관리 <span style={{ color: '#64748b', fontSize: 20, marginLeft: 14 }}>전체 {crewList.length}명</span></h1>
                
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: '0 27px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 25px rgba(0,0,0,0.2)' }}>
                    <Search size={28} color="#38bdf8" />
                    <input 
                      placeholder="이름 또는 사번으로 선원 검색..." 
                      value={crewSearch}
                      onChange={e => setCrewSearch(e.target.value)}
                      style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 20, height: 80, outline: 'none' }} 
                    />
                  </div>
                  <button 
                    onClick={() => { setShowModal('create'); setSelectedCrew({ id: `CREW-${100 + crewList.length}`, name: '', role: '선원', age: '', blood: 'A+', history: '', status: '건강' }) }}
                    style={{ height: 80, background: '#38bdf8', color: '#000', border: 'none', borderRadius: 20, padding: '0 40px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}
                  >
                    <Plus size={28} /> 신규 등록
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 14 }}>
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => setCrewRoleTab(role)}
                    style={{
                      flex: 1,
                      padding: '12px 10px', borderRadius: 14, border: 'none',
                      background: crewRoleTab === role ? '#38bdf8' : 'transparent',
                      color: crewRoleTab === role ? '#000' : '#64748b',
                      fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: '0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              
              <div style={{ background: '#0f172a', borderRadius: 27, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 12px 50px rgba(0,0,0,0.3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: 16, fontWeight: 800 }}>
                      <th style={{ padding: '27px' }}>사번 (ID)</th>
                      <th style={{ padding: '27px' }}>선원명</th>
                      <th style={{ padding: '27px' }}>직책</th>
                      <th style={{ padding: '27px' }}>나이</th>
                      <th style={{ padding: '27px' }}>혈액형</th>
                      <th style={{ padding: '27px' }}>상태</th>
                      <th style={{ padding: '27px', textAlign: 'right' }}>환자 전환 및 상세 관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrew.map((crew, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: '0.2s', background: activePatient.id === crew.id ? 'rgba(56,189,248,0.05)' : 'transparent' }}>
                        <td style={{ padding: '27px', color: '#38bdf8', fontWeight: 800 }}>{crew.id}</td>
                        <td style={{ padding: '27px', fontWeight: 700, fontSize: 18 }}>{crew.name}</td>
                        <td style={{ padding: '27px', color: '#94a3b8' }}>{crew.role}</td>
                        <td style={{ padding: '27px' }}>{crew.age}세</td>
                        <td style={{ padding: '27px' }}>{crew.blood}</td>
                        <td style={{ padding: '27px' }}>
                          <span style={{ padding: '8px 14px', borderRadius: 9, background: '#2dd4bf20', color: '#2dd4bf', fontSize: 14, fontWeight: 800 }}>{crew.status}</span>
                        </td>
                        <td style={{ padding: '27px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 32, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button 
                              onClick={() => switchPatient(crew)}
                              style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}
                            >
                              환자 전환
                            </button>
                            <div style={{ display: 'flex', gap: 14 }}>
                              <button 
                                onClick={() => { setShowModal('edit'); setSelectedCrew(crew) }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                              >
                                <Edit3 size={24}/>
                              </button>
                              <button 
                                onClick={() => { setShowModal('delete'); setSelectedCrew(crew) }}
                                style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                              >
                                <Trash2 size={24}/>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- Global Modal UI --- */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: '#0f172a', width: '100%', maxWidth: (showModal === 'delete' ? 450 : 600), borderRadius: 27, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              
              <div style={{ padding: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize: 22, fontWeight: 900 }}>
                  {showModal === 'create' && '신규 선원 등록'}
                  {showModal === 'edit' && '선원 정보 수정'}
                  {showModal === 'delete' && '선원 삭제 확인'}
                </h2>
                <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                </button>
              </div>

              <div style={{ padding: 32 }}>
                {showModal === 'delete' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(251,113,133,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <AlertTriangle size={36} color="#fb7185" />
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>선원 정보를 삭제하시겠습니까?</p>
                    <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>삭제된 데이터는 복구할 수 없습니다. <br/>(<span style={{ color: '#fff' }}>{selectedCrew?.name} / {selectedCrew?.role}</span>)</p>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: 18, borderRadius: 14, background: '#1e293b', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>취소</button>
                      <button onClick={() => { setCrewList(prev => prev.filter(c => c.id !== selectedCrew.id)); setShowModal(null) }} style={{ flex: 1, padding: 18, borderRadius: 14, background: '#fb7185', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>삭제 실행</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="선원 이름" value={selectedCrew?.name} onChange={v => setSelectedCrew({...selectedCrew, name: v})} placeholder="성함 입력" />
                      <ModalField label="사번 (ID)" value={selectedCrew?.id} readOnly />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="직책" value={selectedCrew?.role} onChange={v => setSelectedCrew({...selectedCrew, role: v})} placeholder="직책 입력 (예 : 선장)" />
                      <ModalField label="나이" value={selectedCrew?.age} onChange={v => setSelectedCrew({...selectedCrew, age: v})} placeholder="숫자만 입력" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ModalField label="혈액형" value={selectedCrew?.blood} onChange={v => setSelectedCrew({...selectedCrew, blood: v})} placeholder="예 : A+" />
                      <ModalField label="현재 상태" value={selectedCrew?.status} onChange={v => setSelectedCrew({...selectedCrew, status: v})} placeholder="예 : 건강" />
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8, fontWeight: 700 }}>과거력 (Past History)</label>
                      <textarea 
                        value={selectedCrew?.history}
                        onChange={e => setSelectedCrew({...selectedCrew, history: e.target.value})}
                        placeholder="특이사항 및 지병 입력"
                        style={{ width: '100%', height: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, color: '#fff', outline: 'none', fontSize: 15 }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (showModal === 'create') setCrewList([selectedCrew, ...crewList])
                        else setCrewList(crewList.map(c => c.id === selectedCrew.id ? selectedCrew : c))
                        setShowModal(null)
                      }}
                      style={{ marginTop: 12, padding: 20, borderRadius: 14, background: '#38bdf8', color: '#000', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: 18 }}
                    >
                      {showModal === 'create' ? '신규 등록 완료' : '정보 수정 저장'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div style={{ flex: 1, padding: 45, background: '#05070a', overflowY: 'auto' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>시스템 설정 및 관리</h1>
              <div style={{ display: 'grid', gap: 32 }}>
                <SettingCard icon={<Ship size={28}/>} title="선박 정보 관리" desc="시스템이 설치된 선박의 정보를 관리하고 수정합니다.">
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <input placeholder="선박명" defaultValue={SHIP_INFO.name} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                      <input placeholder="선박 종류" defaultValue={SHIP_INFO.type} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                      <button style={{ padding: '10px 20px', borderRadius: 10, background: '#38bdf8', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>정보 수정</button>
                      <button style={{ padding: '10px 20px', borderRadius: 10, background: '#fb7185', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>선박 삭제</button>
                    </div>
                  </div>
                </SettingCard>
                
                <SettingCard icon={<Database size={28}/>} title="데이터 동기화 설정" desc="클라우드 센터와의 실시간 데이터 동기화 상태를 관리합니다.">
                  <div style={{ marginTop: 20, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ color: '#94a3b8' }}>마지막 동기화 시각</span>
                      <span style={{ fontWeight: 800 }}>2026-04-09 14:30:15</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>동기화 대기 항목</span>
                      <span style={{ color: '#38bdf8', fontWeight: 800 }}>0건 (완료)</span>
                    </div>
                    <button style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 12, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)', fontWeight: 800, cursor: 'pointer' }}>지금 즉시 동기화</button>
                  </div>
                </SettingCard>

                <SettingCard icon={<Shield size={28}/>} title="AI 모델 업데이트" desc="최신 Edge AI 모델 엔진 상태를 점검합니다.">
                  <div style={{ marginTop: 20, padding: 20, background: 'rgba(45, 212, 191, 0.05)', borderRadius: 18, border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <CheckCircle size={24} color="#2dd4bf" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#2dd4bf' }}>최신 버전 사용 중</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Engine: MobileNet V3.5-Turbo (Updated: 2026-04-01)</div>
                      </div>
                    </div>
                  </div>
                </SettingCard>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        .fade-in { }
        @keyframes aiHighlight {
          0% { border-color: rgba(56,189,248,0.2); box-shadow: 0 0 0px rgba(56,189,248,0); }
          50% { border-color: rgba(56,189,248,0.6); box-shadow: 0 0 20px rgba(56,189,248,0.3); }
          100% { border-color: rgba(56,189,248,0.2); box-shadow: 0 0 0px rgba(56,189,248,0); }
        }
        @keyframes flowLight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .flow-light-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          animation: flowLight 2s infinite linear;
        }
        .ai-message-highlight { animation: aiHighlight 2s infinite ease-in-out; }
        @keyframes questionPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.3); } }
        @keyframes pingRing { 0% { r:45; opacity:0.6; } 100% { r:75; opacity:0; } }
        @keyframes heartBeat { 0% { transform:scale(1); } 100% { transform:scale(1.25); } }
        @keyframes cprPress { 0% { transform:translateY(0); } 100% { transform:translateY(8px); } }
        @keyframes ecgAnim { 0% { stroke-dashoffset:200; } 100% { stroke-dashoffset:0; } }
        @keyframes zapPulse { 0% { opacity:0.5; transform:scale(0.9); } 100% { opacity:1; transform:scale(1.1); } }
        @keyframes dropFall { 0% { transform:translateY(0); opacity:1; } 100% { transform:translateY(16px); opacity:0; } }
        @keyframes pressDown { 0% { transform:translateY(0); } 100% { transform:translateY(6px); } }
        @keyframes legRaise { 0% { transform:translateY(4px); } 100% { transform:translateY(-8px); } }
        @keyframes arrowBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes headTilt { 0% { transform:rotate(0deg); } 100% { transform:rotate(8deg); } }
        @keyframes airArrow { 0% { opacity:0.4; } 100% { opacity:1; } }
        @keyframes airwayGlow { 0%,100% { opacity:0.3; rx:8; ry:15; } 50% { opacity:0.9; rx:10; ry:18; } }
        @keyframes vitalPulse { 0%,100% { fill:#38bdf8; } 50% { fill:#7dd3fc; } }
        @keyframes breathe { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        @keyframes chestExpand { 0%,100% { rx:35; ry:20; opacity:0.3; } 50% { rx:42; ry:26; opacity:0.7; } }
        @keyframes o2Flow { 0% { transform:translateX(0) translateY(0); opacity:0.8; } 100% { transform:translateX(-18px) translateY(8px); opacity:0; } }
        @keyframes spray { 0% { transform:translateY(0) scale(1); opacity:0.9; } 100% { transform:translateY(18px) scale(0.5); opacity:0; } }
        @keyframes lungExpand { 0%,100% { transform:scale(1); opacity:0.15; } 50% { transform:scale(1.15); opacity:0.3; } }
        @keyframes heatWave { 0%,100% { opacity:0.3; transform:translateY(0); } 50% { opacity:1; transform:translateY(-4px); } }
        .emergency-action-btn:hover { background: #e11d48 !important; }
        .trauma-capture-btn:hover { background: #0369a1 !important; box-shadow: 0 4px 20px rgba(3,105,161,0.5) !important; }
        .trauma-capture-btn:active { background: #075985 !important; box-shadow: 0 2px 8px rgba(7,89,133,0.6) !important; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}

// --- Helper Components ---

function NavTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      background: 'none', border: 'none', padding: '0 28px', height: '100%',
      color: active ? '#38bdf8' : '#64748b', fontSize: 24, fontWeight: 900,
      borderBottom: `5px solid ${active ? '#38bdf8' : 'transparent'}`,
      cursor: 'pointer', transition: '0.2s'
    }}>{label}</button>
  )
}

function DashboardVital({ label, value, unit, color, editable, onEdit, live }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: '14px 14px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative' }}>
      {live && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: color,
          animation: 'pulse-dot 1.4s ease-in-out infinite'
        }} />
      )}
      <div style={{ fontSize: 18, fontWeight: 800, color: '#64748b', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10 }}>
        <span style={{ fontSize: 36, fontWeight: 950, color }}>{value}</span>
        <span style={{ fontSize: 20, color: '#64748b', fontWeight: 500 }}>{unit}</span>
      </div>
      {editable && (
        <button onClick={onEdit} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          <Edit3 size={22} />
        </button>
      )}
    </div>
  )
}

function TimelineItem({ time, label, detail, highlight }) {
  return (
    <div style={{ marginBottom: 48, position: 'relative' }}>
      <div style={{ position: 'absolute', left: -45, top: 12, width: 20, height: 20, borderRadius: '50%', background: highlight ? '#f43f5e' : '#38bdf8', boxShadow: highlight ? '0 0 25px #f43f5e' : '0 0 15px rgba(56,189,248,0.4)' }} />
      <div style={{ fontSize: 18.5, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{time}</div>
      <div style={{ fontSize: 22, fontWeight: 950, color: highlight ? '#fb7185' : '#e2e8f0', letterSpacing: '-0.5px', lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 }}>{detail}</div>
    </div>
  )
}

function StepItem({ num, title, desc, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  const isHighlight = active || hovered
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 20, padding: 20, borderRadius: 20, cursor: 'pointer',
        background: active ? 'rgba(56,189,248,0.08)' : hovered ? 'rgba(56,189,248,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? 'rgba(56,189,248,0.3)' : hovered ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.2s',
        boxShadow: active ? '0 4px 24px rgba(56,189,248,0.12)' : hovered ? '0 2px 12px rgba(56,189,248,0.06)' : 'none',
        transform: hovered && !active ? 'translateX(4px)' : 'none',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: active ? 'linear-gradient(135deg,#38bdf8,#0ea5e9)' : hovered ? 'rgba(56,189,248,0.2)' : '#1e293b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 900,
        color: active ? '#000' : hovered ? '#38bdf8' : '#64748b',
        boxShadow: active ? '0 0 16px rgba(56,189,248,0.5)' : 'none',
        transition: 'all 0.2s',
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 18.5, fontWeight: 800, marginBottom: 4, color: isHighlight ? '#38bdf8' : '#fff', transition: 'color 0.2s' }}>{title}</div>
        <div style={{ fontSize: 17, color: isHighlight ? '#cbd5e1' : '#94a3b8', lineHeight: 1.5, transition: 'color 0.2s' }}>{desc}</div>
      </div>
    </div>
  )
}

function SymptomTab({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 24px', borderRadius: 12, border: `1px solid ${active ? '#38bdf8' : hovered ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.05)'}`,
        background: active ? '#38bdf8' : hovered ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.03)',
        color: active ? '#000' : hovered ? '#38bdf8' : '#64748b',
        fontWeight: 800, fontSize: 20, cursor: 'pointer',
        transform: hovered && !active ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 4px 16px rgba(56,189,248,0.3)' : hovered ? '0 4px 12px rgba(56,189,248,0.1)' : 'none'
      }}
    >{label}</button>
  )
}

function SectionTitle({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
}

function InfoItem({ label, value, span = 1, size }) {
  const valueSize = size === 'xl_ultra' ? 32 : (size === 'xl_max' ? 28 : (size === 'xl_plus' ? 25 : (size === 'xl' ? 22 : (size === 'large' ? 18 : 13))))
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 18, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 800 }}>{value}</div>
    </div>
  )
}

function ActionBtn({ icon, label, highlight, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', padding: '16px 20px', borderRadius: 14, 
        background: active ? 'rgba(56,189,248,0.15)' : (highlight ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)'), 
        border: `1px solid ${active || highlight ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}`,
        color: active || highlight ? '#38bdf8' : '#94a3b8', 
        fontSize: 14, fontWeight: 800,
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
        transition: '0.2s',
        boxShadow: active ? '0 4px 12px rgba(56,189,248,0.1)' : 'none'
      }}
    >
      <div style={{ color: active || highlight ? '#38bdf8' : '#64748b' }}>{icon}</div>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={16} style={{ transform: active ? 'rotate(90deg)' : 'none', transition: '0.2s', opacity: 0.5 }} />
    </button>
  )
}

function LoginInput({ icon, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: focused ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 13, padding: '0 18px', border: `1px solid ${focused ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.2s', boxShadow: focused ? '0 0 0 3px rgba(56,189,248,0.08)' : 'none' }}>
      <div style={{ color: focused ? '#38bdf8' : '#475569', transition: 'color 0.2s' }}>{icon}</div>
      <input
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, height: 52, outline: 'none' }}
      />
    </div>
  )
}

function SettingCard({ icon, title, desc, children }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ color: '#38bdf8' }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>{desc}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

function ModalField({ label, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8, fontWeight: 700 }}>{label}</label>
      <input 
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ 
          width: '100%', background: readOnly ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px', 
          color: readOnly ? '#475569' : '#fff', outline: 'none', fontSize: 16
        }} 
      />
    </div>
  )
}

function ShipSelect({ label, value, active }) {
  return (
    <div style={{ padding: '12px 20px', borderRadius: 12, background: active ? '#38bdf820' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer' }}>
      <div style={{ fontSize: 10, color: active ? '#38bdf8' : '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: active ? '#38bdf8' : '#fff' }}>{value}</div>
    </div>
  )
}
