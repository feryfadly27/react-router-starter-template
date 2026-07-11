import type { Route } from "./+types/signature.$key";
import { getSessionUser } from "../lib/auth.server";
import { redirect } from "react-router";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const db     = (context.cloudflare.env as any).DB as D1Database;
  const bucket = (context.cloudflare.env as any).SIGNATURES as R2Bucket;

  // Hanya admin yang boleh akses
  const user = await getSessionUser(db, request);
  if (!user) throw redirect("/admin/login");

  const key = decodeURIComponent(params.key ?? "");
  if (!key) return new Response("Not found", { status: 404 });

  const obj = await bucket.get(`signatures/${key}`);
  if (!obj) return new Response("Not found", { status: 404 });

  return new Response(obj.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

// Tidak ada default export (komponen) — ini resource route yang mengembalikan
// binary PNG langsung dari loader. Dengan komponen, React Router akan merender
// dokumen HTML alih-alih menyajikan gambar.
