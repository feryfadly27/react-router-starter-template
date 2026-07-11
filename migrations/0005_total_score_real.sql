-- Ubah tipe kolom total_score dari INTEGER menjadi REAL agar dapat menyimpan
-- skor rata-rata desimal (mis. 3.41) secara konsisten sesuai skema.
-- SQLite tidak mendukung ALTER COLUMN, jadi tabel dibangun ulang.

PRAGMA foreign_keys=OFF;

CREATE TABLE responses_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  nama TEXT NOT NULL,
  tanggal_lahir TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  pekerjaan TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  bersedia INTEGER NOT NULL DEFAULT 1,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER,
  q5 INTEGER, q6 INTEGER, q7 INTEGER, q8 INTEGER,
  q9 INTEGER, q10 INTEGER, q11 INTEGER, q12 INTEGER,
  q13 INTEGER, q14 INTEGER, q15 INTEGER, q16 INTEGER,
  q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER,
  q25 INTEGER, q26 INTEGER, q27 INTEGER,
  total_score REAL,
  kategori TEXT,
  tanda_tangan_url TEXT
);

INSERT INTO responses_new
  SELECT
    id, created_at, nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan,
    nomor_hp, bersedia,
    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14,
    q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27,
    total_score, kategori, tanda_tangan_url
  FROM responses;

DROP TABLE responses;
ALTER TABLE responses_new RENAME TO responses;

PRAGMA foreign_keys=ON;
