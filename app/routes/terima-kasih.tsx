import type { Route } from "./+types/terima-kasih";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Terima Kasih – Kuesioner RME" }];
}

export default function TerimaKasih() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih</h1>
        <p className="text-gray-500 mb-6">
          Anda memilih untuk tidak berpartisipasi dalam penelitian ini. Keputusan Anda sangat kami hormati.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
