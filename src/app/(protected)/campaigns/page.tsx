'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Plus, Calendar, Filter,
  ArrowRight, Loader2, X, Trash2, ChevronDown
} from 'lucide-react';
import { toSlug } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { CampaignTimeline } from '@/components/campaigns/CampaignTimeline';
import { 
  useCampaigns,
  useCreateCampaign, useUpdateCampaign, useDeleteCampaign
} from '@/hooks/useCampaigns';
import type { Campaign, CampaignCreate, CampaignUpdate, CampaignType, MessageChannel, TriggerEvent } from '@/types';

export default function CampaignsPage() {
  const [showDialog, setShowDialog] = useState<false | 'create' | 'edit'>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [formData, setFormData] = useState<Partial<CampaignCreate>>({
    name: '',
    campaign_type: 'trigger',
    channels: ['sms'],
    enable_ab_test: false
  });

  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const filteredCampaigns = campaigns?.items.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'all' && c.campaign_type !== filterType) return false;
    return true;
  }) ?? [];

  const activeFilterCount = (filterStatus !== 'all' ? 1 : 0) + (filterType !== 'all' ? 1 : 0);

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this campaign protocol?')) {
      await deleteCampaign.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Payload Sanitization: Remove nulls, empty strings, and irrelevant fields
      const payload = { ...formData };
      
      // Strict rule: Only Trigger campaigns can have a trigger_event
      if (payload.campaign_type !== 'trigger') {
        delete payload.trigger_event;
      }
      
      // Strict rule: Only Scheduled campaigns should have schedule_cron
      if (payload.campaign_type !== 'scheduled') {
        delete payload.schedule_cron;
      }

      // Final wash: Remove any keys with null or empty values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v != null && v !== "")
      );

      if (showDialog === 'create') {
        await createCampaign.mutateAsync(cleanPayload as unknown as CampaignCreate);
      } else if (showDialog === 'edit' && selectedId) {
        await updateCampaign.mutateAsync({ id: selectedId, data: cleanPayload as unknown as CampaignUpdate });
      }
      setShowDialog(false);
      setFormData({ name: '', campaign_type: 'trigger', channels: ['sms'], enable_ab_test: false });
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const openEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
      campaign_type: campaign.campaign_type,
      trigger_event: campaign.trigger_event as TriggerEvent,
      channels: campaign.channels as MessageChannel[],
      enable_ab_test: campaign.enable_ab_test
    });
    setSelectedId(campaign.id);
    setShowDialog('edit');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter uppercase">Campaign Engine</h1>
          <p className="technical-label text-neutral-500 mt-1 uppercase tracking-widest">Automated Strategic Deployment</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
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
                  {['all', 'active', 'paused', 'draft', 'completed'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-[10px] font-black italic uppercase transition-colors',
                        filterStatus === s ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'
                      )}
                    >{s === 'all' ? 'All Statuses' : s}</button>
                  ))}
                </div>
                <div className="border-t border-neutral-100 pt-4 space-y-1.5">
                  <p className="text-[9px] font-black italic uppercase text-neutral-400">Type</p>
                  {['all', 'trigger', 'scheduled', 'manual'].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-[10px] font-black italic uppercase transition-colors',
                        filterType === t ? 'bg-black text-white' : 'hover:bg-neutral-50 text-neutral-600'
                      )}
                    >{t === 'all' ? 'All Types' : t}</button>
                  ))}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setFilterStatus('all'); setFilterType('all'); }}
                    className="w-full text-[9px] font-black italic uppercase text-utopia hover:underline text-left pt-1"
                  >Clear filters</button>
                )}
              </div>
            )}
          </div>

          <Button variant="outline" size="md" icon={Calendar} className="bg-white uppercase font-black">Archive</Button>
          <Button 
            variant="primary" size="md" icon={Plus} className="uppercase font-black"
            onClick={() => {
              setFormData({ name: '', campaign_type: 'trigger', channels: ['sms'], enable_ab_test: false });
              setShowDialog('create');
            }}
          >Create a Campaign</Button>
        </div>
      </div>

      {campaignsLoading ? (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-3xl">
          <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
        </div>
      ) : (
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
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(campaign); }}
                    className="p-1.5 hover:bg-neutral-100 rounded text-[10px] uppercase font-bold italic"
                  >Edit</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(campaign.id); }}
                    className="p-1.5 hover:bg-utopia/10 text-utopia rounded transition-colors"
                  ><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-black italic tracking-tight uppercase leading-tight group-hover:text-utopia transition-colors">{campaign.name}</h3>
                <p className="technical-label text-[9px] text-neutral-400 mt-1 uppercase tracking-tighter">{campaign.campaign_type} Protocol</p>
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
      )}

      {/* Timeline */}
      {!campaignsLoading && campaigns?.items && campaigns.items.length > 0 && (
        <div className="industrial-card p-6">
          <div className="mb-6">
            <h3 className="display-header text-xl italic">Campaign Timeline</h3>
            <p className="technical-label text-[9px] text-neutral-400">Scroll to zoom · Drag to pan</p>
          </div>
          <CampaignTimeline campaigns={filteredCampaigns} />
        </div>
      )}

      {/* Campaign Initialization Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="industrial-card w-full max-w-2xl bg-white p-8 relative shadow-2xl scale-in duration-300">
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
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Unit Type</label>
                  <select 
                    value={formData.campaign_type}
                    onChange={e => setFormData({ ...formData, campaign_type: e.target.value as CampaignType })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                  >
                    <option value="trigger">Trigger-Based</option>
                    <option value="scheduled">Scheduled Broadcast</option>
                    <option value="manual">Manual Tactical</option>
                  </select>
                </div>
              </div>

              {formData.campaign_type === 'scheduled' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[9px] font-black italic uppercase text-neutral-400">Schedule (Cron)</label>
                  <input 
                    type="text" required
                    value={formData.schedule_cron ?? '0 9 * * *'}
                    onChange={e => setFormData({ ...formData, schedule_cron: e.target.value })}
                    className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                    placeholder="0 9 * * * (Daily at 9:00 AM)"
                  />
                  <p className="text-[8px] technical-label text-neutral-400 tracking-tighter">Enter a valid cron expression for automated execution.</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black italic uppercase text-neutral-400">Deployment Context (Trigger Event)</label>
                <select 
                   value={formData.trigger_event ?? ''}
                   onChange={e => setFormData({ ...formData, trigger_event: (e.target.value as TriggerEvent) || null })}
                   className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                >
                  <option value="">Manual Deployment Only</option>
                  <option value="lead.created">Lead Logic Initiated</option>
                  <option value="booking.confirmed">Booking Confirmation</option>
                  <option value="checkin">Guest Check-In</option>
                  <option value="checkout">Guest Check-Out</option>
                  <option value="checkout.completed">Checkout Process End</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black italic uppercase text-neutral-400">Primary Channel</label>
                    <select 
                      value={formData.channels?.[0] ?? 'sms'}
                      onChange={e => setFormData({ ...formData, channels: [e.target.value as MessageChannel] })}
                      className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic uppercase focus:border-utopia transition-colors outline-none"
                    >
                      <option value="sms">Tactical SMS Pool</option>
                      <option value="email">Direct Email Service</option>
                      <option value="whatsapp">Global WhatsApp Node</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black italic uppercase text-neutral-400">Intelligence Variant (A/B Test)</label>
                    <div className="flex items-center gap-4 h-10">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.enable_ab_test}
                            onChange={e => setFormData({ ...formData, enable_ab_test: e.target.checked })}
                            className="w-4 h-4 accent-utopia"
                          />
                          <span className="text-[10px] font-bold italic uppercase">Activate Intelligence Split</span>
                       </label>
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button 
                  type="button" variant="outline" size="md" 
                  onClick={() => setShowDialog(false)}
                  className="uppercase font-black italic text-[10px]"
                >Abort</Button>
                <Button 
                  type="submit" variant="primary" size="md" 
                  icon={ArrowRight}
                  className="uppercase font-black italic text-[10px]"
                >Commit Protocol</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

