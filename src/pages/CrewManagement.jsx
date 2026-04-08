import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, UserPlus, X, Save, ChevronDown, ChevronUp, AlertCircle, User } from 'lucide-react'

const ROLES = ['선장','일등항해사','이등항해사','삼등항해사','항해사','기관장','일등기관사','이등기관사','삼등기관사','기관사','전기사','통신사','갑판장','갑판원','기관원','조리장','조리원','사무장','의료보조','수리사','선실원']
const BLOODS = ['A+','A-','B+','B-','O+','O-','AB+','AB-']
const RISK = { high:'#ff4d6d', medium:'#ff9f43', low:'#26de81' }

const INITIAL_CREW = [
  { id:'S2026-001', name:'김태양', age:55, gender:'남', role:'기관장',    blood:'A+',  contact:'010-1001-0001', emergency:'이미래 010-2001-0001', embark:'2024-01-10', chronic:'고혈압, 고지혈증', allergies:'아스피린',  lastMed:'암로디핀 5mg', dob:'1971-08-22', height:174, weight:76, risk:'high',   location:'기관실 B-4', note:'심근경색 과거력 2022년' },
  { id:'S2026-002', name:'박준혁', age:48, gender:'남', role:'선장',      blood:'B+',  contact:'010-1001-0002', emergency:'최지혜 010-2001-0002', embark:'2023-06-01', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1978-03-15', height:178, weight:82, risk:'low',    location:'선교(브릿지)', note:'정상' },
  { id:'S2026-003', name:'이수진', age:35, gender:'남', role:'일등항해사', blood:'O+',  contact:'010-1001-0003', emergency:'박수아 010-2001-0003', embark:'2024-03-20', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1991-07-08', height:176, weight:74, risk:'low',    location:'선교(브릿지)', note:'정상' },
  { id:'S2026-004', name:'최동현', age:40, gender:'남', role:'이등항해사', blood:'A-',  contact:'010-1001-0004', emergency:'정은지 010-2001-0004', embark:'2024-02-14', chronic:'없음',          allergies:'페니실린',  lastMed:'없음',         dob:'1986-11-22', height:172, weight:70, risk:'low',    location:'선교(브릿지)', note:'정상' },
  { id:'S2026-005', name:'정재원', age:29, gender:'남', role:'삼등항해사', blood:'B-',  contact:'010-1001-0005', emergency:'정민아 010-2001-0005', embark:'2025-01-05', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1997-04-30', height:180, weight:75, risk:'low',    location:'선교(브릿지)', note:'정상' },
  { id:'S2026-006', name:'강동훈', age:52, gender:'남', role:'일등기관사', blood:'AB+', contact:'010-1001-0006', emergency:'강미선 010-2001-0006', embark:'2023-09-10', chronic:'당뇨(경증)',     allergies:'없음',      lastMed:'메트포르민 500mg', dob:'1974-12-03', height:170, weight:85, risk:'medium', location:'기관실 A-1', note:'당뇨 관리 중' },
  { id:'S2026-007', name:'윤성민', age:38, gender:'남', role:'이등기관사', blood:'O+',  contact:'010-1001-0007', emergency:'윤지현 010-2001-0007', embark:'2024-04-01', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1988-09-17', height:175, weight:72, risk:'low',    location:'기관실 A-2', note:'정상' },
  { id:'S2026-008', name:'임진우', age:32, gender:'남', role:'삼등기관사', blood:'A+',  contact:'010-1001-0008', emergency:'임수연 010-2001-0008', embark:'2025-02-20', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1994-06-25', height:177, weight:78, risk:'low',    location:'기관실 A-3', note:'정상' },
  { id:'S2026-009', name:'한승욱', age:45, gender:'남', role:'기관사',    blood:'B+',  contact:'010-1001-0009', emergency:'한미영 010-2001-0009', embark:'2023-11-15', chronic:'고혈압(경증)',   allergies:'없음',      lastMed:'로살탄 50mg',  dob:'1981-01-19', height:173, weight:80, risk:'medium', location:'기관실 B-1', note:'혈압약 복용 중' },
  { id:'S2026-010', name:'서준영', age:27, gender:'남', role:'기관사',    blood:'O-',  contact:'010-1001-0010', emergency:'서현경 010-2001-0010', embark:'2025-03-10', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1999-08-11', height:181, weight:77, risk:'low',    location:'기관실 B-2', note:'정상' },
  { id:'S2026-011', name:'오현석', age:42, gender:'남', role:'전기사',    blood:'A+',  contact:'010-1001-0011', emergency:'오선미 010-2001-0011', embark:'2024-01-25', chronic:'없음',          allergies:'설파제',    lastMed:'없음',         dob:'1984-05-07', height:174, weight:73, risk:'low',    location:'전기실', note:'정상' },
  { id:'S2026-012', name:'문정호', age:50, gender:'남', role:'통신사',    blood:'AB-', contact:'010-1001-0012', emergency:'문채원 010-2001-0012', embark:'2023-07-20', chronic:'고지혈증',      allergies:'없음',      lastMed:'아토르바스타틴 10mg', dob:'1976-02-28', height:168, weight:79, risk:'medium', location:'통신실', note:'고지혈증 관리 중' },
  { id:'S2026-013', name:'배상우', age:46, gender:'남', role:'갑판장',    blood:'O+',  contact:'010-1001-0013', emergency:'배소영 010-2001-0013', embark:'2023-05-18', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1980-10-14', height:176, weight:83, risk:'low',    location:'갑판', note:'정상' },
  { id:'S2026-014', name:'남기현', age:30, gender:'남', role:'갑판원',    blood:'B+',  contact:'010-1001-0014', emergency:'남은영 010-2001-0014', embark:'2025-01-15', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1996-07-03', height:179, weight:76, risk:'low',    location:'갑판 1구역', note:'정상' },
  { id:'S2026-015', name:'고영재', age:33, gender:'남', role:'갑판원',    blood:'A-',  contact:'010-1001-0015', emergency:'고미나 010-2001-0015', embark:'2024-08-05', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1993-12-21', height:175, weight:71, risk:'low',    location:'갑판 2구역', note:'정상' },
  { id:'S2026-016', name:'류민철', age:36, gender:'남', role:'갑판원',    blood:'O+',  contact:'010-1001-0016', emergency:'류지수 010-2001-0016', embark:'2024-06-10', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1990-03-16', height:172, weight:74, risk:'low',    location:'갑판 3구역', note:'정상' },
  { id:'S2026-017', name:'신우진', age:25, gender:'남', role:'갑판원',    blood:'B-',  contact:'010-1001-0017', emergency:'신지은 010-2001-0017', embark:'2025-04-01', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'2001-09-09', height:182, weight:78, risk:'low',    location:'갑판 4구역', note:'신규 승선' },
  { id:'S2026-018', name:'전성준', age:39, gender:'남', role:'갑판원',    blood:'A+',  contact:'010-1001-0018', emergency:'전혜진 010-2001-0018', embark:'2024-03-01', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1987-11-30', height:171, weight:69, risk:'low',    location:'갑판 5구역', note:'정상' },
  { id:'S2026-019', name:'방재민', age:44, gender:'남', role:'기관원',    blood:'AB+', contact:'010-1001-0019', emergency:'방소희 010-2001-0019', embark:'2023-10-08', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1982-06-18', height:169, weight:82, risk:'low',    location:'기관실 C-1', note:'정상' },
  { id:'S2026-020', name:'황도현', age:31, gender:'남', role:'기관원',    blood:'O+',  contact:'010-1001-0020', emergency:'황소연 010-2001-0020', embark:'2025-02-01', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1995-04-22', height:177, weight:75, risk:'low',    location:'기관실 C-2', note:'정상' },
  { id:'S2026-021', name:'안성기', age:28, gender:'남', role:'기관원',    blood:'A+',  contact:'010-1001-0021', emergency:'안지현 010-2001-0021', embark:'2025-03-20', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1998-01-14', height:176, weight:70, risk:'low',    location:'기관실 C-3', note:'정상' },
  { id:'S2026-022', name:'조현우', age:53, gender:'남', role:'조리장',    blood:'B+',  contact:'010-1001-0022', emergency:'조미란 010-2001-0022', embark:'2023-04-15', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1973-08-05', height:166, weight:88, risk:'low',    location:'조리실', note:'정상' },
  { id:'S2026-023', name:'장태민', age:24, gender:'남', role:'조리원',    blood:'O+',  contact:'010-1001-0023', emergency:'장지민 010-2001-0023', embark:'2025-01-20', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'2002-03-27', height:173, weight:68, risk:'low',    location:'조리실', note:'정상' },
  { id:'S2026-024', name:'권민준', age:43, gender:'남', role:'사무장',    blood:'A-',  contact:'010-1001-0024', emergency:'권세진 010-2001-0024', embark:'2023-08-12', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1983-10-10', height:174, weight:77, risk:'low',    location:'사무실', note:'정상' },
  { id:'S2026-025', name:'유재혁', age:37, gender:'남', role:'수리사',    blood:'O+',  contact:'010-1001-0025', emergency:'유나경 010-2001-0025', embark:'2024-05-07', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'1989-07-19', height:178, weight:80, risk:'low',    location:'수리공방', note:'정상' },
  { id:'S2026-026', name:'노성현', age:26, gender:'남', role:'의료보조',  blood:'B+',  contact:'010-1001-0026', emergency:'노하은 010-2001-0026', embark:'2025-01-10', chronic:'없음',          allergies:'없음',      lastMed:'없음',         dob:'2000-05-31', height:175, weight:72, risk:'low',    location:'의무실', note:'의료보조 1년차' },
]

const EMPTY_FORM = { name:'', age:'', gender:'남', role:'갑판원', blood:'A+', contact:'', emergency:'', embark:'', chronic:'없음', allergies:'없음', lastMed:'없음', dob:'', height:'', weight:'', location:'', note:'정상' }

export default function CrewManagement({ onSelectPatient }) {
  const [crew, setCrew]         = useState(INITIAL_CREW)
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)   // 상세 보기
  const [editing, setEditing]   = useState(null)   // 수정 중인 id or 'new'
  const [form, setForm]         = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)   // 삭제 확인

  const filtered = crew.filter(c =>
    c.name.includes(query) || c.role.includes(query) || c.id.includes(query)
  )

  // 수정 시작
  const startEdit = (c) => {
    setEditing(c.id)
    setForm({ ...c })
    setSelected(null)
  }
  // 신규 입력
  const startNew = () => {
    setEditing('new')
    setForm({ ...EMPTY_FORM, id: `S2026-${String(crew.length + 1).padStart(3,'0')}` })
    setSelected(null)
  }
  // 저장
  const save = () => {
    if (!form.name || !form.role) return
    if (editing === 'new') {
      setCrew(prev => [...prev, { ...form, age: Number(form.age), height: Number(form.height), weight: Number(form.weight), risk: form.chronic !== '없음' ? 'medium' : 'low' }])
    } else {
      setCrew(prev => prev.map(c => c.id === editing ? { ...form, age: Number(form.age), height: Number(form.height), weight: Number(form.weight) } : c))
    }
    setEditing(null)
  }
  // 삭제
  const confirmDelete = (id) => {
    setCrew(prev => prev.filter(c => c.id !== id))
    setDeleteId(null)
    if (selected?.id === id) setSelected(null)
  }
  // 환자 등록
  const registerPatient = (c) => {
    onSelectPatient({
      ...c,
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200`,
      hr: 80, bp: '120/80', temp: 36.5, spo2: 98,
    })
  }

  const fld = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display:'flex', height:'calc(100vh - 44px)', overflow:'hidden', background:'#050d1a' }}>

      {/* ── 좌: 리스트 ── */}
      <div style={{ width: editing ? 340 : selected ? 360 : '100%', flexShrink:0, display:'flex', flexDirection:'column', borderRight:'1.5px solid rgba(13,217,197,0.13)', transition:'width 0.3s' }}>
        {/* 툴바 */}
        <div style={{ padding:'14px 16px', background:'rgba(8,18,35,0.97)', borderBottom:'1px solid rgba(13,217,197,0.12)', display:'flex', gap:10, flexShrink:0 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(13,217,197,0.12)', borderRadius:9, padding:'8px 12px' }}>
            <Search size={13} color="#4a6080"/>
            <input
              placeholder="이름, 직책, ID 검색..."
              value={query} onChange={e=>setQuery(e.target.value)}
              style={{ background:'none', border:'none', outline:'none', color:'var(--text-primary)', fontSize:13, width:'100%' }}
            />
          </div>
          <button onClick={startNew} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'linear-gradient(135deg,#0dd9c5,#09b8a6)', border:'none', borderRadius:9, cursor:'pointer', color:'#050d1a', fontSize:12, fontWeight:800, flexShrink:0 }}>
            <Plus size={14}/> 선원 추가
          </button>
        </div>
        {/* 헤더 카운트 */}
        <div style={{ padding:'8px 16px', background:'rgba(8,18,35,0.9)', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:11, color:'#4a6080', display:'flex', gap:14, flexShrink:0 }}>
          <span>전체 <strong style={{color:'#0dd9c5'}}>{crew.length}</strong>명</span>
          <span>위험 <strong style={{color:'#ff4d6d'}}>{crew.filter(c=>c.risk==='high').length}</strong>명</span>
          <span>주의 <strong style={{color:'#ff9f43'}}>{crew.filter(c=>c.risk==='medium').length}</strong>명</span>
        </div>

        {/* 테이블 */}
        <div style={{ flex:1, overflowY:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth: editing || selected ? 300 : 900 }}>
            <thead style={{ position:'sticky', top:0, background:'#0a1628', zIndex:1 }}>
              <tr style={{ borderBottom:'1px solid rgba(13,217,197,0.1)' }}>
                {(editing || selected
                  ? ['이름','직책','위험','조작']
                  : ['#','이름','나이','직책','혈액형','보유질환','알레르기','연락처','위험','조작']
                ).map(h => (
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => {
                const isActive = selected?.id === c.id
                const compact  = !!(editing || selected)
                return (
                  <tr
                    key={c.id}
                    onClick={() => { setSelected(isActive ? null : c); setEditing(null) }}
                    style={{
                      borderBottom:'1px solid rgba(13,217,197,0.04)',
                      background: isActive ? 'rgba(13,217,197,0.06)' : 'transparent',
                      cursor:'pointer', transition:'background 0.15s'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent' }}
                  >
                    {!compact && <td style={{ padding:'11px 12px', fontSize:11, color:'#4a6080', fontWeight:600 }}>{String(idx+1).padStart(2,'0')}</td>}
                    <td style={{ padding:'11px 12px' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{c.name}</div>
                      {!compact && <div style={{ fontSize:10, color:'#4a6080' }}>{c.id}</div>}
                    </td>
                    {!compact && <td style={{ padding:'11px 12px', fontSize:12, color:'#8da2c0' }}>{c.age}세</td>}
                    <td style={{ padding:'11px 12px' }}>
                      <span style={{ fontSize:11, padding:'2px 8px', borderRadius:5, background:'rgba(13,217,197,0.08)', color:'#0dd9c5', fontWeight:600 }}>{c.role}</span>
                    </td>
                    {!compact && <td style={{ padding:'11px 12px', fontSize:12, color:'#8da2c0' }}>{c.blood}</td>}
                    {!compact && <td style={{ padding:'11px 12px', fontSize:12, color: c.chronic!=='없음'?'#ff9f43':'#4a6080' }}>{c.chronic}</td>}
                    {!compact && <td style={{ padding:'11px 12px', fontSize:12, color: c.allergies!=='없음'?'#ff4d6d':'#4a6080' }}>{c.allergies}</td>}
                    {!compact && <td style={{ padding:'11px 12px', fontSize:11, color:'#8da2c0' }}>{c.contact}</td>}
                    <td style={{ padding:'11px 12px' }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:RISK[c.risk]||'#26de81', display:'inline-block' }}/>
                    </td>
                    <td style={{ padding:'11px 12px' }}>
                      <div style={{ display:'flex', gap:5 }} onClick={e=>e.stopPropagation()}>
                        <IconBtn color="#0dd9c5" title="환자 등록" onClick={()=>registerPatient(c)}><UserPlus size={12}/></IconBtn>
                        <IconBtn color="#4fc3f7" title="수정"     onClick={()=>startEdit(c)}><Edit2 size={12}/></IconBtn>
                        <IconBtn color="#ff4d6d" title="삭제"     onClick={()=>setDeleteId(c.id)}><Trash2 size={12}/></IconBtn>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 중앙: 상세 보기 ── */}
      {selected && !editing && (
        <div style={{ width:340, flexShrink:0, borderRight:'1.5px solid rgba(13,217,197,0.13)', background:'rgba(8,18,35,0.98)', overflowY:'auto', padding:'18px 16px', animation:'slideInRight 0.25s ease both' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0dd9c5', textTransform:'uppercase', letterSpacing:'0.6px' }}>선원 상세정보</div>
            <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#4a6080' }}><X size={16}/></button>
          </div>
          {/* 프로필 */}
          <div style={{ padding:'16px', borderRadius:16, background:'linear-gradient(135deg,rgba(13,217,197,0.1),rgba(13,217,197,0.02))', border:'1.5px solid rgba(13,217,197,0.25)', marginBottom:14, textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:`linear-gradient(135deg,${RISK[selected.risk]}44,${RISK[selected.risk]}22)`, border:`2px solid ${RISK[selected.risk]}88`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:RISK[selected.risk], margin:'0 auto 10px' }}>
              {selected.name[0]}
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{selected.name}</div>
            <div style={{ fontSize:11, color:'#8da2c0', marginTop:3 }}>{selected.role} · {selected.age}세 · {selected.blood}형</div>
            <div style={{ marginTop:8, display:'flex', gap:6, justifyContent:'center' }}>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:5, background:`${RISK[selected.risk]}18`, color:RISK[selected.risk], fontWeight:700 }}>
                {selected.risk==='high'?'위험':selected.risk==='medium'?'주의':'정상'}
              </span>
            </div>
          </div>
          {/* 정보 그리드 */}
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
            {[
              ['사원번호', selected.id],
              ['생년월일', selected.dob],
              ['신장/체중', `${selected.height}cm / ${selected.weight}kg`],
              ['승선일', selected.embark],
              ['위치', selected.location],
              ['연락처', selected.contact],
              ['비상연락', selected.emergency],
            ].map(([l,v])=>(
              <div key={l} style={{ display:'flex', gap:10, padding:'8px 11px', borderRadius:8, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:10, color:'#4a6080', fontWeight:700, minWidth:56, textTransform:'uppercase', letterSpacing:'0.3px' }}>{l}</span>
                <span style={{ fontSize:12, color:'#e8f0fe', fontWeight:600, flex:1 }}>{v||'—'}</span>
              </div>
            ))}
          </div>
          {/* 의료 정보 */}
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
            <DetailMed label="보유질환"  value={selected.chronic}   color="#ff9f43"/>
            <DetailMed label="알레르기"  value={selected.allergies} color="#ff4d6d"/>
            <DetailMed label="최근투약"  value={selected.lastMed}   color="#0dd9c5"/>
            <DetailMed label="특이사항"  value={selected.note}      color="#4fc3f7"/>
          </div>
          {/* 액션 버튼 */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={()=>registerPatient(selected)} style={{ padding:'12px', borderRadius:12, background:'rgba(255,77,109,0.12)', border:'1.5px solid rgba(255,77,109,0.3)', color:'#ff4d6d', fontSize:13, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <UserPlus size={15}/> 응급 환자로 등록
            </button>
            <button onClick={()=>startEdit(selected)} style={{ padding:'12px', borderRadius:12, background:'rgba(79,195,247,0.1)', border:'1px solid rgba(79,195,247,0.25)', color:'#4fc3f7', fontSize:13, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Edit2 size={15}/> 정보 수정
            </button>
          </div>
        </div>
      )}

      {/* ── 우: 입력/수정 폼 ── */}
      {editing && (
        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', background:'rgba(8,18,35,0.98)', animation:'slideInRight 0.25s ease both' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={{ fontSize:15, fontWeight:900, color:'#0dd9c5', textTransform:'uppercase', letterSpacing:'0.6px' }}>
              {editing==='new' ? '선원 신규 등록' : `정보 수정 — ${form.name}`}
            </div>
            <button onClick={()=>setEditing(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#4a6080' }}><X size={18}/></button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[
              {label:'이름',      key:'name',      type:'text',   placeholder:'홍길동'},
              {label:'생년월일',  key:'dob',       type:'date',   placeholder:''},
              {label:'나이',      key:'age',       type:'number', placeholder:'30'},
              {label:'성별',      key:'gender',    type:'select', opts:['남','여']},
              {label:'혈액형',    key:'blood',     type:'select', opts:BLOODS},
              {label:'신장(cm)',  key:'height',    type:'number', placeholder:'175'},
              {label:'체중(kg)',  key:'weight',    type:'number', placeholder:'70'},
              {label:'직책',      key:'role',      type:'select', opts:ROLES},
              {label:'승선일',    key:'embark',    type:'date',   placeholder:''},
              {label:'근무위치',  key:'location',  type:'text',   placeholder:'갑판 1구역'},
              {label:'연락처',    key:'contact',   type:'text',   placeholder:'010-0000-0000'},
              {label:'비상연락',  key:'emergency', type:'text',   placeholder:'이름 010-0000-0000'},
            ].map(({label,key,type,placeholder,opts})=>(
              <FormField key={key} label={label}>
                {type==='select' ? (
                  <select value={form[key]} onChange={fld(key)} style={selStyle}>
                    {opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={fld(key)} style={inpStyle}/>
                )}
              </FormField>
            ))}
            <FormField label="보유질환" full>
              <input placeholder="고혈압, 당뇨 등 (없으면 '없음')" value={form.chronic} onChange={fld('chronic')} style={inpStyle}/>
            </FormField>
            <FormField label="알레르기" full>
              <input placeholder="아스피린 등 (없으면 '없음')" value={form.allergies} onChange={fld('allergies')} style={inpStyle}/>
            </FormField>
            <FormField label="최근 투약" full>
              <input placeholder="약품명 용량 (없으면 '없음')" value={form.lastMed} onChange={fld('lastMed')} style={inpStyle}/>
            </FormField>
            <FormField label="특이사항 / 메모" full>
              <textarea placeholder="특이사항 입력..." value={form.note} onChange={fld('note')} rows={3} style={{ ...inpStyle, resize:'vertical' }}/>
            </FormField>
          </div>

          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <button onClick={save} style={{ flex:1, padding:'13px', borderRadius:12, background:'linear-gradient(135deg,#0dd9c5,#09b8a6)', border:'none', color:'#050d1a', fontSize:14, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(13,217,197,0.25)' }}>
              <Save size={16}/> {editing==='new'?'등록 완료':'수정 저장'}
            </button>
            <button onClick={()=>setEditing(null)} style={{ padding:'13px 20px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#8da2c0', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* ── 삭제 확인 모달 ── */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#0a1628', border:'1.5px solid rgba(255,77,109,0.3)', borderRadius:18, padding:'28px 32px', width:360, animation:'fadeInUp 0.2s ease both' }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:10 }}>선원 삭제 확인</div>
            <div style={{ fontSize:13, color:'#8da2c0', marginBottom:22, lineHeight:1.6 }}>
              <strong style={{color:'#fff'}}>{crew.find(c=>c.id===deleteId)?.name}</strong> 선원의 정보를 삭제합니다.<br/>이 작업은 되돌릴 수 없습니다.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>confirmDelete(deleteId)} style={{ flex:1, padding:'11px', borderRadius:10, background:'rgba(255,77,109,0.15)', border:'1px solid rgba(255,77,109,0.3)', color:'#ff4d6d', fontSize:13, fontWeight:800, cursor:'pointer' }}>삭제</button>
              <button onClick={()=>setDeleteId(null)} style={{ flex:1, padding:'11px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#8da2c0', fontSize:13, fontWeight:700, cursor:'pointer' }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function IconBtn({ color, title, onClick, children }) {
  return (
    <button onClick={onClick} title={title} style={{ width:28, height:28, borderRadius:7, background:`${color}15`, border:`1px solid ${color}30`, color, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
      {children}
    </button>
  )
}
function DetailMed({ label, value, color }) {
  return (
    <div style={{ padding:'9px 12px', borderRadius:10, background:`${color}08`, border:`1px solid ${color}20` }}>
      <div style={{ fontSize:9, color, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:12, color:'#e8f0fe', fontWeight:600 }}>{value||'—'}</div>
    </div>
  )
}
function FormField({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? 'span 2' : undefined }}>
      <label style={{ fontSize:10, color:'var(--text-muted)', display:'block', marginBottom:5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>
      {children}
    </div>
  )
}

const inpStyle = {
  width:'100%', padding:'9px 12px',
  background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(13,217,197,0.15)',
  borderRadius:8, color:'var(--text-primary)',
  fontSize:13, outline:'none',
}
const selStyle = {
  ...inpStyle, cursor:'pointer', appearance:'none',
}
