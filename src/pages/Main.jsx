import { useState, useEffect, useRef } from 'react'
import {
  Send, Activity, User, Clock, Edit3, Check, AlertCircle, Pill, Heart, Droplets,
  Sparkles, Satellite, CheckCircle2, FileText, ChevronRight, Wifi, Upload,
  RotateCcw, History, Radio, Phone, MapPin, Droplet, Thermometer, Zap,
  ChevronDown, ChevronUp, Database, MessageSquare,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const HISTORY = [
  { date:'2026-04-07', type:'응급',  label:'흉통·호흡곤란',         detail:'아스피린 알레르기로 클로피도그렐 75mg 투여, 원격진료 연결', doctor:'부산원격의료센터 최원장', color:'#ff4d6d' },
  { date:'2026-04-01', type:'정기',  label:'월간 정기검진',          detail:'혈압 145/90 — 고혈압 약 용량 조정 (5mg→10mg)', doctor:'선내 의무관', color:'#ff9f43' },
  { date:'2026-03-18', type:'처치',  label:'손 찰과상 드레싱',       detail:'멸균 드레싱 3회 교체. 완치 확인.', doctor:'선내 의무관', color:'#0dd9c5' },
  { date:'2026-03-05', type:'정기',  label:'월간 정기검진',          detail:'전반적 양호, 혈압약 지속 복용 권고', doctor:'선내 의무관', color:'#ff9f43' },
  { date:'2026-02-14', type:'응급',  label:'심계항진',               detail:'심전도 정상, 30분 안정 후 회복', doctor:'부산원격의료센터 최원장', color:'#ff4d6d' },
  { date:'2026-01-10', type:'입선',  label:'승선 전 건강검진',       detail:'혈압 고위험군 판정, 지속 모니터링 지시', doctor:'부산 해양병원', color:'#4fc3f7' },
]

const TX_INIT = [
  { time:'09:31', type:'전송완료', msg:'바이탈 패킷 #47', ok:true },
  { time:'09:20', type:'전송완료', msg:'심전도 스냅샷',   ok:true },
  { time:'09:10', type:'대기중',   msg:'환자 차트 업데이트', ok:false },
]

function useVitals(base=84) {
  const [hr, setHr] = useState(base)
  const [hist, setHist] = useState(Array.from({length:20},(_,i)=>({t:i,v:base+Math.round((Math.random()-.5)*4)})))
  useEffect(()=>{
    const id=setInterval(()=>{
      const n=Math.max(60,Math.min(130,hr+Math.round((Math.random()-.5)*3)))
      setHr(n); setHist(h=>[...h.slice(1),{t:Date.now(),v:n}])
    },2000); return ()=>clearInterval(id)
  },[hr])
  return {hr, hist}
}

const AI_INIT = [
  { role:'ai', text:'환자 김태양 (기관장, 55세) 데이터가 로드되었습니다.\n\n혈압 158/95, 심박 96bpm — 현재 고혈압성 위기 범위입니다. 아스피린 알레르기 병력을 반드시 확인하세요.' },
]

function getAiReply(text, patient) {
  const t = text.toLowerCase()
  if (t.includes('흉통')||t.includes('가슴'))
    return `${patient.name} 환자의 흉통은 기존 고혈압·고지혈증 병력과 연관될 수 있습니다.\n\n⚠ 아스피린 알레르기 — 클로피도그렐 75mg 대체 검토\n✓ 즉시 12유도 심전도 측정 권고\n✓ 원격 의료진 연결 필요`
  if (t.includes('혈압'))
    return `현재 혈압 158/95mmHg → 2단계 고혈압. 암로디핀 복용 여부 확인 후 15분 간격 재측정하세요.`
  if (t.includes('약')||t.includes('투약'))
    return `최근 투약: ${patient.lastMed}\n알레르기: ${patient.allergies}\n\n투약 전 반드시 알레르기 이력을 재확인하세요.`
  if (t.includes('응급')||t.includes('긴급'))
    return `현재 환자 상태 기반 권고:\n1. 원격 의료진 즉시 연결\n2. 바이탈 15분 간격 모니터링\n3. CPR 장비 대기`
  return `${patient.name} 환자 종합 평가:\n혈압 ${patient.bp} · 심박 ${patient.hr}bpm · 체온 ${patient.temp}°C\n\n고혈압 경계 상태로 집중 모니터링이 필요합니다.`
}

export default function Main({ patient, onNavigate }) {
  const {hr, hist} = useVitals(84)
  const [bp, setBp] = useState(patient.bp || '142/88')
  const [bt, setBt] = useState(String(patient.temp || '37.6'))
  const [spo2] = useState(patient.spo2 || 94)
  const [editBp, setEditBp] = useState(false)
  const [editBt, setEditBt] = useState(false)

  const [tab, setTab] = useState('history')        // history | tx | vitals
  const [histFilter, setHistFilter] = useState('전체')
  const [txLog, setTxLog] = useState(TX_INIT)
  const [txStatus, setTxStatus] = useState('idle')

  const [msgs, setMsgs] = useState(AI_INIT)
  const [prompt, setPrompt] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const chatRef = useRef(null)

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight },[msgs,aiThinking])

  const sendMsg = () => {
    if(!prompt.trim()) return
    const q = prompt
    setMsgs(m=>[...m,{role:'user',text:q}])
    setPrompt('')
    setAiThinking(true)
    setTimeout(()=>{
      setAiThinking(false)
      setMsgs(m=>[...m,{role:'ai',text:getAiReply(q,patient)}])
    },1000)
  }

  const sendVitals = () => {
    setTxStatus('sending')
    setTimeout(()=>{
      setTxStatus('done')
      const now = new Date()
      const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      setTxLog(l=>[{time:ts,type:'전송완료',msg:`바이탈 패킷 #${48+l.length}`,ok:true},...l.slice(0,4)])
      setTimeout(()=>setTxStatus('idle'),2000)
    },2000)
  }

  const filteredH = histFilter==='전체' ? HISTORY : HISTORY.filter(h=>h.type===histFilter)

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'300px 1fr 300px',
      height:'calc(100vh - 44px)', overflow:'hidden', background:'#050d1a'
    }}>

      {/* ══ 좌: 환자정보 ══ */}
      <div style={{
        borderRight:'1.5px solid rgba(13,217,197,0.15)',
        background:'rgba(8,18,35,0.98)',
        display:'flex', flexDirection:'column',
        overflowY:'auto', padding:'18px 16px'
      }}>
        <SecLabel icon={<User size={14} color="#0dd9c5"/>}>환자 정보</SecLabel>

        {/* 프로필 카드 */}
        <div style={{
          background:'linear-gradient(135deg,rgba(13,217,197,0.13),rgba(13,217,197,0.02))',
          border:'1.5px solid rgba(13,217,197,0.28)',
          borderRadius:18, padding:'18px', marginBottom:14
        }}>
          <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:14}}>
            <div style={{width:62,height:62,borderRadius:14,border:'2px solid #0dd9c5',overflow:'hidden',boxShadow:'0 0 16px rgba(13,217,197,0.2)',flexShrink:0}}>
              <img src={patient.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>{patient.name}</div>
              <div style={{fontSize:12,color:'#8da2c0',marginTop:2}}>{patient.role} · {patient.age}세 · {patient.blood}형 · {patient.gender}</div>
              <div style={{fontSize:11,color:'#0dd9c5',marginTop:3,fontWeight:600}}>{patient.id}</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:12}}>
            <InfoRow label="생년월일"  value={patient.dob}/>
            <InfoRow label="신장/체중" value={`${patient.height}cm / ${patient.weight}kg`}/>
            <InfoRow label="승선일"    value={patient.embark}/>
            <InfoRow label="연락처"    value={patient.contact}/>
            <div style={{gridColumn:'span 2'}}>
              <InfoRow label="비상연락" value={patient.emergency} full/>
            </div>
            <div style={{gridColumn:'span 2',padding:'9px 11px',background:'rgba(255,77,109,0.09)',borderRadius:9,border:'1px solid rgba(255,77,109,0.18)'}}>
              <div style={{fontSize:9,color:'#ff4d6d',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:2}}>현재 위치</div>
              <div style={{fontSize:12,color:'#fff',fontWeight:600,display:'flex',gap:5,alignItems:'center'}}>
                <MapPin size={11} color="#ff4d6d"/>{patient.location}
              </div>
            </div>
          </div>
        </div>

        {/* 의료 정보 */}
        <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:14}}>
          <MedCard icon={<AlertCircle size={13} color="#ff9f43"/>} label="보유 질환" value={patient.chronic} color="#ff9f43"/>
          <MedCard icon={<AlertCircle size={13} color="#ff4d6d"/>} label="알레르기"  value={patient.allergies} color="#ff4d6d"/>
          <MedCard icon={<Pill        size={13} color="#0dd9c5"/>} label="최근 투약"  value={patient.lastMed}   color="#0dd9c5"/>
          <MedCard icon={<FileText    size={13} color="#4fc3f7"/>} label="특이사항"   value={patient.note}      color="#4fc3f7"/>
        </div>

        {/* 바이탈 */}
        <SecLabel icon={<Activity size={14} color="#0dd9c5"/>}>주요 바이탈</SecLabel>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
          <VitalLive  label="심박수" value={hr} unit="bpm" color="#ff4d6d" icon={<Heart size={11}/>} sparkData={hist}/>
          <VitalLive  label="산소포화도" value={spo2} unit="%" color="#00d2ff" icon={<Droplets size={11}/>} warn={spo2<95}/>
          <VitalEdit  label="혈압" value={bp} unit="mmHg" color="#a55eea" isEditing={editBp} setEditing={setEditBp} onSave={setBp}/>
          <VitalEdit  label="체온" value={bt} unit="°C"   color="#ff9f43" isEditing={editBt} setEditing={setEditBt} onSave={setBt}/>
        </div>

        {/* 빠른 액션 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
          <QuickBtn color="#ff4d6d" label="응급처치 가이드" onClick={()=>onNavigate('emergency')}/>
          <QuickBtn color="#0dd9c5" label="AI 분석 결과"    onClick={()=>onNavigate('ai')}/>
          <QuickBtn color="#4fc3f7" label="원격 진료 요청"  onClick={()=>{}}/>
          <QuickBtn color="#a55eea" label="바이탈 전송"     onClick={sendVitals}/>
        </div>
      </div>

      {/* ══ 중앙: 이력/전송 탭 ══ */}
      <div style={{borderRight:'1.5px solid rgba(13,217,197,0.15)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* 탭 헤더 */}
        <div style={{
          padding:'0 20px',
          background:'rgba(8,18,35,0.9)',
          borderBottom:'1.5px solid rgba(13,217,197,0.12)',
          display:'flex', gap:0, flexShrink:0
        }}>
          {[
            {id:'history',label:'진료 이력',    Icon:History},
            {id:'tx',     label:'데이터 전송',  Icon:Satellite},
            {id:'vitals', label:'바이탈 추이',  Icon:BarChart},
          ].map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              padding:'13px 18px', border:'none', cursor:'pointer', background:'transparent',
              color:tab===id?'var(--teal-400)':'var(--text-secondary)',
              fontSize:12, fontWeight:tab===id?700:400,
              borderBottom:tab===id?'2px solid var(--teal-400)':'2px solid transparent',
              display:'flex',alignItems:'center',gap:6, transition:'all 0.15s'
            }}><Icon size={13}/>{label}</button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div style={{flex:1,overflowY:'auto',padding:'20px 22px'}}>

          {/* ─ 이력 탭 ─ */}
          {tab==='history' && <>
            {/* 요약 */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:22}}>
              <StatMini label="총 진료"  value="14회" sub="2026년" color="#0dd9c5"/>
              <StatMini label="응급 처치" value="3회"  sub="최근 90일" color="#ff4d6d"/>
              <StatMini label="마지막 검진" value="7일 전" sub="2026-04-01" color="#ff9f43"/>
            </div>
            {/* 필터 */}
            <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
              {['전체','응급','정기','처치','입선'].map(f=>(
                <button key={f} onClick={()=>setHistFilter(f)} style={{
                  padding:'4px 12px',borderRadius:7,fontSize:11,fontWeight:700,cursor:'pointer',
                  border:`1.5px solid ${histFilter===f?'#0dd9c5':'rgba(255,255,255,0.08)'}`,
                  background:histFilter===f?'rgba(13,217,197,0.14)':'transparent',
                  color:histFilter===f?'#0dd9c5':'#8da2c0'
                }}>{f}</button>
              ))}
            </div>
            {/* 타임라인 */}
            <div style={{position:'relative',marginLeft:10}}>
              <div style={{position:'absolute',left:46,top:0,bottom:0,width:2,background:'rgba(13,217,197,0.08)'}}/>
              {filteredH.map((h,i)=>(
                <div key={i} style={{display:'flex',gap:18,marginBottom:20,animation:`slideInLeft 0.28s ease ${i*0.05}s both`}}>
                  <div style={{minWidth:44,textAlign:'right',paddingTop:14,fontSize:10,color:'#4a6080',fontWeight:600,lineHeight:1.2}}>
                    {h.date.slice(5)}
                  </div>
                  <div style={{width:14,height:14,borderRadius:'50%',background:h.color,flexShrink:0,marginTop:16,border:'3px solid #050d1a',boxShadow:`0 0 8px ${h.color}55`,zIndex:1}}/>
                  <div style={{flex:1,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(13,217,197,0.08)',borderRadius:12,padding:'12px 15px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                      <span style={{fontSize:10,padding:'2px 7px',borderRadius:5,background:`${h.color}20`,color:h.color,fontWeight:800}}>{h.type}</span>
                      <span style={{fontSize:13,fontWeight:800,color:'#fff'}}>{h.label}</span>
                    </div>
                    <div style={{fontSize:11,color:'#8da2c0',lineHeight:1.6}}>{h.detail}</div>
                    <div style={{marginTop:5,fontSize:10,color:'#4a6080'}}>담당: {h.doctor}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* 의사 지시 */}
            <div style={{padding:'13px 16px',borderRadius:13,background:'rgba(13,217,197,0.05)',border:'1px solid rgba(13,217,197,0.18)',marginTop:8}}>
              <div style={{fontSize:10,color:'#0dd9c5',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>최신 의사 지시사항</div>
              <div style={{fontSize:12,color:'#e8f0fe',lineHeight:1.65}}>"심근경색 프로토콜 유지, 15분 간격 혈압·심전도 재전송 요망"</div>
              <div style={{marginTop:5,fontSize:10,color:'#4a6080'}}>— 부산원격의료센터 최원장 · 09:25</div>
            </div>
          </>}

          {/* ─ 데이터전송 탭 ─ */}
          {tab==='tx' && <>
            {/* 연결 상태 */}
            <div style={{padding:'15px',borderRadius:15,background:'linear-gradient(135deg,rgba(13,217,197,0.1),rgba(13,217,197,0.02))',border:'1.5px solid rgba(13,217,197,0.25)',marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:11}}>
                <div style={{width:36,height:36,borderRadius:10,background:'rgba(13,217,197,0.13)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Satellite size={18} color="#0dd9c5"/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:'#0dd9c5'}}>위성통신 연결됨</div>
                  <div style={{fontSize:10,color:'#8da2c0'}}>VSAT · 신호강도 87%</div>
                </div>
                <div style={{marginLeft:'auto',width:9,height:9,borderRadius:'50%',background:'#26de81',animation:'pulse-dot 1.5s infinite'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
                {[['지연시간','340ms'],['대역폭','2.4 Mbps'],['수신센터','부산 해사'],['마지막 동기','09:31']].map(([l,v])=>(
                  <div key={l} style={{padding:'7px 10px',borderRadius:7,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{fontSize:9,color:'#4a6080',fontWeight:700}}>{l}</div>
                    <div style={{fontSize:12,fontWeight:700,color:'#e8f0fe'}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 전송 버튼 */}
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:18}}>
              <TxBtn icon={<Activity size={15}/>} label="바이탈 즉시 전송" sub={`심박 ${hr}bpm · 혈압 ${bp} · 체온 ${bt}°C`} color="#0dd9c5" status={txStatus} onClick={sendVitals}/>
              <TxBtn icon={<FileText size={15}/>} label="환자 차트 전송"   sub="최신 진료기록 포함"   color="#4fc3f7" onClick={()=>{}}/>
              <TxBtn icon={<Radio size={15}/>}    label="원격진료 요청"    sub="영상 연결 / 부산 해사" color="#a55eea" onClick={()=>{}}/>
            </div>

            {/* 전송 로그 */}
            <div style={{fontSize:11,fontWeight:900,color:'#0dd9c5',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:10}}>전송 로그</div>
            {txLog.map((l,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,background:'rgba(255,255,255,0.02)',border:`1px solid ${l.ok?'rgba(38,222,129,0.12)':'rgba(255,159,67,0.18)'}`,marginBottom:7}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:l.ok?'#26de81':'#ff9f43',flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#e8f0fe'}}>{l.msg}</div>
                  <div style={{fontSize:10,color:'#4a6080'}}>{l.time} · {l.type}</div>
                </div>
                {l.ok?<CheckCircle2 size={13} color="#26de81"/>:<RotateCcw size={13} color="#ff9f43"/>}
              </div>
            ))}

            {/* 패킷 현황 */}
            <div style={{fontSize:11,fontWeight:900,color:'#0dd9c5',textTransform:'uppercase',letterSpacing:'0.5px',margin:'16px 0 10px'}}>금일 전송 현황</div>
            {[['바이탈 데이터',47,50,'#0dd9c5'],['영상/이미지',12,20,'#4fc3f7'],['차트 문서',8,8,'#26de81']].map(([l,s,t,c])=>(
              <PacketBar key={l} label={l} sent={s} total={t} color={c}/>
            ))}
          </>}

          {/* ─ 바이탈 추이 탭 ─ */}
          {tab==='vitals' && <>
            <div style={{marginBottom:16,padding:'13px 15px',borderRadius:13,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{fontSize:11,color:'#8da2c0',fontWeight:700,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px'}}>심박수 추이 (실시간)</div>
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={hist}>
                  <XAxis dataKey="t" hide/>
                  <Area type="monotone" dataKey="v" stroke="#ff4d6d" fill="rgba(255,77,109,0.1)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                {label:'심박수',  value:hr,   unit:'bpm',  color:'#ff4d6d', warn:hr>100},
                {label:'산소포화도',value:spo2,unit:'%',   color:'#00d2ff', warn:spo2<95},
                {label:'혈압',    value:bp,   unit:'mmHg', color:'#a55eea', warn:true},
                {label:'체온',    value:bt,   unit:'°C',   color:'#ff9f43', warn:parseFloat(bt)>37.5},
              ].map(({label,value,unit,color,warn})=>(
                <div key={label} style={{padding:'12px',borderRadius:12,background:warn?`${color}10`:'rgba(255,255,255,0.02)',border:`1px solid ${warn?color+'30':'rgba(255,255,255,0.06)'}`}}>
                  <div style={{fontSize:10,color:'#8da2c0',fontWeight:700,marginBottom:4}}>{label}</div>
                  <div style={{fontSize:22,fontWeight:900,color}}>{value}</div>
                  <div style={{fontSize:10,color:'#4a6080'}}>{unit} {warn&&<span style={{color,fontWeight:700}}>⚠</span>}</div>
                </div>
              ))}
            </div>
          </>}
        </div>

        {/* 하단: 의사 지시 / 알림 바 */}
        <div style={{padding:'10px 20px',borderTop:'1px solid rgba(13,217,197,0.1)',background:'rgba(8,18,35,0.9)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11,color:'#8da2c0'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#ff4d6d',animation:'pulse-dot 1s infinite',flexShrink:0}}/>
            <span style={{color:'#ff4d6d',fontWeight:700}}>ACTIVE ALERT</span>
            <span style={{color:'#e8f0fe'}}>심근경색 프로토콜 진행 중 — 골든타임 경과 모니터링</span>
          </div>
        </div>
      </div>

      {/* ══ 우: AI 채팅 ══ */}
      <div style={{display:'flex',flexDirection:'column',background:'rgba(6,14,28,0.98)',overflow:'hidden'}}>
        {/* 헤더 */}
        <div style={{
          padding:'14px 18px',
          background:'linear-gradient(135deg,rgba(13,217,197,0.1),rgba(13,217,197,0.02))',
          borderBottom:'1.5px solid rgba(13,217,197,0.18)',
          flexShrink:0
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:34,height:34,borderRadius:10,
              background:'linear-gradient(135deg,#0dd9c5,#09b8a6)',
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>
              <Sparkles size={16} color="#050d1a"/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:'#fff'}}>MDTS AI 의료 어시스턴트</div>
              <div style={{fontSize:10,color:'#0dd9c5'}}>● 실시간 분석 중</div>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',gap:9,animation:'fadeInUp 0.25s ease both'}}>
              {m.role==='ai' && (
                <div style={{width:26,height:26,borderRadius:8,background:'linear-gradient(135deg,#0dd9c5,#09b8a6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                  <Sparkles size={12} color="#050d1a"/>
                </div>
              )}
              <div style={{
                flex:1,
                padding:'11px 14px',
                borderRadius: m.role==='ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: m.role==='ai'
                  ? 'rgba(13,217,197,0.08)'
                  : 'rgba(255,255,255,0.06)',
                border:`1px solid ${m.role==='ai'?'rgba(13,217,197,0.2)':'rgba(255,255,255,0.08)'}`,
                fontSize:12, lineHeight:1.7,
                color: m.role==='ai' ? '#e8f0fe' : '#c8d8f0',
                whiteSpace:'pre-line',
              }}>{m.text}</div>
              {m.role==='user' && (
                <div style={{width:26,height:26,borderRadius:8,background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,fontSize:12,fontWeight:800,color:'#8da2c0'}}>
                  나
                </div>
              )}
            </div>
          ))}
          {aiThinking && (
            <div style={{display:'flex',gap:9}}>
              <div style={{width:26,height:26,borderRadius:8,background:'linear-gradient(135deg,#0dd9c5,#09b8a6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Sparkles size={12} color="#050d1a"/>
              </div>
              <div style={{padding:'11px 16px',borderRadius:'4px 14px 14px 14px',background:'rgba(13,217,197,0.06)',border:'1px solid rgba(13,217,197,0.15)',display:'flex',gap:5,alignItems:'center'}}>
                {[0,1,2].map(j=>(
                  <div key={j} style={{width:7,height:7,borderRadius:'50%',background:'#0dd9c5',animation:`pulse-dot 1s ease ${j*0.2}s infinite`}}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 빠른 질문 */}
        <div style={{padding:'8px 14px 0',display:'flex',gap:6,flexWrap:'wrap',flexShrink:0}}>
          {['흉통 분석','투약 확인','응급 프로토콜'].map(q=>(
            <button key={q} onClick={()=>{setPrompt(q)}} style={{
              padding:'4px 10px',borderRadius:7,fontSize:10,fontWeight:600,
              background:'rgba(13,217,197,0.08)',border:'1px solid rgba(13,217,197,0.2)',
              color:'#0dd9c5',cursor:'pointer'
            }}>{q}</button>
          ))}
        </div>

        {/* 입력창 */}
        <div style={{padding:'12px 14px',flexShrink:0}}>
          <div style={{
            display:'flex',gap:0,
            background:'rgba(10,22,40,0.95)',
            borderRadius:16,
            border:'1.5px solid rgba(13,217,197,0.4)',
            boxShadow:'0 0 24px rgba(13,217,197,0.12)',
            overflow:'hidden',
          }}>
            <div style={{padding:'0 12px',display:'flex',alignItems:'center',color:'#0dd9c5'}}>
              <Sparkles size={16}/>
            </div>
            <input
              value={prompt}
              onChange={e=>setPrompt(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&sendMsg()}
              placeholder="증상·처치 내용 입력 후 AI 분석..."
              style={{flex:1,background:'none',border:'none',padding:'13px 0',color:'#fff',fontSize:13,outline:'none'}}
            />
            <button
              onClick={sendMsg}
              style={{
                margin:6,width:40,height:40,borderRadius:11,flexShrink:0,
                background:'linear-gradient(135deg,#0dd9c5,#09b8a6)',
                border:'none',color:'#050d1a',cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center'
              }}
            ><Send size={15}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──
function SecLabel({icon,children}){
  return <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:900,color:'#0dd9c5',marginBottom:11,textTransform:'uppercase',letterSpacing:'0.7px'}}>{icon}{children}</div>
}
function InfoRow({label,value,full}){
  return(
    <div style={{paddingBottom:6}}>
      <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',marginBottom:2,textTransform:'uppercase',letterSpacing:'0.4px'}}>{label}</div>
      <div style={{fontSize:12,color:'#fff',fontWeight:600,lineHeight:1.4}}>{value||'—'}</div>
    </div>
  )
}
function MedCard({icon,label,value,color}){
  return(
    <div style={{padding:'10px 13px',borderRadius:11,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:30,height:30,borderRadius:8,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:9,color:'#4a6080',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.4px'}}>{label}</div>
        <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{value||'없음'}</div>
      </div>
    </div>
  )
}
function VitalLive({label,value,unit,color,icon,sparkData,warn}){
  return(
    <div style={{padding:'11px 9px',borderRadius:12,background:warn?`${color}10`:'rgba(255,255,255,0.02)',border:`1px solid ${warn?color+'35':'rgba(255,255,255,0.05)'}`,textAlign:'center',position:'relative'}}>
      <div style={{position:'absolute',top:7,right:7,width:5,height:5,borderRadius:'50%',background:color,animation:'pulse-dot 1.2s infinite'}}/>
      <div style={{fontSize:10,color:'#8da2c0',fontWeight:700,marginBottom:3,display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>{icon}{label}</div>
      <div style={{fontSize:22,fontWeight:900,color}}>{value}</div>
      <div style={{fontSize:9,color:'#4a6080'}}>{unit}</div>
      {sparkData&&<div style={{height:24,marginTop:3}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={sparkData}><Area type="monotone" dataKey="v" stroke={color} fill={`${color}18`} strokeWidth={1.5} dot={false}/></AreaChart></ResponsiveContainer></div>}
    </div>
  )
}
function VitalEdit({label,value,unit,color,isEditing,setEditing,onSave}){
  const [tmp,setTmp]=useState(value)
  return(
    <div onClick={()=>!isEditing&&setEditing(true)} style={{padding:'11px 9px',borderRadius:12,background:'rgba(255,255,255,0.03)',border:`1px solid ${isEditing?'#0dd9c5':'rgba(255,255,255,0.07)'}`,textAlign:'center',position:'relative',cursor:'pointer'}}>
      <div style={{position:'absolute',top:7,right:7}}>{isEditing?<Check size={11} color="#0dd9c5"/>:<Edit3 size={10} color="#4a6080"/>}</div>
      <div style={{fontSize:10,color:'#8da2c0',fontWeight:700,marginBottom:3}}>{label}</div>
      {isEditing?(
        <input autoFocus value={tmp} onChange={e=>setTmp(e.target.value)} onBlur={()=>{onSave(tmp);setEditing(false)}} onKeyDown={e=>e.key==='Enter'&&(onSave(tmp),setEditing(false))} style={{width:'80%',background:'none',border:'none',borderBottom:'2px solid #0dd9c5',color:'#fff',fontSize:18,fontWeight:900,textAlign:'center',outline:'none'}}/>
      ):(
        <div style={{fontSize:22,fontWeight:900,color}}>{value}</div>
      )}
      <div style={{fontSize:9,color:'#4a6080'}}>{unit}</div>
    </div>
  )
}
function QuickBtn({color,label,onClick}){
  return(
    <button onClick={onClick} style={{padding:'8px 10px',borderRadius:9,background:`${color}12`,border:`1px solid ${color}30`,color,fontSize:10,fontWeight:700,cursor:'pointer',textAlign:'center'}}>
      {label}
    </button>
  )
}
function StatMini({label,value,sub,color}){
  return(
    <div style={{padding:'12px',borderRadius:12,background:`${color}0e`,border:`1px solid ${color}20`,textAlign:'center'}}>
      <div style={{fontSize:10,color:'#8da2c0',marginBottom:4,fontWeight:600}}>{label}</div>
      <div style={{fontSize:18,fontWeight:900,color}}>{value}</div>
      <div style={{fontSize:9,color:'#4a6080',marginTop:2}}>{sub}</div>
    </div>
  )
}
function TxBtn({icon,label,sub,color,status,onClick}){
  const busy=status==='sending', done=status==='done'
  return(
    <button onClick={onClick} disabled={busy} style={{padding:'12px 14px',borderRadius:12,background:done?'rgba(38,222,129,0.08)':`${color}0e`,border:`1.5px solid ${done?'#26de81':color}33`,cursor:busy?'wait':'pointer',display:'flex',alignItems:'center',gap:10,width:'100%',opacity:busy?0.7:1,textAlign:'left'}}>
      <div style={{width:34,height:34,borderRadius:9,background:done?'rgba(38,222,129,0.18)':`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',color:done?'#26de81':color,animation:busy?'spin 1s linear infinite':'none'}}>
        {done?<CheckCircle2 size={15}/>:busy?<RotateCcw size={15}/>:icon}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:800,color:done?'#26de81':'#e8f0fe'}}>{busy?'전송 중...':done?'전송 완료!':label}</div>
        <div style={{fontSize:10,color:'#4a6080',marginTop:1}}>{sub}</div>
      </div>
      {!busy&&!done&&<ChevronRight size={13} color="#4a6080"/>}
    </button>
  )
}
function PacketBar({label,sent,total,color}){
  const pct=Math.round(sent/total*100)
  return(
    <div style={{padding:'9px 12px',borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',marginBottom:7}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
        <span style={{fontSize:11,color:'#8da2c0',fontWeight:600}}>{label}</span>
        <span style={{fontSize:11,color,fontWeight:800}}>{sent}/{total}</span>
      </div>
      <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,borderRadius:2,background:color,transition:'width 0.5s ease'}}/>
      </div>
    </div>
  )
}

// 바이탈 추이 탭 아이콘
function BarChart({size=13}) {
  return <Activity size={size}/>
}
