import React, { useState, useEffect, useMemo } from 'react'
import {
  Ship, Clock, RefreshCw, Signal, Shield, TrendingUp, CheckCircle2,
  Phone, Send, Inbox, BookOpen, Users, ChevronDown, ChevronRight,
  Lock, Terminal, Download, Search, Edit2, Save, Heart, Cpu,
  HardDrive, MapPin, Activity, Wifi, AlertCircle, ShieldCheck, Pill
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  CartesianGrid, RadialBarChart, RadialBar, Legend
} from 'recharts'

const C = {
  bg: '#0b0c10', panel: '#111318', panel2: '#161b22',
  border: '#1e2533', border2: '#252d3a',
  text: '#c9cdd4', sub: '#4e5a6b', dim: '#252d3a',
  success: '#26de81', warning: '#fb923c', danger: '#ff4d6d',
  info: '#38bdf8', purple: '#a78bfa', cyan: '#0dd9c5', yellow: '#facc15',
}

/* ─── 데이터 ─── */
const CREW = [
  { id:'S26-001', name:'이선장', role:'선장', dept:'항해부', chronic:'고혈압', allergies:'없음', isEmergency:true, lastMed:'암로디핀 5mg', age:52 },
  { id:'S26-002', name:'김항해', role:'1등 항해사', dept:'항해부', chronic:'없음', allergies:'페니실린', isEmergency:false, lastMed:'없음', age:45 },
  { id:'S26-003', name:'박기관', role:'기관장', dept:'기관부', chronic:'고혈압, 고지혈증', allergies:'아스피린', isEmergency:true, lastMed:'암로디핀 5mg, 리피토', age:55 },
  { id:'S26-004', name:'최갑판', role:'갑판장', dept:'항해부', chronic:'허리디스크', allergies:'없음', isEmergency:false, lastMed:'없음', age:41 },
  { id:'S26-005', name:'정조타', role:'조타사', dept:'항해부', chronic:'없음', allergies:'조개류', isEmergency:false, lastMed:'없음', age:38 },
  { id:'S26-006', name:'한닻별', role:'2등 항해사', dept:'항해부', chronic:'비염', allergies:'먼지', isEmergency:false, lastMed:'항히스타민제', age:35 },
  { id:'S26-007', name:'윤나침', role:'3등 항해사', dept:'항해부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:32 },
  { id:'S26-008', name:'강바다', role:'항해사', dept:'항해부', chronic:'없음', allergies:'복숭아', isEmergency:false, lastMed:'없음', age:29 },
  { id:'S26-009', name:'조항구', role:'조리장', dept:'지원부', chronic:'당뇨', allergies:'없음', isEmergency:false, lastMed:'메트포르민', age:50 },
  { id:'S26-010', name:'심망원', role:'갑판원', dept:'항해부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:27 },
  { id:'S26-011', name:'백전기', role:'전기사', dept:'기관부', chronic:'없음', allergies:'벌침', isEmergency:false, lastMed:'없음', age:43 },
  { id:'S26-012', name:'고기압', role:'1등 기관사', dept:'기관부', chronic:'통풍', allergies:'없음', isEmergency:false, lastMed:'페북소스타트', age:47 },
  { id:'S26-013', name:'서냉각', role:'2등 기관사', dept:'기관부', chronic:'없음', allergies:'땅콩', isEmergency:false, lastMed:'없음', age:39 },
  { id:'S26-014', name:'엄연소', role:'3등 기관사', dept:'기관부', chronic:'위염', allergies:'없음', isEmergency:false, lastMed:'겔포스', age:34 },
  { id:'S26-015', name:'송냉동', role:'조기장', dept:'기관부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:40 },
  { id:'S26-016', name:'유기름', role:'조기수', dept:'기관부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:28 },
  { id:'S26-017', name:'임사무', role:'사무장', dept:'지원부', chronic:'불면증', allergies:'없음', isEmergency:false, lastMed:'스틸녹스', age:36 },
  { id:'S26-018', name:'나서빙', role:'조리원', dept:'지원부', chronic:'없음', allergies:'우유', isEmergency:false, lastMed:'없음', age:31 },
  { id:'S26-019', name:'지갑판', role:'실습 항해사', dept:'항해부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:26 },
  { id:'S26-020', name:'홍기관', role:'실습 기관사', dept:'기관부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:25 },
  { id:'S26-021', name:'문통신', role:'통신장', dept:'항해부', chronic:'안구건조증', allergies:'없음', isEmergency:false, lastMed:'인공눈물', age:44 },
  { id:'S26-022', name:'탁목수', role:'갑판부 목수', dept:'항해부', chronic:'손목터널증후군', allergies:'없음', isEmergency:false, lastMed:'파스', age:49 },
  { id:'S26-023', name:'방어망', role:'냉동사', dept:'기관부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:37 },
  { id:'S26-024', name:'하정비', role:'기수', dept:'기관부', chronic:'치질', allergies:'없음', isEmergency:false, lastMed:'없음', age:42 },
  { id:'S26-025', name:'장빨래', role:'세탁원', dept:'지원부', chronic:'습진', allergies:'세제', isEmergency:false, lastMed:'연고', age:33 },
  { id:'S26-026', name:'한청결', role:'위생원', dept:'지원부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:30 },
]

const CHECKLIST = [
  'AED 배터리 상태 확인','산소통 잔량 확인 (50% 이상)',
  '구급함 잠금 해제 확인','척추고정보드 위치 확인',
  '지혈대(T-kit) 수량 확인','원격의료센터 접속 확인',
  'MDTS 기기 정상 작동 확인','당직 의료 인력 배치 확인',
]

const SOP_LIST = [
  { code:'CPR-01', title:'심장 압박 및 전기 충격', cat:'심장 정지', color:C.danger },
  { code:'HEI-07', title:'목에 걸린 이물질 제거', cat:'음식물 걸림', color:C.warning },
  { code:'AIR-03', title:'숨길 열기 및 산소 공급', cat:'호흡 곤란', color:C.info },
  { code:'BLD-02', title:'피나는 곳 누르기(지혈)', cat:'심한 출혈', color:C.danger },
  { code:'BRN-08', title:'화상 부위 식히기', cat:'불/열 화상', color:C.yellow },
  { code:'HYP-05', title:'물에 빠진 선원 구조', cat:'체온 저하', color:C.cyan },
  { code:'FRC-04', title:'뼈 부러진 곳 고정하기', cat:'뼈/관절 다침', color:C.purple },
  { code:'WND-06', title:'상처 씻기 및 소독', cat:'상처 보호', color:C.success },
]

const SYS_LOGS = [
  { t:'09:31', type:'success', msg:'박기관 바이탈 → 부산원격의료센터 전송 완료' },
  { t:'09:28', type:'info',    msg:'원격 의료 연결 세션 시작 · 최원장 접속 확인' },
  { t:'09:25', type:'warning', msg:'이선장 혈압 148/95 — 주의 임계값 초과' },
  { t:'09:20', type:'success', msg:'AI 외상 분석 완료 — 박기관 좌측 흉부 골절 의심' },
  { t:'09:10', type:'error',   msg:'위성 전송 실패 — 재시도 대기 중 (3회 시도)' },
  { t:'09:05', type:'success', msg:'MDTS 시스템 정상 부팅 · 모든 센서 연결 확인' },
]

function genSignal() {
  return Array.from({ length: 24 }, (_, i) => ({
    h: `${i}시`, v: Math.floor(Math.random() * 25) + 70,
  }))
}

function riskOf(c) {
  if (c.isEmergency) return C.danger
  const ch = c.chronic === '없음' ? 0 : c.chronic.split(',').length
  const dr = ['아스피린','페니실린'].includes(c.allergies)
  return ch >= 2 || dr ? C.danger : ch === 1 || c.lastMed !== '없음' ? C.warning : C.success
}

function logColor(type) {
  return { success:C.success, info:C.info, warning:C.warning, error:C.danger }[type] ?? C.sub
}

/* ═══════════════════════════════════ MAIN ═════════════════════════════════ */
export default function Settings() {
  const [now, setNow] = useState(new Date())
  const [checks, setChecks] = useState({ 0: true, 1: true, 6: true })
  const [collapsed, setCollapsed] = useState({})
  const [sopIdx, setSopIdx] = useState(null)
  const [logFilter, setLogFilter] = useState('전체')
  const [logSearch, setLogSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState({ ship:'MV KOREA STAR', no:'MED-001', sn:'MDTS-2024-KS-001', type:'컨테이너선', imo:'IMO 9876543', warranty:'2027-01-10', inspect:'2026-07-10' })
  const [devEdit, setDevEdit] = useState({ ...device })
  const [sec, setSec] = useState({ bio:true, enc:true, auto:true })
  const [signal] = useState(genSignal)
  const [coords, setCoords] = useState({ lat: '35.1028° N', lng: '129.0403° E' })

  const [trainingList, setTrainingList] = useState(() => {
    try { 
      const saved = localStorage.getItem('mdts_training')
      return saved ? JSON.parse(saved) : [
        { name: '김항해', type: '기본 CPR', expiry: '2026-12-15' },
        { name: '이선장', type: '고급 응급처치', expiry: '2026-05-20' },
      ]
    } catch { return [] }
  })
  const [showAddTraining, setShowAddForm] = useState(false)
  const [newTraining, setNewTraining] = useState({ name: '', type: '기본 CPR', expiry: '' })

  const [managerList, setManagerList] = useState(() => {
    try {
      const saved = localStorage.getItem('mdts_managers')
      return saved ? JSON.parse(saved) : [
        { id: 'm1', name: '이선장', role: '안전책임자' },
        { id: 'm2', name: '박기관', role: '의료담당자' },
      ]
    } catch { return [] }
  })
  const [newManager, setNewManager] = useState({ name: '', role: '안전책임자' })

  useEffect(() => { 
    const t = setInterval(() => {
      setNow(new Date())
      setCoords(prev => ({
        lat: (parseFloat(prev.lat) + (Math.random() - 0.5) * 0.0001).toFixed(4) + '° N',
        lng: (parseFloat(prev.lng) + (Math.random() - 0.5) * 0.0001).toFixed(4) + '° E'
      }))
    }, 1000); 
    return () => clearInterval(t) 
  }, [])

  useEffect(() => { localStorage.setItem('mdts_training', JSON.stringify(trainingList)) }, [trainingList])
  useEffect(() => { localStorage.setItem('mdts_managers', JSON.stringify(managerList)) }, [managerList])

  const getStatusInfo = (expiry) => {
    if (!expiry) return { label: '정보없음', color: C.sub }
    const exp = new Date(expiry); const today = new Date(); const diffTime = exp - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: '만료', color: C.danger }
    if (diffDays < 90) return { label: '만료임박', color: C.warning }
    return { label: '유효', color: C.success }
  }

  const handleAddTraining = () => {
    if (!newTraining.name || !newTraining.expiry) { alert('이름과 만료일을 입력해주세요.'); return }
    setTrainingList([newTraining, ...trainingList]); setNewTraining({ name: '', type: '기본 CPR', expiry: '' }); setShowAddForm(false)
  }

  const stats = useMemo(() => {
    const d = CREW.filter(c => c.isEmergency).length
    const c = CREW.filter(c => !c.isEmergency && c.chronic !== '없음').length
    const o = CREW.filter(c => !c.isEmergency && c.chronic === '없음' && (c.allergies !== '없음' || c.lastMed !== '없음')).length
    const n = CREW.length - d - c - o
    const safetyIndex = Math.round(((n * 100) + (o * 80) + (c * 60) + (d * 20)) / CREW.length)
    return { total: CREW.length, danger: d, caution: c + o, normal: n, safetyIndex }
  }, [])

  const disease = useMemo(() => {
    const m = {}; CREW.forEach(c => c.chronic !== '없음' && c.chronic.split(',').forEach(d => { m[d.trim()] = (m[d.trim()]||0)+1 }))
    return Object.entries(m).map(([name,val]) => ({ name, val })).sort((a,b)=>b.val-a.val)
  }, [])

  const deptPie = [
    { name:'항해부', val: CREW.filter(c=>c.dept==='항해부').length, color:C.info },
    { name:'기관부', val: CREW.filter(c=>c.dept==='기관부').length, color:C.warning },
    { name:'지원부', val: CREW.filter(c=>c.dept==='지원부').length, color:C.success },
  ]

  const checkPct = Math.round((Object.values(checks).filter(Boolean).length / CHECKLIST.length) * 100)
  const toggle = (i) => { const n = { ...checks, [i]: !checks[i] }; setChecks(n); localStorage.setItem('mdts_chk', JSON.stringify(n)) }
  const fold = (k) => setCollapsed(p => ({ ...p, [k]: !p[k] }))

  const filteredLogs = SYS_LOGS.filter(l => (logFilter==='전체' || l.type===logFilter) && (l.msg.includes(logSearch) || l.t.includes(logSearch)))

  const gaugeData = [
    { name:'정상', value: Math.round((stats.normal/stats.total)*100), fill: C.success },
    { name:'주의', value: Math.round((stats.caution/stats.total)*100), fill: C.warning },
    { name:'위험', value: Math.round((stats.danger/stats.total)*100), fill: C.danger },
  ]

  return (
    <div style={{ display:'flex', height:'calc(100vh - 72px)', background:C.bg, color:C.text, fontFamily:'"Pretendard",sans-serif', overflow:'hidden' }}>

      {/* ── 사이드 네비 ── */}
      <nav style={{ width:86, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:28, gap:10, background:C.panel }}>
        {[
          { label:'현황', color:C.cyan, s:'s1' },
          { label:'건강', color:C.success, s:'s2' },
          { label:'SOP', color:C.purple, s:'s4' },
          { label:'시스템', color:C.warning, s:'s5' },
        ].map((n, i) => (
          <button key={i} title={n.label} onClick={() => document.getElementById(n.s)?.scrollIntoView({ behavior:'smooth' })}
            style={{ width:65, height:65, borderRadius:12, background:'transparent', border:`1px solid transparent`, cursor:'pointer', fontSize:17, fontWeight:800, color:C.sub, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=`${n.color}18`; e.currentTarget.style.borderColor=`${n.color}55`; e.currentTarget.style.color=n.color }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color=C.sub }}>
            {n.label}
          </button>
        ))}
      </nav>

      {/* ── 메인 스크롤 ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'35px 42px' }}>

        {/* 헤더 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:35, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <Dot color={C.success} pulse />
            <Ship size={28} color={C.info} />
            <span style={{ fontSize:26, fontWeight:800 }}>MDTS 통합 인프라 관리</span>
            <Tag color={C.cyan} style={{ fontSize:18, padding:'5px 15px' }}>MV KOREA STAR</Tag>
          </div>
          <div style={{ fontSize:22, color:C.sub, display:'flex', gap:36 }}>
            <span style={{ display:'flex', alignItems:'center', gap:8 }}><Clock size={22}/> {now.toLocaleTimeString('ko-KR')}</span>
            <span style={{ display:'flex', alignItems:'center', gap:8, color:C.success }}><RefreshCw size={22}/> 5초 갱신</span>
          </div>
        </div>

        {/* ══ S1 : 의료 현황 대시보드 ══ */}
        <Section id="s1" label="선박 의료 현황" color={C.cyan} collapsed={collapsed.s1} onToggle={() => fold('s1')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:18 }}>
            {[
              { l:'응급 장비 신뢰도', v:checkPct, u:'%', color:C.success, sub: checkPct === 100 ? '모든 장비 정상' : '장비 점검 필요', spark: Array.from({length:8},(_,i)=>({ v:80 + i*2.5 })) },
              { l:'대응 가용 인원', v:trainingList.filter(t => getStatusInfo(t.expiry).label === '유효').length, u:'명', color:C.info, sub: '즉시 처치 가능', spark: Array.from({length:8},(_,i)=>({ v:15 + Math.sin(i) })) },
              { l:'원격 의료 연결', v:'STABLE', u:'', color:C.cyan, sub: '부산센터 연결됨', spark: Array.from({length:8},(_,i)=>({ v:95 - i })) },
              { l:'최근접 구조 거점', v:'85', u:'km', color:C.warning, sub: '목포한국병원 (ETA 30m)', spark: Array.from({length:8},(_,i)=>({ v:2+Math.abs(Math.sin(i)) })) },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`4px solid ${s.color}`, borderRadius:12, padding:'24px 28px', display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:19, color:C.sub, fontWeight:700, marginBottom:12 }}>{s.l}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:47, fontWeight:900, color:s.color, lineHeight:1 }}>{s.v}</span>
                  <span style={{ fontSize:22, color:C.sub, fontWeight:700 }}>{s.u}</span>
                </div>
                <div style={{ fontSize:18, color:C.text, fontWeight:600, marginBottom:18, opacity:0.8 }}>{s.sub}</div>
                <div style={{ height:42, marginTop:'auto' }}>
                  <ResponsiveContainer width="100%" height="100%"><AreaChart data={s.spark}><Area type="monotone" dataKey="v" stroke={s.color} fill={s.color} fillOpacity={0.1} strokeWidth={2.5} dot={false} /></AreaChart></ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            <GPanel title="응급 대응 준비 상태" icon={<Shield size={22} color={checkPct===100?C.success:C.warning}/>} 
              right={<span style={{ fontSize:25, fontWeight:900, color:checkPct===100?C.success:C.warning, fontFamily:'monospace' }}>{checkPct}%</span>}>
              <div style={{ marginBottom:22 }}><div style={{ height:12, background:C.border, borderRadius:6, overflow:'hidden' }}><div style={{ height:'100%', width:`${checkPct}%`, borderRadius:6, transition:'all 0.5s', background:`linear-gradient(90deg, ${C.info}, ${checkPct===100?C.success:C.warning})` }} /></div></div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, maxHeight:300, overflowY:'auto', paddingRight:8 }}>
                {CHECKLIST.map((item, i) => (
                  <div key={i} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:18, cursor:'pointer', padding:'15px 22px', borderRadius:14, background: checks[i] ? `${C.success}08` : C.panel2, border:`1px solid ${checks[i] ? `${C.success}33` : C.border}` }}>
                    <div style={{ width:28, height:28, borderRadius:8, border:`2px solid ${checks[i] ? C.success : C.dim}`, background: checks[i] ? C.success : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>{checks[i] && <CheckCircle2 size={20} color="#000" strokeWidth={3} />}</div>
                    <span style={{ fontSize:20, color: checks[i] ? C.text : C.sub, fontWeight: checks[i] ? 700 : 500, flex:1 }}>{item}</span>
                  </div>
                ))}
              </div>
            </GPanel>

            <GPanel title="시스템 및 장비 건전성" icon={<ShieldCheck size={22} color={C.success}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:15, marginTop:10 }}>
                {[
                  { n:'MDTS 메인 서버', s:'ACTIVE', c:C.success, detail:'Uptime: 142d 08h' },
                  { n:'AED 배터리/패드', s:'NORMAL', c:C.success, detail:'만료: 2026-11-20' },
                  { n:'바이탈 센서 (Hub)', s:'STABLE', c:C.info, detail:'5개 노드 연결됨' },
                  { n:'위성 통신 링크', s:'EXCELLENT', c:C.success, detail:'Starlink Gen3' },
                ].map((d,i)=>(
                  <div key={i} style={{ padding:'15px 22px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:20, fontWeight:700, color:C.text }}>{d.n}</span><div style={{ display:'flex', alignItems:'center', gap:8 }}><Dot color={d.c} pulse={d.c===C.success}/><span style={{ fontSize:16, fontWeight:900, color:d.c }}>{d.s}</span></div></div>
                    <div style={{ fontSize:18, color:C.sub, fontFamily:'monospace' }}>{d.detail}</div>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S2 : 선원 건강 모니터링 ══ */}
        <Section id="s2" label="선원 건강 모니터링" color={C.success} collapsed={collapsed.s2} onToggle={()=>fold('s2')}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18, marginBottom:18 }}>
            <GPanel title="건강 위험 분포" icon={<Activity size={22} color={C.danger}/>}>
              <div style={{ height:250, position:'relative' }}>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={gaugeData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">{gaugeData.map((e,idx)=><Cell key={idx} fill={e.fill}/>)}</Pie><Tooltip contentStyle={{ background:C.panel, fontSize:20 }}/></PieChart></ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}><div style={{ fontSize:18, color:C.sub, fontWeight:800 }}>SAFETY</div><div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>{stats.safetyIndex}%</div></div>
              </div>
            </GPanel>
            <GPanel title="부서별 건강 상태" icon={<Users size={22} color={C.info}/>}>
              <div style={{ height:250 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={deptPie} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="val" stroke="none" label={({name,percent})=>({fontSize:16,text:`${name} ${(percent*100).toFixed(0)}%`})}>{deptPie.map((e,idx)=><Cell key={idx} fill={e.color}/>)}</Pie></PieChart></ResponsiveContainer></div>
            </GPanel>
            <GPanel title="기저 질환 통계" icon={<AlertCircle size={22} color={C.warning}/>}>
              <div style={{ height:250 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={disease.slice(0,5)} layout="vertical" margin={{left:-15,right:35}}><XAxis type="number" hide/><YAxis dataKey="name" type="category" stroke={C.sub} fontSize={16} width={110} tickLine={false} axisLine={false}/><Bar dataKey="val" radius={[0,8,8,0]} barSize={18} fill={C.warning}>{disease.map((_,i)=><Cell key={i} fill={C.warning} fillOpacity={1-i*0.15}/>)}</Bar></BarChart></ResponsiveContainer></div>
            </GPanel>
          </div>
          <GPanel title="선원 건강 위험도 히트맵" icon={<Activity size={22} color={C.success}/>}>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['항해부','기관부','지원부'].map(dept => (
                <div key={dept}>
                  <div style={{ fontSize:18, color:C.sub, fontWeight:700, marginBottom:8 }}>{dept}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {CREW.filter(c=>c.dept===dept).map(crew => {
                      const rc = riskOf(crew); return (
                        <div key={crew.id} style={{ width:80, padding:'10px 4px', borderRadius:8, background:`${rc}1a`, border:`1px solid ${rc}44`, textAlign:'center' }}>
                          <div style={{ fontSize:16, fontWeight:800, color:rc }}>{crew.name}</div>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:rc, margin:'4px auto 0' }}/>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </GPanel>
        </Section>

        {/* ══ S4 : 응급처치 SOP ══ */}
        <Section id="s4" label="응급처치 지침 및 교육 자료" color={C.purple} collapsed={collapsed.s4} onToggle={()=>fold('s4')}>
          <GPanel title="상황별 응급처치 가이드" icon={<BookOpen size={22} color={C.purple}/>}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15 }}>
              {SOP_LIST.map((s,i)=>(
                <div key={i} style={{ padding:'22px 18px', borderRadius:10, border:`1px solid ${C.border}`, background:C.panel2, textAlign:'center' }}>
                  <div style={{ fontSize:18, color:s.color, fontWeight:800, marginBottom:8 }}>{s.code}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:C.text, marginBottom:8 }}>{s.title}</div>
                  <Tag color={s.color} small>{s.cat}</Tag>
                </div>
              ))}
            </div>
          </GPanel>
        </Section>

        {/* ══ S5 : 시스템 관리 ══ */}
        <Section id="s5" label="시스템 관리" color={C.warning} collapsed={collapsed.s5} onToggle={()=>fold('s5')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15, marginBottom:18 }}>
            {[
              { l:'위성 신호', v:'매우 강함', c:C.success, sub:'스타링크' },
              { l:'응답 속도', v:'42ms', c:C.info, sub:'최근 평균' },
              { l:'동기화', v:'09:31', c:C.success, sub:'완료' },
              { l:'AI 버전', v:'v2.4.1', c:C.purple, sub:'Edge' },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`4px solid ${s.c}`, borderRadius:12, padding:'22px 24px' }}>
                <div style={{ fontSize:18, color:C.sub, fontWeight:700, marginBottom:10 }}>{s.l}</div>
                <div style={{ fontSize:32, fontWeight:900, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:18, color:C.sub, marginTop:6 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:18, marginBottom:18 }}>
            <GPanel title="위성 신호 품질" icon={<Wifi size={22} color={C.info}/>}><div style={{ height:250 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={signal}><Area type="monotone" dataKey="v" stroke={C.info} fill={C.info} fillOpacity={0.1} strokeWidth={4} dot={false}/></AreaChart></ResponsiveContainer></div></GPanel>
            <GPanel title="선박 좌표" icon={<MapPin size={22} color={C.cyan}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:28, height:250, justifyContent:'center' }}>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'22px', textAlign:'center' }}><div style={{ fontSize:18, color:C.sub, fontWeight:800 }}>LAT</div><div style={{ fontSize:32, fontWeight:900, color:C.cyan }}>{coords.lat}</div></div>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'22px', textAlign:'center' }}><div style={{ fontSize:18, color:C.sub, fontWeight:800 }}>LNG</div><div style={{ fontSize:32, fontWeight:900, color:C.cyan }}>{coords.lng}</div></div>
              </div>
            </GPanel>
            <GPanel title="보안 설정" icon={<Lock size={22} color={C.success}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                {[{l:'생체 인증',k:'bio'},{l:'암호화',k:'enc'},{l:'자동 로그아웃',k:'auto'}].map((s,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:20 }}><span style={{ color:C.sub }}>{s.l}</span><Toggle on={sec[s.k]} color={C.success} onChange={()=>setSec(p=>({...p,[s.k]:!p[s.k]}))}/></div>
                ))}
              </div>
            </GPanel>
          </div>

          <GPanel title="시스템 및 장비 건전성" icon={<ShieldCheck size={22} color={C.success}/>}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:15 }}>
              {[
                { n:'MDTS 메인 서버', s:'ACTIVE', c:C.success, detail:'Uptime: 142d 08h' },
                { n:'AED 배터리/패드', s:'NORMAL', c:C.success, detail:'만료: 2026-11-20' },
                { n:'바이탈 센서 (Hub)', s:'STABLE', c:C.info, detail:'5개 노드 연결됨' },
                { n:'위성 통신 링크', s:'EXCELLENT', c:C.success, detail:'Starlink Gen3' },
              ].map((d,i)=>(
                <div key={i} style={{ padding:'15px 22px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:20, fontWeight:700, color:C.text }}>{d.n}</span><div style={{ display:'flex', alignItems:'center', gap:8 }}><Dot color={d.c} pulse={d.c===C.success}/><span style={{ fontSize:16, fontWeight:900, color:d.c }}>{d.s}</span></div></div>
                  <div style={{ fontSize:18, color:C.sub, fontFamily:'monospace' }}>{d.detail}</div>
                </div>
              ))}
            </div>
          </GPanel>
        </Section>
        <div style={{ height:32 }}/>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
      `}</style>
    </div>
  )
}

/* ─── 서브 컴포넌트 ─── */
const Section = ({ id, label, color, collapsed, onToggle, children }) => (
  <div id={id} style={{ marginBottom:35 }}>
    <div onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:15, padding:'15px 22px', borderRadius:10, background:`${color}08`, border:`1px solid ${color}2a`, cursor:'pointer', marginBottom:collapsed?0:18 }}>
      <div style={{ width:4, height:25, background:color }}/>
      <span style={{ fontSize:23, fontWeight:800, color, flex:1 }}>{label}</span>
      {collapsed ? <ChevronRight size={25} color={color}/> : <ChevronDown size={25} color={color}/>}
    </div>
    {!collapsed && children}
  </div>
)

const GPanel = ({ title, icon, right, children }) => (
  <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, padding:'24px 28px' }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, paddingBottom:18, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:22, fontWeight:700, color:C.text }}>{icon}{title}</div>
      {right}
    </div>
    {children}
  </div>
)

const Tag = ({ color, children, small }) => (
  <span style={{ padding: small?'4px 10px':'6px 15px', borderRadius:6, fontSize:small?16:20, fontWeight:700, background:`${color}1a`, color, border:`1px solid ${color}33`, flexShrink:0 }}>{children}</span>
)

const Dot = ({ color, pulse }) => (
  <div style={{ width:12, height:12, borderRadius:'50%', background:color, boxShadow:`0 0 10px ${color}`, animation:pulse?'pulse 2s infinite':undefined }}/>
)

const Btn = ({ color, onClick, children, small }) => (
  <button onClick={onClick} style={{ padding:small?'8px 18px':'8px 22px', borderRadius:8, background:`${color}18`, border:`1px solid ${color}44`, color, fontSize:small?18:20, fontWeight:700, cursor:'pointer' }}>{children}</button>
)

const Toggle = ({ on, color, onChange }) => (
  <div onClick={onChange} style={{ width:62, height:32, borderRadius:16, background:on?color:C.dim, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:4, left:on?34:4, width:24, height:24, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
  </div>
)
