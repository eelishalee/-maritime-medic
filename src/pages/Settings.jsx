import React, { useState, useEffect, useMemo, useRef } from 'react'
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

const TREND = [
  { m:'11월', 응급:2, 검진:8, 원격:3 }, { m:'12월', 응급:1, 검진:10, 원격:2 },
  { m:'1월',  응급:3, 검진:9,  원격:4 }, { m:'2월',  응급:2, 검진:7,  원격:3 },
  { m:'3월',  응급:4, 검진:11, 원격:5 }, { m:'4월',  응급:3, 검진:8,  원격:4 },
]

const TX_LOGS = [
  { t:'09:31', type:'바이탈', ok:true }, { t:'09:26', type:'응급알림', ok:true },
  { t:'09:10', type:'바이탈', ok:false }, { t:'09:05', type:'환자차트', ok:true },
  { t:'08:59', type:'정기리포트', ok:true }, { t:'08:00', type:'바이탈', ok:true },
]

const ORDERS = [
  { id:1, pri:'긴급', doc:'최원장 (부산원격)', patient:'박기관', msg:'심근경색 프로토콜 유지. 15분 간격 혈압·심전도 재전송 요망.', read:false, done:false },
  { id:2, pri:'일반', doc:'최원장 (부산원격)', patient:'이선장', msg:'혈압 약 복용 시간 준수. 과로 및 염분 섭취 자제 지도 요망.', read:true, done:true },
  { id:3, pri:'참고', doc:'해경 의료지원팀', patient:'전체', msg:'열사병 예방 위해 수분 섭취 및 휴식 주기 강화 바람.', read:true, done:true },
]

const SOP_LIST = [
  { code:'CPR-01', title:'심폐소생술·AED', cat:'심정지', color:C.danger },
  { code:'HEI-07', title:'하임리히법', cat:'기도폐쇄', color:C.warning },
  { code:'AIR-03', title:'기도 유지', cat:'기도확보', color:C.info },
  { code:'BLD-02', title:'출혈 압박', cat:'외상/지혈', color:C.danger },
  { code:'BRN-08', title:'화상 냉각', cat:'화상', color:C.yellow },
  { code:'HYP-05', title:'익수자 구조', cat:'저체온', color:C.cyan },
  { code:'FRC-04', title:'골절 고정', cat:'골절/탈구', color:C.purple },
  { code:'WND-06', title:'상처 세척', cat:'감염방지', color:C.success },
]

