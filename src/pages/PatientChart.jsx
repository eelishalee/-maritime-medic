import { useState } from 'react'
import { Plus, Edit2, Save, ChevronDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const PATIENT = {
  name: '김태호', age: 61, gender: '남', blood: 'AB-', role: '선장',
  dob: '1965-03-12', height: 170, weight: 88, bmi: '30.4', employedSince: '2010-05',
  address: '부산시 중구', contact: '010-1234-5678', emergency_contact: '김영희 (배우자) 010-9876-5432',
  allergies: ['페니실린', '아스피린(과거 부작용)'], bloodPressure: '142/88', heartRate: 84, temp: 37.6,
  spo2: 95, respiratoryRate: 18,
  chronic: ['고혈압 (2019년 진단)', '고지혈증 (2021년 진단)'],
  medications: [
    { name: '암로디핀 5mg', dose: '1정 1일 1회', purpose: '고혈압' },
    { name: '로수바스타틴 10mg', dose: '1정 1일 1회', purpose: '고지혈증' },
  ],
  pastSurgeries: ['맹장 수술 (2001년)', '무릎 관절경 (2015년)'],
  familyHistory: ['부: 심근경색', '모: 고혈압'],
}

const VITALS_LOG = [
  { t: '09:00', bp_sys: 158, bp_dia: 95, hr: 96, temp: 38.1, spo2: 94 },
  { t: '09:30', bp_sys: 150, bp_dia: 92, hr: 91, temp: 37.9, spo2: 94 },
  { t: '10:00', bp_sys: 145, bp_dia: 90, hr: 88, temp: 37.8, spo2: 95 },
  { t: '10:30', bp_sys: 142, bp_dia: 88, hr: 84, temp: 37.6, spo2: 95 },
  { t: '11:00', bp_sys: 140, bp_dia: 86, hr: 82, temp: 37.4, spo2: 96 },
]

const PRESCRIPTIONS = [
  { date: '2026-04-07', med: '아스피린 300mg', dose: '1정 즉시 복용', by: '김선의 / 원격 박준혁', reason: '심근경색 의심 응급' },
  { date: '2026-04-07', med: '니트로글리세린 0.4mg', dose: '설하 투여', by: '원격 박준혁', reason: '흉통 완화' },
  { date: '2026-04-01', med: '암로디핀 5mg', dose: '1정 1일 1회', by: '김선의', reason: '고혈압 지속 관리' },
]

const NOTES = [
  { date: '2026-04-07 09:14', note: '흉통, 호흡곤란, 발한 호소. 심전도 이상 감지. 즉각 응급 대응 개시.', by: '김선의' },
  { date: '2026-04-07 09:25', note: '원격 의사 연결 완료. 심근경색 가능성 높음. MONA 프로토콜 시행 중.', by: '원격 박준혁' },
  { date: '2026-04-07 11:00', note: '약물 투여 후 흉통 호전. 활력징후 안정화 추세. 모니터링 지속.', by: '김선의' },
]

export default function PatientChart() {
  const [addingNote, setAddingNote] = useState(false)
  const [noteText, setNoteText] = useState('')

  return (
    <div style={{ padding: '0', height: 'calc(100vh - 46px)', overflow: 'auto' }}>
      {/* Patient header bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--navy-950)', borderBottom: '1px solid var(--border)',
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,77,109,0.15)', border: '2px solid rgba(255,77,109,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'var(--red-400)',
          }}>김</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {PATIENT.name}
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 10 }}>
                {PATIENT.age}세 · {PATIENT.gender} · {PATIENT.role}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>혈액형 {PATIENT.blood} · 생년 {PATIENT.dob}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {[
            { label: 'BP', value: PATIENT.bloodPressure, alert: true },
            { label: 'HR', value: `${PATIENT.heartRate}`, alert: false },
            { label: 'BT', value: `${PATIENT.temp}°`, alert: true },
            { label: 'SpO₂', value: `${PATIENT.spo2}%`, alert: true },
          ].map(v => (
            <div key={v.label} style={{
              padding: '4px 10px', borderRadius: 6,
              background: v.alert ? 'rgba(255,77,109,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${v.alert ? 'rgba(255,77,109,0.35)' : 'var(--border)'}`,
            }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{v.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: v.alert ? 'var(--red-400)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{v.value}</div>
            </div>
          ))}
          <button style={{
            padding: '0 14px', background: 'rgba(13,217,197,0.1)', border: '1px solid rgba(13,217,197,0.3)',
            borderRadius: 8, cursor: 'pointer', color: 'var(--teal-400)', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}><Plus size={13} />정보 추가</button>
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Row 1: Basic + Conditions + Medications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14 }}>
          {/* Basic info */}
          <ChartSection title="기본 인적사항">
            <InfoGrid items={[
              ['이름', PATIENT.name], ['나이', `${PATIENT.age}세`], ['성별', PATIENT.gender],
              ['생년월일', PATIENT.dob], ['키', `${PATIENT.height}cm`], ['체중', `${PATIENT.weight}kg`],
              ['BMI', PATIENT.bmi], ['혈액형', PATIENT.blood], ['직책', PATIENT.role],
              ['근무 시작', PATIENT.employedSince], ['연락처', PATIENT.contact],
            ]} />
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>비상 연락처</div>
              <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{PATIENT.emergency_contact}</div>
            </div>
          </ChartSection>

          {/* Chronic conditions */}
          <ChartSection title="기저질환 · 알러지">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>기저질환</div>
              {PATIENT.chronic.map((c, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 6, background: 'rgba(255,159,67,0.08)', border: '1px solid rgba(255,159,67,0.2)', marginBottom: 5 }}>
                  {c}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>알러지</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PATIENT.allergies.map((a, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: 'rgba(255,77,109,0.1)', color: 'var(--red-400)', border: '1px solid rgba(255,77,109,0.25)' }}>{a}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>가족력</div>
              {PATIENT.familyHistory.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>• {f}</div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>과거 수술</div>
              {PATIENT.pastSurgeries.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>• {s}</div>
              ))}
            </div>
          </ChartSection>

          {/* Medications */}
          <ChartSection title="복용 중인 약물">
            {PATIENT.medications.map((m, i) => (
              <div key={i} style={{ padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--teal-400)', marginTop: 3 }}>{m.dose}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.purpose}</div>
              </div>
            ))}
            <button style={{
              width: '100%', padding: '7px', borderRadius: 7, border: '1px dashed var(--border)',
              background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}><Plus size={11} />약물 추가</button>
          </ChartSection>
        </div>

        {/* Row 2: Vitals chart + Prescriptions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          {/* Vitals log chart */}
          <ChartSection title="바이탈 측정 이력 (금일)">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['시간', '수축기 BP', '이완기 BP', '심박수', '체온', 'SpO₂'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VITALS_LOG.map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(13,217,197,0.05)' }}>
                      <td style={{ padding: '8px', fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{v.t}</td>
                      <td style={{ padding: '8px', fontSize: 12, color: v.bp_sys > 140 ? 'var(--red-400)' : 'var(--text-primary)', fontWeight: v.bp_sys > 140 ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}>{v.bp_sys}</td>
                      <td style={{ padding: '8px', fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{v.bp_dia}</td>
                      <td style={{ padding: '8px', fontSize: 12, color: v.hr > 90 ? 'var(--orange-400)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{v.hr}</td>
                      <td style={{ padding: '8px', fontSize: 12, color: v.temp >= 38 ? 'var(--orange-400)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{v.temp}</td>
                      <td style={{ padding: '8px', fontSize: 12, color: v.spo2 < 95 ? 'var(--orange-400)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{v.spo2}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={VITALS_LOG}>
                  <XAxis dataKey="t" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 165]} hide />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 10 }} />
                  <Line type="monotone" dataKey="bp_sys" stroke="var(--red-400)" strokeWidth={2} dot={false} name="수축기BP" />
                  <Line type="monotone" dataKey="hr" stroke="var(--orange-400)" strokeWidth={2} dot={false} name="심박수" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          {/* Prescriptions */}
          <ChartSection title="처방 이력">
            {PRESCRIPTIONS.map((p, i) => (
              <div key={i} style={{ padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{p.med}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.date}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--teal-400)', marginTop: 3 }}>{p.dose}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.reason}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>처방: {p.by}</div>
              </div>
            ))}
            <button style={{
              width: '100%', padding: '7px', borderRadius: 7, border: '1px dashed var(--border)',
              background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}><Plus size={11} />처방 추가</button>
          </ChartSection>
        </div>

        {/* Row 3: Clinical notes */}
        <ChartSection title="의무기록 · 임상 노트">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {NOTES.map((n, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', gap: 14 }}>
                <div style={{ width: 130, flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{n.date}</div>
                  <div style={{ fontSize: 10, color: 'var(--teal-400)', marginTop: 3 }}>{n.by}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.7 }}>{n.note}</div>
              </div>
            ))}
          </div>
          {addingNote ? (
            <div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="임상 소견을 입력하세요..."
                rows={3}
                style={{
                  width: '100%', background: 'var(--navy-800)', border: '1px solid var(--teal-400)',
                  borderRadius: 8, padding: '10px 12px', color: 'var(--text-primary)', fontSize: 13,
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => { setAddingNote(false); setNoteText('') }} style={{
                  flex: 1, padding: '8px', borderRadius: 7, border: '1px solid var(--border)',
                  background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12,
                }}>취소</button>
                <button style={{
                  flex: 2, padding: '8px', borderRadius: 7, border: 'none',
                  background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
                  cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}><Save size={12} />저장</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingNote(true)} style={{
              width: '100%', padding: '9px', borderRadius: 7, border: '1px dashed var(--border)',
              background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}><Plus size={12} />노트 추가</button>
          )}
        </ChartSection>
      </div>
    </div>
  )
}

function ChartSection({ title, children }) {
  return (
    <div style={{
      background: 'rgba(15,32,64,0.6)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{title}</div>
      {children}
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
      {items.map(([k, v], i) => (
        <div key={i} style={{ padding: '5px 0' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</div>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
