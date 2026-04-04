import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '@/lib/api/leads';
import { queryKeys } from './queryKeys';
import type { LeadCreate, LeadUpdate, LeadSegmentUpdate, ListLeadsParams } from '@/types';

export function useLeads(params?: ListLeadsParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: () => leadsService.list(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => leadsService.get(id),
    enabled: !!id,
  });
}

export function useLeadsSummary() {
  return useQuery({
    queryKey: queryKeys.leads.summary(),
    queryFn: leadsService.summary,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadCreate) => leadsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leads.all() }),
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadUpdate }) =>
      leadsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all() });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leads.all() }),
  });
}

export function useUpdateLeadSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadSegmentUpdate }) =>
      leadsService.updateSegment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all() });
    },
  });
}

export function useScoreLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsService.score(id),
    onSuccess: (_, id) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) }),
  });
}

export function useBulkScoreLeads() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (limit?: number) => leadsService.bulkScore(limit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leads.all() }),
  });
}
