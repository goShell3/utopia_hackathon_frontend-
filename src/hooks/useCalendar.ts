import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/calendar';
import type { EventSearchRequest } from '@/types';

export const EVENTS_KEY = ['events'] as const;

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: () => eventsService.list(),
  });
}

export function useSearchEvents() {
  return useMutation({
    mutationFn: (data: EventSearchRequest) => eventsService.search(data),
  });
}

export function useEventCampaigns(eventId: string) {
  return useQuery({
    queryKey: [...EVENTS_KEY, eventId, 'campaigns'],
    queryFn: () => eventsService.campaigns(eventId),
    enabled: !!eventId,
  });
}

export function useGenerateCampaigns() {
  return useMutation({
    mutationFn: (eventId: string) => eventsService.campaigns(eventId),
  });
}
