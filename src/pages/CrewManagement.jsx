import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, Save, ChevronUp, ChevronDown } from 'lucide-react'

const INITIAL_CREW = [
  { id: 1, name: '김태호', age: 61, gender: '남', role: '선장', blood: 'AB-', contact: '010-1111-2222', emergency: '김영희 010-9876-5432', embark: '2024-11-01', chronic: '고혈압, 고지혈증', allergies: '페니실린', notes: '혈압약 복용 중' },
  { id: 2, name: '박성재', age: 42, gender: '남', role: '기관사', blood: 'A+', contact: '010-3333-4444', emergency: '박미순 010-5555-6666', embark: '2024-11-01', chronic: '없음', allergies: '없음', notes: '' },
  { id: 3, name: '이민준', age: 55, gender: '남', role: '항해사', blood: 'B+', contact: '010-7777-8888', emergency: '이소연 010-9999-0000', embark: '2024-11-01', chronic: '고혈압', allergies: '없음', notes: '혈압 약 복용, 정기 모니터링 필요' },
  { id: 4, name: '최동현', age: 38, gender: '남', role: '갑판원', blood: 'O+', contact: '010-2222-3333', emergency: '최지현 010-4444-5555', embark: '2024-11-01', chronic: '없음', allergies: '없음', notes: '' },
  { id: 5, name: '정현우', age: 33, gender: '남', role: '갑판원', blood: 'A-', contact: '010-6666-7777', emergency: '정다은 010-8888-9999', embark: '2024-11-01', chronic: '없음', allergies: '아스피린', notes: '과거 골절 이력' },
  { id: 6, name: '한지영', age: 29, gender: '여', role: '조리사', blood: 'O+', contact: '010-1234-5678', emergency: '한명수 010-8765-4321', embark: '2024-11-01', chronic: '없음', allergies: '없음', notes: '' },
]

const ROLES = ['전체', '선장', '기관사', '항해사', '갑판원', '조리사', '기타']
const EMPTY_FORM = { name: '', age: '', gender: '남', role: '', blood: '', contact: '', emergency: '', embark: '', chronic: '', allergies: '', notes: '' }

