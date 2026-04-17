import { useState } from 'react'
import { Search, Plus, UserPlus, Users, Anchor, Cog, Coffee, ShieldAlert, CheckCircle2 } from 'lucide-react'

const INITIAL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: '고혈압', allergies: '없음', contact: '010-2600-0001', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '페니실린', contact: '010-2600-0002', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-003', name: '박기관', age: 48, role: '기관장', dept: '기관부', blood: 'B+', chronic: '고지혈증', allergies: '아스피린', contact: '010-2600-0003', avatar: '/CE.jpeg' },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: '허리디스크', allergies: '없음', contact: '010-2600-0004', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-005', name: '정조타', age: 38, role: '조타사', dept: '항해부', blood: 'O-', chronic: '없음', allergies: '조개류', contact: '010-2600-0005', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-006', name: '한닻별', age: 35, role: '2등 항해사', dept: '항해부', blood: 'A-', chronic: '비염', allergies: '먼지', contact: '010-2600-0006', avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-007', name: '윤나침', age: 32, role: '3등 항해사', dept: '항해부', blood: 'B-', chronic: '없음', allergies: '없음', contact: '010-2600-0007', avatar: 'https://images.unsplash.com/photo-1544333346-61614749f15a?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-008', name: '강바다', age: 29, role: '항해사', dept: '항해부', blood: 'O+', chronic: '없음', allergies: '복숭아', contact: '010-2600-0008', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-009', name: '조항구', age: 50, role: '조리장', dept: '지원부', blood: 'A+', chronic: '당뇨', allergies: '없음', contact: '010-2600-0009', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-010', name: '심망원', age: 27, role: '갑판원', dept: '항해부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0010', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-011', name: '고파도', age: 33, role: '갑판원', dept: '항해부', blood: 'AB-', chronic: '기관지염', allergies: '고양이', contact: '010-2600-0011', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-012', name: '신해류', age: 43, role: '1등 기관사', dept: '기관부', blood: 'O+', chronic: '없음', allergies: '견과류', contact: '010-2600-0012', avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-013', name: '유냉각', age: 39, role: '2등 기관사', dept: '기관부', blood: 'A-', chronic: '역류성식도염', allergies: '없음', contact: '010-2600-0013', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-014', name: '문발전', age: 36, role: '3등 기관사', dept: '기관부', blood: 'B+', chronic: '없음', allergies: '항생제', contact: '010-2600-0014', avatar: 'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-015', name: '배연료', age: 40, role: '기수', dept: '기관부', blood: 'O-', chronic: '간수치 주의', allergies: '없음', contact: '010-2600-0015', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-016', name: '지펌프', age: 44, role: '기부', dept: '기관부', blood: 'AB+', chronic: '없음', allergies: '라텍스', contact: '010-2600-0016', avatar: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-017', name: '권통신', age: 31, role: '통신사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '없음', contact: '010-2600-0017', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-018', name: '엄구명', age: 34, role: '의료사', dept: '지원부', blood: 'B-', chronic: '없음', allergies: '달걀', contact: '010-2600-0018', avatar: 'https://images.unsplash.com/photo-1548449112-96a38a643324?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-019', name: '송화물', age: 37, role: '갑판원', dept: '항해부', blood: 'O+', chronic: '무릎관절염', allergies: '없음', contact: '010-2600-0019', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-020', name: '임밸러', age: 30, role: '기관사', dept: '기관부', blood: 'A+', chronic: '없음', allergies: '없음', contact: '010-2600-0020', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-021', name: '서레이', age: 28, role: '항해사', dept: '항해부', blood: 'B+', chronic: '편두통', allergies: '없음', contact: '010-2600-0021', avatar: 'https://images.unsplash.com/photo-1521119989659-a83dee73a8f6?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-022', name: '양소나', age: 33, role: '조타사', dept: '항해부', blood: 'AB-', chronic: '없음', allergies: '폴렌', contact: '010-2600-0022', avatar: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-023', name: '노엔진', age: 55, role: '기관 감독', dept: '기관부', blood: 'O-', chronic: '심근경색 이력', allergies: '없음', contact: '010-2600-0023', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-024', name: '마스키', age: 26, role: '기수', dept: '기관부', blood: 'A-', chronic: '없음', allergies: '우유', contact: '010-2600-0024', avatar: 'https://images.unsplash.com/photo-1507081323148-39c59a432857?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-025', name: '표앵커', age: 46, role: '갑판원', dept: '항해부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0025', avatar: 'https://images.unsplash.com/photo-1487309078313-fe80c3e15aede?auto=format&fit=crop&q=80&w=200' },
  { id: 'S26-026', name: '장조리', age: 29, role: '조리원', dept: '지원부', blood: 'O+', chronic: '피부염', allergies: '메밀', contact: '010-2600-0026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
]

