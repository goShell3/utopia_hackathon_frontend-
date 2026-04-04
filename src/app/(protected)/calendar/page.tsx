'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventList } from '@/components/calendar/EventList';
import { FetchEventsDialog } from '@/components/calendar/FetchEventsDialog';
import type { CalendarEvent } from '@/components/calendar/CalendarView';

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toYMD(d);
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Welcome Campaign', date: toYMD(new Date()), type: 'campaign_start', description: 'Onboarding campaign for new leads' },
  { id: '2', title: 'Q2 Campaign Launch', date: toYMD(new Date()), type: 'campaign_start', description: 'Loyalty bonus push' },
  { id: '3', title: 'Team Sync', date: daysFromNow(1), type: 'meeting', description: 'Weekly marketing review' },
  { id: '4', title: 'National Holiday', date: daysFromNow(1), type: 'holiday', description: 'Public holiday — no outreach' },
  { id: '5', title: 'Churn Prevention End', date: daysFromNow(3), type: 'campaign_end', description: 'Re-engagement campaign wrap-up' },
  { id: '6', title: 'Partner Gathering', date: daysFromNow(5), type: 'gathering', description: 'Hotel partner networking event' },
  { id: '7', title: 'Stakeholder Meeting', date: daysFromNow(7), type: 'meeting', description: 'Monthly performance review' },
  { id: '8', title: 'Upsell Campaign End', date: daysFromNow(7), type: 'campaign_end', description: 'Premium tier offer wrap-up' },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(toYMD(new Date()));
  const [events, setEvents] = React.useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const selectedEvents = events.filter(e => e.date === selectedDate);

  function handleAddEvents(newEvents: CalendarEvent[]) {
    setEvents(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      return [...prev, ...newEvents.filter(e => !existingIds.has(e.id))];
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Calendar</h1>
          <p className="technical-label text-neutral-500 mt-1">Schedule & event management</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-black italic uppercase tracking-tight text-xs hover:bg-neutral-800 transition-colors shrink-0 mt-1"
        >
          <Download className="w-3.5 h-3.5" />
          Fetch Events
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div>
          <EventList date={selectedDate} events={selectedEvents} />
        </div>
      </div>

      <FetchEventsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddEvents={handleAddEvents}
      />
    </div>
  );
}
