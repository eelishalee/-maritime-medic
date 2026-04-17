import { useState, useEffect } from 'react'
import { Brain, Heart, Zap, Shield, Cpu, AlertCircle, Wind, Clock, Video, Pill, History, User, Info, Activity, Scissors, Plus, Thermometer, Mic, X, ChevronRight, HeartPulse, ChevronLeft, CheckCircle2, AlertTriangle, ArrowDown, FileText, Ruler, Droplets, MapPin, Phone, Upload } from 'lucide-react'
import { InfoItem } from '../components/ui'

const ACTION_GUIDES = {
  '약물 투여': {
    title: '약물 투여 가이드',
    steps: ['아스피린 알레르기 재확인 (금기)', '케토로락 30mg 근주 상태 확인', '추가 진통제 필요시 원격 지시 대기', '투여 시간 및 용량 기록'],
    warning: '호흡 억제 위험이 있는 마약성 진통제는 신중히 결정하십시오.',
    color: '#38bdf8'
  },
  '소독/처치': {
    title: '외상 소독 및 드레싱',
    steps: ['멸균 식염수로 상처 부위 세척', '포비돈 요오드 또는 클로르헥시딘 소독', '거즈 드레싱 및 탄력 붕대 고정', '삼각건을 이용한 상지 거상'],
    warning: '깊은 자상은 직접 압박 외 내부에 이물질을 넣지 마십시오.',
    color: '#38bdf8'
  },
  '부목 고정': {
    title: '골절 부위 고정 프로토콜',
    steps: ['좌측 어깨 8자 붕대 고정 (쇄골)', '흉부 탄력 붕대 보조 고정 (늑골)', '환자 편안한 호흡 상태 확인', '척추 보드 이송 준비'],
    warning: '흉부 고정을 너무 강하게 하여 호흡을 방해하지 않도록 주의하십시오.',
    color: '#38bdf8'
  },
  '지혈/압박': {
    title: '출혈 관리 및 압박 지혈',
    steps: ['출혈 부위 직접 압박 (5분 이상)', '압박 붕대 적용', '지혈대 사용 여부 검토', '말단 부위 혈액 순환 확인'],
    warning: '지혈대 사용 시 반드시 시간을 기록하고 눈에 띄게 표시하십시오.',
    color: '#38bdf8'
  },
  '기도 확보': {
    title: '기도 유지 및 산소 공급',
    steps: ['두부후굴 하악거상법 시행', '비재호흡 마스크 15L/min 유지', '구강 내 이물질 제거', 'SpO2 95% 이상 목표 유지'],
    warning: '경추 손상이 의심되므로 턱 밀어올리기(Jaw-thrust)를 권장합니다.',
    color: '#38bdf8'
  }
}

function ActionIllustration({ type }) {
  const S = { width: '100%', height: '100%' }
  const Grid = () => (
    <g opacity="0.1"><circle cx="100" cy="100" r="80" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2 2" /><line x1="20" y1="100" x2="180" y2="100" stroke="#fff" strokeWidth="0.5" /><line x1="100" y1="20" x2="100" y2="180" stroke="#fff" strokeWidth="0.5" /></g>
  )
  if (type === '지혈/압박') return (
    <svg viewBox="0 0 200 200" style={S}><Grid /><circle cx="80" cy="90" r="30" fill="rgba(255,59,92,0.2)"><animate attributeName="r" values="25;40;25" dur="1.5s" repeatCount="indefinite" /></circle><circle cx="80" cy="90" r="8" fill="#ff3b5c" /><text x="100" y="175" fill="#ff3b5c" fontSize="11" fontWeight="950" textAnchor="middle">DIRECT COMPRESSION</text></svg>
  )
  if (type === '기도 확보') return (
    <svg viewBox="0 0 200 200" style={S}><Grid /><path d="M120 50 Q130 90 100 140" fill="none" stroke="#00d4aa" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 5"><animate attributeName="stroke-dashoffset" values="50;0" dur="1s" repeatCount="indefinite" /></path><text x="100" y="175" fill="#00d4aa" fontSize="11" fontWeight="950" textAnchor="middle">AIRWAY OPTIMIZATION</text></svg>
  )
  if (type === '약물 투여') return (
    <svg viewBox="0 0 200 200" style={S}><Grid /><rect x="92" y="40" width="16" height="70" rx="2" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="1.5" /><circle cx="100" cy="145" r="3" fill="#38bdf8"><animate attributeName="cy" values="145;165" dur="1s" repeatCount="indefinite" /></circle><text x="100" y="185" fill="#38bdf8" fontSize="11" fontWeight="950" textAnchor="middle">MEDICATION INFUSION</text></svg>
  )
  return <svg viewBox="0 0 200 200" style={S}><Grid /><path d="M100 70 L100 130 M70 100 L130 100" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" /></svg>
}

