import { useState } from 'react'
import { Save, Bell, Shield, Smartphone, Globe, Database, User } from 'lucide-react'

export default function Settings() {
  return (
    <div style={{ padding: '40px', height: 'calc(100vh - 46px)', overflow: 'auto', background: '#050d1a' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 15 }}>
          시스템 설정
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          {/* 사용자 계정 설정 */}
          <SettingsSection title="계정 및 보안" icon={<User size={22} color="#0dd9c5"/>}>
            <SettingsItem label="관리자 사번" value="ADM-2026-001" />
            <SettingsItem label="비밀번호 변경" value="최근 변경: 32일 전" action="변경하기" />
            <SettingsItem label="2단계 인증" value="활성화됨 (OTP)" isToggle active />
          </SettingsSection>

          {/* 알림 설정 */}
          <SettingsSection title="알림 및 경고" icon={<Bell size={22} color="#ff4d6d"/>}>
            <SettingsItem label="응급 상황 푸시 알림" value="즉시 발송" isToggle active />
            <SettingsItem label="바이탈 임계값 경고" value="95% 미만 시 경고" isToggle active />
            <SettingsItem label="사고 발생 음성 안내" value="활성화" isToggle />
          </SettingsSection>

          {/* 시스템 환경 */}
          <SettingsSection title="시스템 환경" icon={<Globe size={22} color="#4fc3f7"/>}>
            <SettingsItem label="표시 언어" value="한국어 (Korean)" action="변경" />
            <SettingsItem label="시간대 설정" value="GMT+09:00 (Seoul)" />
            <SettingsItem label="데이터 동기화 주기" value="실시간 (Real-time)" />
          </SettingsSection>

          {/* 장치 연결 */}
          <SettingsSection title="외부 장치 연결" icon={<Smartphone size={22} color="#ff9f43"/>}>
            <SettingsItem label="바이탈 센서 (Hub-01)" value="연결됨" status="online" />
            <SettingsItem label="원격 진료 카메라" value="대기 중" status="ready" />
            <SettingsItem label="서버 연결 상태" value="양호" status="online" />
          </SettingsSection>
        </div>

        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ 
            padding: '15px 40px', borderRadius: 12, border: 'none', 
            background: 'linear-gradient(135deg, #0dd9c5, #0bb8a7)', 
            color: '#050d1a', fontSize: 18, fontWeight: 900, 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 10px 25px rgba(13,217,197,0.3)'
          }}>
            <Save size={20}/> 모든 설정 저장
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, icon, children }) {
  return (
    <div style={{ 
      background: 'rgba(15,32,64,0.6)', border: '1.5px solid rgba(13,217,197,0.15)', 
      borderRadius: 24, padding: '30px' 
    }}>
      <div style={{ 
        fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 25, 
        display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 15,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {icon} {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  )
}

function SettingsItem({ label, value, action, isToggle, active, status }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{label}</div>
        <div style={{ fontSize: 15, color: '#8da2c0', marginTop: 4 }}>{value}</div>
      </div>
      {isToggle ? (
        <div style={{ 
          width: 56, height: 28, borderRadius: 14, 
          background: active ? '#0dd9c5' : '#1a2e56', 
          position: 'relative', cursor: 'pointer' 
        }}>
          <div style={{ 
            width: 22, height: 22, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 3, left: active ? 31 : 3, transition: 'all 0.2s'
          }} />
        </div>
      ) : action ? (
        <button style={{ background: 'rgba(13,217,197,0.1)', border: '1px solid #0dd9c5', color: '#0dd9c5', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{action}</button>
      ) : status === 'online' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1dd1a1', fontSize: 14, fontWeight: 700 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1dd1a1' }} /> 온라인
        </div>
      ) : null}
    </div>
  )
}
