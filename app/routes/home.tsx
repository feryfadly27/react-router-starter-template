import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kuesioner RME – RS Abdul Manap Jambi" },
    { name: "description", content: "Kuesioner Kesiapan Penerapan Rekam Medis Elektronik di Rumah Sakit Abdul Manap Kota Jambi" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kuesioner Kesiapan Penerapan
          </h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Rekam Medis Elektronik (RME)
          </h2>
          <p className="text-gray-500 text-sm">
            Rumah Sakit Abdul Manap Kota Jambi
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Tentang Kuesioner Ini</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 27 pertanyaan dalam 11 domain penilaian</li>
            <li>• Setiap pertanyaan memiliki skala 0–5</li>
            <li>• Estimasi waktu: 10–15 menit</li>
            <li>• Data disimpan secara rahasia</li>
          </ul>
        </div>

        <div className="mb-6 text-left">
          <h3 className="font-semibold text-gray-700 mb-2">Kategori Penilaian</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-red-600 font-bold text-sm">Skor 0–1</div>
              <div className="text-red-700 text-xs mt-1">Belum Siap</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-yellow-600 font-bold text-sm">Skor 2–3</div>
              <div className="text-yellow-700 text-xs mt-1">Cukup Siap</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-green-600 font-bold text-sm">Skor 4–5</div>
              <div className="text-green-700 text-xs mt-1">Sangat Siap</div>
            </div>
          </div>
        </div>

        <Link
          to="/consent"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Mulai Mengisi Kuesioner →
        </Link>

        <div className="mt-4">
          <Link
            to="/admin"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Masuk sebagai Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
