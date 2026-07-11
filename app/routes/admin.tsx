import type { Route } from "./+types/admin";
import { Link, useSearchParams, Form, useFetcher } from "react-router";
import { redirect } from "react-router";
import { DOMAINS, hitungKategori, hitungSkorKeseluruhan } from "../data/kuesioner";

// Hitung ulang skor keseluruhan sebuah baris responden dari kolom q1..q27,
// agar konsisten dengan metode rata-rata per domain (bukan total_score lama).
function skorBaris(row: any): number {
  const jawaban: Record<number, number> = {};
  for (let i = 1; i <= 27; i++) jawaban[i] = row[`q${i}`] ?? 0;
  return hitungSkorKeseluruhan(jawaban);
}
import { getSessionUser, deleteSession, clearSessionCookie } from "../lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin – Rekap Kuesioner RME" }];
}

export async function action({ request, context }: Route.ActionArgs) {
  const db     = (context.cloudflare.env as any).DB as D1Database;
  const bucket = (context.cloudflare.env as any).SIGNATURES as R2Bucket;

  const user = await getSessionUser(db, request);
  if (!user) throw redirect("/admin/login");

  const fd     = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "logout") {
    await deleteSession(db, request);
    return redirect("/admin/login", {
      headers: { "Set-Cookie": clearSessionCookie() },
    });
  }

  if (intent === "delete") {
    const id = Number(fd.get("id"));
    if (!id) return Response.json({ ok: false }, { status: 400 });

    // Hapus file tanda tangan dari R2 jika ada
    const row = await db
      .prepare("SELECT tanda_tangan_url FROM responses WHERE id = ?")
      .bind(id)
      .first<{ tanda_tangan_url: string | null }>();

    if (row?.tanda_tangan_url) {
      await bucket.delete(row.tanda_tangan_url).catch(() => {});
    }

    await db.prepare("DELETE FROM responses WHERE id = ?").bind(id).run();
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false }, { status: 400 });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;

  const user = await getSessionUser(db, request);
  if (!user) throw redirect("/admin/login");

  const url    = new URL(request.url);
  const page   = parseInt(url.searchParams.get("page") ?? "1");
  const limit  = 20;
  const offset = (page - 1) * limit;

  // Ambil kolom q1..q27 dari SEMUA baris untuk statistik (dihitung ulang di JS
  // agar konsisten dengan metode rata-rata per domain, lepas dari total_score lama).
  const qCols = Array.from({ length: 27 }, (_, i) => `q${i + 1}`).join(", ");

  const [rows, countRow, allRows] = await Promise.all([
    db
      .prepare("SELECT * FROM responses ORDER BY created_at DESC LIMIT ? OFFSET ?")
      .bind(limit, offset)
      .all<any>(),
    db.prepare("SELECT COUNT(*) as total FROM responses").first<{ total: number }>(),
    db.prepare(`SELECT ${qCols} FROM responses`).all<any>(),
  ]);

  const total = countRow?.total ?? 0;

  // Statistik ringkasan dihitung ulang dari jawaban seluruh responden.
  const semua = allRows.results ?? [];
  let sumSkor = 0;
  const jumlahKategori = { "Belum Siap": 0, "Cukup Siap": 0, "Sangat Siap": 0 } as Record<string, number>;
  for (const r of semua) {
    const skor = skorBaris(r);
    sumSkor += skor;
    jumlahKategori[hitungKategori(skor).label]++;
  }
  const stats = {
    total: semua.length,
    avg_score: semua.length > 0 ? sumSkor / semua.length : 0,
    belum_siap: jumlahKategori["Belum Siap"],
    cukup_siap: jumlahKategori["Cukup Siap"],
    sangat_siap: jumlahKategori["Sangat Siap"],
  };

  return {
    rows: rows.results ?? [],
    allRows: semua,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats,
    username: user.username,
  };
}

// ── Komponen tombol hapus per baris ──────────────────────────────────────────
function DeleteButton({ id, nama }: { id: number; nama: string }) {
  const fetcher = useFetcher<{ ok: boolean }>();
  const isDeleting = fetcher.state !== "idle";

  function handleClick() {
    if (!confirm(`Hapus data responden "${nama}" (#${id})?\nTindakan ini tidak dapat dibatalkan.`)) return;
    const fd = new FormData();
    fd.append("intent", "delete");
    fd.append("id", String(id));
    fetcher.submit(fd, { method: "post" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDeleting}
      className="text-xs font-medium transition-colors disabled:opacity-40"
      style={{ color: "#fb2c36" }}
      onMouseEnter={e => !isDeleting && (e.currentTarget.style.textDecoration = "underline")}
      onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
      title="Hapus responden ini"
    >
      {isDeleting ? "..." : "Hapus"}
    </button>
  );
}

// ── Komponen badge kategori ───────────────────────────────────────────────────
function KategoriPill({ kategori, warna }: { kategori: string; warna: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    red:    { bg: "#fef9c2", color: "#874b00" },
    yellow: { bg: "#fff7ed", color: "#9a3412" },
    green:  { bg: "#dcfce7", color: "#016630" },
  };
  const s = styles[warna] ?? styles.green;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {kategori}
    </span>
  );
}

