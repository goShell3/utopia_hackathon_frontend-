import { client } from './client';

export const customersService = {
  list: () =>
    client.get<unknown[]>('/customers', { skipPrefix: true }),

  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(
      `${process.env.NEXT_PUBLIC_API_URL }/customers/import`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('utopia_access_token') ?? ''}`,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    ).then(r => r.json());
  },
};
