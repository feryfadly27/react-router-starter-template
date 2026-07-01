const SESSION_COOKIE = "admin_session";
const SESSION_TTL_HOURS = 8;

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}

export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(db: D1Database, userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  await db
    .prepare("INSERT INTO admin_sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, userId, expiresAt)
    .run();

  return sessionId;
}

export async function getSessionUser(
  db: D1Database,
  request: Request
): Promise<{ id: number; username: string } | null> {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const sessionId = parseCookie(cookieHeader, SESSION_COOKIE);
  if (!sessionId) return null;

  const row = await db
    .prepare(`
      SELECT u.id, u.username
      FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `)
    .bind(sessionId)
    .first<{ id: number; username: string }>();

  return row ?? null;
}

export async function deleteSession(db: D1Database, request: Request): Promise<void> {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const sessionId = parseCookie(cookieHeader, SESSION_COOKIE);
  if (!sessionId) return;

  await db.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(sessionId).run();
}

export function setSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_HOURS * 3600}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
