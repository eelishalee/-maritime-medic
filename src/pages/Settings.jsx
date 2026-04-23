import { useState, useMemo } from 'react'
import { Ship, Database, Shield, CheckCircle, Smartphone, Cpu, Wifi, Globe, Bell, Lock, Activity, TrendingUp, AlertTriangle, Search, Filter, Download, MoreHorizontal, Plus, Trash2, Edit2, Calendar, BookOpen, GraduationCap, ClipboardList, Save } from 'lucide-react'
import { SettingCard, ModalField } from '../components/ui'
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

// 폰트 스타일 상우
const FONT_STYLE = { fontFamily: '"Pretendard", "Inter", sans-serif' };

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system')
  
  // 훈련 이력 데이터
  const [trainingLogs, setTrainingLogs] = useState([
    { id: 1, type: '기초안전교육', name: '해상 생존 기술', date: '2026-02-15', instructor: '김교육', status: '완료' },
    { id: 2, type: '구명정조종', name: '고속 구조정 운용', date: '2026-03-10', instructor: '박안전', status: '완료' },
  ])

  // 신규 훈련 입력 폼 상태
  const [newTraining, setNewTraining] = useState({ type: '기초안전교육', name: '', date: '', instructor: '' })

  const handleAddTraining = (e) => {
    e.preventDefault()
    if (!newTraining.name || !newTraining.date) return
    setTrainingLogs([{ ...newTraining, id: Date.now(), status: '완료' }, ...trainingLogs])
    setNewTraining({ type: '기초안전교육', name: '', date: '', instructor: '' })
  }

  return (
    <div className="cyber-bg" style={{ flex: 1, height: 'calc(100vh - 86px)', background: C.bg, display: 'flex', flexDirection: 'column', ...FONT_STYLE }}>
      
      {/* 상단 탭 네비게이션 */}
      <div style={{ background: 'rgba(5, 7, 10, 0.95)', borderBottom: `1px solid ${C.border}`, padding: '0 46px', display: 'flex', gap: 34, height: 82, flexShrink: 0 }}>
        <TabBtn id="system" label="시스템 인증" active={activeTab === 'system'} onClick={setActiveTab} icon={<Ship size={25}/>} />
        <TabBtn id="training" label="훈련 및 이력 관리" active={activeTab === 'training'} onClick={setActiveTab} icon={<GraduationCap size={25}/>} />
        <TabBtn id="security" label="보안 및 네트워크" active={activeTab === 'security'} onClick={setActiveTab} icon={<Shield size={25}/>} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '46px', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          
          {/* 1. 시스템 및 인증 정보 탭 */}
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34, animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                <Ship size={46} color={C.cyan} />
                <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: '-1.5px', margin: 0, color: '#fff' }}>시스템 식별 및 기기 정보</h1>
              </div>

              <SettingCard icon={<Smartphone />} title="디바이스 및 선박 인증" desc="현재 접속 중인 MDTS 엣지 장비와 선박의 고유 보안 식별 정보입니다.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, marginTop: 28 }}>
                  <ModalField label="선박 명칭 (Vessel Name)" value="HAESIN-07 (IMO 9876543)" readOnly />
                  <ModalField label="장비 고유 ID (Device ID)" value="MDTS-EDGE-UNIT-A1" readOnly />
                  <ModalField label="보안 시리얼 넘버" value="SN-2026-0423-MAR-77" readOnly />
                  <ModalField label="최종 인증 시각" value="2026-04-23 09:00:12" readOnly />
                </div>
              </SettingCard>

              <SettingCard icon={<Cpu />} title="시스템 리소스 상태" desc="오프라인 AI 분석을 위한 로컬 컴퓨팅 자원 및 데이터베이스 가용 현황입니다.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginTop: 28 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '34px', borderRadius: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' }}>AI 엔진 버전</div>
                    <div style={{ fontSize: 36, fontWeight: 950, color: C.success }}>v2.4.8 (Stable)</div>
                    <div style={{ fontSize: 16, color: C.success, fontWeight: 700, marginTop: 6, opacity: 0.8 }}>최신 패치 적용됨</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '34px', borderRadius: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' }}>NPU 연산 가동률</div>
                    <div style={{ fontSize: 36, fontWeight: 950, color: C.cyan }}>14.2%</div>
                    <div style={{ fontSize: 16, color: C.cyan, fontWeight: 700, marginTop: 6, opacity: 0.8 }}>정상 작동 중</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '34px', borderRadius: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' }}>로컬 DB 저장소</div>
                    <div style={{ fontSize: 36, fontWeight: 950, color: C.info }}>1,240 / 2,048 GB</div>
                    <div style={{ fontSize: 16, color: C.info, fontWeight: 700, marginTop: 6, opacity: 0.8 }}>850개 케이스 저장</div>
                  </div>
                </div>
              </SettingCard>
            </div>
          )}

          {/* 2. 훈련 및 이력 관리 탭 (수정됨) */}
          {activeTab === 'training' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34, animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                <GraduationCap size={46} color={C.purple} />
                <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: '-1.5px', margin: 0, color: '#fff' }}>법정 안전 훈련 및 이력 관리</h1>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: 34 }}>
                {/* 훈련 이력 입력 폼 */}
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '40px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.purple, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Plus size={28} /> 신규 훈련 이력 등록
                  </div>
                  <form onSubmit={handleAddTraining} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <div>
                      <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>교육 종류 (해상 법정 훈련)</label>
                      <select 
                        value={newTraining.type}
                        onChange={e => setNewTraining({...newTraining, type: e.target.value})}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="기초안전교육">기초 안전 교육 (Survival)</option>
                        <option value="구명정조종">구명정 및 구조정 교육</option>
                        <option value="상급소방교육">상급 소방 교육 (Fire)</option>
                        <option value="의료관리교육">의료 관리 교육 (Medical)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>교육 과정명</label>
                      <input 
                        placeholder="예: 실전 가슴 압박 실습"
                        value={newTraining.name}
                        onChange={e => setNewTraining({...newTraining, name: e.target.value})}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>교육 일자</label>
                        <input 
                          type="date"
                          value={newTraining.date}
                          onChange={e => setNewTraining({...newTraining, date: e.target.value})}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>담당 교관</label>
                        <input 
                          placeholder="교관 성명"
                          value={newTraining.instructor}
                          onChange={e => setNewTraining({...newTraining, instructor: e.target.value})}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none' }}
                        />
                      </div>
                    </div>
                    <button type="submit" style={{ marginTop: 14, height: 82, background: C.purple, color: '#fff', border: 'none', borderRadius: 22, fontWeight: 950, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, boxShadow: `0 8px 25px ${C.purple}44`, transition: '0.2s' }}>
                      <Save size={28}/> 이력 데이터 저장
                    </button>
                  </form>
                </div>

                {/* 훈련 이력 리스트 */}
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '40px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <ClipboardList size={28} /> 승선 선원 훈련 기록 (최근 순)
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {trainingLogs.map(log => (
                      <div key={log.id} style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 16, padding: '4px 11px', borderRadius: 8, background: `${C.purple}18`, color: C.purple, fontWeight: 850, border: `1px solid ${C.purple}33` }}>{log.type}</span>
                            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{log.name}</span>
                          </div>
                          <div style={{ fontSize: 18, color: C.sub, fontWeight: 700 }}>교육 일자 : {log.date} · 담당 : {log.instructor}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.success, fontSize: 20, fontWeight: 950 }}>
                          <CheckCircle size={22} /> 인증 완료
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. 보안 및 네트워크 설정 */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34, animation: 'fadeIn 0.3s' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                <Shield size={46} color={C.danger} />
                <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: '-1.5px', margin: 0, color: '#fff' }}>보안 제어 및 연결 설정</h1>
              </div>

              <SettingCard icon={<Wifi />} title="데이터 동기화 및 클라우드" desc="선박의 위성 인터넷 연결 상태와 클라우드 서버와의 통신 설정을 관리합니다.">
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <ToggleItem label="위성 인터넷 자동 연결 시도" on color={C.cyan} />
                  <ToggleItem label="응급 상황 시 실시간 데이터 미러링" on color={C.success} />
                  <ToggleItem label="로컬 AI 모델 백그라운드 업데이트" color={C.purple} />
                </div>
              </SettingCard>

              <SettingCard icon={<Lock />} title="보안 인증 모듈" desc="선원 개인정보 보호 및 시스템 접근 권한에 대한 보안 정책입니다.">
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <ToggleItem label="생체 인식 로그인 (Biometrics)" color={C.info} />
                  <ToggleItem label="민감 의료 정보 자동 마스킹" on color={C.cyan} />
                  <ToggleItem label="시스템 접근 로그 90일 보존" on color={C.success} />
                </div>
              </SettingCard>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(11px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

function TabBtn({ id, label, active, onClick, icon }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '0 34px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: active ? C.cyan : C.sub,
        fontSize: 25, fontWeight: 900,
        borderBottom: `6px solid ${active ? C.cyan : 'transparent'}`,
        transition: '0.2s', position: 'relative'
      }}
    >
      <div style={{ color: active ? C.cyan : C.sub }}>{icon}</div>
      {label}
    </button>
  )
}

function ToggleItem({ label, on, onChange, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{label}</span>
      <div onClick={onChange} style={{ width: 68, height: 36, borderRadius: 18, background: on ? color : C.dim,
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 4, left: on ? 36 : 4, width: 28, height: 28,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}/>      
      </div>
    </div>
  )
}
