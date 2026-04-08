import { Wifi, WifiOff, Brain, Home, Users, ShieldAlert, Settings, BarChart2, AlertCircle } from 'lucide-react'

const NAV = [
  { id: 'main',      label: '메인',     Icon: Home },
  { id: 'crew',      label: '선원관리',  Icon: Users },
  { id: 'emergency', label: '응급처치',  Icon: ShieldAlert, urgent: true },
  { id: 'ai',        label: 'AI분석',   Icon: Brain },
  { id: 'settings',  label: '설정',     Icon: Settings },
]

function fmt2(n) { return String(n).padStart(2, '0') }

function GoldenTimer({ seconds }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const isLow = seconds < 600
  const isCritical = seconds < 180
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8,
      padding:'5px 14px', borderRadius:8,
      background: isCritical ? 'rgba(255,77,109,0.18)' : isLow ? 'rgba(255,159,67,0.15)' : 'rgba(13,217,197,0.1)',
      border:`1.5px solid ${isCritical ? 'rgba(255,77,109,0.5)' : isLow ? 'rgba(255,159,67,0.4)' : 'rgba(13,217,197,0.3)'}`,
      animation: isCritical ? 'goldenBlink 1s infinite' : 'none',
    }}>
      <AlertCircle size={13} color={isCritical ? '#ff4d6d' : isLow ? '#ff9f43' : '#0dd9c5'} />
      <div>
        <div style={{ fontSize:9, fontWeight:800, color: isCritical ? '#ff4d6d' : isLow ? '#ff9f43' : '#0dd9c5', letterSpacing:'0.5px', lineHeight:1 }}>
          GOLDEN TIME
        </div>
        <div style={{ fontSize:15, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', lineHeight:1.2 }}>
          {fmt2(m)}:{fmt2(s)}
        </div>
      </div>
    </div>
  )
}

export default function Layout({ activePage, onNavigate, auth, goldenLeft, patient }) {
  const isOnline = true

  return (
    <header style={{
      height:48,
      background:'var(--navy-950)',
      borderBottom:'1px solid var(--border)',
      display:'flex',
      alignItems:'center',
      padding:'0 18px',
      gap:0,
      flexShrink:0,
      zIndex:50,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:7, marginRight:20, flexShrink:0 }}>
        <div style={{
          width:28, height:28, borderRadius:8,
          background:'linear-gradient(135deg, var(--teal-400), var(--teal-500))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:14, boxShadow:'0 2px 8px rgba(13,217,197,0.3)'
        }}>⚓</div>
        <div>
          <div style={{ fontSize:13, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.3px', lineHeight:1.1 }}>MDTS</div>
          <div style={{ fontSize:9, color:'var(--text-muted)', letterSpacing:'0.3px', lineHeight:1 }}>MARITIME MEDIC</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display:'flex', gap:2, flex:1 }}>
        {NAV.map(({ id, label, Icon, urgent }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding:'5px 13px',
                borderRadius:6, border:'none', cursor:'pointer',
                background: active ? 'rgba(13,217,197,0.12)' : 'transparent',
                color: active ? 'var(--teal-400)' : 'var(--text-secondary)',
                fontSize:12, fontWeight: active ? 700 : 400,
                transition:'all 0.15s',
                position:'relative',
                display:'flex', alignItems:'center', gap:5,
              }}
            >
              <Icon size={13} />
              {label}
              {active && (
                <div style={{
                  position:'absolute', bottom:-1, left:'15%', right:'15%',
                  height:2, background:'var(--teal-400)', borderRadius:1,
                }} />
              )}
              {urgent && (
                <span style={{
                  width:7, height:7, borderRadius:'50%',
                  background:'var(--red-400)',
                  display:'inline-block',
                  animation:'pulse-dot 1.2s infinite',
                  marginLeft:1,
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Right: status info */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {/* Patient alert badge */}
        {patient && patient.hr > 90 && (
          <div style={{
            fontSize:10, padding:'3px 9px', borderRadius:6,
            background:'rgba(255,77,109,0.12)',
            border:'1px solid rgba(255,77,109,0.3)',
            color:'#ff4d6d', fontWeight:700,
            display:'flex', alignItems:'center', gap:4,
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff4d6d', display:'inline-block', animation:'pulse-dot 1s infinite' }} />
            {patient.name} 위험
          </div>
        )}

        {/* Online/Offline */}
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          padding:'4px 10px', borderRadius:6,
          background: isOnline ? 'rgba(38,222,129,0.08)' : 'rgba(255,77,109,0.08)',
          border:`1px solid ${isOnline ? 'rgba(38,222,129,0.25)' : 'rgba(255,77,109,0.25)'}`,
        }}>
          {isOnline
            ? <Wifi size={11} color="var(--green-400)" />
            : <WifiOff size={11} color="var(--red-400)" />
          }
          <span style={{ fontSize:10, fontWeight:700, color: isOnline ? 'var(--green-400)' : 'var(--red-400)' }}>
            {isOnline ? 'ON LINE' : 'OFF LINE'}
          </span>
        </div>

        {/* Ship info */}
        {auth && (
          <div style={{
            fontSize:10, color:'var(--text-muted)',
            borderLeft:'1px solid var(--border)', paddingLeft:10,
            lineHeight:1.4,
          }}>
            <div style={{ color:'var(--text-secondary)', fontWeight:600 }}>{auth.shipNo || 'MV KOREA STAR'}</div>
            <div>{auth.deviceNo || 'MED-001'}</div>
          </div>
        )}

        {/* Golden Time */}
        {goldenLeft !== undefined && <GoldenTimer seconds={goldenLeft} />}
      </div>
    </header>
  )
}
