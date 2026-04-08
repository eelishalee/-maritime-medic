import { useState, useEffect } from 'react'
import { Send, Mic, Upload, Activity, Anchor, Radio, Clipboard, Shield, Pill, History } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

// --- 데이터 설정 ---
const TIMELINE = [
  { time: '09:14', label: '응급 발생', detail: '김해선 선장 — 흉통, 호흡곤란 호소', color: '#fb7185' },
  { time: '09:16', label: '아스피린 300mg 투여', detail: '담당: 박의항 의무사', color: '#fbbf24' },
  { time: '09:20', label: '바이탈 측정', detail: '혈압 158/95 · 심박수 96bpm · SpO2 94%', color: '#60a5fa' },
  { time: '09:25', label: '원격 진료 연결', detail: '부산 원격의료센터 최원격 의사', color: '#2dd4bf' },
  { time: '10:30', label: '니트로글리세린 투여', detail: '의사 지시에 따라 설하 투여', color: '#fbbf24' },
]

const PATIENT = {
  id: 'S2024-001', name: '김해선', age: 58, role: '선장', blood: 'A+',
}

const MEDICATIONS = [
  { name: '아스피린', dose: '300mg', stock: 12, category: '응급' },
  { name: '니트로글리세린', dose: '0.6mg', stock: 5, category: '심혈관' },
  { name: '에피네프린', dose: '1mg', stock: 3, category: '응급' },
]

// 실시간 심박 시뮬레이션
function useRealtimeHR(base = 84) {
  const [hr, setHr] = useState(base)
  const [spo2, setSpo2] = useState(95)
  const [rr, setRr] = useState(18)
  const [history, setHistory] = useState(
    Array.from({ length: 12 }, (_, i) => ({ t: `${i}`, v: base + Math.round((Math.random()-0.5)*6) }))
  )
  useEffect(() => {
    const t = setInterval(() => {
      const newHr = Math.max(60, Math.min(120, hr + Math.round((Math.random()-0.5)*4)))
      const newSpo2 = Math.max(90, Math.min(100, spo2 + Math.round((Math.random()-0.5)*1)))
      const newRr = Math.max(12, Math.min(30, rr + Math.round((Math.random()-0.5)*2)))
      setHr(newHr)
      setSpo2(newSpo2)
      setRr(newRr)
      setHistory(h => [...h.slice(1), { t: Date.now().toString(), v: newHr }])
    }, 1800)
    return () => clearInterval(t)
  }, [hr, spo2, rr])
  return { hr, spo2, rr, history }
}

