import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '@/lib/api/calendar';
import type { CalendarEventCreate, ListCalendarEventsParams } from '@/types';

const CALENDAR_KEY = ['calendar', 'events'] as const;

export function useCalendarEvents(params?: ListCalendarEventsParams) {
  return useQuery({
    queryKey: [...CALENDAR_KEY, params],
    queryFn: () => calendarService.list(params),
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CalendarEventCreate) => calendarService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CALENDAR_KEY }),
  });
}
