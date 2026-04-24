import { useState } from 'react'
import {
  Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle,
  Stethoscope, ClipboardList, Pill, Camera, CheckCircle2,
  AlertCircle, Info, Search, User, ChevronDown, FileText, Zap
} from 'lucide-react'

const ALL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: ['고혈압'], allergies: ['없음'], vitals: { bp: '138/85', hr: 78, temp: 36.5, spo2: 98 }, dob: '1974-05-12', height: 175, weight: 78, emergency_contact: '배우자 (010-1234-5678)', isEmergency: false },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: ['없음'], allergies: ['페니실린'], vitals: { bp: '120/80', hr: 72, temp: 36.6, spo2: 99 }, dob: '1981-11-20', height: 180, weight: 82, emergency_contact: '부친 (010-9876-5432)', isEmergency: false },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', blood: 'B+', chronic: ['고혈압', '고지혈증'], allergies: ['아스피린'], vitals: { bp: '158/95', hr: 92, temp: 37.8, spo2: 94 }, dob: '1971-08-05', height: 172, weight: 70, emergency_contact: '양정희 (010-8765-4321)', isEmergency: true },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: ['허리디스크'], allergies: ['없음'], vitals: { bp: '132/88', hr: 85, temp: 36.8, spo2: 97 }, dob: '1985-03-15', height: 178, weight: 75, emergency_contact: '배우자 (010-1122-3344)', isEmergency: false },
]

// SOAP 탭 정의
const SOAP_TABS = [
  { id: 'S', label: 'S · 증상', short: 'S', desc: '주관적 기록', icon: <Stethoscope size={14}/>, color: '#38bdf8' },
  { id: 'O', label: 'O · 관찰', short: 'O', desc: '객관적 관찰', icon: <ClipboardList size={14}/>, color: '#0dd9c5' },
  { id: 'A', label: 'A · 판단', short: 'A', desc: '의료 판단', icon: <AlertCircle size={14}/>, color: '#fb923c' },
  { id: 'P', label: 'P · 처치', short: 'P', desc: '조치 계획', icon: <Pill size={14}/>, color: '#26de81' },
]

