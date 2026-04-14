import { useState } from 'react'

const TABS = [
  { id: 'cpr', label: '심폐소생술', icon: '🫀', golden: '4분', goldenColor: 'var(--red-400)' },
  { id: 'bleed', label: '출혈 처치', icon: '🩸', golden: '30분', goldenColor: 'var(--orange-400)' },
  { id: 'burn', label: '화상', icon: '🔥', golden: '60분', goldenColor: 'var(--orange-400)' },
  { id: 'fracture', label: '골절', icon: '🦴', golden: '2시간', goldenColor: 'var(--blue-400)' },
  { id: 'stroke', label: '뇌졸중', icon: '🧠', golden: '3시간', goldenColor: 'var(--red-400)' },
  { id: 'anaphylaxis', label: '아나필락시스', icon: '⚡', golden: '즉시', goldenColor: 'var(--red-400)' },
  { id: 'drowning', label: '익수', icon: '💧', golden: '5분', goldenColor: 'var(--red-400)' },
  { id: 'poisoning', label: '중독', icon: '☠️', golden: '1시간', goldenColor: 'var(--orange-400)' },
]

const GUIDES = {
  cpr: {
    title: '심폐소생술 (CPR)',
    steps: [
      { priority: 'critical', size: 3, icon: '📞', title: '도움 요청 + AED 요청', desc: '큰 소리로 "도와주세요! AED 가져와주세요!"', time: '즉시' },
      { priority: 'critical', size: 3, icon: '🫁', title: '기도 확보', desc: '머리를 뒤로 젖히고 턱을 위로 들어 기도 개방', time: '15초 이내' },
      { priority: 'critical', size: 2, icon: '🫁', title: '호흡 확인', desc: '10초 이내 정상 호흡 여부 확인', time: '10초' },
      { priority: 'critical', size: 3, icon: '🤲', title: '가슴 압박 30회', desc: '명치-흉골 중간, 5~6cm 깊이, 분당 100~120회', time: '반복' },
      { priority: 'high', size: 2, icon: '💨', title: '인공호흡 2회', desc: '코 막고 입에 1초씩 불어넣기', time: '2회' },
      { priority: 'medium', size: 1, icon: '⚡', title: 'AED 도착 시 즉시 사용', desc: '전원 켜고 음성 지시에 따르기', time: '준비 즉시' },
    ],
    drugs: [],
    notes: '30:2 비율 반복 · 구조대 도착까지 중단하지 않기',
  },
  bleed: {
    title: '출혈 처치',
    steps: [
      { priority: 'critical', size: 3, icon: '🛡️', title: '보호장갑 착용', desc: '혈액 접촉 방지를 위해 라텍스 장갑 착용', time: '즉시' },
      { priority: 'critical', size: 3, icon: '🤲', title: '직접 압박지혈', desc: '깨끗한 거즈나 천으로 상처를 강하게 5~10분 이상 압박', time: '5-10분' },
      { priority: 'high', size: 2, icon: '📍', title: '지혈대 (사지 대출혈)', desc: '상처 5-7cm 위, 완전히 지혈될 때까지 조이기. 시간 기록', time: '5분 이상 지속 시' },
      { priority: 'medium', size: 2, icon: '🦷', title: '상처 거상', desc: '사지 출혈 시 심장보다 높이 올리기', time: '지속' },
      { priority: 'medium', size: 1, icon: '💉', title: '수혈 준비 (대출혈)', desc: '혈압 저하 시 수액 라인 확보', time: '상태에 따라' },
    ],
    drugs: ['지혈제: 트라넥사민산 1g IV', '통증: 케토롤락 30mg IV'],
    notes: '지혈대 부착 시간 반드시 기록 · 30분마다 확인',
  },
  burn: {
    title: '화상 처치',
    steps: [
      { priority: 'critical', size: 3, icon: '💧', title: '즉시 냉각 (15-20분)', desc: '15~20°C 흐르는 물로 15-20분 세척. 얼음 사용 금지!', time: '15-20분' },
      { priority: 'critical', size: 2, icon: '✂️', title: '의복 및 장신구 제거', desc: '화상 부위 의복 제거 (달라붙은 것은 그대로)', time: '즉시' },
      { priority: 'high', size: 2, icon: '🩹', title: '상처 피복', desc: '멸균 드레싱으로 느슨하게 피복. 물집 터트리지 않기', time: '냉각 후' },
      { priority: 'medium', size: 1, icon: '🌡️', title: '체온 유지', desc: '저체온증 예방 위해 보온 처치', time: '지속' },
      { priority: 'medium', size: 1, icon: '💉', title: '수액 공급', desc: '광범위 화상 시 수액 확보', time: '상태에 따라' },
    ],
    drugs: ['진통: 모르핀 2-4mg IV', '감염 예방: 은 함유 드레싱'],
    notes: '3도 화상 및 안면/기도 화상 시 즉각 이송 준비',
  },
  fracture: {
    title: '골절 처치',
    steps: [
      { priority: 'critical', size: 2, icon: '🦴', title: '골절 부위 고정', desc: '부목으로 골절 위아래 관절 포함하여 고정', time: '즉시' },
      { priority: 'high', size: 2, icon: '🧊', title: '냉찜질', desc: '20분 냉찜질 → 20분 제거 반복 (직접 피부 접촉 금지)', time: '20분 간격' },
      { priority: 'high', size: 2, icon: '📍', title: '혈액순환 확인', desc: '원위부 맥박, 감각, 움직임 확인', time: '지속 확인' },
      { priority: 'medium', size: 1, icon: '🛏️', title: '안정 유지', desc: '불필요한 움직임 제한', time: '지속' },
    ],
    drugs: ['진통: 이부프로펜 400mg 또는 케토롤락 30mg'],
    notes: '개방성 골절 시 멸균 드레싱 후 고정 · 신경혈관 손상 확인',
  },
  stroke: {
    title: '뇌졸중 (FAST 검사)',
    steps: [
      { priority: 'critical', size: 3, icon: '😶', title: 'F — Face 안면 마비', desc: '"이를 보여주세요" — 한쪽 입꼬리 처짐 확인', time: '즉시' },
      { priority: 'critical', size: 3, icon: '💪', title: 'A — Arm 팔 마비', desc: '"두 팔 올려보세요" — 한쪽 팔 처짐 확인', time: '즉시' },
      { priority: 'critical', size: 2, icon: '🗣️', title: 'S — Speech 언어장애', desc: '"오늘 날짜 말해보세요" — 어눌하거나 이해 못 함', time: '즉시' },
      { priority: 'critical', size: 2, icon: '🚨', title: 'T — Time 즉각 이송', desc: '하나라도 해당 시 즉시 원격진료 연결 + 이송 준비', time: '3시간 이내' },
      { priority: 'high', size: 1, icon: '🛏️', title: '측위 유지', desc: '의식 저하 시 기도 확보 위해 옆으로 눕히기', time: '지속' },
    ],
    drugs: ['혈압 조절 — 함부로 낮추지 않기 (원격 의사 지시 따름)'],
    notes: '3시간 골든타임 · 원격 의사 즉각 연결 · 빠른 이송이 최우선',
  },
  anaphylaxis: {
    title: '아나필락시스',
    steps: [
      { priority: 'critical', size: 3, icon: '💉', title: '에피네프린 즉시 투여', desc: '에피네프린 0.3mg 허벅지 외측에 근육주사 (EpiPen)', time: '즉시' },
      { priority: 'critical', size: 2, icon: '🛋️', title: '눕히고 다리 거상', desc: '쇼크 예방 위해 다리를 30cm 이상 올리기', time: '즉시' },
      { priority: 'critical', size: 2, icon: '😮‍💨', title: '기도 확보', desc: '기도 폐쇄 징후 시 기관 내 삽관 준비', time: '즉시' },
      { priority: 'high', size: 2, icon: '💧', title: '수액 공급', desc: '생리식염수 IV 라인 확보, 1L 빠른 주입', time: '즉시' },
      { priority: 'medium', size: 1, icon: '💊', title: '2차 약물', desc: '항히스타민제 + 스테로이드 IV', time: '10분 후' },
    ],
    drugs: ['1차: 에피네프린 0.3mg IM', '2차: 디펜히드라민 50mg IV', '3차: 덱사메타손 8mg IV'],
    notes: '15분 후 호전 없으면 에피네프린 반복 투여 가능',
  },
  drowning: {
    title: '익수 처치',
    steps: [
      { priority: 'critical', size: 3, icon: '🏊', title: '안전하게 구출', desc: '구조자 안전 최우선 · 구명줄 등 이용', time: '즉시' },
      { priority: 'critical', size: 3, icon: '🫁', title: '호흡 확인 + CPR', desc: '무호흡 시 즉시 인공호흡 5회 시작 후 CPR', time: '즉시' },
      { priority: 'high', size: 2, icon: '🌡️', title: '저체온 처치', desc: '젖은 옷 제거 후 담요 보온 · 체온 유지', time: '즉시' },
      { priority: 'high', size: 2, icon: '🛏️', title: '회복 자세', desc: '호흡 있으면 측위 유지 · 구토물 흡인 방지', time: '지속' },
      { priority: 'medium', size: 1, icon: '💉', title: '산소 공급', desc: '고유량 산소 마스크 적용', time: '지속' },
    ],
    drugs: [],
    notes: '폐에 들어간 물을 빼내려 복부 압박 하지 않기',
  },
  poisoning: {
    title: '중독 처치',
    steps: [
      { priority: 'critical', size: 3, icon: '🔍', title: '원인 물질 확인', desc: '용기, 라벨, 복용량 확인 · 사진 촬영', time: '즉시' },
      { priority: 'critical', size: 2, icon: '📞', title: '독성 정보 문의', desc: '원격 의사에게 물질명 전달 후 지시 대기', time: '즉시' },
      { priority: 'high', size: 2, icon: '🛏️', title: '기도 유지', desc: '의식 저하 시 측위, 구토 유도는 지시 없이 금지', time: '지속' },
      { priority: 'medium', size: 2, icon: '💧', title: '수액 공급', desc: '혈압 저하 시 수액 라인 확보', time: '상태에 따라' },
      { priority: 'medium', size: 1, icon: '💊', title: '활성탄 투여 (가능 시)', desc: '경구 중독, 의식 있을 때, 1시간 이내 노출 시만', time: '의사 지시 후' },
    ],
    drugs: ['활성탄 50g (의사 지시 시)', '해독제: 원인 물질에 따라 의사 지시'],
    notes: '구토 유도는 원칙적으로 금지 (기도 흡인 위험) · 원인 물질 용기 보관',
  },
}

