import { useState, useEffect } from 'react'
import { Send, Activity, User, Clock, Edit3, Check, AlertCircle, ShieldCheck, Pill, ClipboardList, Thermometer, Droplets, Heart, Sparkles, Satellite, Radio, CheckCircle2, FileText, ChevronRight, Wifi, Upload, RotateCcw, History } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

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
    { role: 'ai', text: `${patient.name} 환자의 데이터가 로드되었습니다. 현재 상태에 대해 궁금한 점을 입력하세요.` }
  ])
  const { hr, history } = useRealtimeVitals(84)
  const [bp, setBp] = useState('142/88')
  const [bt, setBt] = useState('37.6')
  const [editBp, setEditBp] = useState(false)
  const [editBt, setEditBt] = useState(false)
  const [sending, setSending] = useState(false)
  const [txStatus, setTxStatus] = useState('idle') // idle | sending | done
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
      gridTemplateColumns: '400px 1fr 380px',
      height: 'calc(100vh - 46px)',
      overflow: 'hidden',
      background: '#050d1a'
    }}>

      {/* ── 1. 좌측 패널: 환자 정보 ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        borderRight: '1.5px solid rgba(13,217,197,0.15)',
        background: 'rgba(10,22,40,0.95)',
        padding: '22px', overflowY: 'auto'
      }}>
        <SectionLabel icon={<User size={17} color="#0dd9c5" />}>환자 정보</SectionLabel>

        {/* 환자 프로필 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,217,197,0.12), rgba(13,217,197,0.02))',
          border: '1.5px solid rgba(13,217,197,0.3)',
          borderRadius: 22, padding: '22px', marginBottom: 18
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              border: '2px solid #0dd9c5', overflow: 'hidden',
              boxShadow: '0 0 20px rgba(13,217,197,0.25)'
            }}>
              <img src={patient.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
                {patient.name}
                <span style={{ fontSize: 13, color: '#0dd9c5', fontWeight: 400, marginLeft: 8 }}>{patient.id}</span>
              </div>
              <div style={{ fontSize: 15, color: '#8da2c0', marginTop: 3 }}>
                {patient.role} · {patient.age}세 · 혈액형 {patient.blood}형
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            <InfoItem label="생년월일" value={patient.dob} />
            <InfoItem label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`} />
            <div style={{
              gridColumn: 'span 2', padding: '11px 14px',
              background: 'rgba(255,77,109,0.1)', borderRadius: 10,
              border: '1px solid rgba(255,77,109,0.2)'
            }}>
              <div style={{ fontSize: 11, color: '#ff4d6d', fontWeight: 800, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.6px' }}>현재 위치</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{patient.location}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <MedicalCard icon={<AlertCircle size={15} color="#ff9f43" />} label="보유 질환" value={patient.chronic} color="#ff9f43" />
          <MedicalCard icon={<AlertCircle size={15} color="#ff4d6d" />} label="알레르기" value={patient.allergies} color="#ff4d6d" />
          <MedicalCard icon={<Pill size={15} color="#0dd9c5" />} label="최근 투약" value={patient.lastMed} color="#0dd9c5" />
        </div>

        <SectionLabel icon={<Activity size={17} color="#0dd9c5" />}>주요 바이탈</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 18 }}>
          <MainVitalBox label="심박수(실시간)" value={hr} unit="bpm" color="#ff4d6d" icon={<Heart size={13} />} sparkData={history} />
          <MainVitalBox label="산소포화도" value="96" unit="%" color="#00d2ff" icon={<Droplets size={13} />} />
          <ManualVitalBox label="혈압" value={bp} unit="mmHg" color="#a55eea" isEditing={editBp} setIsEditing={setEditBp} onSave={setBp} />
          <ManualVitalBox label="체온" value={bt} unit="°C" color="#ff9f43" isEditing={editBt} setIsEditing={setEditBt} onSave={setBt} />
        </div>

        {/* AI 분석 채팅 */}
        <SectionLabel icon={<Sparkles size={17} color="#0dd9c5" />}>AI 의료 분석</SectionLabel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, maxHeight: 240, overflowY: 'auto', marginBottom: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: '13px 15px', borderRadius: 14,
              background: m.role === 'ai' ? 'rgba(13,217,197,0.07)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 13, lineHeight: 1.65,
              color: m.role === 'ai' ? '#e8f0fe' : '#8da2c0'
            }}>{m.text}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, background: 'rgba(15,32,64,0.9)', padding: '8px', borderRadius: 18, border: '1.5px solid rgba(13,217,197,0.35)' }}>
          <div style={{ padding: '0 10px', display: 'flex', alignItems: 'center', color: '#0dd9c5' }}><Sparkles size={18} /></div>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="증상 입력 후 AI 분석..."
            style={{ flex: 1, background: 'none', border: 'none', padding: '10px 0', color: '#fff', fontSize: 14, outline: 'none' }}
          />
          <button
            onClick={send}
            style={{
              width: 46, height: 46, borderRadius: 13,
              background: '#0dd9c5', border: 'none', color: '#050d1a',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          ><Send size={18} /></button>
        </div>
      </div>

      {/* ── 2. 중앙 패널: 진료이력조회 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid rgba(13,217,197,0.15)', overflow: 'hidden' }}>
        {/* 헤더 */}
        <div style={{
          padding: '16px 26px',
          background: 'rgba(10,22,40,0.9)',
          borderBottom: '1.5px solid rgba(13,217,197,0.15)',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <History size={18} color="#0dd9c5" />
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.5px' }}>진료이력 조회</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['전체','응급','정기','처치'].map(f => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                style={{
                  padding: '5px 13px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${historyFilter === f ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`,
                  background: historyFilter === f ? 'rgba(13,217,197,0.15)' : 'transparent',
                  color: historyFilter === f ? '#0dd9c5' : '#8da2c0',
                  cursor: 'pointer'
                }}
              >{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 30px' }}>
          {/* 요약 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            <StatCard label="총 진료 횟수" value="14회" sub="2026년 기준" color="#0dd9c5" />
            <StatCard label="응급 처치" value="3회" sub="최근 90일" color="#ff4d6d" />
            <StatCard label="마지막 검진" value="7일 전" sub="2026-04-01" color="#ff9f43" />
          </div>

          {/* 타임라인 */}
          <div style={{ position: 'relative', marginLeft: 14 }}>
            <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, width: 2, background: 'rgba(13,217,197,0.1)' }} />

            {filteredHistory.map((item, i) => (
              <div
                key={i}
                className="history-item"
                style={{
                  display: 'flex', gap: 22, marginBottom: 28,
                  animation: `slideInLeft 0.3s ease ${i * 0.05}s both`
                }}
              >
                <div style={{ minWidth: 48, textAlign: 'right', paddingTop: 18 }}>
                  <span style={{ fontSize: 11, color: '#4a6080', fontWeight: 600 }}>
                    {item.date.slice(5)}
                  </span>
                </div>
                {/* 도트 */}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: item.color, zIndex: 1, marginTop: 20,
                  border: '4px solid #050d1a',
                  boxShadow: `0 0 12px ${item.color}66`,
                  flexShrink: 0
                }} />
                {/* 카드 */}
                <div style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(13,217,197,0.1)',
                  borderRadius: 16, padding: '16px 20px',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 9px', borderRadius: 6,
                      background: `${item.color}20`, color: item.color, fontWeight: 800
                    }}>{item.type}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#8da2c0', lineHeight: 1.6 }}>{item.detail}</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: '#4a6080' }}>담당: {item.doctor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 의사 지시사항 */}
        <div style={{
          padding: '18px 26px',
          background: 'rgba(10,22,40,0.8)',
          borderTop: '1.5px solid rgba(13,217,197,0.12)'
        }}>
          <div style={{ fontSize: 12, color: '#0dd9c5', fontWeight: 800, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            <ClipboardList size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />최신 의사 지시사항
          </div>
          <div style={{ fontSize: 14, color: '#e8f0fe', lineHeight: 1.6 }}>
            "심근경색 프로토콜 유지, 15분 간격으로 혈압 및 심전도 재전송 요망"
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#4a6080' }}>— 부산원격의료센터 최의사 · 09:25</div>
        </div>
      </div>

      {/* ── 3. 우측 패널: 데이터 전송 ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'rgba(10,22,40,0.5)',
        padding: '22px', overflowY: 'auto'
      }}>
        <SectionLabel icon={<Satellite size={17} color="#0dd9c5" />}>데이터 전송</SectionLabel>

        {/* 위성 연결 상태 */}
        <div style={{
          padding: '18px', borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(13,217,197,0.12), rgba(13,217,197,0.03))',
          border: '1.5px solid rgba(13,217,197,0.3)',
          marginBottom: 18
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(13,217,197,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Satellite size={22} color="#0dd9c5" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0dd9c5' }}>위성통신 연결됨</div>
              <div style={{ fontSize: 11, color: '#8da2c0' }}>VSAT · 신호강도 87%</div>
            </div>
            <div style={{
              marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%',
              background: '#26de81', animation: 'pulse-dot 1.5s infinite'
            }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <ConnStat label="지연시간" value="340ms" />
            <ConnStat label="대역폭" value="2.4 Mbps" />
            <ConnStat label="수신센터" value="부산 해사" />
            <ConnStat label="마지막 동기" value="09:31" />
          </div>
        </div>

        {/* 전송 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          <TxButton
            icon={<Activity size={17} />}
            label="바이탈 즉시 전송"
            sub={`심박 ${hr}bpm · 혈압 ${bp} · 체온 ${bt}°C`}
            color="#0dd9c5"
            status={txStatus}
            onClick={sendVitals}
          />
          <TxButton
            icon={<FileText size={17} />}
            label="환자 차트 전송"
            sub="최신 진료기록 및 처방 포함"
            color="#4fc3f7"
            onClick={() => {}}
          />
          <TxButton
            icon={<Radio size={17} />}
            label="영상 원격진료 요청"
            sub="부산 원격의료센터 연결"
            color="#a55eea"
            onClick={() => {}}
          />
        </div>

        {/* 전송 로그 */}
        <SectionLabel icon={<Clock size={17} color="#0dd9c5" />}>전송 로그</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {txLog.map((log, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${log.ok ? 'rgba(38,222,129,0.15)' : 'rgba(255,159,67,0.2)'}`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: log.ok ? '#26de81' : '#ff9f43', flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e8f0fe' }}>{log.msg}</div>
                <div style={{ fontSize: 10, color: '#4a6080' }}>{log.time} · {log.type}</div>
              </div>
              {log.ok
                ? <CheckCircle2 size={14} color="#26de81" />
                : <RotateCcw size={14} color="#ff9f43" />
              }
            </div>
          ))}
        </div>

        {/* 데이터 패킷 현황 */}
        <SectionLabel icon={<Upload size={17} color="#0dd9c5" />}>금일 전송 현황</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PacketBar label="바이탈 데이터" sent={47} total={50} color="#0dd9c5" />
          <PacketBar label="영상/이미지" sent={12} total={20} color="#4fc3f7" />
          <PacketBar label="차트 문서" sent={8} total={8} color="#26de81" />
        </div>
      </div>
    </div>
  )
}

// ── 서브 컴포넌트들 ──

function SectionLabel({ icon, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      fontSize: 13, fontWeight: 900, color: '#0dd9c5',
      marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px'
    }}>{icon} {children}</div>
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
    <div style={{
      padding: '13px 16px', borderRadius: 14,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', gap: 12
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: '#4a6080', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}

function MainVitalBox({ label, value, unit, color, icon, sparkData }) {
  return (
    <div style={{
      padding: '13px 10px', borderRadius: 14,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center', position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: 8, right: 8,
        width: 6, height: 6, borderRadius: '50%',
        background: color, animation: 'pulse-dot 1.2s infinite'
      }} />
      <div style={{ fontSize: 11, color: '#8da2c0', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#4a6080' }}>{unit}</div>
      {sparkData && (
        <div style={{ height: 30, marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <Area type="monotone" dataKey="v" stroke={color} fill={`${color}20`} strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function ManualVitalBox({ label, value, unit, color, isEditing, setIsEditing, onSave }) {
  const [temp, setTemp] = useState(value)
  return (
    <div
      onClick={() => !isEditing && setIsEditing(true)}
      style={{
        padding: '13px 10px', borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${isEditing ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`,
        textAlign: 'center', position: 'relative', cursor: 'pointer'
      }}
    >
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        {isEditing ? <Check size={12} color="#0dd9c5" /> : <Edit3 size={11} color="#4a6080" />}
      </div>
      <div style={{ fontSize: 11, color: '#8da2c0', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {isEditing ? (
        <input
          autoFocus value={temp}
          onChange={e => setTemp(e.target.value)}
          onBlur={() => { onSave(temp); setIsEditing(false) }}
          onKeyDown={e => e.key === 'Enter' && (onSave(temp), setIsEditing(false))}
          style={{
            width: '80%', background: 'none', border: 'none',
            borderBottom: '2px solid #0dd9c5', color: '#fff',
            fontSize: 20, fontWeight: 900, textAlign: 'center', outline: 'none'
          }}
        />
      ) : (
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      )}
      <div style={{ fontSize: 10, color: '#4a6080' }}>{unit}</div>
    </div>
  )
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      padding: '16px', borderRadius: 16,
      background: `${color}10`, border: `1px solid ${color}25`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 11, color: '#8da2c0', marginBottom: 6, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#4a6080', marginTop: 3 }}>{sub}</div>
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
    <button
      onClick={onClick}
      disabled={isSending}
      style={{
        padding: '14px 16px', borderRadius: 16,
        background: isDone ? 'rgba(38,222,129,0.1)' : `${color}12`,
        border: `1.5px solid ${isDone ? '#26de81' : color}44`,
        cursor: isSending ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 0.3s', textAlign: 'left', width: '100%',
        opacity: isSending ? 0.7 : 1,
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: isDone ? 'rgba(38,222,129,0.2)' : `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isDone ? '#26de81' : color,
        animation: isSending ? 'spin 1s linear infinite' : 'none',
      }}>
        {isDone ? <CheckCircle2 size={17} /> : isSending ? <RotateCcw size={17} /> : icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: isDone ? '#26de81' : '#e8f0fe' }}>
          {isSending ? '전송 중...' : isDone ? '전송 완료!' : label}
        </div>
        <div style={{ fontSize: 11, color: '#4a6080', marginTop: 2 }}>{sub}</div>
      </div>
      {!isSending && !isDone && <ChevronRight size={14} color="#4a6080" />}
    </button>
  )
}

function PacketBar({ label, sent, total, color }) {
  const pct = Math.round((sent / total) * 100)
  return (
    <div style={{ padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: '#8da2c0', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 800 }}>{sent}/{total}</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 3,
          background: color, transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  )
}

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  if (t.includes('흉통') || t.includes('가슴')) {
    return `${patient.name} 환자의 흉통 증상은 기존 고혈압·고지혈증 병력과 연관될 수 있습니다. 현재 아스피린 알레르기가 있으므로 투약에 주의하세요. 즉시 심전도 측정 및 원격진료 연결을 권고합니다.`
  }
  if (t.includes('혈압') || t.includes('고혈압')) {
    return `현재 혈압 ${patient.chronic.includes('고혈압') ? '고혈압 병력 있음' : ''}. 측정값 142/88mmHg는 주의 범위입니다. 안정을 취하게 하고 15분 후 재측정하세요.`
  }
  if (t.includes('약') || t.includes('투약')) {
    return `최근 투약: ${patient.lastMed}. 알레르기: ${patient.allergies}. 투약 전 반드시 알레르기 이력을 확인하세요.`
  }
  return `현재 ${patient.name} 환자의 활력징후를 분석합니다. 심박수 84bpm, 혈압 142/88, 체온 37.6°C — 전반적으로 고혈압 경계 상태입니다. 지속 모니터링을 권고합니다.`
}
