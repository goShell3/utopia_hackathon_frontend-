'use client';

import React from 'react';
import { Download, Filter, ChevronDown, Search } from 'lucide-react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventList } from '@/components/calendar/EventList';
import { FetchEventsDialog } from '@/components/calendar/FetchEventsDialog';
import type { CalendarEvent } from '@/components/calendar/CalendarView';
import { TYPE_COLORS } from '@/components/calendar/CalendarView';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useCalendar';
import type { EventResponse } from '@/types';

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

function toCalendarEvent(e: EventResponse): CalendarEvent {
  return {
    id: e.id,
    title: e.title,
    date: e.start_time ? e.start_time.split('T')[0] : toYMD(new Date()),
    type: 'gathering',
    description: e.description ?? undefined,
  };
}

export default function CalendarPage() {
  const { data: remoteEvents = [] } = useEvents();
  const [selectedDate, setSelectedDate] = React.useState(toYMD(new Date()));
  const [extraEvents, setExtraEvents] = React.useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const events = React.useMemo(
    () => [...remoteEvents.map(toCalendarEvent), ...extraEvents],
    [remoteEvents, extraEvents]
  );
  const [showFilter, setShowFilter] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
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

  const [search, setSearch] = React.useState('');

  const filteredEvents = events.filter(e =>
    activeTypes.has(e.type) &&
    (!search || e.title.toLowerCase().includes(search.toLowerCase()))
  );
  const selectedEvents = filteredEvents.filter(e => e.date === selectedDate);

  function handleAddEvents(newEvents: CalendarEvent[]) {
    setExtraEvents(prev => {
      const existingIds = new Set([...remoteEvents.map(e => e.id), ...prev.map(e => e.id)]);
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
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="h-9 pl-8 pr-3 border border-neutral-200 text-[10px] font-black italic uppercase placeholder:normal-case placeholder:not-italic placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:border-black w-48"
            />
          </div>
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
          <CalendarView
            events={filteredEvents}
            selectedDate={selectedDate}
            onSelectDate={(date) => { setSelectedDate(date); setSelectedEventId(null); }}
            onSelectEvent={(e) => setSelectedEventId(e.id)}
          />
        </div>
        <div>
          <EventList date={selectedDate} events={selectedEvents} selectedEventId={selectedEventId ?? undefined} />
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
