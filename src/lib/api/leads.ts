import { client } from './client';
import type {
  Lead,
  LeadCreate,
  LeadUpdate,
  LeadListResponse,
  LeadScoreResponse,
  LeadSegmentUpdate,
  ListLeadsParams,
} from '@/types';

export const leadsService = {
  list: (params?: ListLeadsParams) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return client.get<LeadListResponse>(`/leads${query ? `?${query}` : ''}`);
  },

  get: (id: string) => client.get<Lead>(`/leads/${id}`),

  create: (data: LeadCreate) => client.post<Lead>('/leads', data),

  update: (id: string, data: LeadUpdate) => client.put<Lead>(`/leads/${id}`, data),

  delete: (id: string) => client.delete<void>(`/leads/${id}`),

  updateSegment: (id: string, data: LeadSegmentUpdate) =>
    client.put<Lead>(`/leads/${id}/segment`, data),

  score: (id: string) => client.post<LeadScoreResponse>(`/leads/${id}/score`),

  bulkScore: (limit?: number) =>
    client.post<unknown>(`/leads/score/bulk${limit ? `?limit=${limit}` : ''}`),

  summary: () => client.get<unknown>('/leads/stats/summary'),
};
