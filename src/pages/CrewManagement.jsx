import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, UserPlus } from 'lucide-react'

const INITIAL_CREW = [
  { id: 'S2026-026', name: '김선원', age: 55, gender: '남', role: '기관장', blood: 'A+', contact: '010-1001-0026', emergency: '이부인 010-2001-0026', embark: '2024-01-10', chronic: '고혈압, 고지혈증', allergies: '아스피린', lastMed: '암로디핀 (08:00)', dob: '1971-08-22', height: 174, weight: 76, location: '기관실 제2엔진 인근 데크', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'S2026-088', name: '김선원', age: 29, gender: '남', role: '조리원', blood: 'O+', contact: '010-1001-0088', emergency: '모친 010-2001-0088', embark: '2025-03-15', chronic: '없음', allergies: '조개류', lastMed: '없음', dob: '1997-11-30', height: 182, weight: 70, location: '식당/주방', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' },
  { id: 'S2026-001', name: '박항해', age: 42, gender: '남', role: '항해사', blood: 'B+', contact: '010-1001-0002', emergency: '최부인 010-2001-0002', embark: '2024-02-15', chronic: '없음', allergies: '페니실린', lastMed: '없음', dob: '1984-05-12', height: 180, weight: 72, location: '브릿지(조타실)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 'S2026-003', name: '이기관', age: 35, gender: '남', role: '기관사', blood: 'O+', contact: '010-1001-0003', emergency: '박부인 010-2001-0003', embark: '2024-03-20', chronic: '없음', allergies: '없음', lastMed: '없음', dob: '1991-11-05', height: 176, weight: 80, location: '기관 제어실', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
]

export default function CrewManagement({ onSelectPatient }) {
  const [crew] = useState(INITIAL_CREW)
  const [query, setQuery] = useState('')

  const handleSelect = (c) => {
    if (window.confirm(`[${c.id}] ${c.name} 선원을 응급 환자로 등록하시겠습니까?`)) {
      onSelectPatient(c);
    }
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input placeholder="선원 이름, ID, 직책 검색..." value={query} onChange={e => setQuery(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 18, width: '100%' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))', border: 'none', borderRadius: 12, cursor: 'pointer', color: '#050d1a', fontSize: 16, fontWeight: 800 }}><Plus size={18} />선원 신규 등록</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(15,32,64,0.6)', border: '1.5px solid var(--border)', borderRadius: 18 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--navy-900)', zIndex: 1 }}>
            <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
              {['사번 ID', '이름', '나이', '직책', '혈액형', '주요 병력', '알레르기', '긴급 연락처', '관리'].map(h => (
                <th key={h} style={{ padding: '18px 20px', textAlign: 'left', fontSize: 15, color: 'var(--text-muted)', fontWeight: 800 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crew.filter(c => c.name.includes(query) || c.id.includes(query) || c.role.includes(query)).map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(13,217,197,0.08)', cursor: 'pointer' }} onClick={() => handleSelect(c)} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding: '18px 20px' }}><span style={{ fontSize: 15, fontFamily: 'monospace', color: '#0dd9c5', fontWeight: 700 }}>{c.id}</span></td>
                <td style={{ padding: '18px 20px' }}><span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{c.name}</span></td>
                <td style={{ padding: '18px 20px', fontSize: 17, color: '#8da2c0' }}>{c.age}세</td>
                <td style={{ padding: '18px 20px' }}><span style={{ fontSize: 14, padding: '4px 12px', borderRadius: 8, background: 'rgba(13,217,197,0.1)', color: '#0dd9c5', fontWeight: 700 }}>{c.role}</span></td>
                <td style={{ padding: '18px 20px', fontSize: 17, color: '#8da2c0' }}>{c.blood}형</td>
                <td style={{ padding: '18px 20px', fontSize: 16, color: c.chronic !== '없음' ? '#ff9f43' : '#4a6080' }}>{c.chronic}</td>
                <td style={{ padding: '18px 20px', fontSize: 16, color: c.allergies !== '없음' ? '#ff4d6d' : '#4a6080' }}>{c.allergies}</td>
                <td style={{ padding: '18px 20px', fontSize: 16, color: '#8da2c0' }}>{c.contact}</td>
                <td style={{ padding: '18px 20px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleSelect(c); }} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,77,109,0.12)', border: '1px solid rgba(255,77,109,0.25)', color: '#ff4d6d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 800 }}>
                    <UserPlus size={16}/> 환자 등록
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
