'use client';

import React, { useState } from 'react';
import { 
  Zap, Plus, Send, Calendar, BellRing, MoreVertical, 
  ChevronRight, Sparkles, MessageSquare, Brain, Target, ArrowRight,
  Loader2, TrendingUp, Users
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAIRecommendations } from '@/hooks/useAI';
import type { Campaign } from '@/types';

export default function CampaignsPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Queries
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: recommendations, isLoading: recsLoading } = useAIRecommendations({
    hotel_id: 'current',
    timeframe_days: 30,
    preferred_channels: ['sms']
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Campaign Engine</h1>
          <p className="technical-label text-neutral-500 mt-1">Automated lifecycle management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={Calendar} className="bg-white">Schedule</Button>
          <Button variant="primary" size="md" icon={Plus}>New Campaign</Button>
        </div>
      </div>

      {/* AI Strategy Advisor Section */}
      <div className="industrial-card p-6 bg-black text-white border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Brain size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-utopia animate-pulse" size={18} />
            <h2 className="text-xs font-black italic uppercase tracking-widest text-neutral-400">AI Strategy Advisor</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recsLoading ? (
              <div className="col-span-3 flex items-center justify-center py-8"><Loader2 className="animate-spin text-neutral-500" /></div>
            ) : (
              recommendations?.recommendations?.slice(0, 3).map((rec, i) => (
                <div key={i} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-utopia transition-colors cursor-pointer group/item">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-utopia/10 text-utopia text-[8px] font-black italic uppercase tracking-widest border border-utopia/20 rounded-[1px]">
                      {rec.campaign_type}
                    </span>
                    <span className="text-[9px] technical-label text-emerald-500 italic">ROI Pred: {rec.expected_roi ?? 'High'}%</span>
                  </div>
                  <h3 className="text-sm font-black italic uppercase tracking-tight mb-2 group-hover/item:text-utopia transition-colors">
                    {rec.campaign_type}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-bold italic leading-relaxed mb-4 line-clamp-2">
                    {rec.message_strategy}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-[9px] technical-label text-neutral-500">
                      <Target size={10} /> {rec.target_segment}
                    </div>
                    <ArrowRight size={12} className="text-neutral-700 group-hover/item:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Campaign List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="industrial-card p-6 h-48 animate-pulse bg-neutral-100/50" />
          ))
        ) : (
          campaigns?.items.map((campaign: Campaign) => (
            <div 
              key={campaign.id} 
              onClick={() => setSelectedCampaignId(campaign.id)}
              className={cn(
                "industrial-card p-6 flex flex-col justify-between group cursor-pointer transition-all hover:scale-[1.02]",
                selectedCampaignId === campaign.id ? "ring-2 ring-utopia border-transparent shadow-xl" : ""
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-full",
                  campaign.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                )}>
                  <Zap size={16} />
                </div>
                <button className="text-neutral-300 hover:text-black">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-black italic tracking-tight uppercase leading-tight">{campaign.name}</h3>
                <p className="technical-label text-[9px] text-neutral-400 mt-1">{campaign.campaign_type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black italic">--</span>
                  <span className="text-[8px] technical-label text-neutral-400 uppercase">SENT</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black italic text-utopia">--%</span>
                  <span className="text-[8px] technical-label text-neutral-400 uppercase">CONV</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={cn(
                  "text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]",
                  campaign.status === 'active' ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-500"
                )}>
                  {campaign.status}
                </div>
                <button className="flex items-center gap-1 text-[9px] font-bold technical-label text-neutral-400 hover:text-black transition-colors">
                  Protocol <ChevronRight size={10} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visual Workspace Section */}
      <div className="industrial-card p-8 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="display-header text-xl italic uppercase">Visual Workflow Workspace</h3>
            <p className="technical-label text-neutral-500 text-[10px]">Build automated event sequences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Send} className="bg-white">Test Flow</Button>
            <Button variant="primary" size="sm" icon={BellRing}>Publish Automation</Button>
          </div>
        </div>

        <div className="h-[400px] border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-white/50 backdrop-blur-sm">
          {!selectedCampaignId ? (
            <div className="text-center p-12">
               <Zap className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
               <p className="technical-label text-neutral-300 uppercase">Select campaign from engine list to visualize logic flow</p>
            </div>
          ) : (
            <>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-200 z-0" />
              <div className="flex items-center gap-16 relative z-10 scale-90">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-utopia text-white flex items-center justify-center rounded-2xl shadow-xl shadow-utopia/20"><Zap size={32} /></div>
                  <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Trigger</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">PMS: Guest Checkout</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-2xl rotate-45 shadow-lg">
                    <Users className="-rotate-45" size={24} />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Segment Filter</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">LTV Rank &gt; High</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white border-2 border-neutral-200 text-black flex items-center justify-center rounded-2xl shadow-md"><MessageSquare size={32} /></div>
                  <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Action</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">Send SMS Protocol</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 bg-emerald-500 text-white flex items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Result</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">Track Conversion</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="px-3 py-1 bg-white border border-neutral-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] technical-label text-black">Active Stream Protocol</span>
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="text-[9px] technical-label text-neutral-400 uppercase italic">Powered by Utopia Intelligence Subsystem</span>
            <Sparkles className="w-3 h-3 text-utopia" />
          </div>
        </div>
      </div>
    </div>
  );
}
