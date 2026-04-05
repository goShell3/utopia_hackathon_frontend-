import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/calendar';
import { events as staticEvents } from '@/data/events';
import type { EventResponse, EventSearchRequest } from '@/types';

export const EVENTS_KEY = ['events'] as const;

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

/** Prefer `GET /events` (`api.json`); on failure keep the in-repo static event catalog. */
export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: async (): Promise<EventResponse[]> => {
      try {
        return await eventsService.list();
      } catch (err) {
        console.warn('[calendar] GET /events failed, using static data', err);
        return staticEventsAsResponse();
      }
    },
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
