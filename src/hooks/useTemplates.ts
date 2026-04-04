import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '@/lib/api/templates';
import { queryKeys } from './queryKeys';
import type { MessageTemplateCreate, ListTemplatesParams } from '@/types';

export function useTemplates(params?: ListTemplatesParams) {
  return useQuery({
    queryKey: queryKeys.templates.list(params),
    queryFn: () => templatesService.list(params),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.templates.detail(id),
    queryFn: () => templatesService.get(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MessageTemplateCreate) => templatesService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.templates.all() }),
  });
}
