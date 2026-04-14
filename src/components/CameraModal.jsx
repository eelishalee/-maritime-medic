import { useState } from 'react'
import { X, Activity, ShieldAlert, Mic, PenLine } from 'lucide-react'

export default function CameraModal({ onClose }) {
  const [phase, setPhase] = useState('result') // 캡처 후 결과가 나온 상태로 가정하여 UI 적용

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(5,13,26,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(10px)',
    }}>
      <section style={{
        width: '90%',
        maxWidth: '1200px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(2, 6, 23, 0.98)',
        borderRadius: '32px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 101
        }}>
           <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '50%', padding: 8, cursor: 'pointer', color: '#fff',
            display: 'flex', transition: '0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          ><X size={20} /></button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header & Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '28px 40px', flex: 1, overflow: 'hidden' }}>
            <div style={{ marginBottom: 20, display: 'flex', align-items: 'center', gap: '12px' }}>
              <div style={{ width: '4px', height: '24px', background: 'rgb(56, 189, 248)', borderRadius: '2px' }}></div>
              <h1 style={{ fontSize: '24px', fontWeight: '950', color: 'rgb(255, 255, 255)', margin: '0px' }}>AI 외상 정밀 진단 시스템</h1>
            </div>

            <div style={{ flex: '1 1 0%', display: 'flex', gap: '32px', overflow: 'hidden' }}>
              {/* Left Column: Image & Button */}
              <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ height: '380px', position: 'relative', borderRadius: '24px', border: '2px solid rgba(56, 189, 248, 0.3)', background: 'rgb(0, 0, 0)', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 0px 40px' }}>
                  <div style={{ position: 'absolute', inset: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgb(0, 0, 0)' }}>
                    <img
                      src="/assets/Whisk_7260b4e90d0a7b0a7b4425e7fe79e70cdr.jpeg"
                      alt="우측 슬관절 광범위 타박상 진단 사진"
                      className="fade-in"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '1', filter: 'contrast(1.1) brightness(1.05)' }}
                    />
                  </div>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '140px', height: '140px', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '14px', height: '14px', background: 'rgb(16, 185, 129)', borderRadius: '50%', animation: 'pulse-dot 1.5s infinite' }}></div>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgb(56, 189, 248) 0%, rgb(14, 165, 233) 100%)', color: 'rgb(0, 0, 0)', fontWeight: '950', fontSize: '22px', border: 'none', cursor: 'pointer', boxShadow: 'rgba(56, 189, 248, 0.4) 0px 12px 30px', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                  <Activity size={28} /> 중증 외상/출혈 가이드 실행
                </button>
              </div>

              {/* Right Column: Diagnosis Results */}
              <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}>
                <div className="fade-in" style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '24px', background: 'rgba(30, 41, 59, 0.6)', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ fontSize: '16px', color: 'rgb(56, 189, 248)', fontWeight: '900' }}>진단 결과</div>
                      <div style={{ padding: '8px 24px', borderRadius: '10px', fontSize: '18px', fontWeight: '950', background: 'rgb(16, 185, 129)', color: 'rgb(255, 255, 255)' }}>위험 등급 : 주의</div>
                    </div>
                    <h2 style={{ fontSize: '34px', fontWeight: '950', margin: '0px', color: 'rgb(255, 255, 255)', lineHeight: '1.2' }}>무릎 전면부 광범위 찰과상 및 오염</h2>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: '24px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', color: 'rgb(16, 185, 129)', fontWeight: '900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={22} /> 즉각 권고 처치
                    </h3>
                    <p style={{ fontSize: '22px', color: 'rgb(255, 255, 255)', fontWeight: '900', lineHeight: '1.6', margin: '0px' }}>식염수 이용 대량 세척 및 항생제 연고 도포. 2차 감염 예방을 위한 무균 드레싱 실시</p>
                  </div>

                  <div style={{ flex: '1 1 0%', overflowY: 'auto', paddingRight: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: 'rgb(148, 163, 184)', fontWeight: '900', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '5px', height: '18px', background: 'rgb(56, 189, 248)', borderRadius: '2px' }}></div> 세부 정밀 분석 소견
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', fontSize: '18px', color: 'rgb(203, 213, 225)', fontWeight: '700', borderLeft: '4px solid rgba(56, 189, 248, 0.4)' }}>피부 표피 및 진피 상부의 박리 손상</div>
                      <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', fontSize: '18px', color: 'rgb(203, 213, 225)', fontWeight: '700', borderLeft: '4px solid rgba(56, 189, 248, 0.4)' }}>모래 및 이물질에 의한 환부 오염 확인</div>
                      <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', fontSize: '18px', color: 'rgb(203, 213, 225)', fontWeight: '700', borderLeft: '4px solid rgba(56, 189, 248, 0.4)' }}>지속적인 장액성 삼출물 발생</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Bar */}
          <div style={{ padding: '14px 45px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgb(8, 11, 18)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              <VitalCard label="심박수" value="66" unit="bpm" color="rgb(251, 113, 133)" pulse />
              <VitalCard label="산소포화도" value="98" unit="%" color="rgb(56, 189, 248)" pulse />
              <VitalCard label="호흡수" value="28" unit="/min" color="rgb(45, 212, 191)" pulse />
              <VitalCard label="혈압 (입력)" value="128/84" unit="mmHg" color="rgb(226, 232, 240)" editable />
              <VitalCard label="체온 (입력)" value="36.7" unit="°C" color="rgb(251, 191, 36)" editable />
            </div>
          </div>

          {/* Timeline Section */}
          <div style={{ flex: '1 1 0%', overflowY: 'auto', padding: '20px 45px 45px' }}>
            <div style={{ position: 'relative', paddingLeft: '45px' }}>
              <div style={{ position: 'absolute', left: '8.5px', top: '0px', bottom: '0px', width: '3px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px' }}></div>
              <TimelineItem time="14:02" title="급성 흉부 통증 발생 및 최초 발견" desc="선교 내 이동 중 갑작스러운 심장 쪼임 호소하며 쓰러짐. 주변 인원에 의해 즉시 보고됨." />
              <TimelineItem time="14:05" title="AI 분석 : 심근경색 고위험 판정" desc="실시간 심전도 데이터 및 증상 기반 엣지 AI 정밀 분석 완료. 즉각적인 응급 처치 필요 판정." color="rgb(244, 63, 94)" />
              <TimelineItem time="14:08" title="산소 공급 및 니트로글리세린 투여" desc="AI 가이드에 따라 설하정 1정 투여 완료. 비강 캐뉼라를 통한 4L/min 산소 공급 시작." />
              <TimelineItem time="14:12" title="실시간 바이탈 변화 감시" desc="혈압 128/84 → 115/78 mmHg 하강 추세 확인. 지속적인 모니터링 및 기록 중." />
              <TimelineItem time="14:15" title="해상 의료 센터 데이터 전송" desc="환자의 기저질환 정보 및 현재 AI 분석 리포트 육상 의료진에게 일괄 동기화 완료." />
              <TimelineItem time="14:18" title="응급 처치 2단계 프로토콜 진입" desc="AED(자동심장충격기) 배치 완료 및 주변 구역 확보. 추가 의료 요원 현장 도착." />
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: '0px 40px 42px', background: 'transparent', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(10, 18, 35, 0.85)', borderRadius: '30px', padding: '12px 14px 12px 24px', border: '1px solid rgba(56, 189, 248, 0.35)', backdropFilter: 'blur(32px)', boxShadow: 'rgba(0, 0, 0, 0.4) 0px 12px 40px, rgba(56, 189, 248, 0.08) 0px 0px 20px' }}>
              <button style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Mic size={22} color="#38bdf8" />
              </button>
              <input placeholder="환자 증상 또는 AI에게 명령어를 입력하세요..." style={{ flex: '1 1 0%', background: 'none', border: 'none', color: 'rgb(241, 245, 249)', fontSize: '19px', fontWeight: '500', outline: 'none', letterSpacing: '-0.3px' }} />
              <button className="ai-analyze-btn" style={{ padding: '12px 32px', borderRadius: '22px', background: 'linear-gradient(135deg, rgb(56, 189, 248) 0%, rgb(14, 165, 233) 100%)', color: 'rgb(0, 0, 0)', fontWeight: '950', fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: 'rgba(56, 189, 248, 0.4) 0px 4px 14px' }}>AI 분석 요청</button>
            </div>
            <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.2), transparent)', filter: 'blur(4px)' }}></div>
          </div>
        </div>
      </section>
    </div>
  )
}

