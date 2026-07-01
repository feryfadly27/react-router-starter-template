import type { Route } from "./+types/kuesioner.$step";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { DOMAINS, TOTAL_PERTANYAAN } from "../data/kuesioner";

export function meta({ params }: Route.MetaArgs) {
  const step = parseInt(params.step ?? "1");
  const domain = DOMAINS[step - 1];
  return [{ title: `${domain?.nama ?? "Kuesioner"} – RME RS Abdul Manap` }];
}

export default function KuesionerStep() {
  const { step } = useParams();
  const navigate = useNavigate();
  const stepNum = parseInt(step ?? "1");
  const domain = DOMAINS[stepNum - 1];

  const [jawaban, setJawaban] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    // Pastikan consent sudah diisi
    const consent = sessionStorage.getItem("consent_data");
    if (!consent) {
      navigate("/consent");
      return;
    }
    // Load jawaban yang sudah tersimpan
    const saved = sessionStorage.getItem("jawaban");
    if (saved) {
      setJawaban(JSON.parse(saved));
    }
  }, []);

  if (!domain) {
    return <div className="p-8 text-center text-red-500">Domain tidak ditemukan.</div>;
  }

  const totalDomains = DOMAINS.length;
  const pertanyaanSelesai = DOMAINS.slice(0, stepNum - 1).reduce((s, d) => s + d.pertanyaan.length, 0);
  const pertanyaanDiIsi = domain.pertanyaan.filter(p => jawaban[p.id] !== undefined).length;

  function handlePilih(idPertanyaan: number, nilai: number) {
    const updated = { ...jawaban, [idPertanyaan]: nilai };
    setJawaban(updated);
    sessionStorage.setItem("jawaban", JSON.stringify(updated));
    setErrors(prev => prev.filter(id => id !== idPertanyaan));
  }

  function handleNext() {
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
      navigate("/submit");
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

  const WARNA: Record<string, string> = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    yellow: "bg-yellow-500",
    red: "bg-red-600",
    orange: "bg-orange-500",
    teal: "bg-teal-600",
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-600",
    pink: "bg-pink-600",
    cyan: "bg-cyan-600",
  };

  const warnaBg = WARNA[domain.warna] ?? "bg-blue-600";
  const progressPersen = Math.round(((pertanyaanSelesai + pertanyaanDiIsi) / TOTAL_PERTANYAAN) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar global */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress keseluruhan</span>
            <span>{progressPersen}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${warnaBg} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progressPersen}%` }}
            />
          </div>
        </div>

        {/* Domain steps indicator */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {DOMAINS.map((d, i) => {
            const idx = i + 1;
            const isDone = idx < stepNum;
            const isCurrent = idx === stepNum;
            return (
              <div
                key={d.nama}
                className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium transition-all ${
                  isCurrent
                    ? `${warnaBg} text-white`
                    : isDone
                    ? "bg-gray-300 text-gray-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? "✓" : idx}. {d.nama}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
            ⚠️ Harap jawab semua pertanyaan yang ditandai sebelum melanjutkan.
          </div>
        )}

        {/* Card domain */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`${warnaBg} text-white px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Domain {stepNum} dari {totalDomains}</p>
                <h2 className="text-lg font-bold">{domain.nama}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">{pertanyaanDiIsi}/{domain.pertanyaan.length} dijawab</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {domain.pertanyaan.map((pertanyaan, idx) => {
              const isError = errors.includes(pertanyaan.id);
              const selected = jawaban[pertanyaan.id];

              return (
                <div
                  key={pertanyaan.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isError ? "border-red-300 bg-red-50" : "border-gray-100"
                  }`}
                >
                  <p className="font-medium text-gray-800 mb-1 text-sm">
                    <span className="text-gray-400 mr-2">#{pertanyaan.id}</span>
                    {pertanyaan.teks}
                    {isError && <span className="ml-2 text-red-500 text-xs">* wajib dijawab</span>}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">Pilih satu jawaban yang paling sesuai</p>

                  <div className="space-y-2">
                    {pertanyaan.pilihan.map(p => (
                      <button
                        key={p.nilai}
                        type="button"
                        onClick={() => handlePilih(pertanyaan.id, p.nilai)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                          selected === p.nilai
                            ? `${warnaBg} border-transparent text-white`
                            : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs font-bold flex-shrink-0 ${
                          selected === p.nilai ? "bg-white/20" : "bg-gray-100"
                        }`}>
                          {p.nilai}
                        </span>
                        {p.teks}
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
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              ← Sebelumnya
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`flex-1 ${warnaBg} hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold transition-all`}
            >
              {stepNum < totalDomains ? "Selanjutnya →" : "Selesai & Kirim →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
