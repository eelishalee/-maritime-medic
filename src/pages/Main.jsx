import { useState, useEffect } from 'react'
import { Send, Activity, User, Clock, Edit3, Check, AlertCircle, ShieldCheck, Pill, ClipboardList, Thermometer, Droplets, Heart, Sparkles, Satellite, Radio, CheckCircle2, FileText, ChevronRight, Wifi, Upload, RotateCcw, History } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import profileImg from '../assets/CE.jpeg'

const HISTORY_DATA = [
  { date: '2026-04-07', type: '응급', label: '흉통 호소', detail: '아스피린 300mg 투여, 원격진료 연결', color: '#ff4d6d', doctor: '부산원격의료센터 최의사' },
  { date: '2026-04-01', type: '정기', label: '월간 정기검진', detail: '혈압 145/90 — 고혈압 약 조정', color: '#ff9f43', doctor: '선내 의무관' },
  { date: '2026-03-18', type: '처치', label: '손 찰과상 드레싱', detail: '멸균 드레싱 교체 처치', color: '#0dd9c5', doctor: '선내 의무관' },
  { date: '2026-03-05', type: '정기', label: '월간 정기검진', detail: '전반적 양호, 혈압 약 지속 복용', color: '#ff9f43', doctor: '선내 의무관' },
  { date: '2026-02-14', type: '응급', label: '심계항진 증상', detail: '심전도 정상, 안정 취함', color: '#ff4d6d', doctor: '부산원격의료센터 최의사' },
]

const TX_LOG = [
  { time: '09:31', type: '전송완료', msg: '바이탈 데이터 패킷 #47', ok: true },
  { time: '09:20', type: '전송완료', msg: '심전도 파형 스냅샷', ok: true },
  { time: '09:10', type: '전송대기', msg: '환자 차트 업데이트', ok: false },
]

function useRealtimeVitals(baseHr = 84) {
  const [hr, setHr] = useState(baseHr)
  const [history, setHistory] = useState(
    Array.from({ length: 20 }, (_, i) => ({ t: i, v: baseHr + Math.round((Math.random() - 0.5) * 4) }))
  )
  useEffect(() => {
    const t = setInterval(() => {
      const newHr = Math.max(60, Math.min(120, hr + Math.round((Math.random() - 0.5) * 3)))
      setHr(newHr)
      setHistory(h => [...h.slice(1), { t: Date.now(), v: newHr }])
    }, 2000)
    return () => clearInterval(t)
  }, [hr])
  return { hr, history }
}

