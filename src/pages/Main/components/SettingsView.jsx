import { Ship, Database, Shield, CheckCircle, Smartphone, Cpu, Wifi, Globe, Bell, Lock, GraduationCap, Plus, ClipboardList, Save } from 'lucide-react'
import { SettingCard, ModalField } from '../../../components/ui'
import { useState } from 'react'
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

const FONT_STYLE = { fontFamily: '"Pretendard", "Inter", sans-serif' };

export default function SettingsView({ auth }) {
  const [trainingLogs, setTrainingLogs] = useState([
    { id: 1, type: '기초안전', name: '해상 생존 실습', date: '2026-02-15', instructor: '김교육' },
    { id: 2, type: '의료관리', name: '응급처치 심화', date: '2026-03-10', instructor: '박안전' },
  ])

  const [newTraining, setNewTraining] = useState({ type: '기초안전', name: '', date: '', instructor: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTraining.name || !newTraining.date) return
    setTrainingLogs([{ ...newTraining, id: Date.now() }, ...trainingLogs])
    setNewTraining({ type: '기초안전', name: '', date: '', instructor: '' })
  }

  return (
    <div className="cyber-bg" style={{ flex: 1, padding: 58, overflowY: 'auto', background: C.bg, color: C.text, scrollbarWidth: 'none', ...FONT_STYLE }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 58 }}>
          <Shield size={46} color={C.cyan} />
          <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: '-1.5px', margin: 0 }}>시스템 설정 및 안전 관리</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {/* 1. 기기 및 선박 정보 */}
          <SettingCard 
            icon={<Ship />} 
            title="기기 및 선박 인증 정보" 
            desc="현재 접속 중인 MDTS 엣지 디바이스와 선박의 고유 식별 정보입니다."
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 28 }}>
              <ModalField label="선박 명칭 (Vessel Name)" value={auth?.shipNo || 'HAESIN-07'} readOnly />
              <ModalField label="디바이스 ID (Device ID)" value={auth?.deviceNo || 'MDTS-EDGE-01'} readOnly />
              <ModalField label="시리얼 넘버" value="SN-2026-0423-AF88" readOnly />
              <ModalField label="최종 인증 시각" value="2026-04-23 09:00:12" readOnly />
            </div>
          </SettingCard>

          {/* 2. 법정 안전 훈련 관리 (수정됨) */}
          <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 34 }}>
             <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '40px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.purple, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Plus size={28} /> 신규 안전 훈련 등록
                </div>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <div>
                    <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>교육 종류 (해상 법정 훈련)</label>
                    <select 
                      value={newTraining.type}
                      onChange={e => setNewTraining({...newTraining, type: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="기초안전">기초 안전 교육</option>
                      <option value="구명정">구명정 조종 교육</option>
                      <option value="의료관리">의료 관리 교육</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>과정명</label>
                    <input 
                      placeholder="과정명 입력"
                      value={newTraining.name}
                      onChange={e => setNewTraining({...newTraining, name: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, display: 'block' }}>교육 일자</label>
                    <input 
                      type="date"
                      value={newTraining.date}
                      onChange={e => setNewTraining({...newTraining, date: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', color: '#fff', fontSize: 20, fontWeight: 700, outline: 'none' }}
                    />
                  </div>
                  <button type="submit" style={{ marginTop: 14, height: 72, background: C.purple, color: '#fff', border: 'none', borderRadius: 22, fontWeight: 950, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, transition: '0.2s' }}>
                    <Save size={25}/> 이력 저장
                  </button>
                </form>
             </div>

             <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 34, padding: '40px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <ClipboardList size={28} /> 법정 안전 훈련 이력 (STCW 교육)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {trainingLogs.map(log => (
                    <div key={log.id} style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 14, padding: '2px 9px', borderRadius: 6, background: `${C.purple}18`, color: C.purple, fontWeight: 850, border: `1px solid ${C.purple}33` }}>{log.type}</span>
                          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{log.name}</span>
                        </div>
                        <div style={{ fontSize: 18, color: C.sub, fontWeight: 700 }}>이수일 : {log.date} · 교관 : {log.instructor}</div>
                      </div>
                      <div style={{ color: C.success, fontSize: 18, fontWeight: 900 }}>인증 완료</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* 3. 시스템 리소스 상태 */}
          <SettingCard 
            icon={<Cpu />} 
            title="엣지 컴퓨팅 리소스" 
            desc="오프라인 진단을 위한 로컬 AI 모델 및 시스템 자원 상태입니다."
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginTop: 28 }}>
              <StatusBox label="AI 모델 버전" value="MDTS-LLM v2.4" sub="최신 상태" color={C.success} />
              <StatusBox label="NPU 사용률" value="12.4%" sub="정상 가동 중" color={C.cyan} />
              <StatusBox label="로컬 DB 용량" value="1.2TB / 2.0TB" sub="850개 케이스 저장됨" color={C.info} />
            </div>
          </SettingCard>

          {/* 4. 보안 및 알림 */}
          <SettingCard 
            icon={<Lock />} 
            title="보안 및 프라이버시" 
            desc="환자 데이터 암호화 및 시스템 접근 권한을 관리합니다."
          >
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
              <ToggleItem label="생체 인식 로그인 활성화" color={C.info} />
              <ToggleItem label="민감 정보 마스킹 처리" on color={C.cyan} />
              <ToggleItem label="심각 상황 시 전원 알림 자동 발송" on color={C.danger} />
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  )
}

function StatusBox({ label, value, sub, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '28px', borderRadius: 28, textAlign: 'center' }}>
      <div style={{ fontSize: 18, color: C.sub, fontWeight: 800, marginBottom: 11, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 950, color: color, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 16, color: color, fontWeight: 800, opacity: 0.8 }}>{sub}</div>
    </div>
  )
}

function ToggleItem({ label, on, onChange, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{label}</span>
      <div onClick={onChange} style={{ width: 68, height: 36, borderRadius: 18, background: on ? color : C.dim,
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 4, left: on ? 36 : 4, width: 28, height: 28,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}/>      
      </div>
    </div>
  )
}
