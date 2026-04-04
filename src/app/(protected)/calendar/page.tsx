'use client';

import React from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventList } from '@/components/calendar/EventList';
import type { CalendarEvent } from '@/components/calendar/CalendarView';

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Welcome SMS Blast', date: toYMD(new Date()), type: 'sms', description: 'Onboarding campaign for new leads' },
  { id: '2', title: 'Q2 Campaign Launch', date: toYMD(new Date()), type: 'campaign', description: 'Loyalty bonus push' },
  { id: '3', title: 'Team Sync', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 1))), type: 'meeting', description: 'Weekly marketing review' },
  { id: '4', title: 'Follow-up Reminder', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 1))), type: 'reminder' },
  { id: '5', title: 'Churn Prevention SMS', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 3))), type: 'sms', description: 'Re-engagement for inactive leads' },
  { id: '6', title: 'Upsell Campaign', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 5))), type: 'campaign', description: 'Premium tier offer' },
  { id: '7', title: 'Stakeholder Meeting', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 7))), type: 'meeting', description: 'Monthly performance review' },
  { id: '8', title: 'Data Sync Reminder', date: toYMD(new Date(new Date().setDate(new Date().getDate() + 7))), type: 'reminder' },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(toYMD(new Date()));

  const selectedEvents = MOCK_EVENTS.filter(e => e.date === selectedDate);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="display-header text-4xl italic tracking-tighter">Calendar</h1>
        <p className="technical-label text-neutral-500 mt-1">Schedule & event management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView
            events={MOCK_EVENTS}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div>
          <EventList date={selectedDate} events={selectedEvents} />
        </div>
      </div>
    </div>
  );
}
