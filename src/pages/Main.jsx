import { useState, useEffect } from 'react'
import { Send, Activity, User, Clock, Edit3, Check, AlertCircle, ShieldCheck, Pill, ClipboardList, Thermometer, Droplets, Heart, Sparkles } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const TIMELINE_DATA = [
  { time: '09:14', label: '응급 발생', detail: '김선원 — 흉통, 호흡곤란 호소', color: '#ff4d6d' },
  { time: '09:16', label: '아스피린 300mg 투여', detail: '담당: 박항해 항해사', color: '#ff9f43' },
  { time: '09:20', label: '바이탈 측정', detail: '혈압 158/95 · 심박수 96bpm · 산소포화도 94%', color: '#00d2ff' },
  { time: '09:25', label: '원격 진료 연결', detail: '부산 원격의료센터 최의사', color: '#0dd9c5' },
]

function useRealtimeVitals(baseHr = 84) {
  const [hr, setHr] = useState(baseHr);
  const [history, setHistory] = useState(Array.from({ length: 20 }, (_, i) => ({ t: i, v: baseHr + Math.round((Math.random()-0.5)*4) })));
  useEffect(() => {
    const t = setInterval(() => {
      const newHr = Math.max(60, Math.min(120, hr + Math.round((Math.random()-0.5)*3)));
      setHr(newHr);
      setHistory(h => [...h.slice(1), { t: Date.now(), v: newHr }]);
    }, 2000); return () => clearInterval(t);
  }, [hr]);
  return { hr, history };
}

