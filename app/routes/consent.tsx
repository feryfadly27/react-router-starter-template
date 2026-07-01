import type { Route } from "./+types/consent";
import { useNavigate } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lembar Persetujuan – Kuesioner RME" }];
}

export default function Consent() {
  const navigate = useNavigate();
  const [bersedia, setBersedia] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};

    if (!fd.get("nama")) errs.nama = "Nama wajib diisi";
    if (!fd.get("tanggal_lahir")) errs.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!fd.get("jenis_kelamin")) errs.jenis_kelamin = "Jenis kelamin wajib dipilih";
    if (!fd.get("pekerjaan")) errs.pekerjaan = "Pekerjaan wajib diisi";
    if (!fd.get("jabatan")) errs.jabatan = "Jabatan wajib diisi";
    if (!fd.get("nomor_hp")) errs.nomor_hp = "Nomor HP wajib diisi";
    if (bersedia === null) errs.bersedia = "Pilihan persetujuan wajib ditentukan";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      nama: fd.get("nama") as string,
      tanggal_lahir: fd.get("tanggal_lahir") as string,
      jenis_kelamin: fd.get("jenis_kelamin") as string,
      pekerjaan: fd.get("pekerjaan") as string,
      jabatan: fd.get("jabatan") as string,
      nomor_hp: fd.get("nomor_hp") as string,
      bersedia: bersedia ? "1" : "0",
    };

    sessionStorage.setItem("consent_data", JSON.stringify(data));

    if (!bersedia) {
      navigate("/terima-kasih");
    } else {
      navigate("/kuesioner/1");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <h1 className="text-xl font-bold">LEMBAR PERSETUJUAN MENJADI INFORMAN</h1>
            <p className="text-blue-200 text-sm mt-1">(INFORMED CONSENT)</p>
          </div>

          <div className="p-6">
            {/* Pernyataan */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-3 font-medium">Yang bertanda tangan di bawah ini menyatakan bahwa:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Saya telah mendapat informasi dan mendengarkan persiapan penelitian dari peneliti tentang tujuan, manfaat serta prosedur penelitian dan saya memahami penjelasan tersebut.</li>
                <li>Saya mengerti bahwa penelitian ini menjunjung tinggi hak-hak saya sebagai informan.</li>
                <li>Saya mempunyai hak untuk berhenti berpartisipasi jika suatu saat saya merasa keberatan atau ada hal yang membuat saya merasa tidak nyaman dan tidak dapat melakukannya.</li>
                <li>Saya sangat memahami bahwa keikutsertaan saya menjadi informan sangat besar manfaatnya bagi peningkatan ilmu pengetahuan terutama dalam ilmu kesehatan.</li>
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama (Inisial) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Contoh: A.B."
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nama ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tanggal_lahir ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenis_kelamin"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jenis_kelamin ? "border-red-400" : "border-gray-300"}`}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pekerjaan"
                    placeholder="Contoh: Perekam Medis"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pekerjaan ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    placeholder="Contoh: Kepala Instalasi RM"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jabatan ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.jabatan && <p className="text-red-500 text-xs mt-1">{errors.jabatan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Handphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomor_hp"
                    placeholder="Contoh: 08xxxxxxxxxx"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nomor_hp ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.nomor_hp && <p className="text-red-500 text-xs mt-1">{errors.nomor_hp}</p>}
                </div>
              </div>

              {/* Persetujuan */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Dengan pertimbangan tersebut, saya memutuskan secara sukarela: <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setBersedia(true)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      bersedia === true
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-green-300 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    ✓ Bersedia
                  </button>
                  <button
                    type="button"
                    onClick={() => setBersedia(false)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      bersedia === false
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-red-300 text-red-600 hover:bg-red-50"
                    }`}
                  >
                    ✗ Tidak Bersedia
                  </button>
                </div>
                {errors.bersedia && <p className="text-red-500 text-xs mt-2">{errors.bersedia}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href="/"
                  className="flex-1 text-center py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Kembali
                </a>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  Lanjutkan →
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              Peneliti: Fery Fadly, SKM., MKM — Mei 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