const TABS = [
  { id: 'ALL', label: '전체 선원', icon: <Users size={18}/> },
  { id: '항해부', label: '항해부', icon: <Anchor size={18}/> },
  { id: '기관부', label: '기관부', icon: <Cog size={18}/> },
  { id: '지원부', label: '조리/지원', icon: <Coffee size={18}/> },
]

export default function CrewManagement({ onSelectPatient }) {
  const [crew] = useState(INITIAL_CREW)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')

  const handleSelect = (c) => {
    if (window.confirm(`[${c.id}] ${c.name} 선원을 응급 환자로 등록하시겠습니까?`)) {
      onSelectPatient(c)
    }
  }

  const filtered = crew.filter(c => {
    const matchQ = c.name.includes(query) || c.id.includes(query) || c.role.includes(query)
    const matchT = activeTab === 'ALL' || c.dept === activeTab
    return matchQ && matchT
  })

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, height: 'calc(100vh - 72px)', background: '#020617', color: '#fff', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 8, color: '#fff', letterSpacing: '-0.5px' }}>선원 통합 관리 시스템</h1>
          <p style={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>MV KOREA STAR 소속 선원 명부 (총 {crew.length}명)</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', width: 340 }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#4a6080' }} size={20} />
            <input 
              placeholder="이름, ID, 직책 검색..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              style={{ width: '100%', padding: '14px 14px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, color: '#fff', fontSize: 16, outline: 'none', transition: '0.2s' }} 
            />
          </div>
          <button style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #0dd9c5, #00a896)', border: 'none', borderRadius: 16, cursor: 'pointer', color: '#020617', fontSize: 16, fontWeight: 950, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(13,217,197,0.2)' }}>
            <Plus size={20} strokeWidth={3} /> 신규 등록
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const count = crew.filter(c => tab.id === 'ALL' || c.dept === tab.id).length
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 18, background: active ? 'rgba(13,217,197,0.1)' : 'rgba(255,255,255,0.02)', border: `2px solid ${active ? '#0dd9c5' : 'transparent'}`, color: active ? '#0dd9c5' : '#64748b', fontSize: 17, fontWeight: 800, cursor: 'pointer', transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {tab.icon} {tab.label}
              <span style={{ marginLeft: 8, fontSize: 13, padding: '2px 10px', borderRadius: 20, background: active ? '#0dd9c5' : 'rgba(255,255,255,0.05)', color: active ? '#020617' : '#4a6080', fontWeight: 900 }}>{count}</span>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 1200 }}>
          <thead style={{ position: 'sticky', top: 0, background: '#0a1628', zIndex: 10 }}>
            <tr>
              {['선원 정보', '부서 / 직책', '나이 / 혈액형', '주요 병력', '알레르기 정보', '긴급 연락처', '액션'].map((h, i) => (
                <th key={i} style={{ padding: '24px', textAlign: 'left', fontSize: 13, color: '#4a6080', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid rgba(255,255,255,0.03)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} onClick={() => handleSelect(c)} style={{ cursor: 'pointer', transition: 'all 0.15s' }} className="crew-row">
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                      <img src={c.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: '#0dd9c5', fontFamily: 'monospace', fontWeight: 800 }}>{c.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 16, color: '#e2e8f0', fontWeight: 800 }}>{c.dept} / {c.role}</span>
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#8da2c0' }}>{c.age}세 / {c.blood}</div>
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  {c.chronic !== '없음' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff9f43', fontWeight: 700 }}>
                      <ShieldAlert size={16} /> {c.chronic}
                    </div>
                  ) : <span style={{ color: '#4a6080' }}>-</span>}
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  {c.allergies !== '없음' ? (
                    <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', fontSize: 14, fontWeight: 800 }}>{c.allergies}</span>
                  ) : <CheckCircle2 size={18} color="#26de81" opacity={0.5} />}
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#64748b', fontSize: 15, fontWeight: 600 }}>
                  {c.contact}
                </td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <button onClick={e => { e.stopPropagation(); handleSelect(c); }} style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: 14, fontWeight: 900, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserPlus size={16} strokeWidth={3} /> 환자 등록
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .crew-row:hover { background: rgba(13,217,197,0.04) !important; transform: scale(1.002); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}
