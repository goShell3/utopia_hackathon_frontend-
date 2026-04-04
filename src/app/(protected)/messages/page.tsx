'use client';

import React, { useState } from 'react';
import {
  Send, Search, Sparkles, Filter, Target, Loader2, Workflow, Globe, Box
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useCampaigns, useCampaignTargetLeads, useExecuteCampaign } from '@/hooks/useCampaigns';
import { useGenerateMessage } from '@/hooks/useAI';
import type { Campaign, Lead, MessageGenerationRequest } from '@/types';

export default function MessagesPage() {
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  // Queries
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: targetLeads, isLoading: leadsLoading } = useCampaignTargetLeads(activeCampaignId ?? '');

  // Mutations
  const executeCampaign = useExecuteCampaign();
  const generateAI = useGenerateMessage();

  const activeCampaign = campaigns?.items.find((c: Campaign) => c.id === activeCampaignId);

  const handleSendBroadcast = async () => {
    if (!message || !activeCampaignId) return;

    await executeCampaign.mutateAsync({
      id: activeCampaignId,
      // In a real app we'd pass lead IDs or just let the backend resolve them from the campaign target
      leadIds: (targetLeads as Lead[])?.map((l: Lead) => l.id)
    });
    
    setMessage('');
    setAiSuggestions(null);
  };

  const handleGenerateTemplate = async () => {
    if (!activeCampaignId || !activeCampaign) return;

    const request: MessageGenerationRequest = {
      lead_id: (targetLeads as Lead[])?.[0]?.id || 'campaign_bulk',
      campaign_goal: 're_engagement',
      tone: 'professional',
      channel: 'sms',
      language: 'en',
      max_length: 160
    };

    const suggestion = await generateAI.mutateAsync(request);
    if (suggestion.variants?.[0]) {
      setAiSuggestions(suggestion.variants[0].text);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestions) {
      setMessage(aiSuggestions);
      setAiSuggestions(null);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar / Campaign List */}
      <div className="w-80 flex flex-col industrial-card p-0 h-full overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="display-header text-xl italic uppercase tracking-tighter mb-4">Campaign Broadcasts</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full bg-neutral-100 border border-neutral-200 py-2 pl-9 pr-3 text-[10px] technical-label focus:outline-none focus:ring-1 focus:ring-utopia/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 italic">
          {campaignsLoading ? (
            <div className="flex items-center justify-center h-20"><Loader2 className="w-5 h-5 animate-spin text-neutral-300" /></div>
          ) : campaigns?.items?.length === 0 ? (
            <div className="p-8 text-center text-[10px] technical-label text-neutral-400 uppercase">No active campaigns found.</div>
          ) : (
            campaigns?.items.map((campaign: Campaign) => (
              <div
                key={campaign.id}
                onClick={() => setActiveCampaignId(campaign.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-neutral-50",
                  activeCampaignId === campaign.id ? "bg-black text-white" : "text-black"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black italic tracking-tight">{campaign.name}</span>
                  <span className={cn("text-[8px] technical-label", activeCampaignId === campaign.id ? "text-neutral-500" : "text-neutral-400")}>
                    {campaign.status}
                  </span>
                </div>
                <p className={cn("text-[10px] truncate max-w-[180px]", activeCampaignId === campaign.id ? "text-neutral-400" : "text-neutral-500")}>
                  {campaign.description || "No description"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", campaign.status === 'active' ? "bg-utopia" : "bg-neutral-500")} />
                    <span className="text-[8px] technical-label uppercase">{campaign.campaign_type}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Broadcast Editor View */}
      <div className="flex-1 flex flex-col industrial-card p-0 overflow-hidden relative">
        {!activeCampaignId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <Workflow className="w-12 h-12 text-neutral-200 mb-4" />
            <h3 className="display-header text-xl italic uppercase text-neutral-400">Broadcast Protocol Pending</h3>
            <p className="technical-label text-neutral-300 mt-2 max-w-xs">Select a campaign to formulate and dispatch a bulk operational signal.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-[1px] font-black italic shadow-md uppercase">
                  {activeCampaign?.name?.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-black italic uppercase tracking-tight">{activeCampaign?.name}</h3>
                  <span className="text-[9px] technical-label text-utopia uppercase flex items-center gap-1">
                     Signal Target Acquired · {(targetLeads as Lead[])?.length || 0} Contacts
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" icon={Sparkles} className="bg-white" onClick={handleGenerateTemplate} disabled={generateAI.isPending}>
                {generateAI.isPending ? 'Processing...' : 'AI Template'}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30 flex items-center justify-center">
              {/* Preview Area */}
              <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                   <h4 className="technical-label text-[10px] text-neutral-400 uppercase tracking-widest">Live Broadcast Preview</h4>
                </div>
                
                <div className="p-6 bg-white text-black border border-neutral-200 rounded-xl shadow-xl shadow-black/5 mx-auto relative group">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-neutral-200 rounded-full" />
                  <p className="text-sm font-bold leading-relaxed italic mt-4 text-neutral-700 min-h-[60px]">
                    {message || "Enter your broadcast message below or generate an AI template to see the preview..."}
                  </p>
                  
                  {aiSuggestions && (
                    <div
                      onClick={applySuggestion}
                      className="mt-6 p-4 bg-black text-white rounded-lg cursor-pointer hover:bg-neutral-900 transition-all border-l-2 border-utopia animate-in slide-in-from-bottom-4 group relative overflow-hidden"
                    >
                      <Sparkles size={60} className="absolute -right-4 -bottom-4 opacity-5 text-utopia" />
                      <div className="flex items-center gap-1 mb-2">
                        <Sparkles size={12} className="text-utopia" />
                        <span className="text-[9px] font-black italic uppercase tracking-widest text-utopia">Suggested AI Template</span>
                      </div>
                      <p className="text-xs font-bold italic group-hover:text-neutral-300 transition-colors">&quot;{aiSuggestions}&quot;</p>
                      <p className="text-[8px] technical-label text-neutral-500 mt-2">Click to apply to broadcast</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-neutral-200">
              <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-utopia/10 transition-all flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Protocol: Enter bulk broadcast message..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-bold italic resize-none py-2 px-2 min-h-[40px] max-h-32"
                />
                <button
                  onClick={handleSendBroadcast}
                  disabled={executeCampaign.isPending || !message}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-900 transition-all shadow-lg shadow-black/20 disabled:opacity-50 flex items-center gap-2 font-black italic uppercase text-[10px]"
                >
                  {executeCampaign.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Deploy to {(targetLeads as Lead[])?.length || 0}</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Target Audience Sidebar */}
      <div className="w-80 flex flex-col space-y-6">
        <div className="industrial-card p-6 bg-black text-white border-none shadow-xl shadow-black/20 relative overflow-hidden group min-h-[160px]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Globe size={24} className="text-utopia" />
              <h3 className="display-header text-xl italic uppercase font-black">Target Audience</h3>
            </div>

            {!activeCampaignId ? (
              <p className="text-[10px] technical-label text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">Select a campaign to intercept signal targets</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] technical-label text-neutral-400 uppercase block mb-1">Total Audience Reach</span>
                  <span className="text-3xl font-black italic text-utopia">
                     {leadsLoading ? <Loader2 size={18} className="animate-spin inline text-utopia" /> : (targetLeads as Lead[])?.length || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="industrial-card p-0 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
             <h3 className="text-sm font-black italic uppercase tracking-tight">Active Contacts</h3>
             <Filter size={14} className="text-neutral-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {!activeCampaignId ? (
                <div className="flex flex-col items-center justify-center text-center h-full opacity-50">
                   <Box size={24} className="text-neutral-300 mb-2" />
                   <p className="text-[10px] technical-label uppercase">No contacts resolved</p>
                </div>
             ) : leadsLoading ? (
                 <div className="flex flex-col items-center justify-center text-center h-full">
                   <Loader2 size={24} className="text-neutral-300 mb-2 animate-spin" />
                </div>
             ) : (targetLeads as Lead[])?.length === 0 ? (
                 <div className="text-[10px] technical-label text-neutral-400 uppercase text-center mt-10">Target audience is empty.</div>
             ) : (
                 (targetLeads as Lead[])?.map((l: Lead) => (
                    <div key={l.id} className="p-3 bg-neutral-50 border border-neutral-100 rounded-lg flex justify-between items-center">
                       <div>
                          <p className="text-xs font-black italic uppercase">{l.first_name} {l.last_name}</p>
                          <p className="text-[9px] technical-label text-neutral-400 mt-0.5">{l.phone}</p>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                 ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
