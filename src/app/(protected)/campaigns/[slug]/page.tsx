'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Target, Users, Megaphone, BarChart2, Settings2,
  PlayCircle, PauseCircle, Plus, Copy, FileDown,
  ChevronDown, Search, Loader2, MessageSquare, Send, Zap,
  CheckCircle2, Trash2,
} from 'lucide-react';
import { cn, toSlug } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { useCampaignStats, useCampaignTargetLeads } from '@/hooks/useCampaigns';
import { useSendBulkSMS } from '@/hooks/useSMS';
import { useTemplates } from '@/hooks/useTemplates';
import { useLeads } from '@/hooks/useLeads';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadsPagination } from '@/components/leads/LeadsPagination';
import { CAMPAIGNS as INITIAL_CAMPAIGNS } from '@/data/campaign';
import type { Campaign as LocalCampaign } from '@/data/campaign';
import type { CampaignStats, LeadSegment, LeadSource, Lead } from '@/types';

// ─── Ads mock ─────────────────────────────────────────────────────────────────
type AdChannel = 'sms' | 'email' | 'meta' | 'google';
type AdStatus = 'draft' | 'running' | 'paused';

interface CampaignAd {
  id: string;
  channel: AdChannel;
  title?: string;
  message: string;
  status: AdStatus;
  budget?: number;
}

const MOCK_ADS: CampaignAd[] = [
  { id: 'a1', channel: 'sms', message: 'Hi {{name}}, we have an exclusive offer for your next stay. Book now and save 20%!', status: 'running' },
  { id: 'a2', channel: 'email', title: 'Your exclusive summer deal', message: "Dear {{name}}, as a valued guest we'd like to offer you a special rate this summer season.", status: 'draft' },
  { id: 'a3', channel: 'meta', title: 'Summer Bookings Push', message: 'Discover your perfect getaway. Limited time offer — book today!', status: 'paused', budget: 500 },
];

const CHANNEL_COLORS: Record<AdChannel, string> = {
  sms: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  email: 'bg-blue-50 text-blue-700 border-blue-200',
  meta: 'bg-violet-50 text-violet-700 border-violet-200',
  google: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const AD_STATUS_COLORS: Record<AdStatus, string> = {
  running: 'bg-emerald-500 text-white',
  draft: 'bg-neutral-200 text-neutral-600',
  paused: 'bg-amber-400 text-white',
};

// ─── SMS Workflow types ───────────────────────────────────────────────────────
type TriggerType = 'immediate' | 'scheduled' | 'on_checkin' | 'on_checkout';

interface SMSStep {
  id: string;
  message: string;
  trigger: TriggerType;
  delayDays?: number;
  status: 'idle' | 'sending' | 'sent';
}

const TRIGGER_LABELS: Record<TriggerType, string> = {
  immediate: 'Send Immediately',
  scheduled: 'Scheduled Delay',
  on_checkin: 'On Check-in',
  on_checkout: 'On Check-out',
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'activation' | 'acquisition';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'activation', label: 'Activation', icon: MessageSquare },
  { id: 'acquisition', label: 'Acquisition', icon: Megaphone },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('activation');
  const [campaigns, setCampaigns] = useState<LocalCampaign[]>(INITIAL_CAMPAIGNS);

  const campaign = campaigns.find(c => toSlug(c.name) === slug);

  const toggleStatus = () => {
    if (!campaign) return;
    setCampaigns(prev => prev.map(c =>
      c.id === campaign.id
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    ));
  };

  if (!campaign) return (
    <div className="space-y-4">
      <BackButton onClick={() => router.back()} />
      <p className="technical-label text-neutral-400 uppercase">Campaign not found.</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <BackButton onClick={() => router.back()} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="display-header text-3xl italic tracking-tighter uppercase">{campaign.name}</h1>
          <p className="technical-label text-neutral-500 mt-0.5 uppercase tracking-widest text-[10px]">
            {campaign.goal.replace('_', ' ')} · {campaign.startDate} → {campaign.endDate}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={campaign.status} />
          {(campaign.status === 'active' || campaign.status === 'paused') && (
            <button
              onClick={toggleStatus}
              className={cn(
                'flex items-center gap-1.5 h-8 px-3 text-[10px] font-black italic uppercase border transition-colors',
                campaign.status === 'active'
                  ? 'border-amber-300 text-amber-600 hover:bg-amber-50'
                  : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
              )}
            >
              {campaign.status === 'active'
                ? <><PauseCircle size={12} /> Pause</>
                : <><PlayCircle size={12} /> Activate</>}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3.5 text-[10px] font-black italic uppercase border-b-2 transition-all',
                activeTab === id
                  ? 'border-utopia text-utopia'
                  : 'border-transparent text-neutral-400 hover:text-black'
              )}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'activation' && <ActivationTab campaign={campaign} />}
        {activeTab === 'acquisition' && <AcquisitionTab campaign={campaign} />}
      </div>
    </div>
  );
}

