'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, MessageSquare, Zap, Loader2, Calendar, Globe, Mail, Phone
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useLead, useScoreLead } from '@/hooks/useLeads';

const SEGMENT_COLORS: Record<string, string> = {
  hot: 'bg-utopia text-white',
  warm: 'bg-amber-400 text-white',
  cold: 'bg-blue-400 text-white',
  unqualified: 'bg-neutral-300 text-black',
};

const CONSENT_COLORS: Record<string, string> = {
  opted_in: 'text-emerald-600',
  opted_out: 'text-rose-500',
  pending: 'text-amber-500',
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: lead, isLoading } = useLead(id);
  const scoreLead = useScoreLead();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-neutral-300" size={32} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="technical-label text-neutral-400 uppercase">Lead not found</p>
        <Button variant="outline" size="md" onClick={() => router.push('/leads')} icon={ArrowLeft} className="bg-white">Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/leads')} className="p-2 hover:bg-neutral-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black italic text-lg rounded-[1px]">
            {lead.first_name[0]}{lead.last_name[0]}
          </div>
          <div>
            <h1 className="display-header text-3xl italic tracking-tighter">{lead.first_name} {lead.last_name}</h1>
            <div className="flex items-center gap-3 mt-1">
              {lead.segment && (
                <span className={cn('text-[9px] font-black italic uppercase px-2 py-0.5 rounded-[1px]', SEGMENT_COLORS[lead.segment])}>
                  {lead.segment}
                </span>
              )}
              <span className="technical-label text-neutral-400">{lead.country} · {lead.language?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={MessageSquare} className="bg-white" onClick={() => router.push('/messages')}>
            Message
          </Button>
          <Button
            variant="primary" size="md" icon={Zap}
            isLoading={scoreLead.isPending}
            onClick={() => scoreLead.mutate(id)}
          >
            Score Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="industrial-card p-6 space-y-4">
          <h3 className="text-xs font-black italic uppercase tracking-tight">Contact Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-neutral-400 shrink-0" />
              <span className="text-sm font-mono">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-neutral-400 shrink-0" />
                <span className="text-sm font-bold">{lead.email}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-neutral-400 shrink-0" />
              <span className="text-sm font-bold uppercase">{lead.country}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-neutral-400 shrink-0" />
              <span className="text-[10px] technical-label text-neutral-500">
                Added {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Profile */}
        <div className="industrial-card p-6 space-y-4">
          <h3 className="text-xs font-black italic uppercase tracking-tight">Lead Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Source', value: lead.source?.replace('_', ' ').toUpperCase() ?? '—' },
              { label: 'Bookings', value: String(lead.total_bookings ?? 0) },
              { label: 'Revenue', value: `$${(lead.total_revenue ?? 0).toLocaleString()}` },
              { label: 'Duplicate', value: lead.is_duplicate ? 'Yes' : 'No' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] technical-label text-neutral-400">{label}</p>
                <p className="text-xs font-black italic mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[9px] technical-label text-neutral-400">Consent</p>
            <p className={cn('text-xs font-black italic mt-0.5 uppercase', CONSENT_COLORS[lead.consent_status ?? ''])}>
              {lead.consent_status?.replace('_', ' ') ?? '—'}
            </p>
          </div>
          {lead.last_booking_date && (
            <div>
              <p className="text-[9px] technical-label text-neutral-400">Last Booking</p>
              <p className="text-xs font-black italic mt-0.5">{new Date(lead.last_booking_date).toLocaleDateString()}</p>
            </div>
          )}
          {lead.last_contact_date && (
            <div>
              <p className="text-[9px] technical-label text-neutral-400">Last Contact</p>
              <p className="text-xs font-black italic mt-0.5">{new Date(lead.last_contact_date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Scores */}
        {(lead.conversion_score != null || lead.quality_score != null) && (
          <div className="industrial-card p-6 space-y-4 lg:col-span-2">
            <h3 className="text-xs font-black italic uppercase tracking-tight">Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lead.conversion_score != null && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[9px] technical-label text-neutral-400">Conversion Score</span>
                    <span className="text-xs font-black italic">{lead.conversion_score}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-utopia transition-all duration-700" style={{ width: `${lead.conversion_score}%` }} />
                  </div>
                </div>
              )}
              {lead.conversion_probability != null && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[9px] technical-label text-neutral-400">Conversion Probability</span>
                    <span className="text-xs font-black italic">{Math.round(lead.conversion_probability * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${lead.conversion_probability * 100}%` }} />
                  </div>
                </div>
              )}
              {lead.quality_score != null && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[9px] technical-label text-neutral-400">Quality Score</span>
                    <span className="text-xs font-black italic">{lead.quality_score}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${lead.quality_score}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