export default function PatientChart({ patient: activePatientProp }) {
  const [selectedId, setSelectedId] = useState(activePatientProp?.id || 'S26-003')
  const [activeTab, setActiveTab] = useState('S')
  const [checkItems, setCheckItems] = useState({})
  const [statusOption, setStatusOption] = useState('caution')
  const [memo, setMemo] = useState('')

  const patientData = ALL_CREW.find(c => c.id === selectedId) || ALL_CREW[0]
  const patient = (selectedId === activePatientProp?.id)
    ? {
        ...patientData,
        emergency_contact: activePatientProp.emergencyContact
          ? `${activePatientProp.emergencyContact.name} (${activePatientProp.emergencyContact.phone})`
          : patientData.emergency_contact
      }
    : patientData

  const toggleCheck = (key) => setCheckItems(p => ({ ...p, [key]: !p[key] }))

  return (
    <div style={{
      height: 'var(--content-h)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#020617',
      color: '#fff',
    }}>
      {/* ── 상단 고정 헤더 : 환자 선택 + 바이탈 ── */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(7,15,30,0.97)',
        backdropFilter: 'blur(15px)',
        borderBottom: `1px solid ${patient.isEmergency ? 'rgba(255,77,109,0.3)' : 'rgba(13,217,197,0.15)'}`,
        padding: 'var(--sp-3) var(--sp-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-4)',
        flexWrap: 'wrap',
      }}>
        {/* 환자 선택 */}
        <div style={{ position: 'relative', minWidth: 'clamp(220px, 25vw, 340px)' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: patient.isEmergency ? '#ff4d6d' : '#0dd9c5', zIndex: 1 }}>
            {patient.isEmergency ? <AlertTriangle size={16} /> : <Search size={16} />}
          </div>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{
              width: '100%',
              padding: '0 36px 0 44px',
              height: 'var(--touch-md)',
              background: patient.isEmergency ? 'rgba(255,77,109,0.08)' : 'rgba(13,217,197,0.05)',
              border: `2px solid ${patient.isEmergency ? '#ff4d6d' : 'rgba(13,217,197,0.3)'}`,
              borderRadius: 'var(--r-md)',
              color: '#fff',
              fontSize: 'var(--text-sm)',
              fontWeight: 900,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
            }}
          >
            {ALL_CREW.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#0a1224', color: '#fff' }}>
                {c.isEmergency ? '🚨 [위급] ' : ''}{c.name} ({c.role})
              </option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', pointerEvents: 'none' }}>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* 환자 요약 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div style={{
            width: 'clamp(34px, 4vw, 46px)', height: 'clamp(34px, 4vw, 46px)',
            borderRadius: 'var(--r-sm)',
            background: patient.isEmergency ? 'rgba(255,77,109,0.15)' : 'rgba(13,217,197,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-md)', fontWeight: 950,
            color: patient.isEmergency ? '#ff4d6d' : '#0dd9c5',
          }}>
            {patient.name[0]}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 950, color: '#fff' }}>{patient.name}</span>
              {patient.isEmergency && (
                <span style={{ background: '#ff4d6d', color: '#fff', padding: '2px 8px', borderRadius: 'var(--r-xs)', fontSize: 'var(--text-xs)', fontWeight: 900 }}>
                  위급
                </span>
              )}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: '#94a3b8', marginTop: 1 }}>
              {patient.role} · {patient.age}세 · {patient.blood}형
            </div>
          </div>
        </div>

        {/* 바이탈 카드 (가로 배치) */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <VitalCard label="혈압" value={patient.vitals.bp} unit="mmHg" icon={<Activity size={13}/>} color="#ff4d6d" alert />
          <VitalCard label="심박" value={patient.vitals.hr} unit="bpm" icon={<Heart size={13}/>} color="#ff708d" />
          <VitalCard label="체온" value={patient.vitals.temp} unit="°C" icon={<Thermometer size={13}/>} color="#fb923c" alert />
          <VitalCard label="산소" value={patient.vitals.spo2} unit="%" icon={<Droplets size={13}/>} color="#38bdf8" alert />
        </div>
      </div>

      {/* ── 본문 : 사이드바 + SOAP 탭 ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'var(--col-narrow) 1fr',
        gap: 0,
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* 왼쪽 사이드바 : 환자 기본 정보 (내부 스크롤 허용) */}
        <div style={{
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-3)',
          padding: 'var(--sp-3)',
          background: 'rgba(5,10,20,0.4)',
        }}>
          <StaticInfoCard title="기본 인적사항" icon={<Info size={15}/>}>
            <InfoRow label="생년월일" value={patient.dob} />
            <InfoRow label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`} />
            <InfoRow label="비상연락" value={patient.emergency_contact} />
          </StaticInfoCard>

          <StaticInfoCard title="기저질환" icon={<Clock size={15}/>} color="#fb923c">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginTop: 8 }}>
              {patient.chronic.map(c => <Tag key={c} color="#fb923c">{c}</Tag>)}
            </div>
          </StaticInfoCard>

          <StaticInfoCard title="알레르기" icon={<AlertTriangle size={15}/>} color="#ff4d6d">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginTop: 8 }}>
              {patient.allergies.map(a => <Tag key={a} color="#ff4d6d">{a}</Tag>)}
            </div>
          </StaticInfoCard>
        </div>

        {/* 오른쪽 : SOAP 탭 기반 기록 (no-scroll) */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* SOAP 탭 바 */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(5,10,20,0.6)',
            flexShrink: 0,
          }}>
            {SOAP_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  height: 'var(--touch-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab.id ? `${tab.color}12` : 'transparent',
                  color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: activeTab === tab.id ? 900 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--sp-2)',
                  transition: 'all 0.15s',
                  borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                  position: 'relative',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div style={{ flex: 1, padding: 'var(--sp-4)', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>

            {activeTab === 'S' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', flex: 1 }}>
                <SectionTitle>S · 주관적 증상 기록 (Subjective)</SectionTitle>
                <p style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: -8 }}>환자가 직접 호소하는 증상을 기록하세요.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                  <InputGroup label="발생 시각 및 장소" placeholder="예: 오전 10:30, 2번 데크 작업 중" />
                  <InputGroup label="통증 부위" placeholder="예: 오른쪽 발목, 가슴 답답함 등" />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: '#94a3b8', fontWeight: 700, marginBottom: 6, display: 'block' }}>
                    통증 강도 (0: 없음 ~ 10: 참을 수 없음)
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} style={{
                        width: 'var(--touch-sm)', height: 'var(--touch-sm)',
                        borderRadius: '50%', border: 'none',
                        background: n > 7 ? '#ff4d6d' : n > 4 ? '#fb923c' : '#1e293b',
                        color: '#fff', fontWeight: 900, cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                      }}>{n}</button>
                    ))}
                  </div>
                </div>
                <InputGroup label="부가 증상 메모" placeholder="예: 어지러움, 구토, 시야 흐림 등" />
              </div>
            )}

            {activeTab === 'O' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', flex: 1 }}>
                <SectionTitle>O · 객관적 관찰 (Objective)</SectionTitle>
                <p style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: -8 }}>직접 눈으로 확인한 사실을 선택하세요.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)' }}>
                  {[
                    '외부 출혈 있음', '심한 부종(부어오름)', '뼈 돌출/골절 의심',
                    '의식 혼미/상실', '호흡 곤란', '안색 창백/청색증',
                    '동공 확대', '체온 이상', '맥박 불규칙',
                  ].map(item => (
                    <CheckItem
                      key={item}
                      label={item}
                      checked={!!checkItems[item]}
                      onToggle={() => toggleCheck(item)}
                    />
                  ))}
                </div>
                <button style={{
                  height: 'var(--touch-md)',
                  borderRadius: 'var(--r-md)',
                  background: 'rgba(13,217,197,0.08)',
                  border: '1px dashed #0dd9c5',
                  color: '#0dd9c5',
                  fontWeight: 800,
                  fontSize: 'var(--text-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer',
                }}>
                  <Camera size="var(--icon-md)" /> 환부 사진 촬영 및 첨부
                </button>
              </div>
            )}

            {activeTab === 'A' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', flex: 1 }}>
                <SectionTitle>A · 의료 판단 (Assessment)</SectionTitle>
                <p style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: -8 }}>현재 환자의 위급 단계를 선택하세요 (NEWS/MEWS 기반).</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {[
                    { id: 'normal',  color: '#10b981', label: '정상 (Normal)', desc: '정기적 모니터링 유지', icon: '🟢' },
                    { id: 'mild',    color: '#facc15', label: '경미 (Mild)',   desc: '관찰 주기 단축 필요', icon: '🟡' },
                    { id: 'caution', color: '#fb923c', label: '주의 (Caution)', desc: '즉각 의료 처치 준비',icon: '🟠' },
                    { id: 'danger',  color: '#ef4444', label: '위험 (Danger)', desc: '긴급 이송 및 회항 검토', icon: '🔴' },
                  ].map(opt => (
                    <StatusOption
                      key={opt.id}
                      {...opt}
                      active={statusOption === opt.id}
                      onSelect={() => setStatusOption(opt.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'P' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', flex: 1 }}>
                <SectionTitle>P · 조치 내역 및 계획 (Plan)</SectionTitle>
                <p style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: -8 }}>시행한 처치와 향후 계획을 기록하세요.</p>
                <textarea
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  placeholder="예: 상처 부위 소독 후 압박 붕대 실시. 타이레놀 1정 복용 확인. 1시간 뒤 재평가 예정."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--sp-4)',
                    color: '#fff',
                    fontSize: 'var(--text-base)',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.6,
                    minHeight: '6rem',
                  }}
                />
                <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
                  <button style={{
                    height: 'var(--touch-md)',
                    padding: '0 var(--sp-6)',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    fontWeight: 700,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                  }}>
                    <FileText size="var(--icon-sm)" /> 임시 저장
                  </button>
                  <button style={{
                    height: 'var(--touch-md)',
                    padding: '0 var(--sp-6)',
                    borderRadius: 'var(--r-md)',
                    background: '#0dd9c5',
                    border: 'none',
                    color: '#020617',
                    fontWeight: 900,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                    boxShadow: '0 4px 16px rgba(13,217,197,0.3)',
                  }}>
                    <CheckCircle2 size="var(--icon-sm)" /> 차트 저장 및 원격 보고
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 'var(--text-md)', fontWeight: 950, color: '#fff', borderLeft: '3px solid var(--teal-400)', paddingLeft: 'var(--sp-3)' }}>
      {children}
    </div>
  )
}

function VitalCard({ label, value, unit, icon, color, alert }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${alert ? color + '60' : 'rgba(255,255,255,0.08)'}`,
      padding: 'var(--sp-2) var(--sp-3)',
      borderRadius: 'var(--r-sm)',
      textAlign: 'center',
      minWidth: 'clamp(70px, 8vw, 110px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#64748b', fontSize: 'var(--text-xs)', marginBottom: 2 }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 950, color: alert ? color : '#fff' }}>
        {value}<span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: '#475569', marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  )
}

