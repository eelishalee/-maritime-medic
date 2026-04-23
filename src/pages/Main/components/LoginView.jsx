import { useState } from 'react'
import { Database, Settings, Ship, Sparkles, ShieldCheck } from 'lucide-react'
import { LoginInput } from '../../../components/ui/index.jsx'
import MdtsLogo from '../../../components/MdtsLogo.jsx'
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

// 레이더 중심
const RX = 1200, RY = 460
const RS = 1.3

export default function LoginView({ onLogin, loginData, setLoginData }) {
  const [focusedField, setFocusedField] = useState(null)

  return (
    <div
      style={{ height:'100vh', display:'flex', flexDirection:'column', color:C.text, fontFamily:'Pretendard', overflow:'hidden', position:'relative', cursor:'default', background: C.bg }}
    >
      {/* ══ 다크 배경 ══ */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 50%, transparent 0%, #020204 85%)', pointerEvents:'none' }}/>

      {/* ══ SVG — 그리드 + 레이더 + 선박 ══ */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
           viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="shipGlow"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="ecgGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={C.cyan} stopOpacity="0.09"/>
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="ecgFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(0,247,255,0)"/>
            <stop offset="15%"  stopColor={C.cyan}/>
            <stop offset="85%"  stopColor={C.cyan}/>
            <stop offset="100%" stopColor="rgba(0,247,255,0)"/>
          </linearGradient>
          <linearGradient id="wakeL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(150,240,230,0)"/>
            <stop offset="100%" stopColor="rgba(150,240,230,0.22)"/>
          </linearGradient>
        </defs>

        {/* 그리드 */}
        {Array.from({length:19}).map((_,i)=>(
          <line key={`h${i}`} x1="0" y1={45+i*46} x2="1440" y2={45+i*46} stroke={C.cyan} strokeWidth="0.4" opacity="0.07"/>
        ))}
        {Array.from({length:21}).map((_,i)=>(
          <line key={`v${i}`} x1={i*76} y1="0" x2={i*76} y2="860" stroke={C.cyan} strokeWidth="0.4" opacity="0.07"/>
        ))}

        {/* ── 레이더 배경 글로우 ── */}
        <circle cx={RX} cy={RY} r={Math.round(330*RS)} fill="url(#radarBg)"/>
        <circle cx={RX} cy={RY} r={Math.round(200*RS)} fill="url(#radarBg)" opacity="1.6"/>

        {/* ── 레이더 동심원 ── */}
        {[65,130,195,260].map((r,i)=>(
          <circle key={r} cx={RX} cy={RY} r={Math.round(r*RS)}
            fill="none" stroke={C.cyan}
            strokeWidth={i===3?1:0.7} opacity={0.15+i*0.045}
            filter="url(#glow2)"
            style={{animation:`radarRingPulse ${3+i*0.4}s ease-in-out infinite ${i*0.3}s`}}/>
        ))}

        {/* 십자선 */}
        <line x1={RX-Math.round(310*RS)} y1={RY} x2={RX+Math.round(210*RS)} y2={RY}
          stroke={C.cyan} strokeWidth="0.6" opacity="0.22" filter="url(#glow2)"/>
        <line x1={RX} y1={RY-Math.round(320*RS)} x2={RX} y2={RY+Math.round(300*RS)}
          stroke={C.cyan} strokeWidth="0.6" opacity="0.22" filter="url(#glow2)"/>

        {/* 각도선 */}
        {[45,135,225,315].map(deg=>{
          const r=deg*Math.PI/180, ext=Math.round(260*RS)
          return <line key={deg} x1={RX} y1={RY} x2={RX+Math.cos(r)*ext} y2={RY+Math.sin(r)*ext}
            stroke={C.cyan} strokeWidth="0.45" opacity="0.12"/>
        })}

        {/* 눈금 */}
        {[130,260].map(rv=>Array.from({length:24}).map((_,i)=>{
          const a=i/24*2*Math.PI, r=Math.round(rv*RS)
          return <line key={`${rv}${i}`}
            x1={RX+Math.cos(a)*r}       y1={RY+Math.sin(a)*r}
            x2={RX+Math.cos(a)*(r+5)}   y2={RY+Math.sin(a)*(r+5)}
            stroke={C.cyan} strokeWidth="0.8" opacity="0.28"/>
        }))}

        {/* ── 선박 ── */}
        <g transform={`translate(${RX-30},${RY+10}) rotate(-18) scale(${RS})`} filter="url(#shipGlow)">
          <ellipse cx="0" cy="8" rx="185" ry="48" fill="rgba(0,247,255,0.05)"/>
          <path d="M-190,-22 C-178,-42 -140,-48 -78,-50 L78,-48 C126,-44 162,-32 186,-8 C190,-1 186,10 168,27 C146,42 98,50 38,50 L-78,48 C-140,46 -178,40 -190,22 Z"
            fill="#0c1a26" stroke={C.cyan} opacity="0.3" strokeWidth="0.8"/>
          <path d="M-190,-22 C-178,-42 -140,-48 -78,-50 L78,-48 C126,-44 162,-32 186,-8"
            fill="none" stroke={C.cyan} opacity="0.5" strokeWidth="1.6"/>
          {[[-178,-32,50,64],[-116,-35,55,70],[-50,-36,55,72],[18,-35,52,70],[80,-29,42,58]].map(([x,y,w,h],i)=>(
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill="#081220" stroke={C.cyan} opacity="0.2" strokeWidth="0.8"/>
              <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke={C.cyan} opacity="0.1" strokeWidth="0.5"/>
            </g>
          ))}
          <rect x="-186" y="-18" width="22" height="36" rx="2" fill="#14263a" stroke={C.cyan} opacity="0.4" strokeWidth="0.8"/>
          <rect x="-186" y="-28" width="22" height="14" rx="2" fill="#1c3048" stroke={C.cyan} opacity="0.3" strokeWidth="0.6"/>
          {[[-182,-25],[-174,-25],[-166,-25]].map(([wx,wy],i)=>(
            <rect key={i} x={wx} y={wy} width="6" height="5" rx="1" fill={C.cyan} opacity="0.5"/>
          ))}
          <line x1="-175" y1="-28" x2="-175" y2="-56" stroke={C.cyan} opacity="0.5" strokeWidth="1.2"/>
          <line x1="-175" y1="-56" x2="-148" y2="-40" stroke={C.cyan} opacity="0.3" strokeWidth="0.8"/>
          <circle cx="-175" cy="-58" r="2.5" fill={C.cyan} opacity="0.85"
            style={{animation:'mastLight 2s ease-in-out infinite'}}/>
          <rect x="134" y="-19" width="36" height="38" rx="3" fill="#10202e" stroke={C.cyan} opacity="0.2" strokeWidth="0.7"/>
          <circle cx="184" cy="-2" r="3" fill={C.cyan} opacity="0.88"
            style={{animation:'mastLight 1.5s ease-in-out infinite 0.3s'}}/>
        </g>

        {/* 레이더 도트 */}
        {[{a:25,r:130},{a:100,r:195},{a:195,r:130},{a:270,r:260},{a:330,r:195}].map(({a,r},i)=>{
          const rad=a*Math.PI/180, rr=Math.round(r*RS)
          return <circle key={i} cx={RX+Math.cos(rad)*rr} cy={RY+Math.sin(rad)*rr}
            r="3.5" fill={C.cyan} opacity="0.7" filter="url(#glow2)"
            style={{animation:`dotBlink ${1.5+i*0.3}s ease-in-out infinite ${i*0.4}s`}}/>
        })}

        {/* ── ECG 라인 ── */}
        <g transform="translate(30,790)">
          <rect x="0" y="-8" width="400" height="52" rx="5"
            fill="rgba(255,255,255,0.02)" stroke={C.border} strokeWidth="1"/>
          <text x="10" y="6" fontSize="9" fill={C.sub} fontFamily="Pretendard" fontWeight="700" letterSpacing="1">ECG · LIVE MONITORING</text>
          <svg x="0" y="10" width="400" height="35" viewBox="0 0 400 35" style={{overflow:'hidden'}}>
            <g style={{animation:'ecgScroll 3s linear infinite'}}>
              <path d="M-360,18 L-300,18 L-295,16 L-290,2 L-285,34 L-280,18 L-270,18
                       M-180,18 L-120,18 L-115,16 L-110,2 L-105,34 L-100,18 L-90,18
                       M0,18 L60,18 L65,16 L70,2 L75,34 L80,18 L90,18
                       M90,18 L150,18 L155,16 L160,2 L165,34 L170,18 L180,18
                       M180,18 L240,18 L245,16 L250,2 L255,34 L260,18 L270,18
                       M270,18 L330,18 L335,16 L340,2 L345,34 L350,18 L400,18
                       M400,18 L460,18 L465,16 L470,2 L475,34 L480,18 L490,18"
                fill="none" stroke="url(#ecgFade)" strokeWidth="1.8"
                strokeLinecap="round" filter="url(#ecgGlow)"/>
            </g>
          </svg>
        </g>
      </svg>

      {/* ══ 레이더 스캔 회전 ══ */}
      <div style={{
        position:'absolute',
        left:`calc(${(RX/1440)*100}% - ${Math.round(270*RS)}px)`,
        top: `calc(${(RY/860)*100}% - ${Math.round(270*RS)}px)`,
        width:Math.round(540*RS), height:Math.round(540*RS),
        borderRadius:'50%', overflow:'hidden',
        pointerEvents:'none', zIndex:4,
      }}>
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          background:`conic-gradient(from 0deg, ${C.cyan}44 0deg, ${C.cyan}11 38deg, transparent 65deg, transparent 360deg)`,
          animation:'radarScan 6s linear infinite',
        }}/>
      </div>

      {/* ══ 메인 콘텐츠 ══ */}
      <div style={{ position:'relative', zIndex:12, flex:1 }}>
        <div style={{ position:'absolute', left:68, top:'38%', transform:'translateY(-50%)' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginBottom:34, background:`${C.cyan}11`, border:`1px solid ${C.cyan}33`, borderRadius:40, padding:'9px 22px', boxShadow: `0 0 15px ${C.cyan}22` }}>
            <Sparkles size={18} color={C.cyan} style={{ animation:'loginPulse 2s infinite' }}/>
            <span style={{ fontSize:18, fontWeight:800, color:C.cyan, letterSpacing:2.5 }}>MARITIME MEDICAL AI SYSTEM</span>
          </div>
          <div style={{ marginBottom:43 }}>
            <div style={{ fontSize:72, fontWeight:950, lineHeight:1.1, letterSpacing:-2, color:'#ffffff', textShadow: `0 4px 24px rgba(0,0,0,0.6)` }}>선박 탑재형<br/>엣지 의료 지원</div>
            <div style={{ fontSize:52, fontWeight:800, lineHeight:1.1, fontStyle:'italic', letterSpacing:-1, marginTop:18, background:`linear-gradient(90deg, ${C.success}, ${C.cyan}, ${C.info})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 2px 20px rgba(0,255,180,0.4))' }}>SYSTEM CONNECTED</div>
          </div>
          <div style={{ display:'flex', gap:46 }}>
            {[{val:'24H',label:'실시간 바이탈'},{val:'8종',label:'응급 분류'},{val:'99%',label:'오프라인 가용'},{val:'Step 25',label:'심층 프로토콜'}].map(({val,label})=>(
              <div key={val} style={{ borderLeft: `3px solid ${C.cyan}`, paddingLeft: 18 }}>
                <div style={{ fontSize:34, fontWeight:950, color:'#fff', lineHeight:1, letterSpacing:-0.5 }}>{val}</div>
                <div style={{ fontSize:16, color:C.sub, marginTop:6, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 로그인 폼 */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:580 }}>
          <div style={{ position:'relative', padding:2, borderRadius:43, background:`${C.cyan}22`, overflow:'hidden', boxShadow: '0 43px 86px rgba(0,0,0,0.6)' }}>
            <div style={{ position:'absolute', top:'-50%', left:'-50%', width:'200%', height:'200%', background:`conic-gradient(transparent,transparent,transparent,${C.cyan})`, animation:'borderRotate 6s linear infinite', transformOrigin:'center' }}/>
            <div style={{ background:'rgba(5, 7, 15, 0.95)', backdropFilter:'blur(30px)', borderRadius:41, padding:'68px 58px', position:'relative', zIndex:2 }}>
              <div style={{ textAlign:'center', marginBottom:46 }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
                  <div style={{ width: 144, height: 144, background: `${C.cyan}0d`, borderRadius: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.cyan}33`, boxShadow: `0 0 30px ${C.cyan}22` }}>
                    <MdtsLogo size={100} />
                  </div>
                </div>
                <div style={{ fontSize:36, fontWeight:950, letterSpacing:2, marginBottom:11, color: '#fff' }}>MDTS ACCESS</div>
                <div style={{ fontSize:22, color:C.sub, fontWeight: 700 }}>바다 위 어디서든, 멈추지 않는 의료 AI</div>
              </div>
              <form onSubmit={onLogin} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <LoginInput icon={<Database size={25}/>} placeholder="SERIAL NUMBER" value={loginData.serial} onChange={v=>setLoginData({...loginData,serial:v})} focused={focusedField==='serial'} setFocused={v=>setFocusedField(v?'serial':null)}/>
                <LoginInput icon={<Settings size={25}/>} placeholder="DEVICE ID"   value={loginData.device} onChange={v=>setLoginData({...loginData,device:v})}  focused={focusedField==='device'}  setFocused={v=>setFocusedField(v?'device':null)}/>
                <LoginInput icon={<Ship size={25}/>}     placeholder="VESSEL NAME"   value={loginData.ship}   onChange={v=>setLoginData({...loginData,ship:v})}    focused={focusedField==='ship'}    setFocused={v=>setFocusedField(v?'ship':null)}/>
                <button type="submit" style={{ marginTop:14, padding:'28px', borderRadius:22, background:`linear-gradient(90deg, ${C.success}, ${C.cyan})`, color:'#000', fontWeight:950, border:'none', cursor:'pointer', fontSize:25, boxShadow:`0 14px 28px ${C.cyan}44`, transition: '0.2s' }} onMouseEnter={e=>e.currentTarget.style.filter='brightness(1.1)'} onMouseLeave={e=>e.currentTarget.style.filter='brightness(1)'}>네트워크 접속</button>
              </form>
              <div style={{ marginTop: '43px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, color: C.sub, fontSize: '16px', fontWeight: 800 }}>
                <ShieldCheck size={18} /> 보안 인증 모듈 가동 중
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes radarScan      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes radarRingPulse { 0%,100%{opacity:0.18} 50%{opacity:0.4} }
        @keyframes dotBlink       { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes mastLight      { 0%,100%{opacity:0.9} 50%{opacity:0.15} }
        @keyframes ecgScroll      { from{transform:translateX(0)} to{transform:translateX(-360px)} }
        @keyframes pulseDot       { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes loginPulse     { 0%,100%{opacity:1;box-shadow:0 0 6px ${C.cyan}} 50%{opacity:0.4;box-shadow:0 0 14px ${C.cyan}} }
        @keyframes borderRotate   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
