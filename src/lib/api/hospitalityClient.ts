import { tokenStorage } from './client';

/** Base URL for `api.json` routes (root paths like `/signin`, `/events`, …). */
export function getHospitalityApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_HOSPITALITY_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:4001'
  );
}

export class HospitalityApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HospitalityApiError';
  }
}

export async function hospitalityRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${getHospitalityApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const token = tokenStorage.getAccess();

  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    tokenStorage.clear();
    throw new HospitalityApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = typeof body?.detail === 'string' ? body.detail : res.statusText;
    throw new HospitalityApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
