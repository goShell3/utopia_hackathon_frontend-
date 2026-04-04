import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/auth';
import { queryKeys } from './queryKeys';
import type { UserLogin, UserCreate } from '@/types';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authService.me,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: UserLogin) => authService.login(credentials),
    onSuccess: async () => {
      const user = await authService.me();
      queryClient.setQueryData(queryKeys.auth.me(), user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: UserCreate) => authService.register(data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    authService.logout();
    queryClient.clear();
  };
}
