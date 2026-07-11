import type { Route } from "./+types/consent";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lembar Persetujuan – Kuesioner RME" }];
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors ${
    hasError
      ? "border-red-400 bg-red-50"
      : "border-[#d1d5dc] bg-white focus:border-[#fe6e00] focus:ring-2 focus:ring-[#fe6e00]/20"
  }`;

// ── Modal Kanvas Tanda Tangan ───────────────────────────────────────────────────
function SignatureModal({
  onSave,
  onClose,
}: {
  onSave: (dataUrl: string | null) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const isEmpty = useRef(true);
  const [empty, setEmpty] = useState(true);

  function getPos(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#423d38";

    function start(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      drawing.current = true;
      const { x, y } = getPos(e, canvas!);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    function move(e: MouseEvent | TouchEvent) {
      if (!drawing.current) return;
      e.preventDefault();
      const { x, y } = getPos(e, canvas!);
      ctx.lineTo(x, y);
      ctx.stroke();
      if (isEmpty.current) {
        isEmpty.current = false;
        setEmpty(false);
      }
    }
    function end() {
      if (!drawing.current) return;
      drawing.current = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, []);

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isEmpty.current = true;
    setEmpty(true);
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty.current) {
      onSave(null);
    } else {
      onSave(canvas.toDataURL("image/png"));
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl flex flex-col overflow-hidden"
        style={{ boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-3" style={{ borderBottom: "1px solid #e3e0dd" }}>
          <h3 className="text-base font-bold" style={{ color: "#423d38" }}>Buat Tanda Tangan</h3>
          <p className="text-xs mt-0.5" style={{ color: "#797067" }}>
            Gunakan mouse, trackpad, atau jari untuk menandatangani pada area di bawah.
          </p>
        </div>

        <div className="p-5">
          <div className="relative rounded-lg overflow-hidden" style={{ border: "2px solid #d1d5dc", background: "#ffffff" }}>
            <canvas
              ref={canvasRef}
              width={900}
              height={360}
              className="w-full block touch-none"
              style={{ cursor: "crosshair", aspectRatio: "900 / 360" }}
            />
            {empty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ color: "#d1d5dc" }}>
                <div className="text-center">
                  <svg className="w-10 h-10 mx-auto mb-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <p className="text-sm">Tanda tangan di sini</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            type="button"
            onClick={handleClear}
            className="font-medium text-sm rounded-lg h-10 px-4 transition-colors"
            style={{ color: "#797067", border: "1px solid #e3e0dd" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Bersihkan
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="font-medium text-sm rounded-lg h-10 px-4 transition-colors order-2 sm:order-none"
            style={{ color: "#797067", border: "1px solid #e3e0dd" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="font-semibold text-sm text-white rounded-lg h-10 px-5 transition-colors order-1 sm:order-none"
            style={{ background: "#fe6e00" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
          >
            Simpan Tanda Tangan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Signature Pad (tombol + preview, kanvas di modal) ───────────────────────────
function SignaturePad({
  value,
  onChange,
  error,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {value ? (
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ border: error ? "2px solid #fb2c36" : "2px solid #d1d5dc", background: "#ffffff" }}
        >
          <img src={value} alt="Tanda tangan" className="w-full block" style={{ height: "160px", objectFit: "contain" }} />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ background: "rgba(0,0,0,0.06)", color: "#797067" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
            >
              Ubah
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ background: "rgba(0,0,0,0.06)", color: "#797067" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-lg transition-colors"
          style={{
            height: "160px",
            border: error ? "2px dashed #fb2c36" : "2px dashed #d1d5dc",
            background: "#ffffff",
            color: "#797067",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#fcfaf7")}
          onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
        >
          <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-sm font-medium">Ketuk untuk membuka kanvas tanda tangan</span>
        </button>
      )}
      {error && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{error}</p>}

      {open && <SignatureModal onSave={onChange} onClose={() => setOpen(false)} />}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Consent() {
  const navigate = useNavigate();
  const [bersedia, setBersedia] = useState<boolean | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};

    if (!fd.get("nama")) errs.nama = "Nama wajib diisi";
    if (!fd.get("tanggal_lahir")) errs.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!fd.get("jenis_kelamin")) errs.jenis_kelamin = "Jenis kelamin wajib dipilih";
    if (!fd.get("pekerjaan")) errs.pekerjaan = "Pekerjaan wajib diisi";
    if (!fd.get("jabatan")) errs.jabatan = "Jabatan wajib diisi";
    if (!fd.get("pendidikan")) errs.pendidikan = "Pendidikan terakhir wajib dipilih";
    if (!fd.get("masa_kerja")) errs.masa_kerja = "Masa kerja wajib dipilih";
    if (!fd.get("frekuensi_rme")) errs.frekuensi_rme = "Frekuensi penggunaan RME wajib dipilih";
    if (!fd.get("nomor_hp")) errs.nomor_hp = "Nomor HP wajib diisi";
    if (bersedia === null) errs.bersedia = "Pilihan persetujuan wajib ditentukan";
    if (!signature) errs.tanda_tangan = "Tanda tangan wajib diisi";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      nama: fd.get("nama") as string,
      tanggal_lahir: fd.get("tanggal_lahir") as string,
      jenis_kelamin: fd.get("jenis_kelamin") as string,
      pekerjaan: fd.get("pekerjaan") as string,
      jabatan: fd.get("jabatan") as string,
      pendidikan: fd.get("pendidikan") as string,
      masa_kerja: fd.get("masa_kerja") as string,
      frekuensi_rme: fd.get("frekuensi_rme") as string,
      nomor_hp: fd.get("nomor_hp") as string,
      bersedia: bersedia ? "1" : "0",
    };

    sessionStorage.setItem("consent_data", JSON.stringify(data));
    if (signature) {
      sessionStorage.setItem("tanda_tangan", signature);
    }

    if (!bersedia) {
      navigate("/terima-kasih");
    } else {
      navigate("/kuesioner/1");
    }
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#fcfaf7" }}>
      {/* Shell nav */}
      <nav
        className="fixed top-0 left-0 right-0 h-16 flex items-center px-6 z-10"
        style={{
          background: "rgba(0,0,0,0.70)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <a href="/" className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.70)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Beranda</span>
        </a>
        <span className="ml-4 text-sm font-medium" style={{ color: "#ffffff" }}>Lembar Persetujuan</span>
      </nav>

      <div className="max-w-3xl mx-auto mt-20">
        <div
          className="rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e3e0dd" }}
        >
          {/* Header */}
          <div className="px-8 py-6" style={{ background: "#fe6e00" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Informed Consent</p>
            <h1 className="text-lg font-bold text-white">LEMBAR PERSETUJUAN MENJADI INFORMAN</h1>
          </div>

          <div className="p-8">
            {/* Pernyataan */}
            <div
              className="rounded-lg p-5 mb-7"
              style={{ background: "#fcfaf7", border: "1px solid #e3e0dd" }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: "#423d38" }}>
                Yang bertanda tangan di bawah ini menyatakan bahwa:
              </p>
              <ol className="space-y-2 text-sm" style={{ color: "#797067" }}>
                {[
                  "Saya telah mendapat informasi dan mendengarkan persiapan penelitian dari peneliti tentang tujuan, manfaat serta prosedur penelitian dan saya memahami penjelasan tersebut.",
                  "Saya mengerti bahwa penelitian ini menjunjung tinggi hak-hak saya sebagai informan.",
                  "Saya mempunyai hak untuk berhenti berpartisipasi jika suatu saat saya merasa keberatan atau ada hal yang membuat saya merasa tidak nyaman dan tidak dapat melakukannya.",
                  "Saya sangat memahami bahwa keikutsertaan saya menjadi informan sangat besar manfaatnya bagi peningkatan ilmu pengetahuan terutama dalam ilmu kesehatan.",
                  "Saya memahami bahwa seluruh data dan identitas yang saya berikan akan dijaga kerahasiaannya oleh peneliti, hanya digunakan untuk kepentingan penelitian, dan tidak akan mempengaruhi status pekerjaan saya.",
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: "#fe6e00" }}
                    >
                      {i + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Catatan kerahasiaan */}
            <div
              className="rounded-lg p-4 mb-5 flex gap-3"
              style={{ background: "rgba(254,110,0,0.06)", border: "1px solid #fed7aa" }}
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fe6e00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm" style={{ color: "#423d38" }}>
                Seluruh data dan identitas yang Anda isikan akan{" "}
                <strong>dijaga kerahasiaannya oleh peneliti</strong>, hanya digunakan untuk
                kepentingan penelitian, dan <strong>tidak akan mempengaruhi status pekerjaan</strong> Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Nama Lengkap <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Contoh: Ahmad Budi"
                    className={inputClass(!!errors.nama)}
                    style={{ color: "#423d38" }}
                  />
                  {errors.nama && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.nama}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Tanggal Lahir <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    className={inputClass(!!errors.tanggal_lahir)}
                    style={{ color: "#423d38" }}
                  />
                  {errors.tanggal_lahir && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.tanggal_lahir}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Jenis Kelamin <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <select
                    name="jenis_kelamin"
                    className={inputClass(!!errors.jenis_kelamin)}
                    style={{ color: "#423d38" }}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.jenis_kelamin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Pekerjaan <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="pekerjaan"
                    placeholder="Contoh: Perekam Medis"
                    className={inputClass(!!errors.pekerjaan)}
                    style={{ color: "#423d38" }}
                  />
                  {errors.pekerjaan && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.pekerjaan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Jabatan <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    placeholder="Contoh: Kepala Instalasi RM"
                    className={inputClass(!!errors.jabatan)}
                    style={{ color: "#423d38" }}
                  />
                  {errors.jabatan && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.jabatan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Pendidikan Terakhir <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <select
                    name="pendidikan"
                    className={inputClass(!!errors.pendidikan)}
                    style={{ color: "#423d38" }}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="D4/S1">D4/S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                  {errors.pendidikan && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.pendidikan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Masa Kerja <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <select
                    name="masa_kerja"
                    className={inputClass(!!errors.masa_kerja)}
                    style={{ color: "#423d38" }}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="< 1 tahun">&lt; 1 tahun</option>
                    <option value="1-5 tahun">1–5 tahun</option>
                    <option value="6-10 tahun">6–10 tahun</option>
                    <option value="> 10 tahun">&gt; 10 tahun</option>
                  </select>
                  {errors.masa_kerja && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.masa_kerja}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Frekuensi Penggunaan RME <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <select
                    name="frekuensi_rme"
                    className={inputClass(!!errors.frekuensi_rme)}
                    style={{ color: "#423d38" }}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Tidak menggunakan">Tidak menggunakan</option>
                    <option value="< 1 jam/hari">&lt; 1 jam/hari</option>
                    <option value="1-3 jam/hari">1–3 jam/hari</option>
                    <option value="4-6 jam/hari">4–6 jam/hari</option>
                    <option value="> 6 jam/hari">&gt; 6 jam/hari</option>
                  </select>
                  {errors.frekuensi_rme && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.frekuensi_rme}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#423d38" }}>
                    Nomor Handphone <span style={{ color: "#fb2c36" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomor_hp"
                    placeholder="Contoh: 08xxxxxxxxxx"
                    className={inputClass(!!errors.nomor_hp)}
                    style={{ color: "#423d38" }}
                  />
                  {errors.nomor_hp && <p className="text-xs mt-1" style={{ color: "#fb2c36" }}>{errors.nomor_hp}</p>}
                </div>
              </div>

              {/* Persetujuan */}
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: "#423d38" }}>
                  Dengan pertimbangan tersebut, saya memutuskan secara sukarela:{" "}
                  <span style={{ color: "#fb2c36" }}>*</span>
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBersedia(true)}
                    className="flex-1 h-10 rounded-md border-2 font-semibold text-sm transition-all"
                    style={
                      bersedia === true
                        ? { background: "#fe6e00", borderColor: "#fe6e00", color: "#ffffff" }
                        : { background: "transparent", borderColor: "#e3e0dd", color: "#423d38" }
                    }
                  >
                    ✓ Bersedia
                  </button>
                  <button
                    type="button"
                    onClick={() => setBersedia(false)}
                    className="flex-1 h-10 rounded-md border-2 font-semibold text-sm transition-all"
                    style={
                      bersedia === false
                        ? { background: "#fb2c36", borderColor: "#fb2c36", color: "#ffffff" }
                        : { background: "transparent", borderColor: "#e3e0dd", color: "#423d38" }
                    }
                  >
                    ✗ Tidak Bersedia
                  </button>
                </div>
                {errors.bersedia && <p className="text-xs mt-2" style={{ color: "#fb2c36" }}>{errors.bersedia}</p>}
              </div>

              {/* Tanda Tangan */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#423d38" }}>
                  Tanda Tangan <span style={{ color: "#fb2c36" }}>*</span>
                </label>
                <SignaturePad value={signature} onChange={setSignature} error={errors.tanda_tangan} />
                <p className="text-xs mt-1.5" style={{ color: "#797067" }}>
                  Kanvas akan terbuka lebih besar agar lebih leluasa menandatangani
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <a
                  href="/"
                  className="flex-1 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors"
                  style={{ borderColor: "#d1d5dc", color: "#797067" }}
                >
                  ← Kembali
                </a>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-md text-sm font-semibold text-white transition-colors"
                  style={{ background: "#fe6e00" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
                >
                  Lanjutkan →
                </button>
              </div>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: "#797067" }}>
              Peneliti: Fery Fadly, SKM., MKM — Mei 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
