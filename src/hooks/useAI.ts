import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/lib/api/ai';
import { queryKeys } from './queryKeys';
import type { 
  MessageGenerationRequest, 
  CampaignAdvisorRequest, 
  BatchMessageRequest 
} from '@/types';

export function useAIScore(leadId: string, params?: { include_explanation?: boolean; include_recommendations?: boolean }) {
  return useQuery({
    queryKey: queryKeys.ai.score(leadId),
    queryFn: () => aiService.scoreLead(leadId, params),
    enabled: !!leadId,
  });
}

export function useAIEnrichment(leadId: string, params?: { include_predictions?: boolean; include_preferences?: boolean }) {
  return useQuery({
    queryKey: queryKeys.ai.enrichment(leadId),
    queryFn: () => aiService.enrichLead(leadId, params),
    enabled: !!leadId,
  });
}

export function useAIRecommendations(params: CampaignAdvisorRequest) {
  return useQuery({
    queryKey: queryKeys.ai.recommendations(params),
    queryFn: () => aiService.getRecommendations(params),
    enabled: !!params,
  });
}

export function useAIUsageStats() {
  return useQuery({
    queryKey: queryKeys.ai.usage(),
    queryFn: aiService.getUsageStats,
  });
}

export function useGenerateMessage() {
  return useMutation({
    mutationFn: (data: MessageGenerationRequest) => aiService.generateMessage(data),
  });
}

export function useGenerateMessageBatch() {
  return useMutation({
    mutationFn: (data: BatchMessageRequest) => aiService.generateMessageBatch(data),
  });
}

export function useScoreLeadsBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadIds: string[]) => aiService.scoreLeadsBatch(leadIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'score'] });
    },
  });
}
