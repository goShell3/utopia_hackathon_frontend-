'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, RefreshCcw, ArrowRight, CheckCircle2, AlertTriangle,
  XCircle, Loader2, Sparkles, Copy, RotateCcw, Users, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useMe } from '@/hooks/useAuth';
import { useAIHealth, useAIUsageStats, useAIRecommendations, useGenerateMessage } from '@/hooks/useAI';
import type { MessageGenerationRequest } from '@/types';

// --- AI Status Card ---
function AIStatusCard() {
  const { data, isLoading, refetch, isFetching } = useAIHealth();
  const health = data as Record<string, unknown> | undefined;
  const status = health?.status as string | undefined;

  const isHealthy = status === 'healthy';
  const isDegraded = status === 'degraded';

  return (
    <div className="industrial-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="technical-label text-neutral-400">AI Service Status</span>
        <button onClick={() => refetch()} className="text-neutral-400 hover:text-black transition-colors">
          <RefreshCcw size={12} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2"><Loader2 size={16} className="animate-spin text-neutral-400" /><span className="text-xs font-bold italic">Checking...</span></div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {isHealthy ? <CheckCircle2 size={20} className="text-emerald-500" /> :
             isDegraded ? <AlertTriangle size={20} className="text-amber-500" /> :
             <XCircle size={20} className="text-rose-500" />}
            <span className="text-sm font-black italic uppercase">
              {isHealthy ? 'Operational' : isDegraded ? 'Degraded' : status ?? 'Unavailable'}
            </span>
          </div>
          <p className="text-[10px] technical-label text-neutral-400">
            {isHealthy ? 'All AI services are running normally.' :
             isDegraded ? 'Generation latency elevated. Some features may be slow.' :
             'AI services are temporarily unavailable.'}
          </p>
        </>
      )}
    </div>
  );
}

// --- Usage Card ---
function AIUsageCard() {
  const { data, isLoading } = useAIUsageStats();

  return (
    <div className="industrial-card p-6 flex flex-col gap-4">
      <span className="technical-label text-neutral-400">Usage Summary</span>
      {isLoading ? (
        <div className="flex items-center gap-2"><Loader2 size={16} className="animate-spin text-neutral-400" /><span className="text-xs font-bold italic">Loading...</span></div>
      ) : data ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xl font-black italic">{data.total_requests}</span>
            <p className="text-[9px] technical-label text-neutral-400 mt-0.5">Total Requests</p>
          </div>
          <div>
            <span className="text-xl font-black italic text-emerald-500">
              {data.total_requests > 0 ? Math.round((data.successful_requests / data.total_requests) * 100) : 0}%
            </span>
            <p className="text-[9px] technical-label text-neutral-400 mt-0.5">Success Rate</p>
          </div>
          <div>
            <span className="text-xl font-black italic">{data.avg_response_time.toFixed(2)}s</span>
            <p className="text-[9px] technical-label text-neutral-400 mt-0.5">Avg Response</p>
          </div>
          <div>
            <span className="text-xl font-black italic">${data.estimated_cost.toFixed(4)}</span>
            <p className="text-[9px] technical-label text-neutral-400 mt-0.5">Est. Cost</p>
          </div>
        </div>
      ) : (
        <p className="text-[10px] technical-label text-neutral-400">No AI requests recorded yet.</p>
      )}
    </div>
  );
}

