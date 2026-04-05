'use client';

import React from 'react';
import { X, Sparkles, CalendarPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from './CalendarView';
import { TYPE_COLORS } from './CalendarView';
import { events } from '@/data/events';
import type { EventCategory } from '@/data/events';
import { useSearchEvents } from '@/hooks/useCalendar';
import type { EventResponse } from '@/types';

const CATEGORY_TO_TYPE: Record<EventCategory, CalendarEvent['type']> = {
  religious:  'holiday',
  conference: 'meeting',
  festival:   'gathering',
  diaspora:   'gathering',
  education:  'gathering',
  trade:      'gathering',
  arts:       'gathering',
  sports:     'gathering',
  music:      'gathering',
};

const TIMEFRAMES = [
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: 'Custom', days: 0 },
];

const TIMEFRAME_TO_API: Record<string, '2_weeks' | '1_month' | '3_months' | 'custom'> = {
  '2 Weeks': '2_weeks',
  '1 Month': '1_month',
  '3 Months': '3_months',
  Custom: 'custom',
};

function apiEventToCalendar(e: EventResponse): CalendarEvent {
  const raw = (e.category || '').toLowerCase();
  let type: CalendarEvent['type'] = 'gathering';
  if (raw.includes('business')) type = 'meeting';
  if (raw.includes('cultural') || raw.includes('religious')) type = 'holiday';

  return {
    id: e.id,
    title: e.title,
    date: e.start_time ? e.start_time.split('T')[0] : toYMD(new Date()),
    type,
    description: e.description ?? undefined,
  };
}

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

