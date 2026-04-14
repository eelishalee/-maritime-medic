import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, Heart, Droplets, Thermometer, Activity, Zap, Shield, ChevronRight, RotateCcw } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts'

const RISK_SCORE = 72

const DIAGNOSES = [
  { confidence: 94, title: '급성 심근경색 의심', icd: 'I21.9', severity: 'critical', color: '#ff4d6d', desc: '흉통, 호흡곤란, 혈압 상승(158/95) 및 고혈압·고지혈증 병력을 종합적으로 분석한 결과 급성 심근경색 가능성이 매우 높습니다.', actions: ['즉시 원격 진료 연결', '12유도 심전도 측정', 'CPR 장비 대기', '아스피린 알레르기 — 클로피도그렐 대체 검토'] },
  { confidence: 61, title: '고혈압성 위기', icd: 'I10', severity: 'high', color: '#ff9f43', desc: '수축기 혈압 158mmHg 이상으로 고혈압성 긴급증 범위에 해당합니다. 기존 고혈압 병력 및 미복약 가능성을 고려해야 합니다.', actions: ['혈압 15분 간격 재측정', '안정 취하게 하기', '암로디핀 복용 확인', '신경학적 증상 모니터링'] },
  { confidence: 38, title: '불안정 협심증', icd: 'I20.0', severity: 'medium', color: '#a55eea', desc: '안정 시에도 지속되는 흉통과 ST 변화 가능성을 고려합니다. 심근경색과 감별 진단이 필요합니다.', actions: ['안정 취하게 하기', '산소포화도 지속 모니터링', '니트로글리세린 투여 검토'] }
]

const VITAL_ANALYSIS = [
  { label: '심박수', value: 96, unit: 'bpm', normal: '60-100', status: 'warn', trend: 'up', icon: <Heart size={20}/>, color: '#ff9f43' },
  { label: '수축기 혈압', value: 158, unit: 'mmHg', normal: '<120', status: 'critical', trend: 'up', icon: <Activity size={20}/>, color: '#ff4d6d' },
  { label: '산소포화도', value: 94, unit: '%', normal: '95-100', status: 'warn', trend: 'down', icon: <Droplets size={20}/>, color: '#ff9f43' },
  { label: '체온', value: 37.6, unit: '°C', normal: '36.5-37.5', status: 'warn', trend: 'up', icon: <Thermometer size={20}/>, color: '#ff9f43' }
]

const RADAR_DATA = [
  { sub: '심장', val: 28 }, { sub: '혈압', val: 22 }, { sub: '호흡', val: 55 }, { sub: '체온', val: 62 }, { sub: '산소', val: 50 }, { sub: '의식', val: 85 }
]

const TREND_DATA = [
  { t: '08:00', hr: 78, bp: 142 }, { t: '08:15', hr: 80, bp: 145 }, { t: '08:30', hr: 82, bp: 148 }, { t: '08:45', hr: 85, bp: 150 }, { t: '09:00', hr: 89, bp: 153 }, { t: '09:15', hr: 93, bp: 156 }, { t: '09:30', hr: 96, bp: 158 }
]

const SEV_LABEL = { critical: '위험', high: '주의', medium: '경계', low: '정상' }

