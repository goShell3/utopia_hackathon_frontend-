import { client } from './client';
import type { CalendarEventListResponse, CalendarEventCreate, CalendarEventResponse, ListCalendarEventsParams } from '@/types';

export const calendarService = {
  list: (params?: ListCalendarEventsParams) => {
    const query = new URLSearchParams();
    if (params?.from_date) query.set('from_date', params.from_date);
    if (params?.to_date) query.set('to_date', params.to_date);
    const qs = query.toString();
    return client.get<CalendarEventListResponse>(`/calendar/events${qs ? `?${qs}` : ''}`);
  },
  create: (data: CalendarEventCreate) =>
    client.post<CalendarEventResponse>('/calendar/events', data),
};
