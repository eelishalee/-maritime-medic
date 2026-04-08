import { useState } from 'react'
import { Search, Filter, Heart, Thermometer, Activity, ChevronRight, Phone, FileText } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const PATIENTS = [
  {
    id: 1, name: '박성재', age: 42, role: '기관사', blood: 'A+', risk: 'low',
    bp: '118/76', hr: 72, temp: 36.5, spo2: 98, weight: 74, height: 175,
    conditions: ['정상'],
    history: [
      { date: '2026-04-01', type: '정기검진', note: '정상' },
      { date: '2026-03-15', type: '두통', note: '타이레놀 처방' },
    ],
    trend: [
      { d: '월', hr: 70 }, { d: '화', hr: 72 }, { d: '수', hr: 69 }, { d: '목', hr: 74 },
      { d: '금', hr: 71 }, { d: '토', hr: 73 }, { d: '일', hr: 72 },
    ],
    radar: [
      { sub: '심박', val: 85 }, { sub: '혈압', val: 90 }, { sub: '체온', val: 95 },
      { sub: '산소포화도', val: 98 }, { sub: '체질량', val: 80 },
    ],
  },
  {
    id: 2, name: '이민준', age: 55, role: '항해사', blood: 'B+', risk: 'medium',
    bp: '138/88', hr: 89, temp: 37.2, spo2: 96, weight: 82, height: 172,
    conditions: ['고혈압 주의'],
    history: [
      { date: '2026-04-05', type: '고혈압 모니터링', note: '혈압약 복용 중' },
      { date: '2026-03-20', type: '두근거림', note: '심전도 측정 정상' },
    ],
    trend: [
      { d: '월', hr: 85 }, { d: '화', hr: 90 }, { d: '수', hr: 88 }, { d: '목', hr: 92 },
      { d: '금', hr: 87 }, { d: '토', hr: 91 }, { d: '일', hr: 89 },
    ],
    radar: [
      { sub: '심박', val: 65 }, { sub: '혈압', val: 55 }, { sub: '체온', val: 80 },
      { sub: '산소포화도', val: 90 }, { sub: '체질량', val: 72 },
    ],
  },
  {
    id: 3, name: '최동현', age: 38, role: '갑판원', blood: 'O+', risk: 'low',
    bp: '120/78', hr: 68, temp: 36.7, spo2: 99, weight: 70, height: 178,
    conditions: ['정상'],
    history: [
      { date: '2026-03-28', type: '찰과상', note: '드레싱 처치' },
    ],
    trend: [
      { d: '월', hr: 66 }, { d: '화', hr: 68 }, { d: '수', hr: 65 }, { d: '목', hr: 70 },
      { d: '금', hr: 67 }, { d: '토', hr: 69 }, { d: '일', hr: 68 },
    ],
    radar: [
      { sub: '심박', val: 92 }, { sub: '혈압', val: 88 }, { sub: '체온', val: 95 },
      { sub: '산소포화도', val: 99 }, { sub: '체질량', val: 85 },
    ],
  },
  {
    id: 4, name: '김태호', age: 61, role: '선장', blood: 'AB-', risk: 'high',
    bp: '158/95', hr: 96, temp: 38.1, spo2: 94, weight: 88, height: 170,
    conditions: ['고혈압', '발열'],
    history: [
      { date: '2026-04-07', type: '고열 응급', note: '해열제 투여, 원격 진료 연결 중' },
      { date: '2026-04-01', type: '정기검진', note: '고혈압 지속' },
    ],
    trend: [
      { d: '월', hr: 88 }, { d: '화', hr: 91 }, { d: '수', hr: 93 }, { d: '목', hr: 95 },
      { d: '금', hr: 92 }, { d: '토', hr: 98 }, { d: '일', hr: 96 },
    ],
    radar: [
      { sub: '심박', val: 40 }, { sub: '혈압', val: 35 }, { sub: '체온', val: 45 },
      { sub: '산소포화도', val: 60 }, { sub: '체질량', val: 50 },
    ],
  },
]

const RISK_COLOR = { low: 'var(--green-400)', medium: 'var(--orange-400)', high: 'var(--red-400)' }
const RISK_LABEL = { low: '정상', medium: '주의', high: '위험' }

