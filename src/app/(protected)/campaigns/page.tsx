'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Plus, Filter, ArrowRight, X, ChevronDown,
  MoreVertical, Eye, Pencil, PauseCircle, PlayCircle,
  MessageSquare, Megaphone, CheckSquare, Square, ArrowLeft,
} from 'lucide-react';
import { toSlug, cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { CampaignTimeline } from '@/components/campaigns/CampaignTimeline';
import { useCampaigns, useCreateCampaign, usePauseCampaign, useActivateCampaign } from '@/hooks/useCampaigns';
import type { Campaign, CampaignStatus, CampaignGoal, CampaignPurpose } from '@/data/campaign';

// ─── Wizard types ─────────────────────────────────────────────────────────────
interface WizardState {
  name: string;
  goal: CampaignGoal;
  startDate: string;
  endDate: string;
  purpose: { activation: boolean; acquisition: boolean };
  // activation
  segmentId: string;
  source: string;
  // acquisition
  metaBudget: string;
  metaCopy: string;
  googleBudget: string;
  googleCopy: string;
}

const EMPTY_WIZARD: WizardState = {
  name: '', goal: 'bookings', startDate: '', endDate: '',
  purpose: { activation: false, acquisition: false },
  segmentId: '', source: '',
  metaBudget: '', metaCopy: '', googleBudget: '', googleCopy: '',
};

const SEGMENTS = [
  { id: 's1', name: 'Addis VIP' },
  { id: 's2', name: 'Recent PMS' },
  { id: 's3', name: 'Meta Leads' },
  { id: 's4', name: 'Diaspora Summer' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const { data: remoteCampaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const pauseCampaign = usePauseCampaign();
  const activateCampaign = useActivateCampaign();
  const [campaignsLocal, setCampaignsLocal] = useState<any[]>([]); // for optimistic/local fallback if needed
  
  // Use remote items + any local mocked campaigns
  const campaigns: any[] = [...campaignsLocal, ...remoteCampaigns];
  const [showWizard, setShowWizard] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGoal, setFilterGoal] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleStatus = async (id: string, current: CampaignStatus) => {
    if (current === 'active') {
      await pauseCampaign.mutateAsync(id);
    } else {
      await activateCampaign.mutateAsync(id);
    }
    setOpenMenuId(null);
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterGoal !== 'all' && c.goal !== filterGoal) return false;
    return true;
  });

  const activeFilterCount = (filterStatus !== 'all' ? 1 : 0) + (filterGoal !== 'all' ? 1 : 0);

  const handleCreate = async (wizard: WizardState) => {
    const campaignId = crypto.randomUUID();
    const purpose: CampaignPurpose =
      wizard.purpose.activation && wizard.purpose.acquisition ? 'both'
      : wizard.purpose.acquisition ? 'acquisition'
      : 'activation';

    const ads: Campaign['ads'] = [];

    if (wizard.purpose.activation) {
      ads.push(
        {
          id: crypto.randomUUID(),
          campaignId,
          purpose: 'activation',
          channel: 'sms',
          message: 'Hi {{name}}, we have a special offer for your next stay. Reply to learn more.',
          status: 'draft',
        },
        {
          id: crypto.randomUUID(),
          campaignId,
          purpose: 'activation',
          channel: 'email',
          title: `${wizard.name} — Email Outreach`,
          message: 'Dear {{name}}, enjoy an exclusive rate and book your next stay with us today.',
          status: 'draft',
        }
      );
    }

    if (wizard.purpose.acquisition) {
      ads.push(
        {
          id: crypto.randomUUID(),
          campaignId,
          purpose: 'acquisition',
          channel: 'meta',
          title: `${wizard.name} — Meta Ad`,
          message: wizard.metaCopy.trim() || 'Discover your perfect getaway. Limited-time rates available now.',
          status: 'draft',
          budget: wizard.metaBudget ? Number(wizard.metaBudget) : undefined,
          leadsCaptured: 0,
        },
        {
          id: crypto.randomUUID(),
          campaignId,
          purpose: 'acquisition',
          channel: 'google',
          title: `${wizard.name} — Google Ad`,
          message: wizard.googleCopy.trim() || 'Book direct for the best rates and premium hospitality.',
          status: 'draft',
          budget: wizard.googleBudget ? Number(wizard.googleBudget) : undefined,
          leadsCaptured: 0,
        }
      );
    }

    const newCampaign: Campaign = {
      id: campaignId,
      name: wizard.name,
      goal: wizard.goal,
      purpose,
      startDate: wizard.startDate,
      endDate: wizard.endDate,
      status: 'draft',
      target: wizard.purpose.activation ? {
        source: wizard.source ? [wizard.source as 'pms' | 'meta' | 'website' | 'manual'] : undefined,
        segmentIds: wizard.segmentId ? [wizard.segmentId] : undefined,
      } : undefined,
      ads,
    };
    const created = await createCampaign.mutateAsync(newCampaign as any);
    setCampaignsLocal(prev => [created, ...prev]);
    setShowWizard(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter uppercase">Campaign Engine</h1>
          <p className="technical-label text-neutral-500 mt-1 uppercase tracking-widest">Automated Strategic Deployment</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className={cn(
                'flex items-center gap-2 h-9 px-4 border text-[10px] font-black italic uppercase transition-colors',
                showFilter || activeFilterCount > 0 ? 'border-utopia text-utopia bg-utopia/5' : 'border-neutral-200 text-neutral-500 bg-white hover:border-black hover:text-black'
              )}
            >
              <Filter size={12} /> Filter
              {activeFilterCount > 0 && (
                <span className="bg-utopia text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
              )}
              <ChevronDown size={10} className={cn('transition-transform', showFilter && 'rotate-180')} />
            </button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-neutral-200 shadow-xl p-4 w-56 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black italic uppercase text-neutral-400">Status</p>
                  {(['all', 'active', 'paused', 'draft', 'completed'] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={cn('w-full text-left px-3 py-1.5 text-[10px] font-black italic uppercase transition-colors',
                        filterStatus === s ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'
                      )}>{s === 'all' ? 'All Statuses' : s}</button>
                  ))}
                </div>
                <div className="border-t border-neutral-100 pt-4 space-y-1.5">
                  <p className="text-[9px] font-black italic uppercase text-neutral-400">Goal</p>
                  {(['all', 'bookings', 'awareness', 'lead_generation'] as const).map(g => (
                    <button key={g} onClick={() => setFilterGoal(g)}
                      className={cn('w-full text-left px-3 py-1.5 text-[10px] font-black italic uppercase transition-colors',
                        filterGoal === g ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'
                      )}>{g === 'all' ? 'All Goals' : g.replace('_', ' ')}</button>
                  ))}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={() => { setFilterStatus('all'); setFilterGoal('all'); }}
                    className="w-full text-[9px] font-black italic uppercase text-utopia hover:underline text-left pt-1">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          <Button variant="primary" size="md" icon={Plus} className="uppercase font-black"
            onClick={() => setShowWizard(true)}>
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaign cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="industrial-card p-6 flex flex-col justify-between group transition-all hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className={cn('p-2 rounded-full',
                campaign.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'
              )}>
                <Zap size={16} className={campaign.status === 'active' ? 'animate-pulse' : ''} />
              </div>
              <div className="relative" ref={openMenuId === campaign.id ? menuRef : null}>
                <button
                  onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === campaign.id ? null : campaign.id); }}
                  className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-black"
                >
                  <MoreVertical size={14} />
                </button>
                {openMenuId === campaign.id && (
                  <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-neutral-200 shadow-xl w-40 py-1">
                    <Link href={`/campaigns/${toSlug(campaign.name)}`}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700"
                      onClick={() => setOpenMenuId(null)}>
                      <Eye size={11} /> View
                    </Link>
                    {campaign.status === 'active' ? (
                      <button onClick={() => toggleStatus(campaign.id, campaign.status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700">
                        <PauseCircle size={11} /> Pause
                      </button>
                    ) : campaign.status === 'paused' ? (
                      <button onClick={() => toggleStatus(campaign.id, campaign.status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-emerald-600">
                        <PlayCircle size={11} /> Activate
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 space-y-1">
              <h3 className="text-sm font-black italic tracking-tight uppercase leading-tight group-hover:text-utopia transition-colors">
                {campaign.name}
              </h3>
              <p className="technical-label text-[9px] text-neutral-400 uppercase tracking-tighter">
                {campaign.goal.replace('_', ' ')} · {campaign.startDate} → {campaign.endDate}
              </p>
              {/* Purpose pills */}
              <div className="flex gap-1 pt-1">
                {(campaign.purpose === 'activation' || campaign.purpose === 'both') && (
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[2px]">
                    <MessageSquare size={8} /> Activation
                  </span>
                )}
                {(campaign.purpose === 'acquisition' || campaign.purpose === 'both') && (
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-[2px]">
                    <Megaphone size={8} /> Acquisition
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className={cn('text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]',
                campaign.status === 'active' ? 'bg-emerald-500 text-white' :
                campaign.status === 'paused' ? 'bg-amber-400 text-white' :
                'bg-neutral-200 text-neutral-500'
              )}>{campaign.status}</div>
              <Link href={`/campaigns/${toSlug(campaign.name)}`}
                className="flex items-center gap-1 text-[10px] font-black italic text-utopia hover:underline">
                Open <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length > 0 && (
        <div className="industrial-card p-6">
          <div className="mb-6">
            <h3 className="display-header text-xl italic">Campaign Timeline</h3>
            <p className="technical-label text-[9px] text-neutral-400">Scroll to zoom · Drag to pan</p>
          </div>
          <CampaignTimeline campaigns={filteredCampaigns} />
        </div>
      )}

      {showWizard && (
        <CampaignWizard onClose={() => setShowWizard(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

// ─── 4-Step Wizard ────────────────────────────────────────────────────────────
function CampaignWizard({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (w: WizardState) => void;
}) {
  const [step, setStep] = useState(1);
  const [w, setW] = useState<WizardState>(EMPTY_WIZARD);

  const canNext = () => {
    if (step === 1) return w.name.trim() !== '' && w.startDate !== '' && w.endDate !== '';
    if (step === 2) return w.purpose.activation || w.purpose.acquisition;
    return true;
  };

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const STEP_LABELS = ['Strategy', 'Intent', 'Configure', 'Summary'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="industrial-card w-full max-w-2xl bg-white relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="display-header text-2xl italic uppercase tracking-tighter">New Campaign</h2>
            <p className="technical-label text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
              Step {step} of 4 — {STEP_LABELS[step - 1]}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-8 gap-1 mb-6">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className={cn('h-0.5 flex-1 transition-colors', i + 1 <= step ? 'bg-black' : 'bg-neutral-100')} />
          ))}
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Step 1: Strategy */}
          {step === 1 && (
            <div className="space-y-5">
              <Field label="Campaign Name">
                <input value={w.name} onChange={e => setW(p => ({ ...p, name: e.target.value }))}
                  placeholder="E.g., TIMKAT GONDAR 2026"
                  className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none" />
              </Field>
              <Field label="Goal">
                <select value={w.goal} onChange={e => setW(p => ({ ...p, goal: e.target.value as CampaignGoal }))}
                  className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none">
                  <option value="bookings">Bookings</option>
                  <option value="awareness">Awareness</option>
                  <option value="lead_generation">Lead Generation</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date">
                  <input type="date" value={w.startDate} onChange={e => setW(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold focus:border-utopia transition-colors outline-none" />
                </Field>
                <Field label="End Date">
                  <input type="date" value={w.endDate} onChange={e => setW(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold focus:border-utopia transition-colors outline-none" />
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Intent */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">What do you want to do?</p>
              <IntentCard
                icon={MessageSquare}
                title="Target existing leads"
                description="Send SMS or Email to leads already in your database"
                color="emerald"
                checked={w.purpose.activation}
                onToggle={() => setW(p => ({ ...p, purpose: { ...p.purpose, activation: !p.purpose.activation } }))}
              />
              <IntentCard
                icon={Megaphone}
                title="Capture new leads"
                description="Run Meta Ads or Google Ads to acquire new leads"
                color="violet"
                checked={w.purpose.acquisition}
                onToggle={() => setW(p => ({ ...p, purpose: { ...p.purpose, acquisition: !p.purpose.acquisition } }))}
              />
            </div>
          )}

          {/* Step 3: Configure */}
          {step === 3 && (
            <div className="space-y-6">
              {w.purpose.activation && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                    <MessageSquare size={11} className="text-emerald-600" /> Activation — Target Existing Leads
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Segment">
                      <select value={w.segmentId} onChange={e => setW(p => ({ ...p, segmentId: e.target.value }))}
                        className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none">
                        <option value="">All Segments</option>
                        {SEGMENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Source Filter">
                      <select value={w.source} onChange={e => setW(p => ({ ...p, source: e.target.value }))}
                        className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none">
                        <option value="">All Sources</option>
                        <option value="pms">PMS</option>
                        <option value="meta">Meta</option>
                        <option value="website">Website</option>
                        <option value="manual">Manual</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {w.purpose.activation && w.purpose.acquisition && (
                <div className="border-t border-neutral-100" />
              )}

              {w.purpose.acquisition && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                    <Megaphone size={11} className="text-violet-600" /> Acquisition — Ad Creative & Budget
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Meta Budget ($)">
                      <input type="number" value={w.metaBudget} onChange={e => setW(p => ({ ...p, metaBudget: e.target.value }))}
                        placeholder="500"
                        className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold focus:border-utopia transition-colors outline-none" />
                    </Field>
                    <Field label="Google Budget ($)">
                      <input type="number" value={w.googleBudget} onChange={e => setW(p => ({ ...p, googleBudget: e.target.value }))}
                        placeholder="300"
                        className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold focus:border-utopia transition-colors outline-none" />
                    </Field>
                  </div>
                  <Field label="Meta Ad Copy">
                    <textarea value={w.metaCopy} onChange={e => setW(p => ({ ...p, metaCopy: e.target.value }))}
                      rows={2} placeholder="Discover your perfect getaway..."
                      className="w-full border-b-2 border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-bold placeholder:font-normal placeholder:text-neutral-400 focus:border-utopia transition-colors outline-none resize-none" />
                  </Field>
                  <Field label="Google Ad Copy">
                    <textarea value={w.googleCopy} onChange={e => setW(p => ({ ...p, googleCopy: e.target.value }))}
                      rows={2} placeholder="Book direct for the best rates..."
                      className="w-full border-b-2 border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-bold placeholder:font-normal placeholder:text-neutral-400 focus:border-utopia transition-colors outline-none resize-none" />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">This campaign will:</p>
              <div className="space-y-3">
                <SummaryRow label="Name" value={w.name} />
                <SummaryRow label="Goal" value={w.goal.replace('_', ' ')} />
                <SummaryRow label="Dates" value={`${w.startDate} → ${w.endDate}`} />
                {w.purpose.activation && (
                  <div className="flex items-start gap-3 py-3 border border-emerald-200 bg-emerald-50 px-4 rounded-[2px]">
                    <MessageSquare size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-emerald-700">→ Send SMS / Email to existing leads</p>
                      <p className="text-[9px] text-emerald-600 mt-0.5">
                        {w.segmentId ? `Segment: ${SEGMENTS.find(s => s.id === w.segmentId)?.name}` : 'All segments'}
                        {w.source ? ` · Source: ${w.source}` : ''}
                      </p>
                    </div>
                  </div>
                )}
                {w.purpose.acquisition && (
                  <div className="flex items-start gap-3 py-3 border border-violet-200 bg-violet-50 px-4 rounded-[2px]">
                    <Megaphone size={14} className="text-violet-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-violet-700">→ Run Meta / Google ads to capture new leads</p>
                      <p className="text-[9px] text-violet-600 mt-0.5">
                        {w.metaBudget ? `Meta $${w.metaBudget}` : ''}
                        {w.metaBudget && w.googleBudget ? ' · ' : ''}
                        {w.googleBudget ? `Google $${w.googleBudget}` : ''}
                        {!w.metaBudget && !w.googleBudget ? 'No budget set yet' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            {step > 1
              ? <button onClick={back} className="flex items-center gap-2 text-[10px] font-black italic uppercase text-neutral-400 hover:text-black transition-colors">
                  <ArrowLeft size={12} /> Back
                </button>
              : <div />
            }
            {step < 4
              ? <Button variant="primary" size="md" icon={ArrowRight} onClick={next} disabled={!canNext()}
                  className="uppercase font-black italic text-[10px]">
                  Next
                </Button>
              : <Button variant="primary" size="md" icon={ArrowRight} onClick={() => onCreate(w)}
                  className="uppercase font-black italic text-[10px]">
                  Launch Campaign
                </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard sub-components ────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black italic uppercase text-neutral-400">{label}</label>
      {children}
    </div>
  );
}

function IntentCard({ icon: Icon, title, description, color, checked, onToggle }: {
  icon: React.ElementType; title: string; description: string;
  color: 'emerald' | 'violet'; checked: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className={cn(
      'w-full flex items-start gap-4 p-5 border-2 transition-all text-left rounded-[2px]',
      checked
        ? color === 'emerald' ? 'border-emerald-500 bg-emerald-50' : 'border-violet-500 bg-violet-50'
        : 'border-neutral-200 bg-white hover:border-neutral-300'
    )}>
      <div className={cn('p-2 rounded-lg shrink-0',
        checked
          ? color === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'
          : 'bg-neutral-100 text-neutral-400'
      )}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-black italic uppercase tracking-tight">{title}</p>
        <p className="text-[10px] text-neutral-500 mt-0.5">{description}</p>
      </div>
      {checked
        ? <CheckSquare size={18} className={color === 'emerald' ? 'text-emerald-500' : 'text-violet-500'} />
        : <Square size={18} className="text-neutral-300" />
      }
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-100">
      <span className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">{label}</span>
      <span className="text-[11px] font-black italic uppercase">{value}</span>
    </div>
  );
}
