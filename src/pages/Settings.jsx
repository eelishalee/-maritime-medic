import React, { useState, useEffect, useMemo } from 'react'
import {
  Ship, Clock, RefreshCw, Signal, Shield, TrendingUp, CheckCircle2,
  Phone, Send, Inbox, BookOpen, Users, ChevronDown, ChevronRight,
  Lock, Terminal, Download, Search, Edit2, Save, Heart, Cpu,
  HardDrive, MapPin, Activity, Wifi, AlertCircle
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

const ORDERS = [
  { id:1, pri:'긴급', doc:'최원장 (부산원격)', patient:'박기관', msg:'심근경색 프로토콜 유지. 15분 간격 혈압·심전도 재전송 요망.', read:false, done:false },
  { id:2, pri:'일반', doc:'최원장 (부산원격)', patient:'이선장', msg:'혈압 약 복용 시간 준수. 과로 및 염분 섭취 자제 지도 요망.', read:true, done:true },
  { id:3, pri:'참고', doc:'해경 의료지원팀', patient:'전체', msg:'열사병 예방 위해 수분 섭취 및 휴식 주기 강화 바람.', read:true, done:true },
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
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mdts_chk') || '{}') } catch { return {} }
  })
  const [collapsed, setCollapsed] = useState({})
  const [sopIdx, setSopIdx] = useState(null)
  const [orders] = useState(ORDERS)
  const [logFilter, setLogFilter] = useState('전체')
  const [logSearch, setLogSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState({ ship:'MV KOREA STAR', no:'MED-001', sn:'MDTS-2024-KS-001', type:'컨테이너선', imo:'IMO 9876543', warranty:'2027-01-10', inspect:'2026-07-10' })
  const [devEdit, setDevEdit] = useState({ ...device })
  const [sec, setSec] = useState({ bio:true, enc:true, auto:true })
  const [signal] = useState(genSignal)

  // --- 교육 이력 관리 상태 ---
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

  // --- 선내 담당자 관리 상태 ---
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

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { localStorage.setItem('mdts_training', JSON.stringify(trainingList)) }, [trainingList])
  useEffect(() => { localStorage.setItem('mdts_managers', JSON.stringify(managerList)) }, [managerList])

  const getStatusInfo = (expiry) => {
    if (!expiry) return { label: '정보없음', color: C.sub }
    const exp = new Date(expiry)
    const today = new Date()
    const diffTime = exp - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { label: '만료', color: C.danger }
    if (diffDays < 90) return { label: '만료임박', color: C.warning }
    return { label: '유효', color: C.success }
  }

  const handleAddTraining = () => {
    if (!newTraining.name || !newTraining.expiry) {
      alert('이름과 만료일을 입력해주세요.')
      return
    }
    setTrainingList([newTraining, ...trainingList])
    setNewTraining({ name: '', type: '기본 CPR', expiry: '' })
    setShowAddForm(false)
  }

  const stats = useMemo(() => {
    const d = CREW.filter(c => c.isEmergency).length
    const c = CREW.filter(c => !c.isEmergency && c.chronic !== '없음').length
    const o = CREW.filter(c => !c.isEmergency && c.chronic === '없음' && (c.allergies !== '없음' || c.lastMed !== '없음')).length
    const n = CREW.length - d - c - o
    const safetyIndex = Math.round(((n * 100) + (o * 80) + (c * 60) + (d * 20)) / CREW.length)
    return { total: CREW.length, danger: d, chronic: c, observation: o, caution: c + o, normal: n, safetyIndex }
  }, [])

  const disease = useMemo(() => {
    const m = {}
    CREW.forEach(c => c.chronic !== '없음' && c.chronic.split(',').forEach(d => { m[d.trim()] = (m[d.trim()]||0)+1 }))
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
  const unread = orders.filter(o=>!o.read).length

  const filteredLogs = SYS_LOGS.filter(l =>
    (logFilter==='전체' || l.type===logFilter) && (l.msg.includes(logSearch) || l.t.includes(logSearch))
  )

  /* 방사형 게이지용 */
  const gaugeData = [
    { name:'정상', value: Math.round((stats.normal/stats.total)*100), fill: C.success },
    { name:'주의', value: Math.round((stats.caution/stats.total)*100), fill: C.warning },
    { name:'위험', value: Math.round((stats.danger/stats.total)*100), fill: C.danger },
  ]

  return (
    <div style={{ display:'flex', height:'calc(100vh - 72px)', background:C.bg, color:C.text, fontFamily:'"Pretendard",sans-serif', overflow:'hidden' }}>

      {/* ── 사이드 네비 ── */}
      <nav style={{ width:52, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:16, gap:4, background:C.panel }}>
        {[
          { label:'현황', color:C.cyan, s:'s1' },
          { label:'건강', color:C.success, s:'s2' },
          { label:'SOP', color:C.purple, s:'s4' },
          { label:'시스템', color:C.warning, s:'s5' },
        ].map((n, i) => (
          <button key={i} title={n.label} onClick={() => document.getElementById(n.s)?.scrollIntoView({ behavior:'smooth' })}
            style={{ width:36, height:36, borderRadius:6, background:'transparent', border:`1px solid transparent`, cursor:'pointer', fontSize:9, fontWeight:800, color:C.sub, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=`${n.color}18`; e.currentTarget.style.borderColor=`${n.color}55`; e.currentTarget.style.color=n.color }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color=C.sub }}>
            {n.label}
          </button>
        ))}
      </nav>

      {/* ── 메인 스크롤 ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

        {/* 헤더 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Dot color={C.success} pulse />
            <Ship size={16} color={C.info} />
            <span style={{ fontSize:15, fontWeight:800 }}>MDTS 통합 인프라 관리</span>
            <Tag color={C.cyan}>MV KOREA STAR</Tag>
          </div>
          <div style={{ fontSize:12, color:C.sub, display:'flex', gap:20 }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12}/> {now.toLocaleTimeString('ko-KR')}</span>
            <span style={{ display:'flex', alignItems:'center', gap:4, color:C.success }}><RefreshCw size={12}/> 5초 갱신</span>
          </div>
        </div>

        {/* ══ S1 : 의료 현황 대시보드 ══════════════════════════════════════ */}
        <Section id="s1" label="선박 의료 현황" color={C.cyan} collapsed={collapsed.s1} onToggle={() => fold('s1')}>

          {/* 상단 실전 대응 지표 (KPI) */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
            {[
              { l:'응급 장비 신뢰도', v:checkPct, u:'%', color:C.success, sub: checkPct === 100 ? '모든 장비 정상' : '장비 점검 필요', spark: Array.from({length:8},(_,i)=>({ v:80 + i*2.5 })) },
              { l:'대응 가용 인원', v:trainingList.filter(t => getStatusInfo(t.expiry).label === '유효').length, u:'명', color:C.info, sub: '즉시 처치 가능', spark: Array.from({length:8},(_,i)=>({ v:15 + Math.sin(i) })) },
              { l:'원격 의료 연결', v:'STABLE', u:'', color:C.cyan, sub: '부산센터 연결됨', spark: Array.from({length:8},(_,i)=>({ v:95 - i })) },
              { l:'최근접 구조 거점', v:'85', u:'km', color:C.warning, sub: '목포한국병원 (ETA 30m)', spark: Array.from({length:8},(_,i)=>({ v:2+Math.abs(Math.sin(i)) })) },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:6, padding:'14px 16px', display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:11, color:C.sub, fontWeight:700, marginBottom:6 }}>{s.l}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <span style={{ fontSize:26, fontWeight:900, color:s.color, fontFamily:"'Pretendard Variable', Pretendard, sans-serif", lineHeight:1 }}>{s.v}</span>
                  <span style={{ fontSize:12, color:C.sub, fontWeight:700 }}>{s.u}</span>
                </div>
                <div style={{ fontSize:10, color:C.text, fontWeight:600, marginBottom:10, opacity:0.8 }}>{s.sub}</div>
                <div style={{ height:24, marginTop:'auto' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={s.spark}>
                      <Area type="monotone" dataKey="v" stroke={s.color} fill={s.color} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {/* 2. 실전 응급 대응 준비도 (Checklist) */}
            <GPanel title="응급 대응 준비 상태" icon={<Shield size={12} color={checkPct===100?C.success:C.warning}/>} 
              right={<div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14, fontWeight:900, color:checkPct===100?C.success:C.warning, fontFamily:'monospace' }}>{checkPct}%</span>
              </div>}>
              <div style={{ marginBottom:12 }}>
                <div style={{ height:6, background:C.border, borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${checkPct}%`, borderRadius:3, transition:'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: `linear-gradient(90deg, ${C.info}, ${checkPct===100?C.success:C.warning})` }} />
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:180, overflowY:'auto', paddingRight:4 }}>
                {CHECKLIST.map((item, i) => {
                  const done = !!checks[i]
                  return (
                    <div key={i} onClick={()=>toggle(i)} style={{ 
                      display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'8px 12px', borderRadius:8, 
                      background: done ? `${C.success}08` : C.panel2,
                      border: `1px solid ${done ? `${C.success}33` : C.border}`,
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ 
                        width:18, height:18, borderRadius:5, flexShrink:0, 
                        border:`2px solid ${done ? C.success : C.dim}`,
                        background: done ? C.success : 'transparent', 
                        display:'flex', alignItems:'center', justifyContent:'center' 
                      }}>
                        {done && <CheckCircle2 size={12} color="#000" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize:11, color: done ? C.text : C.sub, fontWeight: done ? 700 : 500, flex:1 }}>{item}</span>
                      {done && <Tag color={C.success} small>확인됨</Tag>}
                    </div>
                  )
                })}
              </div>
            </GPanel>

            {/* 3. 시스템 및 장비 건전성 */}
            <GPanel title="시스템 및 장비 건전성" icon={<Shield size={12} color={C.success}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:5 }}>
                {[
                  { n:'MDTS 메인 서버', s:'ACTIVE', c:C.success, detail:'Uptime: 142d 08h' },
                  { n:'AED 배터리/패드', s:'NORMAL', c:C.success, detail:'만료: 2026-11-20' },
                  { n:'바이탈 센서 (Hub)', s:'STABLE', c:C.info, detail:'5개 노드 연결됨' },
                  { n:'위성 통신 링크', s:'EXCELLENT', c:C.success, detail:'Starlink Gen3' },
                ].map((d,i)=>(
                  <div key={i} style={{ padding:'8px 12px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:6 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.text }}>{d.n}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <Dot color={d.c} pulse={d.c===C.success} />
                        <span style={{ fontSize:9, fontWeight:900, color:d.c }}>{d.s}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:C.sub, fontFamily:'monospace' }}>{d.detail}</div>
                  </div>
                ))}
              </div>
            </GPanel>

            {/* 4. 선내 담당자 관리 (추가됨) */}
            <GPanel title="선내 담당자 관리 (차트 연동)" icon={<Users size={12} color={C.info}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ background:C.panel2, border:`1px solid ${C.border}`, borderRadius:6, padding:10, display:'flex', flexDirection:'column', gap:8 }}>
                   <div style={{ display:'flex', gap:6 }}>
                      <input placeholder="이름" value={newManager.name} onChange={e=>setNewManager({...newManager, name:e.target.value})} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 8px', color:'#fff', fontSize:11 }} />
                      <select value={newManager.role} onChange={e=>setNewManager({...newManager, role:e.target.value})} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 8px', color:'#fff', fontSize:11 }}>
                        <option>안전책임자</option>
                        <option>의료담당자</option>
                        <option>당직사관</option>
                        <option>선장</option>
                      </select>
                      <button onClick={()=>{
                        if(!newManager.name) return alert('이름을 입력하세요.');
                        setManagerList([...managerList, { ...newManager, id: 'm'+Date.now() }]);
                        setNewManager({ name: '', role: '안전책임자' });
                      }} style={{ background:C.info, color:'#000', border:'none', borderRadius:4, padding:'4px 12px', fontWeight:800, fontSize:11, cursor:'pointer' }}>등록</button>
                   </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {managerList.map((m, i) => (
                    <div key={m.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:11, fontWeight:800 }}>{m.name}</span>
                        <Tag color={C.sub} small>{m.role}</Tag>
                      </div>
                      <button onClick={()=>{ if(confirm('삭제하시겠습니까?')) setManagerList(managerList.filter(x=>x.id!==m.id)) }} style={{ background:'none', border:'none', color:C.danger, cursor:'pointer', fontSize:10 }}>삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S2 : 선원 건강 모니터링 ════════════════════════════════════════ */}
        <Section id="s2" label="선원 건강 모니터링" color={C.success} collapsed={collapsed.s2} onToggle={()=>fold('s2')}>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
            <GPanel title="건강 위험 분포" icon={<Activity size={12} color={C.danger}/>}>
              <div style={{ height:140, position:'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                      {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, fontSize:11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
                  <div style={{ fontSize:10, color:C.sub, fontWeight:800 }}>SAFETY</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{stats.safetyIndex}%</div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-around', marginTop:5 }}>
                {[{l:'정상',v:stats.normal,c:C.success},{l:'주의',v:stats.caution,c:C.warning},{l:'위험',v:stats.danger,c:C.danger}].map((x,i)=>(
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:11, fontWeight:800, color:x.c }}>{x.v}</div>
                    <div style={{ fontSize:9, color:C.sub }}>{x.l}</div>
                  </div>
                ))}
              </div>
            </GPanel>

            <GPanel title="부서별 건강 상태" icon={<Users size={12} color={C.info}/>}>
              <div style={{ height:140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deptPie} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="val" stroke="none" label={({name, percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                      {deptPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, fontSize:11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GPanel>

            <GPanel title="기저 질환 통계" icon={<AlertCircle size={12} color={C.warning}/>}>
              <div style={{ height:170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disease.slice(0,5)} layout="vertical" margin={{ left: -10, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke={C.sub} fontSize={9} width={60} tickLine={false} axisLine={false} />
                    <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={10} fill={C.warning}>
                      {disease.map((_, i) => <Cell key={i} fill={C.warning} fillOpacity={1 - i*0.15} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GPanel>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {/* 히트맵 */}
            <GPanel title="선원 건강 위험도 히트맵" icon={<Activity size={12} color={C.success}/>}
              right={<div style={{ display:'flex', gap:8, fontSize:10 }}>
                {[{c:C.success,l:'정상'},{c:C.warning,l:'주의'},{c:C.danger,l:'위험'}].map((x,i)=>(
                  <span key={i} style={{ display:'flex', alignItems:'center', gap:4, color:C.sub }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:x.c, display:'inline-block' }}/>{x.l}
                  </span>
                ))}
              </div>}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {['항해부','기관부','지원부'].map(dept => {
                  const dc = CREW.filter(c=>c.dept===dept)
                  return (
                    <div key={dept}>
                      <div style={{ fontSize:10, color:C.sub, fontWeight:700, marginBottom:4 }}>{dept} ({dc.length}명)</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                        {dc.map(crew => {
                          const rc = riskOf(crew)
                          return (
                            <div key={crew.id} title={`${crew.name} · ${crew.role}\n기저질환: ${crew.chronic}\n알레르기: ${crew.allergies}`}
                              style={{ width:44, padding:'5px 2px', borderRadius:4, background:`${rc}1a`, border:`1px solid ${rc}44`, textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}
                              onMouseEnter={e=>{e.currentTarget.style.background=`${rc}33`;e.currentTarget.style.transform='scale(1.08)'}}
                              onMouseLeave={e=>{e.currentTarget.style.background=`${rc}1a`;e.currentTarget.style.transform='scale(1)'}}>
                              <div style={{ fontSize:9, fontWeight:800, color:rc }}>{crew.name}</div>
                              <div style={{ width:5, height:5, borderRadius:'50%', background:rc, margin:'2px auto 0' }}/>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S4 : 응급처치 지침 & 교육 ══════════════════════════════════════ */}
        <Section id="s4" label={
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>응급처치 지침 및 교육 자료</span>
            {unread > 0 && <span style={{ background:C.danger, color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:900 }}>{unread} NEW</span>}
          </div>
        } color={C.purple} collapsed={collapsed.s4} onToggle={()=>fold('s4')}>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10 }}>
            {/* 상황별 처치 가이드 */}
            <GPanel title="상황별 응급처치 가이드 (8종)" icon={<BookOpen size={12} color={C.purple}/>}
              right={<button style={{ padding:'3px 10px', borderRadius:4, background:`${C.purple}18`, border:`1px solid ${C.purple}44`, color:C.purple, fontSize:10, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                <RefreshCw size={10}/>
                버전 업그레이드
              </button>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {SOP_LIST.map((s,i)=>(
                  <div key={i} onClick={()=>setSopIdx(sopIdx===i?null:i)}
                    style={{ padding:'12px 10px', borderRadius:5, border:`1px solid ${sopIdx===i?s.color:C.border}`,
                      background:sopIdx===i?`${s.color}0d`:C.panel2, cursor:'pointer', transition:'all 0.2s', textAlign:'center' }}>
                    <div style={{ fontSize:10, color:s.color, fontWeight:800, marginBottom:4 }}>{s.code}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.3 }}>{s.title}</div>
                    <Tag color={s.color} small>{s.cat}</Tag>
                    {sopIdx===i && (
                      <div style={{ marginTop:8, textAlign:'left', borderTop:`1px solid ${s.color}33`, paddingTop:8 }}>
                        <div style={{ fontSize:10, color:C.sub }}>클릭하여 Emergency 페이지에서 확인</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GPanel>

            {/* 훈련 이력 */}
            <GPanel title="선원 응급처치 및 의료 교육 이력" icon={<Users size={12} color={C.cyan}/>}
              right={<button onClick={() => setShowAddForm(!showAddTraining)} style={{ padding:'2px 8px', borderRadius:4, background:`${C.info}18`, border:`1px solid ${C.info}44`, color:C.info, fontSize:12, fontWeight:800, cursor:'pointer' }}>{showAddTraining ? '취소' : '+'}</button>}>
              
              {showAddTraining && (
                <div style={{ background:C.panel2, border:`1px solid ${C.info}44`, borderRadius:6, padding:10, marginBottom:10, display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <input placeholder="선원 이름" value={newTraining.name} onChange={e=>setNewTraining({...newTraining, name:e.target.value})} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 8px', color:'#fff', fontSize:11 }} />
                    <select value={newTraining.type} onChange={e=>setNewTraining({...newTraining, type:e.target.value})} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 8px', color:'#fff', fontSize:11 }}>
                      <option>기본 CPR</option>
                      <option>의료 응급 처치 (STCW)</option>
                      <option>선상 응급 의료 (Advanced)</option>
                    </select>
                  </div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontSize:10, color:C.sub }}>만료일:</span>
                    <input type="date" value={newTraining.expiry} onChange={e=>setNewTraining({...newTraining, expiry:e.target.value})} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 8px', color:'#fff', fontSize:11 }} />
                    <button onClick={handleAddTraining} style={{ background:C.info, color:'#000', border:'none', borderRadius:4, padding:'4px 12px', fontWeight:800, fontSize:11, cursor:'pointer' }}>추가</button>
                  </div>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {trainingList.map((r,i)=>{
                  const info = getStatusInfo(r.expiry)
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:4, background:C.panel2, border:`1px solid ${C.border}`, fontSize:11 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:info.color, flexShrink:0 }}/>
                      <span style={{ fontWeight:700, flex:1 }}>{r.name}</span>
                      <span style={{ color:C.sub, fontSize:10, flex:2 }}>{r.type}</span>
                      <span style={{ color:C.sub, fontSize:10, marginRight:4 }}>{r.expiry}</span>
                      <Tag color={info.color} small>{info.label}</Tag>
                      <button onClick={() => { if(confirm('삭제하시겠습니까?')) setTrainingList(trainingList.filter((_, idx) => idx !== i)) }} style={{ background:'none', border:'none', color:C.sub, cursor:'pointer', fontSize:10 }}>×</button>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop:10, padding:'8px 10px', borderRadius:5, background:`${C.yellow}0a`, border:`1px solid ${C.yellow}2a`, fontSize:11 }}>
                <span style={{ color:C.yellow, fontWeight:700 }}>다음 훈련 </span>
                <span style={{ color:C.sub }}>CPR · 2026-06-15 · 전 선원</span>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S5 : 시스템 관리 ════════════════════════════════════════════ */}
        <Section id="s5" label="시스템 관리" color={C.warning} collapsed={collapsed.s5} onToggle={()=>fold('s5')}>

          {/* 통신 품질 + stat */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:10 }}>
            {[
              { l:'위Satellite 신호', v:'매우 강함', c:C.success, sub:'스타링크' },
              { l:'응답 속도', v:'42ms', c:C.info, sub:'최근 24h 평균' },
              { l:'마지막 동기화', v:'09:31', c:C.success, sub:'동기화 완료' },
              { l:'AI 버전', v:'v2.4.1', c:C.purple, sub:'Maritime-Edge' },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.c}`, borderRadius:6, padding:'12px 14px' }}>
                <div style={{ fontSize:10, color:C.sub, fontWeight:700, marginBottom:5 }}>{s.l}</div>
                <div style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:'monospace' }}>{s.v}</div>
                <div style={{ fontSize:10, color:C.sub, marginTop:3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10, marginBottom:10 }}>
            {/* 통신 품질 차트 */}
            <GPanel title="위성 신호 품질 — 최근 24시간" icon={<Wifi size={12} color={C.info}/>}>
              <div style={{ height:140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={signal}>
                    <defs>
                      <linearGradient id="gSig" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.info} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.info} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                    <XAxis dataKey="h" stroke={C.sub} fontSize={9} tickLine={false} axisLine={false} interval={3}/>
                    <YAxis stroke={C.sub} fontSize={9} tickLine={false} axisLine={false} domain={[0,100]}/>
                    <Tooltip contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, fontSize:10, borderRadius:6 }} formatter={v=>[`${v}%`,'신호']}/>
                    <Area type="monotone" dataKey="v" stroke={C.info} fill="url(#gSig)" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GPanel>

            {/* 기기 정보 */}
            <GPanel title="기기 등록 정보" icon={<HardDrive size={12} color={C.warning}/>}
              right={<button onClick={()=>editing?(setDevice({...devEdit}),setEditing(false)):setEditing(true)}
                style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:4,
                  background:editing?`${C.success}18`:`${C.warning}18`,
                  border:`1px solid ${editing?C.success+'44':C.warning+'44'}`,
                  color:editing?C.success:C.warning, fontSize:10, fontWeight:700, cursor:'pointer' }}>
                {editing?<><Save size={9}/>저장</>:<><Edit2 size={9}/>수정</>}
              </button>}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { l:'선박명', k:'ship' }, { l:'기기 번호', k:'no' },
                  { l:'S/N', k:'sn' }, { l:'선박 유형', k:'type' },
                  { l:'IMO', k:'imo' }, { l:'보증 만료', k:'warranty' },
                  { l:'다음 점검', k:'inspect' },
                ].map((f,i)=>(
                  <div key={i} style={{ display:'flex', gap:8, fontSize:11, alignItems:'center' }}>
                    <span style={{ color:C.sub, width:60, flexShrink:0 }}>{f.l}</span>
                    {editing ? (
                      <input value={devEdit[f.k]} onChange={e=>setDevEdit(p=>({...p,[f.k]:e.target.value}))}
                        style={{ flex:1, background:'transparent', border:'none', borderBottom:`1px solid ${C.info}`, color:C.info, fontSize:11, fontWeight:600, outline:'none', padding:'1px 0' }}/>
                    ) : (
                      <span style={{ color:C.text, fontWeight:600, fontFamily:'monospace' }}>{device[f.k]}</span>
                    )}
                  </div>
                ))}
              </div>
            </GPanel>

            {/* 보안 + AI */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <GPanel title="보안 설정" icon={<Lock size={12} color={C.success}/>}>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { l:'생체 인증 로그인', k:'bio' },
                    { l:'데이터 암화화', k:'enc' },
                    { l:'30분 자동 로그아웃', k:'auto' },
                  ].map((s,i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11 }}>
                      <span style={{ color:C.sub }}>{s.l}</span>
                      <Toggle on={sec[s.k]} color={C.success} onChange={()=>setSec(p=>({...p,[s.k]:!p[s.k]}))}/>
                    </div>
                  ))}
                  <div style={{ display:'flex', gap:6, marginTop:4 }}>
                    <Btn color={C.warning} small>비밀번호 변경</Btn>
                    <Btn color={C.danger} small>원격 잠금</Btn>
                  </div>
                </div>
              </GPanel>

              <GPanel title="AI 모델" icon={<Cpu size={12} color={C.purple}/>}>
                <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:11 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:C.sub }}>버전</span><span style={{ color:C.purple, fontFamily:'monospace', fontWeight:700 }}>v2.4.1-Maritime</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:C.sub }}>외상 분류</span><span style={{ color:C.success, fontWeight:700 }}>98.2%</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:C.sub }}>약물 금기</span><span style={{ color:C.success, fontWeight:700 }}>99.7%</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:C.sub }}>학습 기준일</span><span style={{ color:C.sub }}>2025-12-31</span>
                  </div>
                  <Btn color={C.purple} small>업데이트 확인</Btn>
                </div>
              </GPanel>
            </div>
          </div>

          {/* 시스템 로그 */}
          <GPanel title="시스템 활동 로그" icon={<Terminal size={12} color={C.sub}/>}
            right={<div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <Search size={10} style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)', color:C.sub }}/>
                <input value={logSearch} onChange={e=>setLogSearch(e.target.value)} placeholder="검색..."
                  style={{ paddingLeft:22, paddingRight:8, height:24, borderRadius:4, background:C.panel2, border:`1px solid ${C.border}`, color:C.text, fontSize:10, outline:'none', width:120 }}/>
              </div>
              {['전체','success','info','warning','error'].map(f=>(
                <button key={f} onClick={()=>setLogFilter(f)}
                  style={{ padding:'2px 8px', borderRadius:3, fontSize:10, cursor:'pointer', fontWeight:700,
                    background:logFilter===f?`${logColor(f)}18`:'transparent',
                    border:`1px solid ${logFilter===f?logColor(f)+'44':C.border}`,
                    color:logFilter===f?logColor(f):C.sub }}>
                  {f}
                </button>
              ))}
              <button style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:3, background:`${C.info}18`, border:`1px solid ${C.info}44`, color:C.info, fontSize:10, cursor:'pointer' }}>
                <Download size={10}/>CSV
              </button>
            </div>}>
            <div style={{ background:'#060809', borderRadius:5, border:`1px solid ${C.border}`, padding:'10px 12px', height:140, overflowY:'auto', fontFamily:'monospace', fontSize:11, lineHeight:1.9 }}>
              {filteredLogs.map((l,i)=>(
                <div key={i}>
                  <span style={{ color:C.sub }}>[{l.t}]</span>{' '}
                  <span style={{ color:logColor(l.type), fontWeight:700 }}>[{l.type.toUpperCase()}]</span>{' '}
                  <span style={{ color:C.text }}>{l.msg}</span>
                </div>
              ))}
              {filteredLogs.length===0 && <div style={{ color:C.sub }}>해당 로그가 없습니다.</div>}
              <div style={{ color:C.sub }}>대기 중...</div>
            </div>
          </GPanel>
        </Section>

        <div style={{ height:32 }}/>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
      `}</style>
    </div>
  )
}

/* ─── 서브 컴포넌트 ─── */

const Section = React.forwardRef(function Section({ id, label, color, collapsed, onToggle, children }, ref) {
  return (
    <div id={id} ref={ref} style={{ marginBottom:20 }}>
      <div onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:5,
        background:`${color}08`, border:`1px solid ${color}2a`, cursor:'pointer', marginBottom:collapsed?0:10, userSelect:'none' }}>
        <div style={{ width:2, height:14, borderRadius:1, background:color }}/>
        <span style={{ fontSize:13, fontWeight:800, color, flex:1 }}>{label}</span>
        {collapsed ? <ChevronRight size={14} color={color}/> : <ChevronDown size={14} color={color}/>}
      </div>
      {!collapsed && children}
    </div>
  )
})

function GPanel({ title, icon, right, children, style }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, padding:'14px 16px', ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:C.text }}>
          {icon}{title}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function Tag({ color, children, small }) {
  return (
    <span style={{ padding: small?'2px 6px':'3px 8px', borderRadius:3, fontSize:small?9:11, fontWeight:700,
      background:`${color}1a`, color, border:`1px solid ${color}33`, flexShrink:0 }}>
      {children}
    </span>
  )
}

function Dot({ color, pulse }) {
  return (
    <div style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0,
      boxShadow:`0 0 6px ${color}`, animation:pulse?'pulse 2s infinite':undefined }}/>
  )
}

function Btn({ color, onClick, children, small }) {
  return (
    <button onClick={onClick} style={{ padding:small?'4px 10px':'4px 12px', borderRadius:4, background:`${color}18`,
      border:`1px solid ${color}44`, color, fontSize:small?10:11, fontWeight:700, cursor:'pointer' }}>
      {children}
    </button>
  )
}

function Toggle({ on, color, onChange }) {
  return (
    <div onClick={onChange} style={{ width:34, height:18, borderRadius:9, background:on?color:C.dim,
      position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:2, left:on?17:2, width:14, height:14,
        borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
    </div>
  )
}
