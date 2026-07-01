import type { Route } from "./+types/terima-kasih";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Terima Kasih – Kuesioner RME" }];
}

export default function TerimaKasih() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">

        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Terima Kasih!
        </h1>
        <p className="text-green-600 font-semibold mb-4">
          Jawaban Anda telah berhasil disimpan.
        </p>

        <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6 text-left">
          <p className="text-sm text-gray-700 leading-relaxed">
            Kami mengucapkan terima kasih yang sebesar-besarnya atas kesediaan Anda
            menjadi <strong>informan</strong> dalam penelitian ini. Partisipasi Anda
            sangat berarti dan memberikan kontribusi nyata bagi pengembangan ilmu
            pengetahuan, khususnya dalam bidang kesehatan.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Informasi yang Anda berikan akan dijaga kerahasiaannya dan hanya
            digunakan untuk keperluan penelitian.
          </p>
        </div>

        <div className="text-xs text-gray-400 mb-6">
          Peneliti: <span className="font-medium text-gray-500">Fery Fadly, SKM., MKM</span>
          <br />Kuesioner Kesiapan Penerapan RME – RS Abdul Manap Kota Jambi
        </div>

        <Link
          to="/"
          className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
