import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── DB 연결 풀 ──
const pool = mysql.createPool({
  host: 'project-db-campus.smhrd.com',
  port: 3307,
  user: 'MDTS',
  password: '12345',
  database: 'MDTS',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// ── 선원 전체 조회 ──
app.get('/api/crew', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tb_crew ORDER BY crew_id');
  res.json(rows);
});

// ── 선원 단일 조회 ──
app.get('/api/crew/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tb_crew WHERE crew_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// ── 최신 바이탈 조회 (선원별) ──
app.get('/api/vital/latest/:crewId', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM tb_vital WHERE crew_id = ? ORDER BY measured_at DESC LIMIT 1',
    [req.params.crewId]
  );
  res.json(rows[0] || null);
});

// ── 전체 선원 최신 바이탈 한번에 조회 ──
app.get('/api/vital/latest', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT v.* FROM tb_vital v
    INNER JOIN (
      SELECT crew_id, MAX(measured_at) AS max_at
      FROM tb_vital GROUP BY crew_id
    ) latest ON v.crew_id = latest.crew_id AND v.measured_at = latest.max_at
    ORDER BY v.crew_id
  `);
  res.json(rows);
});

// ── 바이탈 이력 조회 ──
app.get('/api/vital/history/:crewId', async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const [rows] = await pool.query(
    'SELECT * FROM tb_vital WHERE crew_id = ? ORDER BY measured_at DESC LIMIT ?',
    [req.params.crewId, limit]
  );
  res.json(rows);
});

// ── 바이탈 데이터 저장 (단건) ──
app.post('/api/vital', async (req, res) => {
  const { crew_id, heart_rate, spo2, respiration_rate, blood_pressure, temperature } = req.body;
  const [result] = await pool.query(
    `INSERT INTO tb_vital (crew_id, heart_rate, spo2, respiration_rate, blood_pressure, temperature)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [crew_id, heart_rate || 0, spo2 || 0, respiration_rate || 0, blood_pressure || '0', temperature || 0]
  );
  res.json({ vital_id: result.insertId });
});

// ── 바이탈 데이터 일괄 저장 (라즈베리파이 동기화용) ──
app.post('/api/vital/bulk', async (req, res) => {
  const records = req.body;
  if (!Array.isArray(records) || !records.length) {
    return res.status(400).json({ error: 'Array of records required' });
  }
  const values = records.map(r => [
    r.crew_id, r.heart_rate || 0, r.spo2 || 0,
    r.respiration_rate || 0, r.blood_pressure || '0', r.temperature || 0,
    r.measured_at || null
  ]);
  const [result] = await pool.query(
    `INSERT INTO tb_vital (crew_id, heart_rate, spo2, respiration_rate, blood_pressure, temperature, measured_at)
     VALUES ?`,
    [values]
  );
  res.json({ inserted: result.affectedRows });
});

// ── 분석 결과 조회 ──
app.get('/api/analysis/:crewId', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM tb_analysis WHERE crew_id = ? ORDER BY analyzed_at DESC LIMIT 10',
    [req.params.crewId]
  );
  res.json(rows);
});

// ── 분석 결과 저장 ──
app.post('/api/analysis', async (req, res) => {
  const { vital_id, crew_id, analysis_result, diagnosis, file_name, file_size, file_ext, risk_level } = req.body;
  const [result] = await pool.query(
    `INSERT INTO tb_analysis (vital_id, crew_id, analysis_result, diagnosis, file_name, file_size, file_ext, risk_level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [vital_id, crew_id, analysis_result, diagnosis, file_name, file_size, file_ext, risk_level]
  );
  res.json({ analysis_id: result.insertId });
});

// ── 응급처치 기록 조회 ──
app.get('/api/firstaid/:crewId', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM tb_firstaid WHERE crew_id = ? ORDER BY created_at DESC',
    [req.params.crewId]
  );
  res.json(rows);
});

// ── 응급처치 기록 저장 ──
app.post('/api/firstaid', async (req, res) => {
  const { analysis_id, crew_id, guide_text, action_taken } = req.body;
  const [result] = await pool.query(
    `INSERT INTO tb_firstaid (analysis_id, crew_id, guide_text, action_taken) VALUES (?, ?, ?, ?)`,
    [analysis_id, crew_id, guide_text, action_taken]
  );
  res.json({ firstaid_id: result.insertId });
});

// ── 서버 시작 ──
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`MDTS API server running on http://localhost:${PORT}`);
});
