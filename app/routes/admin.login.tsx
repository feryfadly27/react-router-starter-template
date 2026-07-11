import type { Route } from "./+types/admin.login";
import { redirect } from "react-router";
import { useState } from "react";
import { hashPassword, createSession, setSessionCookie, getSessionUser } from "../lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login Admin – Kuesioner RME" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const user = await getSessionUser(db, request);
  if (user) throw redirect("/admin");
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = (context.cloudflare.env as any).DB as D1Database;
  const fd = await request.formData();
  const username = (fd.get("username") as string ?? "").trim();
  const password = fd.get("password") as string ?? "";

  if (!username || !password) {
    return Response.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  const user = await db
    .prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ?")
    .bind(username)
    .first<{ id: number; username: string; password_hash: string }>();

  if (!user) {
    return Response.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const inputHash = await hashPassword(password);
  if (inputHash !== user.password_hash) {
    return Response.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const sessionId = await createSession(db, user.id);

  return redirect("/admin", {
    headers: { "Set-Cookie": setSessionCookie(sessionId) },
  });
}

export default function AdminLogin({ actionData }: Route.ComponentProps) {
  const error = (actionData as any)?.error;
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#413830" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "#fe6e00" }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>
            Kuesioner RME
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "rgba(0,0,0,0.40)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {error && (
            <div
              className="rounded-lg p-3 mb-5 text-sm flex items-center gap-2"
              style={{ background: "rgba(251,44,54,0.15)", border: "1px solid rgba(251,44,54,0.30)", color: "#fca5a5" }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form method="post" className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                required
                placeholder="Masukkan username"
                className="w-full rounded-md px-3 h-10 text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#fe6e00")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Masukkan password"
                  className="w-full rounded-md px-3 pr-10 h-10 text-sm outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#ffffff",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#fe6e00")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.40)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-md text-sm font-semibold text-white transition-colors mt-2"
              style={{ background: "#fe6e00" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ff6b00")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fe6e00")}
            >
              Masuk
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4">
          <a
            href="/"
            className="transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
          >
            ← Kembali ke Beranda
          </a>
        </p>
      </div>
    </div>
  );
}
