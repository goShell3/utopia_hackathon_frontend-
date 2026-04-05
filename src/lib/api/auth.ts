import { client, tokenStorage } from './client';
import { hospitalityRequest } from './hospitalityClient';
import type { Token, UserCreate, UserResponse, UserLogin } from '@/types';

export const authService = {
  /** `api.json`: `POST /signin` — returns `access_token` / `token_type`. */
  login: async (credentials: UserLogin): Promise<Token> => {
    const token = await hospitalityRequest<Token>('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    tokenStorage.set(token.access_token);
    return token;
  },

  register: (data: UserCreate) =>
    client.post<UserResponse>('/auth/register', data),

  me: () => client.get<UserResponse>('/auth/me'),

  logout: () => tokenStorage.clear(),
};
