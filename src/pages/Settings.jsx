import { useState } from 'react'
import { Save, Bell, Smartphone, Globe, Ship, Check, Wifi, RefreshCw } from 'lucide-react'

const SHIPS = [
  { id:'KS7421', name:'MV KOREA STAR',   type:'컨테이너선', gross:52400, route:'부산↔LA',      crew:26, status:'active'  },
  { id:'KS5882', name:'MV HANJIN BUSAN', type:'벌크선',     gross:38100, route:'부산↔싱가포르', crew:22, status:'standby' },
  { id:'KS3301', name:'MV PACIFIC HOPE', type:'유조선',     gross:71200, route:'부산↔두바이',   crew:30, status:'standby' },
  { id:'KS1100', name:'MV EASTERN WIND', type:'LNG선',      gross:88500, route:'부산↔카타르',   crew:28, status:'standby' },
]

export default function Settings({ auth }) {
  const [activeShip, setActiveShip] = useState('KS7421')
  const [switching, setSwitching]   = useState(null)
  const [saved, setSaved]           = useState(false)
  const [alerts, setAlerts]   = useState({ emergency:true, vital:true, voice:false, sms:true })
  const [display, setDisplay] = useState({ lang:'한국어', timezone:'GMT+09:00', darkMode:true, compactUI:false })
  const [sync, setSync]       = useState({ interval:'실시간', autoBackup:true, compression:true })

  const switchShip = (id) => {
    setSwitching(id)
    setTimeout(()=>{ setActiveShip(id); setSwitching(null) }, 1200)
  }
  const saveAll = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000) }
  const tog = (group, key) => {
    if (group==='alerts')  setAlerts(p=>({...p,[key]:!p[key]}))
    if (group==='sync')    setSync(p=>({...p,[key]:!p[key]}))
    if (group==='display') setDisplay(p=>({...p,[key]:!p[key]}))
  }

  return (
    <div style={{ height:'calc(100vh - 48px)', overflowY:'auto', background:'#050d1a', padding:'20px 24px' }}>
      <div style={{ maxWidth:960, margin:'0 auto' }}>
        <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          시스템 설정
          {auth && <span style={{ fontSize:11, color:'#4a6080', fontWeight:400 }}>· {auth.serialNo || 'MDTS-0000'}</span>}
        </div>

        {/* ── 선박 전환 ── */}
        <Sec title="선박 전환" icon={<Ship size={17} color="#0dd9c5"/>}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
            {SHIPS.map(ship => {
              const isActive = activeShip === ship.id
              const isSwitch = switching === ship.id
              return (
                <div key={ship.id} onClick={()=>!isActive&&!isSwitch&&switchShip(ship.id)} style={{
                  padding:'15px', borderRadius:15, cursor:isActive?'default':'pointer',
                  background:isActive?'linear-gradient(135deg,rgba(13,217,197,0.12),rgba(13,217,197,0.03))':'rgba(255,255,255,0.02)',
                  border:`2px solid ${isActive?'#0dd9c5':isSwitch?'rgba(13,217,197,0.4)':'rgba(255,255,255,0.07)'}`,
                  transition:'all 0.3s', position:'relative', overflow:'hidden'
                }}>
                  {isSwitch && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(13,217,197,0.05)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:13, zIndex:2 }}>
                      <RefreshCw size={22} color="#0dd9c5" style={{ animation:'spin 0.8s linear infinite' }}/>
                    </div>
                  )}
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:isActive?'rgba(13,217,197,0.18)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>⚓</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:800, color:isActive?'#fff':'#8da2c0' }}>{ship.name}</div>
                        <div style={{ fontSize:10, color:'#4a6080' }}>{ship.id}</div>
                      </div>
                    </div>
                    {isActive && <div style={{ width:20, height:20, borderRadius:'50%', background:'#0dd9c5', display:'flex', alignItems:'center', justifyContent:'center' }}><Check size={12} color="#050d1a"/></div>}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5, marginBottom:10 }}>
                    {[['유형',ship.type],['항로',ship.route],['총톤수',`${ship.gross.toLocaleString()}t`],['승무원',`${ship.crew}명`]].map(([l,v])=>(
                      <div key={l} style={{ padding:'4px 7px', borderRadius:5, background:'rgba(255,255,255,0.03)' }}>
                        <div style={{ fontSize:9, color:'#4a6080', fontWeight:700 }}>{l}</div>
                        <div style={{ fontSize:11, color:isActive?'#e8f0fe':'#8da2c0', fontWeight:600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {isActive ? (
                    <div style={{ padding:'4px 8px', borderRadius:6, background:'rgba(38,222,129,0.1)', display:'inline-flex', alignItems:'center', gap:5, fontSize:10, color:'#26de81', fontWeight:700 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'#26de81', animation:'pulse-dot 1.5s infinite' }}/>현재 운항 중
                    </div>
                  ) : (
                    <div style={{ padding:'5px', borderRadius:7, background:'rgba(13,217,197,0.05)', border:'1px solid rgba(13,217,197,0.12)', textAlign:'center', fontSize:11, color:'#0dd9c5', fontWeight:700 }}>전환하기</div>
                  )}
                </div>
              )
            })}
          </div>
        </Sec>

        <Sec title="알림 및 경고" icon={<Bell size={17} color="#ff4d6d"/>}>
          <TRow label="응급 상황 푸시 알림"  sub="즉시 발송"                on={alerts.emergency} onT={()=>tog('alerts','emergency')}/>
          <TRow label="바이탈 임계값 경고"   sub="산소포화도 95% 미만 등"   on={alerts.vital}     onT={()=>tog('alerts','vital')}/>
          <TRow label="SMS 비상 연락망"      sub="설정된 비상 연락처로 발송" on={alerts.sms}       onT={()=>tog('alerts','sms')}/>
          <TRow label="음성 안내 방송"       sub="선내 방송 시스템 연동"     on={alerts.voice}     onT={()=>tog('alerts','voice')}/>
        </Sec>

        <Sec title="시스템 환경" icon={<Globe size={17} color="#4fc3f7"/>}>
          <SRow label="표시 언어" value={display.lang}     opts={['한국어','English']}/>
          <SRow label="시간대"   value={display.timezone} opts={['GMT+09:00 (Seoul)','GMT+00:00 (UTC)']}/>
          <TRow label="다크 모드"  sub="어두운 화면 테마"     on={display.darkMode}  onT={()=>tog('display','darkMode')}/>
          <TRow label="컴팩트 UI" sub="밀도 높은 화면 구성"   on={display.compactUI} onT={()=>tog('display','compactUI')}/>
        </Sec>

        <Sec title="데이터 동기화" icon={<Wifi size={17} color="#a55eea"/>}>
          <SRow label="동기화 주기" value={sync.interval} opts={['실시간','5분마다','10분마다','30분마다']}/>
          <TRow label="자동 백업"   sub="의료기록 자동 저장"  on={sync.autoBackup}  onT={()=>tog('sync','autoBackup')}/>
          <TRow label="데이터 압축" sub="전송 효율 향상"       on={sync.compression} onT={()=>tog('sync','compression')}/>
        </Sec>

        <Sec title="외부 장치 연결" icon={<Smartphone size={17} color="#ff9f43"/>}>
          {[['바이탈 센서 Hub-01','online'],['원격진료 카메라','ready'],['AED 장치','online'],['위성통신 VSAT','online']].map(([l,s])=>(
            <DRow key={l} label={l} status={s}/>
          ))}
        </Sec>

        <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', paddingBottom:20 }}>
          <button onClick={saveAll} style={{ padding:'11px 28px', borderRadius:11, border:'none', background:saved?'rgba(38,222,129,0.18)':'linear-gradient(135deg,#0dd9c5,#09b8a6)', color:saved?'#26de81':'#050d1a', fontSize:14, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', gap:7, transition:'all 0.3s' }}>
            {saved?<><Check size={15}/>저장 완료</>:<><Save size={15}/>모든 설정 저장</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function Sec({ title, icon, children }) {
  return (
    <div style={{ background:'rgba(10,20,42,0.7)', border:'1.5px solid rgba(13,217,197,0.09)', borderRadius:16, padding:'18px', marginBottom:14 }}>
      <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:14, display:'flex', alignItems:'center', gap:8, paddingBottom:11, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        {icon}{title}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>{children}</div>
    </div>
  )
}
function TRow({ label, sub, on, onT }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div>
        <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:600 }}>{label}</div>
        {sub && <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:1 }}>{sub}</div>}
      </div>
      <div onClick={onT} style={{ width:42, height:22, borderRadius:11, background:on?'#0dd9c5':'rgba(255,255,255,0.1)', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
        <div style={{ position:'absolute', top:3, left:on?21:3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
      </div>
    </div>
  )
}
function SRow({ label, value, opts }) {
  const [v, setV] = useState(value)
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:600 }}>{label}</div>
      <select value={v} onChange={e=>setV(e.target.value)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(13,217,197,0.15)', borderRadius:6, padding:'4px 9px', color:'var(--text-primary)', fontSize:12, cursor:'pointer', outline:'none' }}>
        {opts.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
function DRow({ label, status }) {
  const c = status==='online'?'#26de81':status==='ready'?'#ff9f43':'#ff4d6d'
  const t = status==='online'?'연결됨':status==='ready'?'대기 중':'오프라인'
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:600 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:6, background:`${c}10`, border:`1px solid ${c}22` }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:c }}/>
        <span style={{ fontSize:11, color:c, fontWeight:700 }}>{t}</span>
      </div>
    </div>
  )
}