export default function Main({ patient }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: `${patient.name} 환자의 데이터가 로드되었습니다. 현재 상태에 대해 궁금한 점을 입력하세요.` }]);
  const { hr, history } = useRealtimeVitals(84);
  const [bp, setBp] = useState('142/88');
  const [bt, setBt] = useState('37.6');
  const [editBp, setEditBp] = useState(false);
  const [editBt, setEditBt] = useState(false);

  const send = () => { if (!prompt.trim()) return; setMessages(m => [...m, { role: 'user', text: prompt }]); setPrompt(''); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr 410px', height: 'calc(100vh - 46px)', overflow: 'hidden', background: '#050d1a' }}>
      
      {/* 1. 좌측 패널 */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid rgba(13,217,197,0.15)', background: 'rgba(10,22,40,0.95)', padding: '24px', overflowY: 'auto' }}>
        <SectionLabel icon={<User size={19} color="#0dd9c5"/>}>환자 실시간 차트</SectionLabel>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(13,217,197,0.15), rgba(13,217,197,0.02))', border: '1.5px solid rgba(13,217,197,0.3)', borderRadius: 24, padding: '24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, border: '2px solid #0dd9c5', overflow: 'hidden', boxShadow: '0 0 20px rgba(13,217,197,0.2)' }}>
              <img src={patient.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{patient.name} <span style={{ fontSize: 15, color: '#0dd9c5', fontWeight: 400 }}>{patient.id}</span></div>
              <div style={{ fontSize: 18, color: '#8da2c0', marginTop: 4 }}>{patient.role} · {patient.age}세 · {patient.blood}형</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 15 }}>
            <InfoItem label="생년월일" value={patient.dob} />
            <InfoItem label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`} />
            <div style={{ gridColumn: 'span 2', padding: '12px', background: 'rgba(255,77,109,0.1)', borderRadius: 12, border: '1px solid rgba(255,77,109,0.2)' }}>
              <div style={{ fontSize: 12, color: '#ff4d6d', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>발생 위치</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{patient.location}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <MedicalCard icon={<AlertCircle size={17} color="#ff9f43"/>} label="보유 질환" value={patient.chronic} color="#ff9f43" />
          <MedicalCard icon={<AlertCircle size={17} color="#ff4d6d"/>} label="알레르기" value={patient.allergies} color="#ff4d6d" />
          <MedicalCard icon={<Pill size={17} color="#0dd9c5"/>} label="최근 투약" value={patient.lastMed} color="#0dd9c5" />
        </div>

        <SectionLabel icon={<Activity size={19} color="#0dd9c5"/>}>주요 바이탈</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <MainVitalBox label="심박수(실시간)" value={hr} unit="bpm" color="#ff4d6d" icon={<Heart size={15}/>} />
          <MainVitalBox label="산소포화도(실시간)" value="96" unit="%" color="#00d2ff" icon={<Droplets size={15}/>} />
          <ManualVitalBox label="혈압" value={bp} unit="mmHg" color="#a55eea" isEditing={editBp} setIsEditing={setEditBp} onSave={setBp} />
          <ManualVitalBox label="체온" value={bt} unit="°C" color="#ff9f43" isEditing={editBt} setIsEditing={setEditBt} onSave={setBt} />
        </div>
      </div>

      {/* 2. 중앙 패널 */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1.5px solid rgba(13,217,197,0.15)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 30px', background: 'rgba(10,22,40,0.8)', borderBottom: '1.5px solid rgba(13,217,197,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Activity size={20} color="#ff4d6d" />
          <span style={{ fontSize: 19, fontWeight: 900 }}>EMERGENCY RESPONSE DASHBOARD</span>
          <div style={{ marginLeft: 'auto', background: 'rgba(255,77,109,0.15)', padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,77,109,0.3)' }}><span style={{ fontSize: 14, color: '#ff4d6d', fontWeight: 900 }}>GOLDEN TIME: 42MIN</span></div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '30px' }}>
          <SectionLabel icon={<Clock size={19}/>}>실시간 대응 타임라인</SectionLabel>
          <div style={{ position: 'relative', marginLeft: '12px' }}>
            <div style={{ position: 'absolute', left: 50, top: 0, bottom: 0, width: 2, background: 'rgba(13,217,197,0.1)' }} />
            {TIMELINE_DATA.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 30 }}>
                <div style={{ width: 50, fontSize: 15, fontWeight: 700, color: '#4a6080', paddingTop: '16px' }}>{e.time}</div>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: e.color, zIndex: 1, marginTop: '18px', border: '4px solid #050d1a' }} />
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(13,217,197,0.1)', borderRadius: 16, padding: '18px 24px' }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: i === 0 ? e.color : '#fff' }}>{e.label}</div>
                  <div style={{ fontSize: 16, color: '#8da2c0', marginTop: 6 }}>{e.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant 디자인 강화 */}
        <div style={{ padding: '40px 30px 60px', background: 'linear-gradient(to top, #0a1628, transparent)' }}>
          <div style={{ display: 'flex', gap: 15, background: 'rgba(15,32,64,0.9)', padding: '10px', borderRadius: 24, border: '2px solid rgba(13,217,197,0.4)', boxShadow: '0 0 35px rgba(13,217,197,0.2)', backdropFilter: 'blur(15px)' }}>
            <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', color: '#0dd9c5' }}><Sparkles size={24} /></div>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="증상을 입력하면 AI가 실시간으로 분석합니다..." style={{ flex: 1, background: 'none', border: 'none', padding: '15px 5px', color: '#fff', fontSize: 18, outline: 'none' }} />
            <button onClick={send} style={{ width: 60, height: 60, borderRadius: 18, background: '#0dd9c5', border: 'none', color: '#050d1a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseDown={e => e.currentTarget.style.transform='scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
              <Send size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 우측 패널 */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(10,22,40,0.5)', padding: '24px', overflowY: 'auto' }}>
        <SectionLabel icon={<ClipboardList size={19} color="#0dd9c5"/>}>임상 기록 및 지원</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 30 }}>
          <div style={{ padding: '18px', borderRadius: 18, background: 'rgba(13,217,197,0.05)', border: '1px solid rgba(13,217,197,0.15)' }}>
            <div style={{ fontSize: 14, color: '#0dd9c5', fontWeight: 800, marginBottom: 8 }}>의사 지시 사항</div>
            <div style={{ fontSize: 16, color: '#fff', lineHeight: 1.6 }}>"심근경색 프로토콜 유지, 15분 간격으로 혈압 및 심전도 재전송 요망"</div>
          </div>
        </div>
        <SectionLabel icon={<Sparkles size={19} color="#0dd9c5"/>}>AI 의료 분석</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ padding: '18px', borderRadius: 18, background: m.role === 'ai' ? 'rgba(13,217,197,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 17, lineHeight: 1.7, color: m.role === 'ai' ? '#e8f0fe' : '#8da2c0' }}>{m.text}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div style={{ paddingBottom: 10 }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 19, color: '#fff', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function MedicalCard({ icon, label, value, color }) {
  return (
    <div style={{ padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 15 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, color: '#4a6080', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}

function MainVitalBox({ label, value, unit, color, icon }) {
  return (
    <div style={{ padding: '15px 10px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, right: 10, width: 6, height: 6, borderRadius: '50%', background: color, animation: 'pulse-dot 1.2s infinite' }} />
      <div style={{ fontSize: 13, color: '#8da2c0', fontWeight: 700, marginBottom: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#4a6080' }}>{unit}</div>
    </div>
  )
}

function ManualVitalBox({ label, value, unit, color, isEditing, setIsEditing, onSave }) {
  const [temp, setTemp] = useState(value);
  return (
    <div onClick={() => !isEditing && setIsEditing(true)} style={{ padding: '15px 10px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${isEditing ? '#0dd9c5' : 'rgba(255,255,255,0.08)'}`, textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', top: 8, right: 10 }}>{isEditing ? <Check size={14} color="#0dd9c5" /> : <Edit3 size={12} color="#4a6080" />}</div>
      <div style={{ fontSize: 13, color: '#8da2c0', fontWeight: 700, marginBottom: 5 }}>{label}</div>
      {isEditing ? (
        <input autoFocus value={temp} onChange={e => setTemp(e.target.value)} onBlur={() => { onSave(temp); setIsEditing(false); }} onKeyDown={e => e.key === 'Enter' && (onSave(temp), setIsEditing(false))} style={{ width: '80%', background: 'none', border: 'none', borderBottom: '2px solid #0dd9c5', color: '#fff', fontSize: 21, fontWeight: 900, textAlign: 'center', outline: 'none' }} />
      ) : (
        <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      )}
      <div style={{ fontSize: 12, color: '#4a6080' }}>{unit}</div>
    </div>
  )
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 900, color: '#0dd9c5', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{icon} {children}</div>
  )
}
