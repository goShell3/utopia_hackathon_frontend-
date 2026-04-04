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
}

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

export function CalendarView({ events, selectedDate, onSelectDate }: Props) {
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

      <div className="grid grid-cols-7 text-center">
        {DAY_LABELS.map(d => (
          <span key={d} className="technical-label text-[9px] py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const dayEvents = eventsByDate[dateStr] ?? [];

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-lg min-h-[52px] transition-all duration-150 border',
                isSelected
                  ? 'bg-black text-white border-black'
                  : isToday
                  ? 'border-utopia text-utopia font-black'
                  : 'border-transparent hover:bg-neutral-100 text-neutral-700'
              )}
            >
              <span className="text-xs font-bold">{day}</span>
              <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                {dayEvents.slice(0, 3).map(e => (
                  <span key={e.id} className={cn('w-1.5 h-1.5 rounded-full', TYPE_COLORS[e.type])} />
                ))}
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
