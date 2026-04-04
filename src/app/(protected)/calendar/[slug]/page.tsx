'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, Tag, FileText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { TYPE_COLORS } from '@/components/calendar/CalendarView';
import type { CalendarEvent } from '@/components/calendar/CalendarView';

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Welcome Campaign', date: new Date().toISOString().split('T')[0], type: 'campaign_start', description: 'Onboarding campaign for new leads' },
  { id: '2', title: 'Q2 Campaign Launch', date: new Date().toISOString().split('T')[0], type: 'campaign_start', description: 'Loyalty bonus push' },
  { id: '3', title: 'Team Sync', date: daysFromNow(1), type: 'meeting', description: 'Weekly marketing review' },
  { id: '4', title: 'National Holiday', date: daysFromNow(1), type: 'holiday', description: 'Public holiday — no outreach' },
  { id: '5', title: 'Churn Prevention End', date: daysFromNow(3), type: 'campaign_end', description: 'Re-engagement campaign wrap-up' },
  { id: '6', title: 'Partner Gathering', date: daysFromNow(5), type: 'gathering', description: 'Hotel partner networking event' },
  { id: '7', title: 'Stakeholder Meeting', date: daysFromNow(7), type: 'meeting', description: 'Monthly performance review' },
  { id: '8', title: 'Upsell Campaign End', date: daysFromNow(7), type: 'campaign_end', description: 'Premium tier offer wrap-up' },
];

const TYPE_LABELS: Record<CalendarEvent['type'], string> = {
  campaign_start: 'Campaign Start',
  campaign_end: 'Campaign End',
  holiday: 'Holiday',
  meeting: 'Meeting',
  gathering: 'Gathering',
};

export default function CalendarEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const createCampaign = useCreateCampaign();
  const [creating, setCreating] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  const event = MOCK_EVENTS.find(e => e.id === slug);

  async function handleCreateCampaign() {
    if (!event) return;
    setCreating(true);
    try {
      await createCampaign.mutateAsync({
        name: event.title,
        campaign_type: event.type === 'campaign_start' ? 'scheduled' : 'manual',
        channels: ['email'],
        enable_ab_test: false,
        description: event.description ?? undefined,
      });
      setCreated(true);
      setTimeout(() => router.push('/campaigns'), 1200);
    } catch {
      setCreating(false);
    }
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-neutral-400">
        <CalendarDays className="w-10 h-10" />
        <p className="technical-label text-[10px]">Event not found</p>
        <button onClick={() => router.back()} className="text-xs font-black italic uppercase underline hover:text-black transition-colors">
          Go back
        </button>
      </div>
    );
  }

  const formatted = new Date(event.date + 'T00:00:00').toLocaleDateString('default', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-black italic uppercase text-neutral-400 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Calendar
      </button>

      <div className="industrial-card p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <span className={cn('mt-1.5 w-3 h-3 rounded-full shrink-0', TYPE_COLORS[event.type])} />
          <div>
            <h1 className="display-header text-3xl italic tracking-tighter">{event.title}</h1>
            <span className={cn(
              'inline-block mt-2 px-2 py-0.5 text-[9px] font-black italic uppercase rounded-[1px]',
              'bg-neutral-100 text-neutral-500'
            )}>
              {TYPE_LABELS[event.type]}
            </span>
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="technical-label text-[9px] text-neutral-400">Date</p>
              <p className="text-sm font-black italic uppercase tracking-tight">{formatted}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="technical-label text-[9px] text-neutral-400">Type</p>
              <p className="text-sm font-black italic uppercase tracking-tight">{TYPE_LABELS[event.type]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="technical-label text-[9px] text-neutral-400">Event ID</p>
              <p className="text-sm font-black italic uppercase tracking-tight font-mono">{event.id}</p>
            </div>
          </div>

          {event.description && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Description</p>
                <p className="text-sm text-neutral-600 mt-0.5">{event.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-neutral-100" />

        <div className="flex justify-end">
          <button
            onClick={handleCreateCampaign}
            disabled={creating || created}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black italic uppercase tracking-tight transition-all',
              created
                ? 'bg-accent-green text-white cursor-default'
                : creating
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-neutral-800'
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            {created ? 'Campaign Created!' : creating ? 'Creating...' : 'Create Campaign for this Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