// ─── Activation Tab ───────────────────────────────────────────────────────────
function ActivationTab({ campaign }: { campaign: LocalCampaign }) {
  const { data: targetLeads } = useCampaignTargetLeads(campaign.id);
  const leadCount = Array.isArray(targetLeads)
    ? targetLeads.length
    : (targetLeads as { total?: number })?.total ?? 0;
  const activationAds = campaign.ads.filter(ad => ad.purpose === 'activation');
  const totalSent = activationAds.reduce((sum, ad) => sum + (ad.sentCount ?? 0), 0);

  if (campaign.purpose === 'acquisition') {
    return (
      <div className="industrial-card p-8 flex flex-col items-center justify-center gap-2 border-dashed">
        <Target size={24} className="text-neutral-200" />
        <p className="text-[10px] technical-label text-neutral-300 uppercase">This campaign is acquisition-only</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Leads Targeted" value={leadCount.toLocaleString()} highlight />
        <StatCard label="Activation Ads" value={activationAds.length} />
        <StatCard label="Messages Sent" value={totalSent.toLocaleString()} />
      </div>

      <div className="industrial-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Activation Targeting</h3>
          <div className="flex items-center gap-2 bg-utopia/10 border border-utopia/20 px-3 py-1.5 rounded-[2px]">
            <div className="w-1.5 h-1.5 rounded-full bg-utopia animate-pulse" />
            <span className="text-[11px] font-black italic text-utopia uppercase">
              Targeting {leadCount.toLocaleString()} existing leads
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Sources</p>
            <p className="text-sm font-bold italic uppercase">
              {campaign.target?.source?.join(', ') ?? 'All Sources'}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Linked Event</p>
            <p className="text-sm font-bold italic uppercase">{campaign.eventId ?? '—'}</p>
          </div>
        </div>
      </div>

      {campaign.target?.source && campaign.target.source.length > 0 && (
        <div className="industrial-card p-6 space-y-4">
          <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Source Channels</h3>
          <div className="flex flex-wrap gap-2">
            {campaign.target.source.map(ch => (
              <span key={ch} className={cn(
                'px-3 py-1.5 text-[10px] font-black italic uppercase border rounded-[2px]',
                CHANNEL_COLORS[ch as AdChannel] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'
              )}>{ch}</span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Send History</h3>
        {activationAds.length === 0 && (
          <div className="industrial-card p-5">
            <p className="text-[10px] technical-label text-neutral-300 uppercase">No activation ads configured</p>
          </div>
        )}
        {activationAds.map(ad => (
          <div key={ad.id} className="industrial-card p-5 flex items-start gap-4">
            <div
              className={cn(
                'px-2.5 py-1 text-[9px] font-black italic uppercase border rounded-[2px] shrink-0 mt-0.5',
                CHANNEL_COLORS[ad.channel as AdChannel]
              )}
            >
              {ad.channel}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              {ad.title && <p className="text-sm font-black italic uppercase tracking-tight">{ad.title}</p>}
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{ad.message}</p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <span className={cn('text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]', AD_STATUS_COLORS[ad.status as AdStatus])}>
                {ad.status}
              </span>
              <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Sent: {(ad.sentCount ?? 0).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Leads Targeted</h3>
        <LeadsTab campaignId={campaign.id} />
      </div>

      <ConfigureTab mode="activation" />
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

function LeadsTab({ campaignId }: { campaignId: string }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segment, setSegment] = useState<LeadSegment | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [page, setPage] = useState(1);
  const exportRef = useRef<HTMLDivElement>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, segment, source]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data, isLoading, isFetching } = useLeads({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch || undefined,
    segment: segment || undefined,
    source: source || undefined,
  });

  const handleExportCSV = () => {
    const items = data?.items ?? [];
    const headers = ['id', 'first_name', 'last_name', 'phone', 'email', 'source', 'segment'];
    const rows = items.map((l: Lead) =>
      headers.map(h => (l as unknown as Record<string, unknown>)[h] ?? '').join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${campaignId}-leads.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  return (
    <div className="space-y-4">
      <div className="industrial-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-200 py-2.5 pl-10 pr-4 text-sm font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30"
          />
        </div>
        <select
          value={segment}
          onChange={e => setSegment(e.target.value as LeadSegment | '')}
          className="bg-white border border-neutral-200 py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30"
        >
          <option value="">Segment: All</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="unqualified">Unqualified</option>
        </select>
        <select
          value={source}
          onChange={e => setSource(e.target.value as LeadSource | '')}
          className="bg-white border border-neutral-200 py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30"
        >
          <option value="">Source: All</option>
          <option value="pms">PMS</option>
          <option value="meta_ads">Meta Ads</option>
          <option value="manual">Manual</option>
        </select>
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-neutral-400 shrink-0" />}

        <div ref={exportRef} className="relative ml-auto">
          <button
            onClick={() => setShowExport(v => !v)}
            className="flex items-center gap-2 h-9 px-4 border border-neutral-200 text-[10px] font-black italic uppercase bg-white hover:border-black transition-colors"
          >
            <FileDown size={12} /> Export
            <ChevronDown size={10} className={cn('transition-transform', showExport && 'rotate-180')} />
          </button>
          {showExport && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-neutral-200 shadow-xl w-36">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700"
              >
                <FileDown size={11} /> CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <LeadsTable leads={data?.items ?? []} isLoading={isLoading} />
      <LeadsPagination
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

// ─── Acquisition Tab ──────────────────────────────────────────────────────────
function AcquisitionTab({ campaign }: { campaign: LocalCampaign }) {
  const acquisitionAds = campaign.ads.filter(ad => ad.purpose === 'acquisition');
  const totalBudget = acquisitionAds.reduce((sum, ad) => sum + (ad.budget ?? 0), 0);
  const totalCaptured = acquisitionAds.reduce((sum, ad) => sum + (ad.leadsCaptured ?? 0), 0);
  const blendedCPL = totalCaptured > 0 ? totalBudget / totalCaptured : null;

  if (campaign.purpose === 'activation') {
    return (
      <div className="industrial-card p-8 flex flex-col items-center justify-center gap-2 border-dashed">
        <Users size={24} className="text-neutral-200" />
        <p className="text-[10px] technical-label text-neutral-300 uppercase">This campaign is activation-only</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Acquisition Ads" value={acquisitionAds.length} highlight />
        <StatCard label="Leads Captured" value={totalCaptured.toLocaleString()} />
        <StatCard label="Cost Per Lead" value={blendedCPL != null ? `$${blendedCPL.toFixed(2)}` : '—'} />
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest">Meta / Google Ads</h3>
        {acquisitionAds.length === 0 && (
          <div className="industrial-card p-5">
            <p className="text-[10px] technical-label text-neutral-300 uppercase">No acquisition ads configured</p>
          </div>
        )}
        {acquisitionAds.map(ad => {
          const adLeads = ad.leadsCaptured ?? 0;
          const adBudget = ad.budget ?? 0;
          const adCpl = adLeads > 0 ? adBudget / adLeads : null;
          return (
            <div key={ad.id} className="industrial-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div
                    className={cn(
                      'inline-flex px-2.5 py-1 text-[9px] font-black italic uppercase border rounded-[2px]',
                      CHANNEL_COLORS[ad.channel as AdChannel]
                    )}
                  >
                    {ad.channel}
                  </div>
                  {ad.title && <p className="text-sm font-black italic uppercase tracking-tight">{ad.title}</p>}
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{ad.message}</p>
                </div>
                <span
                  className={cn(
                    'text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px] shrink-0',
                    AD_STATUS_COLORS[ad.status as AdStatus]
                  )}
                >
                  {ad.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <InfoCard label="Budget" value={adBudget > 0 ? `$${adBudget}` : '—'} />
                <InfoCard label="Leads Captured" value={adLeads.toLocaleString()} />
                <InfoCard label="CPL" value={adCpl != null ? `$${adCpl.toFixed(2)}` : '—'} />
              </div>
            </div>
          );
        })}
      </div>

      <ConfigureTab mode="acquisition" />
    </div>
  );
}

// ─── Configure Tab ────────────────────────────────────────────────────────────
function ConfigureTab({ mode }: { mode: 'activation' | 'acquisition' }) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-[10px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">
          Configure {mode}
        </h3>
        <AdsSection mode={mode} />
      </div>
      {mode === 'activation' && <SMSWorkflowSection />}
    </div>
  );
}

// ── Ads Section ───────────────────────────────────────────────────────────────
function AdsSection({ mode }: { mode: 'activation' | 'acquisition' }) {
  const [ads, setAds] = useState<CampaignAd[]>(MOCK_ADS);
  const [showForm, setShowForm] = useState(false);
  const defaultChannel: AdChannel = mode === 'activation' ? 'sms' : 'meta';
  const [form, setForm] = useState<Omit<CampaignAd, 'id' | 'status'>>({ channel: defaultChannel, message: '' });

  useEffect(() => {
    setForm({ channel: defaultChannel, message: '' });
  }, [defaultChannel]);

  const allowedChannels: AdChannel[] = mode === 'activation'
    ? ['sms', 'email']
    : ['meta', 'google'];

  const visibleAds = ads.filter(ad => allowedChannels.includes(ad.channel));

  const toggleAdStatus = (id: string) => {
    setAds(prev => prev.map(ad =>
      ad.id === id ? { ...ad, status: ad.status === 'running' ? 'paused' : 'running' } : ad
    ));
  };

  const duplicateAd = (ad: CampaignAd) => {
    setAds(prev => [...prev, { ...ad, id: crypto.randomUUID(), status: 'draft' }]);
  };

  const deleteAd = (id: string) => setAds(prev => prev.filter(ad => ad.id !== id));

  const addAd = () => {
    if (!form.message.trim()) return;
    setAds(prev => [...prev, { ...form, id: crypto.randomUUID(), status: 'draft' }]);
    setForm({ channel: 'sms', message: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black italic uppercase tracking-tight flex items-center gap-2">
            <Megaphone size={14} /> Ads
          </h2>
          <p className="text-[9px] technical-label text-neutral-400 uppercase mt-0.5">{visibleAds.length} ads configured</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(v => !v)}
          className="text-[10px] font-black italic uppercase">
          New Ad
        </Button>
      </div>

      {showForm && (
        <div className="industrial-card p-5 space-y-4 border-utopia/30 bg-utopia/5">
          <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">New Ad</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-neutral-400">Channel</label>
              <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value as AdChannel }))}
                className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30">
                {mode === 'activation' ? (
                  <>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </>
                ) : (
                  <>
                    <option value="meta">Meta</option>
                    <option value="google">Google</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-neutral-400">Title (optional)</label>
              <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ad title..."
                className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30" />
            </div>
          </div>
          {(form.channel === 'meta' || form.channel === 'google') && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-neutral-400">Budget ($)</label>
              <input type="number" value={form.budget ?? ''} onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))}
                placeholder="500"
                className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-neutral-400">Message / Copy</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={3} placeholder="Write your ad copy here..."
              className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30 resize-none" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="text-[10px] font-black italic uppercase">Cancel</Button>
            <Button variant="primary" size="sm" onClick={addAd} className="text-[10px] font-black italic uppercase">Add Ad</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visibleAds.map(ad => (
          <div key={ad.id} className="industrial-card p-5 flex items-start gap-4">
            <div className={cn(
              'px-2.5 py-1 text-[9px] font-black italic uppercase border rounded-[2px] shrink-0 mt-0.5',
              CHANNEL_COLORS[ad.channel]
            )}>{ad.channel}</div>

            <div className="flex-1 min-w-0">
              {ad.title && <p className="text-sm font-black italic uppercase tracking-tight mb-1">{ad.title}</p>}
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{ad.message}</p>
              {ad.budget != null && (
                <p className="text-[9px] font-black uppercase text-neutral-400 mt-2 tracking-widest">Budget: ${ad.budget}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]', AD_STATUS_COLORS[ad.status])}>
                {ad.status}
              </span>
              <button onClick={() => duplicateAd(ad)} className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-black" title="Duplicate">
                <Copy size={12} />
              </button>
              {ad.status !== 'draft' && (
                <button onClick={() => toggleAdStatus(ad.id)} className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-black">
                  {ad.status === 'running' ? <PauseCircle size={12} /> : <PlayCircle size={12} />}
                </button>
              )}
              <button onClick={() => deleteAd(ad.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors text-neutral-300 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SMS Workflow Section ──────────────────────────────────────────────────────
function SMSWorkflowSection() {
  const [steps, setSteps] = useState<SMSStep[]>([]);
  const [form, setForm] = useState<{ message: string; trigger: TriggerType; delayDays: number }>({
    message: '', trigger: 'immediate', delayDays: 1,
  });
  const [confirmSend, setConfirmSend] = useState<string | null>(null);
  const { data: templatesData } = useTemplates();
  const sendBulk = useSendBulkSMS();

  const templates = (templatesData as { items?: { id: string; name: string; content: string }[] })?.items ?? [];

  const addStep = () => {
    if (!form.message.trim()) return;
    setSteps(prev => [...prev, {
      id: crypto.randomUUID(),
      message: form.message,
      trigger: form.trigger,
      delayDays: form.trigger === 'scheduled' ? form.delayDays : undefined,
      status: 'idle',
    }]);
    setForm({ message: '', trigger: 'immediate', delayDays: 1 });
  };

  const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id));

  const initiateStep = (step: SMSStep) => {
    setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'sending' } : s));
    // In real usage, pass actual recipient phone numbers from campaign leads
    sendBulk.mutate(
      { recipients: [], message: step.message },
      {
        onSuccess: () => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'sent' } : s)),
        onError: () => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, status: 'idle' } : s)),
      }
    );
    setConfirmSend(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-black italic uppercase tracking-tight flex items-center gap-2">
          <MessageSquare size={14} /> SMS Workflow
        </h2>
        <p className="text-[9px] technical-label text-neutral-400 uppercase mt-0.5">Build a sequence of SMS steps for this campaign</p>
      </div>

      {/* Step builder */}
      <div className="industrial-card p-5 space-y-4">
        <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Add Step</p>

        {templates.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-neutral-400">Load from Template</label>
            <select
              onChange={e => {
                const t = templates.find(t => t.id === e.target.value);
                if (t) setForm(f => ({ ...f, message: t.content }));
              }}
              defaultValue=""
              className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30"
            >
              <option value="">Select a template...</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-black uppercase text-neutral-400">Message</label>
            <span className={cn('text-[9px] font-black', form.message.length > 160 ? 'text-red-500' : 'text-neutral-400')}>
              {form.message.length}/160
            </span>
          </div>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={3}
            placeholder="Hi {{name}}, your exclusive offer awaits..."
            className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30 resize-none"
          />
          <p className="text-[9px] text-neutral-400">Use <code className="bg-neutral-100 px-1">{'{{name}}'}</code> for personalization</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-neutral-400">Trigger</label>
            <select value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value as TriggerType }))}
              className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30">
              {(Object.keys(TRIGGER_LABELS) as TriggerType[]).map(t => (
                <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
              ))}
            </select>
          </div>
          {form.trigger === 'scheduled' && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-neutral-400">Delay (days)</label>
              <input type="number" min={1} value={form.delayDays}
                onChange={e => setForm(f => ({ ...f, delayDays: Number(e.target.value) }))}
                className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-utopia/30" />
            </div>
          )}
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={addStep}
          className="text-[10px] font-black italic uppercase w-full justify-center">
          Add to Workflow
        </Button>
      </div>

      {/* Steps list */}
      {steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.id} className="industrial-card p-4 flex items-start gap-4">
              {/* Step number */}
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                {i + 1}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-[2px]">
                    {TRIGGER_LABELS[step.trigger]}
                    {step.delayDays ? ` · ${step.delayDays}d` : ''}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {step.status === 'sent' ? (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600">
                    <CheckCircle2 size={12} /> Sent
                  </span>
                ) : step.status === 'sending' ? (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase text-neutral-400">
                    <Loader2 size={12} className="animate-spin" /> Sending
                  </span>
                ) : (
                  <>
                    {confirmSend === step.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase text-neutral-500">Confirm?</span>
                        <button onClick={() => initiateStep(step)}
                          className="text-[9px] font-black uppercase text-white bg-utopia px-2 py-1 hover:bg-utopia/90 transition-colors">
                          Yes
                        </button>
                        <button onClick={() => setConfirmSend(null)}
                          className="text-[9px] font-black uppercase text-neutral-500 hover:text-black">
                          No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmSend(step.id)}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase text-utopia border border-utopia/30 px-2.5 py-1 hover:bg-utopia/5 transition-colors">
                        <Send size={10} /> Initiate
                      </button>
                    )}
                  </>
                )}
                {step.status !== 'sent' && (
                  <button onClick={() => removeStep(step.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors text-neutral-300 hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {steps.length === 0 && (
        <div className="industrial-card p-8 flex flex-col items-center justify-center gap-2 border-dashed">
          <Zap size={24} className="text-neutral-200" />
          <p className="text-[10px] technical-label text-neutral-300 uppercase">No workflow steps yet — add one above</p>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ campaignId }: { campaignId: string }) {
  const { data: stats } = useCampaignStats(campaignId);
  const { data: targetLeads } = useCampaignTargetLeads(campaignId);
  const leadCount = Array.isArray(targetLeads)
    ? targetLeads.length
    : (targetLeads as { total?: number })?.total ?? 0;
  const totalBudget = MOCK_ADS.filter(a => a.channel === 'meta').reduce((sum, a) => sum + (a.budget ?? 0), 0);

  const s = stats as CampaignStats | undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Leads Targeted" value={leadCount.toLocaleString()} highlight />
        <StatCard label="Total Ads" value={MOCK_ADS.length} />
        <StatCard label="Meta Budget" value={totalBudget > 0 ? `$${totalBudget}` : '—'} />
        <StatCard label="Running Ads" value={MOCK_ADS.filter(a => a.status === 'running').length} />
      </div>

      {s && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Sent" value={s.total_sent.toLocaleString()} />
          <StatCard label="Delivery Rate" value={`${(s.delivery_rate * 100).toFixed(1)}%`} highlight />
          <StatCard label="Open Rate" value={`${(s.open_rate * 100).toFixed(1)}%`} />
          <StatCard label="Click Rate" value={`${(s.click_rate * 100).toFixed(1)}%`} />
        </div>
      )}

      <div className="industrial-card p-6 flex items-center justify-center min-h-[160px]">
        <div className="text-center space-y-2">
          <BarChart2 size={32} className="text-neutral-200 mx-auto" />
          <p className="technical-label text-neutral-300 text-[10px] uppercase">Conversion & click analytics coming soon</p>
        </div>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-[10px] font-black italic uppercase text-neutral-400 hover:text-black transition-colors">
      <ArrowLeft size={14} /> All Campaigns
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'text-[8px] font-black italic uppercase px-3 py-1 rounded-[1px]',
      status === 'active' ? 'bg-emerald-500 text-white' :
      status === 'paused' ? 'bg-amber-400 text-white' :
      'bg-neutral-200 text-neutral-600'
    )}>{status}</span>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="industrial-card p-4 space-y-1">
      <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">{label}</p>
      <p className="text-sm font-black italic uppercase tracking-tight">{value}</p>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={cn('industrial-card p-5 space-y-1', highlight && 'border-utopia/30 bg-utopia/5')}>
      <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">{label}</p>
      <p className={cn('text-2xl font-black italic uppercase tracking-tighter', highlight ? 'text-utopia' : 'text-black')}>{value}</p>
    </div>
  );
}
