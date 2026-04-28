import React, { useState, useEffect, useMemo } from 'react'
import {
  Ship, Clock, RefreshCw, Signal, Shield, TrendingUp, CheckCircle2,
  Phone, Send, Inbox, BookOpen, Users, ChevronDown, ChevronRight, X,
  Lock, Terminal, Download, Search, Edit2, Save, Heart, Cpu,
  HardDrive, MapPin, Activity, Wifi, AlertCircle, ShieldCheck, Pill, Sparkles
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
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
  { id:'S26-003', name:'박기관', role:'기관장', dept:'기관부', chronic:'고혈압, 고지혈증', allergies:'아스피린', isEmergency:true, lastMed:'암로디핀 5mg', age:55 },
  { id:'S26-004', name:'최갑판', role:'갑판장', dept:'항해부', chronic:'허리디스크', allergies:'없음', isEmergency:false, lastMed:'없음', age:41 },
  { id:'S26-005', name:'정조타', role:'조타사', dept:'항해부', chronic:'없음', allergies:'조개류', isEmergency:false, lastMed:'없음', age:38 },
  { id:'S26-006', name:'한닻별', role:'2등 항해사', dept:'항해부', chronic:'비염', allergies:'먼지', isEmergency:false, lastMed:'항히스타민제', age:35 },
  { id:'S26-007', name:'윤나침', role:'3등 항해사', dept:'항해부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:32 },
  { id:'S26-008', name:'강바다', role:'항해사', dept:'항해부', chronic:'없음', allergies:'복숭아', isEmergency:false, lastMed:'없음', age:29 },
  { id:'S26-009', name:'조항구', role:'조리장', dept:'지원부', chronic:'당뇨', allergies:'없음', isEmergency:false, lastMed:'메트포르민', age:50 },
  { id:'S26-010', name:'심망원', role:'갑판원', dept:'항해부', chronic:'없음', allergies:'없음', isEmergency:false, lastMed:'없음', age:27 },
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
]

function genSignal() {
  return Array.from({ length: 24 }, (_, i) => ({ h: `${i}시`, v: Math.floor(Math.random() * 25) + 70 }))
}

function riskOf(c) {
  if (c.isEmergency) return C.danger
  const ch = c.chronic === '없음' ? 0 : c.chronic.split(',').length
  return ch >= 2 ? C.danger : ch === 1 ? C.warning : C.success
}

function getPhoto(name) {
  return `/src/assets/photo/${name}`
}

/* ═══════════════════════════════════ MAIN ═════════════════════════════════ */
export default function Settings() {
  const [now, setNow] = useState(new Date())
  const [checks, setChecks] = useState({ 0: true, 1: true, 6: true })
  const [collapsed, setCollapsed] = useState({})
  const [logFilter, setLogFilter] = useState('전체')
  const [logSearch, setLogSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState({ ship:'MV KOREA STAR', no:'MED-001', sn:'MDTS-2024-KS-001', type:'컨테이너선', imo:'IMO 9876543', warranty:'2027-01-10', inspect:'2026-07-10' })
  const [devEdit, setDevEdit] = useState({ ...device })
  const [sec, setSec] = useState({ bio:true, enc:true, auto:true })
  const [signal] = useState(genSignal)
  const [coords, setCoords] = useState({ lat: '35.1028° N', lng: '129.0403° E' })

  const [trainingList, setTrainingList] = useState([
    { name: '김항해', id: 'S26-002', dept: '항해부', type: '기본 CPR (심폐소생술)', date: '2024-12-15', expiry: '2026-12-15' },
    { name: '이선장', id: 'S26-001', dept: '항해부', type: '고급 응급처치 (Advanced)', date: '2023-05-20', expiry: '2026-05-20' },
  ])
  const [managerList, setManagerList] = useState([
    { 
      id: 'S26-001', name: '이선장', role: '선장', dept: '항해부', nation: '대한민국', 
      dob: '1974-05-12', blood: 'O+', avatar: getPhoto('001.png'),
      status: '당직 중', location: '브릿지', schedule: '08:00 - 12:00', leave: '정상근무',
      muster: 'A-1 (Bridge Deck)', ice: '010-1234-5678 (배우자)', allergies: '없음',
      perm: '관리자', 
      certs: [
        { n: 'STCW II/2 (Master)', e: '2028-12-31' },
        { n: 'GOC (Radio)', e: '2027-05-20' }
      ] 
    },
    { 
      id: 'S26-003', name: '박기관', role: '기관장', dept: '기관부', nation: '대한민국', 
      dob: '1971-08-05', blood: 'B+', avatar: getPhoto('003.jpeg'),
      status: '비상 대기', location: 'ECR (엔진룸)', schedule: '대기', leave: '정상근무',
      muster: 'B-2 (Engine Room)', ice: '010-8765-4321 (배우자)', allergies: '아스피린',
      perm: '관리자', 
      certs: [
        { n: 'STCW III/2 (Chief)', e: '2029-03-22' },
        { n: 'Adv Fire Fighting', e: '2026-08-10' }
      ] 
    },
  ])
  const [newMgrName, setNewMgrName] = useState('')

  const addManager = () => {
    if(!newMgrName.trim()) return;
    const newMgr = {
      id: `S26-${String(managerList.length + 10).padStart(3, '0')}`,
      name: newMgrName, role: '의료보조', dept: '지원부', nation: '대한민국',
      dob: '1990-01-01', blood: 'A+', avatar: null,
      status: '휴식 중', location: '거주구역', schedule: '12:00 - 16:00', leave: '정상근무',
      muster: 'C-1 (Main Deck)', ice: '미등록', allergies: '없음',
      perm: '일반', certs: [{ n: '기본 CPR', e: '2026-12-31' }]
    };
    setManagerList([...managerList, newMgr]);
    setNewMgrName('');
  };

  const removeManager = (id) => {
    setManagerList(managerList.filter(m => m.id !== id));
  };

  useEffect(() => { 
    const t = setInterval(() => {
      setNow(new Date())
      setCoords(p => ({ lat: (parseFloat(p.lat) + (Math.random()-0.5)*0.0001).toFixed(4)+'° N', lng: (parseFloat(p.lng) + (Math.random()-0.5)*0.0001).toFixed(4)+'° E' }))
    }, 1000); return () => clearInterval(t) 
  }, [])

  const getStatusInfo = (expiry) => {
    if (!expiry) return { label: '기한없음', color: C.info }
    const diff = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24))
    return diff < 0 ? { label: '만료', color: C.danger } : diff < 90 ? { label: '만료임박', color: C.warning } : { label: '유효', color: C.success }
  }

  const checkPct = Math.round((Object.values(checks).filter(Boolean).length / CHECKLIST.length) * 100)
  const toggle = (i) => setChecks({ ...checks, [i]: !checks[i] })
  const fold = (k) => setCollapsed(p => ({ ...p, [k]: !p[k] }))

  const [meds, setMeds] = useState([
    { id:1, n:'타이레놀', c:'해열진통', q:45, m:10, e:'2027-05-20', cat:'pill' },
    { id:2, n:'아스피린', c:'혈전/통증', q:12, m:10, e:'2026-12-15', cat:'pill' },
    { id:3, n:'소화제', c:'위장장애', q:8, m:15, e:'2027-01-10', cat:'pill' },
    { id:4, n:'항히스타민', c:'알레르기', q:8, m:10, e:'2026-08-05', cat:'pill' },
    { id:5, n:'항생제 연고', c:'외상처치', q:15, m:5, e:'2027-03-22', cat:'cream' },
    { id:6, n:'포비돈(소독)', c:'소독', q:3, m:5, e:'2026-05-10', cat:'liquid' },
    { id:7, n:'압박붕대', c:'고정/압박', q:20, m:10, e:'-', cat:'bandage' },
    { id:8, n:'지혈대', c:'심한출혈', q:4, m:5, e:'-', cat:'bandage' },
    { id:9, n:'이부프로펜', c:'소염진통', q:30, m:10, e:'2027-08-12', cat:'pill' },
    { id:10, n:'멀미약', c:'항현훈제', q:50, m:20, e:'2026-11-30', cat:'pill' },
    { id:11, n:'종합감기약', c:'호흡기질환', q:25, m:10, e:'2027-02-14', cat:'pill' },
    { id:12, n:'제산제', c:'위산과다', q:40, m:15, e:'2027-04-01', cat:'pill' },
    { id:13, n:'생리식염수', c:'세척/소독', q:10, m:10, e:'2026-09-20', cat:'liquid' },
    { id:14, n:'알코올 스왑', c:'국소소독', q:100, m:50, e:'2028-01-10', cat:'pad' },
    { id:15, n:'멸균 거즈', c:'상처보호', q:60, m:30, e:'-', cat:'pad' },
    { id:16, n:'의료용 테이프', c:'드레싱고정', q:15, m:5, e:'-', cat:'bandage' },
    { id:17, n:'화상 거즈', c:'화상처치', q:5, m:10, e:'2026-06-15', cat:'pad' },
    { id:18, n:'일회용 인공눈물', c:'안구세척', q:30, m:20, e:'2027-10-05', cat:'liquid' },
    { id:19, n:'파스(패치)', c:'근육통', q:20, m:10, e:'2027-12-20', cat:'pad' },
    { id:20, n:'경구수액염', c:'탈수방지', q:15, m:10, e:'2027-03-30', cat:'pill' },
    { id:21, n:'바셀린 거즈', c:'피부보호', q:12, m:10, e:'2027-01-22', cat:'pad' },
    { id:22, n:'스테로이드 연고', c:'피부염', q:8, m:5, e:'2026-11-11', cat:'cream' },
    { id:23, n:'탄력 붕대', c:'관절고정', q:10, m:5, e:'-', cat:'bandage' },
    { id:24, n:'알루미늄 부목', c:'골절고정', q:4, m:2, e:'-', cat:'bandage' },
  ])
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false)
  const [editingMedId, setEditingMedId] = useState(null)

  const updateMed = (id, delta) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, q: Math.max(0, m.q + delta) } : m))
  }

  const updateMedExpiry = (id, newDate) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, e: newDate } : m))
    setEditingMedId(null)
  }

  const filteredMeds = useMemo(() => {
    if (!showOnlyAlerts) return meds
    return meds.filter(m => m.q <= m.m || (m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90))
  }, [meds, showOnlyAlerts])

  const medStats = useMemo(() => {
    const low = meds.filter(m => m.q <= m.m).length
    const expiring = meds.filter(m => m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90).length
    return { low, expiring, normal: meds.length - low - expiring }
  }, [meds])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEdu, setNewEdu] = useState({ name:'', id:'', dept:'', type:'기본 CPR (심폐소생술)', date:'', expiry:'' })
  const [dateEditor, setDateEditor] = useState(null) // { field, label, value }

  const addEdu = () => {
    if (!newEdu.id || !newEdu.date) return alert('선원과 날짜를 선택하세요.')
    setTrainingList([ { ...newEdu }, ...trainingList ])
    setIsModalOpen(false)
    setNewEdu({ name:'', id:'', dept:'', type:'기본 CPR (심폐소생술)', date:'', expiry:'' })
  }

  return (
    <div style={{ display:'flex', height:'calc(100vh - 72px)', background:C.bg, color:C.text, fontFamily:'"Pretendard",sans-serif', overflow:'hidden', position:'relative' }}>

      {/* ── 캘린더 모달 ── */}
      {dateEditor && (
        <CalendarModal 
          label={dateEditor.label} 
          initialValue={dateEditor.value} 
          onClose={() => setDateEditor(null)} 
          onSelect={(val) => {
            if (dateEditor.medId) {
              updateMedExpiry(dateEditor.medId, val)
            } else {
              setNewEdu(p => ({ ...p, [dateEditor.field]: val }))
            }
            setDateEditor(null)
          }} 
        />
      )}

      {/* ── 교육 이력 관리 모달 ── */}
      {isModalOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, fontFamily:'"Pretendard",sans-serif' }}>
          <div style={{ background:C.panel, border:`2px solid ${C.info}`, borderRadius:24, padding:45, width:650, boxShadow:'0 0 60px rgba(56,189,248,0.2)' }}>
            <div style={{ fontSize:32, fontWeight:950, marginBottom:35, color:C.info, display:'flex', alignItems:'center', gap:15, letterSpacing:'-1px' }}>
              <BookOpen size={36}/> 새 교육 이력 등록
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
              <div>
                <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800, display:'flex', justifyContent:'space-between' }}>
                  <span>교육 이수 선원 선택</span>
                  <span style={{ fontSize:14, color:C.info }}>부서 및 ID 자동 연동</span>
                </div>
                <select 
                  value={newEdu.id} 
                  onChange={e => {
                    const c = CREW.find(x => x.id === e.target.value);
                    if(c) setNewEdu({...newEdu, id:c.id, name:c.name, dept:c.dept});
                  }} 
                  style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', fontFamily:'inherit', appearance:'none', cursor:'pointer' }}>
                  <option value="">선원을 선택하세요 (이름 | ID | 부서)</option>
                  {CREW.map(c => (
                    <option key={c.id} value={c.id}>{c.name} | {c.id} | {c.dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>교육 과정</div>
                <select 
                  value={newEdu.type} 
                  onChange={e=>setNewEdu({...newEdu, type:e.target.value})} 
                  style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', fontFamily:'inherit', appearance:'none', cursor:'pointer' }}>
                  <option>기본 CPR (심폐소생술)</option>
                  <option>의료 응급 처치 (STCW)</option>
                  <option>선상 응급 의료 (Advanced)</option>
                  <option>AED 기기 작동법</option>
                  <option>원격 의료 장비 운용 교육</option>
                </select>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div>
                  <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>이수 날짜</div>
                  <div 
                    onClick={() => setDateEditor({ field:'date', label:'이수 날짜', value:newEdu.date })}
                    style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, cursor:'pointer', minHeight:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    {newEdu.date || <span style={{ color:'rgba(255,255,255,0.15)' }}>날짜 선택</span>}
                    <Clock size={20} color={C.sub} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>만료 날짜</div>
                  <div 
                    onClick={() => setDateEditor({ field:'expiry', label:'만료 날짜', value:newEdu.expiry })}
                    style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, cursor:'pointer', minHeight:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    {newEdu.expiry || <span style={{ color:'rgba(255,255,255,0.15)' }}>날짜 선택</span>}
                    <Clock size={20} color={C.sub} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:18, marginTop:45 }}>
              <button onClick={()=>setIsModalOpen(false)} style={{ flex:1, padding:20, borderRadius:15, background:'rgba(255,255,255,0.03)', border:`1px solid ${C.border}`, color:C.sub, fontSize:22, fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'0.2s' }}>취소</button>
              <button onClick={addEdu} style={{ flex:2, padding:20, borderRadius:15, background:C.info, border:'none', color:'#000', fontSize:22, fontWeight:950, cursor:'pointer', fontFamily:'inherit', transition:'0.2s', boxShadow:`0 10px 20px ${C.info}33` }}>이력 저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 사이드 네비 */}
      <nav style={{ width:86, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:28, gap:10, background:C.panel }}>
        {['현황','건강','SOP','시스템'].map((l, i) => (
          <button key={i} onClick={() => document.getElementById(`s${i+1===3?4:i+1===4?5:i+1}`)?.scrollIntoView({ behavior:'smooth' })}
            style={{ width:65, height:65, borderRadius:12, background:'transparent', border:'1px solid transparent', cursor:'pointer', fontSize:17, fontWeight:800, color:C.sub }}>{l}</button>
        ))}
      </nav>

      {/* 메인 스크롤 */}
      <div style={{ flex:1, overflowY:'auto', padding:'35px 42px' }}>

        {/* 헤더 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:35, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <Dot color={C.success} pulse />
            <Ship size={28} color={C.info} />
            <span style={{ fontSize:26, fontWeight:800 }}>MDTS 통합 인프라 관리</span>
            <Tag color={C.cyan} style={{ fontSize:18 }}>MV KOREA STAR</Tag>
          </div>
          <div style={{ fontSize:22, color:C.sub, display:'flex', gap:36 }}>
            <span><Clock size={22}/> {now.toLocaleTimeString()}</span>
            <span style={{ color:C.success }}><RefreshCw size={22}/> 5초 갱신</span>
          </div>
        </div>

        {/* ══ S1 : 의료 현황 (상단) ══ */}
        <Section id="s1" label="선박 의료 실시간 현황" color={C.cyan} collapsed={collapsed.s1} onToggle={() => fold('s1')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:30 }}>
            {[
              { l:'응급 장비 신뢰도', v:checkPct, u:'%', c:C.success, s:'정기 점검 완료', i:<ShieldCheck size={26}/>, p:checkPct },
              { l:'대응 가용 인원', v:trainingList.length, u:'명', c:C.info, s:'즉시 투입 가능', i:<Users size={26}/>, p:Math.min(100, (trainingList.length/10)*100) },
              { l:'의료 소모품 재고', v:'94', u:'%', c:C.cyan, s:'필수 의약품 24종', i:<Pill size={26}/>, p:94 },
              { l:'최근접 구조 거점', v:'85', u:'km', c:C.warning, s:'도착 예정 시간 45분', i:<MapPin size={26}/>, p:30 },
            ].map((s,idx)=>(
              <div key={idx} className="kpi-card" style={{ 
                background: `rgba(17, 19, 24, 0.6)`,
                backdropFilter: 'blur(20px)',
                border: `1.5px solid ${s.c}44`,
                borderRadius: 22,
                padding: '20px 24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 20px ${s.c}11`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={{ fontSize:18, color:C.sub, fontWeight:800, letterSpacing:'0.5px' }}>{s.l}</div>
                  <div style={{ padding:8, borderRadius:10, background:`${s.c}18`, color:s.c }}>{s.i}</div>
                </div>

                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:48, fontWeight:950, color:s.c, letterSpacing:'-2px', textShadow:`0 0 15px ${s.c}44` }}>{s.v}</span>
                  <span style={{ fontSize:22, color:C.sub, fontWeight:800 }}>{s.u}</span>
                </div>

                <div style={{ fontSize:16, color:'#fff', fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:s.c, boxShadow:`0 0 12px ${s.c}` }} />
                  {s.s}
                </div>

                <div style={{ height:8, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${s.p}%`, background:`linear-gradient(90deg, ${s.c}88, ${s.c})`, borderRadius:4, boxShadow:`0 0 15px ${s.c}88` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            <GPanel title="응급 대응 준비 상태" icon={<Shield size={22} color={C.success}/>} right={<span style={{ fontSize:25, fontWeight:900 }}>{checkPct}%</span>}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {CHECKLIST.map((item, i) => (
                  <div key={i} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:18, cursor:'pointer', padding:'15px 22px', borderRadius:10, background: checks[i] ? `${C.success}08` : C.panel2, border:`1px solid ${checks[i] ? `${C.success}33` : C.border}` }}>
                    <div style={{ width:24, height:24, borderRadius:6, border:`2px solid ${checks[i] ? C.success : C.dim}`, background: checks[i] ? C.success : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>{checks[i] && <CheckCircle2 size={18} color="#000" strokeWidth={3} />}</div>
                    <span style={{ fontSize:20, fontWeight: checks[i]?700:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </GPanel>

            <GPanel title="선원 의료 교육 이력" icon={<Users size={22} color={C.cyan}/>} right={<Btn color={C.info} small onClick={()=>setIsModalOpen(true)}>+</Btn>}>
              <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                {trainingList.map((r,i)=>(
                  <div key={i} style={{ padding:'20px 25px', borderRadius:18, background:C.panel2, border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:15 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                          <span style={{ fontSize:26, fontWeight:900, color:'#fff' }}>{r.name}</span>
                          <span style={{ fontSize:18, color:C.sub, fontWeight:700 }}>{r.id}</span>
                          <Tag color={C.dim} small style={{ fontSize:15, padding:'4px 10px', color:C.text }}>{r.dept || '부서 미지정'}</Tag>
                        </div>
                        <div style={{ fontSize:22, fontWeight:850, color:C.info }}>{r.type}</div>
                      </div>
                      <Tag color={getStatusInfo(r.expiry).color} style={{ fontSize:18, padding:'6px 15px' }}>{getStatusInfo(r.expiry).label}</Tag>
                    </div>

                    <div style={{ display:'flex', gap:30, borderTop:`1px solid ${C.border}`, paddingTop:15, marginTop:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <CheckCircle2 size={20} color={C.success} />
                        <span style={{ fontSize:17, color:C.sub, fontWeight:700 }}>이수:</span>
                        <span style={{ fontSize:18, fontWeight:800, color:C.text }}>{r.date || '-'}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Clock size={20} color={getStatusInfo(r.expiry).color} />
                        <span style={{ fontSize:17, color:C.sub, fontWeight:700 }}>만료:</span>
                        <span style={{ fontSize:18, fontWeight:800, color:getStatusInfo(r.expiry).color }}>{r.expiry || '기한 없음'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>

          <div style={{ marginTop: 25 }}>
            <GPanel title="필수 의료 약품 및 소모품 재고 관리 (24종)" icon={<Pill size={22} color={C.warning}/>} 
              right={<div style={{ display:'flex', gap:15 }}>
                <button 
                  onClick={() => setShowOnlyAlerts(!showOnlyAlerts)}
                  style={{ background: showOnlyAlerts ? C.warning : 'rgba(255,255,255,0.05)', border: `1px solid ${showOnlyAlerts ? C.warning : C.border}`, color: showOnlyAlerts ? '#000' : C.sub, padding: '5px 15px', borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}
                >보충 필요 항목만 보기</button>
                <Tag color={C.success} small>정상 : {medStats.normal}</Tag>
                <Tag color={C.warning} small>보충필요 : {medStats.low}</Tag>
                <Tag color={C.danger} small>기한임박 : {medStats.expiring}</Tag>
              </div>}>
              
              <div style={{ maxHeight: 450, overflowY: 'auto', paddingRight: 10, marginTop: 10 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:15 }}>
                  {filteredMeds.map(m => {
                    const isLow = m.q <= m.m;
                    const isExpiring = m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90;
                    return (
                      <div key={m.id} style={{ background:C.panel, border:`1.5px solid ${isLow ? C.warning+'66' : isExpiring ? C.danger+'66' : C.border}`, borderRadius:15, padding:'20px', transition:'0.2s', position:'relative' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:15 }}>
                          <div>
                            <div style={{ fontSize:14, color:C.sub, fontWeight:800, marginBottom:4, display:'flex', alignItems:'center', gap:5 }}>
                              {m.cat === 'pill' ? <Pill size={12}/> : m.cat === 'liquid' ? <Activity size={12}/> : <Shield size={12}/>} {m.c}
                            </div>
                            <div style={{ fontSize:21, fontWeight:900, color:'#fff' }}>{m.n}</div>
                          </div>
                          {isExpiring && <span style={{ background:C.danger, color:'#fff', fontSize:12, padding:'3px 6px', borderRadius:5, fontWeight:900, animation:'blink 2s infinite' }}>기한임박</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:C.panel2, padding:'10px 15px', borderRadius:10, marginBottom:12, border:`1px solid ${C.border}` }}>
                          <button onClick={()=>updateMed(m.id, -1)} style={{ background:'none', border:'none', color:C.info, cursor:'pointer', fontSize:26, fontWeight:900 }}>-</button>
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontSize:24, fontWeight:900, color:isLow ? C.warning : C.success }}>{m.q}</div>
                            <div style={{ fontSize:14, color:C.sub, fontWeight:700 }}>최소 {m.m}</div>
                          </div>
                          <button onClick={()=>updateMed(m.id, 1)} style={{ background:'none', border:'none', color:C.info, cursor:'pointer', fontSize:26, fontWeight:900 }}>+</button>
                        </div>
                        <div style={{ fontSize:15, color:C.sub, textAlign:'center', fontWeight:700 }}>
                          유통기한 : {editingMedId === m.id ? (
                            <input 
                              autoFocus
                              defaultValue={m.e}
                              onBlur={e => updateMedExpiry(m.id, e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && updateMedExpiry(m.id, e.target.value)}
                              style={{ width:100, background:C.panel2, border:`1px solid ${C.info}`, borderRadius:4, color:'#fff', textAlign:'center', outline:'none', fontSize:14, fontFamily:'monospace' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingMedId(m.id)}
                              style={{ color:isExpiring?C.danger:C.text, cursor:'pointer' }}
                            >{m.e}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {filteredMeds.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: C.sub, fontSize: 18, fontWeight: 700 }}>현재 보충이 필요한 항목이 없습니다.</div>
                )}
              </div>
              <div style={{ marginTop:20, textAlign:'center' }}>
                <Btn color={C.info} style={{ fontSize:17, padding:'10px 25px' }}>+ 신규 약품/소모품 등록</Btn>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S2 : 선원 건강 ══ */}
        <Section id="s2" label="선원 건강 모니터링" color={C.success} collapsed={collapsed.s2} onToggle={()=>fold('s2')}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.2fr', gap:18, marginBottom:18 }}>
            <GPanel title="건강 위험 분포" icon={<Activity size={22} color={C.danger}/>}>
              <div style={{ height:250, position:'relative' }}>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:70,c:C.success},{v:20,c:C.warning},{v:10,c:C.danger}]} innerRadius={60} outerRadius={90} dataKey="v" stroke="none">{[{v:70,c:C.success},{v:20,c:C.warning},{v:10,c:C.danger}].map((e,idx)=><Cell key={idx} fill={e.c}/>)}</Pie></PieChart></ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}><div style={{ fontSize:18, color:C.sub }}>SAFETY</div><div style={{ fontSize:32, fontWeight:900 }}>82%</div></div>
              </div>
            </GPanel>
            <GPanel title="부서별 상태" icon={<Users size={22} color={C.info}/>}><div style={{ height:250 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={[{n:'항해',v:12},{n:'기관',v:10},{n:'지원',v:4}]}><XAxis dataKey="n" stroke={C.sub} fontSize={16}/><YAxis hide/><Bar dataKey="v" fill={C.info} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></GPanel>
            <GPanel title="기저 질환 통계" icon={<AlertCircle size={22} color={C.warning}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[{l:'고혈압',v:5,c:C.danger},{l:'당뇨',v:2,c:C.warning},{l:'허리디스크',v:1,c:C.info}].map(d=>(
                  <div key={d.l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 18px', background:C.panel2, borderRadius:10 }}>
                    <span style={{ fontSize:20, fontWeight:700 }}>{d.l}</span><span style={{ fontSize:22, fontWeight:900, color:d.c }}>{d.v}명</span>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>
          <GPanel title="선원 건강 위험도 히트맵" icon={<Activity size={22} color={C.success}/>}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {CREW.map(c => <div key={c.id} title={`${c.name} - ${c.role}`} style={{ width:85, padding:'12px 5px', borderRadius:10, background:`${riskOf(c)}1a`, border:`1px solid ${riskOf(c)}44`, textAlign:'center', cursor:'pointer' }}><div style={{ fontSize:17, fontWeight:800, color:riskOf(c) }}>{c.name}</div><div style={{ width:10, height:10, borderRadius:'50%', background:riskOf(c), margin:'5px auto 0' }}/></div>)}
            </div>
          </GPanel>
        </Section>

        {/* ══ S4 : SOP ══ */}
        <Section id="s4" label="응급처치 지침 및 SOP" color={C.purple} collapsed={collapsed.s4} onToggle={()=>fold('s4')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
            {SOP_LIST.map((s,i)=>(
              <div key={i} style={{ padding:'25px 20px', borderRadius:15, background:C.panel2, border:`1px solid ${C.border}`, textAlign:'center' }}>
                <div style={{ fontSize:18, color:s.color, fontWeight:800, marginBottom:10 }}>{s.code}</div>
                <div style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>{s.title}</div>
                <Tag color={s.color} small>{s.cat}</Tag>
              </div>
            ))}
          </div>
        </Section>

        {/* ══ S5 : 시스템 관리 (하단) ══ */}
        <Section id="s5" label="시스템 관리 및 장비 건전성" color={C.warning} collapsed={collapsed.s5} onToggle={()=>fold('s5')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:18 }}>
            {[{l:'위성 신호',v:'매우 강함',c:C.success,s:'Starlink'},{l:'응답 속도',v:'42ms',c:C.info,s:'STABLE'},{l:'동기화',v:'09:31',c:C.success,s:'COMPLETED'},{l:'AI 버전',v:'v2.4.1',c:C.purple,s:'EDGE'}].map((s,i)=>(
              <div key={i} style={{ background:C.panel, border:`1px solid ${C.border}`, borderTop:`4px solid ${s.c}`, borderRadius:12, padding:'22px 28px' }}>
                <div style={{ fontSize:18, color:C.sub, fontWeight:700, marginBottom:10 }}>{s.l}</div>
                <div style={{ fontSize:32, fontWeight:900, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:16, color:C.sub, marginTop:5 }}>{s.s}</div>
              </div>
            ))}
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:18, marginBottom:18 }}>
            <GPanel title="위성 신호 품질 (24h)" icon={<Wifi size={22} color={C.info}/>}><div style={{ height:220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={signal}><Area type="monotone" dataKey="v" stroke={C.info} fill={C.info} fillOpacity={0.1} strokeWidth={4} dot={false}/></AreaChart></ResponsiveContainer></div></GPanel>
            <GPanel title="실시간 선박 좌표" icon={<MapPin size={22} color={C.cyan}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:25, justifyContent:'center', height:220 }}>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'20px', textAlign:'center' }}><div style={{ fontSize:16, color:C.sub, fontWeight:800 }}>LATITUDE</div><div style={{ fontSize:28, fontWeight:900, color:C.cyan }}>{coords.lat}</div></div>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'20px', textAlign:'center' }}><div style={{ fontSize:16, color:C.sub, fontWeight:800 }}>LONGITUDE</div><div style={{ fontSize:28, fontWeight:900, color:C.cyan }}>{coords.lng}</div></div>
              </div>
            </GPanel>
            <GPanel title="기기 정보" icon={<HardDrive size={22} color={C.warning}/>} right={<Edit2 size={18} color={C.sub}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:10 }}>
                {[{l:'선박명',v:'KOREA STAR'},{l:'기기번호',v:'MED-001'},{l:'IMO 번호',v:'9876543'},{l:'S/N',v:'SN-10294'},{l:'보증만료',v:'2027-11'}].map(d=><div key={d.l} style={{ display:'flex', justifyContent:'space-between', fontSize:19 }}><span style={{ color:C.sub }}>{d.l}</span><span style={{ fontWeight:700 }}>{d.v}</span></div>)}
              </div>
            </GPanel>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1.5fr', gap:18, marginBottom:18 }}>
            <GPanel title="보안 설정" icon={<Lock size={22} color={C.success}/>}><div style={{ display:'flex', flexDirection:'column', gap:15 }}>{[{l:'생체 인증 로그인',k:'bio'},{l:'엔드투엔드 암호화',k:'enc'},{l:'30분 자동 로그아웃',k:'auto'}].map(s=><div key={s.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:20 }}><span style={{ color:C.sub }}>{s.l}</span><Toggle on={sec[s.k]} color={C.success} onChange={()=>{}}/></div>)}</div></GPanel>
            <GPanel title="AI 분석 모델" icon={<Cpu size={22} color={C.purple}/>}><div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:19 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:C.sub }}>엔진 버전</span><span style={{ color:C.purple, fontWeight:800 }}>v2.4.1</span></div><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:C.sub }}>진단 정확도</span><span style={{ color:C.success, fontWeight:800 }}>98.2%</span></div><Btn color={C.purple} small style={{ marginTop:15 }}>업데이트 확인</Btn></div></GPanel>
            <GPanel title="시스템 활동 로그" icon={<Terminal size={22} color={C.sub}/>} right={<Search size={18} color={C.sub}/>}>
              <div style={{ height:180, overflowY:'auto', background:'#060809', padding:18, borderRadius:12, fontFamily:'monospace', fontSize:17, border:`1px solid ${C.border}` }}>
                {SYS_LOGS.map((l,i)=><div key={i} style={{ marginBottom:8 }}><span style={{ color:C.sub }}>[{l.t}]</span> <span style={{ color:l.type==='error'?C.danger:C.info }}>{l.msg}</span></div>)}
              </div>
            </GPanel>
          </div>

          <div style={{ marginTop: 25 }}>
            <GPanel title="시스템 및 장비 건전성 모니터링" icon={<ShieldCheck size={22} color={C.success}/>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:15 }}>
                {[
                  { n:'MDTS 메인 서버', s:'ACTIVE', c:C.success, d:'Uptime 142d 08h' },
                  { n:'AED 배터리/패드', s:'NORMAL', c:C.success, d:'점검: 2026-11-20' },
                  { n:'바이탈 센서 (Hub)', s:'STABLE', c:C.info, d:'5개 노드 연결됨' },
                  { n:'위성 통신 링크', s:'EXCELLENT', c:C.success, d:'Starlink Gen3' },
                ].map((d,i)=>(
                  <div key={i} style={{ padding:'22px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:15 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}><span style={{ fontSize:20, fontWeight:700 }}>{d.n}</span><div style={{ display:'flex', alignItems:'center', gap:8 }}><Dot color={d.c} pulse={d.c===C.success}/><span style={{ fontSize:16, fontWeight:900, color:d.c }}>{d.s}</span></div></div>
                    <div style={{ fontSize:18, color:C.sub, fontFamily:'monospace' }}>{d.d}</div>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>
        </Section>
        <div style={{ height:50 }}/>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .kpi-card:hover { transform: translateY(-8px); background: rgba(17, 19, 24, 0.8) !important; border-color: inherit !important; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.6) !important; }
        .premium-btn:hover { background: rgba(255,255,255,0.05) !important; filter: brightness(1.2); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:10px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}

/* ─── 서브 컴포넌트 ─── */
const Section = ({ id, label, color, collapsed, onToggle, children }) => (
  <div id={id} style={{ marginBottom:40 }}>
    <div onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:15, padding:'18px 25px', borderRadius:12, background:`${color}08`, border:`1px solid ${color}2a`, cursor:'pointer', marginBottom:collapsed?0:20 }}>
      <div style={{ width:5, height:25, background:color, borderRadius:2 }}/>
      <span style={{ fontSize:24, fontWeight:800, color, flex:1 }}>{label}</span>
      {collapsed ? <ChevronRight size={26} color={color}/> : <ChevronDown size={26} color={color}/>}
    </div>
    {!collapsed && children}
  </div>
)

const GPanel = ({ title, icon, right, children }) => (
  <div style={{ 
    background:'rgba(22, 27, 34, 0.5)', 
    backdropFilter:'blur(15px)',
    border:'1px solid rgba(255,255,255,0.08)', 
    borderRadius:24, 
    padding:'32px', 
    height:'100%', 
    display:'flex', 
    flexDirection:'column',
    boxShadow:'0 15px 35px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.02)'
  }}>
    <div style={{ 
      display:'flex', 
      justifyContent:'space-between', 
      alignItems:'center', 
      marginBottom:25, 
      paddingBottom:18, 
      borderBottom:'1px solid rgba(255,255,255,0.05)',
      position:'relative'
    }}>
      <div style={{ position:'absolute', bottom:-1, left:0, width:60, height:2, background:C.info, boxShadow:`0 0 10px ${C.info}` }} />
      <div style={{ display:'flex', alignItems:'center', gap:15, fontSize:24, fontWeight:850, color:'#fff', letterSpacing:'-0.5px' }}>
        <div style={{ padding:8, borderRadius:10, background:'rgba(255,255,255,0.03)', display:'flex' }}>{icon}</div>
        {title}
      </div>
      {right}
    </div>
    <div style={{ flex:1 }}>{children}</div>
  </div>
)

const Tag = ({ color, children, small, style }) => (
  <span style={{ padding: small?'5px 12px':'8px 18px', borderRadius:8, fontSize:small?16:20, fontWeight:800, background:`${color}12`, color, border:`1px solid ${color}44`, boxShadow:`inset 0 0 10px ${color}08`, ...style }}>{children}</span>
)

const Dot = ({ color, pulse }) => (
  <div style={{ width:14, height:14, borderRadius:'50%', background:color, boxShadow:`0 0 15px ${color}`, animation:pulse?'pulse 2s infinite':undefined }}/>
)

const Btn = ({ color, onClick, children, small, style }) => (
  <button onClick={onClick} className="premium-btn" style={{ 
    padding:small?'10px 20px':'12px 28px', 
    borderRadius:12, 
    background:`linear-gradient(135deg, ${color}22, ${color}05)`, 
    border:`1px solid ${color}55`, 
    color, 
    fontSize:small?18:21, 
    fontWeight:800, 
    cursor:'pointer',
    transition:'all 0.2s',
    ...style 
  }}>{children}</button>
)

const Toggle = ({ on, color, onChange }) => (
  <div onClick={onChange} style={{ 
    width:70, height:36, borderRadius:18, background:on?`${color}33`:C.dim, 
    border:`1.5px solid ${on?color:'rgba(255,255,255,0.1)'}`,
    position:'relative', cursor:'pointer', transition:'all 0.3s', flexShrink:0 
  }}>
    <div style={{ 
      position:'absolute', top:4, left:on?38:4, width:25, height:25, 
      borderRadius:'50%', background:on?color:'#fff', transition:'all 0.3s',
      boxShadow:on?`0 0 15px ${color}`:'none'
    }}/>
  </div>
)

function CalendarModal({ label, initialValue, onClose, onSelect }) {
  const [viewDate, setViewDate] = useState(initialValue && !isNaN(new Date(initialValue).getTime()) ? new Date(initialValue) : new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ width: 650, background: '#0a1224', border: '2.5px solid #0dd9c5', borderRadius: 40, padding: 50, boxShadow: '0 0 80px rgba(13,217,197,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0dd9c5', marginBottom: 8 }}>{label} 시스템 설정</div>
            <div style={{ display:'flex', alignItems:'center', gap:15 }}>
              <select 
                value={year} 
                onChange={e => setViewDate(new Date(parseInt(e.target.value), month, 1))}
                style={{ background:'transparent', border:'none', color:'#fff', fontSize:42, fontWeight:950, cursor:'pointer', outline:'none', fontFamily:'inherit', appearance:'none' }}>
                {Array.from({length:30}, (_,i)=>2010+i).map(y=><option key={y} value={y} style={{background:'#0a1224', color:'#fff'}}>{y}년</option>)}
              </select>
              <div style={{ fontSize: 42, fontWeight: 950, color: '#fff' }}>{month + 1}월</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 60, height: 60, borderRadius: 20, cursor: 'pointer' }}><X size={30}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, marginBottom: 40 }}>
          <button onClick={() => setViewDate(new Date(year - 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>이전 해</button>
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>이전 달</button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>다음 달</button>
          <button onClick={() => setViewDate(new Date(year + 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>다음 해</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, textAlign: 'center' }}>
          {['일','월','화','수','목','금','토'].map((d,i) => <div key={i} style={{ color: i===0?'#ff4d6d':i===6?'#38bdf8':'#64748b', fontWeight: 900, fontSize: 18, marginBottom: 15 }}>{d}</div>)}
          {days.map((d, i) => {
            const dateKey = d ? `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null;
            const isSelected = dateKey && dateKey === initialValue;
            const isToday = d && new Date().toDateString() === new Date(year, month, d).toDateString();
            return (
              <div key={i} onClick={() => d && onSelect(dateKey)} style={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18, fontSize: 24, fontWeight: 800, cursor: d?'pointer':'default', background: isSelected ? '#0dd9c5' : 'rgba(255,255,255,0.02)', color: isSelected ? '#020617' : '#fff', border: isToday && !isSelected ? '1.5px solid #0dd9c5' : 'none', transition: '0.2s' }} onMouseEnter={e => d && !isSelected && (e.target.style.background='rgba(13,217,197,0.2)')} onMouseLeave={e => d && !isSelected && (e.target.style.background='rgba(255,255,255,0.02)')}>{d}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
