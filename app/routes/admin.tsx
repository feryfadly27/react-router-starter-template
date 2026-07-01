import type { Route } from "./+types/admin";
import { Link, useSearchParams } from "react-router";
import { DOMAINS, hitungKategori } from "../data/kuesioner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin – Rekap Kuesioner RME" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [rows, countRow] = await Promise.all([
    db
      .prepare("SELECT * FROM responses ORDER BY created_at DESC LIMIT ? OFFSET ?")
      .bind(limit, offset)
      .all<any>(),
    db.prepare("SELECT COUNT(*) as total FROM responses").first<{ total: number }>(),
  ]);

  const total = countRow?.total ?? 0;

  // Hitung statistik agregat
  const stats = await db
    .prepare(`
      SELECT
        COUNT(*) as total,
        AVG(total_score) as avg_score,
        SUM(CASE WHEN kategori = 'Belum Siap' THEN 1 ELSE 0 END) as belum_siap,
        SUM(CASE WHEN kategori = 'Cukup Siap' THEN 1 ELSE 0 END) as cukup_siap,
        SUM(CASE WHEN kategori = 'Sangat Siap' THEN 1 ELSE 0 END) as sangat_siap
      FROM responses
    `)
    .first<any>();

  return {
    rows: rows.results ?? [],
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats,
  };
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { rows, total, page, totalPages, stats } = loaderData as any;
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
            <p className="text-gray-500 text-sm">Rekap Kuesioner RME – RS Abdul Manap Kota Jambi</p>
          </div>
          <Link to="/" className="text-sm text-blue-600 hover:underline">← Kembali ke Beranda</Link>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{stats?.total ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Total Responden</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{(stats?.avg_score ?? 0).toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Rata-rata Skor</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats?.belum_siap ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Belum Siap</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats?.cukup_siap ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Cukup Siap</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats?.sangat_siap ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Sangat Siap</div>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Daftar Responden ({total} total)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Jabatan</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Skor</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Kategori</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Waktu</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(rows as any[]).map((row: any) => {
                  const kat = hitungKategori(row.total_score ?? 0);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">#{row.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{row.jabatan}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-800">
                        {(row.total_score ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          kat.warna === "red" ? "bg-red-100 text-red-700" :
                          kat.warna === "yellow" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {row.kategori ?? kat.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(row.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/hasil/${row.id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {(rows as any[]).length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Belum ada data responden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    to={`?page=${page - 1}`}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    ← Prev
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    to={`?page=${page + 1}`}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Domain Rata-rata */}
        <DomainStats rows={rows as any[]} />
      </div>
    </div>
  );
}

function DomainStats({ rows }: { rows: any[] }) {
  if (rows.length === 0) return null;

  const domainStats = DOMAINS.map(d => {
    const scores = rows.map(row => {
      const total = d.pertanyaan.reduce((s, p) => s + (row[`q${p.id}`] ?? 0), 0);
      return total / d.pertanyaan.length;
    });
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { nama: d.nama, avg: Math.round(avg * 100) / 100 };
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-semibold text-gray-700 mb-4">Rata-rata Skor per Domain (Semua Responden)</h2>
      <div className="space-y-3">
        {domainStats.map(d => {
          const kat = hitungKategori(d.avg);
          const persen = (d.avg / 5) * 100;
          const barColor = kat.warna === "red" ? "bg-red-400" : kat.warna === "yellow" ? "bg-yellow-400" : "bg-green-400";
          return (
            <div key={d.nama}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{d.nama}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{d.avg.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    kat.warna === "red" ? "bg-red-100 text-red-700" :
                    kat.warna === "yellow" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{kat.label}</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className={`${barColor} h-3 rounded-full`} style={{ width: `${persen}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
