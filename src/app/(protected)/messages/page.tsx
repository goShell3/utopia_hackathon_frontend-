'use client';

import React, { useState } from 'react';
import {
  MessageSquare, Send, Search, MoreVertical, CheckCheck,
  Zap, Filter, Paperclip, Sparkles,
  TrendingUp, AlertTriangle, Target, Brain, Loader2
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useLeads, useLead } from '@/hooks/useLeads';
import { useAIScore, useAIEnrichment, useGenerateMessage } from '@/hooks/useAI';
import { useSendSMS } from '@/hooks/useSMS';
import type { Lead, MessageGenerationRequest } from '@/types';

export default function MessagesPage() {
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  // Queries
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: activeLead } = useLead(activeLeadId ?? '');
  const { data: aiScore } = useAIScore(activeLeadId ?? '', { include_explanation: true });
  const { data: aiEnrichment } = useAIEnrichment(activeLeadId ?? '', { include_predictions: true });

  // Mutations
  const sendSms = useSendSMS();
  const generateAI = useGenerateMessage();

  const handleSend = async () => {
    if (!message || !activeLeadId || !activeLead?.phone) return;

    await sendSms.mutateAsync({
      to: activeLead.phone,
      message: message
    });
    setMessage('');
  };

  const handleSuggest = async () => {
    if (!activeLeadId) return;

    const request: MessageGenerationRequest = {
      lead_id: activeLeadId,
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
      {/* Sidebar / Conversation List */}
      <div className="w-80 flex flex-col industrial-card p-0 h-full overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="display-header text-xl italic uppercase tracking-tighter mb-4">Inbox Stream</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-neutral-100 border border-neutral-200 py-2 pl-9 pr-3 text-[10px] technical-label focus:outline-none focus:ring-1 focus:ring-utopia/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 italic">
          {leadsLoading ? (
            <div className="flex items-center justify-center h-20"><Loader2 className="w-5 h-5 animate-spin text-neutral-300" /></div>
          ) : (
            leads?.items.map((lead: Lead) => (
              <div
                key={lead.id}
                onClick={() => setActiveLeadId(lead.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-neutral-50",
                  activeLeadId === lead.id ? "bg-black text-white" : "text-black"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black italic tracking-tight">{lead.first_name} {lead.last_name}</span>
                  <span className={cn("text-[8px] technical-label", activeLeadId === lead.id ? "text-neutral-500" : "text-neutral-400")}>Recent</span>
                </div>
                <p className={cn("text-[10px] truncate max-w-[180px]", activeLeadId === lead.id ? "text-neutral-400" : "text-neutral-500")}>
                  {lead.phone}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", lead.segment === 'hot' ? "bg-utopia" : "bg-emerald-500")} />
                    <span className="text-[8px] technical-label uppercase">{lead.segment ?? 'New Lead'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col industrial-card p-0 overflow-hidden relative">
        {!activeLeadId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <MessageSquare className="w-12 h-12 text-neutral-200 mb-4" />
            <h3 className="display-header text-xl italic uppercase text-neutral-400">Secure Protocol Pending</h3>
            <p className="technical-label text-neutral-300 mt-2 max-w-xs">Select a verified identity from the stream to establish an encrypted signal.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-[1px] font-black italic shadow-md uppercase">
                  {activeLead?.first_name?.[0]}{activeLead?.last_name?.[0]}
                </div>
                <div>
                  <h3 className="text-sm font-black italic uppercase tracking-tight">{activeLead?.first_name} {activeLead?.last_name}</h3>
                  <span className="text-[9px] technical-label text-emerald-500 uppercase flex items-center gap-1">
                    <CheckCheck size={10} /> Identity Verified · E.164 Secure
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={Zap} className="bg-white">Automation</Button>
                <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30 italic">
              {/* Simplified feed for demo */}
              <div className="flex flex-col items-start space-y-1">
                <div className="p-4 bg-white text-black border border-neutral-200 rounded-r-2xl rounded-tl-2xl shadow-sm">
                  <p className="text-xs font-bold leading-relaxed italic">Hello, I have a question about my booking.</p>
                </div>
                <span className="text-[8px] technical-label text-neutral-400 uppercase tracking-widest">Received</span>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-neutral-200">
              {aiSuggestions && (
                <div
                  onClick={applySuggestion}
                  className="mb-4 p-4 bg-black text-white rounded-xl cursor-pointer hover:bg-neutral-900 transition-all border-l-4 border-utopia animate-in slide-in-from-bottom-4 duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black italic uppercase tracking-widest">AI Strategy Suggestion</span>
                    </div>
                    <span className="text-[9px] technical-label text-neutral-500">Click to apply protocol</span>
                  </div>
                  <p className="text-xs font-bold italic group-hover:text-utopia transition-colors">&quot;{aiSuggestions}&quot;</p>
                </div>
              )}

              <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-utopia/10 transition-all flex items-end gap-2">
                <div className="flex items-center gap-1 mb-1">
                  <button className="p-1.5 text-neutral-400 hover:text-black hover:bg-white rounded-lg transition-colors"><Paperclip size={18} /></button>
                  <button
                    onClick={handleSuggest}
                    disabled={generateAI.isPending}
                    className="p-1.5 text-neutral-400 hover:text-amber-500 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={18} />
                  </button>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Protocol: Enter secure SMS content..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-bold italic resize-none py-2 min-h-[40px] max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={sendSms.isPending || !message}
                  className="bg-utopia text-white p-3 rounded-lg hover:bg-utopia/90 transition-all shadow-lg shadow-utopia/20 -translate-y-0.5 disabled:opacity-50"
                >
                  {sendSms.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Intelligence Profile Sidebar */}
      <div className="w-80 flex flex-col space-y-6">
        <div className="industrial-card p-6 bg-black text-white border-none shadow-xl shadow-black/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={24} className="text-utopia" />
              <h3 className="display-header text-xl italic uppercase font-black">Strategic Intelligence</h3>
            </div>

            {!activeLeadId ? (
              <p className="text-[10px] technical-label text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">Select identity to generate predictive enrichment</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] technical-label text-neutral-400 uppercase">Conversion Probability</span>
                    <span className="text-xl font-black italic text-utopia">{aiScore?.conversion_probability ?? '--'}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-utopia transition-all duration-1000"
                      style={{ width: `${aiScore?.conversion_probability ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target size={12} className="text-emerald-500" />
                      <span className="text-[8px] technical-label text-neutral-500 uppercase">Quality</span>
                    </div>
                    <span className="text-xs font-black italic uppercase">{aiScore?.quality_score ?? '--'} / 10</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={12} className="text-utopia" />
                      <span className="text-[8px] technical-label text-neutral-500 uppercase">LTV Pred.</span>
                    </div>
                    <span className="text-xs font-black italic uppercase">High</span>
                  </div>
                </div>

                {aiScore?.ai_reasoning && (
                  <div className="p-3 border-l-2 border-utopia bg-neutral-900/50">
                    <p className="text-[9px] font-bold italic text-neutral-400 leading-relaxed uppercase tracking-tighter">
                      {aiScore.ai_reasoning}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="industrial-card p-6 flex-1 flex flex-col">
          <h3 className="text-sm font-black italic uppercase tracking-tight mb-4">Guest Preferences</h3>
          {!activeLeadId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Filter className="w-8 h-8 text-neutral-100 mb-2" />
              <p className="text-[10px] technical-label text-neutral-300 uppercase">Awaiting Signal</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <span className="text-[9px] technical-label text-neutral-400 uppercase">Predicted Preferences</span>
                <div className="flex flex-wrap gap-2">
                  {(aiEnrichment?.predicted_preferences?.amenities ?? ['SPA', 'LATE CHECKOUT', 'FAMILY SUITE']).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-neutral-100 border border-neutral-200 text-[8px] font-black italic uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>

              {aiEnrichment?.engagement_tips?.[0] && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <AlertTriangle size={14} />
                    <span className="text-[10px] font-black italic uppercase tracking-widest">Engagement Tip</span>
                  </div>
                  <p className="text-[10px] font-bold italic text-orange-800 leading-tight">
                    {aiEnrichment.engagement_tips[0]}
                  </p>
                </div>
              )}
            </div>
          )}
          <Button variant="primary" size="md" className="w-full mt-auto" icon={Zap}>
            Trigger Retention
          </Button>
        </div>
      </div>
    </div>
  );
}
