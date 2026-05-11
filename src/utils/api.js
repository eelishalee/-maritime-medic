const API_BASE = 'http://localhost:4000/api';

export async function fetchCrew() {
  const res = await fetch(`${API_BASE}/crew`);
  return res.json();
}

export async function fetchCrewById(crewId) {
  const res = await fetch(`${API_BASE}/crew/${crewId}`);
  return res.json();
}

export async function fetchLatestVitals() {
  const res = await fetch(`${API_BASE}/vital/latest`);
  return res.json();
}

export async function fetchLatestVital(crewId) {
  const res = await fetch(`${API_BASE}/vital/latest/${crewId}`);
  return res.json();
}

export async function fetchVitalHistory(crewId, limit = 50) {
  const res = await fetch(`${API_BASE}/vital/history/${crewId}?limit=${limit}`);
  return res.json();
}

export async function fetchAnalysis(crewId) {
  const res = await fetch(`${API_BASE}/analysis/${crewId}`);
  return res.json();
}

// DB crew 데이터를 프론트엔드 형식으로 변환
export function mapCrewToFrontend(dbCrew) {
  const birthDate = new Date(dbCrew.birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  return {
    id: `S26-${String(dbCrew.crew_id).padStart(3, '0')}`,
    crewDbId: dbCrew.crew_id,
    name: dbCrew.name,
    age,
    role: dbCrew.position,
    dept: dbCrew.department,
    blood: dbCrew.bloodtype,
    chronic: dbCrew.underlying_disease || '없음',
    allergies: dbCrew.allergy || '없음',
    contact: dbCrew.phone || '',
    emergencyName: dbCrew.guardian_name || '',
    emergency: dbCrew.emergency_contact || '',
    avatar: dbCrew.photo_path || null,
    isEmergency: false,
    height: dbCrew.height ? Number(dbCrew.height) : null,
    weight: dbCrew.weight ? Number(dbCrew.weight) : null,
    boardingDate: dbCrew.joined_at ? new Date(dbCrew.joined_at).toISOString().split('T')[0] : '',
    location: '',
    pastHistory: dbCrew.medical_history || '',
    dob: birthDate.toISOString().split('T')[0],
    gender: dbCrew.gender === 'M' ? '남' : '여',
    lastMed: dbCrew.recent_medication || '',
    note: '',
  };
}

// DB vital 데이터를 프론트엔드 형식으로 변환
// 센서에서 측정되지 않은 값(0)은 '-'로 표시
export function mapVitalToFrontend(dbVital) {
  if (!dbVital) return { hr: '-', spo2: '-', temp: '-', bp: '-', rr: '-' };
  const temp = dbVital.temperature ? Number(dbVital.temperature) : 0;
  return {
    hr: dbVital.heart_rate && dbVital.heart_rate !== 0 ? dbVital.heart_rate.toString() : '-',
    spo2: dbVital.spo2 && dbVital.spo2 !== 0 ? dbVital.spo2.toString() : '-',
    temp: temp && temp !== 0 ? temp.toFixed(1) : '-',
    bp: dbVital.blood_pressure && dbVital.blood_pressure !== '0' && dbVital.blood_pressure !== '' ? dbVital.blood_pressure : '-',
    rr: dbVital.respiration_rate && dbVital.respiration_rate !== 0 ? dbVital.respiration_rate.toString() : '-',
  };
}

// 웹에서 수정한 바이탈(혈압/체온)을 서버에 저장
export async function updateVital(crewId, vitalData) {
  const res = await fetch(`${API_BASE}/vital`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crew_id: crewId, ...vitalData }),
  });
  return res.json();
}
