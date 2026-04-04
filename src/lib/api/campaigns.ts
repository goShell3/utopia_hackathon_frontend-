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
    return client.get<CampaignListResponse>(`/campaigns${query ? `?${query}` : ''}`);
  },

  get: (id: string) => client.get<Campaign>(`/campaigns/${id}`),

  create: (data: CampaignCreate) => client.post<Campaign>('/campaigns', data),

  update: (id: string, data: CampaignUpdate) =>
    client.put<Campaign>(`/campaigns/${id}`, data),

  delete: (id: string) => client.delete<void>(`/campaigns/${id}`),

  activate: (id: string) => client.post<Campaign>(`/campaigns/${id}/activate`),

  pause: (id: string) => client.post<Campaign>(`/campaigns/${id}/pause`),

  execute: (id: string, leadIds?: string[]) =>
    client.post<unknown>(`/campaigns/${id}/execute`, leadIds ?? null),

  stats: (id: string) => client.get<CampaignStats>(`/campaigns/${id}/stats`),

  targetLeads: (id: string) => client.get<unknown>(`/campaigns/${id}/leads`),
};
