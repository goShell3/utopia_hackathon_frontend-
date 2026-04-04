import { client } from './client';
import type {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignListResponse,
  CampaignStats,
  ListCampaignsParams,
} from '@/types';

export const campaignsService = {
  list: (params?: ListCampaignsParams) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return client.get<CampaignListResponse>(`/api/v1/campaigns${query ? `?${query}` : ''}`);
  },

  get: (id: string) => client.get<Campaign>(`/api/v1/campaigns/${id}`),

  create: (data: CampaignCreate) => client.post<Campaign>('/api/v1/campaigns', data),

  update: (id: string, data: CampaignUpdate) =>
    client.put<Campaign>(`/api/v1/campaigns/${id}`, data),

  delete: (id: string) => client.delete<void>(`/api/v1/campaigns/${id}`),

  activate: (id: string) => client.post<Campaign>(`/api/v1/campaigns/${id}/activate`),

  pause: (id: string) => client.post<Campaign>(`/api/v1/campaigns/${id}/pause`),

  execute: (id: string, leadIds?: string[]) =>
    client.post<unknown>(`/api/v1/campaigns/${id}/execute`, leadIds ?? null),

  stats: (id: string) => client.get<CampaignStats>(`/api/v1/campaigns/${id}/stats`),

  targetLeads: (id: string) => client.get<unknown>(`/api/v1/campaigns/${id}/leads`),
};
