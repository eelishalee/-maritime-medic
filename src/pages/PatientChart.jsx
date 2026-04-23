import { useState } from 'react'
import { 
  Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle, 
  Stethoscope, ClipboardList, Pill, Camera, ChevronRight, CheckCircle2,
  AlertCircle, Info, Search, User, ChevronDown, HeartPulse, Wind, Send, Save, Eye, ShieldCheck
} from 'lucide-react'
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

const ALL_CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', blood: 'O+', chronic: ['고혈압'], allergies: ['없음'], vitals: { bp: '138/85', hr: 78, temp: 36.5, spo2: 98 }, dob: '1974-05-12', height: 175, weight: 78, emergency_contact: '배우자 (010-1234-5678)', isEmergency: false },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', blood: 'A+', chronic: ['없음'], allergies: ['페니실린'], vitals: { bp: '120/80', hr: 72, temp: 36.6, spo2: 99 }, dob: '1981-11-20', height: 180, weight: 82, emergency_contact: '부친 (010-9876-5432)', isEmergency: false },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', blood: 'B+', chronic: ['고혈압', '고지혈증'], allergies: ['아스피린'], vitals: { bp: '158/95', hr: 92, temp: 37.8, spo2: 94 }, dob: '1971-08-05', height: 172, weight: 70, emergency_contact: '양정희 (010-8765-4321)', isEmergency: true, avatar: '/CE.jpeg' },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', blood: 'AB+', chronic: ['허리디스크'], allergies: ['없음'], vitals: { bp: '132/88', hr: 85, temp: 36.8, spo2: 97 }, dob: '1985-03-15', height: 178, weight: 75, emergency_contact: '배우자 (010-1122-3344)', isEmergency: false },
]

