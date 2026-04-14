import { useState } from 'react'
import { Send, Mic, ChevronRight, User, FileText, Upload } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const TIMELINE = [
  { time: '09:14', type: 'emergency', label: '응급 발생', detail: '김태호 선장 — 흉통, 호흡곤란 호소', color: 'var(--red-400)' },
  { time: '09:16', type: 'action', label: '아스피린 300mg 투여', detail: '담당: 김선의 의사', color: 'var(--orange-400)' },
  { time: '09:20', type: 'vital', label: '바이탈 측정', detail: 'BP 158/95 · HR 96bpm · BT 38.1°C', color: 'var(--blue-400)' },
  { time: '09:25', type: 'consult', label: '원격 진료 연결', detail: '부산 원격의료센터 박준혁 의사', color: 'var(--teal-400)' },
  { time: '10:30', type: 'action', label: '니트로글리세린 투여', detail: '의사 지시에 따라 설하 투여', color: 'var(--orange-400)' },
  { time: '11:00', type: 'vital', label: '상태 호전 확인', detail: 'BP 142/88 · HR 84bpm · 흉통 감소', color: 'var(--green-400)' },
]

const hrTrend = [
  { t: '09:14', v: 96 }, { t: '09:30', v: 98 }, { t: '09:45', v: 95 },
  { t: '10:00', v: 91 }, { t: '10:30', v: 88 }, { t: '11:00', v: 84 },
]

const PATIENT = {
  name: '김태호', age: 61, role: '선장', blood: 'AB-',
  bp: '142/88', hr: 84, temp: 37.6, spo2: 95,
  status: 'watch',
}

export default function Main() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: '안녕하세요. 환자 상태를 음성 또는 텍스트로 입력해주세요. AI가 분석하여 처치 방향을 안내합니다.' },
  ])

  const send = () => {
    if (!prompt.trim()) return
    const userMsg = { role: 'user', text: prompt }
    setMessages(m => [...m, userMsg])
    setPrompt('')
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'ai',
        text: `증상 분석 중: "${userMsg.text}" — 흉통과 호흡곤란이 동반된 경우 심근경색 가능성이 높습니다. MONA 요법(모르핀·산소·니트로·아스피린)을 순서대로 진행하세요. 원격 의료진 연결을 권장합니다.`,
      }])
    }, 900)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: 'calc(100vh - 46px)', overflow: 'hidden', background: 'rgba(3,13,28,0.78)', backdropFilter: 'blur(8px)' }}>
      {/* Left — main content */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 20px',
          background: 'rgba(255,77,109,0.06)',
          borderBottom: '1px solid rgba(255,77,109,0.2)',
          flexShrink: 0,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-400)', animation: 'pulse-dot 1s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-400)' }}>응급 처치 진행 중</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— 김태호 선장 · 심근경색 의심</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <StatusChip label="골든타임" value="잔여 42분" color="var(--red-400)" />
            <StatusChip label="원격진료" value="연결됨" color="var(--green-400)" />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Patient + Data block */}
          <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--border)', overflow: 'auto', padding: '16px 14px' }}>
            <SectionLabel>환자 정보 · 이력 · 데이터 전송</SectionLabel>
            {/* Current patient card */}
            <div style={{
              background: 'rgba(255,77,109,0.06)', border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 10, padding: '12px', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,77,109,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800, color: 'var(--red-400)',
                }}>{PATIENT.name[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{PATIENT.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{PATIENT.age}세 · {PATIENT.role} · {PATIENT.blood}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <Vital label="혈압" value={PATIENT.bp} alert={parseInt(PATIENT.bp) > 140} />
                <Vital label="심박" value={`${PATIENT.hr}bpm`} />
                <Vital label="체온" value={`${PATIENT.temp}°C`} alert={PATIENT.temp >= 38} />
                <Vital label="SpO₂" value={`${PATIENT.spo2}%`} alert={PATIENT.spo2 < 95} />
              </div>
            </div>
            {/* Trend mini */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>심박 추이</div>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={hrTrend}>
                  <defs>
                    <linearGradient id="mainHrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--red-400)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--red-400)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[75, 105]} hide />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 10 }} />
                  <Area type="monotone" dataKey="v" stroke="var(--red-400)" strokeWidth={1.5} fill="url(#mainHrGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Data transmission */}
            <div style={{ padding: '10px', borderRadius: 8, background: 'rgba(13,217,197,0.06)', border: '1px solid var(--border)', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-400)', marginBottom: 8 }}>데이터 전송</div>
              <TxBtn label="차트 전송 → 원격 의사" />
              <TxBtn label="병원 이송 데이터 전송" />
              <TxBtn label="심전도 파일 전송" />
            </div>

            <button style={{
              width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed var(--border)',
              background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>+ 현장 정보 추가</button>
          </div>

          {/* Timeline */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
            <SectionLabel>환자 상태 타임라인</SectionLabel>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 36, top: 4, bottom: 4,
                width: 1.5, background: 'linear-gradient(to bottom, var(--red-400), var(--border))',
                opacity: 0.3,
              }} />
              {TIMELINE.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14, position: 'relative' }}>
                  <div style={{ width: 72, flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', paddingTop: 10 }}>{e.time}</div>
                  </div>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 10, zIndex: 1,
                    background: e.color, boxShadow: `0 0 8px ${e.color}66`,
                  }} />
                  <div style={{
                    flex: 1, padding: '8px 12px', borderRadius: 8,
                    background: i === 0 ? `${e.color}12` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === 0 ? e.color + '44' : 'var(--border)'}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? e.color : 'var(--text-primary)' }}>{e.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt input */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          padding: '12px 20px',
          background: 'rgba(3,13,28,0.92)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>환자 상태 입력 (음성 · 텍스트)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '0 14px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 8, cursor: 'pointer', color: 'var(--red-400)',
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>
              <Mic size={14} />음성
            </button>
            <input
              placeholder="증상, 처치 내용, 상태 변화를 입력하세요..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              style={{
                flex: 1, background: 'var(--navy-800)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={send} style={{
              padding: '0 16px', background: 'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
              border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff', flexShrink: 0,
              display: 'flex', alignItems: 'center',
            }}><Send size={15} /></button>
          </div>
        </div>
      </div>

      {/* Right — AI chat */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>AI 의료 어시스턴트</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>증상 분석 · 처치 가이드 · 약품 추천</div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 10,
              background: m.role === 'ai' ? 'rgba(13,217,197,0.06)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'ai' ? 'var(--border)' : 'rgba(255,255,255,0.08)'}`,
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
            }}>
              {m.role === 'ai' && (
                <div style={{ fontSize: 10, color: 'var(--teal-400)', fontWeight: 600, marginBottom: 5 }}>AI 어시스턴트</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
      {children}
    </div>
  )
}

function StatusChip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', gap: 5, fontSize: 11, padding: '3px 10px', borderRadius: 6,
      background: `${color}10`, border: `1px solid ${color}30`,
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}

function Vital({ label, value, alert }) {
  return (
    <div style={{
      padding: '6px 8px', borderRadius: 6,
      background: alert ? 'rgba(255,77,109,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${alert ? 'rgba(255,77,109,0.3)' : 'var(--border)'}`,
    }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: alert ? 'var(--red-400)' : 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}

function TxBtn({ label }) {
  return (
    <button style={{
      width: '100%', marginBottom: 5, padding: '7px 10px', borderRadius: 6,
      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
      cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <Upload size={11} color="var(--teal-400)" /> {label}
    </button>
  )
}
