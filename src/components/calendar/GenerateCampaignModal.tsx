'use client';

import React from 'react';
import { X, Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toSlug } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { EventType } from '@/data/events';

type Step = 'idle' | 'generating' | 'done';

interface GeneratedCampaign {
  name: string;
  type: string;
  audience: string;
  channel: string;
  rationale: string;
}

function mockGenerate(event: EventType): GeneratedCampaign {
  const strategy = event.hotelStrategy;
  const campaignType = strategy.campaignType[0];
  const audience = strategy.suggestedAudience[0];
  const impact = event.demandImpact.level;

  const typeLabels: Record<string, string> = {
    'package':    'Package Deal',
    'event-based':'Event Offer',
    'corporate':  'Corporate Rate',
    'discount':   'Flash Discount',
    'long-stay':  'Long Stay Promo',
  };

  const channelMap: Record<string, string> = {
    extreme: 'SMS + Email',
    high:    'SMS',
    medium:  'Email',
    low:     'Email',
  };

  return {
    name: `${event.name} – ${typeLabels[campaignType] ?? campaignType}`,
    type: campaignType,
    audience,
    channel: channelMap[impact] ?? 'SMS',
    rationale: `Based on ${impact} demand impact during ${event.name}, targeting ${audience} via ${channelMap[impact] ?? 'SMS'} with a ${campaignType} offer ${event.leadTimeDays} days in advance maximises booking conversion.`,
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  event: EventType;
}

export function GenerateCampaignModal({ open, onClose, event }: Props) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('idle');
  const [campaign, setCampaign] = React.useState<GeneratedCampaign | null>(null);

  function handleGenerate() {
    setStep('generating');
    setTimeout(() => {
      setCampaign(mockGenerate(event));
      setStep('done');
    }, 2800);
  }

  function handleProceed() {
    if (!campaign) return;
    router.push(`/campaigns/${toSlug(campaign.name)}`);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep('idle');
      setCampaign(null);
    }, 300);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="display-header text-lg italic">Generate Campaign</h2>
            <p className="technical-label text-[9px] text-neutral-400 mt-0.5 truncate max-w-[260px]">{event.name}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Idle */}
        {step === 'idle' && (
          <div className="p-8 flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black italic uppercase tracking-tight">AI-Powered Campaign Generation</p>
              <p className="text-xs text-neutral-400">Utopia AI will analyse this event's demand signals, traveler profile, and hotel strategy to generate an optimised campaign.</p>
            </div>
            <button
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-black italic uppercase tracking-tight text-sm hover:bg-neutral-800 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Campaign with AI
            </button>
          </div>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <div className="p-12 flex flex-col items-center gap-5">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-300" />
            <div className="text-center space-y-1">
              <p className="text-sm font-black italic uppercase tracking-tight">Analysing event signals...</p>
              <p className="technical-label text-[9px] text-neutral-400">Demand impact · Traveler profile · Lead time · Strategy</p>
            </div>
          </div>
        )}

        {/* Done */}
        {step === 'done' && campaign && (
          <div className="flex flex-col">
            <div className="px-6 py-3 border-b border-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
              <span className="technical-label text-[9px] text-neutral-400">Campaign generated</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <p className="text-base font-black italic uppercase tracking-tight">{campaign.name}</p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Type', value: campaign.type },
                    { label: 'Audience', value: campaign.audience },
                    { label: 'Channel', value: campaign.channel },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                      <p className="technical-label text-[8px] text-neutral-400 mb-1">{label.toUpperCase()}</p>
                      <p className="text-[10px] font-black italic uppercase tracking-tight truncate">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
                  <p className="technical-label text-[8px] text-neutral-400 mb-1">AI RATIONALE</p>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">{campaign.rationale}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleProceed}
                className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-black italic uppercase tracking-tight text-sm hover:bg-neutral-800 transition-colors"
              >
                Proceed to Campaign
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
