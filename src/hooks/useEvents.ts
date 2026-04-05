import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/events';
import { events as staticEvents } from '@/data/events';
import type { EventResponse, EventSearchRequest } from '@/types';
import { EVENTS_KEY } from './useCalendar';

function staticEventsAsResponse(): EventResponse[] {
  return staticEvents.map((e) => ({
    id: e.id,
    title: e.name,
    description: e.description ?? null,
    category: e.category,
    start_time: e.startDate + 'T00:00:00',
    end_time: e.endDate + 'T00:00:00',
    location_name: e.locations.venues.length
      ? e.locations.venues.map((v) => v.city).filter((c, i, a) => a.indexOf(c) === i).join(', ') + ', ' + e.locations.country
      : e.locations.country,
    source_url: null,
    created_at: new Date().toISOString(),
  }));
}

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: async (): Promise<EventResponse[]> => {
      try {
        return await eventsService.list();
      } catch (err) {
        console.warn('[events] GET /events failed, using static data', err);
        return staticEventsAsResponse();
      }
    },
  });
}

export function useSearchEvents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventSearchRequest) => eventsService.search(data),
    onSuccess: (data) => queryClient.setQueryData(EVENTS_KEY, data),
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
