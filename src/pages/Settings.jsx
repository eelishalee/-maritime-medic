import { useState } from 'react'
import { Settings as SettingsIcon, Shield, Bell, Database, Wifi, Globe, Server, Activity, Smartphone, LogOut, ChevronRight, Lock, Eye, Cloud } from 'lucide-react'

export default function Settings() {
  const [isOnline] = useState(true)

  return (
    <div style={{ padding: '40px', height: 'calc(100vh - 72px)', background: '#020617', color: '#fff', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 950, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
            <SettingsIcon color="#0dd9c5" size={36} /> 시스템 통합 설정
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', fontWeight: 600 }}>MDTS 엣지 게이트웨이 및 원격 통신 관리 모듈</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          
          {/* [좌측 패널] 네트워크 및 통신 상태 (메인에서 이동됨) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '32px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, color: '#0dd9c5' }}>
                <Wifi size={24} /> 네트워크 및 데이터 링크
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <StatusItem label="육상 의료 센터 (KMCC)" status="연결됨" color="#2dd4bf" progress={100} icon={<Server size={18}/>} />
                <StatusItem label="위성 데이터 전송 링크" status="정상 (Lat: 20ms)" color="#38bdf8" progress={92} icon={<Globe size={18}/>} />
                <StatusItem label="실시간 원격 의료 채널" status="대기 중" color="#fb923c" progress={45} icon={<Smartphone size={18}/>} />
                <StatusItem label="로컬 의료 기기 동기화" status="동기화 완료" color="#a78bfa" progress={100} icon={<Activity size={18}/>} />
              </div>
            </section>

            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '32px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Database size={24} color="#38bdf8" /> 스토리지 및 클라우드
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8', fontWeight: 700 }}>엣지 스토리지 사용량</span>
                  <span style={{ fontWeight: 800 }}>12.4 GB / 256 GB</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '15%', height: '100%', background: '#38bdf8' }} />
                </div>
                <button style={{ marginTop: 12, padding: '14px', borderRadius: 12, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontWeight: 800, cursor: 'pointer' }}>클라우드 동기화 기록 조회</button>
              </div>
            </section>
          </div>

          {/* [우측 패널] 보안 및 알림 설정 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '32px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Shield size={24} color="#f43f5e" /> 보안 및 인증 설정
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SettingRow label="생체 인식 로그인 사용" enabled={true} />
                <SettingRow label="데이터 암호화 전송 (AES-256)" enabled={true} />
                <SettingRow label="자동 로그아웃 (30분 미사용)" enabled={false} />
                <SettingRow label="원격 터미널 접근 허용" enabled={false} />
              </div>
            </section>

            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '32px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bell size={24} color="#fbbf24" /> 응급 알림 정책
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SettingRow label="비정상 바이탈 푸시 알림" enabled={true} />
                <SettingRow label="육상 센터 긴급 자동 호출" enabled={true} />
                <SettingRow label="음성 안내 가이드 활성화" enabled={true} />
              </div>
            </section>

            <button style={{ padding: '24px', borderRadius: 24, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
              <LogOut size={22} /> 시스템 강제 종료 및 로그아웃
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, status, color, progress, icon }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0' }}>
          {icon}
          <span style={{ fontSize: 15, fontWeight: 700 }}>{label}</span>
        </div>
        <span style={{ fontSize: 14, color: color, fontWeight: 900 }}>{status}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: color, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
    </div>
  )
}

function SettingRow({ label, enabled }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: 16, color: '#cbd5e1', fontWeight: 600 }}>{label}</span>
      <div style={{ 
        width: 44, height: 24, borderRadius: 12, 
        background: enabled ? '#0dd9c5' : '#1e293b', 
        position: 'relative', cursor: 'pointer',
        transition: '0.3s'
      }}>
        <div style={{ 
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: enabled ? 23 : 3,
          transition: '0.3s'
        }} />
      </div>
    </div>
  )
}
