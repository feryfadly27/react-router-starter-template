import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kuesioner RME" },
    { name: "description", content: "Kuesioner Kesiapan Penerapan Rekam Medis Elektronik di Rumah Sakit" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [showPSP, setShowPSP] = useState(false);

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
          <span className="text-white font-semibold text-sm">Kuesioner RME</span>
        </div>
        <div className="ml-auto">
          <Link
            to="/admin"
            className="text-xs px-3 py-1.5 rounded transition-colors"
            style={{ color: "rgba(255,255,255,0.60)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
          >
            Admin →
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <div className="max-w-2xl w-full">
          {/* Hero card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e3e0dd" }}
          >
            {/* Top accent bar */}
            <div className="h-1" style={{ background: "#fe6e00" }} />

            <div className="bg-white p-8">
              {/* Icon + title */}
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(254,110,0,0.10)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "#fe6e00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#fe6e00" }}>
                    Instrumen Penelitian
                  </p>
                  <h1 className="text-xl font-bold leading-tight" style={{ color: "#423d38" }}>
                    Kuesioner Kesiapan Penerapan
                  </h1>
                  <h2 className="text-lg font-bold" style={{ color: "#fe6e00" }}>
                    Rekam Medis Elektronik (RME)
                  </h2>
                </div>
              </div>

              {/* Info panel */}
              <div
                className="rounded-lg p-4 mb-5"
                style={{ background: "#fcfaf7", border: "1px solid #e3e0dd" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#797067" }}>
                  Tentang Kuesioner Ini
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "27 Pertanyaan", sub: "dalam 13 domain" },
                    { label: "Skala 0–5", sub: "per pertanyaan" },
                    { label: "10–15 Menit", sub: "estimasi waktu" },
                    { label: "Rahasia", sub: "data terjaga" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#fe6e00" }} />
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "#423d38" }}>{item.label}</span>
                        <span className="text-xs ml-1" style={{ color: "#797067" }}>{item.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kategori */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#797067" }}>
                  Kategori Penilaian
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg p-3 text-center" style={{ background: "#fef9c2", border: "1px solid #fde68a" }}>
                    <div className="text-sm font-bold" style={{ color: "#874b00" }}>Skor 0–1</div>
                    <div className="text-xs mt-0.5" style={{ color: "#874b00" }}>Belum Siap</div>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <div className="text-sm font-bold" style={{ color: "#9a3412" }}>Skor 2–3</div>
                    <div className="text-xs mt-0.5" style={{ color: "#9a3412" }}>Cukup Siap</div>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{ background: "#dcfce7", border: "1px solid #bbf7d0" }}>
                    <div className="text-sm font-bold" style={{ color: "#016630" }}>Skor 4–5</div>
                    <div className="text-xs mt-0.5" style={{ color: "#016630" }}>Sangat Siap</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => setShowPSP(true)}
                className="flex items-center justify-center w-full font-semibold text-sm text-white rounded-lg h-10 transition-colors"
                style={{ background: "#fe6e00" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
              >
                Mulai Mengisi Kuesioner →
              </button>
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#797067" }}>
            Peneliti: Fery Fadly, SKM., MKM
          </p>
        </div>
      </main>

      {/* Modal PSP – Penjelasan Sebelum Penelitian */}
      {showPSP && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setShowPSP(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="psp-title"
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{ boxShadow: "0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid #e3e0dd" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#fe6e00" }}>
                Penjelasan Sebelum Penelitian
              </p>
              <h2 id="psp-title" className="text-lg font-bold leading-snug" style={{ color: "#423d38" }}>
                Tinjauan Kesiapan Penerapan Rekam Medis Elektronik di Rumah Sakit dengan Instrumen DOQ IT
              </h2>
            </div>

            {/* Isi PSP – area scroll */}
            <div className="px-6 py-4 overflow-y-auto text-sm leading-relaxed space-y-3" style={{ color: "#423d38" }}>
              <p>Assalamualaikum wr wb.</p>
              <p>
                Perkenalkan saya Fery Fadly, SKM., MKM dari Program Studi Rekam Medis dan Informasi
                Kesehatan Poltekkes Kemenkes Tasikmalaya. Saya bersama tim peneliti bermaksud melakukan
                penelitian yang berjudul “Tinjauan Kesiapan Penerapan Rekam Medis Elektronik di Rumah
                Sakit dengan Instrumen DOQ IT”.
              </p>
              <p>
                Penelitian ini bertujuan untuk mengetahui tingkat kesiapan Rumah Sakit dalam menerapkan
                Rekam Medis Elektronik (RME). Manfaat penelitian ini diharapkan dapat menjadi bahan
                evaluasi dan pertimbangan bagi pihak rumah sakit dalam mempersiapkan serta mengoptimalkan
                implementasi Rekam Medis Elektronik (RME) guna meningkatkan mutu pelayanan kesehatan.
              </p>
              <p>
                Sehubungan dengan hal tersebut, saya meminta kesediaan Bapak/Ibu untuk berpartisipasi dan
                meluangkan waktu untuk menjadi informan dalam penelitian ini, sebagai sumber untuk
                diwawancarai dengan memberikan jawaban dari setiap pertanyaan yang akan saya ajukan dalam
                wawancara mendalam. Selama wawancara dilakukan, peneliti menggunakan alat bantu penelitian
                berupa pedoman wawancara, alat tulis dan alat perekam untuk membantu kelancaran pengumpulan
                data. Untuk itu, peneliti memohon izin kepada Bapak/Ibu sebagai informan saat pelaksanaan
                wawancara akan dilakukan perekaman suara dan dokumentasi. Identitas beserta jawaban Bapak/Ibu
                akan <strong>TERJAMIN KERAHASIANNYA</strong> dan{" "}
                <strong>TIDAK AKAN MEMPENGARUHI STATUS PEKERJAAN</strong>. Saya berharap pertanyaan
                wawancara ini dapat dijawab secara jujur dan sesuai dengan kondisi yang ada.
              </p>
              <p>
                Peneliti sangat menjunjung tinggi hak-hak Bapak/Ibu sebagai informan dalam penelitian ini.
                Apabila Bapak/Ibu merasa keberatan atau ada hal yang tidak bisa diberikan sebagai informan,
                maka Bapak/Ibu berhak untuk tidak ikut atau berhenti berpartisipasi. Maka dari itu dengan
                menandatangani surat persetujuan ini, Bapak/Ibu dinyatakan bersedia ikut berpartisipasi
                dalam penelitian ini. Atas perhatian dan kesediaan Bapak/Ibu menjadi informan dalam
                penelitian ini. peneliti sampaikan terima kasih.
              </p>
              <p>
                Apabila Bapak/Ibu ingin mendapatkan penjelasan terkait dengan penelitian ini, maka Bapak/Ibu
                dapat menghubungi:
              </p>
              <p className="font-semibold">Fery Fadly, SKM., MKM (0853 6652 5565)</p>
              <p>Wassalamu’alaikum wr wb.</p>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-2 sm:justify-end" style={{ borderTop: "1px solid #e3e0dd" }}>
              <button
                type="button"
                onClick={() => setShowPSP(false)}
                className="font-medium text-sm rounded-lg h-10 px-4 transition-colors order-2 sm:order-1"
                style={{ color: "#797067", border: "1px solid #e3e0dd" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => navigate("/consent")}
                className="font-semibold text-sm text-white rounded-lg h-10 px-5 transition-colors order-1 sm:order-2"
                style={{ background: "#fe6e00" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
              >
                Saya sudah membaca dengan seksama →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
