'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from './CalendarView';
import { TYPE_COLORS } from './CalendarView';

const TYPE_LABELS: Record<CalendarEvent['type'], string> = {
  campaign_start: 'Campaign Start',
  campaign_end: 'Campaign End',
  holiday: 'Holiday',
  meeting: 'Meeting',
  gathering: 'Gathering',
};

interface Props {
  date: string;
  events: CalendarEvent[];
}

export function EventList({ date, events }: Props) {
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('default', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="industrial-card p-6 flex flex-col gap-4 h-full">
      <div>
        <h2 className="display-header text-xl italic">Events</h2>
        <p className="technical-label text-[9px] text-neutral-400 mt-1">{formatted}</p>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-neutral-300">
          <CalendarDays className="w-10 h-10" />
          <span className="technical-label text-[10px]">No events for this day</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map(event => (
            <li key={event.id}>
              <Link
                href={`/calendar/${event.id}`}
                className="flex items-start gap-3 p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all group"
              >
                <span className={cn('mt-1 w-2.5 h-2.5 rounded-full shrink-0', TYPE_COLORS[event.type])} />
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-sm font-black italic uppercase tracking-tight truncate">{event.title}</span>
                  {event.description && (
                    <span className="text-xs text-neutral-500 truncate">{event.description}</span>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span className="technical-label text-[9px]">{TYPE_LABELS[event.type]}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0 mt-1" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
