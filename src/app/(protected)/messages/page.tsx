'use client';

import React, { useState, useMemo } from 'react';
import {
  Send, Search, Sparkles, Filter, Target, Loader2, Workflow, Globe, Box, Bug, Users, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useCampaigns, useCampaignTargetLeads, useExecuteCampaign } from '@/hooks/useCampaigns';
import { useGenerateMessage } from '@/hooks/useAI';

type CampaignGoal = 'booking' | 'upsell' | 'loyalty' | 're_engagement' | 'feedback';
type MessageTone = 'professional' | 'friendly' | 'casual' | 'urgent';

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  source: string;
  segment?: string;
  language?: string;
  total_bookings?: number;
  total_revenue?: number;
  last_booking_date?: string;
};

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  campaign_type: string;
};

type MessageGenerationRequest = {
  lead_id: string;
  campaign_goal: CampaignGoal;
  tone: MessageTone;
  channel: string;
  language?: string;
  max_length?: number;
  personalization_data?: Record<string, unknown>;
};

export default function MessagesPage() {
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [selectedLeadForTemplate, setSelectedLeadForTemplate] = useState<Lead | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

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

  // Analyze lead characteristics for intelligent template generation
  const leadAnalysis = useMemo(() => {
    if (!targetLeads || (targetLeads as Lead[]).length === 0) return null;

    const leads = targetLeads as Lead[];
    const selectedLead = selectedLeadForTemplate || leads[0];

    // Determine loyalty type based on booking history
    const getLoyaltyType = (lead: Lead): 'vip' | 'loyal' | 'new' | 'dormant' => {
      const bookings = lead.total_bookings || 0;
      const lastBooking = lead.last_booking_date;
      const date = Date.now();
      const daysSinceLastBooking = lastBooking 
        ? Math.floor((date - new Date(lastBooking).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (bookings >= 5) return 'vip';
      if (bookings >= 2 && daysSinceLastBooking < 90) return 'loyal';
      if (bookings === 1 && daysSinceLastBooking > 180) return 'dormant';
      return 'new';
    };

    // Determine campaign goal based on loyalty type
    const getCampaignGoal = (loyaltyType: string): CampaignGoal => {
      switch (loyaltyType) {
        case 'vip': return 'loyalty';
        case 'loyal': return 'upsell';
        case 'dormant': return 're_engagement';
        case 'new': return 'booking';
        default: return 'booking';
      }
    };

    // Determine tone based on source and loyalty
    const getTone = (source: string, loyaltyType: string): MessageTone => {
      if (loyaltyType === 'vip') return 'professional';
      if (source === 'pms') return 'friendly';
      if (source === 'meta_ads') return 'casual';
      return 'professional';
    };

    const loyaltyType = getLoyaltyType(selectedLead);
    const campaignGoal = getCampaignGoal(loyaltyType);
    const tone = getTone(selectedLead.source, loyaltyType);

    // Aggregate stats for debugging
    const sourceDistribution = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const loyaltyDistribution = leads.reduce((acc, lead) => {
      const type = getLoyaltyType(lead);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      selectedLead,
      loyaltyType,
      campaignGoal,
      tone,
      sourceDistribution,
      loyaltyDistribution,
      totalLeads: leads.length,
      avgBookings: (leads.reduce((sum, l) => sum + (l.total_bookings || 0), 0) / leads.length).toFixed(1),
      avgRevenue: (leads.reduce((sum, l) => sum + (l.total_revenue || 0), 0) / leads.length).toFixed(0)
    };
  }, [targetLeads, selectedLeadForTemplate]);

  const handleGenerateTemplate = async () => {
    if (!activeCampaignId || !activeCampaign || !leadAnalysis) return;

    const { selectedLead, campaignGoal, tone } = leadAnalysis;

    const request: MessageGenerationRequest = {
      lead_id: selectedLead.id,
      campaign_goal: campaignGoal,
      tone: tone,
      channel: 'sms',
      language: selectedLead.language || 'en',
      max_length: 160,
      personalization_data: {
        first_name: selectedLead.first_name,
        last_name: selectedLead.last_name,
        total_bookings: selectedLead.total_bookings,
        source: selectedLead.source,
        loyalty_type: leadAnalysis.loyaltyType
      } as any // Type assertion needed due to OpenAPI schema limitation
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
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={Bug} 
                  className="bg-white" 
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                >
                  Debug
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={Sparkles} 
                  className="bg-white" 
                  onClick={handleGenerateTemplate} 
                  disabled={generateAI.isPending || !leadAnalysis}
                >
                  {generateAI.isPending ? 'Processing...' : 'AI Template'}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30 flex items-start justify-center gap-6">
              {/* Debug Panel */}
              {showDebugPanel && leadAnalysis && (
                <div className="w-80 industrial-card p-6 bg-white animate-in slide-in-from-left-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Bug size={20} className="text-utopia" />
                    <h3 className="display-header text-lg italic uppercase">Debug Panel</h3>
                  </div>

                  {/* Selected Lead Info */}
                  <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <h4 className="text-[9px] font-black italic uppercase text-neutral-400 mb-3">Selected Lead</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Name:</span>
                        <span className="font-bold">{leadAnalysis.selectedLead.first_name} {leadAnalysis.selectedLead.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Source:</span>
                        <span className="font-bold uppercase text-utopia">{leadAnalysis.selectedLead.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Bookings:</span>
                        <span className="font-bold">{leadAnalysis.selectedLead.total_bookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Revenue:</span>
                        <span className="font-bold">{leadAnalysis.selectedLead.total_revenue || 0} birr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Segment:</span>
                        <span className={cn(
                          "font-bold uppercase text-[10px] px-2 py-0.5 rounded",
                          leadAnalysis.selectedLead.segment === 'hot' ? 'bg-red-100 text-red-700' :
                          leadAnalysis.selectedLead.segment === 'warm' ? 'bg-orange-100 text-orange-700' :
                          leadAnalysis.selectedLead.segment === 'cold' ? 'bg-blue-100 text-blue-700' :
                          'bg-neutral-100 text-neutral-700'
                        )}>{leadAnalysis.selectedLead.segment || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Strategy */}
                  <div className="mb-6 p-4 bg-utopia/5 border border-utopia/20 rounded-lg">
                    <h4 className="text-[9px] font-black italic uppercase text-utopia mb-3">AI Strategy</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Loyalty Type:</span>
                        <span className="font-bold uppercase">{leadAnalysis.loyaltyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Campaign Goal:</span>
                        <span className="font-bold uppercase text-utopia">{leadAnalysis.campaignGoal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Tone:</span>
                        <span className="font-bold uppercase">{leadAnalysis.tone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audience Stats */}
                  <div className="mb-6">
                    <h4 className="text-[9px] font-black italic uppercase text-neutral-400 mb-3">Audience Stats</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-neutral-500">Total Leads</span>
                          <span className="font-bold">{leadAnalysis.totalLeads}</span>
                        </div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-neutral-500">Avg Bookings</span>
                          <span className="font-bold">{leadAnalysis.avgBookings}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-neutral-500">Avg Revenue</span>
                          <span className="font-bold">{leadAnalysis.avgRevenue} birr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source Distribution */}
                  <div className="mb-6">
                    <h4 className="text-[9px] font-black italic uppercase text-neutral-400 mb-3">Source Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(leadAnalysis.sourceDistribution).map(([source, count]) => (
                        <div key={source} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="uppercase font-bold">{source}</span>
                              <span className="text-neutral-500">{count}</span>
                            </div>
                            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-utopia rounded-full transition-all"
                                style={{ width: `${(count / leadAnalysis.totalLeads) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Loyalty Distribution */}
                  <div>
                    <h4 className="text-[9px] font-black italic uppercase text-neutral-400 mb-3">Loyalty Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(leadAnalysis.loyaltyDistribution).map(([type, count]) => (
                        <div key={type} className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="uppercase font-bold">{type}</span>
                              <span className="text-neutral-500">{count}</span>
                            </div>
                            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  type === 'vip' ? 'bg-purple-500' :
                                  type === 'loyal' ? 'bg-green-500' :
                                  type === 'new' ? 'bg-blue-500' :
                                  'bg-orange-500'
                                )}
                                style={{ width: `${(count / leadAnalysis.totalLeads) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                 (targetLeads as Lead[])?.map((l: Lead) => {
                   const bookings = l.total_bookings || 0;
                   const loyaltyType = bookings >= 5 ? 'vip' : bookings >= 2 ? 'loyal' : bookings === 1 ? 'new' : 'dormant';
                   const isSelected = selectedLeadForTemplate?.id === l.id;
                   
                   return (
                    <div 
                      key={l.id} 
                      onClick={() => setSelectedLeadForTemplate(l)}
                      className={cn(
                        "p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-all hover:shadow-md",
                        isSelected ? "bg-utopia/10 border-utopia" : "bg-neutral-50 border-neutral-100"
                      )}
                    >
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-black italic uppercase">{l.first_name} {l.last_name}</p>
                            <span className={cn(
                              "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                              loyaltyType === 'vip' ? 'bg-purple-100 text-purple-700' :
                              loyaltyType === 'loyal' ? 'bg-green-100 text-green-700' :
                              loyaltyType === 'new' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            )}>{loyaltyType}</span>
                          </div>
                          <p className="text-[9px] technical-label text-neutral-400">{l.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] text-neutral-500">{l.source}</span>
                            <span className="text-[8px] text-neutral-500">• {bookings} bookings</span>
                          </div>
                       </div>
                       <div className={cn(
                         "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                         isSelected ? "bg-utopia" : "bg-emerald-500"
                       )}></div>
                    </div>
                   );
                 })
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
