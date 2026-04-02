export function apiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8080/api";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function readError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { detail?: string; title?: string };
    if (j?.detail) return String(j.detail);
  } catch {
    /* not JSON */
  }
  return text || res.statusText;
}

export type FetchOptions = RequestInit & { userEmail?: string | null };

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T | null> {
  const { userEmail, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (userEmail) {
    headers.set("X-Dev-User-Email", userEmail);
  }
  const res = await fetch(apiUrl(path), { ...init, headers });
  if (!res.ok) {
    throw new Error(await readError(res));
  }
  if (res.status === 204) {
    return null;
  }
  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return (await res.json()) as T;
  }
  return null;
}

export async function publicApiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(apiUrl(path), { ...options, headers });
  if (!res.ok) {
    throw new Error(await readError(res));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as T;
}