function VitalCard({ label, value, unit, color, pulse, editable }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', position: 'relative' }}>
      {pulse && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: color, animation: 'pulse-dot 1.4s infinite' }}></div>}
      <div style={{ fontSize: '18px', fontWeight: '800', color: 'rgb(100, 116, 139)', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px' }}>
        <span style={{ fontSize: '36px', fontWeight: '950', color: color }}>{value}</span>
        <span style={{ fontSize: '20px', color: 'rgb(100, 116, 139)', fontWeight: '500' }}>{unit}</span>
      </div>
      {editable && (
        <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgb(100, 116, 139)', cursor: 'pointer' }}>
          <PenLine size={22} />
        </button>
      )}
    </div>
  )
}

function TimelineItem({ time, title, desc, color = 'rgb(56, 189, 248)' }) {
  return (
    <div style={{ marginBottom: '48px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '-45px', top: '12px', width: '20px', height: '20px', border-radius: '50%', background: color, boxShadow: `${color}66 0px 0px 15px` }}></div>
      <div style={{ fontSize: '18.5px', color: 'rgb(100, 116, 139)', marginBottom: '8px', fontWeight: '700' }}>{time}</div>
      <div style={{ fontSize: '22px', fontWeight: '950', color: color === 'rgb(244, 63, 94)' ? 'rgb(251, 113, 133)' : 'rgb(226, 232, 240)', letterSpacing: '-0.5px', lineHeight: '1.3' }}>{title}</div>
      <div style={{ fontSize: '24px', color: 'rgb(148, 163, 184)', marginTop: '12px', lineHeight: '1.6' }}>{desc}</div>
    </div>
  )
}
