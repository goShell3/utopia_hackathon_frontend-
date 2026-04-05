import { client } from './client';
import type { EventResponse, EventSearchRequest, AdCampaignResponse, AdTemplateResponse } from '@/types';

export const eventsService = {
  list: () =>
    client.get<EventResponse[]>('/events', { skipPrefix: true }),

  search: (data: EventSearchRequest) =>
    client.post<EventResponse[]>('/search-events', data, { skipPrefix: true }),

  generateCampaigns: (eventId: string) =>
    client.post<AdCampaignResponse[]>(`/events/${eventId}/campaigns`, undefined, { skipPrefix: true }),

  generateTemplate: (campaignId: string) =>
    client.post<AdTemplateResponse>(`/campaigns/${campaignId}/templates`, undefined, { skipPrefix: true }),
};
