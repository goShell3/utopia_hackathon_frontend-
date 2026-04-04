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
    return client.get<LeadListResponse>(`/api/v1/leads${query ? `?${query}` : ''}`);
  },

  get: (id: string) => client.get<Lead>(`/api/v1/leads/${id}`),

  create: (data: LeadCreate) => client.post<Lead>('/api/v1/leads', data),

  update: (id: string, data: LeadUpdate) => client.put<Lead>(`/api/v1/leads/${id}`, data),

  delete: (id: string) => client.delete<void>(`/api/v1/leads/${id}`),

  updateSegment: (id: string, data: LeadSegmentUpdate) =>
    client.put<Lead>(`/api/v1/leads/${id}/segment`, data),

  score: (id: string) => client.post<LeadScoreResponse>(`/api/v1/leads/${id}/score`),

  bulkScore: (limit?: number) =>
    client.post<unknown>(`/api/v1/leads/score/bulk${limit ? `?limit=${limit}` : ''}`),

  summary: () => client.get<unknown>('/api/v1/leads/stats/summary'),
};
