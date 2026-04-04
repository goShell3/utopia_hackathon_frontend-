import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/lib/api/campaigns';
import { queryKeys } from './queryKeys';
import type { CampaignCreate, CampaignUpdate, ListCampaignsParams } from '@/types';

export function useCampaigns(params?: ListCampaignsParams) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(params),
    queryFn: () => campaignsService.list(params),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignsService.get(id),
    enabled: !!id,
  });
}

export function useCampaignStats(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.stats(id),
    queryFn: () => campaignsService.stats(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CampaignCreate) => campaignsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all() }),
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignUpdate }) =>
      campaignsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all() });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all() }),
  });
}

export function useActivateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all() });
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsService.pause(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all() });
    },
  });
}

export function useExecuteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, leadIds }: { id: string; leadIds?: string[] }) =>
      campaignsService.execute(id, leadIds),
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.stats(id) }),
  });
}

export function useCampaignTargetLeads(id: string) {
  return useQuery({
    queryKey: [...queryKeys.campaigns.detail(id), 'leads'],
    queryFn: () => campaignsService.targetLeads(id),
    enabled: !!id,
  });
}
