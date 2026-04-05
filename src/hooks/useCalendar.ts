import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsService } from '@/lib/api/calendar';
import { events as staticEvents } from '@/data/events';
import type { EventSearchRequest } from '@/types';

export const EVENTS_KEY = ['events'] as const;

const CATEGORY_TO_TYPE: Record<string, string> = {
  religious: 'holiday',
  conference: 'meeting',
  festival: 'gathering',
  diaspora: 'gathering',
  education: 'meeting',
};

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: async () =>
      staticEvents.map(e => ({
        id: e.id,
        title: e.name,
        description: e.description ?? null,
        category: e.category,
        start_time: e.startDate + 'T00:00:00',
        end_time: e.endDate + 'T00:00:00',
        location_name: e.locations.venues.length
          ? e.locations.venues.map(v => v.city).filter((c, i, a) => a.indexOf(c) === i).join(', ') + ', ' + e.locations.country
          : e.locations.country,
        source_url: null,
        created_at: new Date().toISOString(),
        venues: e.locations.venues,
        demandImpact: e.demandImpact,
        leadTimeDays: e.leadTimeDays,
        hotelStrategy: e.hotelStrategy,
      })),
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
