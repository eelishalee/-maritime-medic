import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, Heart, Droplets, Thermometer, Activity, Zap, Shield, ChevronRight, RotateCcw } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts'

const RISK_SCORE = 72  // 0~100, 높을수록 위험

const DIAGNOSES = [
  {
    confidence: 94,
    title: '급성 심근경색 의심',
    icd: 'I21.9',
    severity: 'critical',
    color: '#ff4d6d',
    desc: '흉통, 호흡곤란, 혈압 상승(158/95) 및 고혈압·고지혈증 병력을 종합적으로 분석한 결과 급성 심근경색 가능성이 매우 높습니다.',
    actions: ['즉시 원격 진료 연결', '12유도 심전도 측정', 'CPR 장비 대기', '아스피린 알레르기 — 클로피도그렐 대체 검토'],
  },
  {
    confidence: 61,
    title: '고혈압성 위기',
    icd: 'I10',
    severity: 'high',
    color: '#ff9f43',
    desc: '수축기 혈압 158mmHg 이상으로 고혈압성 긴급증 범위에 해당합니다. 기존 고혈압 병력 및 미복약 가능성을 고려해야 합니다.',
    actions: ['혈압 15분 간격 재측정', '안정 취하게 하기', '암로디핀 복용 확인', '신경학적 증상 모니터링'],
  },
  {
    confidence: 38,
    title: '불안정 협심증',
    icd: 'I20.0',
    severity: 'medium',
    color: '#a55eea',
    desc: '안정 시에도 지속되는 흉통과 ST 변화 가능성을 고려합니다. 심근경색과 감별 진단이 필요합니다.',
    actions: ['안정 취하게 하기', '산소포화도 지속 모니터링', '니트로글리세린 투여 검토'],
  },
]

const VITAL_ANALYSIS = [
  { label: '심박수', value: 96, unit: 'bpm', normal: '60-100', status: 'warn', trend: 'up', icon: <Heart size={15}/>, color: '#ff9f43' },
  { label: '수축기 혈압', value: 158, unit: 'mmHg', normal: '<120', status: 'critical', trend: 'up', icon: <Activity size={15}/>, color: '#ff4d6d' },
  { label: '산소포화도', value: 94, unit: '%', normal: '95-100', status: 'warn', trend: 'down', icon: <Droplets size={15}/>, color: '#ff9f43' },
  { label: '체온', value: 37.6, unit: '°C', normal: '36.5-37.5', status: 'warn', trend: 'up', icon: <Thermometer size={15}/>, color: '#ff9f43' },
]

const RADAR_DATA = [
  { sub: '심장', val: 28 }, { sub: '혈압', val: 22 }, { sub: '호흡', val: 55 },
  { sub: '체온', val: 62 }, { sub: '산소', val: 50 }, { sub: '의식', val: 85 },
]

const TREND_DATA = [
  { t: '08:00', hr: 78, bp: 142 }, { t: '08:15', hr: 80, bp: 145 },
  { t: '08:30', hr: 82, bp: 148 }, { t: '08:45', hr: 85, bp: 150 },
  { t: '09:00', hr: 89, bp: 153 }, { t: '09:15', hr: 93, bp: 156 },
  { t: '09:30', hr: 96, bp: 158 },
]

const SEV_COLOR = { critical: '#ff4d6d', high: '#ff9f43', medium: '#a55eea', low: '#0dd9c5' }
const SEV_LABEL = { critical: '위험', high: '주의', medium: '경계', low: '정상' }