const TRAINING = [
  { name:'이선장', type:'기본 CPR', expiry:'2026-10-15', status:'유효' },
  { name:'김항해', type:'기본 CPR', expiry:'2026-08-20', status:'유효' },
  { name:'박기관', type:'의료 응급 처치 (STCW)', expiry:'2027-03-01', status:'유효' },
  { name:'최갑판', type:'기본 CPR', expiry:'2026-04-10', status:'만료임박' },
  { name:'조항구', type:'기본 CPR', expiry:'2025-12-05', status:'만료' },
  { name:'고기압', type:'선상 응급 의료 (Advanced)', expiry:'2027-05-10', status:'유효' },
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
  const [orders, setOrders] = useState(ORDERS)
  const [logFilter, setLogFilter] = useState('전체')
  const [logSearch, setLogSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState({ ship:'MV KOREA STAR', no:'MED-001', sn:'MDTS-2024-KS-001', type:'컨테이너선', imo:'IMO 9876543', warranty:'2027-01-10', inspect:'2026-07-10' })
  const [devEdit, setDevEdit] = useState({ ...device })
  const [sec, setSec] = useState({ bio:true, enc:true, auto:true })
  const [signal] = useState(genSignal)

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  const stats = useMemo(() => {
    const d = CREW.filter(c => c.isEmergency).length
    const w = CREW.filter(c => !c.isEmergency && c.chronic !== '없음').length
    return { total: CREW.length, normal: CREW.length - d - w, caution: w, danger: d }
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
    <div style={{ display:'flex', height:'calc(100vh - 72px)', background:C.bg, color:C.text, fontFamily:'"Pretendard",sans-serif', overflow:'hidden', zoom: 1.82 }}>

      {/* ── 사이드 네비 ── */}
      <nav style={{ width:52, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:16, gap:4, background:C.panel }}>
        {[
          { label:'현황', color:C.cyan, s:'s1' },
          { label:'건강', color:C.success, s:'s2' },
          { label:'연결', color:C.info, s:'s3' },
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

          {/* 상단 stat 행 */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
            {[
              { l:'전체 선원', v:stats.total, u:'명', color:C.cyan, spark: Array.from({length:8},(_,i)=>({ v:24+Math.sin(i)*2 })) },
              { l:'정상', v:stats.normal, u:'명', color:C.success, spark: Array.from({length:8},(_,i)=>({ v:16+Math.sin(i)*1 })) },
              { l:'주의 (기저질환)', v:stats.caution, u:'명', color:C.warning, spark: Array.from({length:8},(_,i)=>({ v:6+Math.cos(i) })) },
              { l:'위험 (응급)', v:stats.danger, u:'명', color:C.danger, spark: Array.from({length:8},(_,i)=>({ v:2+Math.abs(Math.sin(i)) })) },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:6, padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:C.sub, fontWeight:700, marginBottom:6 }}>{s.l}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
                  <span style={{ fontSize:30, fontWeight:900, color:s.color, fontFamily:"'Pretendard Variable', Pretendard, sans-serif", lineHeight:1 }}>{s.v}</span>
                  <span style={{ fontSize:12, color:C.sub }}>{s.u}</span>
                </div>
                <div style={{ height:32 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={s.spark}>
                      <Area type="monotone" dataKey="v" stroke={s.color} fill={s.color} fillOpacity={0.12} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {/* 건강 비율 도넛 */}
            <GPanel title="선원 건강 비율" icon={<Heart size={12} color={C.danger}/>}>
              <div style={{ height:160, position:'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name:'정상', value:stats.normal, color:C.success },
                      { name:'주의', value:stats.caution, color:C.warning },
                      { name:'위험', value:stats.danger, color:C.danger },
                    ]} innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                      {[C.success,C.warning,C.danger].map((c,i)=><Cell key={i} fill={c} stroke="none"/>)}
                    </Pie>
                    <Tooltip contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, fontSize:11, borderRadius:6 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                  <div style={{ fontSize:22, fontWeight:900, color:C.text, fontFamily:"'Pretendard Variable', Pretendard, sans-serif" }}>{stats.total}</div>
                  <div style={{ fontSize:10, color:C.sub }}>명</div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-around', paddingTop:8, borderTop:`1px solid ${C.border}` }}>
                {[{l:'정상',v:stats.normal,c:C.success},{l:'주의',v:stats.caution,c:C.warning},{l:'위험',v:stats.danger,c:C.danger}].map((x,i)=>(
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:x.c, fontFamily:"'Pretendard Variable', Pretendard, sans-serif" }}>{x.v}</div>
                    <div style={{ fontSize:10, color:C.sub }}>{x.l}</div>
                  </div>
                ))}
              </div>
            </GPanel>

            {/* 준비도 체크리스트 */}
            <GPanel title="응급 준비도" icon={<CheckCircle2 size={12} color={checkPct===100?C.success:C.warning}/>}
              right={<span style={{ fontFamily:'monospace', fontSize:13, fontWeight:800, color:checkPct===100?C.success:C.warning }}>{checkPct}%</span>}>
              <div style={{ marginBottom:10 }}>
                <div style={{ height:6, background:C.dim, borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${checkPct}%`, borderRadius:3, transition:'width 0.4s',
                    background: checkPct===100?C.success:checkPct>=60?C.warning:C.danger }} />
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:130, overflowY:'auto' }}>
                {CHECKLIST.map((item, i) => {
                  const done = !!checks[i]
                  return (
                    <div key={i} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'5px 8px', borderRadius:4, background: done?`${C.success}0a`:C.panel2 }}>
                      <div style={{ width:14, height:14, borderRadius:3, flexShrink:0, border:`1.5px solid ${done?C.success:C.dim}`,
                        background:done?C.success:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {done && <span style={{ fontSize:9, color:'#000', fontWeight:900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:11, color:done?C.success:C.sub, lineHeight:1.3 }}>{item}</span>
                    </div>
                  )
                })}
              </div>
            </GPanel>

            {/* 당직 연락처 */}
            <GPanel title="당직 의료 담당" icon={<Phone size={12} color={C.info}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { lv:'1차', name:'이선장', sub:'브릿지 · 내선 101', color:C.success },
                  { lv:'2차', name:'부산원격의료센터 최원장', sub:'위성통신 #BUM-01 · 24시간', color:C.info },
                  { lv:'3차', name:'제3해양경찰서', sub:'122 · 목포 해경', color:C.warning },
                ].map((c,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:5, background:C.panel2, border:`1px solid ${C.border}` }}>
                    <Tag color={c.color} small>{c.lv}</Tag>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize:10, color:C.sub }}>{c.sub}</div>
                    </div>
                    <button style={{ padding:'3px 10px', borderRadius:3, background:`${c.color}18`, border:`1px solid ${c.color}44`, color:c.color, fontSize:10, fontWeight:700, cursor:'pointer', flexShrink:0 }}>연결</button>
                  </div>
                ))}
                <div style={{ padding:'8px 10px', borderRadius:5, background:`${C.cyan}0a`, border:`1px solid ${C.cyan}2a`, fontSize:11, color:C.cyan }}>
                  <span style={{ color:C.sub }}>최근접 병원 </span>목포한국병원 85km · 헬기 30분
                </div>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S2 : 선원 건강 모니터링 ════════════════════════════════════════ */}
        <Section id="s2" label="선원 건강 모니터링" color={C.success} collapsed={collapsed.s2} onToggle={()=>fold('s2')}>

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

            {/* 월별 트렌드 */}
            <GPanel title="월별 사고·처치 트렌드" icon={<TrendingUp size={12} color={C.info}/>}>
              <div style={{ height:190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND}>
                    <defs>
                      {[['gE',C.danger],['gC',C.success],['gR',C.info]].map(([id,col])=>(
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={col} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={col} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                    <XAxis dataKey="m" stroke={C.sub} fontSize={10} tickLine={false} axisLine={false}/>
                    <YAxis stroke={C.sub} fontSize={10} tickLine={false} axisLine={false}/>
                    <Tooltip contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, fontSize:11, borderRadius:6 }}/>
                    <Area type="monotone" dataKey="응급" stroke={C.danger} fill="url(#gE)" strokeWidth={2} dot={false}/>
                    <Area type="monotone" dataKey="검진" stroke={C.success} fill="url(#gC)" strokeWidth={2} dot={false}/>
                    <Area type="monotone" dataKey="원격" stroke={C.info} fill="url(#gR)" strokeWidth={2} dot={false}/>
                    <Legend wrapperStyle={{ fontSize:11, paddingTop:6 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S3 : 원격 의료 연결 ══════════════════════════════════════════ */}
        <Section id="s3" label="원격 의료 연결 관리" color={C.info} collapsed={collapsed.s3} onToggle={()=>fold('s3')}>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {/* 전송 현황 */}
            <GPanel title="데이터 전송 이력" icon={<Send size={12} color={C.info}/>}
              right={<button style={{ padding:'3px 10px', borderRadius:4, background:`${C.info}18`, border:`1px solid ${C.info}44`, color:C.info, fontSize:10, fontWeight:700, cursor:'pointer' }}>수동 전송</button>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:10 }}>
                {[
                  { l:'전송', v:TX_LOGS.length, c:C.info },
                  { l:'성공', v:TX_LOGS.filter(l=>l.ok).length, c:C.success },
                  { l:'실패', v:TX_LOGS.filter(l=>!l.ok).length, c:C.danger },
                ].map((s,i)=>(
                  <div key={i} style={{ padding:'10px', background:C.panel2, borderRadius:5, border:`1px solid ${C.border}`, textAlign:'center' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'monospace' }}>{s.v}</div>
                    <div style={{ fontSize:10, color:C.sub }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {TX_LOGS.map((l,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:4, background:C.panel2, border:`1px solid ${C.border}`, fontSize:11 }}>
                    <span style={{ color:C.sub, fontFamily:'monospace', fontSize:10, flexShrink:0 }}>{l.t}</span>
                    <span style={{ flex:1, color:C.sub }}>{l.type}</span>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:l.ok?C.success:C.danger, flexShrink:0 }}/>
                    <span style={{ color:l.ok?C.success:C.danger, fontSize:10, fontWeight:700 }}>{l.ok?'성공':'실패'}</span>
                    {!l.ok && <button style={{ padding:'2px 6px', borderRadius:3, background:`${C.warning}18`, border:`1px solid ${C.warning}44`, color:C.warning, fontSize:9, cursor:'pointer' }}>재시도</button>}
                  </div>
                ))}
              </div>
            </GPanel>

            {/* 병원 조회 */}
            <GPanel title="해상 위치 기반 수신 병원 (34°30'N 127°45'E · 여수해협)" icon={<MapPin size={12} color={C.warning}/>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {[
                  { name:'목포한국병원', dist:85, eta:'헬기 30분', trauma:false, cardio:true, gen:true },
                  { name:'부산대학교병원', dist:120, eta:'헬기 45분', trauma:true, cardio:true, gen:true },
                  { name:'여수전남병원', dist:150, eta:'헬기 55분', trauma:true, cardio:false, gen:true },
                  { name:'인천성모병원', dist:310, eta:'헬기 95분', trauma:true, cardio:true, gen:true },
                ].map((h,i)=>(
                  <div key={i} style={{ padding:'12px', borderRadius:5, background:C.panel2, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:12, fontWeight:700, marginBottom:4 }}>{h.name}</div>
                    <div style={{ fontSize:18, fontWeight:900, color:C.cyan, fontFamily:'monospace' }}>{h.dist}<span style={{ fontSize:11, color:C.sub }}> km</span></div>
                    <div style={{ fontSize:10, color:C.sub, marginBottom:8 }}>{h.eta}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                      {h.trauma && <Tag color={C.danger} small>외상</Tag>}
                      {h.cardio && <Tag color={C.info} small>심혈관</Tag>}
                      {h.gen && <Tag color={C.success} small>일반외과</Tag>}
                    </div>
                    <button style={{ width:'100%', marginTop:8, padding:'5px', borderRadius:4, background:`${C.warning}18`, border:`1px solid ${C.warning}44`, color:C.warning, fontSize:10, fontWeight:700, cursor:'pointer' }}>헬기 후송</button>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S4 : SOP 매뉴얼 & 교육 ══════════════════════════════════════ */}
        <Section id="s4" label="SOP 매뉴얼 및 교육 자료" color={C.purple} collapsed={collapsed.s4} onToggle={()=>fold('s4')}>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10 }}>
            {/* SOP 카드 그리드 */}
            <GPanel title="SOP 처치 가이드 (8종)" icon={<BookOpen size={12} color={C.purple}/>}
              right={<button style={{ padding:'3px 10px', borderRadius:4, background:`${C.purple}18`, border:`1px solid ${C.purple}44`, color:C.purple, fontSize:10, fontWeight:700, cursor:'pointer' }}>전체 인쇄</button>}>
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
            <GPanel title="STCW 훈련 이력" icon={<Users size={12} color={C.cyan}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {TRAINING.map((r,i)=>{
                  const sc = r.status==='유효'?C.success:r.status==='만료임박'?C.warning:C.danger
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:4, background:C.panel2, border:`1px solid ${C.border}`, fontSize:11 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:sc, flexShrink:0 }}/>
                      <span style={{ fontWeight:700, flex:1 }}>{r.name}</span>
                      <span style={{ color:C.sub, fontSize:10, flex:2 }}>{r.type}</span>
                      <Tag color={sc} small>{r.status}</Tag>
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
              { l:'위성 신호', v:'매우 강함', c:C.success, sub:'스타링크' },
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
                    { l:'데이터 암호화', k:'enc' },
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
              <div style={{ color:C.sub }}>대기 중... <span style={{ animation:'blink 1s infinite' }}>|</span></div>
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

const Section = React.forwardRef(function Section({ id, label, color, collapsed, onToggle, children }, _ref) {
  return (
    <div id={id} style={{ marginBottom:20 }}>
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