export default function PatientChart({ patient: activePatientProp }) {
  const [selectedId, setSelectedId] = useState(activePatientProp?.id || 'S26-003')
  
  const patientData = ALL_CREW.find(c => c.id === selectedId) || ALL_CREW[0]
  const patient = (selectedId === activePatientProp?.id) 
    ? { 
        ...patientData, 
        emergency_contact: activePatientProp.emergencyContact 
          ? `${activePatientProp.emergencyContact.name} (${activePatientProp.emergencyContact.phone})`
          : patientData.emergency_contact 
      }
    : patientData;

  const [painLevel, setPainLevel] = useState(7)

  return (
    <div className="cyber-bg" style={{ padding: '0', height: 'calc(100vh - 86px)', overflow: 'auto', background: C.bg, color: C.text, fontFamily: '"Pretendard", sans-serif', scrollbarWidth: 'none' }}>
      
      {/* 상단 고정 헤더 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5, 7, 10, 0.95)', backdropFilter: 'blur(15px)', borderBottom: `1px solid ${patient.isEmergency ? `${C.danger}44` : C.border}`, padding: '22px 46px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {/* 환자 선택 셀렉트 박스 */}
          <div style={{ position: 'relative', minWidth: '430px' }}>
            <div style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: patient.isEmergency ? C.danger : C.cyan, zIndex: 1 }}>
              {patient.isEmergency ? <AlertTriangle size={28} /> : <Search size={28} />}
            </div>
            <select 
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ 
                width: '100%', padding: '18px 46px 18px 64px', background: patient.isEmergency ? `${C.danger}11` : `${C.cyan}0a`, 
                border: `2px solid ${patient.isEmergency ? C.danger : C.cyan}66`, borderRadius: '20px', color: '#fff', 
                fontSize: '25px', fontWeight: 950, outline: 'none', cursor: 'pointer', appearance: 'none',
                boxShadow: patient.isEmergency ? `0 0 20px ${C.danger}33` : `0 0 15px ${C.cyan}11`,
                transition: '0.3s'
              }}
            >
              {ALL_CREW.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#0a1224', color: '#fff' }}>
                  {c.isEmergency ? '🚨 [위급] ' : ''}{c.name} ({c.role})
                </option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: 22, top: '50%', transform: 'translateY(-50%)', color: C.sub, pointerEvents: 'none' }}>
              <ChevronDown size={28} />
            </div>
          </div>

          <div style={{ width: 2, height: 58, background: C.border }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ 
              width: 72, height: 72, borderRadius: 22, 
              background: patient.isEmergency ? `${C.danger}18` : `${C.cyan}11`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 32, fontWeight: 950, 
              color: patient.isEmergency ? C.danger : C.cyan, 
              border: `2px solid ${patient.isEmergency ? C.danger : C.cyan}44`,
              boxShadow: patient.isEmergency ? `0 0 20px ${C.danger}33` : 'none',
              animation: patient.isEmergency ? 'blink 2s infinite' : 'none'
            }}>
              {patient.name[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ fontSize: '34px', fontWeight: 950, color: '#fff' }}>{patient.name}</div>
                {patient.isEmergency && (
                  <span style={{ 
                    background: C.danger, color: '#fff', padding: '4px 14px', borderRadius: 9, 
                    fontSize: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: `0 0 15px ${C.danger}66`
                  }}>
                    <AlertTriangle size={18} fill="currentColor" /> 위급 환자
                  </span>
                )}
              </div>
              <div style={{ fontSize: 20, color: C.sub, fontWeight: 800, marginTop: 4 }}>{patient.role} · {patient.age}세 · {patient.gender} · {patient.blood}형</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18 }}>
          <VitalCard label="혈압" value={patient.vitals.bp} unit="mmHg" icon={<Activity size={22}/>} color={C.warning} alert />
          <VitalCard label="심박" value={patient.vitals.hr} unit="bpm" icon={<HeartPulse size={22}/>} color={C.danger} />
          <VitalCard label="체온" value={patient.vitals.temp} unit="°C" icon={<Thermometer size={22}/>} color="#f97316" alert />
          <VitalCard label="산소" value={patient.vitals.spo2} unit="%" icon={<Wind size={22}/>} color={C.info} alert />
        </div>
      </div>

      <div style={{ padding: '46px', display: 'grid', gridTemplateColumns: '460px 1fr', gap: 34 }}>
        
        {/* 왼쪽 사이드바 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <StaticInfoCard title="기본 인적사항" icon={<Info size={28}/>}>
            <InfoRow label="생년월일" value={patient.dob} />
            <InfoRow label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`} />
            <InfoRow label="비상연락" value={patient.emergency_contact} />
          </StaticInfoCard>

          <StaticInfoCard title="과거 병력 (기저질환)" icon={<Clock size={28}/>} color={C.warning}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11, marginTop: 14 }}>
              {patient.chronic.map(c => <Tag key={c} color={C.warning}>{c}</Tag>)}
            </div>
          </StaticInfoCard>

          <StaticInfoCard title="알레르기 주의" icon={<AlertTriangle size={28}/>} color={C.danger}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11, marginTop: 14 }}>
              {patient.allergies.map(a => <Tag key={a} color={C.danger}>{a}</Tag>)}
            </div>
          </StaticInfoCard>

          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '34px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.info, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
              <ShieldCheck size={28} /> 최근 진료 요약
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '22px', borderRadius: 22, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20, color: '#fff', fontWeight: 800, marginBottom: 9 }}>2026-03-15 (내과)</div>
              <p style={{ fontSize: 18, color: C.sub, lineHeight: 1.5, margin: 0 }}>기관실 고온 작업 후 가벼운 현기증 호소. 충분한 휴식 권고함.</p>
            </div>
          </div>
        </div>

        {/* 메인 차트 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          
          {/* S: 주관적 기록 */}
          <ChartSection title="STEP 1. 환자 증상 파악 (Subjective)" sub="환자가 어디가 어떻게 아프다고 하나요?" icon={<Stethoscope size={34}/>}>
            <div style={{ display: grid, gridTemplateColumns: '1fr 1fr', gap: 28 }}>
              <InputGroup label="발생 시각 및 장소" placeholder="예: 오전 10:30, 2번 데크 작업 중" />
              <InputGroup label="통증 부위" placeholder="예: 오른쪽 발목, 가슴 답답함 등" />
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 22, color: C.sub, fontWeight: 800, marginBottom: 14, display: 'block' }}>통증 강도 (0: 없음 ~ 10: 참을 수 없음)</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '22px', borderRadius: 22, border: `1px solid ${C.border}` }}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} 
                      onClick={() => setPainLevel(n)}
                      style={{ 
                        width: 52, height: 52, borderRadius: '50%', border: 'none', 
                        background: painLevel === n ? (n > 7 ? C.danger : n > 4 ? C.warning : C.cyan) : C.dim, 
                        color: painLevel === n ? '#000' : '#fff', fontWeight: 950, cursor: 'pointer',
                        fontSize: 22, transition: '0.2s',
                        boxShadow: painLevel === n ? `0 0 15px ${n > 7 ? C.danger : n > 4 ? C.warning : C.cyan}88` : 'none'
                      }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </ChartSection>

          {/* O: 객관적 관찰 */}
          <ChartSection title="STEP 2. 눈으로 확인되는 상태 (Objective)" sub="관리자가 직접 확인한 사실을 선택해 주세요." icon={<ClipboardList size={34}/>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              <CheckItem label="외부 출혈 있음" />
              <CheckItem label="심한 부종(부어오름)" />
              <CheckItem label="뼈 돌출/골절 의심" />
              <CheckItem label="의식 혼미/상실" />
              <CheckItem label="호흡 곤란" />
              <CheckItem label="안색 창백/청색증" />
            </div>
            <button style={{ marginTop: 28, width: '100%', height: 82, borderRadius: 22, background: `${C.info}11`, border: `2px dashed ${C.info}44`, color: C.info, fontWeight: 950, fontSize: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, cursor: 'pointer', transition: '0.2s' }}>
              <Camera size={28}/> 환부 사진 촬영 및 AI 분석 첨부
            </button>
          </ChartSection>

          {/* A & P: 판단 및 조치 계획 */}
          <div style={{ display: 'grid', gridTemplateColumns: '520px 1fr', gap: 34 }}>
            <ChartSection title="STEP 3. 의료 판단" sub="현재 환자의 상태 단계는?" icon={<AlertCircle size={34}/>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <StatusOption color={C.success} label="정상 (Normal)" desc="정기적 모니터링" />
                <StatusOption color="#facc15" label="경미 (Mild)" desc="관찰 주기 단축" />
                <StatusOption color={C.warning} label="주의 (Caution)" desc="의료 처치 준비" active />
                <StatusOption color={C.danger} label="위험 (Danger)" desc="긴급 이송 및 회항" />
              </div>
            </ChartSection>

            <ChartSection title="STEP 4. 조치 내역 및 계획" sub="어떤 도움을 주었나요?" icon={<Pill size={34}/>}>
              <textarea 
                placeholder="예: 상처 부위 소독 후 압박 붕대 실시. 타이레놀 1정 복용함. 1시간 뒤 다시 체크 예정."
                style={{ width: '100%', minHeight: 280, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 22, padding: '22px', color: '#fff', fontSize: 25, outline: 'none', resize: 'none', fontWeight: 500, lineHeight: 1.5 }}
              />
              <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end', gap: 18 }}>
                <button style={{ height: 82, padding: '0 46px', borderRadius: 22, background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${C.border}`, fontWeight: 900, fontSize: 25, cursor: 'pointer' }}>
                  임시 저장
                </button>
                <button style={{ height: 82, padding: '0 46px', borderRadius: 22, background: C.cyan, color: '#000', border: 'none', fontWeight: 950, fontSize: 25, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 8px 25px ${C.cyan}44` }}>
                  <Send size={28}/> 차트 저장 및 전송
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
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${alert ? color : C.border}`, padding: '14px 25px', borderRadius: 20, minWidth: 158, textAlign: 'center', backdropFilter: 'blur(10px)', animation: alert ? 'blink 2s infinite' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, color: C.sub, fontSize: 18, fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 950, color: alert ? color : '#fff', textShadow: alert ? `0 0 10px ${color}66` : 'none' }}>
        {value}<span style={{ fontSize: 18, fontWeight: 700, color: C.sub, marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  )
}

function StaticInfoCard({ title, icon, children, color = C.cyan }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '34px', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, color, fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
        {icon} {title}
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.sub, fontSize: 20, fontWeight: 700 }}>{label}</span>
      <span style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{value}</span>
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{ padding: '6px 18px', borderRadius: 11, background: `${color}18`, color, border: `1px solid ${color}44`, fontSize: 18, fontWeight: 800 }}>
      {children}
    </span>
  )
}

function ChartSection({ title, sub, icon, children }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '40px', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 34 }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: `${C.cyan}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cyan, border: `1px solid ${C.cyan}33`, boxShadow: `0 0 15px ${C.cyan}22` }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950, color: '#fff', letterSpacing: '-0.7px' }}>{title}</div>
          <div style={{ fontSize: 20, color: C.sub, marginTop: 4, fontWeight: 700 }}>{sub}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function InputGroup({ label, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label style={{ fontSize: 20, color: C.sub, fontWeight: 800 }}>{label}</label>
      <input 
        type="text" 
        placeholder={placeholder} 
        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 22px', color: '#fff', fontSize: 22, outline: 'none', boxSizing: 'border-box', fontWeight: 700 }} 
      />
    </div>
  )
}

