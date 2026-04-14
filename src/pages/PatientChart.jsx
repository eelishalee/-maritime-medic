import { useState } from 'react'
import { Plus, Activity, Heart, Thermometer, Droplets } from 'lucide-react'

const PATIENT = {
  name: '김선장', age: 58, gender: '남', blood: 'A+', role: '선장',
  id: 'S2026-026', dob: '1968-05-14', height: 172, weight: 78, bmi: '26.4', employedSince: '2015-03',
  address: '부산시 해운대구', contact: '010-1001-0026', emergency_contact: '박부인 (배우자) 010-2001-0026',
  allergies: ['아스피린 (과거 부작용)', '땅콩 알레르기'], 
  bloodPressure: '142/88', heartRate: 84, temp: 37.6, spo2: 95, rr: 18,
  chronic: ['고혈압 (2020년 진단)', '고지혈증 (2022년 진단)'],
  medications: [
    { name: '암로디핀 5mg', dose: '1정 1일 1회', purpose: '고혈압 관리' },
    { name: '아토르바스타틴 10mg', dose: '1정 1일 1회', purpose: '고지혈증 관리' },
  ],
}

export default function PatientChart() {
  return (
    <div style={{ padding: '0', height: 'calc(100vh - 46px)', overflow: 'auto', background: '#050d1a' }}>
      {/* 상단 바이탈 바 (폰트 15% 확대) */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1.5px solid rgba(13,217,197,0.15)', padding: '18px 30px', display: 'flex', alignItems: 'center', gap: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff' }}>김</div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, color: '#fff' }}>{PATIENT.name} <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{PATIENT.id}</span></div>
            <div style={{ fontSize: 15, color: '#8da2c0' }}>{PATIENT.age}세 · {PATIENT.role} · {PATIENT.blood}형</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginLeft: 'auto' }}>
          <VitalBadge label="혈압" value={PATIENT.bloodPressure} unit="mmHg" alert icon={<Activity size={14}/>} />
          <VitalBadge label="심박수" value={PATIENT.heartRate} unit="bpm" icon={<Heart size={14}/>} />
          <VitalBadge label="체온" value={PATIENT.temp} unit="°C" alert icon={<Thermometer size={14}/>} />
          <VitalBadge label="산소포화도" value={PATIENT.spo2} unit="%" alert icon={<Droplets size={14}/>} />
        </div>
      </div>

      <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 24 }}>
        {/* 기본 인적사항 */}
        <ChartSection title="기본 인적사항">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <InfoItem label="생년월일" value={PATIENT.dob} />
            <InfoItem label="신장/체중" value={`${PATIENT.height}cm / ${PATIENT.weight}kg`} />
            <InfoItem label="BMI" value={PATIENT.bmi} />
            <InfoItem label="연락처" value={PATIENT.contact} />
            <InfoItem label="비상연락처" value={PATIENT.emergency_contact} span={2} />
            <InfoItem label="주소" value={PATIENT.address} span={2} />
          </div>
        </ChartSection>

        {/* 보유 질환 및 알레르기 */}
        <ChartSection title="보유 질환 및 알레르기">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontWeight: 700 }}>⚠️ 보유 질환</div>
            {PATIENT.chronic.map((c, i) => (
              <div key={i} style={{ fontSize: 17, color: '#fff', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,159,67,0.1)', border: '1px solid rgba(255,159,67,0.3)', marginBottom: 8 }}>{c}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontWeight: 700 }}>🚫 알레르기</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PATIENT.allergies.map((a, i) => (
                <span key={i} style={{ fontSize: 16, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,77,109,0.15)', color: '#ff4d6d', border: '1px solid rgba(255,77,109,0.3)', fontWeight: 600 }}>{a}</span>
              ))}
            </div>
          </div>
        </ChartSection>

        {/* 복용 약물 */}
        <ChartSection title="복용 중인 약물">
          {PATIENT.medications.map((m, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(13,217,197,0.15)', marginBottom: 12 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0dd9c5' }}>{m.name}</div>
              <div style={{ fontSize: 16, color: '#fff', marginTop: 5 }}>{m.dose}</div>
              <div style={{ fontSize: 15, color: '#8da2c0', marginTop: 3 }}>{m.purpose}</div>
            </div>
          ))}
        </ChartSection>
      </div>
    </div>
  )
}

function VitalBadge({ label, value, unit, alert, icon }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 12, background: alert ? 'rgba(255,77,109,0.1)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${alert ? 'rgba(255,77,109,0.3)' : 'rgba(13,217,197,0.15)'}`, textAlign: 'center', minWidth: 105 }}>
      <div style={{ fontSize: 13, color: '#8da2c0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: alert ? '#ff4d6d' : '#fff' }}>{value}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 2 }}>{unit}</span></div>
    </div>
  )
}

function ChartSection({ title, children }) {
  return (
    <div style={{ background: 'rgba(15,32,64,0.6)', border: '1.5px solid rgba(13,217,197,0.15)', borderRadius: 20, padding: '24px' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#0dd9c5', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(13,217,197,0.15)', textTransform: 'uppercase' }}>{title}</div>
      {children}
    </div>
  )
}

function InfoItem({ label, value, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}`, paddingBottom: 15 }}>
      <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 21, color: '#fff', fontWeight: 700 }}>{value}</div>
    </div>
  )
}
