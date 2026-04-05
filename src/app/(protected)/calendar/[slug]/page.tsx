'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, MapPin, Link, FileText, Zap, Loader2, RefreshCw, Tag, TrendingUp, Timer, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEvents, useEventCampaigns, useGenerateCampaigns } from '@/hooks/useCalendar';

const EventMap = dynamic(() => import('@/components/calendar/EventMap').then(m => m.EventMap), { ssr: false });

export default function CalendarEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: events = [], isLoading } = useEvents();
  const event = events.find(e => e.id === slug);

  const hotel = React.useMemo(() => {
    try {
      const stored = localStorage.getItem('utopia_user');
      return stored ? JSON.parse(stored).location : null;
    } catch { return null; }
  }, []);

  const localVenues = React.useMemo(() => {
    const venues = (event as any)?.venues ?? [];
    if (!hotel) return venues;
    return venues.filter((v: any) => v.city.toLowerCase() === hotel.city.toLowerCase());
  }, [event, hotel]);

  const { data: campaigns = [], isLoading: loadingCampaigns } = useEventCampaigns(slug);
  const { mutate: generateCampaigns, isPending: generating } = useGenerateCampaigns();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
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

  const formatted = event.start_time
    ? new Date(event.start_time).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  const timeRange = event.start_time && event.end_time
    ? `${new Date(event.start_time).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} – ${new Date(event.end_time).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-black italic uppercase text-neutral-400 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Calendar
      </button>

      <div className="industrial-card p-8 space-y-6">
        {/* Header */}
        <div>
          {event.category && (
            <span className="inline-block mb-2 px-2 py-0.5 text-[9px] font-black italic uppercase bg-neutral-100 text-neutral-500 rounded-[1px]">
              {event.category}
            </span>
          )}
          <h1 className="display-header text-3xl italic tracking-tighter">{event.title}</h1>
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

          {timeRange && (
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Time</p>
                <p className="text-sm font-black italic uppercase tracking-tight">{timeRange}</p>
              </div>
            </div>
          )}

          {event.location_name && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Location</p>
                <p className="text-sm font-black italic uppercase tracking-tight">{event.location_name}</p>
              </div>
            </div>
          )}

          {event.description && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Description</p>
                <p className="text-sm text-neutral-600 mt-0.5">{event.description}</p>
              </div>
            </div>
          )}

          {(event as any).recurrence && (
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Recurrence</p>
                <p className="text-sm font-black italic uppercase tracking-tight">{(event as any).recurrence}</p>
              </div>
            </div>
          )}

          {(event as any).leadTimeDays && (
            <div className="flex items-center gap-3">
              <Timer className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Lead Time</p>
                <p className="text-sm font-black italic uppercase tracking-tight">{(event as any).leadTimeDays} days</p>
              </div>
            </div>
          )}

          {(event as any).demandImpact && (
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Demand Impact</p>
                <p className="text-sm font-black italic uppercase tracking-tight">
                  {(event as any).demandImpact.level}
                  <span className="text-neutral-400 font-normal not-italic normal-case text-xs ml-2">
                    · {(event as any).demandImpact.travelerType.join(', ')}
                  </span>
                </p>
              </div>
            </div>
          )}

          {(event as any).tags?.length > 0 && (
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(event as any).tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-[9px] font-black italic uppercase bg-neutral-100 text-neutral-500 rounded-[1px]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(event as any).hotelStrategy && (
            <div className="flex items-start gap-3">
              <Megaphone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Hotel Strategy</p>
                <p className="text-sm font-black italic uppercase tracking-tight">
                  {(event as any).hotelStrategy.campaignType.join(', ')}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Audience: {(event as any).hotelStrategy.suggestedAudience.join(', ')}
                </p>
              </div>
            </div>
          )}

          {event.source_url && (
            <div className="flex items-center gap-3">
              <Link className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="technical-label text-[9px] text-neutral-400">Source</p>
                <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="text-sm font-black italic uppercase tracking-tight text-utopia hover:underline truncate">
                  {event.source_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        {hotel && localVenues.length > 0 && (
          <>
            <div className="h-px bg-neutral-100" />
            <div className="space-y-3">
              <p className="technical-label text-[10px] text-neutral-500 uppercase">Venue Distances from Your Hotel</p>
              <EventMap venues={localVenues} hotel={hotel} />
            </div>
          </>
        )}

        {hotel && localVenues.length === 0 && (
          <>
            <div className="h-px bg-neutral-100" />
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <p className="text-[10px] technical-label text-neutral-400">This event has no specific venue — it's a nationwide or global occurrence.</p>
            </div>
          </>
        )}

        <div className="h-px bg-neutral-100" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="technical-label text-[10px] text-neutral-500 uppercase">Ad Campaigns</p>
            <button
              onClick={() => generateCampaigns()}
              disabled={generating || loadingCampaigns}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-xs font-black italic uppercase tracking-tight transition-all',
                generating || loadingCampaigns
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800'
              )}
            >
              {generating || loadingCampaigns
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Zap className="w-3.5 h-3.5" />}
              {campaigns.length > 0 ? 'Regenerate' : 'Generate Campaigns'}
            </button>
          </div>

          {campaigns.length > 0 ? (
            <ul className="space-y-3">
              {campaigns.map(c => (
                <li key={c.id} className="border border-neutral-100 p-4 space-y-2">
                  <p className="text-sm font-black italic uppercase tracking-tight">{c.headline}</p>
                  {c.body_text && <p className="text-xs text-neutral-500">{c.body_text}</p>}
                  {c.ai_rationale && (
                    <p className="text-[10px] text-neutral-400 border-t border-neutral-100 pt-2 mt-2">
                      <span className="font-black uppercase">Rationale: </span>{c.ai_rationale}
                    </p>
                  )}
                  <span className={cn(
                    'inline-block px-2 py-0.5 text-[9px] font-black italic uppercase rounded-[1px]',
                    c.status === 'ready' ? 'bg-accent-green/10 text-accent-green' : 'bg-neutral-100 text-neutral-400'
                  )}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-neutral-400 italic">No campaigns generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
