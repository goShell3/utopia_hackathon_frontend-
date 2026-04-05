'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, MessageSquare, Calendar, Globe,
  Mail, Phone, Tag, X, Plus, CheckCircle2, Megaphone,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { leads as ALL_LEADS, matchLeadToSegment } from '@/data/lead';
import type { Lead, Segment } from '@/data/lead';

// ─── Mock data (replace with API) ────────────────────────────────────────────
const MOCK_SEGMENTS: Segment[] = [
  { id: 's1', name: 'Addis VIP', filters: { city: 'Addis Ababa', tags: ['vip'] } },
  { id: 's2', name: 'Recent PMS', filters: { source: ['pms'], lastStayDaysAgo: 90 } },
  { id: 's3', name: 'Meta Leads', filters: { source: ['meta'] } },
  { id: 's4', name: 'Diaspora Summer', filters: { tags: ['diaspora'] } },
];

const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'Summer Bookings Push', status: 'active', ads: [{ channel: 'sms' }, { channel: 'meta' }] },
  { id: 'c2', name: 'Brand Awareness Q3', status: 'draft', ads: [{ channel: 'email' }] },
];

const SUGGESTED_TAGS = ['vip', 'diaspora', 'frequent', 'corporate', 'family', 'loyalty', 'high-value'];

const SEGMENT_COLORS: Record<string, string> = {
  hot: 'bg-utopia text-white',
  warm: 'bg-amber-400 text-white',
  cold: 'bg-blue-400 text-white',
  unqualified: 'bg-neutral-200 text-neutral-600',
};

