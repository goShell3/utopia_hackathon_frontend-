import { client } from './client';
import { hospitalityRequest } from './hospitalityClient';
import type {
  EventResponse,
  AdCampaignResponse,
  AdTemplateResponse,
  EventSearchRequest,
  LegacyEventSearchRequest,
} from '@/types';
import type { HospitalityEventSearchRequest } from '@/types/hospitalityApi';

function toHospitalitySearch(data: EventSearchRequest): HospitalityEventSearchRequest {
  if ('timeframe' in data) return data;
  const legacy = data as LegacyEventSearchRequest;
  const cats = [legacy.query, legacy.location].filter((x): x is string => Boolean(x));
  return {
    timeframe: '3_months',
    custom_days: null,
    categories: cats.length ? cats : null,
  };
}

function normalizeCampaigns(
  raw: AdCampaignResponse | AdCampaignResponse[]
): AdCampaignResponse[] {
  return Array.isArray(raw) ? raw : [raw];
}

/** Routes from `api.json` (Hospitality Event Search API) — base URL from `getHospitalityApiBaseUrl()`. */
export const eventsService = {
  list: () => hospitalityRequest<EventResponse[]>('/events'),

  search: (data: EventSearchRequest) =>
    hospitalityRequest<EventResponse[]>('/search-events', {
      method: 'POST',
      body: JSON.stringify(toHospitalitySearch(data)),
    }),

  /** api.json: `POST /events/{event_id}/campaign` */
  generateCampaigns: (eventId: string) =>
    hospitalityRequest<AdCampaignResponse | AdCampaignResponse[]>(`/events/${eventId}/campaign`, {
      method: 'POST',
    }).then(normalizeCampaigns),

  /** Not defined in `api.json`; kept for legacy hooks (may hit a separate backend path). */
  generateTemplate: (campaignId: string) =>
    client.post<AdTemplateResponse>(`/campaigns/${campaignId}/templates`, undefined, { skipPrefix: true }),
};
