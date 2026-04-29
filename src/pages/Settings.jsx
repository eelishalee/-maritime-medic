import React, { useState, useEffect, useMemo } from 'react'
import {
  Ship, Clock, RefreshCw, Signal, Shield, TrendingUp, CheckCircle2,
  Phone, Send, Inbox, BookOpen, Users, ChevronDown, ChevronRight, X,
  Lock, Terminal, Download, Search, Edit2, Save, Heart, Cpu,
  HardDrive, MapPin, Activity, Wifi, AlertCircle, ShieldCheck, Pill, Sparkles
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from 'recharts'

const C = {
  bg: '#0b0c10', panel: '#111318', panel2: '#161b22',
  border: '#1e2533', border2: '#252d3a',
  text: '#c9cdd4', sub: '#4e5a6b', dim: '#252d3a',
  success: '#26de81', warning: '#fb923c', danger: '#ff4d6d',
  info: '#38bdf8', purple: '#a78bfa', cyan: '#0dd9c5', yellow: '#facc15',
}

/* ─── 데이터 ─── */
const CREW = [
  { id: 'S26-001', name: '이선장', age: 52, role: '선장', dept: '항해부', chronic: '고혈압', allergies: '없음', isEmergency: false },
  { id: 'S26-002', name: '김항해', age: 45, role: '1등 항해사', dept: '항해부', chronic: '없음', allergies: '페니실린', isEmergency: false },
  { id: 'S26-003', name: '박기관', age: 55, role: '기관장', dept: '기관부', chronic: '고혈압, 고지혈증', allergies: '아스피린', isEmergency: true },
  { id: 'S26-004', name: '최갑판', age: 41, role: '갑판장', dept: '항해부', chronic: '허리디스크', allergies: '없음', isEmergency: false },
  { id: 'S26-005', name: '정조타', age: 38, role: '조타사', dept: '항해부', chronic: '없음', allergies: '조개류', isEmergency: false },
  { id: 'S26-006', name: '한통신', age: 43, role: '통신장', dept: '항해부', chronic: '비염', allergies: '먼지', isEmergency: false },
  { id: 'S26-007', name: '강기계', age: 47, role: '1등 기관사', dept: '기관부', chronic: '없음', allergies: '벌침', isEmergency: false },
  { id: 'S26-008', name: '윤조리', age: 49, role: '조리장', dept: '지원부', chronic: '당뇨', allergies: '없음', isEmergency: false },
  { id: 'S26-009', name: '임전기', age: 35, role: '전기사', dept: '기관부', chronic: '없음', allergies: '없음', isEmergency: false },
  { id: 'S26-010', name: '백보급', age: 32, role: '사무장', dept: '지원부', chronic: '없음', allergies: '먼지', isEmergency: false },
  { id: 'S26-011', name: '황갑판', age: 28, role: '갑판원', dept: '항해부', chronic: '없음', allergies: '없음', isEmergency: false },
  { id: 'S26-012', name: '서기관', age: 30, role: '3등 기관사', dept: '기관부', chronic: '없음', allergies: '땅콩', isEmergency: false },
  { id: 'S26-013', name: '오항해', age: 26, role: '실습 항해사', dept: '항해부', chronic: '없음', allergies: '없음', isEmergency: false },
  { id: 'S26-014', name: '나위생', age: 31, role: '위생원', dept: '지원부', chronic: '없음', allergies: '없음', isEmergency: false },
  { id: 'S26-015', name: '고기수', age: 44, role: '기수', dept: '기관부', chronic: '치질', allergies: '없음', isEmergency: false },
  { id: 'S26-016', name: '문세탁', age: 33, role: '세탁원', dept: '지원부', chronic: '습진', allergies: '세제', isEmergency: false },
]

const CHECKLIST = [
  'AED 배터리 상태 확인','산소통 잔량 확인 (50% 이상)',
  '구급함 잠금 해제 확인','척추고정보드 위치 확인',
  '지혈대(T-kit) 수량 확인','원격의료센터 접속 확인',
  'MDTS 기기 정상 작동 확인','당직 의료 인력 배치 확인',
]

const SYS_LOGS = [
  { t:'09:31', type:'success', msg:'박기관 바이탈 → 부산원격의료센터 전송 완료' },
  { t:'09:28', type:'info',    msg:'원격 의료 연결 세션 시작 · 최원장 접속 확인' },
  { t:'09:25', type:'warning', msg:'이선장 혈압 148/95 — 주의 임계값 초과' },
  { t:'09:20', type:'success', msg:'AI 외상 분석 완료 — 박기관 좌측 흉부 골절 의심' },
  { t:'09:10', type:'error',   msg:'위성 전송 실패 — 재시도 대기 중 (3회 시도)' },
]

function genSignal() {
  return Array.from({ length: 24 }, (_, i) => ({ h: `${i}시`, v: Math.floor(Math.random() * 25) + 70 }))
}

function riskOf(c) {
  if (c.isEmergency) return C.danger
  const ch = c.chronic === '없음' ? 0 : c.chronic.split(',').length
  return ch >= 2 ? C.danger : ch === 1 ? C.warning : C.success
}

function getPhoto(name) {
  return `/src/assets/photo/${name}`
}

/* ═══════════════════════════════════ MAIN ═════════════════════════════════ */
export default function Settings() {
  const [now, setNow] = useState(new Date())
  const [checks, setChecks] = useState({ 0: true, 1: true, 6: true })
  const [collapsed, setCollapsed] = useState({})
  const [logFilter, setLogFilter] = useState('전체')
  const [logSearch, setLogSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState({ ship:'MV KOREA STAR', no:'MED-001', sn:'MDTS-2024-KS-001', type:'컨테이너선', imo:'IMO 9876543', warranty:'2027-01-10', inspect:'2026-07-10' })
  const [devEdit, setDevEdit] = useState({ ...device })
  const [sec, setSec] = useState({ bio:true, enc:true, auto:true })
  const [signal] = useState(genSignal)
  const [coords, setCoords] = useState({ lat: '35.1028° N', lng: '129.0403° E' })

  const [trainingList, setTrainingList] = useState([
    { name: '김항해', id: 'S26-002', dept: '항해부', type: '기본 CPR (심폐소생술)', date: '2024-12-15', expiry: '2026-12-15' },
    { name: '이선장', id: 'S26-001', dept: '항해부', type: '고급 응급처치 (Advanced)', date: '2023-05-20', expiry: '2026-05-20' },
  ])
  const [managerList, setManagerList] = useState([
    { 
      id: 'S26-001', name: '이선장', role: '선장', dept: '항해부', nation: '대한민국', 
      dob: '1974-05-12', blood: 'O+', avatar: getPhoto('001.png'),
      status: '당직 중', location: '브릿지', schedule: '08:00 - 12:00', leave: '정상근무',
      muster: 'A-1 (Bridge Deck)', ice: '010-1234-5678 (배우자)', allergies: '없음',
      perm: '관리자', 
      certs: [
        { n: 'STCW II/2 (Master)', e: '2028-12-31' },
        { n: 'GOC (Radio)', e: '2027-05-20' }
      ] 
    },
    { 
      id: 'S26-003', name: '박기관', role: '기관장', dept: '기관부', nation: '대한민국', 
      dob: '1971-08-05', blood: 'B+', avatar: getPhoto('003.jpeg'),
      status: '비상 대기', location: 'ECR (엔진룸)', schedule: '대기', leave: '정상근무',
      muster: 'B-2 (Engine Room)', ice: '010-8765-4321 (배우자)', allergies: '아스피린',
      perm: '관리자', 
      certs: [
        { n: 'STCW III/2 (Chief)', e: '2029-03-22' },
        { n: 'Adv Fire Fighting', e: '2026-08-10' }
      ] 
    },
  ])
  const [newMgrName, setNewMgrName] = useState('')
  const [selectedSop, setSelectedSop] = useState(null)

  const ACTION_GUIDES_DATA = {
    'CPR-01': {
      title: '심폐소생술 및 AED 사용',
      diagnosis: '심정지(Cardiac Arrest) 의심',
      riskLevel: '4',
      steps: [
        { title: '의식 및 호흡 확인', desc: '어깨를 두드리며 "괜찮으세요?"라고 묻고, 가슴이 오르내리는지 10초간 확인하십시오.' },
        { title: '도움 및 AED 요청', desc: '주변 사람 중 한 명을 지목해 "비상 상황 전파" 및 "AED(심장충격기)"를 가져와 달라고 지시하십시오.' },
        { title: '가슴 압박 시행', desc: '가슴 중앙에 깍지 낀 손을 대고, 팔꿈치를 펴서 수직으로 5~6cm 깊이로 강하게 누르십시오.' },
        { title: 'AED 패드 부착', desc: '전원을 켜고 패드 하나는 오른쪽 쇄골 아래, 다른 하나는 왼쪽 옆구리에 붙인 뒤 음성 지시에 따르십시오.' }
      ],
      dos: ['1초당 2번 속도로 강하게 압박하세요', '압박 후 가슴이 완전히 올라오게 하세요', 'AED의 음성 지시에 따라 행동하십시오'],
      donts: ['환자가 의식이 있다면 하지 마세요', '맥박 확인을 위해 시간을 허비하지 마세요', '압박 중 팔꿈치를 굽히지 마세요'],
      warning: '환자가 스스로 숨을 쉬거나 의료진이 올 때까지 중단하지 마십시오.'
    },
    'HEI-07': {
      title: '기도 이물질 제거 (하임리히법)',
      diagnosis: '기도 폐쇄(Airway Obstruction)',
      riskLevel: '4',
      steps: [
        { title: '의식 및 상태 확인', desc: '환자 뒤로 가서 말을 걸어보세요. 목을 감싸고 말을 전혀 못 하면 즉시 처치를 시작합니다.' },
        { title: '자세 잡고 지탱하기', desc: '환자 뒤에 서서 양팔로 허리를 감싸고, 내 한쪽 다리를 환자 다리 사이에 넣어 환자가 쓰러질 때를 대비해 지탱하세요.' },
        { title: '손 모양과 위치 잡기', desc: '한쪽 주먹의 엄지손가락 쪽 면을 배꼽과 명치 사이에 대고, 다른 손으로 그 주먹을 꽉 움켜쥐십시오.' },
        { title: '강하게 밀어 올리기', desc: '환자의 배를 안쪽 위 방향(J자 모양)으로 강하게 들어 올리듯 반복해서 당기십시오.' }
      ],
      dos: ['이물질이 튀어나올 때까지 최대한 강하게 하세요', '환자가 의식을 잃으면 즉시 바닥에 눕히고 CPR 시작'],
      donts: ['입안에 이물질이 보이지 않는데 손가락을 넣어 쑤시지 마세요', '임산부는 복부가 아닌 가슴 부위를 압박하세요'],
      warning: '환자가 의식을 잃으면 즉시 기도를 확보하고 심폐소생술(CPR)로 전환하십시오.'
    },
    'AIR-03': {
      title: '기도 유지 및 호흡 보조',
      diagnosis: '호흡 곤란 및 기도 폐쇄 위험',
      riskLevel: '3',
      steps: [
        { title: '머리 기울이기-턱 올리기', desc: '한 손을 이마에 대고 머리를 뒤로 젖히며, 다른 손가락으로 턱뼈를 들어 올려 기도를 확보하십시오.' },
        { title: '입안 이물질 제거', desc: '눈에 보이는 구토물이나 이물질이 있다면 머리를 옆으로 돌려 손가락으로 가볍게 제거하십시오.' },
        { title: '의복 이완 및 조임 해제', desc: '넥타이, 벨트, 상의 단추 등 환자의 호흡을 방해하는 조이는 의복을 신속히 풀어주십시오.' },
        { title: '회복 자세 유지', desc: '환자가 스스로 숨을 쉰다면 몸을 옆으로 돌려 눕혀 기도가 막히지 않도록 조치하십시오.' }
      ],
      dos: ['환자가 자가 호흡 중이면 옆으로 눕히세요', '구토 시 즉시 몸 전체를 옆으로 돌리세요'],
      donts: ['의식이 없는 환자에게 물을 먹이지 마세요', '머리 밑에 베개를 넣어 기도를 꺾지 마세요'],
      warning: '호흡음이 거칠거나 청색증이 보이면 즉시 심폐소생술을 준비하십시오.'
    },
    'BLD-02': {
      title: '출혈 부위 직접 압박',
      diagnosis: '외상성 대량 출혈(Hemorrhage)',
      riskLevel: '3',
      steps: [
        { title: '상처 노출 및 확인', desc: '옷을 가위로 잘라 상처 부위를 완전히 드러내고 정확한 출혈 지점을 확인하십시오.' },
        { title: '직접 압박 시행', desc: '멸균 거즈나 깨끗한 천을 대고 손바닥 전체로 체중을 실어 강하게 누르십시오.' },
        { title: '지혈대(T-kit) 적용', desc: '대량 출혈이 직접 압박으로 멈추지 않을 때만 상처 5~10cm 위쪽(심장 방향)에 지혈대를 감으십시오.' }
      ],
      dos: ['출혈 부위를 심장보다 높게 유지하세요', '지혈대 사용 시 착용 시각을 기록하세요'],
      donts: ['상처에 박힌 칼 등을 억지로 뽑지 마세요', '된장 등 이물질을 바르지 마세요'],
      warning: '지혈대는 최후의 수단이며, 한 번 조이면 의료진의 지시 없이 절대 풀지 마십시오.'
    },
    'BRN-08': {
      title: '화상 부위 식히기',
      diagnosis: '열상성 화상(Burn Injury)',
      riskLevel: '2',
      steps: [
        { title: '흐르는 물 냉각 (20분)', desc: '12~25℃ 찬물에 20분 이상 식히십시오. 수압은 약하게 유지하십시오.' },
        { title: '의복 및 장신구 제거', desc: '가위로 옷을 자르되, 피부에 달라붙은 옷은 억지로 떼지 마십시오.' },
        { title: '화상 연고 및 드레싱', desc: '처치 부위의 열감이 사라진 후, 멸균 면봉으로 연고를 얹듯이 바르십시오.' }
      ],
      dos: ['물집이 터지지 않도록 최대한 조심하세요', '통증 완화를 위해 수평을 유지하세요'],
      donts: ['민간요법(된장, 소주 등)은 절대 금물입니다', '얼음을 직접 환부에 대지 마세요'],
      warning: '안면 화상이나 연기 흡입 시 산소를 공급하십시오.'
    },
    'HYP-05': {
      title: '물에 빠진 선원 구조',
      diagnosis: '심부 저체온증(Hypothermia)',
      riskLevel: '2',
      steps: [
        { title: '젖은 의복 제거', desc: '바람이 없는 따뜻하고 건조한 곳으로 이동하고, 젖은 옷을 제거한 뒤 몸을 닦으십시오.' },
        { title: '중심 체온 가온', desc: '담요로 몸을 감싸고, 온팩을 겨드랑이, 사타구니, 목 등 굵은 혈관 부위에 대십시오.' },
        { title: '안정 및 수평 이동', desc: '환자를 갑자기 일으키거나 팔다리를 주무르지 마십시오.' }
      ],
      dos: ['의식이 있다면 따뜻하고 단 음료를 주십시오', '환자를 아주 조심스럽게 옮기십시오'],
      donts: ['팔다리를 문지르거나 주무르지 마세요', '뜨거운 물에 환자를 직접 담그지 마세요'],
      warning: '심한 저체온증 환자는 작은 충격에도 심정지가 올 수 있으니 극히 주의하십시오.'
    },
    'FRC-04': {
      title: '뼈 부러진 곳 고정하기',
      diagnosis: '골절 및 신경 손상 의심',
      riskLevel: '1',
      steps: [
        { title: '상처 확인 및 안정화', desc: '다친 부위를 손으로 받쳐 움직이지 않게 고정하고, 편안한 자세를 유지하게 하십시오.' },
        { title: '부목 고정', desc: '나무판자나 종이박스로 다친 관절의 위아래를 충분히 포함하도록 대고 고정하십시오.' },
        { title: '냉찜질 (부종 방지)', desc: '부종과 통증을 줄이기 위해 얼음팩을 수건에 싸서 환부에 15분간 대어 주십시오.' }
      ],
      dos: ['뼈가 튀어나왔다면 멸균 거즈로 먼저 덮으세요', '다친 부위를 심장보다 높게 올리십시오'],
      donts: ['부러진 뼈를 맞추려 하거나 억지로 밀어 넣지 마세요', '환자를 일으켜 세우거나 걷게 하지 마세요'],
      warning: '척추 손상이 의심되거나 의식이 없는 경우 환자를 절대로 움직이지 마십시오.'
    },
    'WND-06': {
      title: '상처 씻기 및 소독',
      diagnosis: '국소 외상 및 찰과상',
      riskLevel: '1',
      steps: [
        { title: '충분한 세척 (5~10분)', desc: '흐르는 수돗물이나 멸균 식염수로 5~10분간 상처 속 이물질을 충분히 씻어내십시오.' },
        { title: '연고 및 멸균 드레싱', desc: '깨끗한 거즈로 주변 물기를 닦고 항생제 연고를 바른 뒤 멸균 거즈로 덮으십시오.' }
      ],
      dos: ['처치 전 위생 장갑을 반드시 착용하세요', '거즈가 없다면 깨끗한 손수건을 사용하세요'],
      donts: ['상처 내부에 소독액을 직접 붓지 마세요', '상처에 솜(탈지면)을 직접 대지 마세요'],
      warning: '깊은 자상, 동물에 물린 상처는 세척 후 즉시 의료진의 처치를 받으십시오.'
    }
  }

  const addManager = () => {
    if(!newMgrName.trim()) return;
    const newMgr = {
      id: `S26-${String(managerList.length + 10).padStart(3, '0')}`,
      name: newMgrName, role: '의료보조', dept: '지원부', nation: '대한민국',
      dob: '1990-01-01', blood: 'A+', avatar: null,
      status: '휴식 중', location: '거주구역', schedule: '12:00 - 16:00', leave: '정상근무',
      muster: 'C-1 (Main Deck)', ice: '미등록', allergies: '없음',
      perm: '일반', certs: [{ n: '기본 CPR', e: '2026-12-31' }]
    };
    setManagerList([...managerList, newMgr]);
    setNewMgrName('');
  };

  const removeManager = (id) => {
    setManagerList(managerList.filter(m => m.id !== id));
  };

  useEffect(() => { 
    const t = setInterval(() => {
      setNow(new Date())
      setCoords(p => ({ lat: (parseFloat(p.lat) + (Math.random()-0.5)*0.0001).toFixed(4)+'° N', lng: (parseFloat(p.lng) + (Math.random()-0.5)*0.0001).toFixed(4)+'° E' }))
    }, 1000); return () => clearInterval(t) 
  }, [])

  const getStatusInfo = (expiry) => {
    if (!expiry) return { label: '기한없음', color: C.info }
    const diff = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24))
    return diff < 0 ? { label: '만료', color: C.danger } : diff < 90 ? { label: '만료임박', color: C.warning } : { label: '유효', color: C.success }
  }

  const checkPct = Math.round((Object.values(checks).filter(Boolean).length / CHECKLIST.length) * 100)
  const toggle = (i) => setChecks({ ...checks, [i]: !checks[i] })
  const fold = (k) => setCollapsed(p => ({ ...p, [k]: !p[k] }))

  const [meds, setMeds] = useState([
    { id:1, n:'타이레놀', c:'해열진통', q:45, m:10, e:'2027-05-20', cat:'pill' },
    { id:2, n:'아스피린', c:'혈전/통증', q:12, m:10, e:'2026-12-15', cat:'pill' },
    { id:3, n:'소화제', c:'위장장애', q:8, m:15, e:'2027-01-10', cat:'pill' },
    { id:4, n:'항히스타민', c:'알레르기', q:8, m:10, e:'2026-08-05', cat:'pill' },
    { id:5, n:'항생제 연고', c:'외상처치', q:15, m:5, e:'2027-03-22', cat:'cream' },
    { id:6, n:'포비돈(소독)', c:'소독', q:3, m:5, e:'2026-05-10', cat:'liquid' },
    { id:7, n:'압박붕대', c:'고정/압박', q:20, m:10, e:'-', cat:'bandage' },
    { id:8, n:'지혈대', c:'심한출혈', q:4, m:5, e:'-', cat:'bandage' },
    { id:9, n:'이부프로펜', c:'소염진통', q:30, m:10, e:'2027-08-12', cat:'pill' },
    { id:10, n:'멀미약', c:'항현훈제', q:50, m:20, e:'2026-11-30', cat:'pill' },
    { id:11, n:'종합감기약', c:'호흡기질환', q:25, m:10, e:'2027-02-14', cat:'pill' },
    { id:12, n:'제산제', c:'위산과다', q:40, m:15, e:'2027-04-01', cat:'pill' },
    { id:13, n:'생리식염수', c:'세척/소독', q:10, m:10, e:'2026-09-20', cat:'liquid' },
    { id:14, n:'알코올 스왑', c:'국소소독', q:100, m:50, e:'2028-01-10', cat:'pad' },
    { id:15, n:'멸균 거즈', c:'상처보호', q:60, m:30, e:'-', cat:'pad' },
    { id:16, n:'의료용 테이프', c:'드레싱고정', q:15, m:5, e:'-', cat:'bandage' },
    { id:17, n:'화상 거즈', c:'화상처치', q:5, m:10, e:'2026-06-15', cat:'pad' },
    { id:18, n:'일회용 인공눈물', c:'안구세척', q:30, m:20, e:'2027-10-05', cat:'liquid' },
    { id:19, n:'파스(패치)', c:'근육통', q:20, m:10, e:'2027-12-20', cat:'pad' },
    { id:20, n:'경구수액염', c:'탈수방지', q:15, m:10, e:'2027-03-30', cat:'pill' },
    { id:21, n:'바셀린 거즈', c:'피부보호', q:12, m:10, e:'2027-01-22', cat:'pad' },
    { id:22, n:'스테로이드 연고', c:'피부염', q:8, m:5, e:'2026-11-11', cat:'cream' },
    { id:23, n:'탄력 붕대', c:'관절고정', q:10, m:5, e:'-', cat:'bandage' },
    { id:24, n:'알루미늄 부목', c:'골절고정', q:4, m:2, e:'-', cat:'bandage' },
  ])
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false)
  const [editingMedId, setEditingMedId] = useState(null)
  const [isMedModalOpen, setIsMedModalOpen] = useState(false)
  const [newMed, setNewMed] = useState({ n:'', c:'', q:0, m:0, e:'-', cat:'pill' })

  const updateMed = (id, delta) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, q: Math.max(0, m.q + delta) } : m))
  }

  const updateMedExpiry = (id, newDate) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, e: newDate } : m))
    setEditingMedId(null)
  }

  const addMed = () => {
    if (!newMed.n.trim() || !newMed.c.trim()) return alert('약품명과 분류를 입력하세요.')
    setMeds(prev => [...prev, { ...newMed, id: Date.now() }])
    setIsMedModalOpen(false)
    setNewMed({ n:'', c:'', q:0, m:0, e:'-', cat:'pill' })
  }

  const filteredMeds = useMemo(() => {
    if (!showOnlyAlerts) return meds
    return meds.filter(m => m.q <= m.m || (m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90))
  }, [meds, showOnlyAlerts])

  const medStats = useMemo(() => {
    const low = meds.filter(m => m.q <= m.m).length
    const expiring = meds.filter(m => m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90).length
    return { low, expiring, normal: meds.length - low - expiring }
  }, [meds])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEdu, setNewEdu] = useState({ name:'', id:'', dept:'', type:'기본 CPR (심폐소생술)', date:'', expiry:'' })
  const [dateEditor, setDateEditor] = useState(null) // { field, label, value }

  const addEdu = () => {
    if (!newEdu.id || !newEdu.date) return alert('선원과 날짜를 선택하세요.')
    setTrainingList([ { ...newEdu }, ...trainingList ])
    setIsModalOpen(false)
    setNewEdu({ name:'', id:'', dept:'', type:'기본 CPR (심폐소생술)', date:'', expiry:'' })
  }

  return (
    <div style={{ display:'flex', height:'calc(100vh - 72px)', background:C.bg, color:C.text, fontFamily:'"Pretendard",sans-serif', overflow:'hidden', position:'relative' }}>

      {/* ── 캘린더 모달 ── */}
      {dateEditor && (
        <CalendarModal 
          label={dateEditor.label} 
          initialValue={dateEditor.value} 
          onClose={() => setDateEditor(null)} 
          onSelect={(val) => {
            if (dateEditor.medId) {
              updateMedExpiry(dateEditor.medId, val)
            } else {
              setNewEdu(p => ({ ...p, [dateEditor.field]: val }))
            }
            setDateEditor(null)
          }} 
        />
      )}

      {/* ── 교육 이력 관리 모달 ── */}
      {isModalOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, fontFamily:'"Pretendard",sans-serif' }}>
          <div style={{ background:C.panel, border:`2px solid ${C.info}`, borderRadius:24, padding:45, width:650, boxShadow:'0 0 60px rgba(56,189,248,0.2)' }}>
            <div style={{ fontSize:32, fontWeight:950, marginBottom:35, color:C.info, display:'flex', alignItems:'center', gap:15, letterSpacing:'-1px' }}>
              <BookOpen size={36}/> 새 교육 이력 등록
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
              <div>
                <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800, display:'flex', justifyContent:'space-between' }}>
                  <span>교육 이수 선원 선택</span>
                  <span style={{ fontSize:14, color:C.info }}>부서 및 ID 자동 연동</span>
                </div>
                <select 
                  value={newEdu.id} 
                  onChange={e => {
                    const c = CREW.find(x => x.id === e.target.value);
                    if(c) setNewEdu({...newEdu, id:c.id, name:c.name, dept:c.dept});
                  }} 
                  style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', fontFamily:'inherit', appearance:'none', cursor:'pointer' }}>
                  <option value="">선원을 선택하세요 (이름 ⏐ ID ⏐ 부서)</option>
                  {CREW.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ⏐ {c.id} ⏐ {c.dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>교육 과정</div>
                <select 
                  value={newEdu.type} 
                  onChange={e=>setNewEdu({...newEdu, type:e.target.value})} 
                  style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', fontFamily:'inherit', appearance:'none', cursor:'pointer' }}>
                  <option>기본 CPR (심폐소생술)</option>
                  <option>의료 응급 처치 (STCW)</option>
                  <option>선상 응급 의료 (Advanced)</option>
                  <option>AED 기기 작동법</option>
                  <option>원격 의료 장비 운용 교육</option>
                </select>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div>
                  <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>이수 날짜</div>
                  <div 
                    onClick={() => setDateEditor({ field:'date', label:'이수 날짜', value:newEdu.date })}
                    style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, cursor:'pointer', minHeight:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    {newEdu.date || <span style={{ color:'rgba(255,255,255,0.15)' }}>날짜 선택</span>}
                    <Clock size={20} color={C.sub} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:18, color:C.sub, marginBottom:12, fontWeight:800 }}>만료 날짜</div>
                  <div 
                    onClick={() => setDateEditor({ field:'expiry', label:'만료 날짜', value:newEdu.expiry })}
                    style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, cursor:'pointer', minHeight:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    {newEdu.expiry || <span style={{ color:'rgba(255,255,255,0.15)' }}>날짜 선택</span>}
                    <Clock size={20} color={C.sub} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:18, marginTop:45 }}>
              <button onClick={()=>setIsModalOpen(false)} style={{ flex:1, padding:20, borderRadius:15, background:'rgba(255,255,255,0.03)', border:`1px solid ${C.border}`, color:C.sub, fontSize:22, fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'0.2s' }}>취소</button>
              <button onClick={addEdu} style={{ flex:2, padding:20, borderRadius:15, background:C.info, border:'none', color:'#000', fontSize:22, fontWeight:950, cursor:'pointer', fontFamily:'inherit', transition:'0.2s', boxShadow:`0 10px 20px ${C.info}33` }}>이력 저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 사이드 네비 */}
      <nav style={{ width:86, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:28, gap:10, background:C.panel }}>
        {['현황','건강','시스템'].map((l, i) => (
          <button key={i} onClick={() => document.getElementById(`s${i+1===3?5:i+1}`)?.scrollIntoView({ behavior:'smooth' })}
            style={{ width:65, height:65, borderRadius:12, background:'transparent', border:'1px solid transparent', cursor:'pointer', fontSize:17, fontWeight:800, color:C.sub }}>{l}</button>
        ))}
      </nav>

      {/* 메인 스크롤 */}
      <div style={{ flex:1, overflowY:'auto', padding:'35px 42px' }}>

        {/* 헤더 */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:35, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <Dot color={C.success} pulse />
            <Ship size={28} color={C.info} />
            <span style={{ fontSize:26, fontWeight:800 }}>MDTS 통합 인프라 관리</span>
            <Tag color={C.cyan} style={{ fontSize:18 }}>MV KOREA STAR</Tag>
          </div>
          <div style={{ fontSize:22, color:C.sub, display:'flex', gap:36 }}>
            <span><Clock size={22}/> {now.toLocaleTimeString()}</span>
            <span style={{ color:C.success }}><RefreshCw size={22}/> 5초 갱신</span>
          </div>
        </div>

        {/* ══ S1 : 의료 현황 (상단) ══ */}
        <Section id="s1" label="선박 의료 실시간 현황" color={C.cyan} collapsed={collapsed.s1} onToggle={() => fold('s1')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:30 }}>
            {[
              { l:'응급 장비 신뢰도', v:checkPct, u:'%', c:C.success, s:'정기 점검 완료', i:<ShieldCheck size={26}/>, p:checkPct },
              { l:'대응 가용 인원', v:trainingList.length, u:'명', c:C.info, s:'즉시 투입 가능', i:<Users size={26}/>, p:Math.min(100, (trainingList.length/10)*100) },
              { l:'의료 소모품 재고', v:'94', u:'%', c:C.cyan, s:'필수 의약품 24종', i:<Pill size={26}/>, p:94 },
              { l:'최근접 구조 거점', v:'85', u:'km', c:C.warning, s:'도착 예정 시간 45분', i:<MapPin size={26}/>, p:30 },
            ].map((s,idx)=>(
              <div key={idx} className="kpi-card" style={{ 
                background: `rgba(17, 19, 24, 0.6)`,
                backdropFilter: 'blur(20px)',
                border: `1.5px solid ${s.c}44`,
                borderRadius: 22,
                padding: '20px 24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 20px ${s.c}11`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={{ fontSize:18, color:C.sub, fontWeight:800, letterSpacing:'0.5px' }}>{s.l}</div>
                  <div style={{ padding:8, borderRadius:10, background:`${s.c}18`, color:s.c }}>{s.i}</div>
                </div>

                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:48, fontWeight:950, color:s.c, letterSpacing:'-2px', textShadow:`0 0 15px ${s.c}44` }}>{s.v}</span>
                  <span style={{ fontSize:22, color:C.sub, fontWeight:800 }}>{s.u}</span>
                </div>

                <div style={{ fontSize:16, color:'#fff', fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:s.c, boxShadow:`0 0 12px ${s.c}` }} />
                  {s.s}
                </div>

                <div style={{ height:8, background:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${s.p}%`, background:`linear-gradient(90deg, ${s.c}88, ${s.c})`, borderRadius:4, boxShadow:`0 0 15px ${s.c}88` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            <GPanel title="응급 대응 준비 상태" icon={<Shield size={22} color={C.success}/>} right={<span style={{ fontSize:25, fontWeight:900 }}>{checkPct}%</span>}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {CHECKLIST.map((item, i) => (
                  <div key={i} onClick={()=>toggle(i)} style={{ display:'flex', alignItems:'center', gap:18, cursor:'pointer', padding:'15px 22px', borderRadius:10, background: checks[i] ? `${C.success}08` : C.panel2, border:`1px solid ${checks[i] ? `${C.success}33` : C.border}` }}>
                    <div style={{ width:24, height:24, borderRadius:6, border:`2px solid ${checks[i] ? C.success : C.dim}`, background: checks[i] ? C.success : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>{checks[i] && <CheckCircle2 size={18} color="#000" strokeWidth={3} />}</div>
                    <span style={{ fontSize:20, fontWeight: checks[i]?700:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </GPanel>

            <GPanel title="선원 의료 교육 이력" icon={<Users size={22} color={C.cyan}/>} right={<Btn color={C.info} small onClick={()=>setIsModalOpen(true)}>+</Btn>}>
              <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                {trainingList.map((r,i)=>(
                  <div key={i} style={{ padding:'20px 25px', borderRadius:18, background:C.panel2, border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:15 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                          <span style={{ fontSize:26, fontWeight:900, color:'#fff' }}>{r.name}</span>
                          <span style={{ fontSize:18, color:C.sub, fontWeight:700 }}>{r.id}</span>
                          <Tag color={C.dim} small style={{ fontSize:15, padding:'4px 10px', color:C.text }}>{r.dept || '부서 미지정'}</Tag>
                        </div>
                        <div style={{ fontSize:22, fontWeight:850, color:C.info }}>{r.type}</div>
                      </div>
                      <Tag color={getStatusInfo(r.expiry).color} style={{ fontSize:18, padding:'6px 15px' }}>{getStatusInfo(r.expiry).label}</Tag>
                    </div>

                    <div style={{ display:'flex', gap:30, borderTop:`1px solid ${C.border}`, paddingTop:15, marginTop:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <CheckCircle2 size={20} color={C.success} />
                        <span style={{ fontSize:17, color:C.sub, fontWeight:700 }}>이수:</span>
                        <span style={{ fontSize:18, fontWeight:800, color:C.text }}>{r.date || '-'}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Clock size={20} color={getStatusInfo(r.expiry).color} />
                        <span style={{ fontSize:17, color:C.sub, fontWeight:700 }}>만료:</span>
                        <span style={{ fontSize:18, fontWeight:800, color:getStatusInfo(r.expiry).color }}>{r.expiry || '기한 없음'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>

          <div style={{ marginTop: 25 }}>
            <GPanel title="필수 의료 약품 및 소모품 재고 관리 (24종)" icon={<Pill size={22} color={C.warning}/>} 
              right={<div style={{ display:'flex', gap:15 }}>
                <button 
                  onClick={() => setShowOnlyAlerts(!showOnlyAlerts)}
                  style={{ background: showOnlyAlerts ? C.warning : 'rgba(255,255,255,0.05)', border: `1px solid ${showOnlyAlerts ? C.warning : C.border}`, color: showOnlyAlerts ? '#000' : C.sub, padding: '5px 15px', borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}
                >보충 필요 항목만 보기</button>
                <Tag color={C.success} small>정상 : {medStats.normal}</Tag>
                <Tag color={C.warning} small>보충필요 : {medStats.low}</Tag>
                <Tag color={C.danger} small>기한임박 : {medStats.expiring}</Tag>
              </div>}>
              
              <div style={{ maxHeight: 450, overflowY: 'auto', paddingRight: 10, marginTop: 10 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:15 }}>
                  {filteredMeds.map(m => {
                    const isLow = m.q <= m.m;
                    const isExpiring = m.e !== '-' && (new Date(m.e) - new Date()) / (1000*60*60*24) < 90;
                    return (
                      <div key={m.id} style={{ background:C.panel, border:`1.5px solid ${isLow ? C.warning+'66' : isExpiring ? C.danger+'66' : C.border}`, borderRadius:15, padding:'28px', transition:'0.2s', position:'relative' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                          <div>
                            <div style={{ fontSize:20, color:C.sub, fontWeight:800, marginBottom:6, display:'flex', alignItems:'center', gap:7 }}>
                              {m.cat === 'pill' ? <Pill size={18}/> : m.cat === 'liquid' ? <Activity size={18}/> : <Shield size={18}/>} {m.c}
                            </div>
                            <div style={{ fontSize:30, fontWeight:900, color:'#fff' }}>{m.n}</div>
                          </div>
                          {isExpiring && <span style={{ background:C.danger, color:'#fff', fontSize:17, padding:'4px 8px', borderRadius:5, fontWeight:900, animation:'blink 2s infinite' }}>기한임박</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:C.panel2, padding:'14px 22px', borderRadius:10, marginBottom:18, border:`1px solid ${C.border}` }}>
                          <button onClick={()=>updateMed(m.id, -1)} style={{ background:'none', border:'none', color:C.info, cursor:'pointer', fontSize:36, fontWeight:900 }}>-</button>
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontSize:34, fontWeight:900, color:isLow ? C.warning : C.success }}>{m.q}</div>
                            <div style={{ fontSize:20, color:C.sub, fontWeight:700 }}>최소 {m.m}</div>
                          </div>
                          <button onClick={()=>updateMed(m.id, 1)} style={{ background:'none', border:'none', color:C.info, cursor:'pointer', fontSize:36, fontWeight:900 }}>+</button>
                        </div>
                        <div style={{ fontSize:21, color:C.sub, textAlign:'center', fontWeight:700 }}>
                          유통기한 : {editingMedId === m.id ? (
                            <input 
                              autoFocus
                              defaultValue={m.e}
                              onBlur={e => updateMedExpiry(m.id, e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && updateMedExpiry(m.id, e.target.value)}
                              style={{ width:140, background:C.panel2, border:`1px solid ${C.info}`, borderRadius:4, color:'#fff', textAlign:'center', outline:'none', fontSize:20, fontFamily:'monospace' }}
                            />
                          ) : (
                            <span 
                              onClick={() => setEditingMedId(m.id)}
                              style={{ color:isExpiring?C.danger:C.text, cursor:'pointer' }}
                            >{m.e}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {filteredMeds.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: C.sub, fontSize: 18, fontWeight: 700 }}>현재 보충이 필요한 항목이 없습니다.</div>
                )}
              </div>
              <div style={{ marginTop:20, textAlign:'center' }}>
                <Btn color={C.info} style={{ fontSize:17, padding:'10px 25px' }} onClick={() => setIsMedModalOpen(true)}>+ 신규 약품/소모품 등록</Btn>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ── 신규 약품 등록 모달 ── */}
        {isMedModalOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, fontFamily:'"Pretendard",sans-serif' }}>
            <div style={{ background:C.panel, border:`2px solid ${C.warning}`, borderRadius:24, padding:45, width:650, boxShadow:'0 0 60px rgba(251,146,60,0.2)' }}>
              <div style={{ fontSize:32, fontWeight:950, marginBottom:35, color:C.warning, display:'flex', alignItems:'center', gap:15, letterSpacing:'-1px' }}>
                <Pill size={36}/> 신규 의료 소모품 등록
              </div>
              
              <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>약품/소모품 명칭</div>
                    <input 
                      value={newMed.n} 
                      onChange={e => setNewMed({...newMed, n: e.target.value})}
                      placeholder="예: 타이레놀 500mg"
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', boxSizing:'border-box' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>효능/분류</div>
                    <input 
                      value={newMed.c} 
                      onChange={e => setNewMed({...newMed, c: e.target.value})}
                      placeholder="예: 해열진통제"
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', boxSizing:'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>형태 분류</div>
                    <select 
                      value={newMed.cat} 
                      onChange={e => setNewMed({...newMed, cat: e.target.value})}
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', appearance:'none', cursor:'pointer' }}>
                      <option value="pill">알약 (Pill)</option>
                      <option value="liquid">액체 (Liquid)</option>
                      <option value="cream">연고 (Cream)</option>
                      <option value="pad">거즈/패드 (Pad)</option>
                      <option value="bandage">붕대/고정 (Bandage)</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>유통기한</div>
                    <div 
                      onClick={() => setDateEditor({ field:'e', label:'유통기한', value:newMed.e, medId: null })}
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, cursor:'pointer', minHeight:60, display:'flex', alignItems:'center', justifyContent:'space-between', boxSizing:'border-box' }}>
                      {newMed.e === '-' ? <span style={{ color:'rgba(255,255,255,0.15)' }}>기한 없음</span> : newMed.e}
                      <Clock size={20} color={C.sub} />
                    </div>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>현재 재고 수량</div>
                    <input 
                      type="number"
                      value={newMed.q} 
                      onChange={e => setNewMed({...newMed, q: parseInt(e.target.value) || 0})}
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', boxSizing:'border-box' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize:18, color:C.sub, marginBottom:10, fontWeight:800 }}>최소 유지 수량 (알림)</div>
                    <input 
                      type="number"
                      value={newMed.m} 
                      onChange={e => setNewMed({...newMed, m: parseInt(e.target.value) || 0})}
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 20px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', boxSizing:'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:18, marginTop:45 }}>
                <button onClick={()=>setIsMedModalOpen(false)} style={{ flex:1, padding:20, borderRadius:15, background:'rgba(255,255,255,0.03)', border:`1px solid ${C.border}`, color:C.sub, fontSize:22, fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'0.2s' }}>취소</button>
                <button onClick={addMed} style={{ flex:2, padding:20, borderRadius:15, background:C.warning, border:'none', color:'#000', fontSize:22, fontWeight:950, cursor:'pointer', fontFamily:'inherit', transition:'0.2s', boxShadow:`0 10px 20px ${C.warning}33` }}>등록 완료</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ S2 : 선원 건강 ══ */}
        <Section id="s2" label="선원 건강 모니터링" color={C.success} collapsed={collapsed.s2} onToggle={()=>fold('s2')}>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:18, marginBottom:18 }}>
            <GPanel title="선원 건강 위험도 히트맵" icon={<Activity size={22} color={C.success}/>}
              right={
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.success }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.sub }}>정상</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.warning }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.sub }}>주의</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.danger }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.sub }}>고위험</span>
                  </div>
                </div>
              }>
              <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                {CREW.map(c => <div key={c.id} title={`${c.name} - ${c.role}`} style={{ width:85, padding:'12px 5px', borderRadius:10, background:`${riskOf(c)}1a`, border:`1px solid ${riskOf(c)}44`, textAlign:'center', cursor:'pointer' }}><div style={{ fontSize:17, fontWeight:800, color:riskOf(c) }}>{c.name}</div><div style={{ width:10, height:10, borderRadius:'50%', background:riskOf(c), margin:'5px auto 0' }}/></div>)}
              </div>
            </GPanel>

            <GPanel title="건강 위험 분포" icon={<Activity size={22} color={C.danger}/>}>
              <div style={{ height:250, position:'relative' }}>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:70,c:C.success},{v:20,c:C.warning},{v:10,c:C.danger}]} innerRadius={60} outerRadius={90} dataKey="v" stroke="none">{[{v:70,c:C.success},{v:20,c:C.warning},{v:10,c:C.danger}].map((e,idx)=><Cell key={idx} fill={e.c}/>)}</Pie></PieChart></ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}><div style={{ fontSize:18, color:C.sub }}>SAFETY</div><div style={{ fontSize:32, fontWeight:900 }}>82%</div></div>
              </div>
            </GPanel>
          </div>
        </Section>

        {/* ══ S4 : SOP ══ */}
        <Section id="s4" label="응급처치 지침 및 SOP" color={C.purple} collapsed={collapsed.s4} onToggle={()=>fold('s4')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
            {SOP_LIST.map((s,i)=>(
              <div key={i} onClick={() => setSelectedSop(s.code)} style={{ padding:'25px 20px', borderRadius:15, background:C.panel2, border:`1px solid ${C.border}`, textAlign:'center', cursor:'pointer', transition:'0.2s' }} className="sop-card">
                <div style={{ fontSize:18, color:s.color, fontWeight:800, marginBottom:10 }}>{s.code}</div>
                <div style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>{s.title}</div>
                <Tag color={s.color} small>{s.cat}</Tag>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SOP 상세 뷰어 모달 ── */}
        {selectedSop && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(15px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3000, fontFamily:'"Pretendard",sans-serif', padding:40 }}>
            <div style={{ background:C.panel, border:`2px solid ${C.purple}`, borderRadius:32, width:'100%', maxWidth:1100, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 0 100px rgba(167,139,250,0.2)' }}>
              {/* 모달 헤더 */}
              <div style={{ padding:'35px 45px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(167,139,250,0.03)' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:15, marginBottom:10 }}>
                    <Tag color={C.purple}>{selectedSop}</Tag>
                    <div style={{ background:ACTION_GUIDES_DATA[selectedSop].riskLevel >= '3' ? C.danger : C.warning, color:'#000', padding:'4px 12px', borderRadius:8, fontSize:15, fontWeight:950 }}>RISK LEVEL {ACTION_GUIDES_DATA[selectedSop].riskLevel}</div>
                  </div>
                  <h2 style={{ fontSize:42, fontWeight:950, color:'#fff', margin:0, letterSpacing:'-1.5px' }}>{ACTION_GUIDES_DATA[selectedSop].title}</h2>
                </div>
                <button onClick={() => setSelectedSop(null)} style={{ background:'rgba(255,255,255,0.05)', border:'none', color:'#fff', width:64, height:64, borderRadius:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={32}/></button>
              </div>

              {/* 모달 컨텐츠 */}
              <div style={{ flex:1, overflowY:'auto', padding:'45px', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:35 }}>
                {/* 좌측 : 단계별 절차 */}
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.purple, marginBottom:25, display:'flex', alignItems:'center', gap:10 }}><Activity size={24}/> 표준 운영 절차 (Standard Procedures)</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                    {ACTION_GUIDES_DATA[selectedSop].steps.map((step, idx) => (
                      <div key={idx} style={{ padding:'24px', background:C.panel2, borderRadius:20, border:`1px solid ${C.border}`, display:'flex', gap:20 }}>
                        <div style={{ width:40, height:40, borderRadius:'50%', background:C.purple, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:950, flexShrink:0 }}>{idx+1}</div>
                        <div>
                          <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:6 }}>{step.title}</div>
                          <div style={{ fontSize:19, color:C.text, lineHeight:1.5, fontWeight:600 }}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 우측 : 주의사항 및 지침 */}
                <div style={{ display:'flex', flexDirection:'column', gap:25 }}>
                  <div style={{ background:'rgba(34,197,94,0.05)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:24, padding:30 }}>
                    <div style={{ color:C.success, fontSize:22, fontWeight:900, marginBottom:20, display:'flex', alignItems:'center', gap:10 }}><CheckCircle2 size={24}/> 권고 사항 (Dos)</div>
                    {ACTION_GUIDES_DATA[selectedSop].dos.map((d, i) => <div key={i} style={{ fontSize:19, fontWeight:700, marginBottom:12, color:'#e2e8f0', display:'flex', gap:10 }}><span style={{ color:C.success }}>•</span>{d}</div>)}
                  </div>

                  <div style={{ background:'rgba(239,68,68,0.08)', border:`1px solid ${C.danger}44`, borderRadius:24, padding:30 }}>
                    <div style={{ color:C.danger, fontSize:22, fontWeight:900, marginBottom:20, display:'flex', alignItems:'center', gap:10 }}><AlertCircle size={24}/> 절대 금기 (Don'ts)</div>
                    {ACTION_GUIDES_DATA[selectedSop].donts.map((d, i) => <div key={i} style={{ fontSize:19, fontWeight:800, color:'#fff', marginBottom:12, display:'flex', gap:10 }}><span style={{ color:C.danger }}>•</span>{d}</div>)}
                  </div>

                  <div style={{ background:C.panel2, border:`2px solid ${C.warning}66`, borderRadius:24, padding:30, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, width:6, height:'100%', background:C.warning }} />
                    <div style={{ color:C.warning, fontSize:22, fontWeight:900, marginBottom:15, display:'flex', alignItems:'center', gap:10 }}><Sparkles size={24}/> 긴급 경고</div>
                    <div style={{ fontSize:20, fontWeight:800, color:'#fff', lineHeight:1.5 }}>{ACTION_GUIDES_DATA[selectedSop].warning}</div>
                  </div>
                </div>
              </div>

              {/* 모달 푸터 */}
              <div style={{ padding:'30px 45px', background:C.panel2, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'center' }}>
                <button onClick={() => setSelectedSop(null)} style={{ padding:'18px 60px', borderRadius:15, background:'rgba(255,255,255,0.05)', border:`1px solid ${C.border}`, color:'#fff', fontSize:22, fontWeight:900, cursor:'pointer' }}>확인 및 닫기</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ S5 : 시스템 관리 (하단) ══ */}
        <Section id="s5" label="시스템 관리 및 장비 건전성" color={C.warning} collapsed={collapsed.s5} onToggle={()=>fold('s5')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:24 }}>
            {[
              {l:'위성 신호', v:'매우 강함', c:C.success, s:'Starlink Gen3', i:<Wifi size={24}/>},
              {l:'응답 속도', v:'42ms', c:C.info, s:'STABLE (Low)', i:<Activity size={24}/>},
              {l:'DB 동기화', v:'09:31', c:C.success, s:'LAST SYNC', i:<RefreshCw size={24}/>},
              {l:'AI 엔진', v:'v2.4.1', c:C.purple, s:'STABLE RELEASE', i:<Cpu size={24}/>}
            ].map((s,i)=>(
              <div key={i} className="sys-kpi-card" style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1.5px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 20, 
                padding: '24px 28px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                {/* 배경 디테일 */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: `${s.c}08`, borderRadius: '50%', filter: 'blur(20px)' }} />
                
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:15 }}>
                  <div style={{ fontSize:18, color:C.sub, fontWeight:800, letterSpacing:'0.5px' }}>{s.l}</div>
                  <div style={{ color:s.c, opacity:0.8 }}>{s.i}</div>
                </div>

                <div style={{ fontSize:34, fontWeight:950, color:'#fff', marginBottom:8, letterSpacing:'-1px' }}>{s.v}</div>
                
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:s.c, boxShadow:`0 0 10px ${s.c}` }} />
                  <div style={{ fontSize:15, color:C.sub, fontWeight:700, textTransform:'uppercase' }}>{s.s}</div>
                </div>

                {/* 하단 데코 라인 */}
                <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:1.5, background:`linear-gradient(90deg, transparent, ${s.c}33, transparent)` }} />
              </div>
            ))}
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:18, marginBottom:18 }}>
            <GPanel title="위성 신호 품질 (24h)" icon={<Wifi size={22} color={C.info}/>}><div style={{ height:220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={signal}><Area type="monotone" dataKey="v" stroke={C.info} fill={C.info} fillOpacity={0.1} strokeWidth={4} dot={false}/></AreaChart></ResponsiveContainer></div></GPanel>
            <GPanel title="실시간 선박 좌표" icon={<MapPin size={22} color={C.cyan}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:25, justifyContent:'center', height:220 }}>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'20px', textAlign:'center' }}><div style={{ fontSize:16, color:C.sub, fontWeight:800 }}>LATITUDE</div><div style={{ fontSize:28, fontWeight:900, color:C.cyan }}>{coords.lat}</div></div>
                <div style={{ background:'rgba(13,217,197,0.05)', border:`1px solid ${C.cyan}33`, borderRadius:15, padding:'20px', textAlign:'center' }}><div style={{ fontSize:16, color:C.sub, fontWeight:800 }}>LONGITUDE</div><div style={{ fontSize:28, fontWeight:900, color:C.cyan }}>{coords.lng}</div></div>
              </div>
            </GPanel>
            <GPanel title="기기 정보" icon={<HardDrive size={22} color={C.warning}/>} right={<Edit2 size={18} color={C.sub}/>}>
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:10 }}>
                {[{l:'선박명',v:'KOREA STAR'},{l:'기기번호',v:'MED-001'},{l:'IMO 번호',v:'9876543'},{l:'S/N',v:'SN-10294'},{l:'보증만료',v:'2027-11'}].map(d=><div key={d.l} style={{ display:'flex', justifyContent:'space-between', fontSize:19 }}><span style={{ color:C.sub }}>{d.l}</span><span style={{ fontWeight:700 }}>{d.v}</span></div>)}
              </div>
            </GPanel>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1.5fr', gap:18, marginBottom:18 }}>
            <GPanel title="보안 설정" icon={<Lock size={22} color={C.success}/>}><div style={{ display:'flex', flexDirection:'column', gap:15 }}>{[{l:'생체 인증 로그인',k:'bio'},{l:'엔드투엔드 암호화',k:'enc'},{l:'30분 자동 로그아웃',k:'auto'}].map(s=><div key={s.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:20 }}><span style={{ color:C.sub }}>{s.l}</span><Toggle on={sec[s.k]} color={C.success} onChange={()=>{}}/></div>)}</div></GPanel>
            <GPanel title="AI 분석 모델" icon={<Cpu size={22} color={C.purple}/>}><div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:19 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:C.sub }}>엔진 버전</span><span style={{ color:C.purple, fontWeight:800 }}>v2.4.1</span></div><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:C.sub }}>진단 정확도</span><span style={{ color:C.success, fontWeight:800 }}>98.2%</span></div><Btn color={C.purple} small style={{ marginTop:15 }}>업데이트 확인</Btn></div></GPanel>
            <GPanel title="시스템 활동 로그" icon={<Terminal size={22} color={C.sub}/>} right={<Search size={18} color={C.sub}/>}>
              <div style={{ height:180, overflowY:'auto', background:'#060809', padding:18, borderRadius:12, fontFamily:'monospace', fontSize:17, border:`1px solid ${C.border}` }}>
                {SYS_LOGS.map((l,i)=><div key={i} style={{ marginBottom:8 }}><span style={{ color:C.sub }}>[{l.t}]</span> <span style={{ color:l.type==='error'?C.danger:C.info }}>{l.msg}</span></div>)}
              </div>
            </GPanel>
          </div>

          <div style={{ marginTop: 25 }}>
            <GPanel title="시스템 및 장비 건전성 모니터링" icon={<ShieldCheck size={22} color={C.success}/>}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:15 }}>
                {[
                  { n:'MDTS 메인 서버', s:'ACTIVE', c:C.success, d:'Uptime 142d 08h' },
                  { n:'AED 배터리/패드', s:'NORMAL', c:C.success, d:'점검: 2026-11-20' },
                  { n:'바이탈 센서 (Hub)', s:'STABLE', c:C.info, d:'5개 노드 연결됨' },
                  { n:'위성 통신 링크', s:'EXCELLENT', c:C.success, d:'Starlink Gen3' },
                ].map((d,i)=>(
                  <div key={i} style={{ padding:'22px', background:C.panel2, border:`1px solid ${C.border}`, borderRadius:15 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}><span style={{ fontSize:20, fontWeight:700 }}>{d.n}</span><div style={{ display:'flex', alignItems:'center', gap:8 }}><Dot color={d.c} pulse={d.c===C.success}/><span style={{ fontSize:16, fontWeight:900, color:d.c }}>{d.s}</span></div></div>
                    <div style={{ fontSize:18, color:C.sub, fontFamily:'monospace' }}>{d.d}</div>
                  </div>
                ))}
              </div>
            </GPanel>
          </div>
        </Section>
        <div style={{ height:50 }}/>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .kpi-card:hover { transform: translateY(-8px); background: rgba(17, 19, 24, 0.8) !important; border-color: inherit !important; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.6) !important; }
        .sop-card:hover { background: rgba(167,139,250,0.08) !important; border-color: rgba(167,139,250,0.4) !important; transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
        .premium-btn:hover { background: rgba(255,255,255,0.05) !important; filter: brightness(1.2); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:10px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}

/* ─── 서브 컴포넌트 ─── */
const Section = ({ id, label, color, collapsed, onToggle, children }) => (
  <div id={id} style={{ marginBottom:40 }}>
    <div onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:15, padding:'18px 25px', borderRadius:12, background:`${color}08`, border:`1px solid ${color}2a`, cursor:'pointer', marginBottom:collapsed?0:20 }}>
      <div style={{ width:5, height:25, background:color, borderRadius:2 }}/>
      <span style={{ fontSize:24, fontWeight:800, color, flex:1 }}>{label}</span>
      {collapsed ? <ChevronRight size={26} color={color}/> : <ChevronDown size={26} color={color}/>}
    </div>
    {!collapsed && children}
  </div>
)

const GPanel = ({ title, icon, right, children }) => (
  <div style={{ 
    background:'rgba(22, 27, 34, 0.5)', 
    backdropFilter:'blur(15px)',
    border:'1px solid rgba(255,255,255,0.08)', 
    borderRadius:24, 
    padding:'32px', 
    height:'100%', 
    display:'flex', 
    flexDirection:'column',
    boxShadow:'0 15px 35px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.02)'
  }}>
    <div style={{ 
      display:'flex', 
      justifyContent:'space-between', 
      alignItems:'center', 
      marginBottom:25, 
      paddingBottom:18, 
      borderBottom:'1px solid rgba(255,255,255,0.05)',
      position:'relative'
    }}>
      <div style={{ position:'absolute', bottom:-1, left:0, width:60, height:2, background:C.info, boxShadow:`0 0 10px ${C.info}` }} />
      <div style={{ display:'flex', alignItems:'center', gap:15, fontSize:24, fontWeight:850, color:'#fff', letterSpacing:'-0.5px' }}>
        <div style={{ padding:8, borderRadius:10, background:'rgba(255,255,255,0.03)', display:'flex' }}>{icon}</div>
        {title}
      </div>
      {right}
    </div>
    <div style={{ flex:1 }}>{children}</div>
  </div>
)

const Tag = ({ color, children, small, style }) => (
  <span style={{ padding: small?'5px 12px':'8px 18px', borderRadius:8, fontSize:small?16:20, fontWeight:800, background:`${color}12`, color, border:`1px solid ${color}44`, boxShadow:`inset 0 0 10px ${color}08`, ...style }}>{children}</span>
)

const Dot = ({ color, pulse }) => (
  <div style={{ width:14, height:14, borderRadius:'50%', background:color, boxShadow:`0 0 15px ${color}`, animation:pulse?'pulse 2s infinite':undefined }}/>
)

const Btn = ({ color, onClick, children, small, style }) => (
  <button onClick={onClick} className="premium-btn" style={{ 
    padding:small?'10px 20px':'12px 28px', 
    borderRadius:12, 
    background:`linear-gradient(135deg, ${color}22, ${color}05)`, 
    border:`1px solid ${color}55`, 
    color, 
    fontSize:small?18:21, 
    fontWeight:800, 
    cursor:'pointer',
    transition:'all 0.2s',
    ...style 
  }}>{children}</button>
)

const Toggle = ({ on, color, onChange }) => (
  <div onClick={onChange} style={{ 
    width:70, height:36, borderRadius:18, background:on?`${color}33`:C.dim, 
    border:`1.5px solid ${on?color:'rgba(255,255,255,0.1)'}`,
    position:'relative', cursor:'pointer', transition:'all 0.3s', flexShrink:0 
  }}>
    <div style={{ 
      position:'absolute', top:4, left:on?38:4, width:25, height:25, 
      borderRadius:'50%', background:on?color:'#fff', transition:'all 0.3s',
      boxShadow:on?`0 0 15px ${color}`:'none'
    }}/>
  </div>
)

function CalendarModal({ label, initialValue, onClose, onSelect }) {
  const [viewDate, setViewDate] = useState(initialValue && !isNaN(new Date(initialValue).getTime()) ? new Date(initialValue) : new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Pretendard", sans-serif' }}>
      <div style={{ width: 650, background: '#0a1224', border: '2.5px solid #0dd9c5', borderRadius: 40, padding: 50, boxShadow: '0 0 80px rgba(13,217,197,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0dd9c5', marginBottom: 8 }}>{label} 시스템 설정</div>
            <div style={{ display:'flex', alignItems:'center', gap:15 }}>
              <select 
                value={year} 
                onChange={e => setViewDate(new Date(parseInt(e.target.value), month, 1))}
                style={{ background:'transparent', border:'none', color:'#fff', fontSize:42, fontWeight:950, cursor:'pointer', outline:'none', fontFamily:'inherit', appearance:'none' }}>
                {Array.from({length:30}, (_,i)=>2010+i).map(y=><option key={y} value={y} style={{background:'#0a1224', color:'#fff'}}>{y}년</option>)}
              </select>
              <div style={{ fontSize: 42, fontWeight: 950, color: '#fff' }}>{month + 1}월</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 60, height: 60, borderRadius: 20, cursor: 'pointer' }}><X size={30}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, marginBottom: 40 }}>
          <button onClick={() => setViewDate(new Date(year - 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>이전 해</button>
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>이전 달</button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>다음 달</button>
          <button onClick={() => setViewDate(new Date(year + 1, month, 1))} style={{ padding: 15, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>다음 해</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, textAlign: 'center' }}>
          {['일','월','화','수','목','금','토'].map((d,i) => <div key={i} style={{ color: i===0?'#ff4d6d':i===6?'#38bdf8':'#64748b', fontWeight: 900, fontSize: 18, marginBottom: 15 }}>{d}</div>)}
          {days.map((d, i) => {
            const dateKey = d ? `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null;
            const isSelected = dateKey && dateKey === initialValue;
            const isToday = d && new Date().toDateString() === new Date(year, month, d).toDateString();
            return (
              <div key={i} onClick={() => d && onSelect(dateKey)} style={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18, fontSize: 24, fontWeight: 800, cursor: d?'pointer':'default', background: isSelected ? '#0dd9c5' : 'rgba(255,255,255,0.02)', color: isSelected ? '#020617' : '#fff', border: isToday && !isSelected ? '1.5px solid #0dd9c5' : 'none', transition: '0.2s' }} onMouseEnter={e => d && !isSelected && (e.target.style.background='rgba(13,217,197,0.2)')} onMouseLeave={e => d && !isSelected && (e.target.style.background='rgba(255,255,255,0.02)')}>{d}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
