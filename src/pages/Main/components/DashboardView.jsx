import { Activity, History, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import MdtsLogo from '../../../components/MdtsLogo.jsx'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({
  activePatient, activeTab, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, activeEmergencyGuide,
  setActiveEmergencyGuide, activeStep, setActiveStep, handleTraumaAnalysis,
  isScanning, setIsScanning, scanResult, confirmTraumaResult, onBackToDashboard
}) {
  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 440px', overflow: 'hidden', height: '100%', position: 'relative' }}>

      {/* 전체화면 스캔 오버레이 */}
      {isScanning && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 500,
          background: 'rgba(1,4,14,0.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
        }}>
          {!scanResult ? (
            <>
              {/* 헤더 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: '#38bdf8', fontWeight: 800, marginBottom: 10, opacity: 0.6 }}>MDTS CAM · AI TRAUMA SCAN</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#e2e8f0' }}>환부 촬영 분석 중</div>
              </div>

              {/* 원형 레이더 스캔 */}
              <div style={{ position: 'relative', width: 320, height: 320 }}>

                {/* 동심원 */}
                {[1, 0.72, 0.44].map((scale, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 320 * scale, height: 320 * scale,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    borderRadius: '50%',
                    border: `1px solid rgba(56,189,248,${0.12 + i * 0.06})`,
                  }} />
                ))}

                {/* 외곽 링 (밝은 테두리) */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '2px solid rgba(56,189,248,0.5)',
                  boxShadow: '0 0 24px rgba(56,189,248,0.2), inset 0 0 24px rgba(56,189,248,0.05)',
                }} />

                {/* 십자선 */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(56,189,248,0.15)', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(56,189,248,0.15)', transform: 'translateX(-50%)' }} />

                {/* 레이더 스윕 — 회전하는 코닉 그라디언트 */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(56,189,248,0.06) 80%, rgba(56,189,248,0.35) 95%, rgba(125,211,252,0.5) 100%)',
                  animation: 'spin 2s linear infinite',
                }} />

                {/* 스윕 선 끝의 빛 */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent 96%, rgba(125,211,252,0.9) 98%, transparent 100%)',
                  animation: 'spin 2s linear infinite',
                  filter: 'blur(1px)',
                }} />

                {/* 중앙 점 */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#38bdf8',
                  boxShadow: '0 0 12px 4px rgba(56,189,248,0.7)',
                }} />

                {/* 랜덤 스캔 핑 포인트 */}
                {[
                  { top: '28%', left: '38%', delay: '0.3s' },
                  { top: '55%', left: '62%', delay: '0.9s' },
                  { top: '68%', left: '35%', delay: '1.5s' },
                ].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute', ...pos,
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#38bdf8',
                    boxShadow: '0 0 8px 3px rgba(56,189,248,0.5)',
                    animation: `pulse 1.8s ${pos.delay} ease-in-out infinite`,
                  }} />
                ))}
              </div>

              {/* 진행 도트 */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[0, 0.3, 0.6].map((d, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', opacity: 0.5, animation: `pulse 1.2s ${d}s ease-in-out infinite` }} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>

        {/* 고정: 프로필 카드 */}
        <div style={{ flexShrink: 0, padding: '20px 24px 16px 24px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)', flexShrink: 0 }}>
              {activePatient?.avatar ? (
                <img src={activePatient.avatar} alt={activePatient.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              ) : (
                <User size={56} color="#38bdf8" />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: '-0.5px' }}>{activePatient?.name}</div>
                <div style={{ fontSize: 18, color: '#38bdf8', fontWeight: 800 }}>{activePatient?.role}</div>
              </div>
              <div style={{ fontSize: 15, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 0}세 / 남`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood} size="xl_ultra" />
            {activePatient?.chronic && (
              <div style={{ gridColumn: 'span 2', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                <span style={{ color: '#475569' }}>과거력 </span>
                <span style={{ color: '#94a3b8', fontWeight: 700 }}>{activePatient.chronic}</span>
              </div>
            )}
          </div>
        </div>

        {/* 스크롤: 나머지 데이터 (하단 버튼 높이만큼 padding 확보) */}
        <div style={{ flex: 1, overflowY: 'scroll', minHeight: 0, padding: '20px 24px 100px 24px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(56,189,248,0.3) transparent' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* 신체 정보 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Ruler size={20}/> 신체 정보</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: '신장', value: `${activePatient?.height || '-'}cm` },
                  { label: '체중', value: `${activePatient?.weight || '-'}kg` },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 알레르기 / 주의사항 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
              <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(activePatient?.allergies || '없음').split(',').map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fda4af' }}>{a.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 복용 중인 약물 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Pill size={20}/> 복용 중인 약물</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: '암로디핀 10mg', timing: '매일 08:00', purpose: '혈압 조절' },
                  { name: '아토르바스타틴 20mg', timing: '매일 21:00', purpose: '고지혈증' },
                  { name: '클로피도그렐 75mg', timing: '매일 08:00', purpose: '항혈소판' },
                ].map((drug, i) => (
                  <div key={i} style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#fed7aa' }}>{drug.name}</span>
                      <span style={{ fontSize: 13, color: '#fb923c', fontWeight: 700, background: 'rgba(251,146,60,0.1)', padding: '2px 8px', borderRadius: 6 }}>{drug.purpose}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{drug.timing}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 최근 진료 이력 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><History size={20}/> 최근 진료 이력</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { date: '2026.04.15', title: '제2엔진 점검 중 추락 외상', type: '응급', color: '#f43f5e', active: true },
                  { date: '2026.04.01', title: '월간 정기검진', type: '정기', color: '#fb923c' },
                  { date: '2026.03.18', title: '손 찰과상 드레싱', type: '처치', color: '#2dd4bf' },
                  { date: '2026.03.05', title: '월간 정기검진', type: '정기', color: '#fb923c' },
                  { date: '2026.02.14', title: '심계항진 증상', type: '응급', color: '#f43f5e' },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: item.active ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 12, border: `1px solid ${item.active ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, color: item.active ? '#f43f5e' : '#475569', marginBottom: 3, fontWeight: item.active ? 700 : 400 }}>{item.date} {item.active && '· 처치 중'}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: item.active ? '#fff' : '#e2e8f0' }}>{item.title}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: item.color, background: `${item.color}18`, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>{item.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 투약/처치 로그 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Droplets size={20}/> 투약/처치 로그</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { time: '10:15', action: '해경 헬기 후송 요청', note: '선내 처치 한계 — 긴급 기항 승인', flag: true },
                  { time: '09:52', action: '생리식염수 500mL 투여', note: '저혈압(98/64) 대응 수액 처치' },
                  { time: '09:22', action: '케토로락 30mg 근주', note: '외상성 통증 경감 목적' },
                  { time: '09:20', action: '산소 15L/min 공급', note: '비재호흡 마스크 · SpO₂ 94→97%' },
                  { time: '09:00', action: '암로디핀 10mg 복용 확인', note: '정시 복용 (기존 고혈압 약물)' },
                ].map((log, idx) => (
                  <div key={idx} style={{ borderLeft: `2px solid ${log.flag ? '#f43f5e' : 'rgba(56,189,248,0.3)'}`, paddingLeft: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: log.flag ? '#fda4af' : '#e2e8f0' }}>{log.time} — {log.action}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{log.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 위치 및 승선 정보 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2dd4bf', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><MapPin size={20}/> 위치 및 승선 정보</div>
              <div style={{ background: 'rgba(45,212,191,0.05)', border: '1px solid rgba(45,212,191,0.1)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '현재 위치', value: activePatient?.location || '기관실 제2엔진' },
                  { label: '승선일', value: activePatient?.embark || '2024-01-10' },
                  { label: '생년월일', value: activePatient?.dob || '1971-08-22' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 비상 연락처 */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#a78bfa', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Phone size={20}/> 비상 연락처</div>
              <div style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '본인', value: activePatient?.contact || '010-1001-0026' },
                  { label: '보호자', value: activePatient?.emergency || '양정희 010-2001-0026' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        {/* 고정: 응급 처치 버튼 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 20px 24px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 70%, transparent)' }}>
          <button
            onClick={() => startEmergencyAction('TRAUMA')}
            className="emergency-action-btn"
            style={{
              width: '100%', padding: '20px', borderRadius: 16, background: '#f43f5e',
              color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 20,
              transition: 'all 0.2s ease'
            }}
          >
            <AlertTriangle size={26} /> 응급 처치 액션 시작
          </button>
        </div>
      </aside>

      {/* [Center] Vitals, Timeline, Chat */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff3b5c" live />
            <DashboardVital label="산소포화도" value={spo2} unit="%" color="#00aaff" live />
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#00d4aa" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#c084fc" editable />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#ff6a00" editable />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 45px 45px 45px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {activeTab === 'DASHBOARD' && (
            <div style={{ position: 'relative', paddingLeft: 45 }}>
              <div style={{ position: 'absolute', left: 8.5, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />

              <TimelineItem
                time="09:12"
                label="제2엔진 점검 중 추락 사고 발생"
                detail="기관실 제2엔진 상부 점검 플랫폼에서 발판 이탈로 약 1.8m 추락. 인근 기관사가 즉시 발견, 선내 무선으로 의무실 신고."
              />

              <TimelineItem
                time="09:16"
                label="현장 1차 평가 — 의식 있음, 좌측 흉부·어깨 통증 호소"
                detail="의식 명료(GCS 15). 좌측 갈비뼈 부위 압통 및 좌측 어깨 변형 확인. 호흡 시 통증 심화. 자력 이동 불가."
              />

              <TimelineItem
                time="09:20"
                label="AI 분석 : 늑골 골절 및 좌측 쇄골 골절 의심 — 고위험 판정"
                detail="외상 부위 촬영 이미지 기반 엣지 AI 분석 완료. 다발성 늑골 골절 및 쇄골 골절 가능성 91% 판정. 기흉 동반 여부 즉시 확인 권고."
                highlight
              />

              <TimelineItem
                time="09:25"
                label="산소 공급 및 흉부 고정 처치"
                detail="비재호흡 마스크로 산소 15L/min 공급. 탄력 붕대로 흉부 보조 고정. 산소포화도 94% → 97% 회복 확인."
              />

              <TimelineItem
                time="09:31"
                label="환자 의무실 이송 완료"
                detail="척추 보드·경추 보호대 착용 후 들것으로 의무실 안전 이송. 이송 중 바이탈 지속 모니터링, 혈압 108/72 mmHg."
              />

              <TimelineItem
                time="09:38"
                label="육상 의료 센터(KMCC) 원격 진료 연결"
                detail="외상 사진·바이탈·AI 분석 리포트 일괄 전송 완료. 흉부외과 전문의 원격 협진 개시. 기흉 배제 위한 호흡음 청진 지시."
              />

              <TimelineItem
                time="09:52"
                label="활력징후 불안정 — 쇼크 전단계 주의"
                detail="혈압 98/64 mmHg, 심박수 112bpm. 수액(생리식염수) 500mL 투여 개시. 진통제(케토로락 30mg) 근주 완료."
              />

              <TimelineItem
                time="10:15"
                label="긴급 기항 요청 — 헬기 후송 승인"
                detail="다발성 골절 및 혈압 불안정으로 선내 처치 한계 판단. 선장 보고 후 해경 헬기 후송 요청 승인. 현재 헬기 접근 중."
              />
            </div>
          )}
          {activeTab === 'GUIDE' && (
            <>
              {/* 상단 네비 */}
              <button
                onClick={onBackToDashboard}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  marginBottom: 20, padding: '8px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e2e8f0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8' }}
              >
                ← 메인 화면으로
              </button>

              {/* AI 분석 결과 + 환부 사진 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

                {/* AI 분석 결과 카드 */}
                <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 18, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px #f43f5e', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', letterSpacing: 1 }}>AI 외상 분석 결과</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.4 }}>
                    좌측 늑골 다발성 골절<br/>쇄골 골절 의심
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: '분석 신뢰도', value: '91%', color: '#f43f5e' },
                      { label: '손상 부위', value: '좌측 흉부 · 어깨', color: '#fb923c' },
                      { label: '중증도', value: '고위험 (Level 3)', color: '#f43f5e' },
                      { label: '추정 기전', value: '고에너지 추락 외상', color: '#94a3b8' },
                      { label: '합병증 위험', value: '기흉 동반 가능', color: '#fbbf24' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* 신뢰도 바 */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>분석 정확도</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#f43f5e' }}>91%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: '91%', height: '100%', background: 'linear-gradient(90deg, #f43f5e, #fb923c)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>

                {/* 환부 사진 */}
                <div style={{ background: 'rgba(15,20,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', position: 'relative', minHeight: 260 }}>
                  <div style={{ position: 'absolute', top: 12, left: 14, fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: 1 }}>환부 촬영 이미지</div>
                  <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 6px #2dd4bf' }} />
                    <span style={{ fontSize: 11, color: '#2dd4bf', fontWeight: 700 }}>AI 분석 완료</span>
                  </div>

                  {/* 스캔 이미지 영역 */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,14,30,0.9)' }}>
                    {/* 격자 배경 */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    {/* 신체 실루엣 */}
                    <svg width="110" height="180" viewBox="0 0 110 180" style={{ position: 'absolute' }}>
                      {/* 몸통 */}
                      <ellipse cx="55" cy="60" rx="30" ry="38" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      {/* 머리 */}
                      <circle cx="55" cy="16" r="14" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      {/* 좌측 팔 */}
                      <path d="M25 42 Q8 60 10 90" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      {/* 우측 팔 */}
                      <path d="M85 42 Q102 60 100 90" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      {/* 다리 */}
                      <path d="M40 98 Q36 130 34 160" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      <path d="M70 98 Q74 130 76 160" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
                      {/* 손상 부위 하이라이트 — 좌측 흉부 */}
                      <ellipse cx="38" cy="52" rx="14" ry="16" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
                      <ellipse cx="38" cy="52" rx="8" ry="9" fill="rgba(244,63,94,0.25)" />
                      {/* 손상 부위 — 좌측 어깨 */}
                      <circle cx="24" cy="38" r="9" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3 2" />
                      {/* 화살표 라벨선 */}
                      <line x1="52" y1="52" x2="72" y2="44" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
                      <line x1="24" y1="29" x2="40" y2="22" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
                    </svg>

                    {/* 라벨 */}
                    <div style={{ position: 'absolute', top: '28%', right: '8%', fontSize: 11, color: '#f43f5e', fontWeight: 700, textAlign: 'right' }}>늑골 골절<br/><span style={{ color: '#64748b', fontWeight: 500 }}>Level 3</span></div>
                    <div style={{ position: 'absolute', top: '14%', right: '8%', fontSize: 11, color: '#fb923c', fontWeight: 700, textAlign: 'right' }}>쇄골 골절<br/><span style={{ color: '#64748b', fontWeight: 500 }}>의심</span></div>
                  </div>

                  {/* 하단 타임스탬프 */}
                  <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>촬영 09:18</span>
                    <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>MDTS-CAM v2</span>
                  </div>
                </div>
              </div>

              {/* 처치 가이드 */}
              <EmergencyGuide
                activeEmergencyGuide={activeEmergencyGuide}
                setActiveEmergencyGuide={setActiveEmergencyGuide}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </>
          )}
        </div>

        <div style={{ padding: '0 40px 36px 40px', position: 'relative' }}>
          <div style={{ position: 'relative', borderRadius: 20 }}>

            {/* 기본 스트로크 — 항상 보이는 테두리 */}
            <div style={{
              position: 'absolute', inset: -1.5, borderRadius: 20, zIndex: 0,
              border: '1.5px solid rgba(56,189,248,0.25)',
            }} />

            {/* 섬광 — 좌→우로 흐르는 밝은 빛 */}
            <div style={{
              position: 'absolute', inset: -1.5, borderRadius: 20, zIndex: 0,
              background: 'linear-gradient(90deg, transparent 0%, transparent 25%, #7dd3fc 45%, #fff 50%, #7dd3fc 55%, transparent 75%, transparent 100%)',
              backgroundSize: '250% 100%',
              animation: 'strokeFlow 10s linear infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: 1.5,
            }} />

            {/* 섬광 글로우 */}
            <div style={{
              position: 'absolute', inset: -5, borderRadius: 23, zIndex: 0,
              background: 'linear-gradient(90deg, transparent 20%, rgba(56,189,248,0.6) 50%, transparent 80%)',
              backgroundSize: '250% 100%',
              animation: 'strokeFlow 10s linear infinite',
              opacity: 0.4, filter: 'blur(8px)',
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(6,12,28,0.98)',
              borderRadius: 20,
              padding: '16px 16px 12px 18px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {/* 스파클 + 입력 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Sparkles size={18} color="#38bdf8" style={{ animation: 'spin 4s linear infinite', marginTop: 3, flexShrink: 0 }} />
                <input
                  placeholder="증상, 처치, 약물 등 AI에게 질의하세요..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: '#e2e8f0', fontSize: 16, fontWeight: 400,
                    lineHeight: 1.6, width: '100%', minHeight: 28,
                  }}
                />
              </div>

              {/* 하단 툴바 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 30 }}>

                {/* 마이크 버튼 */}
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', borderRadius: 20, border: '1px solid rgba(56,189,248,0.2)',
                  cursor: 'pointer', background: 'rgba(56,189,248,0.06)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.14)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.06)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)' }}
                >
                  <Mic size={18} color="#38bdf8" />
                  <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>음성 입력</span>
                </button>

                {/* 전송 버튼 */}
                <button
                  onClick={handlePromptAnalysis}
                  className="ai-analyze-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: prompt.trim()
                      ? 'linear-gradient(135deg, #0ea5e9, #38bdf8, #00d4ff)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: prompt.trim() ? '0 0 18px rgba(56,189,248,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <ArrowUp size={16} color={prompt.trim() ? '#fff' : '#475569'} strokeWidth={2.5} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: prompt.trim() ? '#fff' : '#475569' }}>전송</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* [Right] AI Assistant Panel */}
      <aside style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden', height: '100%' }}>
        <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 11, color: '#e2e8f0' }}>
            <Activity size={22} color="#38bdf8" /> MDTS AI 의료 어시스턴트
          </div>
          
          {/* Flowing Light Effect */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '100%', 
            height: 1.5, 
            background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent)',
            animation: 'lightFlow 4s linear infinite',
            filter: 'blur(0.5px)'
          }} />
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18, scrollbarWidth: 'none' }}>
          {chat?.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
              <div style={{ 
                padding: '14px 18px', 
                borderRadius: m.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px', 
                background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)', 
                maxWidth: '92%', 
                fontSize: 15, 
                lineHeight: 1.6,
                color: m.role === 'ai' ? '#e2e8f0' : '#cbd5e1',
                boxShadow: m.role === 'ai' ? '0 4px 20px rgba(56, 189, 248, 0.05)' : 'none',
                whiteSpace: 'pre-line'
              }}>
                {m.text}
                
                {m.action && (
                  <button 
                    onClick={() => startEmergencyAction(m.action.type)}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      padding: '10px',
                      borderRadius: 12,
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'}
                  >
                    <AlertTriangle size={14} />
                    {m.action.label} 바로가기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <button 
            onClick={handleTraumaAnalysis} 
            className="trauma-capture-btn" 
            style={{ 
              width: '100%', padding: '22px', borderRadius: 18, background: '#0ea5e9', 
              color: '#fff', border: 'none', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', gap: 12, fontWeight: 800, fontSize: 20,
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <Camera size={26} /> 외상 촬영 & AI 분석
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes lightFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes strokeFlow {
          0%   { background-position: -100% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scanMove {
          0% { top: 0%; opacity: 0.2; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0.2; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        .emergency-action-btn:hover { background: #e11d48 !important; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3); }
        .emergency-action-btn:active { transform: scale(0.97); }
        .ai-analyze-btn:hover { filter: brightness(0.85); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }
        .ai-analyze-btn:active { transform: scale(0.96); }
        .trauma-capture-btn:hover { background: #0284c7 !important; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
        .trauma-capture-btn:active { transform: scale(0.97); }
      `}</style>
    </div>
  )
}