export default function Main() {
  const [activeTab, setActiveTab] = useState('진료') // 진료, 가이드, 약물
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: '안녕하세요. 환자 상태를 입력해주세요. 실시간 데이터를 분석하여 최적의 가이드를 제공합니다.' },
  ])
  
  const { hr, spo2, rr, history } = useRealtimeHR(84)
  const [bp, setBp] = useState('142/88')
  const [bt, setBt] = useState('37.6')
  const [editBp, setEditBp] = useState(false)
  const [editBt, setEditBt] = useState(false)

  const send = () => {
    if (!prompt.trim()) return
    setMessages(m => [...m, { role: 'user', text: prompt }])
    setPrompt('')
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: `분석 완료: 현재 바이탈과 "${prompt}" 증상을 고려할 때 심근경색(STEMI)이 의심됩니다. 산소 투여량을 유지하고 원격 의사에게 ECG 전송을 시도하십시오.` }])
    }, 900)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', height: '100vh', overflow: 'hidden', background: '#0a0e14', color: '#e2e8f0', fontFamily: 'Pretendard, sans-serif' }}>
      
      {/* --- 왼쪽 + 중앙 영역 --- */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        
        {/* 상단 상태바 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px',
          background: 'rgba(251,113,133,0.06)', borderBottom: '1px solid rgba(251,113,133,0.2)', flexShrink: 0,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb7185', animation: 'pulse-dot 1.5s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fb7185' }}>응급 처치 진행 중</span>
          <span style={{ fontSize: 11, color: '#64748b' }}>— {PATIENT.name} {PATIENT.role} ({PATIENT.id})</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <StatusChip label="골든타임" value="42:15" color="#fb7185" />
            <StatusChip label="원격연결" value="정상" color="#2dd4bf" />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* [1] 좌측 환자 정보 패널 (252px) */}
          <div style={{ width: 252, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', overflow: 'auto', padding: '14px 12px' }}>
            <SectionLabel>환자 정보 · 데이터 모니터링</SectionLabel>

            {/* 기본 정보 카드 */}
            <div style={{ background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.25)', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(251,113,133,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fb7185' }}>{PATIENT.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{PATIENT.name} <span style={{ fontSize: 9, color: '#64748b', fontWeight: 400 }}>{PATIENT.id}</span></div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{PATIENT.age}세 · {PATIENT.role} · {PATIENT.blood}</div>
                </div>
              </div>

              {/* 실시간 모니터링 (중앙 정렬) */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: '#2dd4bf', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2dd4bf', animation: 'pulse-dot 1s infinite' }} />
                  실시간 모니터링
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
                  <VitalBox label="심박수" value={hr} unit="bpm" color="#fb7185" alert={hr > 100} />
                  <VitalBox label="산소포화도" value={spo2} unit="%" color="#60a5fa" alert={spo2 < 95} />
                  <VitalBox label="호흡수" value={rr} unit="/분" color="#2dd4bf" alert={rr > 24} />
                </div>
              </div>

              {/* 현장 측정 (중앙 정렬) */}
              <div>
                <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>현장 직접 측정</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  <ManualVital label="혈압" value={bp} setValue={setBp} unit="mmHg" editing={editBp} setEditing={setEditBp} alert={parseInt(bp) > 140} />
                  <ManualVital label="체온" value={bt} setValue={setBt} unit="°C" editing={editBt} setEditing={setEditBt} alert={parseFloat(bt) >= 38} />
                </div>
              </div>
            </div>

            {/* 미니 차트 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>심박 변동 추이</div>
              <div style={{ height: 54, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '4px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <Area type="monotone" dataKey="v" stroke="#fb7185" strokeWidth={1.5} fill="rgba(251,113,133,0.1)" dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 데이터 전송 섹션 */}
            <div style={{ padding: '10px', borderRadius: 8, background: 'rgba(45,212,191,0.04)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#2dd4bf', marginBottom: 8 }}>전송 및 공유</div>
              <TxBtn label="환자 차트 → 부산 센터" />
              <TxBtn label="12유도 ECG 파일 전송" />
              <TxBtn label="투약 이력 리포트 생성" />
            </div>
          </div>

          {/* [2] 중앙 탭 컨텐츠 영역 (1fr) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* 상단 탭 메뉴 */}
            <div style={{ display: 'flex', gap: 4, padding: '10px 18px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <TabItem label="진료 기록" active={activeTab === '진료'} onClick={() => setActiveTab('진료')} icon={<Clipboard size={14} />} />
              <TabItem label="처치 가이드" active={activeTab === '가이드'} onClick={() => setActiveTab('가이드')} icon={<Shield size={14} />} />
              <TabItem label="약물 현황" active={activeTab === '약물'} onClick={() => setActiveTab('약물')} icon={<Pill size={14} />} />
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
              {activeTab === '진료' && (
                <div>
                  <SectionLabel>처치 및 상태 변화 타임라인</SectionLabel>
                  <div style={{ position: 'relative', paddingLeft: '40px' }}>
                    <div style={{ position: 'absolute', left: '16px', top: 5, bottom: 5, width: '1.5px', background: 'rgba(255,255,255,0.08)' }} />
                    {TIMELINE.map((e, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: 15 }}>
                        <div style={{ position: 'absolute', left: '-30px', fontSize: 10, color: '#64748b', top: '2px' }}>{e.time}</div>
                        <div style={{ position: 'absolute', left: '-27px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: e.color, boxShadow: `0 0 6px ${e.color}` }} />
                        <div style={{ background: i === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', padding: '8px 12px', borderRadius: 8, border: i === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' }}>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{e.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === '가이드' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <GuideCard title="STEMI 대응" desc="아스피린 300mg 설하 투여 후 산소 4L/min 유지" />
                  <GuideCard title="쇼크 대비" desc="정맥로(IV) 확보 및 생리식염수 관류 대기" />
                  <GuideCard title="니트로글리세린" desc="수축기 혈압 90mmHg 이상 시 5분 간격 투여" />
                </div>
              )}
              {activeTab === '약물' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ textAlign: 'left', padding: 8 }}>약품명</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>용량</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>재고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MEDICATIONS.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: 8, fontWeight: 700 }}>{m.name}</td>
                        <td style={{ padding: 8 }}>{m.dose}</td>
                        <td style={{ padding: 8, color: m.stock < 5 ? '#fb7185' : '#2dd4bf' }}>{m.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* 하단 입력바 */}
        <div style={{ flexShrink: 0, padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0a0e14' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '0 12px', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: 8, color: '#fb7185', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mic size={14} />음성
            </button>
            <input 
              placeholder="상태를 입력하세요..." 
              value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              style={{ flex: 1, background: '#1a1e26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 12, outline: 'none' }} 
            />
            <button onClick={send} style={{ background: '#2dd4bf', border: 'none', borderRadius: 8, padding: '0 16px', color: '#000', cursor: 'pointer' }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* --- 오른쪽 AI 패널 (300px) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f1218' }}>
        <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0' }}>AI MEDI-ASSISTANT</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>실시간 증상 분석 및 처치 추천</div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 10,
              background: m.role === 'ai' ? 'rgba(45,212,191,0.05)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'ai' ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.06)'}`,
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
            }}>
              {m.role === 'ai' && <div style={{ fontSize: 9, fontWeight: 800, color: '#2dd4bf', marginBottom: 4 }}>AI ANALYSIS</div>}
              <div style={{ fontSize: 11, lineHeight: 1.6 }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  )
}

function VitalBox({ label, value, unit, color, alert }) {
  return (
    <div style={{ padding: '7px 4px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
      <div style={{ fontSize: 8, color: '#64748b', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: alert ? '#fb7185' : color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, color: '#64748b' }}>{unit}</div>
    </div>
  )
}

function ManualVital({ label, value, unit, editing, setEditing, setValue, alert }) {
  return (
    <div onClick={() => setEditing(true)} style={{ padding: '7px 4px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: `1px solid ${editing ? '#2dd4bf' : 'rgba(255,255,255,0.06)'}`, textAlign: 'center', cursor: 'pointer' }}>
      <div style={{ fontSize: 8, color: '#64748b', marginBottom: 2 }}>{label}</div>
      {editing ? (
        <input autoFocus value={value} onChange={e => setValue(e.target.value)} onBlur={() => setEditing(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#2dd4bf', fontSize: 14, fontWeight: 900, textAlign: 'center', outline: 'none' }} />
      ) : (
        <div style={{ fontSize: 14, fontWeight: 900, color: alert ? '#fb7185' : '#e2e8f0' }}>{value}</div>
      )}
      <div style={{ fontSize: 8, color: '#64748b' }}>{unit}</div>
    </div>
  )
}

function TabItem({ label, active, onClick, icon }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 11, fontWeight: 700, color: active ? '#2dd4bf' : '#64748b', borderBottom: `2px solid ${active ? '#2dd4bf' : 'transparent'}`, cursor: 'pointer', transition: '0.2s' }}>
      {icon} {label}
    </div>
  )
}

function GuideCard({ title, desc }) {
  return (
    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#2dd4bf', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
    </div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 9, fontWeight: 800, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{children}</div>
}

function StatusChip({ label, value, color }) {
  return (
    <div style={{ display: 'flex', gap: 5, fontSize: 10, padding: '3px 8px', borderRadius: 5, background: `${color}15`, border: `1px solid ${color}30` }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}

function TxBtn({ label }) {
  return (
    <button style={{ width: '100%', marginBottom: 4, padding: '6px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', color: '#94a3b8', fontSize: 9, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
      <Upload size={10} color="#2dd4bf" /> {label}
    </button>
  )
}
