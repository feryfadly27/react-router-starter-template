import type { Route } from "./+types/kuesioner.$step";
import { useNavigate, useParams, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { DOMAINS, TOTAL_PERTANYAAN } from "../data/kuesioner";

export function meta({ params }: Route.MetaArgs) {
  const step = parseInt(params.step ?? "1");
  const domain = DOMAINS[step - 1];
  return [{ title: `${domain?.nama ?? "Kuesioner"} – RME` }];
}

export default function KuesionerStep() {
  const { step } = useParams();
  const navigate = useNavigate();
  const stepNum = parseInt(step ?? "1");
  const domain = DOMAINS[stepNum - 1];

  const [jawaban, setJawaban] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<number[]>([]);
  const fetcher = useFetcher<{ id: number }>();
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    const consent = sessionStorage.getItem("consent_data");
    if (!consent) { navigate("/consent"); return; }
    const saved = sessionStorage.getItem("jawaban");
    if (saved) setJawaban(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.id) {
      sessionStorage.removeItem("consent_data");
      sessionStorage.removeItem("jawaban");
      navigate("/terima-kasih");
    }
  }, [fetcher.state, fetcher.data]);

  if (!domain) {
    return <div className="p-8 text-center" style={{ color: "#fb2c36" }}>Domain tidak ditemukan.</div>;
  }

  const totalDomains = DOMAINS.length;
  const pertanyaanSelesai = DOMAINS.slice(0, stepNum - 1).reduce((s, d) => s + d.pertanyaan.length, 0);
  const pertanyaanDiIsi = domain.pertanyaan.filter(p => jawaban[p.id] !== undefined).length;
  const progressPersen = Math.round(((pertanyaanSelesai + pertanyaanDiIsi) / TOTAL_PERTANYAAN) * 100);

  function handlePilih(idPertanyaan: number, nilai: number) {
    const updated = { ...jawaban, [idPertanyaan]: nilai };
    setJawaban(updated);
    sessionStorage.setItem("jawaban", JSON.stringify(updated));
    setErrors(prev => prev.filter(id => id !== idPertanyaan));
  }

  async function handleNext() {
    const belumDiisi = domain.pertanyaan
      .filter(p => jawaban[p.id] === undefined)
      .map(p => p.id);

    if (belumDiisi.length > 0) {
      setErrors(belumDiisi);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (stepNum < totalDomains) {
      navigate(`/kuesioner/${stepNum + 1}`);
      window.scrollTo(0, 0);
    } else {
      const consentRaw = sessionStorage.getItem("consent_data");
      if (!consentRaw) { navigate("/consent"); return; }
      const consent = JSON.parse(consentRaw);

      const fd = new FormData();
      fd.append("nama",          consent.nama);
      fd.append("tanggal_lahir", consent.tanggal_lahir);
      fd.append("jenis_kelamin", consent.jenis_kelamin);
      fd.append("pekerjaan",     consent.pekerjaan);
      fd.append("jabatan",       consent.jabatan);
      fd.append("pendidikan",    consent.pendidikan ?? "");
      fd.append("masa_kerja",    consent.masa_kerja ?? "");
      fd.append("frekuensi_rme", consent.frekuensi_rme ?? "");
      fd.append("nomor_hp",      consent.nomor_hp);
      fd.append("bersedia",      consent.bersedia);
      for (let i = 1; i <= 27; i++) {
        fd.append(`q${i}`, String(jawaban[i] ?? 0));
      }
      // Kirim tanda tangan sebagai dataURL teks biasa (paling andal lintas browser).
      // Server yang akan men-decode base64 dan mengunggahnya ke R2.
      const sigDataUrl = sessionStorage.getItem("tanda_tangan");
      if (sigDataUrl && sigDataUrl.startsWith("data:")) {
        fd.append("tanda_tangan_data", sigDataUrl);
      }
      fetcher.submit(fd, { method: "post", action: "/submit" });
    }
  }

  function handlePrev() {
    if (stepNum > 1) {
      navigate(`/kuesioner/${stepNum - 1}`);
      window.scrollTo(0, 0);
    } else {
      navigate("/consent");
    }
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: "#fcfaf7" }}>
      {/* Shell header */}
      <header
        className="h-16 flex items-center px-6 sticky top-0 z-10"
        style={{
          background: "rgba(0,0,0,0.70)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "#fe6e00" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>Domain {stepNum}/{totalDomains}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>·</span>
              <span className="text-white text-xs font-medium">{domain.nama}</span>
            </div>
          </div>
        </div>
        {/* Progress in header */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: "#fe6e00" }}>{progressPersen}%</span>
          <div
            className="w-24 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPersen}%`, background: "#fe6e00" }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Domain step pills */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {DOMAINS.map((d, i) => {
            const idx = i + 1;
            const isDone = idx < stepNum;
            const isCurrent = idx === stepNum;
            return (
              <div
                key={d.nama}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                style={
                  isCurrent
                    ? { background: "#fe6e00", color: "#ffffff" }
                    : isDone
                    ? { background: "#e3e0dd", color: "#797067" }
                    : { background: "#f3f4f6", color: "#797067", opacity: 0.6 }
                }
              >
                {isDone ? "✓" : idx}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {errors.length > 0 && (
          <div
            className="rounded-lg p-4 mb-4 text-sm flex items-center gap-2"
            style={{ background: "#fff0f0", border: "1px solid #fecaca", color: "#fb2c36" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Harap jawab semua pertanyaan yang ditandai sebelum melanjutkan.
          </div>
        )}

        {/* Main card */}
        <div
          className="rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e3e0dd" }}
        >
          {/* Domain header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#fe6e00" }}>
            <div>
              <p className="text-xs text-white/70">Domain {stepNum} dari {totalDomains}</p>
              <h2 className="text-base font-bold text-white">{domain.nama}</h2>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.20)", color: "#ffffff" }}
            >
              {pertanyaanDiIsi}/{domain.pertanyaan.length} dijawab
            </div>
          </div>

          {/* Questions */}
          <div className="p-6 space-y-6">
            {domain.pertanyaan.map((pertanyaan) => {
              const isError = errors.includes(pertanyaan.id);
              const selected = jawaban[pertanyaan.id];

              return (
                <div
                  key={pertanyaan.id}
                  className="rounded-lg p-4 transition-all"
                  style={{
                    border: isError ? "2px solid #fb2c36" : "2px solid #e3e0dd",
                    background: isError ? "#fff0f0" : "#ffffff",
                  }}
                >
                  <p className="font-medium text-sm mb-1" style={{ color: "#423d38" }}>
                    <span className="mr-2 text-xs font-normal" style={{ color: "#797067" }}>#{pertanyaan.id}</span>
                    {pertanyaan.teks}
                    {isError && (
                      <span className="ml-2 text-xs font-semibold" style={{ color: "#fb2c36" }}>* wajib</span>
                    )}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "#797067" }}>Pilih satu jawaban yang paling sesuai</p>

                  <div className="space-y-2">
                    {pertanyaan.pilihan.map(p => (
                      <button
                        key={p.nilai}
                        type="button"
                        onClick={() => handlePilih(pertanyaan.id, p.nilai)}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3"
                        style={
                          selected === p.nilai
                            ? { background: "#fe6e00", border: "2px solid #fe6e00", color: "#ffffff" }
                            : { background: "#ffffff", border: "2px solid #e3e0dd", color: "#423d38" }
                        }
                        onMouseEnter={e => {
                          if (selected !== p.nilai) {
                            e.currentTarget.style.borderColor = "#fe6e00";
                          }
                        }}
                        onMouseLeave={e => {
                          if (selected !== p.nilai) {
                            e.currentTarget.style.borderColor = "#e3e0dd";
                          }
                        }}
                      >
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0"
                          style={
                            selected === p.nilai
                              ? { background: "rgba(255,255,255,0.25)", color: "#ffffff" }
                              : { background: "#f3f4f6", color: "#797067" }
                          }
                        >
                          {p.nilai}
                        </span>
                        <span>{p.teks}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{ border: "1px solid #d1d5dc", color: "#797067", background: "#ffffff" }}
            >
              ← Sebelumnya
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-70"
              style={{ background: isSubmitting ? "#d1d5dc" : "#fe6e00" }}
            >
              {isSubmitting
                ? "Menyimpan..."
                : stepNum < totalDomains
                ? "Selanjutnya →"
                : "Kirim Jawaban ✓"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
