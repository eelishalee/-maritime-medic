import { useState } from 'react'
import { 
  Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle, 
  Stethoscope, ClipboardList, Pill, Camera, ChevronRight, CheckCircle2,
  AlertCircle, Info, Search, User, ChevronDown
} from 'lucide-react'

// 선원 데이터 (isEmergency 속성 추가)
const ALL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: ['고혈압'], allergies: ['없음'], vitals: { bp: '138/85', hr: 78, temp: 36.5, spo2: 98 }, dob: '1974-05-12', height: 175, weight: 78, emergency_contact: '배우자 (010-1234-5678)', isEmergency: false },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: ['없음'], allergies: ['페니실린'], vitals: { bp: '120/80', hr: 72, temp: 36.6, spo2: 99 }, dob: '1981-11-20', height: 180, weight: 82, emergency_contact: '부친 (010-9876-5432)', isEmergency: false },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', blood: 'B+', chronic: ['고혈압', '고지혈증'], allergies: ['아스피린'], vitals: { bp: '158/95', hr: 92, temp: 37.8, spo2: 94 }, dob: '1971-08-05', height: 172, weight: 70, emergency_contact: '양정희 (010-8765-4321)', isEmergency: true },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: ['허리디스크'], allergies: ['없음'], vitals: { bp: '132/88', hr: 85, temp: 36.8, spo2: 97 }, dob: '1985-03-15', height: 178, weight: 75, emergency_contact: '배우자 (010-1122-3344)', isEmergency: false },
]

