import { client } from './client';
import type { EventResponse, AdCampaignResponse, EventSearchRequest } from '@/types';

export const eventsService = {
  list: () =>
    client.get<EventResponse[]>('/events', { skipPrefix: true }),

  search: (data: EventSearchRequest) =>
    client.post<EventResponse[]>('/search-events', data, { skipPrefix: true }),

  campaigns: (eventId: string) =>
    client.post<AdCampaignResponse[]>(`/events/${eventId}/campaigns`, undefined, { skipPrefix: true }),
};
