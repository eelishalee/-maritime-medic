import { Activity, History, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({
  activePatient, activeTab, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, activeEmergencyGuide,
  setActiveEmergencyGuide, activeStep, setActiveStep, handleTraumaAnalysis,
  isScanning, setIsScanning, scanResult, confirmTraumaResult, onBackToDashboard
}) {
  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 480px', overflow: 'hidden', height: '100%', position: 'relative', background: '#020408' }}>

      {/* 전체화면 스캔 오버레이 */}
      {isScanning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 500, background: 'rgba(1,4,14,0.97)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
          {!scanResult ? (
            <>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <img src={logoImg} alt="logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 4, color: '#38bdf8', fontWeight: 800, marginBottom: 10, opacity: 0.6 }}>MDTS CAM · AI TRAUMA SCAN</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#e2e8f0' }}>환부 촬영 분석 중</div>
                </div>
              </div>
              <div style={{ position: 'relative', width: 320, height: 320 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(56,189,248,0.5)', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(56,189,248,0.06) 80%, rgba(56,189,248,0.35) 95%, rgba(125,211,252,0.5) 100%)', animation: 'spin 2s linear infinite' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px 4px rgba(56,189,248,0.7)' }} />
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* [Left] Patient Info Panel (전체 복원) */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
        {/* 고정: 프로필 카드 */}
        <div style={{ flexShrink: 0, padding: '20px 24px 16px 24px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)', flexShrink: 0 }}>
              <img src={activePatient?.avatar || '/CE.jpeg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

        {/* 스크롤: 모든 정보 섹션 복원 */}
        <div style={{ flex: 1, overflowY: 'scroll', minHeight: 0, padding: '20px 24px 100px 24px', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* 1. 신체 정보 */}
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

            {/* 2. 알레르기 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><AlertCircle size={20}/> 알레르기 / 주의사항</div>
              <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(activePatient?.allergies || '없음').split(',').map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fda4af' }}>{a.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 복용 중인 약물 (질환명 중심) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Pill size={20}/> 복용 중인 약물</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: '혈압약 (암로디핀)', timing: '매일 08:00', purpose: '고혈압' },
                  { name: '고지혈증약 (아토르바스타틴)', timing: '매일 21:00', purpose: '고지혈증' },
                ].map((drug, i) => (
                  <div key={i} style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#fed7aa' }}>{drug.name}</span>
                      <span style={{ fontSize: 13, color: '#fb923c', fontWeight: 700 }}>{drug.purpose}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{drug.timing}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 최근 진료 이력 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><History size={20}/> 최근 진료 이력</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { date: '2026.04.15', title: '기관실 추락 외상', type: '응급', color: '#f43f5e', active: true },
                  { date: '2026.04.01', title: '월간 정기검진', type: '정기', color: '#fb923c' },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: item.active ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 12, border: `1px solid ${item.active ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, color: item.active ? '#f43f5e' : '#475569' }}>{item.date}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: item.active ? '#fff' : '#e2e8f0' }}>{item.title}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: item.color, background: `${item.color}18`, padding: '4px 10px', borderRadius: 8 }}>{item.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. 응급 처치 및 상비약 로그 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Droplets size={20}/> 응급 처치 / 상비약 로그</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { time: '09:52', action: '멸균 식염수 환부 세척', note: '이물질 제거 및 소독 준비' },
                  { time: '09:22', action: '아세트아미노펜 500mg 복용', note: '통증 완화 보조 (경구)' },
                ].map((log, idx) => (
                  <div key={idx} style={{ borderLeft: '2px solid rgba(56,189,248,0.3)', paddingLeft: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0' }}>{log.time} — {log.action}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{log.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. 위치 및 승선 정보 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2dd4bf', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><MapPin size={20}/> 위치 및 승선 정보</div>
              <div style={{ background: 'rgba(45,212,191,0.05)', border: '1px solid rgba(45,212,191,0.1)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '현재 위치', value: activePatient?.location || '기관실 제2엔진' },
                  { label: '승선일', value: activePatient?.embark || '2024-01-10' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. 비상 연락처 */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#a78bfa', fontSize: 18, fontWeight: 800, marginBottom: 12 }}><Phone size={20}/> 비상 연락처</div>
              <div style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '본인', value: activePatient?.contact || '010-1001-0026' },
                  { label: '보호자', value: activePatient?.emergency || '양정희 010-2001-0026' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        {/* 고정: 응급 처치 버튼 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 20px 24px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 70%, transparent)' }}>
          <button onClick={() => startEmergencyAction('TRAUMA')} className="emergency-action-btn" style={{ width: '100%', padding: '20px', borderRadius: 16, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 20 }}>
            <AlertTriangle size={26} /> 응급 처치 액션 시작
          </button>
        </div>
      </aside>

      {/* [Center] Vitals (고정) & AI Assistant (우측에서 이동) */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* 상단 바이탈 (고정 유지) */}
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#ff3b5c" live />
            <DashboardVital label="산소포화도" value={spo2} unit="%" color="#00aaff" live />
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#00d4aa" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#c084fc" editable />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#ff6a00" editable />
          </div>
        </div>

        {/* 중앙 하단: AI 어시스턴트 컨텐츠 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0' }}>
              <Sparkles size={24} color="#38bdf8" /> 실시간 분석 리포트
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>AI ACTIVE</div>
            
            {/* 하단 빛 흐름 효과 */}
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '100%', 
              height: '2px', 
              background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent)',
              animation: 'lightFlow 3s linear infinite'
            }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.role === 'ai' ? <Sparkles size={18} color="#000" /> : <User size={18} color="#fff" />}
                </div>
                <div style={{ padding: '16px 20px', borderRadius: m.role === 'ai' ? '0 24px 24px 24px' : '24px 0 24px 24px', background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)', border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)', maxWidth: '85%', fontSize: 16, lineHeight: 1.6, color: '#e2e8f0', whiteSpace: 'pre-line' }}>{m.text}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px 32px 32px 32px', background: '#05070a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ 
              position: 'relative',
              padding: '1.5px',
              borderRadius: '60px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0.1) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              <div style={{ 
                background: '#0a0f1e',
                borderRadius: '60px',
                padding: '8px 8px 8px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div style={{ animation: 'spin 4s linear infinite', display: 'flex', alignItems: 'center' }}>
                  <Sparkles size={20} color="#38bdf8" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.8))' }} />
                </div>
                
                <input 
                  placeholder="환자 상태 또는 처치 방법에 대해 질문하세요..." 
                  value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 16, fontWeight: 500 }} 
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', 
                    border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.05)', 
                    color: '#38bdf8', cursor: 'pointer', transition: '0.2s'
                  }} title="음성 입력">
                    <Mic size={20}/>
                  </button>
                  
                  <button 
                    onClick={handlePromptAnalysis} 
                    style={{ 
                      padding: '0 24px', height: 44, borderRadius: '40px', border: 'none', 
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', 
                      color: '#000', fontWeight: 900, fontSize: 15, cursor: 'pointer', 
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', display: 'flex', alignItems: 'center', gap: 8
                    }}>
                    전송 <ArrowUp size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
            
            <button onClick={handleTraumaAnalysis} style={{ width: '100%', padding: '20px', borderRadius: 16, background: '#0ea5e9', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontWeight: 900, fontSize: 20, cursor: 'pointer', boxShadow: '0 10px 25px rgba(14,165,233,0.3)', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <Camera size={26} /> 외상 촬영 & AI 분석
            </button>
          </div>
        </div>
      </section>

      {/* [Right] 신규 타임라인 (중앙에서 이동) */}
      <aside style={{ display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <History size={20} color="#38bdf8" />
            <span style={{ fontSize: 18, fontWeight: 900, color: '#e2e8f0' }}>사고 및 처치 타임라인</span>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #38bdf8, rgba(56,189,248,0.1))' }} />

            {/* 1. 이벤트 발생 (6하원칙 기반) */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#f43f5e', border: '4px solid #05070a', boxShadow: '0 0 0 2px #f43f5e' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', marginBottom: 8 }}><Clock size={14} style={{ display: 'inline', marginRight: 4 }}/> 09:12 · 사고 발생</div>
              <div style={{ fontSize: 20, fontWeight: 950, color: '#fff', marginBottom: 16 }}>기관실 2층 추락 발생</div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: '18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '6px 10px', fontSize: 10 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>장소</span>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>기관실 제2엔진 구역 (2F)</span>
                  <span style={{ color: '#475569', fontWeight: 500 }}>경위</span>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>점검 중 발판 이탈로 1.8m 추락</span>
                  <span style={{ color: '#475569', fontWeight: 500 }}>부상상태</span>
                  <span style={{ color: '#fb7185', fontWeight: 700, opacity: 0.9 }}>중증 외상 (흉부 및 어깨 골절)</span>
                </div>
              </div>
            </div>

            {/* 2. 처치 리스트 */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#38bdf8', border: '4px solid #05070a' }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', marginBottom: 16 }}>처치 진행 현황</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: '가이드제공', status: '진행완료', detail: 'AI 골절 대응 프로토콜 가동', time: '09:18' },
                  { label: '이송 조치', status: '이송완료', detail: '의무실 이송 (척추보드 결착)', time: '09:25' },
                  { label: '처치 완료', status: '완료됨', detail: '산소 공급 및 진통제 투여', time: '09:40' },
                  { label: '현재 경과', status: '후송 대기', detail: '해경 헬기 인계 준비 중', time: '10:15' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.01)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 36, height: 32, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={18} color="#38bdf8" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, alignItems: 'center' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0' }}>{item.label}</span>
                        <span style={{ fontSize: 14.5, fontWeight: 900, color: '#38bdf8' }}>{item.status}</span>
                      </div>
                      <div style={{ fontSize: 14.5, color: '#64748b', fontWeight: 600 }}>{item.detail} — {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}