export default function CrewManagement() {
  const [crew, setCrew] = useState(INITIAL_CREW)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('전체')
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)
  const [sortKey, setSortKey] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = crew
    .filter(c => (roleFilter === '전체' || c.role === roleFilter) &&
      (c.name.includes(query) || c.role.includes(query)))
    .sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })

  const startEdit = (c) => { setEditId(c.id); setEditForm({ ...c }) }
  const saveEdit = () => {
    setCrew(cr => cr.map(c => c.id === editId ? { ...editForm } : c))
    setEditId(null)
  }

  const addCrew = () => {
    setCrew(cr => [...cr, { ...addForm, id: Date.now(), age: Number(addForm.age) }])
    setAddForm(EMPTY_FORM)
    setShowAdd(false)
  }

  const deleteCrew = (id) => { setCrew(cr => cr.filter(c => c.id !== id)); setDeleteId(null) }

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(true) }
  }

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, height: 'calc(100vh - 46px)', overflow: 'hidden' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flex: 1,
          background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px',
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            placeholder="이름, 직책 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid',
              borderColor: roleFilter === r ? 'var(--teal-400)' : 'var(--border)',
              background: roleFilter === r ? 'rgba(13,217,197,0.12)' : 'transparent',
              color: roleFilter === r ? 'var(--teal-400)' : 'var(--text-muted)',
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}>{r}</button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
          border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}><Plus size={14} />선원 추가</button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <SummaryChip label="총 승선인원" value={`${crew.length}명`} color="var(--blue-400)" />
        <SummaryChip label="기저질환 보유" value={`${crew.filter(c => c.chronic !== '없음').length}명`} color="var(--orange-400)" />
        <SummaryChip label="알러지 보유" value={`${crew.filter(c => c.allergies !== '없음').length}명`} color="var(--red-400)" />
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(15,32,64,0.6)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--navy-900)', zIndex: 1 }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { key: 'name', label: '이름' }, { key: 'age', label: '나이' }, { key: 'role', label: '직책' },
                { key: 'blood', label: '혈액형' }, { key: 'chronic', label: '기저질환' },
                { key: 'allergies', label: '알러지' }, { key: 'contact', label: '연락처' },
                { key: null, label: '관리' },
              ].map(col => (
                <th key={col.label}
                  onClick={() => col.key && toggleSort(col.key)}
                  style={{
                    padding: '10px 12px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)',
                    fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
                    cursor: col.key ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.key && sortKey === col.key && (
                      sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              editId === c.id ? (
                <tr key={c.id} style={{ background: 'rgba(13,217,197,0.04)', borderBottom: '1px solid var(--border)' }}>
                  {['name', 'age', 'role', 'blood', 'chronic', 'allergies', 'contact'].map(f => (
                    <td key={f} style={{ padding: '6px 8px' }}>
                      <input value={editForm[f] || ''} onChange={e => setEditForm(ef => ({ ...ef, [f]: e.target.value }))}
                        style={{ background: 'var(--navy-700)', border: '1px solid var(--teal-400)', borderRadius: 5, padding: '5px 8px', color: 'var(--text-primary)', fontSize: 12, width: '100%', outline: 'none' }} />
                    </td>
                  ))}
                  <td style={{ padding: '6px 8px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <IconBtn onClick={saveEdit} color="var(--teal-400)" icon={<Save size={13} />} />
                      <IconBtn onClick={() => setEditId(null)} color="var(--text-muted)" icon={<X size={13} />} />
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={c.id}
                  style={{ borderBottom: '1px solid rgba(13,217,197,0.05)', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(13,217,197,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: 'var(--teal-400)',
                      }}>{c.name[0]}</div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{c.age}세</td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, background: 'rgba(13,217,197,0.08)', color: 'var(--teal-400)', fontWeight: 600 }}>{c.role}</span>
                  </td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{c.blood}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: c.chronic !== '없음' ? 'var(--orange-400)' : 'var(--text-muted)' }}>{c.chronic}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: c.allergies !== '없음' ? 'var(--red-400)' : 'var(--text-muted)' }}>{c.allergies}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{c.contact}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <IconBtn onClick={() => startEdit(c)} color="var(--blue-400)" icon={<Edit2 size={13} />} />
                      <IconBtn onClick={() => setDeleteId(c.id)} color="var(--red-400)" icon={<Trash2 size={13} />} />
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAdd && (
        <Modal title="선원 추가" onClose={() => setShowAdd(false)}>
          <FormGrid form={addForm} setForm={setAddForm} />
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>취소</button>
            <button onClick={addCrew} style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700 }}>저장</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="선원 삭제" onClose={() => setDeleteId(null)}>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 20 }}>이 선원 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>취소</button>
            <button onClick={() => deleteCrew(deleteId)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--red-400)', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700 }}>삭제</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FormGrid({ form, setForm }) {
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const fields = [
    ['name', '이름'], ['age', '나이'], ['gender', '성별'], ['role', '직책'],
    ['blood', '혈액형'], ['contact', '연락처'], ['emergency', '비상연락처'], ['embark', '승선일'],
    ['chronic', '기저질환'], ['allergies', '알러지'], ['notes', '특이사항'],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {fields.map(([k, l]) => (
        <div key={k} style={{ gridColumn: ['notes', 'emergency'].includes(k) ? 'span 2' : 'auto' }}>
          <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{l}</label>
          <input value={form[k] || ''} onChange={set(k)}
            style={{ width: '100%', background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
        </div>
      ))}
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,13,26,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, width: 480, position: 'relative', maxHeight: '80vh', overflow: 'auto' }} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function IconBtn({ onClick, color, icon }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 8px', borderRadius: 6, border: `1px solid ${color}30`,
      background: `${color}10`, cursor: 'pointer', color, display: 'flex', alignItems: 'center',
    }}>{icon}</button>
  )
}

function SummaryChip({ label, value, color }) {
  return (
    <div style={{
      padding: '6px 14px', borderRadius: 8, background: 'var(--card-bg)', border: '1px solid var(--border)',
      display: 'flex', gap: 8, alignItems: 'center',
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}
