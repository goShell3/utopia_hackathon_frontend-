import { tokenStorage } from './client';
import { getHospitalityApiBaseUrl } from './hospitalityClient';
import { hospitalityRequest } from './hospitalityClient';

export const customersService = {
  list: () => hospitalityRequest<unknown[]>('/customers'),

  import: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = tokenStorage.getAccess();
    const res = await fetch(`${getHospitalityApiBaseUrl()}/customers/import`, {
      method: 'POST',
      body: formData,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(typeof body?.detail === 'string' ? body.detail : res.statusText);
    }
    return res.json();
  },
};
