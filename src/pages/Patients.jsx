import { useState } from 'react'
import { Search, Heart, Thermometer, Activity, ChevronRight, Phone, FileText, User, AlertCircle, Clock, ShieldCheck } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'

const PATIENTS = [
  {
    id: 1, name: '강바다', age: 58, role: '선장 (Captain)', blood: 'O+', risk: 'high',
    bp: '158/98', hr: 92, temp: 37.2, spo2: 94, weight: 82, height: 172,
    conditions: ['만성 고혈압', '협심증 의증'],
    history: [
      { date: '2026-04-10', type: '응급', note: '야간 당직 중 흉통 호소, 니트로글리세린 투여' },
      { date: '2026-03-15', type: '검진', note: '혈압 관리 주의 권고' },
    ],
    trend: [ { d: '월', hr: 88 }, { d: '화', hr: 92 }, { d: '수', hr: 95 }, { d: '목', hr: 90 }, { d: '금', hr: 94 }, { d: '토', hr: 92 }, { d: '일', hr: 92 } ],
    radar: [ { sub: '심박', val: 50 }, { sub: '혈압', val: 30 }, { sub: '체온', val: 80 }, { sub: '산소', val: 60 }, { sub: 'BMI', val: 40 } ],
  },
  {
    id: 2, name: '이해무', age: 45, role: '기관장 (Chief Engineer)', blood: 'A+', risk: 'medium',
    bp: '135/85', hr: 78, temp: 38.5, spo2: 97, weight: 78, height: 176,
    conditions: ['열성 질환', '탈수 증상'],
    history: [
      { date: '2026-04-12', type: '내과', note: '기관실 고온 작업 후 발열 및 오한 발생' },
    ],
    trend: [ { d: '월', hr: 72 }, { d: '화', hr: 75 }, { d: '수', hr: 82 }, { d: '목', hr: 85 }, { d: '금', hr: 80 }, { d: '토', hr: 78 }, { d: '일', hr: 78 } ],
    radar: [ { sub: '심박', val: 75 }, { sub: '혈압', val: 65 }, { sub: '체온', val: 40 }, { sub: '산소', val: 95 }, { sub: 'BMI', val: 70 } ],
  },
  {
    id: 3, name: '박선교', age: 32, role: '1등 항해사 (1st Officer)', blood: 'B-', risk: 'low',
    bp: '118/72', hr: 64, temp: 36.5, spo2: 99, weight: 70, height: 180,
    conditions: ['정상', '피로 누적'],
    history: [
      { date: '2026-04-01', type: '일반', note: '수면 부족으로 인한 가벼운 어지럼증' },
    ],
    trend: [ { d: '월', hr: 62 }, { d: '화', hr: 65 }, { d: '수', hr: 64 }, { d: '목', hr: 68 }, { d: '금', hr: 66 }, { d: '토', hr: 64 }, { d: '일', hr: 64 } ],
    radar: [ { sub: '심박', val: 90 }, { sub: '혈압', val: 95 }, { sub: '체온', val: 98 }, { sub: '산소', val: 99 }, { sub: 'BMI', val: 85 } ],
  },
  {
    id: 4, name: '최파도', age: 29, role: '갑판원 (Deckhand)', blood: 'AB+', risk: 'high',
    bp: '110/70', hr: 105, temp: 35.2, spo2: 92, weight: 75, height: 174,
    conditions: ['저체온증', '골절 의심'],
    history: [
      { date: '2026-04-14', type: '응급', note: '작업 중 해상 추락 후 구조, 저체온증 집중 관리' },
    ],
    trend: [ { d: '월', hr: 70 }, { d: '화', hr: 72 }, { d: '수', hr: 75 }, { d: '목', hr: 110 }, { d: '금', hr: 105 }, { d: '토', hr: 105 }, { d: '일', hr: 105 } ],
    radar: [ { sub: '심박', val: 40 }, { sub: '혈압', val: 80 }, { sub: '체온', val: 20 }, { sub: '산소', val: 50 }, { sub: 'BMI', val: 80 } ],
  },
  {
    id: 5, name: '정항구', age: 50, role: '조리장 (Chief Cook)', blood: 'O-', risk: 'medium',
    bp: '142/90', hr: 82, temp: 36.8, spo2: 96, weight: 85, height: 168,
    conditions: ['당뇨 관리', '화상 흔적'],
    history: [
      { date: '2026-03-20', type: '정기', note: '공복 혈당 수치 조절 필요' },
    ],
    trend: [ { d: '월', hr: 80 }, { d: '화', hr: 82 }, { d: '수', hr: 85 }, { d: '목', hr: 82 }, { d: '금', hr: 84 }, { d: '토', hr: 82 }, { d: '일', hr: 82 } ],
    radar: [ { sub: '심박', val: 70 }, { sub: '혈압', val: 50 }, { sub: '체온', val: 90 }, { sub: '산소', val: 92 }, { sub: 'BMI', val: 30 } ],
  },
  {
    id: 6, name: '한나침', age: 35, role: '통신사 (Radio Officer)', blood: 'A-', risk: 'low',
    bp: '120/80', hr: 70, temp: 36.6, spo2: 98, weight: 65, height: 170,
    conditions: ['정상', '안구 건조'],
    history: [
      { date: '2026-02-28', type: '일반', note: 'VHF 장비 작업 중 시력 보호 장구 착용 권고' },
    ],
    trend: [ { d: '월', hr: 68 }, { d: '화', hr: 70 }, { d: '수', hr: 72 }, { d: '목', hr: 70 }, { d: '금', hr: 70 }, { d: '토', hr: 70 }, { d: '일', hr: 70 } ],
    radar: [ { sub: '심박', val: 95 }, { sub: '혈압', val: 90 }, { sub: '체온', val: 96 }, { sub: '산소', val: 98 }, { sub: 'BMI', val: 90 } ],
  },
  {
    id: 7, name: '고닻별', age: 41, role: '갑판장 (Boatswain)', blood: 'B+', risk: 'medium',
    bp: '130/85', hr: 75, temp: 36.7, spo2: 97, weight: 80, height: 177,
    conditions: ['허리 디스크', '근육통'],
    history: [
      { date: '2026-04-05', type: '정형', note: '중량물 이동 작업 중 요부 염좌 발생' },
    ],
    trend: [ { d: '월', hr: 72 }, { d: '화', hr: 74 }, { d: '수', hr: 78 }, { d: '목', hr: 75 }, { d: '금', hr: 76 }, { d: '토', hr: 75 }, { d: '일', hr: 75 } ],
    radar: [ { sub: '심박', val: 80 }, { sub: '혈압', val: 70 }, { sub: '체온', val: 92 }, { sub: '산소', val: 95 }, { sub: 'BMI', val: 60 } ],
  },
  {
    id: 8, name: '윤등대', age: 27, role: '3등 기사 (3rd Engineer)', blood: 'O+', risk: 'low',
    bp: '115/75', hr: 68, temp: 36.4, spo2: 99, weight: 72, height: 182,
    conditions: ['정상'],
    history: [
      { date: '2026-01-10', type: '일반', note: '승선 전 신체검사 결과 전반적 양호' },
    ],
    trend: [ { d: '월', hr: 65 }, { d: '화', hr: 68 }, { d: '수', hr: 67 }, { d: '목', hr: 69 }, { d: '금', hr: 68 }, { d: '토', hr: 68 }, { d: '일', hr: 68 } ],
    radar: [ { sub: '심박', val: 92 }, { sub: '혈압', val: 95 }, { sub: '체온', val: 96 }, { sub: '산소', val: 99 }, { sub: 'BMI', val: 88 } ],
  },
  {
    id: 9, name: '심항해', age: 48, role: '일등기사 (1st Engineer)', blood: 'AB-', risk: 'medium',
    bp: '138/88', hr: 85, temp: 37.0, spo2: 95, weight: 84, height: 175,
    conditions: ['청력 저하', '고지혈증'],
    history: [
      { date: '2026-03-05', type: '검진', note: '엔진룸 소음으로 인한 초기 소음성 난청 의심' },
    ],
    trend: [ { d: '월', hr: 80 }, { d: '화', hr: 85 }, { d: '수', hr: 88 }, { d: '목', hr: 84 }, { d: '금', hr: 85 }, { d: '토', hr: 85 }, { d: '일', hr: 85 } ],
    radar: [ { sub: '심박', val: 70 }, { sub: '혈압', val: 60 }, { sub: '체온', val: 85 }, { sub: '산소', val: 88 }, { sub: 'BMI', val: 50 } ],
  },
]