export default function Main({ patient }) {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: `김항해 환자의 데이터가 로드되었습니다. 현재 상태에 대해 궁금한 점을 입력하세요.` }
  ])
  const { hr, history } = useRealtimeVitals(84)
  const [bp, setBp] = useState('142/88')
  const [bt, setBt] = useState('37.6')
  const [editBp, setEditBp] = useState(false)
  const [editBt, setEditBt] = useState(false)
  const [txStatus, setTxStatus] = useState('idle') 
  const [txLog, setTxLog] = useState(TX_LOG)
  const [historyFilter, setHistoryFilter] = useState('전체')

  const send = () => {
    if (!prompt.trim()) return
    setMessages(m => [...m, { role: 'user', text: prompt }])
    const q = prompt
    setPrompt('')
    setTimeout(() => {
      const reply = getAiReply(q, patient)
      setMessages(m => [...m, { role: 'ai', text: reply }])
    }, 800)
  }

  const sendVitals = () => {
    setTxStatus('sending')
    setTimeout(() => {
      setTxStatus('done')
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
      setTxLog(l => [{ time: timeStr, type: '전송완료', msg: `바이탈 데이터 패킷 #${48 + l.length}`, ok: true }, ...l.slice(0,4)])
      setTimeout(() => setTxStatus('idle'), 2000)
    }, 2000)
  }

  const filteredHistory = historyFilter === '전체'
    ? HISTORY_DATA
    : HISTORY_DATA.filter(h => h.type === historyFilter)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '420px 1fr 420px',
      height: 'calc(100vh - 72px)',
      width: '100vw',
      overflow: 'hidden',
      background: '#050d1a'
    }}>

      {/* ── 1. 좌측 패널: 환자 프로필 & 전송 로그 (스크롤 가능) ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        borderRight: '1.5px solid rgba(13,217,197,0.15)',
        background: 'rgba(10,22,40,0.95)',
        padding: '24px', overflowY: 'auto'
      }}>
        <SectionLabel icon={<User size={17} color="#0dd9c5" />}>환자 프로필</SectionLabel>

        <div style={{
          background: 'linear-gradient(135deg, rgba(13,217,197,0.12), rgba(13,217,197,0.02))',
          border: '1.5px solid rgba(13,217,197,0.3)',
          borderRadius: 22, padding: '24px', marginBottom: 20
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <div style={{
              width: 100, height: 100, borderRadius: 24,
              border: '2.5px solid #0dd9c5', overflow: 'hidden',
              boxShadow: '0 0 25px rgba(13,217,197,0.3)'
            }}>
              <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 950, color: '#fff', lineHeight: 1.2 }}>
                김항해
                <div style={{ fontSize: 18, color: '#0dd9c5', fontWeight: 500, marginTop: 4 }}>S2026-026</div>
              </div>
              <div style={{ fontSize: 19, color: '#8da2c0', marginTop: 8 }}>
                기관장 · 55세 · A+형
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <InfoItem label="생년월일" value="1971-08-22" />
            <InfoItem label="신장/체중" value="174cm / 76kg" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <MedicalCard icon={<AlertCircle size={16} color="#ff9f43" />} label="보유 질환" value="고혈압, 고지혈증" color="#ff9f43" />
          <MedicalCard icon={<Pill size={16} color="#0dd9c5" />} label="최근 투약" value="암로디핀 (08:00)" color="#0dd9c5" />
        </div>

        <SectionLabel icon={<Activity size={17} color="#0dd9c5" />}>실시간 바이탈</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <MainVitalBox label="심박수" value={hr} unit="bpm" color="#ff4d6d" icon={<Heart size={14} />} sparkData={history} />
          <MainVitalBox label="SpO2" value="96" unit="%" color="#00d2ff" icon={<Droplets size={14} />} />
          <ManualVitalBox label="혈압" value={bp} unit="mmHg" color="#a55eea" isEditing={editBp} setIsEditing={setEditBp} onSave={setBp} />
          <ManualVitalBox label="체온" value={bt} unit="°C" color="#ff9f43" isEditing={editBt} setIsEditing={setEditBt} onSave={setBt} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <TxButton 
            icon={<FileText size={20} />} 
            label="정밀 차트 전송" 
            sub="진료기록 14건 포함" 
            color="#4fc3f7" 
            onClick={() => {}} 
          />
        </div>

        <SectionLabel icon={<Clock size={17} color="#0dd9c5" />}>데이터 전송 로그</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {txLog.map((log, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${log.ok ? 'rgba(38,222,129,0.2)' : 'rgba(255,159,67,0.25)'}`,
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: log.ok ? '#26de81' : '#ff9f43' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#e8f0fe' }}>{log.msg}</div>
                <div style={{ fontSize: 13, color: '#4a6080', marginTop: 3 }}>{log.time} · {log.type}</div>
              </div>
              {log.ok ? <CheckCircle2 size={18} color="#26de81" /> : <RotateCcw size={18} color="#ff9f43" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 중앙 패널: 진료이력조회 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid rgba(13,217,197,0.15)', background: '#050d1a' }}>
        <div style={{ padding: '24px 32px', background: 'rgba(10,22,40,0.95)', borderBottom: '1.5px solid rgba(13,217,197,0.15)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <History size={22} color="#0dd9c5" />
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.5px' }}>중앙 관제 및 진료이력</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {['전체','응급','정기','처치'].map(f => (
              <button key={f} onClick={() => setHistoryFilter(f)} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: `1.5px solid ${historyFilter === f ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`, background: historyFilter === f ? 'rgba(13,217,197,0.15)' : 'transparent', color: historyFilter === f ? '#0dd9c5' : '#8da2c0', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
            <SensorCard label="실시간 심박수" value={hr} unit="bpm" color="#ff4d6d" icon={<Heart size={20} />} isSensor />
            <SensorCard label="산소포화도" value="96" unit="%" color="#00d2ff" icon={<Droplets size={20} />} isSensor />
            <SensorCard label="혈압 (수동입력)" value={bp} unit="mmHg" color="#a55eea" icon={<Activity size={20} />} isManual />
            <SensorCard label="체온 (수동입력)" value={bt} unit="°C" color="#ff9f43" icon={<Thermometer size={20} />} isManual />
          </div>

          <div style={{ position: 'relative', marginLeft: 14 }}>
            <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, width: 2, background: 'rgba(13,217,197,0.1)' }} />
            {filteredHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
                <div style={{ minWidth: 56, textAlign: 'right', paddingTop: 18 }}><span style={{ fontSize: 14, color: '#4a6080', fontWeight: 700 }}>{item.date.slice(5)}</span></div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: item.color, zIndex: 1, marginTop: 18, border: '5px solid #050d1a', boxShadow: `0 0 15px ${item.color}88`, flexShrink: 0 }} />
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(13,217,197,0.12)', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}><span style={{ fontSize: 14, padding: '4px 14px', borderRadius: 8, background: `${item.color}20`, color: item.color, fontWeight: 800 }}>{item.type}</span><span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{item.label}</span></div>
                  <div style={{ fontSize: 18, color: '#8da2c0', lineHeight: 1.7 }}>{item.detail}</div>
                  <div style={{ marginTop: 14, fontSize: 14, color: '#4a6080', fontWeight: 500 }}>담당: {item.doctor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '28px 32px', background: 'rgba(13,217,197,0.05)', borderTop: '1.5px solid rgba(13,217,197,0.15)' }}>
          <div style={{ fontSize: 15, color: '#0dd9c5', fontWeight: 900, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}><ClipboardList size={18} style={{ verticalAlign: 'middle', marginRight: 10 }} />최신 원격지시 사항</div>
          <div style={{ fontSize: 19, color: '#fff', lineHeight: 1.6, fontWeight: 600 }}>"환자 안정을 최우선으로 하며, 15분 간격 심전도 데이터 전송 유지바람. 필히 부산 의료센터 수신 확인 요망."</div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#4a6080' }}>— 부산원격의료센터 최의사 · 09:25 AM</div>
        </div>
      </div>

      {/* ── 3. 우측 패널: AI 의료 분석 전용 영역 ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'rgba(10,22,40,0.85)',
        padding: '24px'
      }}>
        <SectionLabel icon={<Sparkles size={17} color="#0dd9c5" />}>AI 의료 분석</SectionLabel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                padding: '16px 20px', borderRadius: 16,
                background: m.role === 'ai' ? 'rgba(13,217,197,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 17, lineHeight: 1.6,
                color: m.role === 'ai' ? '#e8f0fe' : '#8da2c0',
                alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                maxWidth: '90%'
              }}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, background: 'rgba(15,32,64,0.95)', padding: '10px', borderRadius: 20, border: '1.5px solid rgba(13,217,197,0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="증상 입력 후 AI 분석..."
              style={{ flex: 1, background: 'none', border: 'none', padding: '12px 16px', color: '#fff', fontSize: 17, outline: 'none' }}
            />
            <button onClick={send} style={{ width: 52, height: 52, borderRadius: 14, background: '#0dd9c5', border: 'none', color: '#050d1a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13,217,197,0.3)' }}><Send size={22} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 900, color: '#0dd9c5', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px' }}>{icon} {children}</div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function MedicalCard({ icon, label, value, color }) {
  return (
    <div style={{ padding: '13px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: '#4a6080', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}

function MainVitalBox({ label, value, unit, color, icon, sparkData }) {
  return (
    <div style={{ padding: '13px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: color, animation: 'pulse-dot 1.2s infinite' }} />
      <div style={{ fontSize: 11, color: '#8da2c0', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>{icon} {label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#4a6080' }}>{unit}</div>
      {sparkData && (
        <div style={{ height: 30, marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={sparkData}><Area type="monotone" dataKey="v" stroke={color} fill={`${color}20`} strokeWidth={1.5} dot={false} /></AreaChart></ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function ManualVitalBox({ label, value, unit, color, isEditing, setIsEditing, onSave }) {
  const [temp, setTemp] = useState(value)
  return (
    <div onClick={() => !isEditing && setIsEditing(true)} style={{ padding: '13px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${isEditing ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`, textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', top: 8, right: 8 }}>{isEditing ? <Check size={12} color="#0dd9c5" /> : <Edit3 size={11} color="#4a6080" />}</div>
      <div style={{ fontSize: 11, color: '#8da2c0', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {isEditing ? (
        <input autoFocus value={temp} onChange={e => setTemp(e.target.value)} onBlur={() => { onSave(temp); setIsEditing(false) }} onKeyDown={e => e.key === 'Enter' && (onSave(temp), setIsEditing(false))} style={{ width: '80%', background: 'none', border: 'none', borderBottom: '2px solid #0dd9c5', color: '#fff', fontSize: 20, fontWeight: 900, textAlign: 'center', outline: 'none' }} />
      ) : (
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      )}
      <div style={{ fontSize: 10, color: '#4a6080' }}>{unit}</div>
    </div>
  )
}

function SensorCard({ label, value, unit, color, icon, isSensor, isManual }) {
  return (
    <div style={{ padding: '24px 20px', borderRadius: 20, background: isSensor ? 'rgba(13,217,197,0.05)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${isSensor ? 'rgba(13,217,197,0.2)' : 'rgba(255,255,255,0.08)'}`, textAlign: 'center', position: 'relative' }}>
      <div style={{ fontSize: 14, color: '#8da2c0', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{icon} {label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 14, color: '#4a6080', fontWeight: 600, marginTop: 4 }}>{unit}</div>
      {isSensor && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#26de81', animation: 'pulse-dot 1.2s infinite' }} />
          <span style={{ fontSize: 10, color: '#26de81', fontWeight: 800 }}>LIVE</span>
        </div>
      )}
      {isManual && (
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: 10, color: '#8da2c0', fontWeight: 800 }}>INPUT</span>
        </div>
      )}
    </div>
  )
}

function ConnStat({ label, value }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 10, color: '#4a6080', marginBottom: 2, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0fe' }}>{value}</div>
    </div>
  )
}

function TxButton({ icon, label, sub, color, status, onClick }) {
  const isSending = status === 'sending'
  const isDone = status === 'done'
  return (
    <button onClick={onClick} disabled={isSending} style={{ padding: '14px 16px', borderRadius: 16, background: isDone ? 'rgba(38,222,129,0.1)' : `${color}12`, border: `1.5px solid ${isDone ? '#26de81' : color}44`, cursor: isSending ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', textAlign: 'left', width: '100%', opacity: isSending ? 0.7 : 1 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: isDone ? 'rgba(38,222,129,0.2)' : `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDone ? '#26de81' : color, animation: isSending ? 'spin 1s linear infinite' : 'none' }}>{isDone ? <CheckCircle2 size={17} /> : isSending ? <RotateCcw size={17} /> : icon}</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 800, color: isDone ? '#26de81' : '#e8f0fe' }}>{isSending ? '전송 중...' : isDone ? '전송 완료!' : label}</div><div style={{ fontSize: 11, color: '#4a6080', marginTop: 2 }}>{sub}</div></div>
      {!isSending && !isDone && <ChevronRight size={14} color="#4a6080" />}
    </button>
  )
}

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  if (t.includes('흉통') || t.includes('가슴')) return `김항해 환자의 흉통 증상은 기존 고혈압·고지혈증 병력과 연관될 수 있습니다. 현재 아스피린 알레르기가 있으므로 투약에 주의하세요. 즉시 심전도 측정 및 원격진료 연결을 권고합니다.`
  if (t.includes('혈압') || t.includes('고혈압')) return `현재 혈압 측정값 142/88mmHg는 주의 범위입니다. 안정을 취하게 하고 15분 후 재측정하세요.`
  return `현재 김항해 환자의 활력징후를 분석합니다. 심박수 84bpm, 혈압 142/88, 체온 37.6°C — 전반적으로 고혈압 경계 상태입니다. 지속 모니터링을 권고합니다.`
}
