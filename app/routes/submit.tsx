import type { Route } from "./+types/submit";
import { useNavigate, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { DOMAINS, hitungKategori, hitungSkorKeseluruhan } from "../data/kuesioner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Konfirmasi & Kirim – Kuesioner RME" }];
}

export async function action({ request, context }: Route.ActionArgs) {
  const db         = (context.cloudflare.env as any).DB as D1Database;
  const bucket     = (context.cloudflare.env as any).SIGNATURES as R2Bucket;
  const fd         = await request.formData();

  const nama          = fd.get("nama") as string;
  const tanggal_lahir = fd.get("tanggal_lahir") as string;
  const jenis_kelamin = fd.get("jenis_kelamin") as string;
  const pekerjaan     = fd.get("pekerjaan") as string;
  const jabatan       = fd.get("jabatan") as string;
  const pendidikan    = fd.get("pendidikan") as string;
  const masa_kerja    = fd.get("masa_kerja") as string;
  const frekuensi_rme = fd.get("frekuensi_rme") as string;
  const nomor_hp      = fd.get("nomor_hp") as string;
  const bersedia      = fd.get("bersedia") === "1" ? 1 : 0;

  // Upload signature ke R2 jika ada.
  let tanda_tangan_url: string | null = null;
  const safeName = (nama || "responden").replace(/[^a-z0-9]/gi, "_");
  const key = `signatures/${Date.now()}-${safeName}.png`;

  // Cara utama: tanda tangan dikirim sebagai dataURL teks (paling andal).
  const sigData = fd.get("tanda_tangan_data") as string | null;
  if (sigData && sigData.startsWith("data:")) {
    const base64 = sigData.split(",")[1] ?? "";
    if (base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      await bucket.put(key, bytes, { httpMetadata: { contentType: "image/png" } });
      tanda_tangan_url = key;
    }
  }

  // Fallback: bila dikirim sebagai File (multipart) — untuk kompatibilitas.
  if (!tanda_tangan_url) {
    const sigFile = fd.get("tanda_tangan") as File | null;
    if (sigFile && typeof sigFile !== "string" && sigFile.size > 0) {
      await bucket.put(key, sigFile.stream(), {
        httpMetadata: { contentType: "image/png" },
      });
      tanda_tangan_url = key;
    }
  }

  const q: number[] = [];
  const jawaban: Record<number, number> = {};
  for (let i = 1; i <= 27; i++) {
    const val = Number(fd.get(`q${i}`) ?? 0);
    q.push(val);
    jawaban[i] = val;
  }

  // Skor keseluruhan = rata-rata dari skor rata-rata tiap domain (bobot per domain sama).
  const rataRata = hitungSkorKeseluruhan(jawaban);
  const kategori = hitungKategori(rataRata).label;

  const cols = [
    "nama","tanggal_lahir","jenis_kelamin","pekerjaan","jabatan",
    "pendidikan","masa_kerja","frekuensi_rme","nomor_hp","bersedia",
    "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14",
    "q15","q16","q17","q18","q19","q20","q21","q22","q23","q24","q25","q26","q27",
    "total_score","kategori","tanda_tangan_url",
  ];
  const placeholders = cols.map(() => "?").join(", ");
  const vals: (string | number | null)[] = [
    nama, tanggal_lahir, jenis_kelamin, pekerjaan, jabatan,
    pendidikan, masa_kerja, frekuensi_rme, nomor_hp, bersedia,
    ...q,
    rataRata,
    kategori,
    tanda_tangan_url,
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

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.id) {
      sessionStorage.removeItem("consent_data");
      sessionStorage.removeItem("jawaban");
      sessionStorage.removeItem("tanda_tangan");
      navigate(`/hasil/${fetcher.data.id}`);
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    const consentRaw = sessionStorage.getItem("consent_data");
    const jawabanRaw = sessionStorage.getItem("jawaban");
    if (!consentRaw) { navigate("/consent"); return; }
    if (!jawabanRaw) { navigate("/kuesioner/1"); return; }
  }, []);

  return null;
}
