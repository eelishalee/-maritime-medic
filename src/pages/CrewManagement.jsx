import { useState } from 'react'
import { Search, Plus, UserPlus, Users, Anchor, Cog, Coffee, ShieldAlert, CheckCircle2, ChevronRight, Phone, Heart, Activity, X, Ruler, Scale, MapPin, Calendar, FileText, Pill, User as UserIcon, ChevronDown } from 'lucide-react'

const INITIAL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: '고혈압', allergies: '없음', contact: '010-2600-0001', emergency: '010-1234-5678 (배우자)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', isEmergency: true, height: 175, weight: 78, boardingDate: '2024-01-10', location: '브릿지', pastHistory: '2020년 맹장 수술', dob: '1974-05-12', gender: '남', lastMed: '암로디핀 5mg', note: '혈압 관리 주의 대상' },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: '없음', allergies: '페니실린', contact: '010-2600-0002', emergency: '010-9876-5432 (부친)', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop', height: 180, weight: 82, boardingDate: '2024-02-15', location: '데크', pastHistory: '없음', dob: '1981-11-20', gender: '남', lastMed: '없음', note: '특이사항 없음' },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', blood: 'B+', chronic: '고혈압, 고지혈증', allergies: '아스피린', contact: '010-2600-0003', emergency: '010-8765-4321 (배우자)', avatar: '/CE.jpeg', isEmergency: true, height: 172, weight: 70, boardingDate: '2024-03-01', location: '엔진룸 (사고지점)', pastHistory: '2021년 고혈압 진단, 현재 암로디핀 복용 중', dob: '1971-08-05', gender: '남', lastMed: '암로디핀 5mg, 리피토 10mg', note: '기관실 제2엔진 추락 사고 발생 (늑골 골절 의심)' },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: '허리디스크', allergies: '없음', contact: '010-2600-0004', emergency: '010-1122-3344 (배우자)', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop', height: 178, weight: 75, boardingDate: '2024-01-20', location: '선수 갑판', pastHistory: '2022년 요추 시술', dob: '1985-03-15', gender: '남', lastMed: '없음', note: '중량물 운반 주의' },
  { id: 'S26-005', name: '정조타', age: 38, role: '조타사', dept: '항해부', blood: 'O-', chronic: '없음', allergies: '조개류', contact: '010-2600-0005', emergency: '010-5566-7788 (동생)', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop', height: 170, weight: 68, boardingDate: '2024-04-10', location: '조타실', pastHistory: '없음', dob: '1988-12-22', gender: '남', lastMed: '없음', note: '식품 알레르기 주의' },
  { id: 'S26-006', name: '한닻별', age: 35, role: '2등 항해사', dept: '항해부', blood: 'A-', chronic: '비염', allergies: '먼지', contact: '010-2600-0006', emergency: '010-9900-1122 (부)', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop', height: 165, weight: 55, boardingDate: '2024-02-01', location: '차트실', pastHistory: '없음', dob: '1991-06-30', gender: '여', lastMed: '항히스타민제', note: '환절기 증상 심화' },
  { id: 'S26-007', name: '윤나침', age: 32, role: '3등 항해사', dept: '항해부', blood: 'B-', chronic: '없음', allergies: '없음', contact: '010-2600-0007', emergency: '010-8877-6655 (친구)', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', height: 173, weight: 64, boardingDate: '2024-05-15', location: '윙 브릿지', pastHistory: '없음', dob: '1994-09-10', gender: '남', lastMed: '없음', note: '건강 양호' },
  { id: 'S26-008', name: '강바다', age: 29, role: '항해사', dept: '항해부', blood: 'O+', chronic: '없음', allergies: '복숭아', contact: '010-2600-0008', emergency: '010-2233-4455 (모)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', height: 176, weight: 72, boardingDate: '2024-06-01', location: '갑판 창고', pastHistory: '없음', dob: '1997-01-25', gender: '남', lastMed: '없음', note: '특이사항 없음' },
  { id: 'S26-009', name: '조항구', age: 50, role: '조리장', dept: '지원부', blood: 'A+', chronic: '당뇨', allergies: '없음', contact: '010-2600-0009', emergency: '010-6677-8899 (배우자)', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop', height: 168, weight: 80, boardingDate: '2024-01-05', location: '조리실', pastHistory: '2015년 위절제술', dob: '1976-11-18', gender: '남', lastMed: '메트포르민', note: '저혈당 쇼크 주의' },
  { id: 'S26-010', name: '심망원', age: 27, role: '갑판원', dept: '항해부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0010', emergency: '010-3322-1100 (형)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', height: 182, weight: 85, boardingDate: '2024-07-20', location: '페인트 창고', pastHistory: '없음', dob: '1999-04-03', gender: '남', lastMed: '없음', note: '체력 우수' },
  { id: 'S26-011', name: '백전기', age: 43, role: '전기사', dept: '기관부', blood: 'A+', chronic: '없음', allergies: '벌침', contact: '010-2600-0011', emergency: '010-4455-6677 (배우자)', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop', height: 174, weight: 73, boardingDate: '2024-03-10', location: '제어실', pastHistory: '없음', dob: '1983-02-28', gender: '남', lastMed: '없음', note: '전기 설비 담당' },
  { id: 'S26-012', name: '고기압', age: 47, role: '1등 기관사', dept: '기관부', blood: 'O+', chronic: '통풍', allergies: '없음', contact: '010-2600-0012', emergency: '010-7788-9900 (누나)', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop', height: 177, weight: 79, boardingDate: '2024-02-20', location: '엔진룸 상부', pastHistory: '없음', dob: '1979-10-14', gender: '남', lastMed: '페북소스타트', note: '수분 섭취 권장' },
  { id: 'S26-013', name: '서냉각', age: 39, role: '2등 기관사', dept: '기관부', blood: 'AB-', chronic: '없음', allergies: '땅콩', contact: '010-2600-0013', emergency: '010-1100-2233 (동생)', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', height: 171, weight: 69, boardingDate: '2024-04-05', location: '보일러실', pastHistory: '없음', dob: '1987-05-22', gender: '남', lastMed: '없음', note: '알레르기 반응 주의' },
  { id: 'S26-014', name: '엄연소', age: 34, role: '3등 기관사', dept: '기관부', blood: 'B+', chronic: '위염', allergies: '없음', contact: '010-2600-0014', emergency: '010-9988-7766 (친구)', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop', height: 179, weight: 76, boardingDate: '2024-05-20', location: '발전기실', pastHistory: '없음', dob: '1992-01-12', gender: '남', lastMed: '겔포스', note: '자극적 식단 금지' },
  { id: 'S26-015', name: '송냉동', age: 40, role: '조기장', dept: '기관부', blood: 'A+', chronic: '없음', allergies: '없음', contact: '010-2600-0015', emergency: '010-3344-7788 (배우자)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', height: 172, weight: 74, boardingDate: '2024-01-15', location: '엔진 워크샵', pastHistory: '없음', dob: '1986-07-08', gender: '남', lastMed: '없음', note: '숙련 기술자' },
  { id: 'S26-016', name: '유기름', age: 28, role: '조기수', dept: '기관부', blood: 'O-', chronic: '없음', allergies: '없음', contact: '010-2600-0016', emergency: '010-2211-0099 (형)', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop', height: 175, weight: 71, boardingDate: '2024-08-10', location: '청정기실', pastHistory: '없음', dob: '1998-11-30', gender: '남', lastMed: '없음', note: '활동적임' },
  { id: 'S26-017', name: '임사무', age: 36, role: '사무장', dept: '지원부', blood: 'B-', chronic: '불면증', allergies: '없음', contact: '010-2600-0017', emergency: '010-7766-5544 (모친)', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', height: 168, weight: 62, boardingDate: '2024-02-10', location: '사무실', pastHistory: '없음', dob: '1990-04-18', gender: '여', lastMed: '스틸녹스', note: '피로 누적 주의' },
  { id: 'S26-018', name: '나서빙', age: 31, role: '조리원', dept: '지원부', blood: 'A+', chronic: '없음', allergies: '우유', contact: '010-2600-0018', emergency: '010-4455-8899 (누나)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', height: 162, weight: 52, boardingDate: '2024-06-15', location: '식당', pastHistory: '없음', dob: '1995-12-05', gender: '여', lastMed: '없음', note: '유제품 섭취 금지' },
  { id: 'S26-019', name: '지갑판', age: 26, role: '실습 항해사', dept: '항해부', blood: 'O+', chronic: '없음', allergies: '고양이', contact: '010-2600-0019', emergency: '010-1122-9988 (부친)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', height: 174, weight: 67, boardingDate: '2024-09-01', location: '브릿지', pastHistory: '없음', dob: '2000-08-14', gender: '남', lastMed: '없음', note: '실습 중' },
  { id: 'S26-020', name: '홍기관', age: 25, role: '실습 기관사', dept: '기관부', blood: 'B+', chronic: '없음', allergies: '없음', contact: '010-2600-0020', emergency: '010-4455-1122 (모친)', avatar: 'https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?q=80&w=200&auto=format&fit=crop', height: 180, weight: 77, boardingDate: '2024-09-01', location: '엔진룸 하부', pastHistory: '없음', dob: '2001-02-27', gender: '남', lastMed: '없음', note: '실습 중' },
  { id: 'S26-021', name: '문통신', age: 44, role: '통신장', dept: '항해부', blood: 'AB+', chronic: '안구건조증', allergies: '없음', contact: '010-2600-0021', emergency: '010-6655-4433 (배우자)', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop', height: 176, weight: 70, boardingDate: '2024-03-25', location: '통신실', pastHistory: '2018년 라식 수술', dob: '1982-05-30', gender: '남', lastMed: '인공눈물', note: '컴퓨터 사용 많음' },
  { id: 'S26-022', name: '탁목수', age: 49, role: '갑판부 목수', dept: '항해부', blood: 'A-', chronic: '손목터널증후군', allergies: '없음', contact: '010-2600-0022', emergency: '010-2233-9900 (남동생)', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', height: 169, weight: 72, boardingDate: '2024-01-10', location: '갑판 창고', pastHistory: '없음', dob: '1977-11-04', gender: '남', lastMed: '파스', note: '숙련된 목공' },
  { id: 'S26-023', name: '방어망', age: 37, role: '냉동사', dept: '기관부', blood: 'B-', chronic: '없음', allergies: '없음', contact: '010-2600-0023', emergency: '010-7788-1122 (배우자)', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop', height: 178, weight: 76, boardingDate: '2024-04-20', location: '냉동기실', pastHistory: '없음', dob: '1989-07-15', gender: '남', lastMed: '없음', note: '저온 환경 작업' },
  { id: 'S26-024', name: '하정비', age: 42, role: '기수', dept: '기관부', blood: 'O+', chronic: '치질', allergies: '없음', contact: '010-2600-0024', emergency: '010-3344-9988 (모)', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop', height: 171, weight: 75, boardingDate: '2024-02-28', location: '엔진룸 본체', pastHistory: '없음', dob: '1984-03-22', gender: '남', lastMed: '없음', note: '정비 보조' },
  { id: 'S26-025', name: '장빨래', age: 33, role: '세탁원', dept: '지원부', blood: 'A+', chronic: '습진', allergies: '세제', contact: '010-2600-0025', emergency: '010-8899-2233 (친구)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', height: 164, weight: 58, boardingDate: '2024-06-20', location: '세탁실', pastHistory: '없음', dob: '1993-10-12', gender: '여', lastMed: '연고', note: '장갑 필히 착용' },
  { id: 'S26-026', name: '한청결', age: 30, role: '위생원', dept: '지원부', blood: 'O+', chronic: '없음', allergies: '없음', contact: '010-2600-0026', emergency: '010-1122-3344 (누나)', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop', height: 167, weight: 60, boardingDate: '2024-07-05', location: '공용실', pastHistory: '없음', dob: '1996-02-14', gender: '여', lastMed: '없음', note: '청소 및 방역 담당' },
]

const TABS = [
  { id: 'ALL', label: '전체 선원', icon: <Users size={14}/> },
  { id: 'EMERGENCY', label: '응급 환자', icon: <ShieldAlert size={14}/>, color: '#ef4444' },
  { id: '항해부', label: '항해부', icon: <Anchor size={14}/>, color: '#38bdf8' },
  { id: '기관부', label: '기관부', icon: <Cog size={14}/>, color: '#fb923c' },
  { id: '지원부', label: '조리/지원', icon: <Coffee size={14}/>, color: '#2dd4bf' },
]

export default function CrewManagement({ onSelectPatient }) {
  const [crew, setCrew] = useState(INITIAL_CREW)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [isAdding, setIsAdding] = useState(false)
  const [newCrew, setNewCrew] = useState({
    name: '', age: '', dob: '', gender: '남', role: '', dept: '항해부', blood: 'A+', 
    height: '', weight: '', boardingDate: '', location: '',
    chronic: '없음', allergies: '없음', pastHistory: '', lastMed: '없음', note: '',
    contact: '', emergency: ''
  })

  const handleAddCrew = (e) => {
    e.preventDefault()
    const id = `S26-${String(crew.length + 1).padStart(3, '0')}`
    const avatar = `https://images.unsplash.com/photo-${1500000000000 + crew.length}?q=80&w=200&auto=format&fit=crop`
    const entry = { ...newCrew, id, avatar, age: Number(newCrew.age), isEmergency: false }
    setCrew([entry, ...crew])
    setIsAdding(false)
    setNewCrew({ 
      name: '', age: '', dob: '', gender: '남', role: '', dept: '항해부', blood: 'A+', 
      height: '', weight: '', boardingDate: '', location: '',
      chronic: '없음', allergies: '없음', pastHistory: '', lastMed: '없음', note: '',
      contact: '', emergency: '' 
    })
  }

  const handleSelect = (c) => {
    if (window.confirm(`[${c.id}] ${c.name} 선원을 응급 환자로 등록하시겠습니까?`)) {
      onSelectPatient(c)
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
    <div style={{ padding: 'var(--sp-4) var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 12, height: 'var(--content-h)', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* 상단 헤더 섹션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <Users size={18} color="#0dd9c5" />
            <h1 style={{ fontSize: '20px', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>선원 통합 관리 시스템</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginLeft: 28 }}>MV KOREA STAR 소속 선원 명부 (총 {crew.length}명 관리 중)</p>
        </div>
        
        <button onClick={() => setIsAdding(true)} style={{ padding: '0 18px', height: '40px', background: 'linear-gradient(135deg, #0dd9c5 0%, #00a896 100%)', border: 'none', borderRadius: '12px', cursor: 'pointer', color: '#020617', fontSize: '13px', fontWeight: 950, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 16px rgba(13,217,197,0.2)', transition: '0.3s', flexShrink: 0 }} className="add-btn">
          <Plus size={16} strokeWidth={3} /> 신규 선원 등록
        </button>
      </div>

      {/* 필터 및 검색 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id
            const count = crew.filter(c => tab.id === 'ALL' ? true : tab.id === 'EMERGENCY' ? c.isEmergency : c.dept === tab.id).length
            const tabColor = tab.color || '#0dd9c5'
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: '12px', background: active ? `${tabColor}15` : 'rgba(255,255,255,0.02)', border: `2px solid ${active ? tabColor : 'transparent'}`, color: active ? tabColor : '#475569', fontSize: '13px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }}>
                <span style={{ color: active ? tabColor : '#4a6080' }}>{tab.icon}</span> {tab.label}
                <span style={{ marginLeft: 4, fontSize: '10px', padding: '1px 6px', borderRadius: '5px', background: active ? tabColor : 'rgba(255,255,255,0.05)', color: active ? '#020617' : '#4a6080', fontWeight: 950 }}>{count}</span>
              </button>
            )
          })}
        </div>

        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a6080' }} size={15} />
          <input
            placeholder="선원 이름, 고유 ID, 직책으로 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', padding: '9px 16px 9px 38px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', transition: '0.3s', boxSizing: 'border-box' }}
            className="search-input"
          />
        </div>
      </div>

      {/* 등록 모달 */}
      {isAdding && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4) var(--sp-5)' }}>
          
          {/* 닫기 버튼 배치용 Wrapper */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 1000 }}>
            
            {/* 닫기(X) 버튼 : 박스 밖 우측 상단 */}
            <button 
              onClick={() => setIsAdding(false)} 
              style={{ position: 'absolute', top: 0, right: -54, zIndex: 110, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', borderRadius: '50%', padding: 'var(--sp-2)', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              className="modal-close-btn-outer"
            >
              <X size={22} strokeWidth={3} />
            </button>

            <div style={{ background: '#0a1224', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 40, width: '100%', maxHeight: '82vh', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'modalShow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
              {/* 스크롤 구역 */}
              <div style={{ overflowY: 'auto', maxHeight: '82vh', padding: 'var(--sp-6)' }} className="modal-scroll-area">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(13,217,197,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0dd9c5', flexShrink: 0 }}>
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 950, margin: 0 }}>신규 선원 프로필 생성</h2>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0', fontWeight: 700 }}>시스템에 등록될 선원의 상세 정보를 입력해 주세요.</p>
                  </div>
                </div>

                <form onSubmit={handleAddCrew} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: 'var(--sp-4) var(--sp-5)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.5px' }}><Users size={16}/> 기본 인적사항</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <FormGroup label="선원 성명" value={newCrew.name} onChange={v => setNewCrew({...newCrew, name: v})} placeholder="실명을 입력하세요" required icon={<UserIcon size={16} color="#64748b"/>} />
                      <FormGroup label="생년월일" type="date" value={newCrew.dob} onChange={v => setNewCrew({...newCrew, dob: v})} required icon={<Calendar size={16} color="#64748b"/>} isDate />
                      <SelectGroup label="성별" value={newCrew.gender} onChange={v => setNewCrew({...newCrew, gender: v})} options={['남', '여']} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
                      <FormGroup label="만 나이" type="number" value={newCrew.age} onChange={v => setNewCrew({...newCrew, age: v})} placeholder="세" required />
                      <SelectGroup label="혈액형" value={newCrew.blood} onChange={v => setNewCrew({...newCrew, blood: v})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                      <FormGroup label="신장 (cm)" type="number" value={newCrew.height} onChange={v => setNewCrew({...newCrew, height: v})} placeholder="cm" icon={<Ruler size={16} color="#64748b"/>} />
                      <FormGroup label="체중 (kg)" type="number" value={newCrew.weight} onChange={v => setNewCrew({...newCrew, weight: v})} placeholder="kg" icon={<Scale size={16} color="#64748b"/>} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: 'var(--sp-4) var(--sp-5)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12, color: '#fb923c', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.5px' }}><Anchor size={16}/> 소속 및 승선 정보</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      <SelectGroup label="소속 부서" value={newCrew.dept} onChange={v => setNewCrew({...newCrew, dept: v})} options={['항해부', '기관부', '지원부']} />
                      <FormGroup label="직급" value={newCrew.role} onChange={v => setNewCrew({...newCrew, role: v})} placeholder="Position" required />
                      <FormGroup label="승선 일자" type="date" value={newCrew.boardingDate} onChange={v => setNewCrew({...newCrew, boardingDate: v})} icon={<Calendar size={16} color="#64748b"/>} isDate />
                      <FormGroup label="현재 위치/구역" value={newCrew.location} onChange={v => setNewCrew({...newCrew, location: v})} placeholder="브릿지, 데크 등" icon={<MapPin size={16} color="#64748b"/>} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: 'var(--sp-4) var(--sp-5)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12, color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.5px' }}><ShieldAlert size={16}/> 의료 정보 및 연락처</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <FormGroup label="기저질환" value={newCrew.chronic} onChange={v => setNewCrew({...newCrew, chronic: v})} placeholder="질환명" icon={<Activity size={16} color="#64748b"/>} />
                      <FormGroup label="알레르기" value={newCrew.allergies} onChange={v => setNewCrew({...newCrew, allergies: v})} placeholder="알레르기" icon={<Heart size={16} color="#64748b"/>} />
                      <FormGroup label="최근 투약 항목" value={newCrew.lastMed} onChange={v => setNewCrew({...newCrew, lastMed: v})} placeholder="복용 약물" icon={<Pill size={16} color="#64748b"/>} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, color: '#64748b', fontWeight: 950, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={15}/> 과거 병력 및 수술 이력</label>
                        <textarea value={newCrew.pastHistory} onChange={e => setNewCrew({...newCrew, pastHistory: e.target.value})} placeholder="상세 과거력을 입력하세요" style={{ width: '100%', minHeight: 72, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 'var(--sp-3) var(--sp-3)', color: '#fff', outline: 'none', fontWeight: 700, fontSize: 13, resize: 'none', boxSizing: 'border-box', transition: '0.2s' }} className="form-textarea" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, color: '#64748b', fontWeight: 950, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Pill size={15}/> 관리 특이사항 (메모)</label>
                        <textarea value={newCrew.note} onChange={e => setNewCrew({...newCrew, note: e.target.value})} placeholder="건강관리 상 주의사항 입력" style={{ width: '100%', minHeight: 72, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 'var(--sp-3) var(--sp-3)', color: '#fff', outline: 'none', fontWeight: 700, fontSize: 13, resize: 'none', boxSizing: 'border-box', transition: '0.2s' }} className="form-textarea" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <FormGroup label="본인 연락처" value={newCrew.contact} onChange={v => setNewCrew({...newCrew, contact: v})} placeholder="010-0000-0000" required icon={<Phone size={16} color="#64748b"/>} />
                      <FormGroup label="비상 연락처 (관계 포함)" value={newCrew.emergency} onChange={v => setNewCrew({...newCrew, emergency: v})} placeholder="010-0000-0000 (관계)" required icon={<Phone size={16} color="#ff4d6d"/>} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: 'var(--sp-4)', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: 14, color: '#94a3b8', fontSize: 14, fontWeight: 900, cursor: 'pointer', transition: '0.2s' }} className="cancel-btn">등록 취소</button>
                    <button type="submit" style={{ flex: 2, padding: 'var(--sp-4)', background: 'linear-gradient(135deg, #0dd9c5 0%, #00a896 100%)', border: 'none', borderRadius: 14, color: '#020617', fontSize: 14, fontWeight: 950, cursor: 'pointer', boxShadow: '0 8px 20px rgba(13,217,197,0.25)', transition: '0.2s' }} className="submit-btn">선원 데이터 저장 및 시스템 등록</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 리스트 영역 */}
      <div style={{ flex: 1, overflow: 'auto', background: 'rgba(10,22,40,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '32px', padding: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', padding: '0 20px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ background: '#020617' }}>
              {['선원 프로필', '소속 및 직위', '신체 정보', '기저질환', '알레르기', '긴급 연락망', '응급 환자 등록'].map((h, i) => (
                <th key={i} style={{ padding: 'var(--sp-3) var(--sp-3)', textAlign: i === 6 ? 'center' : 'left', fontSize: '12px', color: '#64748b', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => handleSelect(c)} style={{ cursor: 'pointer', transition: '0.2s' }} className="crew-card-row">
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)', borderRadius: '14px 0 0 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 50, borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)', background: '#0a1628', flexShrink: 0 }}>
                      <img
                        src={c.avatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name || 'User') + '&background=0ea5e9&color=fff&size=128';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={c.name}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 950, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                      <span style={{ fontSize: '11px', color: '#0dd9c5', background: 'rgba(13,217,197,0.1)', padding: '1px 6px', borderRadius: '5px', fontWeight: 900 }}>{c.id}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {c.dept === '항해부' && <Anchor size={14} color="#38bdf8" />}
                      {c.dept === '기관부' && <Cog size={14} color="#fb923c" />}
                      {c.dept === '지원부' && <Coffee size={14} color="#2dd4bf" />}
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 800 }}>{c.dept}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>/</span>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 900 }}>{c.role}</div>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 950, marginBottom: 1 }}>나이</div>
                      <div style={{ fontSize: '18px', fontWeight: 950, color: '#f1f5f9' }}>{c.age}</div>
                    </div>
                    <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 950, marginBottom: 1 }}>혈액형</div>
                      <div style={{ fontSize: '18px', fontWeight: 950, color: '#ff4d6d' }}>{c.blood}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {c.chronic && c.chronic !== '없음' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fb923c', background: 'rgba(251,146,60,0.12)', padding: '5px 10px', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(251,146,60,0.2)' }}>
                        <ShieldAlert size={13} /> <span style={{ fontSize: '13px', fontWeight: 800 }}>{c.chronic}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {c.allergies && c.allergies !== '없음' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff708d', background: 'rgba(255,112,141,0.12)', padding: '5px 10px', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(255,112,141,0.2)' }}>
                        <Heart size={13} /> <span style={{ fontSize: '13px', fontWeight: 800 }}>{c.allergies}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                    <Phone size={13} color="#ff4d6d" />
                    <span style={{ fontSize: '12px', fontWeight: 800 }}>{c.emergency}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-3)', background: 'rgba(255,255,255,0.02)', borderRadius: '0 14px 14px 0', textAlign: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); handleSelect(c); }} className="register-btn" style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: '13px', fontWeight: 950, cursor: 'pointer', transition: '0.2s', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    <UserPlus size={14} strokeWidth={3} /> 응급 환자 등록
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes modalShow {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-scroll-area::-webkit-scrollbar { width: 8px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; border: 2px solid #0a1224; }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(13,217,197,0.3); }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          background: rgba(13,217,197,0.06) !important;
          border-color: #0dd9c5 !important;
          box-shadow: 0 0 20px rgba(13,217,197,0.15) !important;
        }
        .modal-close-btn-outer:hover { background: rgba(255,77,109,0.3) !important; color: #ff4d6d !important; border-color: #ff4d6d !important; transform: rotate(90deg) scale(1.1); }
        .cancel-btn:hover { background: rgba(255,255,255,0.05) !important; color: #fff !important; }
        .submit-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 15px 40px rgba(13,217,197,0.3) !important; }
        
        .crew-card-row:hover td { background: rgba(13,217,197,0.06) !important; border-top: 1.5px solid rgba(13,217,197,0.2); border-bottom: 1.5px solid rgba(13,217,197,0.2); }
        .crew-card-row:hover td:first-child { border-left: 1.5px solid rgba(13,217,197,0.2); }
        .crew-card-row:hover td:last-child { border-right: 1.5px solid rgba(13,217,197,0.2); }
        .register-btn:hover { background: #38bdf8 !important; color: #020617 !important; transform: scale(1.05); }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6) sepia(1) saturate(5) hue-rotate(130deg);
          cursor: pointer;
          opacity: 0.7;
          width: 24px;
          height: 24px;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}

function FormGroup({ label, value, onChange, placeholder, type = 'text', required = false, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <label style={{ fontSize: 13, color: '#64748b', fontWeight: 950, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <div style={{ position: 'absolute', left: 12, zIndex: 1 }}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: icon ? '10px 12px 10px 36px' : '10px 14px', color: '#fff', outline: 'none',
            fontWeight: 800, fontSize: 13, boxSizing: 'border-box', transition: '0.2s'
          }}
          className="form-input"
        />
      </div>
    </div>
  )
}

function SelectGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <label style={{ fontSize: 13, color: '#64748b', fontWeight: 950, marginLeft: 4 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 36px 10px 14px', color: '#fff', outline: 'none',
            fontWeight: 800, fontSize: 13, boxSizing: 'border-box', cursor: 'pointer',
            appearance: 'none', transition: '0.2s'
          }}
          className="form-select"
        >
          {options.map(opt => <option key={opt} value={opt} style={{background: '#0a1224'}}>{opt}{label === '혈액형' ? '형' : ''}</option>)}
        </select>
        <ChevronDown size={16} color="#4a6080" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}
