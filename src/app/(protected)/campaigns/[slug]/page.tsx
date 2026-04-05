'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Zap, Send, Brain, MessageSquare, Target, TrendingUp, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import {
  useCampaigns, useCampaignStats, useCampaignTargetLeads,
  useActivateCampaign, usePauseCampaign, useExecuteCampaign,
} from '@/hooks/useCampaigns';
import type { Lead, Campaign } from '@/types';
import { toSlug } from '@/lib/utils';

export default function CampaignDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'workflow' | 'stats' | 'leads'>('workflow');

  const { data: campaigns, isLoading } = useCampaigns();
  const campaign = campaigns?.items.find((c: Campaign) => toSlug(c.name) === slug);

  const { data: stats, isLoading: statsLoading } = useCampaignStats(campaign?.id ?? '');
  const { data: targets, isLoading: targetsLoading } = useCampaignTargetLeads(campaign?.id ?? '');

  const activate = useActivateCampaign();
  const pause = usePauseCampaign();
  const execute = useExecuteCampaign();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black italic uppercase text-neutral-400 hover:text-black transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <p className="technical-label text-neutral-400">Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black italic uppercase text-neutral-400 hover:text-black transition-colors">
          <ArrowLeft size={14} /> All Campaigns
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-3xl italic tracking-tighter uppercase">{campaign.name}</h1>
          <p className="technical-label text-neutral-500 mt-0.5 uppercase tracking-widest">{campaign.campaign_type} Protocol</p>
        </div>
        <div className={cn('text-[8px] font-black italic uppercase px-3 py-1 rounded-[1px]',
          campaign.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-400'
        )}>{campaign.status}</div>
      </div>

      <div className="industrial-card p-1 overflow-hidden bg-neutral-100/50">
        <div className="flex overflow-x-auto border-b border-neutral-200 bg-white">
          {(['workflow', 'stats', 'leads'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('px-8 py-4 text-[10px] technical-label uppercase font-black italic border-b-2 transition-all',
                activeTab === tab ? 'border-utopia text-utopia bg-utopia/5' : 'border-transparent text-neutral-400 hover:text-black'
              )}
            >{tab === 'workflow' ? 'Logic Flow' : tab === 'stats' ? 'Live Metrics' : 'Audience Pool'}</button>
          ))}
        </div>

        <div className="p-8 bg-white min-h-[400px]">
          {activeTab === 'workflow' && (
            <div className="flex flex-col items-center justify-center gap-12 py-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-100 -translate-y-1/2" />
              <div className="flex items-center gap-20 relative z-10">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:scale-110"><Zap size={32} /></div>
                  <div className="text-center">
                    <span className="text-[9px] font-black italic text-neutral-400 uppercase">Trigger</span>
                    <p className="text-[10px] font-bold uppercase italic mt-1">{campaign.trigger_event ? campaign.trigger_event.replace('.', ' ') : 'Manual Start'}</p>
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
                    <p className="text-xs font-bold uppercase italic mt-1">{campaign.channels[0]} Deployment</p>
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
                <span className="text-[10px] font-bold technical-label">{(targets as unknown as Lead[])?.length ?? 0} Matched Profiles</span>
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-black text-white flex items-center justify-between uppercase italic">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black tracking-widest">Selected Unit: {campaign.name}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-utopia animate-pulse" />
            <span className="text-[9px] technical-label tracking-widest text-neutral-400">System Ready for Protocol Execution</span>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => campaign.status === 'active' ? pause.mutateAsync(campaign.id) : activate.mutateAsync(campaign.id)}
              className="text-[8px] font-black italic uppercase text-neutral-300 hover:text-white transition-colors"
            >{campaign.status === 'active' ? 'Pause' : 'Activate'}</button>
            <Button
              variant="primary" size="sm" icon={Send}
              onClick={() => { if (confirm('Deploy campaign to all target leads now?')) execute.mutateAsync({ id: campaign.id }); }}
              className="bg-utopia text-[8px] font-black italic h-7"
            >Manual Force Deployment</Button>
            <Sparkles size={14} className="text-utopia" />
          </div>
        </div>
      </div>
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
      <div className={cn('inline-flex p-2 rounded-lg mb-4 h-10 w-10 items-center justify-center transition-transform group-hover:scale-110',
        color === 'utopia' ? 'bg-utopia text-white shadow-lg shadow-utopia/20' : 'bg-black text-white shadow-lg'
      )}>
        <Icon size={18} />
      </div>
      <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black italic uppercase tracking-tighter text-black">{value ?? '--'}</p>
    </div>
  );
}
