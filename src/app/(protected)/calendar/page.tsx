'use client';

import React from 'react';
import { Download, Filter, ChevronDown } from 'lucide-react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventList } from '@/components/calendar/EventList';
import { FetchEventsDialog } from '@/components/calendar/FetchEventsDialog';
import type { CalendarEvent } from '@/components/calendar/CalendarView';
import { TYPE_COLORS } from '@/components/calendar/CalendarView';
import { cn } from '@/lib/utils';

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
  const [showFilter, setShowFilter] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const [activeTypes, setActiveTypes] = React.useState<Set<CalendarEvent['type']>>(
    new Set(Object.keys(TYPE_COLORS) as CalendarEvent['type'][])
  );

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (type: CalendarEvent['type']) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const filteredEvents = events.filter(e => activeTypes.has(e.type));
  const selectedEvents = filteredEvents.filter(e => e.date === selectedDate);

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
        <div className="flex items-center gap-3">
          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className={cn(
                'flex items-center gap-2 h-9 px-4 border text-[10px] font-black italic uppercase transition-colors',
                showFilter || activeTypes.size < Object.keys(TYPE_COLORS).length
                  ? 'border-utopia text-utopia bg-utopia/5'
                  : 'border-neutral-200 text-neutral-500 bg-white hover:border-black hover:text-black'
              )}
            >
              <Filter size={12} />
              Filter
              {activeTypes.size < Object.keys(TYPE_COLORS).length && (
                <span className="bg-utopia text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {Object.keys(TYPE_COLORS).length - activeTypes.size}
                </span>
              )}
              <ChevronDown size={10} className={cn('transition-transform', showFilter && 'rotate-180')} />
            </button>

            {showFilter && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-neutral-200 shadow-xl p-4 w-52 space-y-1">
                <p className="text-[9px] font-black italic uppercase text-neutral-400 mb-2">Event Types</p>
                {(Object.entries(TYPE_COLORS) as [CalendarEvent['type'], string][]).map(([type, color]) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-black italic uppercase transition-colors hover:bg-neutral-50"
                  >
                    <span className={cn('w-2 h-2 rounded-full shrink-0', activeTypes.has(type) ? color : 'bg-neutral-300')} />
                    <span className={cn('flex-1 text-left', activeTypes.has(type) ? 'text-black' : 'text-neutral-400')}>{type.replace('_', ' ')}</span>
                    <span className={cn(
                      'w-4 h-4 border flex items-center justify-center shrink-0 transition-colors',
                      activeTypes.has(type) ? 'border-utopia bg-utopia' : 'border-neutral-300'
                    )}>
                      {activeTypes.has(type) && <span className="w-2 h-2 bg-white" style={{ clipPath: 'polygon(20% 50%, 0% 70%, 40% 100%, 100% 20%, 80% 0%, 40% 60%)' }} />}
                    </span>
                  </button>
                ))}
                {activeTypes.size < Object.keys(TYPE_COLORS).length && (
                  <button
                    onClick={() => setActiveTypes(new Set(Object.keys(TYPE_COLORS) as CalendarEvent['type'][]))}
                    className="w-full text-[9px] font-black italic uppercase text-utopia hover:underline text-left pt-2 border-t border-neutral-100 mt-1"
                  >Show all</button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-black italic uppercase tracking-tight text-xs hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Fetch Events
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView events={filteredEvents} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
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
