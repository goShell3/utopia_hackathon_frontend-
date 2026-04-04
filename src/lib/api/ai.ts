import { client } from './client';
import type {
  AIUsageStats,
  MessageGenerationRequest,
  MessageGenerationResponse,
  BatchMessageRequest,
  AILeadScoringResponse,
  CampaignAdvisorRequest,
  CampaignAdvisorResponse,
  LeadEnrichmentResponse,
} from '@/types';

export const aiService = {
  generateMessage: (data: MessageGenerationRequest) =>
    client.post<MessageGenerationResponse>('/api/v1/ai/generate-message', data),

  generateMessageBatch: (data: BatchMessageRequest) =>
    client.post<unknown>('/api/v1/ai/generate-message-batch', data),

  scoreLead: (leadId: string, params?: { include_explanation?: boolean; include_recommendations?: boolean }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return client.post<AILeadScoringResponse>(`/api/v1/ai/score-lead/${leadId}${query}`);
  },

  scoreLeadsBatch: (leadIds: string[]) =>
    client.post<unknown>('/api/v1/ai/score-leads-batch', leadIds),

  getRecommendations: (data: CampaignAdvisorRequest) =>
    client.post<CampaignAdvisorResponse>('/api/v1/ai/campaign-recommendations', data),

  enrichLead: (leadId: string, params?: { include_predictions?: boolean; include_preferences?: boolean; include_recommendations?: boolean }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return client.post<LeadEnrichmentResponse>(`/api/v1/ai/enrich-lead/${leadId}${query}`);
  },

  getUsageStats: () => client.get<AIUsageStats>('/api/v1/ai/usage-stats'),

  clearCache: () => client.post<void>('/api/v1/ai/clear-cache'),

  healthCheck: () => client.get<unknown>('/api/v1/ai/health'),

  testGeneration: (data: any) => client.post<MessageGenerationResponse>('/api/v1/ai/test-generation', data),
};
