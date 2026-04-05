'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Plus, Calendar, Filter, ArrowRight, X, ChevronDown, MoreVertical, Eye, Pencil, PauseCircle, PlayCircle } from 'lucide-react';
import { toSlug, cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { CampaignTimeline } from '@/components/campaigns/CampaignTimeline';
import type { Campaign, CampaignStatus, CampaignGoal, CampaignTarget } from '@/data/campaign';

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Summer Bookings Push',
    goal: 'bookings',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    target: { source: ['meta', 'website'] },
  },
  {
    id: '2',
    name: 'Brand Awareness Q3',
    goal: 'awareness',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'draft',
    target: { source: ['pms'] },
  },
  {
    id: '3',
    name: 'Lead Gen Winter',
    goal: 'lead_generation',
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    status: 'paused',
  },
];

type FormData = Omit<Campaign, 'id'>;

const EMPTY_FORM: FormData = {
  name: '',
  goal: 'bookings',
  startDate: '',
  endDate: '',
  status: 'draft',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [showDialog, setShowDialog] = useState<false | 'create' | 'edit'>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGoal, setFilterGoal] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleStatus = (id: string, current: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id
      ? { ...c, status: current === 'active' ? 'paused' : 'active' }
      : c
    ));
    setOpenMenuId(null);
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterGoal !== 'all' && c.goal !== filterGoal) return false;
    return true;
  });

  const activeFilterCount = (filterStatus !== 'all' ? 1 : 0) + (filterGoal !== 'all' ? 1 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showDialog === 'create') {
      setCampaigns(prev => [...prev, { ...formData, id: crypto.randomUUID() }]);
    } else if (showDialog === 'edit' && selectedId) {
      setCampaigns(prev => prev.map(c => c.id === selectedId ? { ...formData, id: selectedId } : c));
    }
    setShowDialog(false);
    setFormData(EMPTY_FORM);
  };

  const openEdit = (campaign: Campaign) => {
    const { id, ...rest } = campaign;
    setFormData(rest);
    setSelectedId(id);
    setShowDialog('edit');
    setOpenMenuId(null);
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
                "flex items-center gap-2 h-9 px-4 border text-[10px] font-black italic uppercase transition-colors",
                showFilter || activeFilterCount > 0 ? "border-utopia text-utopia bg-utopia/5" : "border-neutral-200 text-neutral-500 bg-white hover:border-black hover:text-black"
              )}
            >
              <Filter size={12} />
              Filter
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
                      )}
                    >{s === 'all' ? 'All Statuses' : s}</button>
                  ))}
                </div>
                <div className="border-t border-neutral-100 pt-4 space-y-1.5">
                  <p className="text-[9px] font-black italic uppercase text-neutral-400">Goal</p>
                  {(['all', 'bookings', 'awareness', 'lead_generation'] as const).map(g => (
                    <button key={g} onClick={() => setFilterGoal(g)}
                      className={cn('w-full text-left px-3 py-1.5 text-[10px] font-black italic uppercase transition-colors',
                        filterGoal === g ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'
                      )}
                    >{g === 'all' ? 'All Goals' : g.replace('_', ' ')}</button>
                  ))}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setFilterStatus('all'); setFilterGoal('all'); }}
                    className="w-full text-[9px] font-black italic uppercase text-utopia hover:underline text-left pt-1"
                  >Clear filters</button>
                )}
              </div>
            )}
          </div>

          <Button variant="outline" size="md" icon={Calendar} className="bg-white uppercase font-black">Archive</Button>
          <Button
            variant="primary" size="md" icon={Plus} className="uppercase font-black"
            onClick={() => { setFormData(EMPTY_FORM); setShowDialog('create'); }}
          >Create a Campaign</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="industrial-card p-6 flex flex-col justify-between group transition-all hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-2 rounded-full",
                campaign.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"
              )}>
                <Zap size={16} className={campaign.status === 'active' ? "animate-pulse" : ""} />
              </div>
              <div className="relative" ref={openMenuId === campaign.id ? menuRef : null}>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === campaign.id ? null : campaign.id); }}
                  className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-black"
                >
                  <MoreVertical size={14} />
                </button>
                {openMenuId === campaign.id && (
                  <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-neutral-200 shadow-xl w-40 py-1">
                    <Link
                      href={`/campaigns/${toSlug(campaign.name)}`}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700"
                      onClick={() => setOpenMenuId(null)}
                    >
                      <Eye size={11} /> View
                    </Link>
                    <button
                      onClick={() => openEdit(campaign)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    {campaign.status === 'active' ? (
                      <button
                        onClick={() => toggleStatus(campaign.id, campaign.status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700"
                      >
                        <PauseCircle size={11} /> Pause
                      </button>
                    ) : campaign.status === 'paused' ? (
                      <button
                        onClick={() => toggleStatus(campaign.id, campaign.status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-emerald-600"
                      >
                        <PlayCircle size={11} /> Activate
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-black italic tracking-tight uppercase leading-tight group-hover:text-utopia transition-colors">{campaign.name}</h3>
              <p className="technical-label text-[9px] text-neutral-400 mt-1 uppercase tracking-tighter">{campaign.goal.replace('_', ' ')} Goal</p>
              <p className="technical-label text-[9px] text-neutral-300 mt-0.5 uppercase tracking-tighter">{campaign.startDate} → {campaign.endDate}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className={cn("text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]",
                campaign.status === 'active' ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-500"
              )}>{campaign.status}</div>
              <Link href={`/campaigns/${toSlug(campaign.name)}`} className="flex items-center gap-1 text-[10px] font-black italic text-utopia hover:underline">
                Live Stats <ArrowRight size={10} />
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

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="industrial-card w-full max-w-2xl bg-white p-8 relative shadow-2xl">
            <button onClick={() => setShowDialog(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-black">
              <X size={20} />
            </button>
            <div className="mb-8">
              <h2 className="display-header text-2xl italic uppercase tracking-tighter">Protocol Configuration</h2>
              <p className="technical-label text-[10px] text-neutral-400 uppercase tracking-widest">Initialization & Logistics</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Unit Name</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                    placeholder="E.g., WELCOME FLOW ALPHA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Goal</label>
                  <select
                    value={formData.goal}
                    onChange={e => setFormData({ ...formData, goal: e.target.value as CampaignGoal })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  >
                    <option value="bookings">Bookings</option>
                    <option value="awareness">Awareness</option>
                    <option value="lead_generation">Lead Generation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Start Date</label>
                  <input
                    type="date" required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">End Date</label>
                  <input
                    type="date" required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Source Filter</label>
                  <select
                    value={formData.target?.source?.[0] ?? ''}
                    onChange={e => setFormData({
                      ...formData,
                      target: e.target.value ? { ...formData.target, source: [e.target.value as CampaignTarget['source'][0]] } : undefined
                    })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  >
                    <option value="">All Sources</option>
                    <option value="pms">PMS</option>
                    <option value="meta">Meta</option>
                    <option value="website">Website</option>
                    <option value="manual">Manual</option>
                    <option value="meta_ads">Meta Ads</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" size="md" onClick={() => setShowDialog(false)} className="uppercase font-black italic text-[10px]">Abort</Button>
                <Button type="submit" variant="primary" size="md" icon={ArrowRight} className="uppercase font-black italic text-[10px]">Commit Protocol</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