export default function AIAnalysis({ patient }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [scanning, setScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  useEffect(() => { const t = setInterval(() => { setProgress(p => { if (p >= 100) { setScanning(false); clearInterval(t); return 100 }; return p + 4 }) }, 60); return () => clearInterval(t) }, [])
  const rescan = () => { setScanning(true); setProgress(0) }

  if (scanning && progress < 100) {
    return (
      <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050d1a', gap: 40 }}>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <svg width="200" height="200" style={{ position: 'absolute' }}>
            <circle cx="100" cy="100" r="90" stroke="rgba(13,217,197,0.1)" strokeWidth="8" fill="none"/>
            <circle cx="100" cy="100" r="90" stroke="#0dd9c5" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s', transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Brain size={48} color="#0dd9c5" style={{ animation: 'pulse-dot 1s infinite' }} /><span style={{ fontSize: 32, fontWeight: 950, color: '#0dd9c5' }}>{progress}%</span></div>
        </div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 950, color: '#fff', marginBottom: 12 }}>AI 심층 분석 및 추론 중...</div><div style={{ fontSize: 18, color: '#8da2c0' }}>{progress < 30 ? '바이탈 실시간 데이터 패킷 수집 중' : progress < 60 ? '딥러닝 기반 병력 데이터 상관관계 분석' : progress < 85 ? '멀티모달 진단 모델 추론 중' : '최종 리포트 및 조치 사항 생성 중'}</div></div>
      </div>
    )
  }

  const diag = DIAGNOSES[activeIdx]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr 400px', height: 'calc(100vh - 72px)', overflow: 'hidden', background: '#050d1a' }}>
      <div style={{ borderRight: '1.5px solid rgba(13,217,197,0.15)', background: 'rgba(10,22,40,0.95)', padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Brain size={24} color="#0dd9c5" /><span style={{ fontSize: 20, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '1px' }}>AI 종합 분석 리포트</span><button onClick={rescan} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 10, background: 'rgba(13,217,197,0.1)', border: '1px solid rgba(13,217,197,0.3)', color: '#0dd9c5', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><RotateCcw size={14} /> 재분석</button></div>
        <RiskGauge score={RISK_SCORE} />
        <div style={{ padding: '18px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}><div style={{ fontSize: 13, color: '#4a6080', fontWeight: 800, marginBottom: 10, textTransform: 'uppercase' }}>분석 대상 정보</div><div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{patient?.name || '김항해'}</div><div style={{ fontSize: 16, color: '#8da2c0', marginTop: 4 }}>{patient?.age || 55}세 · {patient?.role || '기관장'} · {patient?.blood || 'A+'}형</div><div style={{ fontSize: 14, color: '#ff9f43', marginTop: 8, fontWeight: 700 }}>⚠ 병력: {patient?.chronic || '고혈압, 고지혈증'}</div></div>
        <div style={{ fontSize: 14, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '1px' }}>감별 진단 후보</div>
        {DIAGNOSES.map((d, i) => (<button key={i} onClick={() => setActiveIdx(i)} style={{ padding: '20px', borderRadius: 20, textAlign: 'left', cursor: 'pointer', width: '100%', background: activeIdx === i ? `${d.color}15` : 'rgba(255,255,255,0.02)', border: `2px solid ${activeIdx === i ? d.color : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.2s' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}><ConfidenceBadge value={d.confidence} color={d.color} /><span style={{ fontSize: 17, fontWeight: 900, color: activeIdx === i ? '#fff' : '#8da2c0' }}>{d.title}</span></div><div style={{ display: 'flex', gap: 10 }}><span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: `${d.color}20`, color: d.color, fontWeight: 800 }}>{SEV_LABEL[d.severity]}</span><span style={{ fontSize: 12, color: '#4a6080', fontWeight: 700 }}>ICD-10: {d.icd}</span></div></button>))}
      </div>
      <div style={{ borderRight: '1.5px solid rgba(13,217,197,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '32px 40px', background: `linear-gradient(135deg, ${diag.color}15, rgba(10,22,40,0.9))`, borderBottom: `2px solid ${diag.color}30` }}><div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}><div style={{ width: 60, height: 60, borderRadius: 18, background: `${diag.color}20`, border: `2px solid ${diag.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={32} color={diag.color} /></div><div><div style={{ fontSize: 26, fontWeight: 950, color: '#fff' }}>{diag.title}</div><div style={{ display: 'flex', gap: 10, marginTop: 6 }}><span style={{ fontSize: 14, padding: '4px 14px', borderRadius: 8, background: `${diag.color}25`, color: diag.color, fontWeight: 800 }}>{SEV_LABEL[diag.severity]} 수준</span><span style={{ fontSize: 14, padding: '4px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#8da2c0', fontWeight: 800 }}>AI 신뢰도 {diag.confidence}%</span></div></div></div><p style={{ fontSize: 18, color: '#8da2c0', lineHeight: 1.7, fontWeight: 500 }}>{diag.desc}</p></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}><div style={{ marginBottom: 40 }}><div style={{ fontSize: 16, fontWeight: 950, color: diag.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>권고 즉각 조치 사항</div><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{diag.actions.map((a, i) => (<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, padding: '20px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}><div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `${diag.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 950, color: diag.color }}>{i + 1}</div><span style={{ fontSize: 19, color: '#e8f0fe', lineHeight: 1.6, fontWeight: 600 }}>{a}</span></div>))}</div></div><div><div style={{ fontSize: 16, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>바이탈 정밀 추이 분석</div><div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '24px' }}><ResponsiveContainer width="100%" height={220}><LineChart data={TREND_DATA}><XAxis dataKey="t" tick={{ fill: '#4a6080', fontSize: 14 }} axisLine={false} tickLine={false} /><YAxis yAxisId="hr" domain={[60, 120]} tick={{ fill: '#4a6080', fontSize: 14 }} axisLine={false} tickLine={false} width={40} /><YAxis yAxisId="bp" orientation="right" domain={[120, 180]} tick={{ fill: '#4a6080', fontSize: 14 }} axisLine={false} tickLine={false} width={45} /><Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(13,217,197,0.2)', borderRadius: 14, fontSize: 15 }} /><Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#ff4d6d" strokeWidth={4} dot={{ r: 5, fill: '#ff4d6d' }} name="심박수" /><Line yAxisId="bp" type="monotone" dataKey="bp" stroke="#ff9f43" strokeWidth={4} dot={{ r: 5, fill: '#ff9f43' }} name="수축기혈압" /></LineChart></ResponsiveContainer><div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 12 }}><LegendDot color="#ff4d6d" label="심박수 (bpm)" /><LegendDot color="#ff9f43" label="수축기 혈압 (mmHg)" /></div></div></div></div>
      </div>
      <div style={{ padding: '28px', overflowY: 'auto', background: 'rgba(10,22,40,0.5)', display: 'flex', flexDirection: 'column', gap: 24 }}><div style={{ fontSize: 16, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '1px' }}>항목별 상세 분석</div>{VITAL_ANALYSIS.map((v, i) => (<VitalAnalysisCard key={i} {...v} />))}<div style={{ padding: '24px', borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}><div style={{ fontSize: 14, fontWeight: 900, color: '#8da2c0', marginBottom: 10, textTransform: 'uppercase' }}>신체 기능 레이더 차트</div><ResponsiveContainer width="100%" height={220}><RadarChart data={RADAR_DATA}><PolarGrid stroke="rgba(13,217,197,0.12)" /><PolarAngleAxis dataKey="sub" tick={{ fill: '#4a6080', fontSize: 14, fontWeight: 700 }} /><Radar dataKey="val" stroke="#ff4d6d" fill="#ff4d6d" fillOpacity={0.2} strokeWidth={3} /></RadarChart></ResponsiveContainer></div><div style={{ padding: '24px', borderRadius: 24, background: 'rgba(13,217,197,0.08)', border: '1.5px solid rgba(13,217,197,0.25)' }}><div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}><Shield size={22} color="#0dd9c5" /><span style={{ fontSize: 16, fontWeight: 950, color: '#0dd9c5', textTransform: 'uppercase' }}>AI 최종 종합 판정</span></div><p style={{ fontSize: 17, color: '#e8f0fe', lineHeight: 1.7, fontWeight: 600 }}>환자의 현재 위험도는 <span style={{ color: '#ff4d6d', fontWeight: 900 }}>극심(72/100)</span> 단계입니다. 다수의 바이탈 지표가 급성 관상동맥 증후군 가능성을 가리키고 있습니다. 1초가 급한 상황이므로 즉각적인 응급 처치 돌입을 권고합니다.</p></div></div>
    </div>
  )
}

function RiskGauge({ score }) {
  const color = score >= 70 ? '#ff4d6d' : score >= 40 ? '#ff9f43' : '#26de81'
  return (
    <div style={{ padding: '32px 24px', borderRadius: 24, textAlign: 'center', background: `linear-gradient(135deg, ${color}15, rgba(10,22,40,0.8))`, border: `2px solid ${color}35` }}>
      <div style={{ position: 'relative', width: 180, height: 100, margin: '0 auto 16px' }}><svg width="180" height="100" viewBox="0 0 140 80"><path d="M 10 80 A 60 60 0 0 1 130 80" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" strokeLinecap="round" /><path d="M 10 80 A 60 60 0 0 1 130 80" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="188" strokeDashoffset={`${188 * (1 - score / 100)}`} style={{ transition: 'stroke-dashoffset 1.5s ease' }} /></svg><div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}><div style={{ fontSize: 44, fontWeight: 950, color, lineHeight: 1 }}>{score}</div><div style={{ fontSize: 14, color: '#4a6080', fontWeight: 800 }}>/ 100</div></div></div>
      <div style={{ fontSize: 20, fontWeight: 950, color }}>{score >= 70 ? '위험 — 즉각 처치 및 보고' : '주의 관찰 필요'}</div><div style={{ fontSize: 14, color: '#4a6080', marginTop: 6, fontWeight: 700 }}>종합 생존 지표 점수</div>
    </div>
  )
}

function ConfidenceBadge({ value, color }) { return (<div style={{ minWidth: 60, padding: '4px 10px', borderRadius: 8, background: `${color}25`, textAlign: 'center' }}><span style={{ fontSize: 16, fontWeight: 950, color }}>{value}%</span></div>) }

function VitalAnalysisCard({ label, value, unit, normal, status, trend, icon, color }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus; const trendColor = status === 'normal' ? '#26de81' : status === 'warn' ? '#ff9f43' : '#ff4d6d'
  return (
    <div style={{ padding: '18px 20px', borderRadius: 18, background: status === 'critical' ? 'rgba(255,77,109,0.1)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${status === 'critical' ? 'rgba(255,77,109,0.35)' : 'rgba(255,255,255,0.08)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, color: '#4a6080', fontWeight: 800 }}>{label}</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span style={{ fontSize: 24, fontWeight: 950, color }}>{value}</span><span style={{ fontSize: 14, color: '#4a6080', fontWeight: 700 }}>{unit}</span></div></div><div style={{ textAlign: 'right' }}><TrendIcon size={22} color={trendColor} /><div style={{ fontSize: 12, color: '#4a6080', marginTop: 4, fontWeight: 700 }}>정상: {normal}</div></div></div>
    </div>
  )
}

function LegendDot({ color, label }) { return (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 14, height: 4, borderRadius: 2, background: color }} /><span style={{ fontSize: 13, color: '#4a6080', fontWeight: 700 }}>{label}</span></div>) }