const RISK_COLOR = { low: '#26de81', medium: '#ff9f43', high: '#ff4d6d' }
const RISK_BG = { low: 'rgba(38,222,129,0.1)', medium: 'rgba(255,159,67,0.1)', high: 'rgba(255,77,109,0.1)' }

export default function Patients() {
  const [selected, setSelected] = useState(PATIENTS[0])
  const [query, setQuery] = useState('')

  const filtered = PATIENTS.filter(p =>
    p.name.includes(query) || p.role.includes(query)
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', height: 'calc(100vh - 72px)', background: '#020617', color: '#f1f5f9', overflow: 'hidden' }}>
      
      {/* ── 좌측 환자 리스트 영역 ── */}
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#05070a' }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 950, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity color="#0dd9c5" size={32} /> 선원 환자 차트
          </h1>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={20} />
            <input
              placeholder="환자 이름 또는 직책 검색..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 52px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, color: '#fff', fontSize: 16, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(p => {
            const active = selected?.id === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  padding: '20px', borderRadius: 20, textAlign: 'left', cursor: 'pointer', transition: '0.2s',
                  background: active ? 'rgba(13,217,197,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${active ? '#0dd9c5' : 'transparent'}`,
                  boxShadow: active ? '0 8px 24px rgba(13,217,197,0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 18, flexShrink: 0,
                    background: `linear-gradient(135deg, ${RISK_COLOR[p.risk]}22, ${RISK_COLOR[p.risk]}11)`,
                    border: `1px solid ${RISK_COLOR[p.risk]}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User color={RISK_COLOR[p.risk]} size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{p.name}</span>
                      <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 8, background: RISK_BG[p.risk], color: RISK_COLOR[p.risk], fontWeight: 900 }}>{p.risk.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>{p.age}세 · {p.role}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 우측 환자 상세 차트 영역 ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
        {selected && (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* 상단 헤더 프로필 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 32, padding: '40px', display: 'flex', gap: 40, alignItems: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: '100%', background: RISK_COLOR[selected.risk] }} />
              <div style={{ width: 120, height: 120, borderRadius: 32, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={64} color={RISK_COLOR[selected.risk]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 42, fontWeight: 950, letterSpacing: '-1px' }}>{selected.name}</h2>
                  <span style={{ fontSize: 16, padding: '6px 18px', borderRadius: 12, background: RISK_BG[selected.risk], color: RISK_COLOR[selected.risk], fontWeight: 900 }}>{selected.risk.toUpperCase()} LEVEL</span>
                </div>
                <div style={{ display: 'flex', gap: 32, fontSize: 18, color: '#94a3b8', fontWeight: 600 }}>
                  <span>직책 : {selected.role}</span>
                  <span>나이 : {selected.age}세</span>
                  <span>혈액형 : {selected.blood}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {selected.conditions.map(c => (
                    <div key={c} style={{ padding: '6px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>#{c}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button style={{ padding: '16px 32px', borderRadius: 16, background: '#0dd9c5', color: '#05070a', border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}><Phone size={18} /> 원격진료 연결</button>
                <button style={{ padding: '16px 32px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={18} /> 진료 기록 추가</button>
              </div>
            </div>

            {/* 바이탈 & 분석 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              
              {/* 실시간 바이탈 현황 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#0dd9c5' }}>CURRENT VITAL STATUS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <VitalCard label="혈압 (BP)" value={selected.bp} unit="mmHg" icon={<Activity size={18} />} color="#ff9f43" />
                  <VitalCard label="심박수 (HR)" value={selected.hr} unit="bpm" icon={<Heart size={18} />} color="#ff4d6d" />
                  <VitalCard label="체온 (BT)" value={selected.temp} unit="°C" icon={<Thermometer size={18} />} color="#4fc3f7" />
                  <VitalCard label="산소포화도" value={selected.spo2} unit="%" icon={<ShieldCheck size={18} />} color="#26de81" />
                </div>
              </div>

              {/* 건강 지수 레이더 차트 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#0dd9c5' }}>HEALTH INDEX ANALYSIS</h3>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={selected.radar}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="sub" tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }} />
                      <Radar dataKey="val" stroke={RISK_COLOR[selected.risk]} fill={RISK_COLOR[selected.risk]} fillOpacity={0.2} strokeWidth={3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 트렌드 & 히스토리 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
              
              {/* 심박수 추이 차트 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#0dd9c5' }}>HEART RATE TREND (WEEKLY)</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selected.trend}>
                      <defs>
                        <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={RISK_COLOR[selected.risk]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={RISK_COLOR[selected.risk]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 14 }} dy={10} />
                      <YAxis stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 14 }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                      <Area type="monotone" dataKey="hr" stroke={RISK_COLOR[selected.risk]} strokeWidth={4} fillOpacity={1} fill="url(#colorHr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 최근 진료 기록 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: 32, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: '#0dd9c5' }}>MEDICAL HISTORY</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
                  {selected.history.map((h, i) => (
                    <div key={i} style={{ padding: '20px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: h.type === '응급' ? '#ff4d6d' : '#e2e8f0' }}>{h.type} 기록</span>
                        <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14}/> {h.date}</span>
                      </div>
                      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

function VitalCard({ label, value, unit, icon, color }) {
  return (
    <div style={{ padding: '20px', borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
        <div style={{ color }}>{icon}</div> {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 950, color: '#fff' }}>{value}</span>
        <span style={{ fontSize: 16, color: '#475569', fontWeight: 700 }}>{unit}</span>
      </div>
    </div>
  )
}