const PRIORITY_STYLE = {
  critical: { color: 'var(--red-400)', bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.35)', label: '즉시' },
  high: { color: 'var(--orange-400)', bg: 'rgba(255,159,67,0.1)', border: 'rgba(255,159,67,0.35)', label: '우선' },
  medium: { color: 'var(--blue-400)', bg: 'rgba(79,195,247,0.08)', border: 'rgba(79,195,247,0.25)', label: '순차' },
}

export default function Emergency() {
  const [activeTab, setActiveTab] = useState('cpr')
  const guide = GUIDES[activeTab]
  const tab = TABS.find(t => t.id === activeTab)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 46px)', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: '10px 16px', overflowX: 'auto',
        background: 'var(--navy-950)', borderBottom: '1px solid var(--border)', flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        {TABS.map(t => {
          const active = activeTab === t.id
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
              borderRadius: 8, border: '1px solid',
              borderColor: active ? t.goldenColor + '88' : 'var(--border)',
              background: active ? `${t.goldenColor}12` : 'transparent',
              color: active ? t.goldenColor : 'var(--text-secondary)',
              fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer',
              flexShrink: 0, transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 5,
                background: `${t.goldenColor}20`, color: t.goldenColor, fontWeight: 700,
              }}>⏱ {t.golden}</span>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        {/* Golden time banner */}
        <div style={{
          padding: '10px 16px', borderRadius: 10, marginBottom: 16,
          background: `${tab.goldenColor}10`, border: `1px solid ${tab.goldenColor}44`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{guide.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{guide.notes}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>골든타임</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: tab.goldenColor }}>{tab.golden}</div>
          </div>
        </div>

        {/* Steps — priority-based size layout */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>처치 순서</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(() => {
              // Group steps into rows based on size
              const rows = []
              let current = []
              let currentSize = 0
              for (const step of guide.steps) {
                if (currentSize + step.size > 6) {
                  rows.push(current)
                  current = [step]
                  currentSize = step.size
                } else {
                  current.push(step)
                  currentSize += step.size
                }
              }
              if (current.length) rows.push(current)

              return rows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 8 }}>
                  {row.map((step, si) => {
                    const ps = PRIORITY_STYLE[step.priority]
                    return (
                      <div key={si} style={{
                        flex: step.size,
                        padding: step.size >= 3 ? '16px' : step.size === 2 ? '14px' : '11px',
                        borderRadius: 10,
                        background: ps.bg,
                        border: `1px solid ${ps.border}`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                          background: ps.color,
                        }} />
                        <div style={{ display: 'flex', alignItems: step.size >= 2 ? 'flex-start' : 'center', gap: 10 }}>
                          <span style={{ fontSize: step.size >= 3 ? 24 : step.size === 2 ? 20 : 16, flexShrink: 0 }}>{step.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: step.size >= 2 ? 5 : 2 }}>
                              <span style={{
                                fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                                background: ps.color + '22', color: ps.color,
                              }}>{ps.label}</span>
                              {step.time && (
                                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>⏱ {step.time}</span>
                              )}
                            </div>
                            <div style={{
                              fontSize: step.size >= 3 ? 14 : 12, fontWeight: 700,
                              color: 'var(--text-primary)', marginBottom: step.size >= 2 ? 4 : 0,
                            }}>{step.title}</div>
                            {step.size >= 2 && (
                              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Drugs */}
        {guide.drugs.length > 0 && (
          <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(79,195,247,0.06)', border: '1px solid rgba(79,195,247,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue-400)', marginBottom: 10 }}>💊 사용 약물</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {guide.drugs.map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}>
                  • {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
