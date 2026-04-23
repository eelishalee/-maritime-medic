import { useState, useEffect, useRef } from 'react'
import { Activity, History, RotateCcw, Droplets, Upload, AlertTriangle, Camera, Mic, User, Pill, AlertCircle, MapPin, Phone, Anchor, Weight, Ruler, HeartPulse, Paperclip, ArrowUp, Sparkles, CheckCircle2, Clock, Database, ChevronRight, Info, ShieldCheck, Zap, Crosshair, Eye, Maximize } from 'lucide-react'
import logoImg from '../../../assets/logo.png'
import { DashboardVital, InfoItem, TimelineItem } from '../../../components/ui'
import EmergencyGuide from './EmergencyGuide.jsx'
import React from 'react'

const C = {
  bg: '#020204',
  panel: 'rgba(10, 10, 20, 0.85)',
  panel2: 'rgba(15, 15, 35, 0.99)',
  border: '#1a1a3a',
  text: '#e0e6ed',
  sub: '#4e5a6b',
  dim: '#1a1a3a',
  success: '#00ffaa',
  warning: '#ffaa00',
  danger: '#ff0055',
  info: '#00d4ff',
  purple: '#bc00ff',
  cyan: '#00f7ff',
}

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
    <div className="cyber-bg" style={{ flex: 1, display: 'grid', gridTemplateColumns: '580px 1fr 620px', overflow: 'hidden', height: '100%', position: 'relative', background: C.bg, color: C.text }}>

      {/* 센서 점검 안내 오버레이 */}
      {showSensorGuide && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)', animation: 'fadeIn 0.3s' }}>
          <div style={{ width: 680, background: C.panel, border: `2px solid ${C.warning}`, borderRadius: 43, padding: 58, boxShadow: `0 0 50px ${C.warning}44`, textAlign: 'center' }}>
            <div style={{ width: 115, height: 115, borderRadius: '50%', background: `${C.warning}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 36px auto', border: `1px solid ${C.warning}44` }}>
              <AlertTriangle size={65} color={C.warning} />
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 950, color: C.warning, marginBottom: 22, textShadow: `0 0 15px ${C.warning}66` }}>산소포화도 센서 점검 안내</h2>
            <p style={{ fontSize: 25, color: C.text, lineHeight: 1.6, marginBottom: 43, fontWeight: 700 }}>
              환자의 손가락에 집게형 센서가 <br/>
              정확히 밀착되어 있는지 확인해 주세요. <br/>
              <span style={{ color: C.sub, fontSize: 20 }}>(주변 광원을 차단하면 정확도가 향상됩니다)</span>
            </p>
            <button 
              onClick={() => { setShowSensorGuide(false); setSpo2Status('normal'); }}
              style={{ width: '100%', padding: '25px', borderRadius: 22, background: C.warning, color: '#000', border: 'none', fontWeight: 950, fontSize: 25, cursor: 'pointer', transition: '0.2s', boxShadow: `0 8px 25px ${C.warning}66` }}
            >
              확인 및 재시도
            </button>
          </div>
        </div>
      )}

      {/* 외상 스캐너 오버레이 */}
      {isScanning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'rgba(0,0,0,0.6)',
            maskImage: 'radial-gradient(transparent 360px, black 430px)',
            WebkitMaskImage: 'radial-gradient(transparent 360px, black 430px)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'absolute', top: 115, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1010 }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', padding: '22px 72px', borderRadius: '22px', color: '#fff', fontSize: 32, fontWeight: 800, border: `1px solid ${C.border}`, letterSpacing: '-0.7px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
              외상 부위 전체를 사각형 프레임에 맞춰 인식해 주세요
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '720px', height: '720px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 86, height: 86, borderTop: `18px solid ${C.danger}`, borderLeft: `18px solid ${C.danger}`, borderRadius: '43px 0 0 0', filter: `drop-shadow(0 0 15px ${C.danger})` }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 86, height: 86, borderTop: `18px solid ${C.danger}`, borderRight: `18px solid ${C.danger}`, borderRadius: '0 43px 0 0', filter: `drop-shadow(0 0 15px ${C.danger})` }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 86, height: 86, borderBottom: `18px solid ${C.danger}`, borderLeft: `18px solid ${C.danger}`, borderRadius: '0 0 0 43px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 86, height: 86, borderBottom: `18px solid ${C.danger}`, borderRight: `18px solid ${C.danger}`, borderRadius: '0 0 43px 0' }} />
              {!scanError && (
                <div style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '6px', background: C.danger, boxShadow: `0 0 25px ${C.danger}`, borderRadius: '3px', animation: 'scanMoveInner 3s infinite ease-in-out' }} />
              )}
            </div>
            {scanError && (
              <div style={{ position: 'absolute', background: 'rgba(255,0,85,0.95)', padding: '29px 58px', borderRadius: '22px', color: '#fff', textAlign: 'center', animation: 'fadeIn 0.3s', backdropFilter: 'blur(10px)', border: `1px solid ${C.danger}44` }}>
                <div style={{ fontSize: 32, fontWeight: 950, marginBottom: 11 }}>외상 데이터 분석 불가</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>초점이 흐리거나 조도가 낮습니다. 외상 부위를 정중앙에 맞추고 다시 시도해 주세요.</div>
                <button onClick={() => setScanError(null)} style={{ marginTop: 22, padding: '14px 36px', borderRadius: '11px', border: 'none', background: '#fff', color: C.danger, fontWeight: 950, cursor: 'pointer', fontSize: 20 }}>다시 시도</button>
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: 86, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1010 }}>
            <button onClick={() => setIsScanning(false)} style={{ background: 'rgba(255,255,255,0.1)', padding: '22px 72px', borderRadius: '18px', color: '#fff', fontSize: 25, fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              분석 취소 및 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* [Left] Patient Info Panel */}
      <aside style={{ borderRight: `1px solid ${C.border}`, background: C.panel, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0, backdropFilter: 'blur(10px)' }}>
        <div style={{ flexShrink: 0, padding: '36px 40px 29px 40px', borderBottom: `1px solid ${C.cyan}22`, background: `${C.cyan}08` }}>
          <div style={{ display: 'flex', gap: 36, marginBottom: 36 }}>
            <div style={{ width: 158, height: 158, borderRadius: 36, background: C.panel, border: `4px solid ${C.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, position: 'relative', boxShadow: `0 0 20px ${C.cyan}33` }}>
              <img 
                src={activePatient?.avatar || '/CE.jpeg'} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activePatient?.name || 'User') + '&background=00f7ff&color=000&size=256';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Patient Profile"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 9 }}>
                <div style={{ fontSize: 52, fontWeight: 950, letterSpacing: '-0.7px', color: '#fff', textShadow: `0 0 15px ${C.cyan}44` }}>{activePatient?.name || '김항해'}</div>
                <div style={{ fontSize: 28, color: C.cyan, fontWeight: 800 }}>{activePatient?.role || '기관장'}</div>
              </div>
              <div style={{ fontSize: 22, color: C.sub, fontWeight: 700 }}>ID : {activePatient?.id || 'S2026-026'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
            <InfoItem label="나이/성별" value={`${activePatient?.age || 55}세 / 남`} size="xl_ultra" />
            <InfoItem label="혈액형" value={activePatient?.blood || 'A+형'} size="xl_ultra" />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '40px 40px 172px 40px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 46 }}>
          {/* 과거력 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.cyan, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <History size={28} color={C.cyan}/> 과거력 (Past History)
            </div>
            <div style={{ fontSize: 25, fontWeight: 750, color: C.text, lineHeight: 1.6, background: C.panel2, padding: '22px', borderRadius: 22, border: `1px solid ${C.border}` }}>
              {activePatient?.history ? activePatient.history.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              )) : '기록 없음'}
            </div>
          </div>

          {/* 최근 진료 이력 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.info, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <RotateCcw size={28} color={C.info}/> 최근 진료 이력
            </div>
            <div style={{ background: `${C.info}08`, borderRadius: 22, padding: '28px', border: `1px solid ${C.info}33` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontSize: 25, fontWeight: 850, color: C.info }}>{activePatient?.recentHistory?.date || '2026-03-15'}</span>
                <span style={{ fontSize: 22, color: C.sub, fontWeight: 700 }}>{activePatient?.recentHistory?.title || '단순 감기'}</span>
              </div>
              <div style={{ fontSize: 22, color: '#8da2c0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {activePatient?.recentHistory?.detail || '- 처방 : 타이레놀 500mg\n- 특이사황 : 알레르기 반응 없음'}
              </div>
            </div>
          </div>

          {/* 알레르기 및 주의사항 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.danger, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <AlertCircle size={28} color={C.danger}/> 알레르기 / 주의사항
            </div>
            <div style={{ background: `${C.danger}08`, border: `1px solid ${C.danger}33`, borderRadius: 22, padding: '22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(activePatient?.allergies || '페니실린 알레르기 있음').split(',').map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.danger, boxShadow: `0 0 8px ${C.danger}` }} />
                  <span style={{ fontSize: 25, fontWeight: 750, color: '#fda4af' }}>{a.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 복용 약물 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.warning, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <Pill size={28} color={C.warning}/> 복용 중인 약물
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ name: '혈압약 (암로디핀)', purpose: '고혈압' }, { name: '고지혈증약', purpose: '고지혈증' }].map((drug, i) => (
                <div key={i} style={{ background: `${C.warning}08`, border: `1px solid ${C.warning}33`, borderRadius: 20, padding: '20px 25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 25, fontWeight: 850, color: '#fed7aa' }}>{drug.name}</span>
                    <span style={{ fontSize: 20, color: C.warning, fontWeight: 800 }}>{drug.purpose}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 작업 위치 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.cyan, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <MapPin size={28} color={C.cyan}/> 환자 작업 위치 (Work Location)
            </div>
            <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.cyan}33`, borderRadius: 22, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${C.cyan}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.cyan}44` }}>
                <Anchor size={32} color={C.cyan} />
              </div>
              <div>
                <div style={{ fontSize: 25, fontWeight: 850, color: '#fff' }}>{activePatient?.workLocation || '제2엔진실 (Engine Room)'}</div>
                <div style={{ fontSize: 20, color: C.sub, fontWeight: 700, marginTop: 3 }}>Main Deck · Sector B-2</div>
              </div>
            </div>
          </div>

          {/* 비상 연락망 섹션 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.success, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
              <Phone size={28} color={C.success}/> 비상 연락망 (Emergency Contact)
            </div>
            <div style={{ background: `${C.success}08`, border: `1px solid ${C.success}33`, borderRadius: 22, padding: '25px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 25, fontWeight: 850, color: '#fff' }}>{activePatient?.emergencyContact?.name || '부산원격의료센터'}</span>
                <span style={{ fontSize: 20, padding: '6px 14px', borderRadius: 11, background: `${C.success}18`, color: C.success, fontWeight: 800, border: `1px solid ${C.success}44` }}>{activePatient?.emergencyContact?.relation || '전담의'}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.success, letterSpacing: '0.7px', textShadow: `0 0 10px ${C.success}44` }}>
                {activePatient?.emergencyContact?.phone || '051-123-4567'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 40px 36px 40px', borderTop: `1px solid ${C.danger}44`, background: `linear-gradient(to top, ${C.bg} 85%, transparent)`, zIndex: 10 }}>
          <button onClick={() => startEmergencyAction('CPR')} style={{ width: '100%', height: 104, borderRadius: 28, background: C.danger, color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontSize: 32, boxShadow: `0 11px 36px ${C.danger}66`, transition: '0.2s' }}>
            <AlertTriangle size={40} /> 응급 처치 액션 시작
          </button>
        </div>
      </aside>

      {/* [Center] Vitals & AI Assistant */}
      <section style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', borderRight: `1px solid ${C.border}` }}>
        <div style={{ padding: '20px 65px', borderBottom: `1px solid ${C.border}`, background: 'rgba(8, 11, 18, 0.8)', position: 'relative', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            <DashboardVital label="심박수" value={hr} unit="bpm" color={C.danger} live />
            <div onClick={toggleSpo2Status} style={{ cursor: 'pointer' }}>
              <DashboardVital 
                label="산소포화도" 
                value={spo2} 
                unit="%" 
                color={C.info} 
                live 
                isConnected={spo2Status === 'normal'} 
              />
            </div>
            <DashboardVital label="호흡수" value={rr} unit="/min" color={C.purple} live />
            <DashboardVital label="혈압 (입력)" value={bp} unit="mmHg" color={C.warning} editable onEdit={() => openEdit('bp', bp)} />
            <DashboardVital label="체온 (입력)" value={bt} unit="°C" color="#f97316" editable onEdit={() => openEdit('bt', bt)} />
          </div>

          {/* 인라인 플로팅 입력 모달 */}
          {editTarget && (
            <div style={{
              position: 'absolute', 
              top: '100%', 
              left: editTarget === 'bp' ? '70%' : 'auto',
              right: editTarget === 'bt' ? '65px' : 'auto',
              transform: editTarget === 'bp' ? 'translateX(-50%) translateY(22px)' : 'translateY(22px)', 
              zIndex: 1000,
              width: 520, background: C.panel, border: `2px solid ${C.info}`, borderRadius: 32,
              padding: 40, boxShadow: `0 30px 72px rgba(0,0,0,0.8)`, animation: 'slideUp 0.2s ease', backdropFilter: 'blur(20px)'
            }}>
              <div style={{ fontSize: 25, fontWeight: 900, color: C.info, marginBottom: 25, display: 'flex', alignItems: 'center', gap: 14 }}>
                {editTarget === 'bp' ? <Activity size={28} /> : <Droplets size={28} />}
                {editTarget === 'bp' ? '혈압 입력' : '체온 입력'}
              </div>
              <input 
                autoFocus
                value={editValue} 
                placeholder={editTarget === 'bp' ? '예: 120/80' : '예: 36.5'}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: '22px 28px', color: '#fff', fontSize: 34, fontWeight: 800,
                  outline: 'none', marginBottom: 28, textAlign: 'center', letterSpacing: '1.5px', boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditTarget(null)} style={{ flex: 1, padding: '20px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', color: C.sub, border: 'none', fontWeight: 800, fontSize: 22, cursor: 'pointer', transition: '0.2s' }}>취소</button>
                <button onClick={saveEdit} style={{ flex: 2, padding: '20px', borderRadius: 18, background: C.info, color: '#000', border: 'none', fontWeight: 950, fontSize: 22, cursor: 'pointer', transition: '0.2s', boxShadow: `0 8px 20px ${C.info}44` }}>데이터 저장</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(8, 11, 18, 0.5)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '22px 34px', borderBottom: `1px solid ${C.border}`, background: 'rgba(10, 13, 23, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 25, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 14, color: C.text }}>
              <Sparkles size={28} color={C.cyan} /> MDTS 진단 어시스턴트
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.cyan, background: `${C.cyan}18`, padding: '6px 14px', borderRadius: '11px', border: `1px solid ${C.cyan}33` }}>AI 분석 엔진 v2.0</div>

            {/* 헤더 하단 네온 빛 흐름 효과 */}
            <div style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '3px', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: '-100%', 
                width: '60%', height: '100%',
                background: `linear-gradient(90deg, transparent, ${C.cyan}33, ${C.cyan}, ${C.cyan}33, transparent)`,
                boxShadow: `0 0 18px ${C.cyan}`,
                animation: 'flowingLight 5s infinite linear'
              }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 28px 172px 28px', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {chat?.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'ai' ? 'row' : 'row-reverse', gap: 11 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: m.role === 'ai' ? C.cyan : C.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: m.role === 'ai' ? `0 0 15px ${C.cyan}44` : 'none' }}>
                  {m.role === 'ai' ? <Sparkles size={20} color="#000" /> : <User size={20} color="#fff" />}
                </div>
                <div style={{ flex: 1, maxWidth: '92%' }}>
                   <div style={{ 
                     padding: '22px 32px', borderRadius: m.role === 'ai' ? '0 28px 28px 28px' : '28px 0 28px 28px', 
                     background: m.role === 'ai' ? `${C.cyan}0a` : 'rgba(255, 255, 255, 0.04)', 
                     border: m.role === 'ai' ? `1px solid ${C.cyan}33` : `1px solid ${C.border}`, 
                     fontSize: 32, fontWeight: 500, lineHeight: 1.5, color: C.text,
                     boxShadow: m.role === 'ai' ? `0 4px 20px rgba(0,0,0,0.2)` : 'none'
                   }}>
                     <AiMessageRenderer text={m.text} />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '28px 28px 34px 28px', 
            background: `linear-gradient(to top, ${C.bg} 85%, transparent)`,
            borderTop: `1px solid ${C.border}`,
            zIndex: 10,
            height: 167,
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '100%',
              background: '#0a0f1e', 
              borderRadius: '28px', 
              padding: '9px 9px 9px 28px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 18, 
              border: `1px solid ${C.cyan}44`,
              height: 104,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${C.cyan}11`
            }}>
              <Sparkles size={32} color={C.cyan} style={{ animation: 'spin 4s infinite linear', flexShrink: 0 }} />
              <input 
                placeholder="환자 상태 또는 처치 방법에 대해 질문하세요..." 
                value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePromptAnalysis()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 25, fontWeight: 500 }} 
              />
              <button onClick={handlePromptAnalysis} style={{ padding: '0 40px', height: '100%', borderRadius: '20px', border: 'none', background: C.cyan, color: '#000', fontWeight: 950, fontSize: 25, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 0 15px ${C.cyan}66` }}>
                질문하기 <ArrowUp size={28} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* [Right] Timeline */}
      <aside style={{ display: 'flex', flexDirection: 'column', background: C.panel, overflow: 'hidden', position: 'relative', borderLeft: `1px solid ${C.border}`, backdropFilter: 'blur(10px)' }}>
        <div style={{ flexShrink: 0, padding: '46px 40px 29px 40px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.cyan, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: 14, textShadow: `0 0 15px ${C.cyan}66` }}>
            <Clock size={32}/> 상황 대응 타임라인
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '34px 40px 172px 40px', scrollbarWidth: 'none' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', left: 10, top: 14, bottom: 14, width: 3, background: `linear-gradient(to bottom, ${C.danger}, ${C.warning}, ${C.info})`, boxShadow: `0 0 10px rgba(56,189,248,0.3)` }} />
            <div style={{ position: 'relative', paddingLeft: 52, paddingBottom: 68 }}>
              <div style={{ position: 'absolute', left: 0, top: 6, width: 22, height: 22, borderRadius: '50%', background: C.danger, border: `6px solid ${C.bg}`, boxShadow: `0 0 0 3px ${C.danger}`, zIndex: 2 }} />
              <div style={{ background: `${C.danger}11`, borderRadius: 28, padding: '34px', border: `1px solid ${C.danger}44`, boxShadow: `0 0 20px ${C.danger}22` }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.danger, marginBottom: 14 }}>09:12 · 사고 상황 요약</div>
                <div style={{ fontSize: 28, fontWeight: 950, color: '#fff', marginBottom: 18 }}>엔진실 사다리에서 추락 (1.8m)</div>
                <div style={{ fontSize: 25, color: '#fda4af', fontWeight: 750, lineHeight: 1.7 }}>
                  • 왼쪽 어깨 뼈가 툭 튀어나오고 이상함<br />
                  • 가슴이 너무 아파서 숨쉬기 힘들다고 함<br />
                  • 머리에 상처가 있고 몸 여기저기 까짐
                </div>
              </div>
            </div>
            {[
              { time: '09:18', title: '인터넷 끊김 - AI 자체 모드로 전환', color: C.danger },
              { time: '09:20', title: 'MDTS 인공지능 진단 시작', color: C.danger },
              { time: '09:25', title: '환자 의무실로 옮기고 우리끼리 응급처치', color: C.warning },
              { time: '09:30', title: 'AI 분석 결과 뼈가 부러진 것 같음', color: C.warning },
              { time: '09:45', title: '화면 안내대로 팔 고정하고 찜질함', color: C.warning },
              { time: '10:00', title: '환자 숨소리랑 맥박 계속 체크 중', color: C.success },
              { time: '10:15', title: '비상용 종이 매뉴얼 다시 확인', color: C.info },
              { time: '10:30', title: '다친 부위 사진 찍어서 다시 정밀 분석', color: C.info },
              { time: '10:45', title: '환자 상태가 조금씩 안정되는 것 같음', color: C.info },
              { time: '11:00', title: '나중에 의사한테 보여줄 기록 자동 저장', color: C.info },
              { time: '11:15', title: '옆에서 계속 대기하며 상태 지켜보기', color: C.info },
              { time: '11:30', title: '환자 의식 있는지 확인하고 기록 완료', color: C.info }
            ].map((item, idx) => (
              <div key={idx} style={{ position: 'relative', paddingLeft: 52, paddingBottom: 58 }}>
                <div style={{ position: 'absolute', left: 0, top: 6, width: 22, height: 22, borderRadius: '50%', background: C.bg, border: `4px solid ${item.color}`, zIndex: 2, boxShadow: `0 0 10px ${item.color}66` }} />
                <div style={{ fontSize: 25, fontWeight: 900, color: item.color }}>{item.time}</div>
                <div style={{ fontSize: 32, fontWeight: 950, color: '#fff' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 40px 36px 40px', borderTop: `1px solid ${C.cyan}44`, background: `linear-gradient(to top, ${C.bg} 85%, transparent)`, zIndex: 10 }}>
          <button onClick={handleTraumaAnalysis} style={{ width: '100%', height: 104, borderRadius: 28, background: `linear-gradient(135deg, ${C.info}, ${C.cyan})`, color: '#000', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontSize: 32, boxShadow: `0 11px 36px ${C.cyan}66`, transition: '0.2s' }}>
            <Camera size={40} /> 외상 촬영 및 AI 정밀 분석
          </button>
        </div>
      </aside>

      <style>{`
        @keyframes scanMoveInner {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(43px); } to { opacity: 1; transform: translateY(0); } }
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

  const formattedText = cleanText.split('\n').map((line, i) => {
    if (line.includes(':')) {
      const [label, content] = line.split(':');
      return <div key={i} style={{ marginBottom: 6 }}><span style={{ fontWeight: 900, color: '#fff' }}>{label}:</span>{content}</div>;
    }
    if (line.startsWith('•')) {
      return <div key={i} style={{ marginBottom: 6 }}><span style={{ fontWeight: 800, color: C.cyan, marginRight: 11 }}>•</span>{line.substring(1)}</div>;
    }
    return <div key={i} style={{ marginBottom: 11 }}>{line}</div>;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ whiteSpace: 'pre-line', fontSize: 32 }}>{formattedText}</div>
      {(confidence || evidence || guide) && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {confidence && (
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px 28px', borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: C.sub, display: 'flex', alignItems: 'center', gap: 11 }}><ShieldCheck size={25}/> AI 진단 신뢰도</span>
                <span style={{ fontSize: 28, fontWeight: 950, color: C.cyan, textShadow: `0 0 10px ${C.cyan}66` }}>{confidence}</span>
              </div>
              <div style={{ height: 9, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: confidence, height: '100%', background: `linear-gradient(90deg, ${C.info}, ${C.cyan})`, borderRadius: 4, boxShadow: `0 0 15px ${C.cyan}` }} />
              </div>
            </div>
          )}
          {evidence && (
            <div style={{ background: `${C.cyan}0d`, padding: '22px 28px', borderRadius: 20, border: `1px solid ${C.cyan}33` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 11 }}><Info size={25}/> AI 분석 판단 근거</div>
              <div style={{ fontSize: 25, color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{evidence}</div>
            </div>
          )}
          {guide && (
            <button style={{ alignSelf: 'flex-start', padding: '14px 28px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: '#fff', fontSize: 22, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, transition: '0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <Database size={25} color={C.cyan} /> 의학 가이드 확인 : {guide} <ChevronRight size={20}/>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
