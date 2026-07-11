-- Tambah kolom demografi informan pada lembar persetujuan:
-- pendidikan terakhir, masa kerja, dan frekuensi penggunaan RME (jam/hari).
-- Kolom "nama" yang sudah ada kini diisi Nama Lengkap (bukan inisial).

ALTER TABLE responses ADD COLUMN pendidikan TEXT;
ALTER TABLE responses ADD COLUMN masa_kerja TEXT;
ALTER TABLE responses ADD COLUMN frekuensi_rme TEXT;