export default function Emergency({ patient }) {
  const [isScanning, setIsScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [activeAction, setActiveAction] = useState(null)

  useEffect(() => {
    // 1. 진입 시 AI 추론 로딩 시뮬레이션
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsScanning(false)
          clearInterval(t)
          setReady(true)
          return 100
        }
        return p + 4
      })
    }, 40)
    return () => clearInterval(t)
  }, [])

  const handleSendResults = () => {
    setIsSent(true)
    setTimeout(() => setIsSent(false), 3000)
  }

  // 로딩(추론) 화면
  if (isScanning) {
    return (
      <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', gap: 30 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <img src="/CE.jpeg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', opacity: 0.3, filter: 'grayscale(0.5) brightness(1.2)' }} />
          <svg width="220" height="220" style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle cx="110" cy="110" r="100" stroke="rgba(56,189,248,0.1)" strokeWidth="10" fill="none"/>
            <circle cx="110" cy="110" r="100" stroke="#38bdf8" strokeWidth="10" fill="none" strokeDasharray={`${2 * Math.PI * 100}`} strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Brain size={48} color="#38bdf8" /><span style={{ fontSize: 36, fontWeight: 950, color: '#38bdf8' }}>{progress}%</span></div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 950, color: '#fff', marginBottom: 10 }}>AI 멀티모달 추론 및 처치 생성 중...</div>
          <div style={{ fontSize: 16, color: '#64748b' }}>이미지 특징 추출 및 실시간 생체 신호 데이터 가중치 융합 중</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', background: '#020617', color: '#fff', fontFamily: '"Pretendard", sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #020617 98%)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '420px 1.2fr 440px', gridTemplateRows: '1fr auto', gap: '20px', padding: '20px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* [LEFT] 긴급 경고 및 바이탈 센서 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', border: '2px solid #b91c1c', borderRadius: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f87171', marginBottom: 8 }}><AlertCircle size={20} /><span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px' }}>긴급 경보 (CRITICAL)</span></div>
            <div style={{ fontSize: '20px', fontWeight: 950 }}>아스피린 절대 금기</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>과거 병력: 아나필락시스 쇼크 반응</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px', backdropFilter: 'blur(20px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><Activity size={18} color="#ff3b5c"/><span style={{ fontSize: '14px', fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>정밀 생체 모니터링 (BPM)</span></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}><span style={{ fontSize: '72px', fontWeight: 950, color: '#ff3b5c', lineHeight: 1 }}>96</span><span style={{ fontSize: '24px', color: '#64748b', fontWeight: 800 }}>BPM</span><div style={{ marginLeft: 'auto', background: 'rgba(0, 212, 170, 0.15)', color: '#00d4aa', padding: '4px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 900 }}>상승 추세</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <VitalMiniCard label="산소포화도" value="94" unit="%" color="#00aaff" status="위험" />
              <VitalMiniCard label="호흡수" value="24" unit="/min" color="#00d4aa" status="빈호흡" />
              <VitalMiniCard label="혈압" value="158/95" unit="mmHg" color="#c084fc" status="높음" isBP />
              <VitalMiniCard label="체온" value="37.6" unit="°C" color="#ff6a00" status="미열" />
            </div>
          </div>
        </section>

        {/* [CENTER] 통합 리포트 & 가이드 (중앙 레이아웃 최대한 활용) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
          {/* 상단 리포트 박스 (고정) */}
          <div style={{ position: 'relative', padding: '1.5px', borderRadius: '24px', overflow: 'hidden', background: 'rgba(56, 189, 248, 0.1)', flexShrink: 0, height: '110px' }}>
            <div style={{ position: 'absolute', inset: '-50%', background: 'conic-gradient(from 0deg, transparent 70%, #38bdf8 85%, transparent 100%)', animation: 'spin 4s linear infinite' }} />
            <div style={{ position: 'relative', zIndex: 1, background: 'rgba(15, 23, 42, 0.96)', borderRadius: '23px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24, height: '100%' }}>
              <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(56, 189, 248, 0.2)' }}><Brain size={36} color="#38bdf8" /></div>
              <div style={{ flex: 1 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}><span style={{ fontSize: '12px', fontWeight: 900, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>AI Integrated Report</span><span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,59,92,0.1)', color: '#ff3b5c', fontWeight: 900 }}>CONFIDENCE 91%</span></div><div style={{ fontSize: '24px', fontWeight: 950, color: '#fff' }}>다발성 늑골 골절 및 외상성 기흉 의심</div></div>
            </div>
          </div>

          {/* 중앙 가이드 콘텐츠 영역 */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {activeAction ? (
              <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}><ActionIllustration type={activeAction} /></div>
                  <div style={{ textAlign: 'center', background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}><div style={{ fontSize: '15px', color: '#38bdf8', fontWeight: 950 }}>{activeAction} 가이드 가동 중</div></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}><h3 style={{ fontSize: '32px', fontWeight: 950, color: '#fff', margin: 0 }}>{ACTION_GUIDES[activeAction].title}</h3><button onClick={() => setActiveAction(null)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={24}/></button></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 30 }}>
                    {ACTION_GUIDES[activeAction].steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}><div style={{ width: 28, height: 28, borderRadius: '8px', background: '#38bdf8', color: '#020617', fontSize: '16px', fontWeight: 950, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div><p style={{ fontSize: '20px', color: '#e2e8f0', margin: 0, fontWeight: 700 }}>{step}</p></div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', background: 'rgba(13, 217, 197, 0.05)', borderRadius: '20px', padding: '20px', border: '1.5px solid rgba(13, 217, 197, 0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#0dd9c5' }}><FileText size={20} /><span style={{ fontSize: '13px', fontWeight: 950, letterSpacing: '2px' }}>REAL-TIME SESSION LOG</span></div>
                    <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>• {activeAction} 개시 및 시스템 자동 기록 중</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 950, letterSpacing: '5px', marginBottom: '16px' }}>MDTS MISSION CONTROL CENTER</div>
                <div style={{ fontSize: '42px', fontWeight: 950, letterSpacing: '-1px', marginBottom: '40px' }}>응급 처치 액션 대기 중</div>
                <button onClick={handleSendResults} style={{ background: isSent ? '#00d4aa' : '#38bdf8', padding: '28px 72px', borderRadius: '60px', fontSize: '26px', fontWeight: 950, color: '#020617', cursor: 'pointer', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', transition: '0.3s' }}>{isSent ? '데이터 전송 완료' : '전체 처치 리포트 전송'}</button>
              </div>
            )}
          </div>
        </section>

        {/* [RIGHT] 환자 기록 패널 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ flexShrink: 0, padding: '24px', borderRadius: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: '20px', background: '#fff', border: '2px solid #38bdf8', overflow: 'hidden' }}><img src={patient?.avatar || '/CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><div style={{ fontSize: '28px', fontWeight: 950 }}>{patient?.name}</div><div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>{patient?.role}</div></div>
                <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginTop: 4 }}>ID : {patient?.id}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 4 }}>나이/성별</div><div style={{ fontSize: '22px', fontWeight: 900 }}>{patient?.age}세 / 남</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 4 }}>혈액형</div><div style={{ fontSize: '22px', fontWeight: 900 }}>{patient?.blood}</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: '18px', fontWeight: 900, marginBottom: 14 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{(patient?.allergies || '없음').split(',').map((a, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} /><span style={{ fontSize: '17.5px', fontWeight: 800, color: '#fda4af' }}>{a.trim()}</span></div>))}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: '18px', fontWeight: 900, marginBottom: 20 }}><Droplets size={20}/> 투약/처치 로그</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{[{ time: '09:52', action: '생리식염수 500mL 투여' }, { time: '09:22', action: '케토로락 30mg 근주' }, { time: '09:20', action: '산소 15L/min 공급' }].map((log, i) => (
                <div key={i} style={{ borderLeft: '3px solid rgba(56,189,248,0.4)', paddingLeft: 16 }}><div style={{ fontSize: '17.5px', fontWeight: 800, color: '#e2e8f0' }}>{log.time} — {log.action}</div></div>
              ))}
            </div>
          </div>
        </aside>

        {/* [BOTTOM] ACTION SELECTOR */}
        <section style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, paddingTop: '10px' }}>
          {Object.keys(ACTION_GUIDES).map(key => (<ActionButton key={key} icon={getActionIcon(key)} label={key} desc="가이드 보기" onClick={() => setActiveAction(key)} />))}
        </section>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .action-btn:hover { transform: translateY(-5px); filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>
    </div>
  )
}

function getActionIcon(label) {
  if (label === '약물 투여') return <Pill size={22} />
  if (label === '소독/처치') return <Scissors size={22} />
  if (label === '부목 고정') return <Shield size={22} />
  if (label === '지혈/압박') return <Zap size={22} />
  if (label === '기도 확보') return <Wind size={22} />
  return <History size={22} />
}

function VitalMiniCard({ label, value, unit, color, status, isBP }) {
  // 혈압 수치 개행 처리
  const displayValue = isBP ? value.replace('/', '/\n') : value
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.05)', 
      borderRadius: '20px', 
      padding: '16px 18px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4px' 
    }}>
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.3px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ 
          background: status === '정상' ? `${color}15` : 'rgba(255, 59, 92, 0.15)', 
          color: status === '정상' ? color : '#ff3b5c', 
          padding: '4px 10px', 
          borderRadius: '8px', 
          fontSize: '12px', 
          fontWeight: 900, 
          marginBottom: '4px' 
        }}>{status}</div>
        <div style={{ 
          textAlign: 'right', 
          display: 'flex', 
          alignItems: 'baseline', 
          justifyContent: 'flex-end', 
          gap: 4 
        }}>
          <div style={{ 
            fontSize: isBP ? '30px' : '40px', 
            fontWeight: 950, 
            color: color, 
            lineHeight: 1.05, 
            whiteSpace: 'pre-line',
            letterSpacing: '-1px'
          }}>{displayValue}</div>
          <span style={{ 
            fontSize: isBP ? '13px' : '16px', 
            color: color, 
            opacity: 0.6, 
            fontWeight: 800,
            marginBottom: isBP ? '2px' : '0px'
          }}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon, label, desc, onClick }) {
  return (
    <button className="action-btn" onClick={onClick} style={{ 
      position: 'relative', background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '18px 24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 20px rgba(56,189,248,0.2)', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)', pointerEvents: 'none' }} />
      <div style={{ color: '#020617', opacity: 0.9, flexShrink: 0 }}>{icon}</div>
      <div style={{ textAlign: 'left', zIndex: 1 }}><div style={{ fontSize: '22px', fontWeight: 950, color: '#020617', whiteSpace: 'nowrap', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{label}</div><div style={{ fontSize: '15px', color: 'rgba(2,6,23,0.6)', fontWeight: 800, marginTop: 2 }}>{desc}</div></div>
    </button>
  )
}