function generateMockEvents(days: number): CalendarEvent[] {
  const count = Math.min(events.length, Math.min(4 + Math.floor(days / 7) * 2, 20));
  const pool = [...events].sort(() => Math.random() - 0.5).slice(0, count);
  const usedDays = new Set<number>();

  return pool.map((e, i) => {
    let dayOffset: number;
    do { dayOffset = Math.floor(Math.random() * days) + 1; } while (usedDays.has(dayOffset));
    usedDays.add(dayOffset);

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    return {
      id: `fetched-${Date.now()}-${i}`,
      title: e.name,
      type: CATEGORY_TO_TYPE[e.category],
      description: e.description,
      date: toYMD(date),
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAddEvents: (events: CalendarEvent[]) => void;
}

type Step = 'configure' | 'fetching' | 'results';

export function FetchEventsDialog({ open, onClose, onAddEvents }: Props) {
  const [step, setStep] = React.useState<Step>('configure');
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(TIMEFRAMES[1]);
  const [customDays, setCustomDays] = React.useState(60);
  const [fetchedEvents, setFetchedEvents] = React.useState<CalendarEvent[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [added, setAdded] = React.useState(false);
  const searchEvents = useSearchEvents();

  const days = selectedTimeframe.days || customDays;

  async function handleFetch() {
    setStep('fetching');
    const tf = TIMEFRAME_TO_API[selectedTimeframe.label] ?? '1_month';
    try {
      const rows = await searchEvents.mutateAsync({
        timeframe: tf,
        custom_days: tf === 'custom' ? customDays : null,
        categories: null,
      });
      const mapped = rows.map(apiEventToCalendar);
      const finalEvents = mapped.length > 0 ? mapped : generateMockEvents(days);
      setFetchedEvents(finalEvents);
      setSelected(new Set(finalEvents.map((e) => e.id)));
    } catch (err) {
      console.warn('[FetchEventsDialog] POST /search-events failed, using local mock pool', err);
      const events = generateMockEvents(days);
      setFetchedEvents(events);
      setSelected(new Set(events.map((e) => e.id)));
    }
    setStep('results');
  }

  function handleAdd() {
    onAddEvents(fetchedEvents.filter(e => selected.has(e.id)));
    setAdded(true);
    setTimeout(() => {
      onClose();
      resetState();
    }, 1000);
  }

  function resetState() {
    setStep('configure');
    setSelectedTimeframe(TIMEFRAMES[1]);
    setCustomDays(60);
    setFetchedEvents([]);
    setSelected(new Set());
    setAdded(false);
  }

  function handleClose() {
    onClose();
    setTimeout(resetState, 300);
  }

  function toggleEvent(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="display-header text-lg italic">Fetch Events</h2>
            <p className="technical-label text-[9px] text-neutral-400 mt-0.5">
              {step === 'configure' && 'Configure your fetch timeframe'}
              {step === 'fetching' && 'Retrieving events...'}
              {step === 'results' && `${fetchedEvents.length} events found — select to add`}
            </p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configure step */}
        {step === 'configure' && (
          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="technical-label text-[10px] text-neutral-500">TIMEFRAME</span>
              <div className="grid grid-cols-2 gap-2">
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf.label}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={cn(
                      'px-4 py-3 rounded-xl border text-sm font-black italic uppercase tracking-tight transition-all',
                      selectedTimeframe.label === tf.label
                        ? 'bg-black text-white border-black'
                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-700'
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedTimeframe.label === 'Custom' && (
              <div className="flex flex-col gap-2">
                <span className="technical-label text-[10px] text-neutral-500">CUSTOM DAYS</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={7}
                    max={180}
                    value={customDays}
                    onChange={e => setCustomDays(Number(e.target.value))}
                    className="flex-1 accent-black"
                  />
                  <span className="text-sm font-black italic w-20 text-right">{customDays} days</span>
                </div>
              </div>
            )}

            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <p className="text-xs text-neutral-500">
                Will fetch events for the next <span className="font-black text-black">{days} days</span> from today.
                Estimated <span className="font-black text-black">{Math.min(4 + Math.floor(days / 7) * 2, 20)}</span> events.
              </p>
            </div>

            <button
              onClick={handleFetch}
              className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-black italic uppercase tracking-tight text-sm hover:bg-neutral-800 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Fetch Events
            </button>
          </div>
        )}

        {/* Fetching step */}
        {step === 'fetching' && (
          <div className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
            <p className="technical-label text-[10px] text-neutral-400">Fetching events for next {days} days...</p>
          </div>
        )}

        {/* Results step */}
        {step === 'results' && (
          <div className="flex flex-col">
            <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
              <span className="technical-label text-[9px] text-neutral-400">{selected.size} of {fetchedEvents.length} selected</span>
              <button
                onClick={() => setSelected(selected.size === fetchedEvents.length ? new Set() : new Set(fetchedEvents.map(e => e.id)))}
                className="technical-label text-[9px] underline text-neutral-500 hover:text-black transition-colors"
              >
                {selected.size === fetchedEvents.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <ul className="max-h-72 overflow-y-auto divide-y divide-neutral-50">
              {fetchedEvents.map(event => (
                <li
                  key={event.id}
                  onClick={() => toggleEvent(event.id)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors',
                    selected.has(event.id) ? 'bg-neutral-50' : 'opacity-40'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full shrink-0', TYPE_COLORS[event.type])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black italic uppercase tracking-tight truncate">{event.title}</p>
                    <p className="technical-label text-[9px] text-neutral-400">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {event.description && ` · ${event.description}`}
                    </p>
                  </div>
                  <div className={cn(
                    'w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
                    selected.has(event.id) ? 'bg-black border-black' : 'border-neutral-300'
                  )}>
                    {selected.has(event.id) && <span className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-6 py-4 border-t border-neutral-100">
              <button
                onClick={handleAdd}
                disabled={selected.size === 0 || added}
                className={cn(
                  'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black italic uppercase tracking-tight text-sm transition-all',
                  added
                    ? 'bg-accent-green text-white border-accent-green'
                    : selected.size === 0
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800'
                )}
              >
                {added ? (
                  <><CheckCircle2 className="w-4 h-4" /> Added to Calendar</>
                ) : (
                  <><CalendarPlus className="w-4 h-4" /> Add {selected.size} Event{selected.size !== 1 ? 's' : ''} to Calendar</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
