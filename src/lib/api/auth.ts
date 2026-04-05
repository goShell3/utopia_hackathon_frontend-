import { client, tokenStorage } from './client';
import type { Token, UserLogin, UserCreate, UserResponse } from '@/types';

export const authService = {
  login: async (credentials: UserLogin): Promise<Token> => {
    const token = await client.post<Token>('/signin', credentials, { skipPrefix: true });
    tokenStorage.set(token.access_token);
    return token;
  },

  register: (data: UserCreate) =>
    client.post<UserResponse>('/auth/register', data),

  me: () => client.get<UserResponse>('/auth/me'),

  logout: () => tokenStorage.clear(),
};
