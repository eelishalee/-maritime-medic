import { useState } from 'react'
import { Search, Plus, UserPlus, Users, Anchor, Cog, Coffee, ShieldAlert, CheckCircle2, ChevronRight, Phone, Heart, Activity } from 'lucide-react'

const INITIAL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: '고혈압', allergies: '없음', contact: '010-2600-0001', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '페니실린', contact: '010-2600-0002', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-003', name: '박기관', age: 48, role: '기관장', dept: '기관부', blood: 'B+', chronic: '고지혈증', allergies: '아스피린', contact: '010-2600-0003', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: '허리디스크', allergies: '없음', contact: '010-2600-0004', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-005', name: '정조타', age: 38, role: '조타사', dept: '항해부', blood: 'O-', chronic: '없음', allergies: '조개류', contact: '010-2600-0005', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-006', name: '한닻별', age: 35, role: '2등 항해사', dept: '항해부', blood: 'A-', chronic: '비염', allergies: '먼지', contact: '010-2600-0006', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-007', name: '윤나침', age: 32, role: '3등 항해사', dept: '항해부', blood: 'B-', chronic: '없음', allergies: '없음', contact: '010-2600-0007', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-008', name: '강바다', age: 29, role: '항해사', dept: '항해부', blood: 'O+', chronic: '없음', allergies: '복숭아', contact: '010-2600-0008', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-009', name: '조항구', age: 50, role: '조리장', dept: '지원부', blood: 'A+', chronic: '당뇨', allergies: '없음', contact: '010-2600-0009', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' },
  { id: 'S26-010', name: '심망원', age: 27, role: '갑판원', dept: '항해부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0010', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
]

