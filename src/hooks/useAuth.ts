import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { authService } from '@/lib/api/auth';
import type { UserLogin } from '@/types';

const USER_KEY = 'utopia_user';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) throw new Error('Not authenticated');
      return JSON.parse(stored);
    },
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem(USER_KEY);
    queryClient.clear();
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: UserLogin) => authService.login(credentials),
  });
}