function CheckItem({ label }) {
  const [checked, setChecked] = useState(false)
  return (
    <div onClick={() => setChecked(!checked)} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px', background: checked ? `${C.cyan}11` : 'rgba(255,255,255,0.03)', border: `1px solid ${checked ? C.cyan : C.border}`, borderRadius: 22, cursor: 'pointer', transition: '0.2s', boxShadow: checked ? `0 0 15px ${C.cyan}22` : 'none' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, border: `2.5px solid ${checked ? C.cyan : C.sub}`, background: checked ? C.cyan : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {checked && <CheckCircle2 size={18} color="#000" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: checked ? '#fff' : C.sub }}>{label}</span>
    </div>
  )
}

function StatusOption({ color, label, desc, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '25px', background: active ? `${color}18` : 'rgba(255,255,255,0.02)', border: `2px solid ${active ? color : 'transparent'}`, borderRadius: 22, cursor: 'pointer', transition: '0.2s', boxShadow: active ? `0 0 20px ${color}33` : 'none' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
      <div>
        <div style={{ fontSize: 22, fontWeight: 950, color: active ? '#fff' : C.sub }}>{label}</div>
        <div style={{ fontSize: 18, color: active ? '#cbd5e1' : C.dim, marginTop: 4, fontWeight: 700 }}>{desc}</div>
      </div>
      {active && <CheckCircle2 size={28} style={{ marginLeft: 'auto', color }} />}
    </div>
  )
}
