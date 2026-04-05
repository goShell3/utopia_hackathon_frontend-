'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'campaign_start' | 'campaign_end' | 'holiday' | 'meeting' | 'gathering';
  description?: string;
};

export const TYPE_COLORS: Record<CalendarEvent['type'], string> = {
  campaign_start: 'bg-utopia',
  campaign_end: 'bg-rose-500',
  holiday: 'bg-yellow-400',
  meeting: 'bg-blue-500',
  gathering: 'bg-accent-green',
};

interface Props {
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

export function CalendarView({ events, selectedDate, onSelectDate, onSelectEvent }: Props) {
  const [cursor, setCursor] = React.useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = cursor;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = toYMD(new Date());

  const eventsByDate = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [events]);

  const prev = () => setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const monthLabel = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="industrial-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="display-header text-xl italic">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-1.5 rounded hover:bg-neutral-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="p-1.5 rounded hover:bg-neutral-100 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-l border-t border-neutral-100">
        {DAY_LABELS.map(d => (
          <span key={d} className="technical-label text-[9px] py-2 px-2 border-r border-b border-neutral-100 text-neutral-400">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-neutral-100">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="border-r border-b border-neutral-100 min-h-[100px]" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const dayEvents = eventsByDate[dateStr] ?? [];

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'relative flex flex-col items-start p-2 min-h-[100px] border-r border-b border-neutral-100 transition-all duration-150 text-left',
                isSelected ? 'ring-2 ring-inset ring-black' : isToday ? 'bg-utopia/5' : 'hover:bg-neutral-50'
              )}
            >
              {/* Date number top-left */}
              <span className={cn(
                'text-xs font-black mb-1.5 w-6 h-6 flex items-center justify-center rounded-full',
                isSelected ? 'bg-black text-white' : isToday ? 'bg-utopia text-white' : 'text-neutral-500'
              )}>{day}</span>

              {/* Event pills — up to 2 */}
              <div className="w-full space-y-0.5">
                {dayEvents.slice(0, 2).map(e => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onSelectDate(dateStr); onSelectEvent?.(e); }}
                    className={cn('w-full flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] cursor-pointer hover:opacity-80 transition-opacity', TYPE_COLORS[e.type])}
                  >
                    <span className="text-[8px] font-black text-white truncate leading-tight">{e.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="flex gap-0.5 px-1 pt-0.5">
                    {dayEvents.slice(2).map(e => (
                      <span key={e.id} className={cn('w-1.5 h-1.5 rounded-full shrink-0', TYPE_COLORS[e.type])} />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-neutral-100">
        {(Object.entries(TYPE_COLORS) as [CalendarEvent['type'], string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', color)} />
            <span className="technical-label text-[9px] capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
