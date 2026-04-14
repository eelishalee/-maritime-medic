import { Activity, History, Droplets, Upload, AlertTriangle, Camera, Mic, User } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import MdtsLogo from '../../../components/MdtsLogo.jsx'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({ 
  activePatient, activeTab, hr, spo2, rr, bp, bt, chat, prompt, setPrompt, 
  handlePromptAnalysis, startEmergencyAction, activeEmergencyGuide, 
  setActiveEmergencyGuide, activeStep, setActiveStep, handleTraumaAnalysis,
  isScanning, setIsScanning, scanResult, confirmTraumaResult 
}) {
  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 440px', overflow: 'hidden' }}>
      
      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          
          <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 24, padding: '24px 24px 20px 24px', marginBottom: 30 }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div style={{ width: 110, height: 110, borderRadius: 27, background: '#fff', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }}>
                {activePatient?.id?.includes('100') ? (
                  <img src="photo.jpeg" alt="Captain" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 5px' }} />
                ) : (
                  <User size={68} color="#38bdf8" />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 37, fontWeight: 950, marginBottom: 4, letterSpacing: '-0.6px' }}>{activePatient?.name}</div>
                <div style={{ fontSize: 23, color: '#38bdf8', fontWeight: 800, marginBottom: 2 }}>{activePatient?.role}</div>
                <div style={{ fontSize: 18, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InfoItem label="나이/성별" value={`${activePatient?.age || 0}세 / 남`} size="xl_ultra" />
              <InfoItem label="혈액형" value={activePatient?.blood} size="xl_ultra" />
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 17, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>과거력 (Past History)</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{activePatient?.history}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 24, fontWeight: 800, marginBottom: 16 }}><History size={26}/> 최근 진료 이력</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { date: '2026.03.12', title: '정기 건강검진', status: '정상' },
                  { date: '2026.01.05', title: '가벼운 감기 증상', status: '처방완료' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 16, color: '#64748b', marginBottom: 4 }}>{item.date}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 19, fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 16, color: '#38bdf8', fontWeight: 700 }}>{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#38bdf8', fontSize: 24, fontWeight: 800, marginBottom: 16 }}><Droplets size={26}/> 투약/처치 로그</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { time: '14:15', action: '아스피린 300mg 투여', note: '흉통 완화 목적' },
                  { time: '14:08', action: '산소 공급 시작', note: '10L/min 유지' }
                ].map((log, idx) => (
                  <div key={idx} style={{ borderLeft: '2px solid rgba(56,189,248,0.3)', paddingLeft: 16, marginBottom: 4 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0' }}>{log.time} - {log.action}</div>
                    <div style={{ fontSize: 16, color: '#64748b', marginTop: 2 }}>{log.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2dd4bf', fontSize: 21, fontWeight: 800, marginBottom: 16 }}><Upload size={26}/> 데이터 전송 상태</div>
              <div style={{ background: 'rgba(45,212,191,0.05)', padding: '16px', borderRadius: 16, border: '1px solid rgba(45,212,191,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>육상 의료 센터 동기화</span>
                  <span style={{ fontSize: 14, color: '#2dd4bf', fontWeight: 800 }}>연결됨</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#2dd4bf' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05070a' }}>
          <button 
            onClick={() => startEmergencyAction('CARDIAC')} 
            className="emergency-action-btn" 
            style={{ 
              width: '100%', padding: '22px', borderRadius: 18, background: '#f43f5e', 
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
        
        {/* AI Trauma Scanner HUD Overlay */}
        {isScanning && (
          <div style={{ 
            position: 'absolute', inset: 0, zIndex: 100, 
            background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Scanner Frame */}
            <div style={{ 
              position: 'relative', width: 500, height: 380, 
              border: '1px solid rgba(56, 189, 248, 0.2)',
              background: 'rgba(56, 189, 248, 0.03)',
              overflow: 'hidden'
            }}>
              {/* Corner Accents */}
              <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: '4px solid #38bdf8', borderRight: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '4px solid #38bdf8', borderRight: '4px solid #38bdf8' }} />

              {/* Scanning Line */}
              <div style={{ 
                position: 'absolute', left: 0, right: 0, height: 4, 
                background: 'linear-gradient(180deg, transparent, #38bdf8, transparent)',
                boxShadow: '0 0 20px #38bdf8',
                animation: 'scanMove 2.5s ease-in-out infinite'
              }} />

              {/* HUD Data Overlay */}
              <div style={{ position: 'absolute', top: 40, left: 80, fontFamily: 'monospace', fontSize: 12, color: '#38bdf8', opacity: 0.8 }}>
                <div>DEPTH_SENSING: ACTIVE</div>
                <div>TISSUE_TYPE: RECOGNIZING...</div>
                <div>BLOOD_OXY: MONITORING</div>
              </div>
              
              <div style={{ position: 'absolute', bottom: 40, right: 80, fontFamily: 'monospace', fontSize: 12, color: '#38bdf8', opacity: 0.8, textAlign: 'right' }}>
                <div>AI_MODEL: MDTS_TRAUMA_V2</div>
                <div>CONFIDENCE: 94.2%</div>
                <div>LATENCY: 12ms</div>
              </div>

              {/* Center Reticle */}
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 80, height: 80, border: '1px dashed rgba(56, 189, 248, 0.5)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: 10, height: 10, background: '#f43f5e', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              </div>
            </div>

            {/* Status Text or Results */}
            <div style={{ marginTop: 32, textAlign: 'center', minHeight: 100 }}>
              {!scanResult ? (
                <>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8', letterSpacing: 2, marginBottom: 8 }}>AI 조직 정밀 분석 중...</div>
                  <div style={{ fontSize: 14, color: 'rgba(56, 189, 248, 0.6)', fontWeight: 700 }}>환부를 조준 프레임 안에 유지하십시오</div>
                </>
              ) : (
                <div className="fade-in">
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#2dd4bf', marginBottom: 12 }}>분석 완료 : {scanResult.analysis.split(' 감지')[0].split(' 확인')[0]}</div>
                  <button 
                    onClick={confirmTraumaResult}
                    style={{ 
                      padding: '14px 40px', borderRadius: 14, 
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                      color: '#000', fontWeight: 900, fontSize: 18, border: 'none',
                      cursor: 'pointer', boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {scanResult.action.label} 바로가기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#fb7185" live />
            <DashboardVital label="산소포화도" value={spo2} unit="%" color="#38bdf8" live />
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#2dd4bf" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#e2e8f0" editable />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#fbbf24" editable />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 45px 45px 45px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {activeTab === 'DASHBOARD' && (
            <div style={{ position: 'relative', paddingLeft: 45 }}>
              <div style={{ position: 'absolute', left: 8.5, top: 0, bottom: 0, width: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
              
              <TimelineItem 
                time="14:02" 
                label="급성 흉부 통증 발생 및 최초 발견" 
                detail="선교 내 이동 중 갑작스러운 심장 쪼임 호소하며 쓰러짐. 주변 인원에 의해 즉시 보고됨." 
              />
              
              <TimelineItem 
                time="14:05" 
                label="AI 분석 : 심근경색(STEMI) 고위험 판정" 
                detail="ECG 실시간 데이터 및 증상 기반 엣지 AI 정밀 분석 완료. 즉각적인 응급 처치 필요 판정." 
                highlight 
              />
              
              <TimelineItem 
                time="14:08" 
                label="산소 공급 및 니트로글리세린 투여" 
                detail="AI 가이드에 따라 설하정 1정 투여 완료. 비강 캐뉼라를 통한 4L/min 산소 공급 시작." 
              />
              
              <TimelineItem 
                time="14:12" 
                label="실시간 바이탈 변화 감시" 
                detail="혈압 128/84 → 115/78 mmHg 하강 추세 확인. 지속적인 모니터링 및 기록 중." 
              />
              
              <TimelineItem 
                time="14:15" 
                label="육상 의료 센터(KMCC) 데이터 전송" 
                detail="환자의 기저질환 정보 및 현재 AI 분석 리포트 육상 의료진에게 일괄 동기화 완료." 
              />
              
              <TimelineItem 
                time="14:18" 
                label="응급 처치 2단계 프로토콜 진입" 
                detail="AED(자동심장충격기) 배치 완료 및 주변 구역 확보. 추가 의료 요원 현장 도착." 
              />
            </div>
          )}
          {activeTab === 'GUIDE' && (
            <EmergencyGuide 
              activeEmergencyGuide={activeEmergencyGuide} 
              setActiveEmergencyGuide={setActiveEmergencyGuide} 
              activeStep={activeStep} 
              setActiveStep={setActiveStep} 
            />
          )}
        </div>

        <div style={{ padding: '0 40px 42px 40px', background: 'transparent', position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            background: 'rgba(10, 18, 35, 0.85)', 
            borderRadius: 30, 
            padding: '12px 14px 12px 24px', 
            border: '1px solid rgba(56, 189, 248, 0.35)', 
            backdropFilter: 'blur(32px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <button style={{ 
              width: 44, height: 44, borderRadius: '50%', 
              background: 'rgba(56, 189, 248, 0.1)', 
              border: '1px solid rgba(56, 189, 248, 0.2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}>
              <Mic size={22} color="#38bdf8" />
            </button>
            <input 
              placeholder="환자 증상 또는 AI에게 명령어를 입력하세요..." 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()} 
              style={{ 
                flex: 1, background: 'none', border: 'none', 
                color: '#f1f5f9', fontSize: 19, fontWeight: 500, outline: 'none',
                letterSpacing: '-0.3px'
              }} 
            />
            <button 
              onClick={handlePromptAnalysis} 
              className="ai-analyze-btn"
              style={{ 
                padding: '12px 32px', 
                borderRadius: 22, 
                background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', 
                color: '#000', 
                fontWeight: 900, 
                fontSize: 18, 
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              AI 분석 요청
            </button>
          </div>
          {/* Subtle Glow Effect below the input */}
          <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.2), transparent)', filter: 'blur(4px)' }} />
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
                boxShadow: m.role === 'ai' ? '0 4px 20px rgba(56, 189, 248, 0.05)' : 'none'
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