export default function Patients() {
  const [selected, setSelected] = useState(PATIENTS[3])
  const [query, setQuery] = useState('')

  const filtered = PATIENTS.filter(p =>
    p.name.includes(query) || p.role.includes(query)
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: '100%' }} className="fade-in">
      {/* Patient list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--navy-800)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 12px',
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            placeholder="이름, 직책 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, width: '100%' }}
          />
        </div>
        {filtered.map(p => {
          const active = selected?.id === p.id
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                background: active ? 'rgba(13,217,197,0.08)' : 'var(--card-bg)',
                border: `1px solid ${active ? 'var(--teal-400)' : 'var(--border)'}`,
                borderRadius: 10, padding: '12px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${RISK_COLOR[p.risk]}44, ${RISK_COLOR[p.risk]}22)`,
                  border: `2px solid ${RISK_COLOR[p.risk]}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: RISK_COLOR[p.risk],
                }}>{p.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.age}세 · {p.role}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                  color: RISK_COLOR[p.risk],
                  background: `${RISK_COLOR[p.risk]}18`,
                }}>{RISK_LABEL[p.risk]}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <Stat label="혈압" value={p.bp} />
                <Stat label="심박" value={`${p.hr}bpm`} />
                <Stat label="체온" value={`${p.temp}°`} alert={p.temp >= 38} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Patient detail */}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          {/* Profile header */}
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 18,
            display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${RISK_COLOR[selected.risk]}, transparent)`,
            }} />
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `linear-gradient(135deg, ${RISK_COLOR[selected.risk]}55, ${RISK_COLOR[selected.risk]}22)`,
              border: `2px solid ${RISK_COLOR[selected.risk]}88`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: RISK_COLOR[selected.risk],
            }}>{selected.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selected.age}세 · {selected.role} · 혈액형 {selected.blood}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {selected.conditions.map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 5,
                    background: `${RISK_COLOR[selected.risk]}18`, color: RISK_COLOR[selected.risk], fontWeight: 600,
                  }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ActionBtn icon={<Phone size={14} />} label="원격 진료" color="var(--teal-400)" />
              <ActionBtn icon={<FileText size={14} />} label="기록 추가" color="var(--blue-400)" />
            </div>
          </div>

          {/* Vitals + chart row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Vitals */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>현재 바이탈 수치</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <VitalBox label="혈압" value={selected.bp} unit="mmHg" color="var(--orange-400)" alert={parseInt(selected.bp) > 140} />
                <VitalBox label="심박수" value={selected.hr} unit="bpm" color="var(--red-400)" alert={selected.hr > 90} />
                <VitalBox label="체온" value={`${selected.temp}`} unit="°C" color="var(--blue-400)" alert={selected.temp >= 38} />
                <VitalBox label="산소포화도" value={selected.spo2} unit="%" color="var(--teal-400)" alert={selected.spo2 < 95} />
              </div>
            </div>

            {/* Radar */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>건강 종합 지수</div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={selected.radar}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="sub" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Radar dataKey="val" stroke={RISK_COLOR[selected.risk]} fill={RISK_COLOR[selected.risk]} fillOpacity={0.18} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend + history */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
            {/* Trend */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>심박수 주간 추이</div>
              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={selected.trend}>
                  <XAxis dataKey="d" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 105]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="hr" stroke={RISK_COLOR[selected.risk]} strokeWidth={2.5} dot={{ r: 3, fill: RISK_COLOR[selected.risk] }} name="심박수" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* History */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>진료 기록</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selected.history.map((h, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{h.type}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{h.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, alert }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: alert ? 'var(--red-400)' : 'var(--text-secondary)' }}>{value}</div>
    </div>
  )
}

function VitalBox({ label, value, unit, color, alert }) {
  return (
    <div style={{
      padding: '12px', borderRadius: 8,
      background: alert ? `${color}12` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${alert ? color + '44' : 'var(--border)'}`,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: alert ? color : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{unit}</div>
      {alert && <div style={{ fontSize: 10, color, marginTop: 4, fontWeight: 600 }}>⚠ 주의 필요</div>}
    </div>
  )
}

function ActionBtn({ icon, label, color }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
      color, fontSize: 12, fontWeight: 600,
    }}>{icon}{label}</button>
  )
}
