import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, UserPlus } from 'lucide-react'

const INITIAL_CREW = [
  { id: 'S2026-026', name: '김선원', age: 55, gender: '남', role: '기관장', blood: 'A+', contact: '010-1001-0026', emergency: '이부인 010-2001-0026', embark: '2024-01-10', chronic: '고혈압, 고지혈증', allergies: '아스피린', lastMed: '암로디핀 (08:00)', dob: '1971-08-22', height: 174, weight: 76, location: '기관실 제2엔진 인근 데크', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'S2026-001', name: '박항해', age: 42, gender: '남', role: '항해사', blood: 'B+', contact: '010-1001-0002', emergency: '최부인 010-2001-0002', embark: '2024-02-15', chronic: '없음', allergies: '페니실린', lastMed: '없음', dob: '1984-05-12', height: 180, weight: 72, location: '브릿지(조타실)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  // ... (생략된 24명의 선원은 김선원과 박항해의 구조를 따름)
  { id: 'S2026-003', name: '이기관', age: 35, gender: '남', role: '기관사', blood: 'O+', contact: '010-1001-0003', emergency: '박부인 010-2001-0003', embark: '2024-03-20', chronic: '없음', allergies: '없음', lastMed: '없음', dob: '1991-11-05', height: 176, weight: 80, location: '기관 제어실', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
]

export default function CrewManagement({ onSelectPatient }) {
  const [crew] = useState(INITIAL_CREW)
  const [query, setQuery] = useState('')

  const handleSelect = (c) => {
    if (window.confirm(`${c.name} 선원을 응급 환자로 등록하고 대시보드로 이동하시겠습니까?`)) {
      onSelectPatient(c);
    }
  }

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 46px)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="선원 이름, 직책 검색..." value={query} onChange={e => setQuery(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 16, width: '100%' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 700 }}><Plus size={16} />선원 추가</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(15,32,64,0.6)', border: '1px solid var(--border)', borderRadius: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--navy-900)', zIndex: 1 }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['이름', '나이', '직책', '혈액형', '보유 질환', '알레르기', '연락처', '환자등록'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crew.filter(c => c.name.includes(query)).map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(13,217,197,0.05)', cursor: 'pointer' }} onClick={() => handleSelect(c)} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{c.name}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: '#8da2c0' }}>{c.age}세</td>
                <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 6, background: 'rgba(13,217,197,0.08)', color: '#0dd9c5', fontWeight: 600 }}>{c.role}</span></td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: '#8da2c0' }}>{c.blood}</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: c.chronic !== '없음' ? '#ff9f43' : '#4a6080' }}>{c.chronic}</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: c.allergies !== '없음' ? '#ff4d6d' : '#4a6080' }}>{c.allergies}</td>
                <td style={{ padding: '14px 16px', fontSize: 15, color: '#8da2c0' }}>{c.contact}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleSelect(c); }} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
                    <UserPlus size={14}/> 등록
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