export default function PatientChart({ patient: activePatientProp }) {
  const [selectedId, setSelectedId] = useState(activePatientProp?.id || 'S26-003')
  
  // 선택된 환자 데이터 매칭
  const patientData = ALL_CREW.find(c => c.id === selectedId) || ALL_CREW[0]
  
  // 프롭스로 전달받은 환자와 현재 선택된 환자가 같으면 프롭스 데이터 우선 적용 (비상연락망 연동을 위해)
  const patient = (selectedId === activePatientProp?.id) 
    ? { 
        ...patientData, 
        emergency_contact: activePatientProp.emergencyContact 
          ? `${activePatientProp.emergencyContact.name} (${activePatientProp.emergencyContact.phone})`
          : patientData.emergency_contact 
      }
    : patientData;

  return (
    <div style={{ padding: '0', height: 'calc(100vh - 56px)', overflow: 'auto', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* 상단 고정 헤더 : 환자 선택 셀렉터 및 요약 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(7, 15, 30, 0.95)', backdropFilter: 'blur(15px)', borderBottom: `1px solid ${patient.isEmergency ? '#ff4d6d40' : 'rgba(13,217,197,0.2)'}`, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* 환자 선택 셀렉트 박스 */}
          <div style={{ position: 'relative', minWidth: '320px' }}>
            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: patient.isEmergency ? '#ff4d6d' : '#0dd9c5', zIndex: 1 }}>
              {patient.isEmergency ? <AlertTriangle size={20} /> : <Search size={20} />}
            </div>
            <select 
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ 
                width: '100%', padding: '14px 40px 14px 50px', background: patient.isEmergency ? 'rgba(255,77,109,0.08)' : 'rgba(13,217,197,0.05)', 
                border: `2px solid ${patient.isEmergency ? '#ff4d6d' : 'rgba(13,217,197,0.3)'}`, borderRadius: '16px', color: '#fff', 
                fontSize: '14px', fontWeight: 900, outline: 'none', cursor: 'pointer', appearance: 'none',
                boxShadow: patient.isEmergency ? '0 4px 20px rgba(255,77,109,0.2)' : '0 4px 15px rgba(0,0,0,0.2)',
                transition: '0.3s'
              }}
            >
              {ALL_CREW.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#0a1224', color: '#fff' }}>
                  {c.isEmergency ? '🚨 [위급] ' : ''}{c.name} ({c.role})
                </option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', pointerEvents: 'none' }}>
              <ChevronDown size={20} />
            </div>
          </div>

          <div style={{ width: 2, height: 40, background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ 
              width: 50, height: 50, borderRadius: 15, 
              background: patient.isEmergency ? 'rgba(255,77,109,0.15)' : 'rgba(13,217,197,0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 16, fontWeight: 950,
              color: patient.isEmergency ? '#ff4d6d' : '#0dd9c5', 
              border: `1px solid ${patient.isEmergency ? '#ff4d6d40' : 'rgba(13,217,197,0.2)'}`,
              animation: patient.isEmergency ? 'pulse-red 2s infinite' : 'none'
            }}>
              {patient.name[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: '18px', fontWeight: 950, color: '#fff' }}>{patient.name}</div>
                {patient.isEmergency && (
                  <span style={{ 
                    background: '#ff4d6d', color: '#fff', padding: '2px 10px', borderRadius: '6px', 
                    fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4,
                    boxShadow: '0 0 15px rgba(255,77,109,0.4)'
                  }}>
                    <AlertTriangle size={14} fill="currentColor" /> 위급 환자
                  </span>
                )}
              </div>
              <div style={{ fontSize: 15, color: '#94a3b8', marginTop: 2 }}>{patient.role} · {patient.age}세 · {patient.gender} · {patient.blood}형</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 15 }}>
          <VitalCard label="혈압" value={patient.vitals.bp} unit="mmHg" icon={<Activity size={18}/>} color="#ff4d6d" alert />
          <VitalCard label="심박" value={patient.vitals.hr} unit="bpm" icon={<Heart size={18}/>} color="#ff708d" />
          <VitalCard label="체온" value={patient.vitals.temp} unit="°C" icon={<Thermometer size={18}/>} color="#fb923c" alert />
          <VitalCard label="산소" value={patient.vitals.spo2} unit="%" icon={<Droplets size={18}/>} color="#38bdf8" alert />
        </div>
      </div>

      <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12 }}>
        
        {/* 왼쪽 사이드바 : 환자 기본 의료 정보 (정적 정보) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StaticInfoCard title="기본 인적사항" icon={<Info size={20}/>}>
            <InfoRow label="생년월일" value={patient.dob} />
            <InfoRow label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`} />
            <InfoRow label="비상연락" value={patient.emergency_contact} />
          </StaticInfoCard>

          <StaticInfoCard title="과거 병력 (기저질환)" icon={<Clock size={20}/>} color="#fb923c">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {patient.chronic.map(c => <Tag key={c} color="#fb923c">{c}</Tag>)}
            </div>
          </StaticInfoCard>

          <StaticInfoCard title="알레르기 주의" icon={<AlertTriangle size={20}/>} color="#ff4d6d">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {patient.allergies.map(a => <Tag key={a} color="#ff4d6d">{a}</Tag>)}
            </div>
          </StaticInfoCard>
        </div>

        {/* 메인 차트 영역 : SOAP 기반 기록 (동적 정보) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* S: 주관적 기록 (선원용 질문) */}
          <ChartSection title="STEP 1. 환자 증상 파악 (Subjective)" sub="환자가 어디가 어떻게 아프다고 하나요?" icon={<Stethoscope size={24}/>}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InputGroup label="발생 시각 및 장소" placeholder="예: 오전 10:30, 2번 데크 작업 중" />
              <InputGroup label="통증 부위" placeholder="예: 오른쪽 발목, 가슴 답답함 등" />
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700, marginBottom: 6, display: 'block' }}>통증 강도 (0: 없음 ~ 10: 참을 수 없음)</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: n > 7 ? '#ff4d6d' : n > 4 ? '#fb923c' : '#475569', color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: 12 }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </ChartSection>

          {/* O: 객관적 관찰 (눈으로 보이는 상태) */}
          <ChartSection title="STEP 2. 눈으로 확인되는 상태 (Objective)" sub="관리자가 직접 확인한 사실을 선택해 주세요." icon={<ClipboardList size={24}/>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
              <CheckItem label="외부 출혈 있음" />
              <CheckItem label="심한 부종(부어오름)" />
              <CheckItem label="뼈 돌출/골절 의심" />
              <CheckItem label="의식 혼미/상실" />
              <CheckItem label="호흡 곤란" />
              <CheckItem label="안색 창백/청색증" />
            </div>
            <button style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(13,217,197,0.1)', border: '1px dashed #0dd9c5', color: '#0dd9c5', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Camera size={16}/> 환부 사진 촬영 및 첨부
            </button>
          </ChartSection>

          {/* A & P: 판단 및 조치 계획 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
            <ChartSection title="STEP 3. 의료 판단 (NEWS/MEWS)" sub="현재 환자의 상태 단계는 무엇인가요?" icon={<AlertCircle size={24}/>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <StatusOption color="#10b981" label="정상 (Normal)" desc="정기적 모니터링" />
                <StatusOption color="#facc15" label="경미 (Mild)" desc="관찰 주기 단축" />
                <StatusOption color="#fb923c" label="주의 (Caution)" desc="의료 처치 준비" active />
                <StatusOption color="#ef4444" label="위험 (Danger)" desc="긴급 이송 및 회항" />
              </div>
            </ChartSection>

            <ChartSection title="STEP 4. 조치 내역 및 계획" sub="어떤 도움을 주었나요?" icon={<Pill size={24}/>}>
              <textarea
                placeholder="예: 상처 부위 소독 후 압박 붕대 실시. 타이레놀 1정 복용함. 1시간 뒤 다시 체크 예정."
                style={{ width: '100%', minHeight: 80, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px', color: '#fff', fontSize: 14, outline: 'none', resize: 'none' }}
              />
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 20px', borderRadius: 10, background: '#0dd9c5', color: '#020617', border: 'none', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16}/> 차트 저장 및 원격 보고
                </button>
              </div>
            </ChartSection>
          </div>

        </div>
      </div>
    </div>
  )
}

function VitalCard({ label, value, unit, icon, color, alert }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${alert ? color : 'rgba(255,255,255,0.1)'}`, padding: '8px 14px', borderRadius: 12, minWidth: 100, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: '#64748b', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 17, fontWeight: 950, color: alert ? color : '#fff' }}>
        {value}<span style={{ fontSize: 11, fontWeight: 500, color: '#475569', marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  )
}

function StaticInfoCard({ title, icon, children, color = '#0dd9c5' }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {icon} {title}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{ padding: '3px 8px', borderRadius: 6, background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  )
}

function ChartSection({ title, sub, icon, children }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(13,217,197,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0dd9c5', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 950, color: '#fff' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function InputGroup({ label, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function CheckItem({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, cursor: 'pointer' }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid #475569', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>{label}</span>
    </div>
  )
}

function StatusOption({ color, label, desc, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: active ? `${color}15` : 'rgba(255,255,255,0.02)', border: `2px solid ${active ? color : 'transparent'}`, borderRadius: 10, cursor: 'pointer', transition: '0.2s' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 900, color: active ? color : '#fff' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{desc}</div>
      </div>
      {active && <CheckCircle2 size={16} style={{ marginLeft: 'auto', color }} />}
    </div>
  )
}
