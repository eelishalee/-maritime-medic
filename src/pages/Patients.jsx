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
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, height: 'calc(100vh - 72px)', padding: '24px', overflow: 'hidden', background: '#050d1a' }} className="fade-in">
      {/* Patient list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--navy-800)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 16px', flexShrink: 0
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            placeholder="이름, 직책 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 16, width: '100%' }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
          {filtered.map(p => {
            const active = selected?.id === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  background: active ? 'rgba(13,217,197,0.08)' : 'var(--card-bg)',
                  border: `1.5px solid ${active ? 'var(--teal-400)' : 'var(--border)'}`,
                  borderRadius: 14, padding: '16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${RISK_COLOR[p.risk]}44, ${RISK_COLOR[p.risk]}22)`,
                    border: `2px solid ${RISK_COLOR[p.risk]}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: RISK_COLOR[p.risk],
                  }}>{p.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{p.age}세 · {p.role}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800, padding: '3px 9px', borderRadius: 6,
                    color: RISK_COLOR[p.risk],
                    background: `${RISK_COLOR[p.risk]}18`,
                  }}>{RISK_LABEL[p.risk]}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <Stat label="혈압" value={p.bp} />
                  <Stat label="심박" value={`${p.hr}bpm`} />
                  <Stat label="체온" value={`${p.temp}°`} alert={p.temp >= 38} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Patient detail */}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', paddingRight: 4 }}>
          {/* Profile header */}
          <div style={{
            background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '24px 32px',
            display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden', flexShrink: 0
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: `linear-gradient(90deg, ${RISK_COLOR[selected.risk]}, transparent)`,
            }} />
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${RISK_COLOR[selected.risk]}55, ${RISK_COLOR[selected.risk]}22)`,
              border: `2.5px solid ${RISK_COLOR[selected.risk]}88`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 900, color: RISK_COLOR[selected.risk],
            }}>{selected.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>{selected.name}</div>
              <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 4 }}>{selected.age}세 · {selected.role} · 혈액형 {selected.blood}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {selected.conditions.map(c => (
                  <span key={c} style={{
                    fontSize: 13, padding: '4px 12px', borderRadius: 8,
                    background: `${RISK_COLOR[selected.risk]}18`, color: RISK_COLOR[selected.risk], fontWeight: 700,
                  }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <ActionBtn icon={<Phone size={18} />} label="원격 진료 연결" color="var(--teal-400)" />
              <ActionBtn icon={<FileText size={18} />} label="진료 기록 추가" color="var(--blue-400)" />
            </div>
          </div>

          {/* Vitals + chart row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexShrink: 0 }}>
            <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>현재 바이탈 수치</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <VitalBox label="혈압" value={selected.bp} unit="mmHg" color="var(--orange-400)" alert={parseInt(selected.bp) > 140} />
                <VitalBox label="심박수" value={selected.hr} unit="bpm" color="var(--red-400)" alert={selected.hr > 90} />
                <VitalBox label="체온" value={`${selected.temp}`} unit="°C" color="var(--blue-400)" alert={selected.temp >= 38} />
                <VitalBox label="산소포화도" value={selected.spo2} unit="%" color="var(--teal-400)" alert={selected.spo2 < 95} />
              </div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>건강 종합 지수 분석</div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={selected.radar}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="sub" tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }} />
                  <Radar dataKey="val" stroke={RISK_COLOR[selected.risk]} fill={RISK_COLOR[selected.risk]} fillOpacity={0.2} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend + history */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
            <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>심박수 주간 모니터링 추이</div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selected.trend}>
                    <XAxis dataKey="d" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 105]} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14 }} />
                    <Line type="monotone" dataKey="hr" stroke={RISK_COLOR[selected.risk]} strokeWidth={4} dot={{ r: 5, fill: RISK_COLOR[selected.risk] }} activeDot={{ r: 8 }} name="심박수" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>최근 진료 이력 기록</div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
                {selected.history.map((h, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{h.type}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{h.date}</span>
                    </div>
                    <div style={{ fontSize: 15, color: '#8da2c0', lineHeight: 1.6 }}>{h.note}</div>
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
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: alert ? 'var(--red-400)' : 'var(--text-secondary)' }}>{value}</div>
    </div>
  )
}

function VitalBox({ label, value, unit, color, alert }) {
  return (
    <div style={{ padding: '18px', borderRadius: 14, background: alert ? `${color}12` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${alert ? color + '55' : 'var(--border)'}` }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: alert ? color : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{unit}</div>
      {alert && <div style={{ fontSize: 12, color, marginTop: 8, fontWeight: 800 }}>⚠ 긴급 모니터링 필요</div>}
    </div>
  )
}

function ActionBtn({ icon, label, color }) {
  return (
    <button style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${color}18`, border: `1.5px solid ${color}55`, borderRadius: 12, padding: '12px 20px', cursor: 'pointer', color, fontSize: 15, fontWeight: 800, transition: 'all 0.2s' }}>{icon}{label}</button>
  )
}
