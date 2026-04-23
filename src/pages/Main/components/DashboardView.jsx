import { useState, useEffect, useRef } from 'react'
import { Activity, History, RotateCcw, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'

export default function DashboardView({
  activePatient, hr, spo2, rr, bp, bt, chat, prompt, setPrompt,
  handlePromptAnalysis, startEmergencyAction, handleTraumaAnalysis,
  isScanning, scanResult, scanError, setScanError, setIsScanning,
  setBp, setBt
}) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)

  // ─── 센서 상태 및 점검 안내 ───
  const [spo2Status, setSpo2Status] = useState('normal') // 'normal' | 'error'
  const [showSensorGuide, setShowSensorGuide] = useState(false)

  // ─── 편집 모달 상태 ───
  const [editTarget, setEditTarget] = useState(null) // 'bp' | 'bt' | null
  const [editValue, setEditValue] = useState('')

  const openEdit = (type, currentVal) => {
    setEditTarget(type)
    setEditValue(currentVal)
  }

  const saveEdit = () => {
    if (editTarget === 'bp') setBp(editValue)
    if (editTarget === 'bt') setBt(editValue)
    setEditTarget(null)
  }

  const toggleSpo2Status = () => {
    if (spo2Status === 'normal') {
      setSpo2Status('error')
      setShowSensorGuide(true)
    } else {
      setSpo2Status('normal')
      setShowSensorGuide(false)
    }
  }

  // 카메라 스트림 관리
  useEffect(() => {
    async function startCamera() {
      if (isScanning) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: 1280, height: 720 } 
          })
          setStream(s)
          if (videoRef.current) videoRef.current.srcObject = s
        } catch (err) {
          console.error("카메라 접근 실패:", err)
        }
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          setStream(null)
        }
      }
    }
    startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [isScanning])

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr 480px', overflow: 'hidden', height: '100%', position: 'relative', background: '#020408' }}>

      {/* 센서 점검 안내 오버레이 */}
      {showSensorGuide && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s' }}>
          <div style={{ width: 500, background: '#1e293b', border: '2px solid #fbbf24', borderRadius: 32, padding: 40, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <AlertTriangle size={48} color="#fbbf24" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 950, color: '#fbbf24', marginBottom: 16 }}>산소포화도 센서 점검 안내</h2>
            <p style={{ fontSize: 18, color: '#e2e8f0', lineHeight: 1.6, marginBottom: 32, fontWeight: 700 }}>
              환자의 손가락에 집게형 센서가 <br/>
              정확히 밀착되어 있는지 확인해 주세요. <br/>
              <span style={{ color: '#94a3b8', fontSize: 15 }}>(주변 광원을 차단하면 정확도가 향상됩니다)</span>
            </p>
            <button 
              onClick={() => { setShowSensorGuide(false); setSpo2Status('normal'); }}
              style={{ width: '100%', padding: '18px', borderRadius: 16, background: '#fbbf24', color: '#000', border: 'none', fontWeight: 950, fontSize: 18, cursor: 'pointer', transition: '0.2s' }}
            >
              확인 및 재시도
            </button>
          </div>
        </div>
      )}

      {/* [개편] 이미지 기반 심플 외상 스캐너 오버레이 */}
      {isScanning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* 실제 카메라 피드 */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
          />

          {/* 배경 어둡게 처리 (가운데만 밝게) */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'rgba(0,0,0,0.5)',
            maskImage: 'radial-gradient(transparent 250px, black 300px)',
            WebkitMaskImage: 'radial-gradient(transparent 250px, black 300px)',
            pointerEvents: 'none'
          }} />

          {/* 상단 안내 문구 영역 */}
          <div style={{ position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1010 }}>
            <div style={{ background: 'rgba(0,0,0,0.75)', padding: '16px 50px', borderRadius: '16px', color: '#fff', fontSize: 22, fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '-0.5px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              외상 부위 전체를 사각형 프레임에 맞춰 인식해 주세요
            </div>
          </div>

          {/* 중앙 : 메인 스캔 프레임 (이미지 스타일 적용) */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '500px', height: '500px' }}>
              {/* 모서리 브래킷 (빨간색 라운드) */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '12px solid #ff0000', borderLeft: '12px solid #ff0000', borderRadius: '30px 0 0 0' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '12px solid #ff0000', borderRight: '12px solid #ff0000', borderRadius: '0 30px 0 0' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '12px solid #ff0000', borderLeft: '12px solid #ff0000', borderRadius: '0 0 0 30px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '12px solid #ff0000', borderRight: '12px solid #ff0000', borderRadius: '0 0 30px 0' }} />
              
              {/* 스캔 라인 애니메이션 */}
              {!scanError && (
                <div style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '4px', background: 'rgba(255,0,0,0.5)', boxShadow: '0 0 15px #ff0000', borderRadius: '2px', animation: 'scanMoveInner 3s infinite ease-in-out' }} />
              )}
            </div>

            {/* 에러 팝업 */}
            {scanError && (
              <div style={{ position: 'absolute', background: 'rgba(255,77,77,0.95)', padding: '20px 40px', borderRadius: '16px', color: '#fff', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>외상 데이터 분석 불가</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>초점이 흐리거나 조도가 낮습니다. 외상 부위를 정중앙에 맞추고 다시 시도해 주세요.</div>
                <button onClick={() => setScanError(null)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#fff', color: '#ff4d4d', fontWeight: 900, cursor: 'pointer' }}>다시 시도</button>
              </div>
            )}
          </div>

          {/* 하단 바 영역 (버튼만 유지) */}
          <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1010 }}>
            <button onClick={() => setIsScanning(false)} style={{ background: 'rgba(255,255,255,0.1)', padding: '16px 50px', borderRadius: '12px', color: '#fff', fontSize: 18, fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              분석 취소 및 돌아가기
            </button>
          </div>

        </div>
      )}

      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#05070a', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
        <div style={{ flexShrink: 0, padding: '24px 28px 20px 28px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(56,189,248,0.03)' }}>
          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: 24, background: '#1e293b', border: '3px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              <img 
                src={activePatient?.avatar || '/CE.jpeg'} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activePatient?.name || 'User') + '&background=0ea5e9&color=fff&size=128';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Patient Profile"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 36, fontWeight: 950, letterSpacing: '-0.5px', color: '#fff' }}>{activePatient?.name || '김항해'}</div>
                <div style={{ fontSize: 20, color: '#38bdf8', fontWeight: 800 }}>{activePatient?.role || '기관장'}</div>
              </div>
              <div style={{ fontSize: 16, color: '#475569', fontWeight: 700 }}>ID : {activePatient?.id || 'S2026-026'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 55}세 / 남`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood || 'A+형'} size="xl_ultra" />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '28px 28px 120px 28px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 과거력 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <History size={20}/> 과거력 (Past History)
            </div>
            <div style={{ fontSize: 19, fontWeight: 750, color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              {activePatient?.history ? activePatient.history.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              )) : '기록 없음'}
            </div>
          </div>

          {/* 최근 진료 이력 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#00d2ff', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <RotateCcw size={20}/> 최근 진료 이력
            </div>
            <div style={{ background: 'rgba(0, 210, 255, 0.04)', borderRadius: 16, padding: '20px', border: '1px solid rgba(0, 210, 255, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 850, color: '#00d2ff' }}>{activePatient?.recentHistory?.date || '2026-03-15'}</span>
                <span style={{ fontSize: 15, color: '#4a6080', fontWeight: 700 }}>{activePatient?.recentHistory?.title || '단순 감기'}</span>
              </div>
              <div style={{ fontSize: 16, color: '#8da2c0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {activePatient?.recentHistory?.detail || '- 처방 : 타이레놀 500mg\n- 특이사황 : 알레르기 반응 없음'}
              </div>
            </div>
          </div>

          {/* 알레르기 및 주의사항 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f43f5e', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <AlertCircle size={20}/> 알레르기 / 주의사항
            </div>
            <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(activePatient?.allergies || '페니실린 알레르기 있음').split(',').map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                  <span style={{ fontSize: 17, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 복용 약물 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <Pill size={20}/> 복용 중인 약물
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ name: '혈압약 (암로디핀)', purpose: '고혈압' }, { name: '고지혈증약', purpose: '고지혈증' }].map((drug, i) => (
                <div key={i} style={{ background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)', borderRadius: 14, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 850, color: '#fed7aa' }}>{drug.name}</span>
                    <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 800 }}>{drug.purpose}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 작업 위치 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <MapPin size={20}/> 환자 작업 위치 (Work Location)
            </div>
            <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Anchor size={22} color="#38bdf8" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{activePatient?.workLocation || '제2엔진실 (Engine Room)'}</div>
                <div style={{ fontSize: 14, color: '#4a6080', fontWeight: 700, marginTop: 2 }}>Main Deck · Sector B-2</div>
              </div>
            </div>
          </div>

          {/* 비상 연락망 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#26de81', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
              <Phone size={20}/> 비상 연락망 (Emergency Contact)
            </div>
            <div style={{ background: 'rgba(38,222,129,0.06)', border: '1px solid rgba(38,222,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 850, color: '#fff' }}>{activePatient?.emergencyContact?.name || '부산원격의료센터'}</span>
                <span style={{ fontSize: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(38,222,129,0.15)', color: '#26de81', fontWeight: 800 }}>{activePatient?.emergencyContact?.relation || '전담의'}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#26de81', letterSpacing: '0.5px' }}>
                {activePatient?.emergencyContact?.phone || '051-123-4567'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(255,77,109,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={() => startEmergencyAction('CPR')} style={{ width: '100%', height: 72, borderRadius: 20, background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)' }}>
            <AlertTriangle size={28} /> 응급 처치 액션 시작
          </button>
        </div>
      </aside>

      {/* [Center] Vitals & AI Assistant */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080b12', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color="#f43f5e" live />
            <div onClick={toggleSpo2Status} style={{ cursor: 'pointer' }}>
              <DashboardVital 
                label="산소포화도" 
                value={spo2} 
                unit="%" 
                color="#38bdf8" 
                live 
                isConnected={spo2Status === 'normal'} 
              />
            </div>
            <DashboardVital label="호흡수" value={rr} unit="/min" color="#8b5cf6" live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color="#eab308" editable onEdit={() => openEdit('bp', bp)} />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#f97316" editable onEdit={() => openEdit('bt', bt)} />
          </div>

          {/* 인라인 플로팅 입력 모달 (확대 버전) */}
          {editTarget && (
            <div style={{
              position: 'absolute', 
              top: '100%', 
              left: editTarget === 'bp' ? '70%' : 'auto',
              right: editTarget === 'bt' ? '45px' : 'auto',
              transform: editTarget === 'bp' ? 'translateX(-50%) translateY(15px)' : 'translateY(15px)', 
              zIndex: 1000,
              width: 360, background: '#1e293b', border: '2px solid #38bdf8', borderRadius: 24,
              padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', animation: 'slideUp 0.2s ease'
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                {editTarget === 'bp' ? <Activity size={20} /> : <Droplets size={20} />}
                {editTarget === 'bp' ? '혈압 입력' : '체온 입력'}
              </div>
              <input 
                autoFocus
                value={editValue} 
                placeholder={editTarget === 'bp' ? '예: 120/80' : '예: 36.5'}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                  }
                }}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 14, padding: '16px 20px', color: '#fff', fontSize: 24, fontWeight: 800,
                  outline: 'none', marginBottom: 20, textAlign: 'center', letterSpacing: '1px'
                }}
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>취소</button>
                <button onClick={saveEdit} style={{ flex: 2, padding: '14px', borderRadius: 12, background: '#38bdf8', color: '#000', border: 'none', fontWeight: 950, fontSize: 16, cursor: 'pointer', transition: '0.2s' }}>데이터 저장</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080b12', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0d17', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0' }}>
              <Sparkles size={20} color="#38bdf8" /> MDTS 진단 어시스턴트
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>AI 분석 엔진 v2.0</div>

            {/* 헤더 하단 초고휘도 네온 빛 흐름 효과 (순수 에메랄드 #00e5cc & 5S 적용) */}
            <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: '-100%', 
                width: '60%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(0, 229, 204, 0.2), #00e5cc, rgba(0, 229, 204, 0.2), transparent)',
                boxShadow: '0 0 12px #00e5cc',
                animation: 'flowingLight 5s infinite linear'
              }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 120px 20px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: m.role === 'ai' ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.role === 'ai' ? <Sparkles size={14} color="#000" /> : <User size={14} color="#fff" />}
                </div>
                <div style={{ flex: 1, maxWidth: '92%' }}>
                   <div style={{ 
                     padding: '16px 22px', borderRadius: m.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px', 
                     background: m.role === 'ai' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.03)', 
                     border: m.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)', 
                     fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: '#e2e8f0' 
                   }}>
                     <AiMessageRenderer text={m.text} />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* 중앙 프롬프트창 (좌우 버튼과 동일 선상 정렬) */}
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '20px 20px 24px 20px', 
            background: 'linear-gradient(to top, #05070a 85%, transparent)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            zIndex: 10,
            height: 116,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '100%',
              background: '#0a0f1e', 
              borderRadius: '20px', 
              padding: '6px 6px 6px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              border: '1px solid rgba(56,189,248,0.2)',
              height: 72, // 좌우 버튼 높이와 일치
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <Sparkles size={22} color="#38bdf8" style={{ animation: 'spin 4s infinite linear', flexShrink: 0 }} />
              <input 
                placeholder="환자 상태 또는 처치 방법에 대해 질문하세요..." 
                value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 18, fontWeight: 500 }} 
              />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 28px', height: '100%', borderRadius: '14px', border: 'none', background: '#38bdf8', color: '#000', fontWeight: 950, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                질문하기 <ArrowUp size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* [Right] Timeline */}
      <aside style={{ display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        {/* 타임라인 헤더 (고정) */}
        <div style={{ flexShrink: 0, padding: '32px 28px 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={22}/> 상황 대응 타임라인
          </div>
        </div>

        {/* 타임라인 리스트 (스크롤 가능 영역) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 120px 28px', scrollbarWidth: 'none' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', left: 7, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, #f43f5e, #facc15, #38bdf8)' }} />
            <div style={{ position: 'relative', paddingLeft: 36, paddingBottom: 48 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#f43f5e', border: '4px solid #05070a', boxShadow: '0 0 0 2px #f43f5e', zIndex: 2 }} />
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', borderRadius: 20, padding: '24px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#f43f5e', marginBottom: 10 }}>09:12 · 사고 상황 요약</div>
                <div style={{ fontSize: 19, fontWeight: 950, color: '#fff', marginBottom: 12 }}>엔진실 사다리에서 추락 (1.8m)</div>
                <div style={{ fontSize: 17, color: '#fda4af', fontWeight: 750, lineHeight: 1.7 }}>
                  • 왼쪽 어깨 뼈가 툭 튀어나오고 이상함<br />
                  • 가슴이 너무 아파서 숨쉬기 힘들다고 함<br />
                  • 머리에 상처가 있고 몸 여기저기 까짐
                </div>
              </div>
            </div>
            {[
              { time: '09:18', title: '인터넷 끊김 - AI 자체 모드로 전환', color: '#f43f5e' },
              { time: '09:20', title: 'MDTS 인공지능 진단 시작', color: '#f43f5e' },
              { time: '09:25', title: '환자 의무실로 옮기고 우리끼리 응급처치', color: '#fb923c' },
              { time: '09:30', title: 'AI 분석 결과 뼈가 부러진 것 같음', color: '#facc15' },
              { time: '09:45', title: '화면 안내대로 팔 고정하고 찜질함', color: '#facc15' },
              { time: '10:00', title: '환자 숨소리랑 맥박 계속 체크 중', color: '#94d3a2' },
              { time: '10:15', title: '비상용 종이 매뉴얼 다시 확인', color: '#38bdf8' },
              { time: '10:30', title: '다친 부위 사진 찍어서 다시 정밀 분석', color: '#38bdf8' },
              { time: '10:45', title: '환자 상태가 조금씩 안정되는 것 같음', color: '#38bdf8' },
              { time: '11:00', title: '나중에 의사한테 보여줄 기록 자동 저장', color: '#38bdf8' },
              { time: '11:15', title: '옆에서 계속 대기하며 상태 지켜보기', color: '#38bdf8' },
              { time: '11:30', title: '환자 의식 있는지 확인하고 기록 완료', color: '#38bdf8' }
            ].map((item, idx) => (
              <div key={idx} style={{ position: 'relative', paddingLeft: 36, paddingBottom: 40 }}>
                <div style={{ position: 'absolute', left: 0, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#05070a', border: `3px solid ${item.color}`, zIndex: 2 }} />
                <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.time}</div>
                <div style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 외상 촬영 버튼 (하단 고정) */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 28px 24px 28px', borderTop: '1px solid rgba(56,189,248,0.2)', background: 'linear-gradient(to top, #05070a 85%, transparent)', zIndex: 10 }}>
          <button onClick={handleTraumaAnalysis} style={{ width: '100%', height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 22, boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)' }}>
            <Camera size={28} /> 외상 촬영 및 AI 정밀 분석
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes scanMove {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes scanMoveInner {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes bracketPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flowingLight {
          0% { left: -100%; }
          50% { left: 0%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

function AiMessageRenderer({ text }) {
  if (!text) return null;
  const confMatch = text.match(/\[CONFIDENCE: (.*?)\]/);
  const evidenceMatch = text.match(/\[EVIDENCE: (.*?)\]/);
  const guideMatch = text.match(/\[GUIDE: (.*?)\]/);
  const confidence = confMatch ? confMatch[1] : null;
  const evidence = evidenceMatch ? evidenceMatch[1] : null;
  const guide = guideMatch ? guideMatch[1] : null;
  const cleanText = text.replace(/\[.*?\]/g, '').trim();

  // 문장 내 주요 키워드 강조 처리 (예: ':' 앞의 텍스트나 특정 패턴)
  const formattedText = cleanText.split('\n').map((line, i) => {
    if (line.includes(':')) {
      const [label, content] = line.split(':');
      return <div key={i}><span style={{ fontWeight: 900, color: '#fff' }}>{label}:</span>{content}</div>;
    }
    if (line.startsWith('•')) {
      return <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 800, color: '#38bdf8', marginRight: 8 }}>•</span>{line.substring(1)}</div>;
    }
    return <div key={i} style={{ marginBottom: 8 }}>{line}</div>;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ whiteSpace: 'pre-line', fontSize: 22 }}>{formattedText}</div>
      {(confidence || evidence || guide) && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {confidence && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18}/> AI 진단 신뢰도</span>
                <span style={{ fontSize: 20, fontWeight: 950, color: '#38bdf8' }}>{confidence}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: confidence, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 3 }} />
              </div>
            </div>
          )}
          {evidence && (
            <div style={{ background: 'rgba(56,189,248,0.08)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(56,189,248,0.25)' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}><Info size={18}/> AI 분석 판단 근거</div>
              <div style={{ fontSize: 18, color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{evidence}</div>
            </div>
          )}
          {guide && (
            <button style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={18} color="#38bdf8" /> 의학 가이드 확인 : {guide} <ChevronRight size={14}/>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
