'use client';

import React from 'react';
import { X, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from './CalendarView';
import { TYPE_COLORS } from './CalendarView';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (event: CalendarEvent) => void;
  defaultDate?: string;
}

function toYMD(date: Date) {
  return date.toISOString().split('T')[0];
}

export function AddEventDialog({ open, onClose, onAdd, defaultDate }: Props) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<CalendarEvent['type']>('meeting');
  const [date, setDate] = React.useState(defaultDate ?? toYMD(new Date()));
  const [description, setDescription] = React.useState('');
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: `manual-${Date.now()}`,
      title: title.trim(),
      type,
      date,
      description: description.trim() || undefined,
    });
    setAdded(true);
    setTimeout(() => {
      onClose();
      resetState();
    }, 900);
  }

  function resetState() {
    setTitle('');
    setType('meeting');
    setDate(defaultDate ?? toYMD(new Date()));
    setDescription('');
    setAdded(false);
  }

  function handleClose() {
    onClose();
    setTimeout(resetState, 300);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="display-header text-lg italic">Add Event</h2>
            <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Create a new calendar event</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <span className="technical-label text-[10px] text-neutral-500">TITLE</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title"
              required
              className="h-10 px-3 border border-neutral-200 text-sm font-black italic placeholder:font-normal placeholder:not-italic placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-lg"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <span className="technical-label text-[10px] text-neutral-500">DATE</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="h-10 px-3 border border-neutral-200 text-sm font-black italic focus:outline-none focus:border-black rounded-lg"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <span className="technical-label text-[10px] text-neutral-500">TYPE</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TYPE_COLORS) as CalendarEvent['type'][]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-black italic uppercase tracking-tight transition-all',
                    type === t ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full shrink-0', type === t ? 'bg-white' : TYPE_COLORS[t])} />
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="technical-label text-[10px] text-neutral-500">DESCRIPTION <span className="text-neutral-300">(optional)</span></span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description..."
              rows={2}
              className="px-3 py-2.5 border border-neutral-200 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-lg resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || added}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black italic uppercase tracking-tight text-sm transition-all',
              added
                ? 'bg-accent-green text-white'
                : !title.trim()
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-neutral-800'
            )}
          >
            {added
              ? <><CheckCircle2 className="w-4 h-4" /> Event Added</>
              : <><CalendarPlus className="w-4 h-4" /> Add Event</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
