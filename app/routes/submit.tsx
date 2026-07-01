import type { Route } from "./+types/submit";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { DOMAINS, hitungKategori } from "../data/kuesioner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Konfirmasi & Kirim – Kuesioner RME" }];
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const body = (await request.json()) as any;

  const { nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan, nomor_hp, bersedia, jawaban } = body;

  let totalScore = 0;
  const qValues: Record<string, number> = {};
  for (let i = 1; i <= 27; i++) {
    const val = jawaban[i] ?? 0;
    qValues[`q${i}`] = val;
    totalScore += val;
  }
  const rataRata = totalScore / 27;
  const kategori = hitungKategori(rataRata).label;

  const result = await db
    .prepare(
      `INSERT INTO responses (
        nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan, nomor_hp, bersedia,
        q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,
        q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25,q26,q27,
        total_score, kategori
      ) VALUES (
        ?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,?,?,?,
        ?,?
      )`
    )
    .bind(
      nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan, nomor_hp, bersedia ? 1 : 0,
      ...Array.from({ length: 27 }, (_, i) => qValues[`q${i + 1}`]),
      Math.round(rataRata * 100) / 100,
      kategori
    )
    .run();

  return Response.json({ id: result.meta?.last_row_id ?? 0 });
}

export default function Submit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ringkasan, setRingkasan] = useState<{ nama: string; skor: number }[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("jawaban");
    if (!raw) return;
    const jawaban = JSON.parse(raw);
    const r = DOMAINS.map(d => {
      const total = d.pertanyaan.reduce((s, p) => s + (jawaban[p.id] ?? 0), 0);
      const rata = total / d.pertanyaan.length;
      return { nama: d.nama, skor: Math.round(rata * 100) / 100 };
    });
    setRingkasan(r);

    // Cek consent
    const consent = sessionStorage.getItem("consent_data");
    if (!consent) navigate("/consent");
  }, []);

  async function handleSubmit() {
    const consentRaw = sessionStorage.getItem("consent_data");
    const jawabanRaw = sessionStorage.getItem("jawaban");

    if (!consentRaw || !jawabanRaw) {
      navigate("/consent");
      return;
    }

    const consent = JSON.parse(consentRaw);
    const jawaban = JSON.parse(jawabanRaw);

    const allIds = DOMAINS.flatMap(d => d.pertanyaan.map(p => p.id));
    const missing = allIds.filter(id => jawaban[id] === undefined);
    if (missing.length > 0) {
      setError(`Masih ada ${missing.length} pertanyaan yang belum dijawab. Harap kembali dan lengkapi.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...consent,
          bersedia: consent.bersedia === "1",
          jawaban,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      const data = (await res.json()) as { id: number };

      sessionStorage.removeItem("consent_data");
      sessionStorage.removeItem("jawaban");

      navigate(`/hasil/${data.id}`);
    } catch (e: any) {
      setError(e.message ?? "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white px-6 py-5 text-center">
            <div className="text-4xl mb-2">✓</div>
            <h1 className="text-xl font-bold">Semua Pertanyaan Telah Dijawab</h1>
            <p className="text-green-100 text-sm mt-1">Silakan tinjau ringkasan dan kirim jawaban Anda</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            <h2 className="font-semibold text-gray-700 mb-3">Ringkasan Skor per Domain</h2>
            <div className="space-y-2 mb-6">
              {ringkasan.map(r => {
                const kat = hitungKategori(r.skor);
                return (
                  <div key={r.nama} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{r.nama}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-800">{r.skor.toFixed(2)}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          kat.warna === "red"
                            ? "bg-red-100 text-red-700"
                            : kat.warna === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {kat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 mb-6 text-center">
              Dengan mengklik "Kirim Jawaban", data Anda akan disimpan secara permanen.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/kuesioner/${DOMAINS.length}`)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                ← Tinjau Ulang
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                {loading ? "Menyimpan..." : "Kirim Jawaban ✓"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
