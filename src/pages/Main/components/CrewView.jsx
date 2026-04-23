import { Search, Plus, Edit3, Trash2, Anchor, Cog, Coffee, Users } from 'lucide-react'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  panel2: 'rgba(15, 15, 35, 0.99)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  dim: '#1a1a3a',
  success: '#00ffaa',
  warning: '#ffaa00',
  danger: '#ff0055',
  info: '#00d4ff',
  purple: '#bc00ff',
  cyan: '#00f7ff',
}

export default function CrewView({ 
  crewList, crewSearch, setCrewSearch, crewRoleTab, setCrewRoleTab, roles, 
  filteredCrew, activePatient, switchPatient, setShowModal 
}) {
  return (
    <div className="cyber-bg" style={{ flex: 1, padding: 58, overflowY: 'auto', background: C.bg, color: C.text, scrollbarWidth: 'none' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ marginBottom: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 34 }}>
            <Users size={46} color={C.cyan} />
            <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: '-1.5px', margin: 0, textShadow: `0 0 15px ${C.cyan}44` }}>선원 정보 관리 <span style={{ color: C.sub, fontSize: 25, marginLeft: 18, fontWeight: 700 }}>전체 {crewList?.length || 0}명</span></h1>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.03)', borderRadius: 28, padding: '0 34px', border: `1px solid ${C.border}`, boxShadow: `inset 0 0 20px rgba(0,0,0,0.2)` }}>
              <Search size={34} color={C.cyan} />
              <input placeholder="선원 이름 또는 ID로 검색..." value={crewSearch} onChange={e => setCrewSearch && setCrewSearch(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 25, height: 104, outline: 'none', fontWeight: 600 }} />
            </div>
            <button onClick={() => setShowModal && setShowModal('create')} style={{ height: 104, background: C.cyan, color: '#000', border: 'none', borderRadius: 28, padding: '0 58px', fontWeight: 950, fontSize: 25, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 11px 28px ${C.cyan}44`, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}><Plus size={34} strokeWidth={3} /> 신규 선원 등록</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 14, marginBottom: 43 }}>
          {['전체', '항해부', '기관부', '지원부'].map(r => (
            <button 
              key={r} 
              onClick={() => setCrewRoleTab && setCrewRoleTab(r === '전체' ? 'ALL' : r)} 
              style={{ 
                padding: '18px 40px', borderRadius: 20, 
                background: (crewRoleTab === r || (r === '전체' && crewRoleTab === 'ALL')) ? C.cyan : 'rgba(255,255,255,0.03)', 
                color: (crewRoleTab === r || (r === '전체' && crewRoleTab === 'ALL')) ? '#000' : C.sub, 
                border: `1px solid ${(crewRoleTab === r || (r === '전체' && crewRoleTab === 'ALL')) ? C.cyan : C.border}`, 
                fontWeight: 850, fontSize: 22, cursor: 'pointer', transition: '0.2s',
                boxShadow: (crewRoleTab === r || (r === '전체' && crewRoleTab === 'ALL')) ? `0 0 15px ${C.cyan}44` : 'none'
              }}
            >
              {r === '항해부' && <Anchor size={18} style={{marginRight: 9}}/>}
              {r === '기관부' && <Cog size={18} style={{marginRight: 9}}/>}
              {r === '지원부' && <Coffee size={18} style={{marginRight: 9}}/>}
              {r}
            </button>
          ))}
        </div>

        <div style={{ background: C.panel, borderRadius: 34, border: `1px solid ${C.border}`, overflow: 'hidden', backdropFilter: 'blur(10px)', boxShadow: '0 11px 43px rgba(0,0,0,0.4)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '34px 46px', color: C.sub, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>선원 프로필 / 고유 ID</th>
                <th style={{ padding: '34px 46px', color: C.sub, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>소속 부서 및 직책</th>
                <th style={{ padding: '34px 46px', color: C.sub, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>현재 건강 상태</th>
                <th style={{ padding: '34px 46px', color: C.sub, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>데이터 관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrew?.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}`, background: activePatient?.id === c.id ? `${C.cyan}08` : 'transparent', transition: '0.2s' }} className="crew-row">
                  <td style={{ padding: '34px 46px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                      <div style={{ width: 82, height: 82, borderRadius: 22, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: `2px solid ${activePatient?.id === c.id ? C.cyan : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: activePatient?.id === c.id ? `0 0 15px ${C.cyan}22` : 'none' }}>
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ color: C.cyan, fontSize: 32, fontWeight: 950 }}>{c.name[0]}</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 28, fontWeight: 950, marginBottom: 6, color: '#fff' }}>{c.name}</div>
                        <div style={{ fontSize: 18, color: C.cyan, fontWeight: 800, background: `${C.cyan}11`, padding: '2px 9px', borderRadius: 6, width: 'fit-content', border: `1px solid ${C.cyan}33` }}>{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '34px 46px' }}>
                    <div style={{ fontSize: 25, fontWeight: 850, color: C.info, display: 'flex', alignItems: 'center', gap: 11 }}>
                       {c.dept === '항해부' && <Anchor size={25} />}
                       {c.dept === '기관부' && <Cog size={25} />}
                       {c.dept === '지원부' && <Coffee size={25} />}
                       {c.role}
                    </div>
                    <div style={{ fontSize: 18, color: C.sub, marginTop: 6, fontWeight: 700 }}>{c.dept}</div>
                  </td>
                  <td style={{ padding: '34px 46px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11, padding: '9px 22px', borderRadius: 14, background: c.status === '건강' ? `${C.success}11` : `${C.danger}11`, color: c.status === '건강' ? C.success : C.danger, fontSize: 20, fontWeight: 900, border: `1px solid ${c.status === '건강' ? C.success : C.danger}33` }}>
                      <div style={{ width: 11, height: 11, borderRadius: '50%', background: c.status === '건강' ? C.success : C.danger, boxShadow: `0 0 12px ${c.status === '건강' ? C.success : C.danger}` }} />
                      {c.status}
                    </div>
                  </td>
                  <td style={{ padding: '34px 46px' }}>
                    <div style={{ display: 'flex', gap: 18 }}>
                      <button onClick={() => switchPatient && switchPatient(c)} style={{ padding: '14px 34px', borderRadius: 16, background: `${C.cyan}18`, color: C.cyan, border: `1px solid ${C.cyan}44`, fontWeight: 950, fontSize: 20, cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => {e.currentTarget.style.background = C.cyan; e.currentTarget.style.color = '#000';}} onMouseLeave={e => {e.currentTarget.style.background = `${C.cyan}18`; e.currentTarget.style.color = C.cyan;}}>상태 점검</button>
                      <button style={{ padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = C.sub}><Edit3 size={25}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .crew-row:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>
    </div>
  )
}