const CHANNEL_COLORS: Record<string, string> = {
  sms: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  email: 'bg-blue-50 text-blue-700 border-blue-200',
  meta: 'bg-violet-50 text-violet-700 border-violet-200',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const lead = ALL_LEADS.find(l => l.id === id);

  const [tags, setTags] = useState<string[]>(lead?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
  };

  if (!lead) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="technical-label text-neutral-400 uppercase">Lead not found</p>
      <Button variant="outline" size="md" onClick={() => router.push('/leads')} icon={ArrowLeft} className="bg-white">Back</Button>
    </div>
  );

  const leadWithTags = { ...lead, tags };
  const matchedSegments = MOCK_SEGMENTS.filter(seg => matchLeadToSegment(leadWithTags, seg));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/leads')} className="p-2 hover:bg-neutral-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black italic text-lg rounded-[1px] shrink-0">
            {lead.name?.slice(0, 2).toUpperCase() ?? '??'}
          </div>
          <div>
            <h1 className="display-header text-3xl italic tracking-tighter">
              {lead.name ?? '—'}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="technical-label text-neutral-400 text-[10px] uppercase">{lead.source}</span>
              {lead.city && <span className="technical-label text-neutral-400 text-[10px]">{lead.city}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={MessageSquare} className="bg-white" onClick={() => router.push('/messages')}>
            Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contact Details */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.phone && <InfoRow icon={Phone} label="Phone" value={lead.phone} mono />}
              {lead.email && <InfoRow icon={Mail} label="Email" value={lead.email} />}
              {lead.city && <InfoRow icon={Globe} label="City" value={lead.city} />}
              <InfoRow icon={Calendar} label="Added"
                value={new Date(lead.createdAt).toLocaleDateString()} />
              {lead.lastStayDate && (
                <InfoRow icon={Calendar} label="Last Stay"
                  value={new Date(lead.lastStayDate).toLocaleDateString()} />
              )}
            </div>
          </div>

          {/* Lead Profile */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Lead Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Source" value={lead.source.toUpperCase()} />
              <Stat label="Tags" value={tags.length > 0 ? String(tags.length) : '—'} />
              <Stat label="Last Stay" value={lead.lastStayDate ?? '—'} />
              <Stat label="Created" value={new Date(lead.createdAt).toLocaleDateString()} />
            </div>
          </div>



          {/* Campaign Activity */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest flex items-center gap-2">
              <Megaphone size={12} /> Campaign Activity
            </h3>
            {MOCK_CAMPAIGNS.length === 0 ? (
              <p className="text-[10px] technical-label text-neutral-300 uppercase">Not targeted by any campaign</p>
            ) : (
              <div className="space-y-3">
                {MOCK_CAMPAIGNS.map(c => (
                  <div key={c.id} className="flex items-start justify-between gap-4 py-3 border-b border-neutral-100 last:border-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[8px] font-black uppercase px-1.5 py-0.5 rounded-[1px]',
                          c.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                        )}>{c.status}</span>
                        <span className="text-xs font-black italic uppercase">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.ads.map((ad, i) => (
                          <span key={i} className={cn('px-2 py-0.5 text-[9px] font-black italic uppercase border rounded-[2px]',
                            CHANNEL_COLORS[ad.channel] ?? 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          )}>{ad.channel}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => router.push(`/campaigns/${c.id}`)}
                      className="text-[9px] font-black uppercase text-utopia hover:underline shrink-0">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Tags */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest flex items-center gap-2">
              <Tag size={12} /> Tags
            </h3>

            {/* Current tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {tags.length === 0 && (
                <span className="text-[10px] technical-label text-neutral-300">No tags yet</span>
              )}
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-black text-white text-[9px] font-black italic uppercase px-2 py-1 rounded-[2px]">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-neutral-300 transition-colors">
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag..."
                className="flex-1 bg-neutral-50 border border-neutral-200 py-1.5 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30"
              />
              <button onClick={() => addTag(tagInput)}
                className="px-3 py-1.5 bg-black text-white text-[10px] font-black italic uppercase hover:bg-neutral-800 transition-colors">
                <Plus size={12} />
              </button>
            </div>

            {/* Suggestions */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-black uppercase text-neutral-400">Suggestions</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(tag => (
                  <button key={tag} onClick={() => addTag(tag)}
                    className="text-[9px] font-black italic uppercase px-2 py-1 border border-neutral-200 text-neutral-500 hover:border-black hover:text-black transition-colors rounded-[2px]">
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Segment Membership */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">
              Segment Membership
            </h3>
            {matchedSegments.length === 0 ? (
              <p className="text-[10px] technical-label text-neutral-300 uppercase">No segments matched</p>
            ) : (
              <div className="space-y-2">
                {matchedSegments.map(seg => (
                  <div key={seg.id} className="flex items-center gap-2 py-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-black italic uppercase">{seg.name}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[9px] technical-label text-neutral-300 uppercase">
              Based on current tags & source
            </p>
          </div>

          {/* Timeline */}
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest flex items-center gap-2">
              <Calendar size={12} /> Timeline
            </h3>
            <div className="space-y-0">
              {[
                { label: 'Lead Created', date: lead.createdAt, color: 'bg-black' },
                lead.lastStayDate && { label: 'Last Stay', date: lead.lastStayDate, color: 'bg-utopia' },
              ].filter(Boolean).sort((a, b) =>
                new Date((a as { date: string }).date).getTime() - new Date((b as { date: string }).date).getTime()
              ).map((event, i, arr) => {
                const e = event as { label: string; date: string; color: string };
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-2 h-2 rounded-full mt-1 shrink-0', e.color)} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-neutral-100 my-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-[10px] font-black italic uppercase">{e.label}</p>
                      <p className="text-[9px] technical-label text-neutral-400">
                        {new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} className="text-neutral-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">{label}</p>
        <p className={cn('text-sm font-bold mt-0.5', mono && 'font-mono')}>{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">{label}</p>
      <p className={cn('text-sm font-black italic uppercase mt-0.5', valueClass ?? 'text-black')}>{value}</p>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[9px] technical-label text-neutral-400">{label}</span>
        <span className="text-xs font-black italic">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div className={cn('h-full transition-all duration-700', color)} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
