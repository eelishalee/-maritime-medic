-- 라즈베리파이 로컬 DB 초기 설정
-- 실행: mysql -u root -p < setup_local_db.sql

CREATE DATABASE IF NOT EXISTS mdts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mdts;

-- 선원 테이블 (서버에서 동기화됨)
CREATE TABLE IF NOT EXISTS tb_crew (
  crew_id          INT PRIMARY KEY,
  name             VARCHAR(50) NOT NULL,
  photo_path       VARCHAR(255),
  birthdate        DATE NOT NULL,
  gender           CHAR(1) NOT NULL,
  bloodtype        VARCHAR(10) NOT NULL,
  height           DECIMAL(5,2),
  weight           DECIMAL(5,2),
  department       VARCHAR(100),
  position         VARCHAR(50) NOT NULL,
  joined_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  underlying_disease TEXT,
  allergy          TEXT,
  recent_medication TEXT,
  medical_history  TEXT,
  phone            VARCHAR(20),
  guardian_name    VARCHAR(50),
  emergency_contact VARCHAR(100),
  INDEX idx_name (name)
);

-- 바이탈 테이블 (센서 → 로컬 → 서버)
CREATE TABLE IF NOT EXISTS tb_vital (
  vital_id     INT AUTO_INCREMENT PRIMARY KEY,
  crew_id      INT NOT NULL,
  heart_rate   INT DEFAULT 0,
  spo2         INT DEFAULT 0,
  respiration_rate INT DEFAULT 0,
  blood_pressure   VARCHAR(10) DEFAULT '0',
  temperature  DECIMAL(5,2) DEFAULT 0.00,
  measured_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced       TINYINT(1) DEFAULT 0,
  INDEX idx_crew (crew_id),
  INDEX idx_measured (measured_at),
  INDEX idx_synced (synced)
);

-- 분석 결과 테이블 (젯슨나노 → 로컬 → 서버)
CREATE TABLE IF NOT EXISTS tb_analysis (
  analysis_id    INT AUTO_INCREMENT PRIMARY KEY,
  vital_id       INT NOT NULL,
  crew_id        INT NOT NULL,
  analysis_result TEXT NOT NULL,
  diagnosis      VARCHAR(255) NOT NULL,
  file_name      VARCHAR(255) NOT NULL,
  file_size      INT NOT NULL,
  file_ext       VARCHAR(10) NOT NULL,
  risk_level     ENUM('1','2','3','4') NOT NULL,
  analyzed_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced         TINYINT(1) DEFAULT 0,
  INDEX idx_crew (crew_id),
  INDEX idx_synced (synced)
);
