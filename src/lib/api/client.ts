const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';
const API_PREFIX = '/api/v1';

const TOKEN_KEY = 'utopia_access_token';
const REFRESH_KEY = 'utopia_refresh_token';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  set: (access: string) => {
    localStorage.setItem(TOKEN_KEY, access);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}, options: { skipPrefix?: boolean } = {}): Promise<T> {
  const token = tokenStorage.getAccess();
  const url = options.skipPrefix ? `${BASE_URL}${path}` : `${BASE_URL}${API_PREFIX}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    tokenStorage.clear();
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error('[API ERROR]', res.status, path, body);
    throw new ApiError(res.status, body?.detail ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const client = {
  get: <T>(path: string, options?: { skipPrefix?: boolean }) => request<T>(path, {}, options),
  post: <T>(path: string, body?: unknown, options?: { skipPrefix?: boolean }) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }, options),
  put: <T>(path: string, body?: unknown, options?: { skipPrefix?: boolean }) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }, options),
  delete: <T>(path: string, options?: { skipPrefix?: boolean }) => request<T>(path, { method: 'DELETE' }, options),
};