export default function AIAnalysis({ patient }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [scanning, setScanning] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setScanning(false); clearInterval(t); return 100 }
        return p + 4
      })
    }, 60)
    return () => clearInterval(t)
  }, [])

  const rescan = () => {
    setScanning(true)
    setProgress(0)
  }

  if (scanning && progress < 100) {
    return (
      <div style={{
        height: 'calc(100vh - 46px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#050d1a', gap: 32
      }}>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          {/* 원형 진행 */}
          <svg width="160" height="160" style={{ position: 'absolute' }}>
            <circle cx="80" cy="80" r="70" stroke="rgba(13,217,197,0.1)" strokeWidth="6" fill="none"/>
            <circle
              cx="80" cy="80" r="70"
              stroke="#0dd9c5" strokeWidth="6" fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s', transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <Brain size={36} color="#0dd9c5" style={{ animation: 'pulse-dot 1s infinite' }} />
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0dd9c5' }}>{progress}%</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>AI 분석 중...</div>
          <div style={{ fontSize: 14, color: '#8da2c0' }}>
            {progress < 30 ? '바이탈 데이터 수집 중' :
             progress < 60 ? '병력 데이터 분석 중' :
             progress < 85 ? '진단 모델 추론 중' : '결과 생성 중'}
          </div>
        </div>
      </div>
    )
  }

  const diag = DIAGNOSES[activeIdx]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 340px', height: 'calc(100vh - 46px)', overflow: 'hidden', background: '#050d1a' }}>

      {/* ── 좌측: 위험도 + 진단 목록 ── */}
      <div style={{
        borderRight: '1.5px solid rgba(13,217,197,0.15)',
        background: 'rgba(10,22,40,0.95)',
        padding: '22px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Brain size={20} color="#0dd9c5" />
          <span style={{ fontSize: 15, fontWeight: 900, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '0.6px' }}>AI 종합 분석</span>
          <button
            onClick={rescan}
            style={{
              marginLeft: 'auto', padding: '5px 11px', borderRadius: 8,
              background: 'rgba(13,217,197,0.1)', border: '1px solid rgba(13,217,197,0.3)',
              color: '#0dd9c5', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5
            }}
          >
            <RotateCcw size={11} /> 재분석
          </button>
        </div>

        {/* 위험도 게이지 */}
        <RiskGauge score={RISK_SCORE} />

        {/* 환자 요약 */}
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ fontSize: 11, color: '#4a6080', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>분석 대상</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{patient?.name || '김선원'}</div>
          <div style={{ fontSize: 12, color: '#8da2c0', marginTop: 3 }}>{patient?.age || 55}세 · {patient?.role || '기관장'} · {patient?.blood || 'A+'}형</div>
          <div style={{ fontSize: 11, color: '#ff9f43', marginTop: 6, fontWeight: 600 }}>
            ⚠ 병력: {patient?.chronic || '고혈압, 고지혈증'}
          </div>
        </div>

        {/* 진단 후보 목록 */}
        <div style={{ fontSize: 12, fontWeight: 900, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: -8 }}>
          감별 진단 목록
        </div>
        {DIAGNOSES.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: '15px', borderRadius: 16, textAlign: 'left', cursor: 'pointer', width: '100%',
              background: activeIdx === i ? `${d.color}15` : 'rgba(255,255,255,0.02)',
              border: `1.5px solid ${activeIdx === i ? d.color : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.2s',
              animation: `slideInLeft 0.3s ease ${i * 0.08}s both`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
              <ConfidenceBadge value={d.confidence} color={d.color} />
              <span style={{ fontSize: 13, fontWeight: 800, color: activeIdx === i ? '#fff' : '#8da2c0' }}>{d.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: `${d.color}20`, color: d.color, fontWeight: 700 }}>
                {SEV_LABEL[d.severity]}
              </span>
              <span style={{ fontSize: 10, color: '#4a6080', fontWeight: 600 }}>ICD-10: {d.icd}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── 중앙: 선택된 진단 상세 ── */}
      <div style={{
        borderRight: '1.5px solid rgba(13,217,197,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* 진단 헤더 */}
        <div style={{
          padding: '20px 28px',
          background: `linear-gradient(135deg, ${diag.color}15, rgba(10,22,40,0.9))`,
          borderBottom: `1.5px solid ${diag.color}30`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: `${diag.color}20`, border: `2px solid ${diag.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={22} color={diag.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{diag.title}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 6, background: `${diag.color}25`, color: diag.color, fontWeight: 800 }}>
                  {SEV_LABEL[diag.severity]}
                </span>
                <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#8da2c0', fontWeight: 700 }}>
                  신뢰도 {diag.confidence}%
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#8da2c0', lineHeight: 1.7 }}>{diag.desc}</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {/* 즉각 조치 사항 */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: diag.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
              즉각 조치 사항
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {diag.actions.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animation: `slideInLeft 0.35s ease ${i * 0.08}s both`
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: `${diag.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, color: diag.color
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 14, color: '#e8f0fe', lineHeight: 1.6 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 바이탈 추이 차트 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
              바이탈 추이 (최근 90분)
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={TREND_DATA}>
                  <XAxis dataKey="t" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="hr" domain={[60, 120]} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <YAxis yAxisId="bp" orientation="right" domain={[120, 180]} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip
                    contentStyle={{ background: '#0a1628', border: '1px solid rgba(13,217,197,0.2)', borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: '#8da2c0' }}
                  />
                  <Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#ff4d6d" strokeWidth={2.5} dot={{ r: 3, fill: '#ff4d6d' }} name="심박수" />
                  <Line yAxisId="bp" type="monotone" dataKey="bp" stroke="#ff9f43" strokeWidth={2.5} dot={{ r: 3, fill: '#ff9f43' }} name="수축기혈압" />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
                <LegendDot color="#ff4d6d" label="심박수 (bpm)" />
                <LegendDot color="#ff9f43" label="수축기 혈압 (mmHg)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 우측: 바이탈 분석 + 레이더 ── */}
      <div style={{ padding: '22px', overflowY: 'auto', background: 'rgba(10,22,40,0.5)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          바이탈 분석
        </div>

        {VITAL_ANALYSIS.map((v, i) => (
          <VitalAnalysisCard key={i} {...v} />
        ))}

        {/* 레이더 */}
        <div style={{
          padding: '18px', borderRadius: 18,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#8da2c0', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            신체기능 종합 지수
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(13,217,197,0.12)" />
              <PolarAngleAxis dataKey="sub" tick={{ fill: '#4a6080', fontSize: 11 }} />
              <Radar dataKey="val" stroke="#ff4d6d" fill="#ff4d6d" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#4a6080' }}>
            낮을수록 해당 기능 위험도 높음
          </div>
        </div>

        {/* AI 소견 */}
        <div style={{
          padding: '16px', borderRadius: 16,
          background: 'rgba(13,217,197,0.06)',
          border: '1px solid rgba(13,217,197,0.2)'
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <Shield size={15} color="#0dd9c5" />
            <span style={{ fontSize: 12, fontWeight: 900, color: '#0dd9c5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI 종합 소견</span>
          </div>
          <p style={{ fontSize: 13, color: '#e8f0fe', lineHeight: 1.7 }}>
            환자의 현재 상태는 <span style={{ color: '#ff4d6d', fontWeight: 800 }}>위험 수준 (72/100)</span>으로 평가됩니다.
            급성 심근경색 의심 징후가 복수 항목에서 감지되었습니다.
            즉각적인 원격 의료진 연결과 CPR 준비를 강력히 권고합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function RiskGauge({ score }) {
  const angle = -135 + (score / 100) * 270
  const color = score >= 70 ? '#ff4d6d' : score >= 40 ? '#ff9f43' : '#26de81'

  return (
    <div style={{
      padding: '22px', borderRadius: 18, textAlign: 'center',
      background: `linear-gradient(135deg, ${color}12, rgba(10,22,40,0.8))`,
      border: `1.5px solid ${color}30`
    }}>
      <div style={{ position: 'relative', width: 140, height: 80, margin: '0 auto 12px' }}>
        <svg width="140" height="80" viewBox="0 0 140 80">
          <path d="M 10 80 A 60 60 0 0 1 130 80" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path
            d="M 10 80 A 60 60 0 0 1 130 80"
            stroke={color} strokeWidth="10" fill="none" strokeLinecap="round"
            strokeDasharray="188"
            strokeDashoffset={`${188 * (1 - score / 100)}`}
            style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.5s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 10, color: '#4a6080', marginTop: 2 }}>/ 100</div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 900, color }}>
        {score >= 70 ? '위험 — 즉각 조치 필요' : score >= 40 ? '주의 상태' : '양호'}
      </div>
      <div style={{ fontSize: 11, color: '#4a6080', marginTop: 4 }}>종합 위험도 점수</div>
    </div>
  )
}

function ConfidenceBadge({ value, color }) {
  return (
    <div style={{
      minWidth: 50, padding: '3px 8px', borderRadius: 7,
      background: `${color}20`, textAlign: 'center'
    }}>
      <span style={{ fontSize: 13, fontWeight: 900, color }}>{value}%</span>
    </div>
  )
}

function VitalAnalysisCard({ label, value, unit, normal, status, trend, icon, color }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = status === 'normal' ? '#26de81' : status === 'warn' ? '#ff9f43' : '#ff4d6d'

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: status === 'critical' ? 'rgba(255,77,109,0.08)' : status === 'warn' ? 'rgba(255,159,67,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${status === 'critical' ? 'rgba(255,77,109,0.3)' : status === 'warn' ? 'rgba(255,159,67,0.2)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#4a6080', fontWeight: 700 }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color }}>{value}</span>
            <span style={{ fontSize: 11, color: '#4a6080' }}>{unit}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <TrendIcon size={16} color={trendColor} />
          <div style={{ fontSize: 10, color: '#4a6080', marginTop: 2 }}>정상: {normal}</div>
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 10, height: 3, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11, color: '#4a6080' }}>{label}</span>
    </div>
  )
}
