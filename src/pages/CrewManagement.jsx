import { useState, useRef } from 'react'
import { Search, Plus, UserPlus, Users, Anchor, Cog, Coffee, ShieldAlert, CheckCircle2, ChevronRight, Phone, Heart, Activity, X, Ruler, Scale, MapPin, Calendar, FileText, Pill, User as UserIcon, ChevronDown, Camera, Upload } from 'lucide-react'

// ─── 이미지 자산 매핑 (Vite) ───
const getPhoto = (name) => new URL(`../assets/photo/${name}`, import.meta.url).href

const INITIAL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: '고혈압', allergies: '없음', contact: '010-2600-0001', emergencyName: '김도윤', emergency: '010-1234-5678 (배우자)', avatar: getPhoto('001.png'), isEmergency: false, height: 175, weight: 78, boardingDate: '2024-01-10', location: '항해 브릿지 (Nav. Bridge)', pastHistory: '2020년 맹장 수술', dob: '1974-05-12', gender: '남', lastMed: '암로디핀 5mg', note: '혈압 관리 주의' },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '페니실린', contact: '010-2600-0002', emergencyName: '이서연', emergency: '010-9876-5432 (부친)', avatar: getPhoto('002.png'), isEmergency: false, height: 180, weight: 82, boardingDate: '2024-02-15', location: '메인 데크 · 화물 관리구역', pastHistory: '없음', dob: '1981-11-20', gender: '남', lastMed: '없음', note: '특이사항 없음' },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', blood: 'B+', chronic: '고혈압, 고지혈증', allergies: '아스피린', contact: '010-2600-0003', emergencyName: '양정희', emergency: '010-8765-4321 (배우자)', avatar: getPhoto('003.jpeg'), isEmergency: true, height: 172, weight: 70, boardingDate: '2024-03-01', location: '엔진 제어실 (ECR)', pastHistory: '2021년 고혈압 진단', dob: '1971-08-05', gender: '남', lastMed: '암로디핀 5mg', note: '기관실 추락 사고 발생 (늑골 골절 의심)' },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: '허리디스크', allergies: '없음', contact: '010-2600-0004', emergencyName: '박지호', emergency: '010-1122-3344 (배우자)', avatar: getPhoto('004.png'), isEmergency: false, height: 178, weight: 75, boardingDate: '2024-01-20', location: '선수 갑판 (Forecastle Deck)', pastHistory: '2022년 요추 시술', dob: '1985-03-15', gender: '남', lastMed: '없음', note: '중량물 운반 주의' },
  { id: 'S26-005', name: '정조타', age: 38, role: '조타사', dept: '항해부', blood: 'O-', chronic: '없음', allergies: '조개류', contact: '010-2600-0005', emergencyName: '최민준', emergency: '010-5566-7788 (동생)', avatar: getPhoto('005.png'), isEmergency: false, height: 170, weight: 68, boardingDate: '2024-04-10', location: '조타실 (Wheel House)', pastHistory: '없음', dob: '1988-12-22', gender: '남', lastMed: '없음', note: '식품 알레르기 주의' },
  { id: 'S26-006', name: '한통신', age: 43, role: '통신장', dept: '항해부', blood: 'A+', chronic: '비염', allergies: '먼지', contact: '010-2600-0006', emergencyName: '정하윤', emergency: '010-9988-7766 (배우자)', avatar: getPhoto('006.png'), isEmergency: false, height: 174, weight: 72, boardingDate: '2024-02-05', location: '통신 제어실 (Radio Room)', pastHistory: '없음', dob: '1983-05-30', gender: '남', lastMed: '없음', note: '건강 양호' },
  { id: 'S26-007', name: '강기계', age: 47, role: '1등 기관사', dept: '기관부', blood: 'B-', chronic: '없음', allergies: '벌침', contact: '010-2600-0007', emergencyName: '강준우', emergency: '010-4455-6677 (누나)', avatar: getPhoto('007.png'), isEmergency: false, height: 179, weight: 80, boardingDate: '2024-03-12', location: '제2엔진실 구역 B-1', pastHistory: '없음', dob: '1979-11-18', gender: '남', lastMed: '없음', note: '숙련 정비사' },
  { id: 'S26-008', name: '윤조리', age: 49, role: '조리장', dept: '지원부', blood: 'O+', chronic: '당뇨', allergies: '없음', contact: '010-2600-0008', emergencyName: '조예은', emergency: '010-6677-8899 (배우자)', avatar: getPhoto('008.png'), isEmergency: false, height: 168, weight: 76, boardingDate: '2024-01-05', location: '상부 데크 조리실 (Galley)', pastHistory: '없음', dob: '1977-09-22', gender: '남', lastMed: '메트포르민', note: '식이 관리 필요' },
  { id: 'S26-009', name: '임전기', age: 35, role: '전기사', dept: '기관부', blood: 'AB-', chronic: '없음', allergies: '없음', contact: '010-2600-0009', emergencyName: '윤도현', emergency: '010-2211-0099 (형)', avatar: getPhoto('009.png'), isEmergency: false, height: 176, weight: 73, boardingDate: '2024-05-20', location: '주 발전기실 (Gen. Room)', pastHistory: '없음', dob: '1991-03-12', gender: '남', lastMed: '없음', note: '전기 설비 담당' },
  { id: 'S26-010', name: '백보급', age: 32, role: '사무장', dept: '지원부', blood: 'A-', chronic: '없음', allergies: '먼지', contact: '010-2600-0010', emergencyName: '장수빈', emergency: '010-3344-5566 (모친)', avatar: getPhoto('010.png'), isEmergency: false, height: 165, weight: 58, boardingDate: '2024-06-15', location: 'A-데크 사무실', pastHistory: '없음', dob: '1994-07-08', gender: '여', lastMed: '없음', note: '물자 관리 담당' },
  { id: 'S26-011', name: '황갑판', age: 28, role: '갑판원', dept: '항해부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0011', emergencyName: '임지훈', emergency: '010-1100-2233 (동생)', avatar: getPhoto('011.png'), isEmergency: false, height: 182, weight: 85, boardingDate: '2024-07-01', location: '보트 데크 위험물 창고', pastHistory: '없음', dob: '1998-01-25', gender: '남', lastMed: '없음', note: '체력 우수' },
  { id: 'S26-012', name: '서기관', age: 30, role: '3등 기관사', dept: '기관부', blood: 'O+', chronic: '없음', allergies: '땅콩', contact: '010-2600-0012', emergencyName: '한지민', emergency: '010-5544-3322 (친구)', avatar: getPhoto('012.png'), isEmergency: false, height: 173, weight: 70, boardingDate: '2024-08-10', location: '청정기실 (Purifier Room)', pastHistory: '없음', dob: '1996-12-05', gender: '남', lastMed: '없음', note: '초임 사관' },
  { id: 'S26-013', name: '오항해', age: 26, role: '실습 항해사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '없음', contact: '010-2600-0013', emergencyName: '오세현', emergency: '010-7788-9900 (부친)', avatar: getPhoto('013.png'), isEmergency: false, height: 177, weight: 68, boardingDate: '2024-09-01', location: '항해 브릿지 · 조타 지원', pastHistory: '없음', dob: '2000-04-14', gender: '남', lastMed: '없음', note: '실습 중' },
  { id: 'S26-014', name: '나위생', age: 31, role: '위생원', dept: '지원부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0014', emergencyName: '신예준', emergency: '010-1122-3344 (언니)', avatar: getPhoto('014.png'), isEmergency: false, height: 162, weight: 52, boardingDate: '2024-04-20', location: '거주구역 공용실', pastHistory: '없음', dob: '1995-10-30', gender: '여', lastMed: '없음', note: '방역 담당' },
  { id: 'S26-015', name: '고기수', age: 44, role: '기수', dept: '기관부', blood: 'O-', chronic: '치질', allergies: '없음', contact: '010-2600-0015', emergencyName: '송다희', emergency: '010-9900-1122 (배우자)', avatar: getPhoto('015.png'), isEmergency: false, height: 171, weight: 75, boardingDate: '2024-02-28', location: '엔진룸 기계 워크샵', pastHistory: '없음', dob: '1982-08-12', gender: '남', lastMed: '없음', note: '용접 숙련' },
  { id: 'S26-016', name: '문세탁', age: 33, role: '세탁원', dept: '지원부', blood: 'AB+', chronic: '습진', allergies: '세제', contact: '010-2600-0016', emergencyName: '권태한', emergency: '010-8899-2233 (모친)', avatar: getPhoto('016.png'), isEmergency: false, height: 164, weight: 60, boardingDate: '2024-06-20', location: 'B-데크 세탁실', pastHistory: '없음', dob: '1993-02-14', gender: '남', lastMed: '연고', note: '장갑 착용 필수' },
]

