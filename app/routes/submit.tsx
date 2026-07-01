import type { Route } from "./+types/submit";
import { useNavigate, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { DOMAINS, hitungKategori } from "../data/kuesioner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Konfirmasi & Kirim – Kuesioner RME" }];
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const fd = await request.formData();

  const nama         = fd.get("nama") as string;
  const tanggal_lahir = fd.get("tanggal_lahir") as string;
  const jenis_kelamin = fd.get("jenis_kelamin") as string;
  const pekerjaan    = fd.get("pekerjaan") as string;
  const jabatan      = fd.get("jabatan") as string;
  const nomor_hp     = fd.get("nomor_hp") as string;
  const bersedia     = fd.get("bersedia") === "1" ? 1 : 0;

  let totalScore = 0;
  const q: number[] = [];
  for (let i = 1; i <= 27; i++) {
    const val = Number(fd.get(`q${i}`) ?? 0);
    q.push(val);
    totalScore += val;
  }

  const rataRata = totalScore / 27;
  const kategori = hitungKategori(rataRata).label;

  const cols = [
    "nama","tanggal_lahir","jenis_kelamin","pekerjaan","jabatan","nomor_hp","bersedia",
    "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14",
    "q15","q16","q17","q18","q19","q20","q21","q22","q23","q24","q25","q26","q27",
    "total_score","kategori",
  ];
  const placeholders = cols.map(() => "?").join(", ");
  const vals: (string | number)[] = [
    nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan, nomor_hp, bersedia,
    ...q,
    Math.round(rataRata * 100) / 100,
    kategori,
  ];

  const result = await db
    .prepare(`INSERT INTO responses (${cols.join(", ")}) VALUES (${placeholders})`)
    .bind(...vals)
    .run();

  return { id: result.meta?.last_row_id ?? 0 };
}

export default function Submit() {
  const navigate = useNavigate();
  const fetcher = useFetcher<{ id: number }>();
  const [ringkasan, setRingkasan] = useState<{ nama: string; skor: number }[]>([]);
  const [formFields, setFormFields] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState("");

  const loading = fetcher.state !== "idle";

  // Navigasi ke hasil setelah submit berhasil
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.id) {
      sessionStorage.removeItem("consent_data");
      sessionStorage.removeItem("jawaban");
      navigate(`/hasil/${fetcher.data.id}`);
    }
  }, [fetcher.state, fetcher.data]);

  // Load data dari sessionStorage
  useEffect(() => {
    const consentRaw = sessionStorage.getItem("consent_data");
    const jawabanRaw = sessionStorage.getItem("jawaban");

    if (!consentRaw) { navigate("/consent"); return; }
    if (!jawabanRaw) { navigate("/kuesioner/1"); return; }

    const consent = JSON.parse(consentRaw);
    const jawaban = JSON.parse(jawabanRaw);

    // Hitung ringkasan
    const r = DOMAINS.map(d => {
      const total = d.pertanyaan.reduce((s, p) => s + (Number(jawaban[String(p.id)] ?? jawaban[p.id] ?? 0)), 0);
      const rata = total / d.pertanyaan.length;
      return { nama: d.nama, skor: Math.round(rata * 100) / 100 };
    });
    setRingkasan(r);

    // Siapkan semua field untuk form hidden
    const fields: Record<string, string> = {
      nama:          consent.nama,
      tanggal_lahir: consent.tanggal_lahir,
      jenis_kelamin: consent.jenis_kelamin,
      pekerjaan:     consent.pekerjaan,
      jabatan:       consent.jabatan,
      nomor_hp:      consent.nomor_hp,
      bersedia:      consent.bersedia,
    };
    for (let i = 1; i <= 27; i++) {
      fields[`q${i}`] = String(jawaban[String(i)] ?? jawaban[i] ?? 0);
    }
    setFormFields(fields);
  }, []);

  function handleSubmit() {
    const allIds = DOMAINS.flatMap(d => d.pertanyaan.map(p => p.id));
    const jawabanRaw = sessionStorage.getItem("jawaban");
    if (!jawabanRaw) { navigate("/consent"); return; }
    const jawaban = JSON.parse(jawabanRaw);
    const missing = allIds.filter(id => jawaban[String(id)] === undefined && jawaban[id] === undefined);
    if (missing.length > 0) {
      setValidationError(`Masih ada ${missing.length} pertanyaan yang belum dijawab. Harap kembali dan lengkapi.`);
      return;
    }

    // Submit via fetcher (FormData)
    const fd = new FormData();
    Object.entries(formFields).forEach(([k, v]) => fd.append(k, v));
    fetcher.submit(fd, { method: "post", action: "/submit" });
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
            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                ⚠️ {validationError}
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        kat.warna === "red" ? "bg-red-100 text-red-700" :
                        kat.warna === "yellow" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
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
                disabled={loading}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ← Tinjau Ulang
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(formFields).length === 0}
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
