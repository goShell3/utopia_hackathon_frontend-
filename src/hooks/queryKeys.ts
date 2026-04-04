import type { ListLeadsParams, ListCampaignsParams, ListTemplatesParams, CampaignAdvisorRequest } from '@/types';

export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  leads: {
    all: () => ['leads'] as const,
    list: (params?: ListLeadsParams) => ['leads', 'list', params] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
    summary: () => ['leads', 'summary'] as const,
  },
  campaigns: {
    all: () => ['campaigns'] as const,
    list: (params?: ListCampaignsParams) => ['campaigns', 'list', params] as const,
    detail: (id: string) => ['campaigns', 'detail', id] as const,
    stats: (id: string) => ['campaigns', 'stats', id] as const,
    targetLeads: (id: string) => ['campaigns', 'targetLeads', id] as const,
  },
  templates: {
    all: () => ['templates'] as const,
    list: (params?: ListTemplatesParams) => ['templates', 'list', params] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  ai: {
    health: () => ['ai', 'health'] as const,
    usage: () => ['ai', 'usage'] as const,
    score: (leadId: string) => ['ai', 'score', leadId] as const,
    enrichment: (leadId: string) => ['ai', 'enrichment', leadId] as const,
    recommendations: (params?: CampaignAdvisorRequest) => ['ai', 'recommendations', params] as const,
  },
};
