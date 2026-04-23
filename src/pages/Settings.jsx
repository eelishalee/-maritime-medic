import React, { useState, useEffect, useMemo } from 'react'
import { 
  Database, Wifi, Server, Activity, Cpu, Radio, Zap, History, Ship,
  RefreshCw, ShieldCheck, Clock, Table, ChevronRight, Aperture, 
  AlertCircle, ArrowUpRight, BarChart as BarIcon, HardDrive, Terminal, Maximize2,
  CheckCircle2, AlertTriangle, Info, HardDriveDownload, Layers, Search,
  Activity as ActivityIcon, Globe, Lock, TrendingUp, Shield, Activity as Heart,
  Signal, ShieldAlert
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  CartesianGrid, Legend
} from 'recharts'

const COLORS = {
  bg: '#0b0c10',
  panel: '#181b1f',
  border: '#2c3235',
  text: '#d8d9da',
  subText: '#7b7b7b',
  success: '#32d74b', 
  warning: '#ff9f0a', 
  error: '#ff453a',   
  info: '#0096ff', 
  purple: '#a78bfa',
  cyan: '#00e5cc',
  yellow: '#facc15'
}

export default function Settings() {
  const [now, setNow] = useState(new Date())

  // 상단 카드용 미니 그래프 데이터 (일정한 리듬의 안정적인 그래프)
  const miniChartData = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    val: 80 + Math.sin(i) * 10 + Math.random() * 5
  })), [])

  const timeData = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    time: `${i}:00`,
    ingestion: Math.floor(Math.random() * 40) + 60,
    latency: Math.floor(Math.random() * 20) + 15,
    traffic: Math.floor(Math.random() * 50) + 30
  })), [])

  const storageData = [
    { name: '건강 수치 기록', value: 45, color: COLORS.info },
    { name: 'AI 분석 데이터', value: 25, color: COLORS.purple },
    { name: '영상 스캔본', value: 20, color: COLORS.cyan },
    { name: '시스템 로그', value: 10, color: COLORS.subText }
  ]

  const tableData = [
    { name: '생체 신호', count: 12450 },
    { name: '진단 결과', count: 8200 },
    { name: '활동 기록', count: 4500 },
    { name: '선원 명부', count: 1200 }
  ]

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 72px)', background: COLORS.bg, color: COLORS.text, overflowY: 'auto', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* 상단 상태 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: COLORS.success, color: '#000', padding: '2px 8px', borderRadius: '3px', fontWeight: 'bold', fontSize: '12px' }}>관제 가동 중</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ship size={18} color={COLORS.info} /> MDTS 선박 통합 의료 인프라 관리
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', fontSize: '13px', color: COLORS.subText }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {now.toLocaleTimeString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={14} color={COLORS.success} /> 5초 주기 실시간 감시</div>
        </div>
      </div>

      {/* 메인 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(140px, auto)', gap: '12px' }}>
        
        {/* [개편] 비전문가용 4대 관제 지표 */}
        <StatCard 
          grid="span 3" 
          label="종합 시스템 건강도" 
          value="98" unit="점" 
          color={COLORS.success} status="최상" 
          icon={<Heart size={16} />}
          desc="모든 인프라가 안정적으로 가동 중입니다."
          data={miniChartData} 
        />
        <StatCard 
          grid="span 3" 
          label="육상 본부 연결 상태" 
          value="연결" unit="됨" 
          color={COLORS.info} status="매우 강함" 
          icon={<Signal size={16} />}
          desc="부산 의료 센터와 실시간 소통 가능"
          data={miniChartData} 
        />
        <StatCard 
          grid="span 3" 
          label="개인 정보 보안 등급" 
          value="S" unit="급" 
          color={COLORS.purple} status="철저" 
          icon={<Shield size={16} />}
          desc="의료 데이터가 암호화되어 보호 중"
          data={miniChartData} 
        />
        <StatCard 
          grid="span 3" 
          label="선내 센서 이상 유무" 
          value="정상" unit="" 
          color={COLORS.cyan} status="이상 없음" 
          icon={<Aperture size={16} />}
          desc="3개의 엣지 장비가 정상 감시 중"
          data={miniChartData} 
        />

        {/* 차트 영역 */}
        <GrafanaPanel grid="span 7" title="실시간 의료 데이터 수집 흐름" subtitle="선내 설치된 센서들로부터 건강 정보를 안정적으로 수신하고 있습니다.">
          <div style={{ height: '220px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorIngest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.info} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke={COLORS.subText} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '8px' }} />
                <Area type="monotone" dataKey="ingestion" stroke={COLORS.info} fillOpacity={1} fill="url(#colorIngest)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GrafanaPanel>

        <GrafanaPanel grid="span 5" title="데이터 저장소 관리 현황" subtitle="종류별 데이터가 효율적으로 분산 저장되고 있습니다.">
          <div style={{ height: '220px', display: 'flex' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={storageData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {storageData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
              {storageData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '2px', background: d.color }} />
                  <span style={{ color: COLORS.subText, fontWeight: 'bold' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GrafanaPanel>

        <GrafanaPanel grid="span 4" title="주요 기록 통계" subtitle="선박 운영 중 축적된 의료 정보 총량">
           <div style={{ height: '180px', marginTop: '10px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={tableData} layout="vertical" margin={{ left: -10 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke={COLORS.text} fontSize={12} width={80} tickLine={false} axisLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }} />
                 <Bar dataKey="count" fill={COLORS.success} radius={[0, 4, 4, 0]} barSize={18} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </GrafanaPanel>

        <GrafanaPanel grid="span 4" title="네트워크 전송 품질" subtitle="외부와의 통신 연결이 끊김 없이 유지되고 있습니다.">
          <div style={{ height: '180px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }} />
                <Line name="응답성" type="step" dataKey="latency" stroke={COLORS.warning} strokeWidth={2} dot={false} />
                <Line name="대역폭" type="monotone" dataKey="traffic" stroke={COLORS.cyan} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GrafanaPanel>

        <GrafanaPanel grid="span 4" title="선내 인프라 장비 상태" subtitle="각 구역에 설치된 연산 장치의 실시간 온도를 감시합니다.">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <GaugeItem name="생체 데이터 수집기 (의무실)" cpu={32} temp={42} />
              <GaugeItem name="인공지능 분석기 (메인서버)" cpu={68} temp={58} />
           </div>
        </GrafanaPanel>

        <GrafanaPanel grid="span 12" title="실시간 시스템 활동 보고" subtitle="내부에서 처리되고 있는 주요 업무 내용을 한글로 요약 보고합니다.">
           <div style={{ background: '#000', padding: '15px', borderRadius: '4px', height: '140px', overflowY: 'hidden', border: `1px solid ${COLORS.border}`, fontSize: '12px', lineHeight: '1.8' }}>
              <div style={{ color: COLORS.success }}>[오후 6:42:01] <span style={{color: COLORS.subText}}>정보:</span> 현재 선원들의 건강 정보가 안전하게 기록되었습니다.</div>
              <div style={{ color: COLORS.info }}>[오후 6:41:55] <span style={{color: COLORS.subText}}>보안:</span> 육상 의료 본부와 보안 통로를 통해 연결되었습니다.</div>
              <div style={{ color: COLORS.warning }}>[오후 6:41:30] <span style={{color: COLORS.subText}}>주의:</span> 위성 통신이 잠시 불안정했으나 시스템이 자동 복구했습니다.</div>
              <div style={{ color: COLORS.text }}>[오후 6:41:22] <span style={{color: COLORS.subText}}>AI:</span> 영상 분석을 통해 외상 부위의 정밀 진단이 완료되었습니다.</div>
              <div style={{ color: COLORS.text }}>[오후 6:41:10] <span style={{color: COLORS.subText}}>기록:</span> 120개의 과거 기록을 분석 및 분류하여 보관했습니다.</div>
              <div style={{ color: COLORS.text }}>시스템 대기 중... <span style={{ animation: 'blink 1s infinite' }}>|</span></div>
           </div>
        </GrafanaPanel>

      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; }
      `}</style>
    </div>
  )
}

function StatCard({ grid, label, value, unit, color, status, icon, desc, data }) {
  return (
    <div style={{ gridColumn: grid, background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderTop: `4px solid ${color}`, padding: '18px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: COLORS.subText, fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon} {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', fontFamily: 'monospace' }}>{value}</div>
            <div style={{ fontSize: '14px', color: COLORS.subText, fontWeight: 'bold' }}>{unit}</div>
          </div>
        </div>
        <div style={{ padding: '4px 8px', borderRadius: '4px', background: `${color}22`, color: color, fontSize: '11px', fontWeight: 'bold' }}>
          {status}
        </div>
      </div>
      
      <div style={{ fontSize: '12px', color: COLORS.subText, marginTop: '8px', fontWeight: 600 }}>
        {desc}
      </div>
      
      {/* 카드 내 미니 그래프 */}
      <div style={{ height: '40px', marginTop: '15px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function GrafanaPanel({ grid, title, subtitle, children }) {
  return (
    <div style={{ gridColumn: grid, background: COLORS.panel, border: `1px solid ${COLORS.border}`, padding: '18px', borderRadius: '4px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text }}>{title}</div>
          <div style={{ fontSize: '12px', color: COLORS.subText, marginTop: '4px' }}>{subtitle}</div>
        </div>
        <TrendingUp size={14} color={COLORS.subText} />
      </div>
      {children}
    </div>
  )
}

function GaugeItem({ name, cpu, temp }) {
  return (
    <div style={{ fontSize: '13px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
         <span style={{ fontWeight: 'bold' }}>{name}</span>
         <span style={{ color: COLORS.subText }}>시스템 부하 {cpu}% | 온도 {temp}°C</span>
       </div>
       <div style={{ height: '6px', background: '#222', borderRadius: '3px', display: 'flex' }}>
         <div style={{ width: `${cpu}%`, background: cpu > 60 ? COLORS.warning : COLORS.success, borderRadius: '3px' }} />
       </div>
    </div>
  )
}
