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
    client.post<MessageGenerationResponse>('/ai/generate-message', data),

  generateMessageBatch: (data: BatchMessageRequest) =>
    client.post<unknown>('/ai/generate-message-batch', data),

  scoreLead: (leadId: string, params?: { include_explanation?: boolean; include_recommendations?: boolean }) => {
    const query = params ? `?${new URLSearchParams(params as unknown as Record<string, string>).toString()}` : '';
    return client.post<AILeadScoringResponse>(`/ai/score-lead/${leadId}${query}`);
  },

  scoreLeadsBatch: (leadIds: string[]) =>
    client.post<unknown>('/ai/score-leads-batch', leadIds),

  getRecommendations: (data: CampaignAdvisorRequest) =>
    client.post<CampaignAdvisorResponse>('/ai/campaign-recommendations', data),

  enrichLead: (leadId: string, params?: { include_predictions?: boolean; include_preferences?: boolean; include_recommendations?: boolean }) => {
    const query = params ? `?${new URLSearchParams(params as unknown as Record<string, string>).toString()}` : '';
    return client.post<LeadEnrichmentResponse>(`/ai/enrich-lead/${leadId}${query}`);
  },

  getUsageStats: () => client.get<AIUsageStats>('/ai/usage-stats'),

  clearCache: () => client.post<void>('/ai/clear-cache'),

  healthCheck: () => client.get<unknown>('/ai/health'),

  testGeneration: (data: Record<string, unknown>) => client.post<MessageGenerationResponse>('/ai/test-generation', data),
};