// ── Halaman utama ─────────────────────────────────────────────────────────────
export default function Admin({ loaderData }: Route.ComponentProps) {
  const { rows, allRows, total, page, totalPages, stats, username } = loaderData as any;
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen" style={{ background: "#fcfaf7" }}>
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
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "#fe6e00" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-white text-sm font-semibold">Admin Panel</span>
            <span className="ml-2 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>Kuesioner RME</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.50)" }}>
            {username}
          </span>
          <Link
            to="/"
            className="text-xs px-3 h-8 flex items-center rounded transition-colors"
            style={{ color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.15)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
          >
            Beranda
          </Link>
          <Form method="post">
            <input type="hidden" name="intent" value="logout" />
            <button
              type="submit"
              className="text-xs px-3 h-8 flex items-center rounded transition-colors"
              style={{ background: "rgba(251,44,54,0.20)", color: "#fca5a5", border: "1px solid rgba(251,44,54,0.30)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,44,54,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(251,44,54,0.20)")}
            >
              Logout
            </button>
          </Form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#423d38" }}>Rekap Kuesioner</h1>
          <p className="text-sm mt-0.5" style={{ color: "#797067" }}>Rekam Medis Elektronik (RME)</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { value: stats?.total ?? 0, label: "Total Responden", color: "#fe6e00" },
            { value: (stats?.avg_score ?? 0).toFixed(2), label: "Rata-rata Skor", color: "#3080ff" },
            { value: stats?.belum_siap ?? 0, label: "Belum Siap", color: "#874b00" },
            { value: stats?.cukup_siap ?? 0, label: "Cukup Siap", color: "#9a3412" },
            { value: stats?.sangat_siap ?? 0, label: "Sangat Siap", color: "#016630" },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl p-4 text-center bg-white"
              style={{ border: "1px solid #e3e0dd", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              <div className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs mt-1" style={{ color: "#797067" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div
          className="rounded-xl bg-white overflow-hidden"
          style={{ border: "1px solid #e3e0dd", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid #e3e0dd" }}
          >
            <h2 className="font-semibold text-sm" style={{ color: "#423d38" }}>
              Daftar Responden
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(254,110,0,0.10)", color: "#fe6e00" }}
            >
              {total} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(254,110,0,0.05)" }}>
                  {["ID", "Nama", "Jabatan", "Skor", "Kategori", "TTD", "Waktu", "Aksi"].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#fe6e00" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(rows as any[]).map((row: any) => {
                  const skor = skorBaris(row);
                  const kat = hitungKategori(skor);
                  return (
                    <tr
                      key={row.id}
                      style={{ borderTop: "1px solid #f3f4f6" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fafaf9")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-3 text-xs" style={{ color: "#797067" }}>#{row.id}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "#423d38" }}>{row.nama}</td>
                      <td className="px-4 py-3" style={{ color: "#797067" }}>{row.jabatan}</td>
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#423d38" }}>
                        {skor.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <KategoriPill kategori={kat.label} warna={kat.warna} />
                      </td>
                      <td className="px-4 py-3">
                        {row.tanda_tangan_url ? (
                          <a
                            href={`/signature/${encodeURIComponent(row.tanda_tangan_url.replace("signatures/", ""))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat tanda tangan"
                          >
                            <img
                              src={`/signature/${encodeURIComponent(row.tanda_tangan_url.replace("signatures/", ""))}`}
                              alt="ttd"
                              className="h-8 w-20 object-contain rounded"
                              style={{ border: "1px solid #e3e0dd", background: "#fff" }}
                            />
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: "#d1d5dc" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#797067" }}>
                        {new Date(row.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/hasil/${row.id}`}
                            className="text-xs font-medium transition-colors"
                            style={{ color: "#fe6e00" }}
                            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                          >
                            Detail
                          </Link>
                          <span style={{ color: "#e3e0dd" }}>·</span>
                          <DeleteButton id={row.id} nama={row.nama} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(rows as any[]).length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-14 text-sm" style={{ color: "#797067" }}>
                      Belum ada data responden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderTop: "1px solid #e3e0dd" }}
            >
              <p className="text-xs" style={{ color: "#797067" }}>Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    to={`?page=${page - 1}`}
                    className="px-3 h-8 flex items-center rounded text-xs transition-colors"
                    style={{ border: "1px solid #d1d5dc", color: "#797067" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    ← Prev
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    to={`?page=${page + 1}`}
                    className="px-3 h-8 flex items-center rounded text-xs transition-colors"
                    style={{ border: "1px solid #d1d5dc", color: "#797067" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Domain chart */}
        <DomainStats rows={allRows as any[]} />
      </main>
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
    <div
      className="rounded-xl bg-white p-6"
      style={{ border: "1px solid #e3e0dd", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      <h2 className="font-semibold text-sm mb-5" style={{ color: "#423d38" }}>
        Rata-rata Skor per Domain
      </h2>
      <div className="space-y-4">
        {domainStats.map(d => {
          const kat = hitungKategori(d.avg);
          const persen = (d.avg / 5) * 100;
          return (
            <div key={d.nama}>
              <div className="flex justify-between items-center text-sm mb-1.5">
                <span style={{ color: "#423d38" }}>{d.nama}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs" style={{ color: "#797067" }}>{d.avg.toFixed(2)}</span>
                  <KategoriPill kategori={kat.label} warna={kat.warna} />
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${persen}%`, background: "rgba(254,110,0,0.60)" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
