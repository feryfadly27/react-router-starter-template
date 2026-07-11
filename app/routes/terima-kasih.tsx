import type { Route } from "./+types/terima-kasih";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Terima Kasih – Kuesioner RME" }];
}

export default function TerimaKasih() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#fcfaf7" }}>
      <div className="max-w-lg w-full">
        <div
          className="rounded-xl overflow-hidden bg-white"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e3e0dd" }}
        >
          {/* Top bar */}
          <div className="h-1" style={{ background: "#fe6e00" }} />

          <div className="p-8 text-center">
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(254,110,0,0.10)" }}
            >
              <svg className="w-8 h-8" style={{ color: "#fe6e00" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#fe6e00" }}>
              Selesai
            </p>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#423d38" }}>
              Terima Kasih!
            </h1>
            <p className="text-sm font-medium mb-6" style={{ color: "#797067" }}>
              Jawaban Anda telah berhasil disimpan.
            </p>

            <div
              className="rounded-lg p-5 mb-6 text-left"
              style={{ background: "#fcfaf7", border: "1px solid #e3e0dd" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#797067" }}>
                Kami mengucapkan terima kasih yang sebesar-besarnya atas kesediaan Anda menjadi{" "}
                <strong style={{ color: "#423d38" }}>informan</strong> dalam penelitian ini. Partisipasi Anda
                sangat berarti dan memberikan kontribusi nyata bagi pengembangan ilmu pengetahuan,
                khususnya dalam bidang kesehatan.
              </p>
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#797067" }}>
                Informasi yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan untuk
                keperluan penelitian.
              </p>
            </div>

            <div className="text-xs mb-6" style={{ color: "#797067" }}>
              Peneliti:{" "}
              <span className="font-semibold" style={{ color: "#423d38" }}>Fery Fadly, SKM., MKM</span>
              <br />
              Kuesioner Kesiapan Penerapan Rekam Medis Elektronik (RME)
            </div>

            <Link
              to="/"
              className="flex items-center justify-center w-full h-10 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ background: "#fe6e00" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
