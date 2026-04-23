import { useState } from 'react'
import { Search, Heart, Thermometer, Activity, ChevronRight, Phone, FileText, User, AlertCircle, Clock, ShieldCheck, Weight, Ruler, HeartPulse, Wind, Brain } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
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
]

const RISK_COLOR = { low: '#00ffaa', medium: '#ffaa00', high: '#ff0055' }
const RISK_BG = { low: 'rgba(0,255,170,0.1)', medium: 'rgba(255,170,0,0.1)', high: 'rgba(255,0,85,0.1)' }

export default function Patients() {
  const [selected, setSelected] = useState(PATIENTS[0])
  const [query, setQuery] = useState('')

  const filtered = PATIENTS.filter(p =>
    p.name.includes(query) || p.role.includes(query)
  )

  return (
    <div className="cyber-bg" style={{ display: 'grid', gridTemplateColumns: '460px 1fr', height: 'calc(100vh - 86px)', background: C.bg, color: C.text, overflow: 'hidden', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* ── 좌측 환자 리스트 영역 ── */}
      <div style={{ borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', background: C.panel, backdropFilter: 'blur(10px)' }}>
        <div style={{ padding: '34px 28px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <Activity color={C.cyan} size={34} />
            <h1 style={{ fontSize: 32, fontWeight: 950, margin: 0, letterSpacing: '-1px', textShadow: `0 0 15px ${C.cyan}44` }}>선원 환자 차트</h1>
          </div>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: C.sub }} size={22} />
            <input
              placeholder="환자 검색..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '18px 18px 18px 58px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, color: '#fff', fontSize: 20, outline: 'none', transition: '0.2s' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 11, scrollbarWidth: 'none' }}>
          {filtered.map(p => {
            const active = selected?.id === p.id
            const rc = RISK_COLOR[p.risk]
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  padding: '22px', borderRadius: 22, textAlign: 'left', cursor: 'pointer', transition: '0.2s',
                  background: active ? `${C.cyan}0a` : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${active ? C.cyan : 'transparent'}`,
                  boxShadow: active ? `0 8px 25px rgba(0,0,0,0.5), 0 0 15px ${C.cyan}22` : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18, flexShrink: 0,
                    background: `${rc}11`,
                    border: `1.5px solid ${rc}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User color={rc} size={32} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 25, fontWeight: 800, color: active ? '#fff' : '#cbd5e1' }}>{p.name}</span>
                      <div style={{ width: 11, height: 11, borderRadius: '50%', background: rc, boxShadow: `0 0 12px ${rc}` }} />
                    </div>
                    <div style={{ fontSize: 18, color: C.sub, fontWeight: 700 }}>{p.role.split('(')[0]}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 우측 환자 상세 차트 영역 ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '34px', scrollbarWidth: 'none' }}>
        {selected && (
          <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* 상단 프로필 헤더 */}
            <div style={{ 
              background: C.panel, border: `1px solid ${C.border}`, 
              borderRadius: 34, padding: '34px 46px', display: 'flex', gap: 46, alignItems: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: 122, height: 122, borderRadius: 28, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${RISK_COLOR[selected.risk]}44`, boxShadow: `0 0 20px ${RISK_COLOR[selected.risk]}22` }}>
                <User size={65} color={RISK_COLOR[selected.risk]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 11 }}>
                  <h2 style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-1.5px', textShadow: `0 0 15px ${RISK_COLOR[selected.risk]}44` }}>{selected.name}</h2>
                  <span style={{ fontSize: 16, padding: '6px 18px', borderRadius: 11, background: RISK_BG[selected.risk], color: RISK_COLOR[selected.risk], fontWeight: 900, border: `1px solid ${RISK_COLOR[selected.risk]}44` }}>{selected.risk.toUpperCase()} SEVERITY</span>
                </div>
                <div style={{ display: 'flex', gap: 28, fontSize: 20, color: '#94a3b8', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Activity size={20} /> {selected.role}</div>
                  <span>나이: {selected.age}세</span>
                  <span style={{ color: C.danger }}>혈액형: {selected.blood}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Weight size={20} /> {selected.weight}kg</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Ruler size={20} /> {selected.height}cm</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 18 }}>
                <button style={{ height: 68, padding: '0 34px', borderRadius: 18, background: C.cyan, color: '#000', border: 'none', fontWeight: 950, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, boxShadow: `0 0 20px ${C.cyan}44` }}><Phone size={25} /> 원격진료</button>
                <button style={{ height: 68, padding: '0 34px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${C.border}`, fontWeight: 800, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11 }}><FileText size={25} /> 기록 작성</button>
              </div>
            </div>

            {/* 3컬럼 메인 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '580px 1fr 480px', gap: 28 }}>
              
              {/* 1. 바이탈 수치 */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, backdropFilter: 'blur(10px)' }}>
                <VitalCard label="혈압" value={selected.bp} unit="mmHg" color={C.warning} icon={<Activity size={22}/>} />
                <VitalCard label="심박수" value={selected.hr} unit="bpm" color={C.danger} icon={<HeartPulse size={22}/>} />
                <VitalCard label="체온" value={selected.temp} unit="°C" color={C.info} icon={<Thermometer size={22}/>} />
                <VitalCard label="산소" value={selected.spo2} unit="%" color={C.success} icon={<Wind size={22}/>} />
                <div style={{ gridColumn: 'span 2', marginTop: 11, padding: 22, background: 'rgba(255,255,255,0.03)', borderRadius: 22, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.sub, marginBottom: 18, letterSpacing: '1px' }}>ACTIVE CONDITIONS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
                    {selected.conditions.map(c => (
                      <div key={c} style={{ fontSize: 18, fontWeight: 800, color: '#fff', background: `${C.info}18`, padding: '9px 18px', borderRadius: 11, border: `1px solid ${C.info}33` }}>{c}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 주간 심박 트렌드 */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '34px', height: 520, backdropFilter: 'blur(10px)' }}>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 28, letterSpacing: '1.5px' }}>WEEKLY VITAL TREND</h3>
                <div style={{ height: 'calc(100% - 60px)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selected.trend}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={RISK_COLOR[selected.risk]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={RISK_COLOR[selected.risk]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" stroke={C.sub} hide />
                      <Tooltip contentStyle={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, fontSize: 18 }} />
                      <Area type="monotone" dataKey="hr" stroke={RISK_COLOR[selected.risk]} strokeWidth={4.5} fill="url(#chartGradient)" style={{ filter: `drop-shadow(0 0 10px ${RISK_COLOR[selected.risk]}66)` }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3. 건강 지수 레이더 */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '34px', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 14, letterSpacing: '1.5px' }}>HEALTH RADAR</h3>
                <div style={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selected.radar}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="sub" tick={{ fill: C.sub, fontSize: 16, fontWeight: 700 }} />
                      <Radar dataKey="val" stroke={RISK_COLOR[selected.risk]} fill={RISK_COLOR[selected.risk]} fillOpacity={0.35} strokeWidth={3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI 분석 섹션 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 34 }}>
              <div style={{ background: `linear-gradient(135deg, ${C.cyan}0d 0%, rgba(0,168,150,0.02) 100%)`, border: `1px solid ${C.cyan}33`, borderRadius: 40, padding: 40, backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <Brain size={28} color={C.cyan} />
                  <h3 style={{ fontSize: 25, fontWeight: 900, color: C.cyan, margin: 0 }}>AI CLINICAL INTELLIGENCE</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '22px', borderRadius: 22, borderLeft: `6px solid ${C.danger}`, boxShadow: `inset 0 0 20px rgba(0,0,0,0.2)` }}>
                  <div style={{ fontSize: 18, color: C.danger, fontWeight: 900, marginBottom: 9, letterSpacing: '1px' }}>CRITICAL INSIGHT</div>
                  <p style={{ fontSize: 22, color: C.text, margin: 0, lineHeight: 1.6, fontWeight: 700 }}>심혈관계 스트레스 징후가 포착되니 지속적 모니터링이 필요합니다.</p>
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 40, padding: 40, backdropFilter: 'blur(10px)' }}>
                <h3 style={{ fontSize: 25, fontWeight: 900, color: '#fff', marginBottom: 28, letterSpacing: '1px' }}>24H RISK PROJECTION</h3>
                <div style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{ t: '현재', r: 30 }, { t: '+4h', r: 35 }, { t: '+8h', r: 55 }, { t: '+12h', r: 45 }, { t: '+16h', r: 60 }, { t: '+20h', r: 75 }, { t: '+24h', r: 65 }]}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.danger} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={C.danger} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="step" dataKey="r" stroke={C.danger} strokeWidth={4.5} fill="url(#riskGradient)" strokeDasharray="7 7" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 히스토리 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 34, padding: 34, backdropFilter: 'blur(10px)' }}>
              <h3 style={{ fontSize: 25, fontWeight: 900, marginBottom: 28, letterSpacing: '1px' }}>MEDICAL TIMELINE</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(580px, 1fr))', gap: 22 }}>
                {selected.history.map((h, i) => (
                  <div key={i} style={{ padding: '22px 28px', borderRadius: 22, background: 'rgba(255,255,255,0.03)', display: 'flex', gap: 22, border: `1px solid ${C.border}` }}>
                    <AlertCircle size={28} color={h.type === '응급' ? C.danger : C.info} />
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>[{h.type}] {h.date}</div>
                      <p style={{ fontSize: 20, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{h.note}</p>
                    </div>
                  </div>
                ))}
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
    <div style={{ padding: '22px', borderRadius: 22, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, transition: '0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: C.sub, fontSize: 16, fontWeight: 900, marginBottom: 11, textTransform: 'uppercase' }}>
        <div style={{ color }}>{React.cloneElement(icon, { size: 18 })}</div> {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 950, color: '#fff', textShadow: `0 0 10px ${color}33` }}>{value}</span>
        <span style={{ fontSize: 18, color: C.sub, fontWeight: 800 }}>{unit}</span>
      </div>
    </div>
  )
}