// --- Recommendations ---
function RecommendationsSection({ hotelId }: { hotelId: string }) {
  const router = useRouter();
  const { data, isLoading } = useAIRecommendations({
    hotel_id: hotelId,
    timeframe_days: 30,
    preferred_channels: ['sms'],
  });

  const recs = data?.recommendations ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black italic uppercase tracking-tight flex items-center gap-2">
        <Sparkles size={14} className="text-amber-500" /> Recommended Actions
      </h3>

      {isLoading ? (
        <div className="flex items-center gap-3 p-6 industrial-card">
          <Loader2 size={16} className="animate-spin text-neutral-400" />
          <span className="text-xs font-bold italic text-neutral-400">Generating recommendations...</span>
        </div>
      ) : recs.length === 0 ? (
        <div className="industrial-card p-6">
          <p className="text-[10px] technical-label text-neutral-400">Nothing urgent right now. AI will surface opportunities as new lead and campaign data arrives.</p>
        </div>
      ) : (
        recs.map((rec, i) => (
          <div key={i} className={cn(
            "industrial-card p-6 flex flex-col gap-4 hover:scale-[1.01] transition-all",
            rec.expected_roi > 2 ? "border-l-4 border-l-utopia" : "border-l-4 border-l-black"
          )}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-black italic uppercase tracking-tight">{rec.campaign_type}</h4>
                <span className="text-[9px] technical-label text-neutral-400 mt-0.5 block">
                  Target: {rec.target_segment} · Confidence: {Math.round(rec.confidence * 100)}%
                </span>
              </div>
              <div className={cn("text-[9px] font-black italic uppercase px-2 py-0.5 rounded-[1px]",
                rec.expected_roi > 2 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-neutral-100 text-neutral-500"
              )}>
                ROI ×{rec.expected_roi.toFixed(1)}
              </div>
            </div>

            <p className="text-xs font-bold italic text-neutral-600 leading-relaxed">&quot;{rec.reasoning}&quot;</p>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-4 text-[9px] technical-label text-neutral-400">
                <span>Est. cost: ${rec.estimated_cost}</span>
                <span>Est. revenue: ${rec.estimated_revenue}</span>
                <span>Send: {rec.optimal_send_time}</span>
              </div>
              <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => router.push('/campaigns')}>
                Create Campaign
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// --- Generate Message Panel ---
function GenerateMessagePanel() {
  const { mutateAsync: generate, isPending } = useGenerateMessage();
  const [form, setForm] = useState({ goal: '', channel: 'sms', tone: 'friendly', language: 'en' });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    if (!form.goal) return;
    const req: MessageGenerationRequest = {
      lead_id: '',
      campaign_goal: form.goal as 'booking' | 'upsell' | 're_engagement' | 'feedback' | 'loyalty' | 'promotion',
      channel: form.channel as 'sms' | 'email',
      tone: form.tone as 'friendly' | 'professional' | 'urgent',
      language: form.language,
      max_length: form.channel === 'sms' ? 160 : null,
    };
    const res = await generate(req);
    if (res.variants?.[0]) setOutput(res.variants[0].text);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="industrial-card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-amber-500" />
        <h3 className="text-sm font-black italic uppercase tracking-tight">Generate Message</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="technical-label text-neutral-400 mb-1 block">Campaign Goal</label>
          <input
            type="text"
            value={form.goal}
            onChange={e => set('goal', e.target.value)}
            placeholder="e.g. re-engage dormant guests"
            className="w-full bg-neutral-50 border border-neutral-200 py-2 px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="technical-label text-neutral-400 mb-1 block">Channel</label>
            <select value={form.channel} onChange={e => set('channel', e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 py-2 px-2 text-xs font-bold focus:outline-none uppercase">
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="technical-label text-neutral-400 mb-1 block">Tone</label>
            <select value={form.tone} onChange={e => set('tone', e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 py-2 px-2 text-xs font-bold focus:outline-none uppercase">
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="technical-label text-neutral-400 mb-1 block">Language</label>
            <select value={form.language} onChange={e => set('language', e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 py-2 px-2 text-xs font-bold focus:outline-none uppercase">
              <option value="en">EN</option>
              <option value="am">AM</option>
            </select>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={isPending ? Loader2 : Sparkles} className="w-full" onClick={handleGenerate} disabled={isPending || !form.goal}>
          {isPending ? 'Generating...' : 'Generate Draft'}
        </Button>
      </div>

      {output && (
        <div className="mt-2 p-4 bg-neutral-50 border border-neutral-200 space-y-3">
          <p className="text-xs font-bold italic leading-relaxed">&quot;{output}&quot;</p>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-[9px] technical-label text-neutral-500 hover:text-black transition-colors">
              <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleGenerate} className="flex items-center gap-1.5 text-[9px] technical-label text-neutral-500 hover:text-black transition-colors">
              <RotateCcw size={10} /> Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Quick Actions ---
function QuickActions() {
  const router = useRouter();
  return (
    <div className="industrial-card p-6 flex flex-col gap-4">
      <h3 className="text-sm font-black italic uppercase tracking-tight">Quick Actions</h3>
      <div className="space-y-2">
        {[
          { label: 'Open Top Leads', icon: Users, href: '/leads' },
          { label: 'Create Campaign', icon: Zap, href: '/campaigns' },
          { label: 'Go to Messages', icon: MessageSquare, href: '/messages' },
        ].map(a => (
          <button key={a.href} onClick={() => router.push(a.href)}
            className="w-full flex items-center justify-between p-3 bg-neutral-50 border border-neutral-100 hover:border-black hover:bg-white transition-all group">
            <div className="flex items-center gap-3">
              <a.icon size={14} className="text-neutral-400 group-hover:text-black transition-colors" />
              <span className="text-xs font-black italic uppercase tracking-tight">{a.label}</span>
            </div>
            <ArrowRight size={12} className="text-neutral-300 group-hover:text-black transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Page ---
export default function AIHubPage() {
  const { data: user } = useMe();
  const hotelId = user?.hotel_id ?? '';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">AI Hub</h1>
          <p className="technical-label text-neutral-500 mt-1">Recommendations, status, and message generation</p>
        </div>
      </div>

      {/* Row 1: Status + Usage + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AIStatusCard />
        <AIUsageCard />
        <QuickActions />
      </div>

      {/* Row 2: Recommendations + Generate Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {hotelId ? (
            <RecommendationsSection hotelId={hotelId} />
          ) : (
            <div className="industrial-card p-6">
              <p className="text-[10px] technical-label text-neutral-400">Loading recommendations...</p>
            </div>
          )}
        </div>
        <div>
          <GenerateMessagePanel />
        </div>
      </div>
    </div>
  );
}