function StaticInfoCard({ title, icon, children, color = '#0dd9c5' }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.5)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 'var(--r-md)',
      padding: 'var(--sp-3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 8, color, fontSize: 'var(--text-xs)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {icon} {title}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ color: '#64748b', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{
      padding: '3px 8px',
      borderRadius: 'var(--r-xs)',
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
    }}>
      {children}
    </span>
  )
}

function InputGroup({ label, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
      <label style={{ fontSize: 'var(--text-xs)', color: '#94a3b8', fontWeight: 700 }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 'var(--touch-sm)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--r-sm)',
          padding: '0 var(--sp-3)',
          color: '#fff',
          fontSize: 'var(--text-sm)',
          outline: 'none',
        }}
      />
    </div>
  )
}

function CheckItem({ label, checked, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
        padding: 'var(--sp-2) var(--sp-3)',
        background: checked ? 'rgba(13,217,197,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${checked ? 'rgba(13,217,197,0.3)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 'var(--r-sm)',
        cursor: 'pointer',
        minHeight: 'var(--touch-sm)',
        transition: '0.15s',
      }}
    >
      <div style={{
        width: 16, height: 16,
        borderRadius: 4,
        border: `2px solid ${checked ? '#0dd9c5' : '#475569'}`,
        background: checked ? '#0dd9c5' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: '0.15s',
      }}>
        {checked && <CheckCircle2 size={10} color="#020617" strokeWidth={3}/>}
      </div>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: checked ? '#e2e8f0' : '#94a3b8' }}>{label}</span>
    </div>
  )
}

function StatusOption({ id, color, label, desc, icon, active, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        padding: 'var(--sp-3) var(--sp-4)',
        background: active ? `${color}12` : 'rgba(255,255,255,0.02)',
        border: `2px solid ${active ? color : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 'var(--r-md)',
        cursor: 'pointer',
        transition: '0.2s',
        minHeight: 'var(--touch-md)',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 900, color: active ? color : '#fff' }}>{label}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: '#64748b', marginTop: 1 }}>{desc}</div>
      </div>
      {active && <CheckCircle2 size={16} color={color} />}
    </div>
  )
}
