import { client, tokenStorage } from './client';
import type { Token, UserLogin, UserCreate, UserResponse } from '@/types';

export const authService = {
  login: async (credentials: UserLogin): Promise<Token> => {
    const token = await client.post<Token>('/api/v1/auth/login', credentials);
    tokenStorage.set(token.access_token, token.refresh_token);
    return token;
  },

  register: (data: UserCreate) =>
    client.post<UserResponse>('/api/v1/auth/register', data),

  me: () => client.get<UserResponse>('/api/v1/auth/me'),

  logout: () => tokenStorage.clear(),
};
