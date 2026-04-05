import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/events';
import type { EventSearchRequest } from '@/types';

const EVENTS_KEY = ['events'];

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: eventsService.list,
  });
}

export function useSearchEvents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventSearchRequest) => eventsService.search(data),
    onSuccess: data => queryClient.setQueryData(EVENTS_KEY, data),
  });
}

export function useGenerateCampaigns() {
  return useMutation({
    mutationFn: (eventId: string) => eventsService.generateCampaigns(eventId),
  });
}

export function useGenerateTemplate() {
  return useMutation({
    mutationFn: (campaignId: string) => eventsService.generateTemplate(campaignId),
  });
}
