import type { Route } from "./+types/hasil.$id";
import { Link } from "react-router";
import { DOMAINS, hitungKategori } from "../data/kuesioner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Hasil Kuesioner – RME RS Abdul Manap" }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const id = parseInt(params.id ?? "0");

  const row = await db
    .prepare("SELECT * FROM responses WHERE id = ?")
    .bind(id)
    .first<any>();

  if (!row) throw new Response("Tidak ditemukan", { status: 404 });
  return row;
}

export default function Hasil({ loaderData }: Route.ComponentProps) {
  const row = loaderData as any;

  const jawaban: Record<number, number> = {};
  for (let i = 1; i <= 27; i++) {
    jawaban[i] = row[`q${i}`] ?? 0;
  }

  const skorDomain = DOMAINS.map(d => {
    const total = d.pertanyaan.reduce((s, p) => s + (jawaban[p.id] ?? 0), 0);
    const rata = total / d.pertanyaan.length;
    return { nama: d.nama, warna: d.warna, skor: Math.round(rata * 100) / 100 };
  });

  const rataKeseluruhan = row.total_score ?? 0;
  const kategoriKeseluruhan = hitungKategori(rataKeseluruhan);

  const WARNA_TEXT: Record<string, string> = {
    red: "text-red-600", yellow: "text-yellow-600", green: "text-green-600",
  };
  const WARNA_BG: Record<string, string> = {
    red: "bg-red-50 border-red-200", yellow: "bg-yellow-50 border-yellow-200", green: "bg-green-50 border-green-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header hasil */}
        <div className={`border-2 rounded-2xl p-6 text-center ${WARNA_BG[kategoriKeseluruhan.warna]}`}>
          <div className="text-5xl mb-3">
            {kategoriKeseluruhan.warna === "green" ? "🎉" : kategoriKeseluruhan.warna === "yellow" ? "📋" : "⚠️"}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hasil Kuesioner Anda</h1>
          <p className="text-gray-500 text-sm mb-4">Rekam Medis Elektronik – RS Abdul Manap Kota Jambi</p>

          <div className="inline-flex flex-col items-center">
            <div className={`text-5xl font-bold ${WARNA_TEXT[kategoriKeseluruhan.warna]}`}>
              {rataKeseluruhan.toFixed(2)}
            </div>
            <div className="text-gray-500 text-sm">Rata-rata Skor (0–5)</div>
            <div className={`mt-2 px-4 py-1 rounded-full font-semibold text-sm ${
              kategoriKeseluruhan.warna === "red" ? "bg-red-500 text-white" :
              kategoriKeseluruhan.warna === "yellow" ? "bg-yellow-500 text-white" :
              "bg-green-500 text-white"
            }`}>
              {kategoriKeseluruhan.label}
            </div>
          </div>
        </div>

        {/* Info responden */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Data Informan</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><span className="text-gray-400">Nama:</span> <span className="font-medium">{row.nama}</span></div>
            <div><span className="text-gray-400">Tanggal Lahir:</span> <span className="font-medium">{row.tanggal_lahir}</span></div>
            <div><span className="text-gray-400">Jenis Kelamin:</span> <span className="font-medium">{row.jenis_kelamin}</span></div>
            <div><span className="text-gray-400">Pekerjaan:</span> <span className="font-medium">{row.pekerjaan}</span></div>
            <div><span className="text-gray-400">Jabatan:</span> <span className="font-medium">{row.jabatan}</span></div>
            <div><span className="text-gray-400">Waktu Isi:</span> <span className="font-medium">{new Date(row.created_at).toLocaleString("id-ID")}</span></div>
          </div>
        </div>

        {/* Skor per domain */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Skor per Domain</h2>

          {/* Legend */}
          <div className="flex gap-3 flex-wrap mb-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"/> Belum Siap (0–1)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"/> Cukup Siap (2–3)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block"/> Sangat Siap (4–5)</span>
          </div>

          <div className="space-y-4">
            {skorDomain.map(d => {
              const kat = hitungKategori(d.skor);
              const persen = (d.skor / 5) * 100;
              const barColor = kat.warna === "red" ? "bg-red-400" : kat.warna === "yellow" ? "bg-yellow-400" : "bg-green-400";
              return (
                <div key={d.nama}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{d.nama}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-800">{d.skor.toFixed(2)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        kat.warna === "red" ? "bg-red-100 text-red-700" :
                        kat.warna === "yellow" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>{kat.label}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${persen}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interpretasi */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="font-semibold text-blue-800 mb-2">Interpretasi Hasil</h2>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Skor rata-rata keseluruhan: <strong>{rataKeseluruhan.toFixed(2)}</strong> dari maksimal <strong>5.00</strong></p>
            <p>Kategori kesiapan: <strong>{kategoriKeseluruhan.label}</strong></p>
            {kategoriKeseluruhan.warna === "green" && (
              <p className="mt-2">RS Abdul Manap menunjukkan tingkat kesiapan yang tinggi dalam penerapan Rekam Medis Elektronik.</p>
            )}
            {kategoriKeseluruhan.warna === "yellow" && (
              <p className="mt-2">RS Abdul Manap berada pada level kesiapan menengah. Diperlukan peningkatan pada beberapa domain.</p>
            )}
            {kategoriKeseluruhan.warna === "red" && (
              <p className="mt-2">RS Abdul Manap masih memerlukan persiapan lebih lanjut sebelum menerapkan Rekam Medis Elektronik.</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Selesai
          </Link>
        </div>
      </div>
    </div>
  );
}
