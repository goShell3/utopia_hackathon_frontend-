'use client';

import React, { useState } from 'react';
import { 
  Zap, Plus, Send, Calendar, 
  ChevronRight, Sparkles, MessageSquare, Brain, Target, ArrowRight,
  Loader2, TrendingUp, X, Trash2
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { 
  useCampaigns, useCampaignStats, useCampaignTargetLeads,
  useActivateCampaign, usePauseCampaign, useExecuteCampaign,
  useCreateCampaign, useUpdateCampaign, useDeleteCampaign
} from '@/hooks/useCampaigns';
import { useTemplates } from '@/hooks/useTemplates';
import type { Campaign, CampaignCreate, CampaignUpdate, CampaignType, Lead, MessageChannel, TriggerEvent } from '@/types';

export default function CampaignsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'stats' | 'leads'>('workflow');
  const [showDialog, setShowDialog] = useState<false | 'create' | 'edit'>(false);
  const [formData, setFormData] = useState<Partial<CampaignCreate>>({
    name: '',
    campaign_type: 'trigger',
    channels: ['sms'],
    enable_ab_test: false
  });

  // Queries
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const activeCampaign = campaigns?.items.find(c => c.id === selectedId);

  const { data: stats, isLoading: statsLoading } = useCampaignStats(selectedId ?? '');
  const { data: targets, isLoading: targetsLoading } = useCampaignTargetLeads(selectedId ?? '');

  // Mutations
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const activate = useActivateCampaign();
  const pause = usePauseCampaign();
  const execute = useExecuteCampaign();

  const handleAction = async (action: 'activate' | 'pause' | 'execute' | 'delete', id: string) => {
    if (action === 'activate') await activate.mutateAsync(id);
    if (action === 'pause') await pause.mutateAsync(id);
    if (action === 'delete') {
      if (confirm('Permanently delete this campaign protocol?')) {
        await deleteCampaign.mutateAsync(id);
        if (selectedId === id) setSelectedId(null);
      }
    }
    if (action === 'execute') {
      if (confirm('Deploy campaign to all target leads now?')) {
        await execute.mutateAsync({ id });
      }
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
        await createCampaign.mutateAsync(cleanPayload as CampaignCreate);
      } else if (showDialog === 'edit' && selectedId) {
        await updateCampaign.mutateAsync({ id: selectedId, data: cleanPayload as CampaignUpdate });
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
          <Button variant="outline" size="md" icon={Calendar} className="bg-white uppercase font-black">Archive</Button>
          <Button 
            variant="primary" size="md" icon={Plus} className="uppercase font-black"
            onClick={() => {
              setFormData({ name: '', campaign_type: 'trigger', channels: ['sms'], enable_ab_test: false });
              setShowDialog('create');
            }}
          >Initialize Protocol</Button>
        </div>
      </div>

      {campaignsLoading ? (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-3xl">
          <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {campaigns?.items.map((campaign) => (
            <div key={campaign.id} onClick={() => setSelectedId(campaign.id)}
              className={cn("industrial-card p-6 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02]",
                selectedId === campaign.id ? "ring-2 ring-utopia border-transparent shadow-xl translate-y-[-4px]" : ""
              )}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-full", 
                  campaign.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                )}>
                  <Zap size={16} className={campaign.status === 'active' ? "animate-pulse" : ""} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleAction(campaign.status === 'active' ? 'pause' : 'activate', campaign.id); }}
                    className="p-1.5 hover:bg-neutral-100 rounded text-[10px] uppercase font-bold italic"
                    title={campaign.status === 'active' ? 'Pause Protocol' : 'Activate Protocol'}
                   >
                    {campaign.status === 'active' ? 'Pause' : 'Start'}
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); openEdit(campaign); }}
                    className="p-1.5 hover:bg-neutral-100 rounded text-[10px] uppercase font-bold italic"
                    title="Configure Parameters"
                   >
                    Edit
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('delete', campaign.id); }}
                    className="p-1.5 hover:bg-utopia/10 text-utopia rounded transition-colors"
                    title="Terminate Protocol"
                   >
                    <Trash2 size={14} />
                   </button>
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
                <div className="flex items-center gap-1 text-[10px] font-black italic text-utopia">
                   Live Stats <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && activeCampaign && (
        <div className="industrial-card p-1 overflow-hidden bg-neutral-100/50">
          <div className="flex overflow-x-auto border-b border-neutral-200 bg-white">
            <button 
              onClick={() => setActiveTab('workflow')}
              className={cn("px-8 py-4 text-[10px] technical-label uppercase font-black italic border-b-2 transition-all",
                activeTab === 'workflow' ? "border-utopia text-utopia bg-utopia/5" : "border-transparent text-neutral-400 hover:text-black"
              )}
            >Logic Flow</button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={cn("px-8 py-4 text-[10px] technical-label uppercase font-black italic border-b-2 transition-all",
                activeTab === 'stats' ? "border-utopia text-utopia bg-utopia/5" : "border-transparent text-neutral-400 hover:text-black"
              )}
            >Live Metrics</button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={cn("px-8 py-4 text-[10px] technical-label uppercase font-black italic border-b-2 transition-all",
                activeTab === 'leads' ? "border-utopia text-utopia bg-utopia/5" : "border-transparent text-neutral-400 hover:text-black"
              )}
            >Audience Pool</button>
          </div>

          <div className="p-8 bg-white min-h-[400px]">
             {/* Sub-Views Content (Logic previously implemented) */}
             {activeTab === 'workflow' && (
              <div className="flex flex-col items-center justify-center gap-12 py-10 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-100 -translate-y-1/2" />
                <div className="flex items-center gap-20 relative z-10">
                  <div className="flex flex-col items-center gap-4 group">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:scale-110"><Zap size={32} /></div>
                    <div className="text-center">
                      <span className="text-[9px] font-black italic text-neutral-400 uppercase">Trigger</span>
                      <p className="text-[10px] font-bold uppercase italic mt-1">{activeCampaign.trigger_event ? activeCampaign.trigger_event.replace('.', ' ') : 'Manual Start'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                    <div className="w-14 h-14 bg-white border border-neutral-200 text-black flex items-center justify-center rounded-2xl rotate-45 shadow-lg group-hover:rotate-90 transition-transform">
                      <Brain className="-rotate-45 group-hover:-rotate-90 transition-transform" size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] font-black italic text-neutral-400 uppercase">Protocol</span>
                      <p className="text-xs font-bold uppercase italic mt-1">Utopia AI Filter</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                    <div className="w-16 h-16 bg-utopia text-white flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:scale-110"><MessageSquare size={32} /></div>
                    <div className="text-center">
                      <span className="text-[9px] font-black italic text-neutral-400 uppercase">Action</span>
                      <p className="text-xs font-bold uppercase italic mt-1">{activeCampaign.channels[0]} Deployment</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {statsLoading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <StatCard label="Total Sent" value={stats?.total_sent} icon={Send} color="neutral" />
                    <StatCard label="Delivery Rate" value={`${stats?.delivery_rate}%`} icon={Zap} color="utopia" />
                    <StatCard label="Open Rate" value={`${stats?.open_rate}%`} icon={TrendingUp} color="neutral" />
                    <StatCard label="Conversion" value={`${stats?.click_rate}%`} icon={Target} color="utopia" />
                  </>
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black italic uppercase tracking-[0.2em] text-neutral-400">Target Segment Pool</h4>
                  <span className="text-[10px] font-bold technical-label">{(targets as unknown as any[])?.length ?? 0} Matched Profiles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-black">
                  {targetsLoading ? <Loader2 className="animate-spin" /> : (targets as unknown as Lead[])?.map((lead, idx) => (
                    <div key={idx} className="p-3 border border-neutral-100 hover:border-utopia/30 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black italic">
                          {lead.first_name?.[0] || '?'}{lead.last_name?.[0] || ''}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase italic">{lead.first_name} {lead.last_name}</p>
                          <p className="text-[8px] technical-label text-neutral-400 tracking-tighter">{lead.phone}</p>
                        </div>
                      </div>
                      <ChevronRight size={12} className="text-neutral-200 group-hover:text-utopia transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-black text-white flex items-center justify-between uppercase italic">
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black tracking-widest">Selected Unit: {activeCampaign.name}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-utopia animate-pulse" />
               <span className="text-[9px] technical-label tracking-widest text-neutral-400">System Ready for Protocol Execution</span>
            </div>
            <div className="flex gap-4">
               <Button 
                variant="primary" size="sm" icon={Send} 
                onClick={() => handleAction('execute', activeCampaign.id)}
                className="bg-utopia text-[8px] font-black italic h-7"
               >Manual Force deployment</Button>
               <Sparkles size={14} className="text-utopia" />
            </div>
          </div>
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

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon: React.ElementType;
  color: 'utopia' | 'neutral';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="p-6 border border-neutral-200 bg-neutral-50/50 hover:bg-white transition-colors group">
      <div className={cn("inline-flex p-2 rounded-lg mb-4 h-10 w-10 items-center justify-center transition-transform group-hover:scale-110", 
        color === 'utopia' ? "bg-utopia text-white shadow-lg shadow-utopia/20" : "bg-black text-white shadow-lg"
      )}>
        <Icon size={18} />
      </div>
      <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black italic uppercase tracking-tighter text-black">{value ?? '--'}</p>
    </div>
  );
}
