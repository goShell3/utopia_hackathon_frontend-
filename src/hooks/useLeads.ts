import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '@/lib/api/leads';
import { queryKeys } from './queryKeys';
import type { LeadCreate, LeadUpdate, LeadSegmentUpdate, ListLeadsParams, Lead, LeadListResponse } from '@/types';
import { DUMMY_LEADS, matchLeadToSegment } from '@/data/lead';
import type { Segment } from '@/data/lead';

const MOCK_SEGMENTS: Segment[] = [
  { id: 'hot',         name: 'hot',         filters: {} },
  { id: 'warm',        name: 'warm',        filters: {} },
  { id: 'cold',        name: 'cold',        filters: {} },
  { id: 'unqualified', name: 'unqualified', filters: {} },
];

function buildMockResponse(params?: ListLeadsParams): LeadListResponse {
  const all = Object.values(DUMMY_LEADS) as Lead[];
  const page = params?.page ?? 1;
  const pageSize = params?.page_size ?? 10;
  const search = params?.search?.toLowerCase() ?? '';
  const segmentFilter = params?.segment ?? '';
  const sourceFilter = params?.source ?? '';

  const filtered = all.filter(l => {
    if (search && !`${l.first_name} ${l.last_name} ${l.phone} ${l.email ?? ''}`.toLowerCase().includes(search)) return false;
    if (sourceFilter && l.source !== sourceFilter) return false;
    if (segmentFilter) {
      const seg = MOCK_SEGMENTS.find(s => s.id === segmentFilter);
      if (seg) {
        // simple segment match: just compare segment field directly
        if (l.segment !== segmentFilter) return false;
      }
    }
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, pages, page };
}

export function useLeads(params?: ListLeadsParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: async () => {
      try {
        return await leadsService.list(params);
      } catch {
        return buildMockResponse(params);
      }
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: async () => {
      try {
        return await leadsService.get(id);
      } catch {
        return (DUMMY_LEADS[id] ?? DUMMY_LEADS['1']) as Lead;
      }
    },
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