const TABS = [
  { id: 'ALL', label: '전체 선원', icon: <Users size={20}/> },
  { id: '항해부', label: '항해부', icon: <Anchor size={20}/>, color: '#38bdf8' },
  { id: '기관부', label: '기관부', icon: <Cog size={20}/>, color: '#fb923c' },
  { id: '지원부', label: '조리/지원', icon: <Coffee size={20}/>, color: '#2dd4bf' },
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
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: 32, height: 'calc(100vh - 72px)', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', overflow: 'hidden' }}>
      
      {/* 상단 헤더 섹션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Users size={24} color="#0dd9c5" />
            <h1 style={{ fontSize: '34px', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>선원 통합 관리 시스템</h1>
          </div>
          <p style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginLeft: 36 }}>MV KOREA STAR 소속 선원 명부 (총 {crew.length}명 관리 중)</p>
        </div>
        
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#4a6080' }} size={20} />
            <input 
              placeholder="선원 이름, 고유 ID, 직책 검색..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              style={{ width: 360, padding: '18px 20px 18px 52px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', color: '#fff', fontSize: '16px', outline: 'none', transition: '0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} 
              className="search-input"
            />
          </div>
          <button style={{ padding: '0 32px', background: 'linear-gradient(135deg, #0dd9c5 0%, #00a896 100%)', border: 'none', borderRadius: '20px', cursor: 'pointer', color: '#020617', fontSize: '17px', fontWeight: 950, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 25px rgba(13,217,197,0.25)', transition: '0.3s' }} className="add-btn">
            <Plus size={22} strokeWidth={3} /> 신규 선원 등록
          </button>
        </div>
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const count = crew.filter(c => tab.id === 'ALL' || c.dept === tab.id).length
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 30px', borderRadius: '22px', background: active ? 'rgba(13,217,197,0.08)' : 'rgba(255,255,255,0.02)', border: `2.5px solid ${active ? '#0dd9c5' : 'transparent'}`, color: active ? '#0dd9c5' : '#475569', fontSize: '18px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {tab.icon} {tab.label}
              <span style={{ marginLeft: 10, fontSize: '13px', padding: '3px 12px', borderRadius: '10px', background: active ? '#0dd9c5' : 'rgba(255,255,255,0.05)', color: active ? '#020617' : '#4a6080', fontWeight: 950 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* 리스트 영역 (테이블 고도화) */}
      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(10,22,40,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '40px', padding: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', padding: '0 24px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ background: '#020617' }}>
              {['선원 프로필', '소속 및 역할', '신체 정보', '의료 특이사항', '긴급 연락망', ''].map((h, i) => (
                <th key={i} style={{ padding: '16px 28px', textAlign: 'left', fontSize: '15px', color: '#4a6080', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => handleSelect(c)} style={{ cursor: 'pointer', transition: '0.2s' }} className="crew-card-row">
                {/* 선원 정보 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px 0 0 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 60, height: 74, borderRadius: '14px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)', background: '#0a1628', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                      <img src={c.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 950, color: '#fff', marginBottom: 4 }}>{c.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '13px', color: '#0dd9c5', background: 'rgba(13,217,197,0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 900, letterSpacing: '0.5px' }}>{c.id}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 역할 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '17px', color: '#fff', fontWeight: 800 }}>{c.role}</div>
                    <div style={{ fontSize: '14px', color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.dept === '항해부' && <Anchor size={14} color="#38bdf8" />}
                      {c.dept === '기관부' && <Cog size={14} color="#fb923c" />}
                      {c.dept === '지원부' && <Coffee size={14} color="#2dd4bf" />}
                      {c.dept}
                    </div>
                  </div>
                </td>

                {/* 신체 정보 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#4a6080', fontWeight: 900, marginBottom: 2 }}>나이</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#e2e8f0' }}>{c.age}</div>
                    </div>
                    <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#4a6080', fontWeight: 900, marginBottom: 2 }}>혈액형</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#ff3b5c' }}>{c.blood}</div>
                    </div>
                  </div>
                </td>

                {/* 의료 특이사항 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {c.chronic !== '없음' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fb923c', background: 'rgba(251,146,60,0.1)', padding: '6px 12px', borderRadius: '10px', width: 'fit-content' }}>
                        <ShieldAlert size={14} /> <span style={{ fontSize: '14px', fontWeight: 800 }}>{c.chronic}</span>
                      </div>
                    ) : (
                      <div style={{ color: '#4a6080', fontSize: '14px', fontWeight: 700 }}>기저질환 없음</div>
                    )}
                    {c.allergies !== '없음' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ff4d6d', background: 'rgba(255,77,109,0.1)', padding: '6px 12px', borderRadius: '10px', width: 'fit-content' }}>
                        <Heart size={14} /> <span style={{ fontSize: '14px', fontWeight: 800 }}>{c.allergies} 알레르기</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* 연락처 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b' }}>
                    <Phone size={16} />
                    <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.5px' }}>{c.contact}</span>
                  </div>
                </td>

                {/* 액션 */}
                <td style={{ padding: '20px 28px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 24px 24px 0', textAlign: 'right' }}>
                  <button 
                    onClick={e => { e.stopPropagation(); handleSelect(c); }} 
                    style={{ padding: '12px 24px', borderRadius: '16px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: '15px', fontWeight: 950, cursor: 'pointer', transition: '0.2s', display: 'inline-flex', alignItems: 'center', gap: 10 }}
                    className="register-btn"
                  >
                    <UserPlus size={18} strokeWidth={3} /> 응급 환자 등록
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .crew-card-row { border: 2px solid transparent; }
        .crew-card-row:hover { transform: translateY(-3px); z-index: 5; position: relative; }
        .crew-card-row:hover td { background: rgba(13,217,197,0.06) !important; border-top: 1.5px solid rgba(13,217,197,0.2); border-bottom: 1.5px solid rgba(13,217,197,0.2); }
        .crew-card-row:hover td:first-child { border-left: 1.5px solid rgba(13,217,197,0.2); }
        .crew-card-row:hover td:last-child { border-right: 1.5px solid rgba(13,217,197,0.2); }
        
        .register-btn:hover { background: #38bdf8 !important; color: #020617 !important; transform: scale(1.05); }
        .search-input:focus { border-color: #0dd9c5 !important; background: rgba(13,217,197,0.05) !important; box-shadow: 0 0 20px rgba(13,217,197,0.15) !important; }
        .add-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); borderRadius: 10px; border: 2px solid #020617; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(13,217,197,0.2); }
      `}</style>
    </div>
  )
}