const TABS = [
  { id: 'ALL', label: '전체 선원', icon: <Users size={24}/> },
  { id: 'EMERGENCY', label: '응급 환자', icon: <ShieldAlert size={24}/>, color: '#ef4444' },
  { id: '항해부', label: '항해부', icon: <Anchor size={24}/>, color: '#38bdf8' },
  { id: '기관부', label: '기관부', icon: <Cog size={24}/>, color: '#fb923c' },
  { id: '지원부', label: '조리/지원', icon: <Coffee size={24}/>, color: '#2dd4bf' },
]

export default function CrewManagement({ onSelectPatient }) {
  const [crew, setCrew] = useState(() => {
    try {
      const saved = localStorage.getItem('mdts_crew_list')
      return saved ? JSON.parse(saved) : INITIAL_CREW
    } catch { return INITIAL_CREW }
  })

  // 선원 목록 저장 유틸리티
  const saveCrew = (newList) => {
    setCrew(newList)
    localStorage.setItem('mdts_crew_list', JSON.stringify(newList))
  }

  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [isAdding, setIsAdding] = useState(false)
  const [newCrew, setNewCrew] = useState({
    name: '', age: '', dob: '', gender: '남', role: '', dept: '항해부', blood: 'A+', 
    height: '', weight: '', boardingDate: '', location: '',
    chronic: '', allergies: '', pastHistory: '', lastMed: '', note: '',
    contact: '', emergencyName: '', emergency: '', avatar: null
  })

  const [dateEditor, setDateEditor] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCrew(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateSelect = (dateStr) => {
    if (!dateEditor) return
    setNewCrew(prev => ({ ...prev, [dateEditor.field]: dateStr }))
    setDateEditor(null)
  }

  const handleAddCrew = (e) => {
    e.preventDefault()
    if (!newCrew.name.trim()) { alert('이름을 입력하세요.'); return }
    if (!newCrew.role.trim()) { alert('직책을 입력하세요.'); return }
    if (!newCrew.dept.trim()) { alert('부서를 선택하세요.'); return }
    const id = `S26-${String(crew.length + 1).padStart(3, '0')}`
    const finalAvatar = newCrew.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newCrew.name)}&background=random&color=fff&size=200`
    const entry = { ...newCrew, id, avatar: finalAvatar, age: Number(newCrew.age), isEmergency: false }
    saveCrew([...crew, entry])
    setIsAdding(false)
    setNewCrew({
      name: '', age: '', dob: '', gender: '남', role: '', dept: '항해부', blood: 'A+',
      height: '', weight: '', boardingDate: '', location: '',
      chronic: '', allergies: '', pastHistory: '', lastMed: '', note: '',
      contact: '', emergency: '', avatar: null
    })
  }

  const handleDeleteCrew = (id) => {
    const target = crew.find(c => c.id === id)
    if (!target) return
    if (!window.confirm(`[${target.id}] ${target.name} 선원을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    saveCrew(crew.filter(c => c.id !== id))
  }

  const [editTarget, setEditTarget] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const handleEditCrew = (e) => {
    e.preventDefault()
    if (!editTarget.name.trim()) { alert('이름을 입력하세요.'); return }
    if (!editTarget.role.trim()) { alert('직책을 입력하세요.'); return }
    saveCrew(crew.map(c => c.id === editTarget.id ? { ...editTarget } : c))
    setEditTarget(null)
  }

  const handleSelect = (c) => {
    if (c.isEmergency) {
      onSelectPatient(c)
      return
    }
    if (window.confirm(`[${c.id}] ${c.name} 선원을 응급 환자로 등록하시겠습니까?`)) {
      const updatedCrew = crew.map(member => 
        member.id === c.id ? { ...member, isEmergency: true } : member
      )
      saveCrew(updatedCrew)
      onSelectPatient({ ...c, isEmergency: true })
    }
  }

  const filtered = crew.filter(c => {
    const nameMatch = c.name.toLowerCase().includes(query.toLowerCase())
    const idMatch = c.id.toLowerCase().includes(query.toLowerCase())
    const roleMatch = c.role.toLowerCase().includes(query.toLowerCase())
    const matchQ = nameMatch || idMatch || roleMatch
    const matchT = activeTab === 'ALL' || (activeTab === 'EMERGENCY' ? c.isEmergency : c.dept === activeTab)
    return matchQ && matchT
  })

  return (
    <div style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: 24, height: 'calc(100vh - 72px)', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Users size={24} color="#0dd9c5" />
            <h1 style={{ fontSize: '30px', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>선원 통합 관리 시스템</h1>
          </div>
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 700, marginLeft: 36 }}>MV KOREA STAR 소속 선원 명부 (총 {crew.length}명 관리 중)</p>
        </div>
        
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {selectedId && (() => {
            const sel = crew.find(c => c.id === selectedId)
            return sel ? (
              <>
                <button
                  onClick={() => { setEditTarget({...sel}); setSelectedId(null) }}
                  style={{ padding: '0 20px', height: '52px', background: 'rgba(56,189,248,0.1)', border: '1.5px solid #38bdf8', borderRadius: '16px', cursor: 'pointer', color: '#38bdf8', fontSize: '15px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  ✏ 수정
                </button>
                <button
                  onClick={() => { handleDeleteCrew(sel.id); setSelectedId(null) }}
                  style={{ padding: '0 20px', height: '52px', background: 'rgba(255,77,109,0.1)', border: '1.5px solid #ff4d6d', borderRadius: '16px', cursor: 'pointer', color: '#ff4d6d', fontSize: '15px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <X size={16}/> 삭제
                </button>
              </>
            ) : null
          })()}
          <button onClick={() => setIsAdding(true)} style={{ padding: '0 24px', height: '52px', background: 'linear-gradient(135deg, #0dd9c5 0%, #00a896 100%)', border: 'none', borderRadius: '16px', cursor: 'pointer', color: '#020617', fontSize: '16px', fontWeight: 950, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 25px rgba(13,217,197,0.2)', transition: '0.3s' }}>
            <Plus size={20} strokeWidth={3} /> 신규 선원 등록
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id
            const count = crew.filter(c => tab.id === 'ALL' ? true : tab.id === 'EMERGENCY' ? c.isEmergency : c.dept === tab.id).length
            const tabColor = tab.color || '#0dd9c5'
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderRadius: '22px', background: active ? `${tabColor}15` : 'rgba(255,255,255,0.02)', border: `2.5px solid ${active ? tabColor : 'transparent'}`, color: active ? tabColor : '#475569', fontSize: '22px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s' }}>
                <span style={{ color: active ? tabColor : '#4a6080', display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                </span> 
                {tab.label}
                <span style={{ marginLeft: 10, fontSize: '30px', padding: '2px 16px', borderRadius: '12px', background: active ? tabColor : 'rgba(255,255,255,0.05)', color: active ? '#020617' : '#4a6080', fontWeight: 950 }}>{count}</span>
              </button>
            )
          })}
        </div>

        <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
          <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#4a6080' }} size={18} />
          <input 
            placeholder="선원 이름, 고유 ID, 담당 직위로 검색..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            style={{ width: '100%', padding: '14px 20px 14px 48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '15px', outline: 'none', transition: '0.3s', boxSizing: 'border-box', fontFamily: 'inherit' }} 
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(10,22,40,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '32px', padding: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', padding: '0 20px' }}>
          <thead>
            <tr style={{ background: '#020617', position: 'sticky', top: 0, zIndex: 10 }}>
              {['선원 프로필', '소속 및 직위', '신체 정보', '기저질환', '알레르기', '긴급 연락망', '환자 관리'].map((h, i) => (
                <th key={i} style={{ padding: '20px 24px', textAlign: 'center', fontSize: '26px', color: '#64748b', fontWeight: 950 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelectedId(prev => prev === c.id ? null : c.id)} style={{ cursor: 'pointer', transition: '0.2s', outline: selectedId === c.id ? '2px solid #0dd9c5' : 'none', borderRadius: 20 }} className="crew-card-row">
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px 0 0 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 80, borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)', background: '#0a1628' }}>
                      <img src={c.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.name} />
                    </div>
                    <div style={{ textAlign: 'left', minWidth: '120px' }}>
                      <div style={{ fontSize: '25px', fontWeight: 950, color: '#fff' }}>{c.name}</div>
                      <span style={{ fontSize: '24px', color: '#0dd9c5', fontWeight: 900 }}>{c.id}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <div style={{ fontSize: '25px', color: '#fff', fontWeight: 900 }}>
                    {c.dept} <span style={{ color: '#475569', margin: '0 8px', fontWeight: 500 }}>/</span> {c.role}
                  </div>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <div style={{ fontSize: '25px', fontWeight: 950, color: '#ff4d6d' }}>{c.blood} <span style={{ fontSize: '22px', color: '#64748b', fontWeight: 800 }}>/ {c.age}세</span></div>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <span style={{ fontSize: '25px', fontWeight: 800, color: c.chronic ? '#fb923c' : '#475569' }}>{c.chronic || '없음'}</span>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <span style={{ fontSize: '25px', fontWeight: 800, color: c.allergies ? '#ff708d' : '#475569' }}>{c.allergies || '없음'}</span>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <div style={{ fontSize: '25px', fontWeight: 950, color: '#fff', marginBottom: 4 }}>
                    {(() => {
                      const PROTECTOR_MAP = {
                        'S26-001': '김도윤', 'S26-002': '김도장', 'S26-003': '양정희', 'S26-004': '박지호',
                        'S26-005': '정민준', 'S26-006': '정하윤', 'S26-007': '강준우', 'S26-008': '조예은',
                        'S26-009': '임도현', 'S26-010': '장수빈', 'S26-011': '황지훈', 'S26-012': '한지민',
                        'S26-013': '오세현', 'S26-014': '나혜지', 'S26-015': '송다희', 'S26-016': '김한혜'
                      };
                      return PROTECTOR_MAP[c.id] || c.emergencyName || '보호자 미지정';
                    })()}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{c.emergency}</div>
                </td>
                <td style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 20px 20px 0', textAlign: 'center' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelect(c); }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: c.isEmergency ? 'rgba(239, 68, 68, 0.1)' : 'rgba(13, 217, 197, 0.1)',
                      border: `1.5px solid ${c.isEmergency ? '#ef4444' : '#0dd9c5'}`,
                      color: c.isEmergency ? '#ef4444' : '#0dd9c5',
                      fontSize: '22px',
                      fontWeight: 950,
                      cursor: 'pointer',
                      transition: '0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      margin: '0 auto'
                    }}
                  >
                    {c.isEmergency ? <ShieldAlert size={20}/> : <Plus size={20}/>}
                    {c.isEmergency ? '집중 관리 중' : '환자로 전환'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 선원 수정 모달 */}
      {editTarget && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#0d1117', border: '1.5px solid rgba(56,189,248,0.3)', borderRadius: 24, padding: 40, width: '100%', maxWidth: 700, position: 'relative' }}>
            <button onClick={() => setEditTarget(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#64748b' }}><X size={20}/></button>
            <div style={{ fontSize: 26, fontWeight: 950, color: '#38bdf8', marginBottom: 28 }}>✏ 선원 정보 수정 — {editTarget.name}</div>
            <form onSubmit={handleEditCrew}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { label: '이름', field: 'name' }, { label: '직책', field: 'role' },
                  { label: '나이', field: 'age', type: 'number' }, { label: '연락처', field: 'contact' },
                  { label: '기저질환', field: 'chronic' }, { label: '알레르기', field: 'allergies' },
                  { label: '복용 약물', field: 'lastMed' }, { label: '위치', field: 'location' },
                  { label: '비상연락처명', field: 'emergencyName' }, { label: '비상연락처', field: 'emergency' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>{label}</div>
                    <input
                      type={type || 'text'}
                      value={editTarget[field] || ''}
                      onChange={e => setEditTarget(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>부서</div>
                  <select value={editTarget.dept || '항해부'} onChange={e => setEditTarget(p => ({ ...p, dept: e.target.value }))} style={{ width: '100%', background: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 16, fontWeight: 600, outline: 'none' }}>
                    {['항해부', '기관부', '지원부'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>특이사항</div>
                  <input value={editTarget.note || ''} onChange={e => setEditTarget(p => ({ ...p, note: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 16, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>취소</button>
                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: 12, background: '#38bdf8', color: '#000', border: 'none', fontSize: 18, fontWeight: 950, cursor: 'pointer' }}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdding && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 1000 }}>
            <button 
              onClick={() => setIsAdding(false)} 
              style={{ 
                position: 'absolute', top: 0, right: -70, 
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0
              }}
            >
              <X size={32}/>
            </button>
            <div style={{ background: '#0a1224', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 40, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(13,217,197,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0dd9c5' }}><UserPlus size={36} /></div>
                  <h2 style={{ fontSize: 34, fontWeight: 950, margin: 0 }}>신규 선원 프로필 생성</h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ width: 120, height: 150, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(13,217,197,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: '0.2s' }}
                  >
                    {newCrew.avatar ? (
                      <img src={newCrew.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <Camera size={32} color="#0dd9c5" style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>사진 업로드</div>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
                </div>
              </div>

              <form onSubmit={handleAddCrew} style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '30px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={22}/> 기본 인적사항
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <FormGroup label="선원 성명" value={newCrew.name} onChange={v => setNewCrew({...newCrew, name: v})} placeholder="실명 입력" icon={<UserIcon size={18}/>} />
                    <FormGroup label="생년월일" type="date" value={newCrew.dob} onDateClick={() => setDateEditor({ field: 'dob', label: '생년월일', value: newCrew.dob })} icon={<Calendar size={18}/>} />
                    <SelectGroup label="성별" value={newCrew.gender} onChange={v => setNewCrew({...newCrew, gender: v})} options={['남', '여']} icon={<UserIcon size={18}/>} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 20 }}>
                    <FormGroup label="만 나이" type="number" value={newCrew.age} onChange={v => setNewCrew({...newCrew, age: v})} placeholder="세" />
                    <SelectGroup label="혈액형" value={newCrew.blood} onChange={v => setNewCrew({...newCrew, blood: v})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} icon={<Heart size={18}/>} />
                    <FormGroup label="신장 (cm)" type="number" value={newCrew.height} onChange={v => setNewCrew({...newCrew, height: v})} placeholder="cm" icon={<Ruler size={18}/>} />
                    <FormGroup label="체중 (kg)" type="number" value={newCrew.weight} onChange={v => setNewCrew({...newCrew, weight: v})} placeholder="kg" icon={<Scale size={18}/>} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '30px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#fb923c', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Anchor size={22}/> 소속 및 승선 정보
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                    <SelectGroup label="소속 부서" value={newCrew.dept} onChange={v => setNewCrew({...newCrew, dept: v})} options={['항해부', '기관부', '지원부']} icon={<Anchor size={18}/>} />
                    <FormGroup label="직위" value={newCrew.role} onChange={v => setNewCrew({...newCrew, role: v})} placeholder="예: 기관장" />
                    <FormGroup label="승선 일자" type="date" value={newCrew.boardingDate} onDateClick={() => setDateEditor({ field: 'boardingDate', label: '승선 일자', value: newCrew.boardingDate })} icon={<Calendar size={18}/>} />
                    <FormGroup label="현재 위치" value={newCrew.location} onChange={v => setNewCrew({...newCrew, location: v})} placeholder="예: 브릿지" icon={<MapPin size={18}/>} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '30px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ShieldAlert size={22}/> 의료 정보 및 연락처
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <FormGroup label="기저질환" value={newCrew.chronic} onChange={v => setNewCrew({...newCrew, chronic: v})} placeholder="질환명 입력" icon={<Activity size={18}/>} />
                    <FormGroup label="알레르기" value={newCrew.allergies} onChange={v => setNewCrew({...newCrew, allergies: v})} placeholder="알레르기 입력" icon={<Heart size={18}/>} />
                    <FormGroup label="최근 투약" value={newCrew.lastMed} onChange={v => setNewCrew({...newCrew, lastMed: v})} placeholder="약물명 입력" icon={<Pill size={18}/>} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 18, color: '#64748b', fontWeight: 950 }}>과거 병력 및 수술 이력</label>
                      <textarea value={newCrew.pastHistory} onChange={e => setNewCrew({...newCrew, pastHistory: e.target.value})} placeholder="상세 내용 입력..." style={{ width: '100%', minHeight: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 20px', color: '#fff', outline: 'none', fontWeight: 700, fontSize: 18, resize: 'none', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 18, color: '#64748b', fontWeight: 950 }}>관리 특이사항 (메모)</label>
                      <textarea value={newCrew.note} onChange={e => setNewCrew({...newCrew, note: e.target.value})} placeholder="주의사항 입력..." style={{ width: '100%', minHeight: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 20px', color: '#fff', outline: 'none', fontWeight: 700, fontSize: 18, resize: 'none', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 20, marginTop: 20 }}>
                    <FormGroup label="본인 연락처" value={newCrew.contact} onChange={v => setNewCrew({...newCrew, contact: v})} placeholder="010-0000-0000" icon={<Phone size={18}/>} />
                    <FormGroup label="보호자 성명" value={newCrew.emergencyName} onChange={v => setNewCrew({...newCrew, emergencyName: v})} placeholder="보호자 실명 입력" icon={<UserIcon size={18}/>} />
                    <FormGroup label="비상 연락처 (관계)" value={newCrew.emergency} onChange={v => setNewCrew({...newCrew, emergency: v})} placeholder="010-0000-0000 (관계)" icon={<Phone size={18}/>} />
                  </div>
                </div>
                <button type="submit" style={{ padding: '24px', background: 'linear-gradient(135deg, #0dd9c5 0%, #00a896 100%)', border: 'none', borderRadius: 20, color: '#020617', fontSize: 22, fontWeight: 950, cursor: 'pointer' }}>선원 데이터 저장 및 시스템 등록</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {dateEditor && (
        <CalendarModal label={dateEditor.label} initialValue={dateEditor.value} onClose={() => setDateEditor(null)} onSelect={handleDateSelect} />
      )}

      <style>{`
        .crew-card-row:hover td { background: rgba(13,217,197,0.06) !important; }
        .form-input:focus, .form-select:focus { border-color: #0dd9c5 !important; background: rgba(13,217,197,0.05) !important; }
      `}</style>
    </div>
  )
}

function FormGroup({ label, value, type, icon, onDateClick, onChange, placeholder }) {
  const isDate = type === 'date';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{ fontSize: '19px', color: '#64748b', fontWeight: 950 }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: isDate ? 'pointer' : 'text' }} onClick={() => isDate && onDateClick()}>
        {icon && <div style={{ position: 'absolute', left: 16, color: '#64748b' }}>{icon}</div>}
        <input 
          readOnly={isDate} 
          value={value} 
          onChange={e => !isDate && onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: icon ? '18px 18px 18px 48px' : '18px 20px', color: value ? '#0dd9c5' : '#fff', outline: 'none', fontWeight: 800, fontSize: '19px', fontFamily: 'inherit', cursor: 'inherit' }} 
        />
      </div>
    </div>
  )
}

function SelectGroup({ label, value, onChange, options, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{ fontSize: '19px', color: '#64748b', fontWeight: 950 }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <div style={{ position: 'absolute', left: 16, color: '#64748b', pointerEvents: 'none' }}>{icon}</div>}
        <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: icon ? '18px 48px 18px 48px' : '18px 20px', color: '#0dd9c5', outline: 'none', fontWeight: 800, fontSize: '19px', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o} style={{background: '#0a1224'}}>{o}</option>)}
        </select>
        <ChevronDown size={20} style={{ position: 'absolute', right: 18, color: '#4a6080', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function CalendarModal({ label, initialValue, onClose, onSelect }) {
  const [viewDate, setViewDate] = useState(initialValue && !isNaN(new Date(initialValue).getTime()) ? new Date(initialValue) : new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(40px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 650, background: '#0a1224', border: '2.5px solid #0dd9c5', borderRadius: 40, padding: 50, boxShadow: '0 0 80px rgba(13,217,197,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0dd9c5', marginBottom: 8 }}>{label} 시스템 설정</div>
            <div style={{ fontSize: 42, fontWeight: 950, color: '#fff' }}>{year}년 {month + 1}월</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 60, height: 60, borderRadius: 20, cursor: 'pointer' }}><X size={30}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, marginBottom: 40 }}>
          <button onClick={() => setViewDate(new Date(year - 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>이전 해</button>
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>이전 달</button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>다음 달</button>
          <button onClick={() => setViewDate(new Date(year + 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>다음 해</button>
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
