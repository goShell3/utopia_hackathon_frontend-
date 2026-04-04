'use client';

import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  MessageCircle, 
  Users, 
  ArrowUpRight, 
  ChevronRight,
  BrainCircuit,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { LeadsTrendChart } from '@/components/dashboard/LeadsTrendChart';

const suggestions = [
  { 
    id: 1, 
    title: 'High-Value Churn Risk', 
    desc: '42 VIP guests (LTV > $2,500) have not engaged in 90 days.', 
    action: 'Activate Churn Flow',
    impact: 'High',
    urgency: true 
  },
  { 
    id: 2, 
    title: 'Peak Response Window', 
    desc: 'SMS response rates are 40% higher on Tuesdays between 2PM-4PM.', 
    action: 'Reschedule Campaigns',
    impact: 'Medium',
    urgency: false 
  },
  { 
    id: 3, 
    title: 'New Segment: Local Foodies', 
    desc: '128 leads identified with high interest in F&B dining packages.', 
    action: 'Create Segment',
    impact: 'Low',
    urgency: false 
  },
];

const scoringData = [
  { date: 'Mon', value: 82 },
  { date: 'Tue', value: 85 },
  { date: 'Wed', value: 78 },
  { date: 'Thu', value: 91 },
  { date: 'Fri', value: 88 },
  { date: 'Sat', value: 94 },
];

export default function AIInsightsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">AI Neural Engine</h1>
          <p className="technical-label text-neutral-500 mt-1">Predictive behavioral analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-neutral-800">
           <BrainCircuit size={16} className="text-utopia" />
           <span className="text-[10px] technical-label uppercase tracking-widest">Core Status: Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-sm font-black italic uppercase tracking-tight flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" />
              Strategic Interventions
           </h3>
           
           <div className="space-y-4">
              {suggestions.map((item) => (
                <div key={item.id} className={cn(
                  "industrial-card p-6 flex flex-col justify-between transition-all hover:scale-[1.01] relative overflow-hidden",
                  item.urgency ? "border-l-4 border-l-utopia" : "border-l-4 border-l-black"
                )}>
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black italic tracking-tight uppercase">{item.title}</h4>
                        <span className={cn(
                          "text-[8px] technical-label uppercase font-bold mt-1",
                          item.impact === 'High' ? "text-utopia" : "text-neutral-400"
                        )}>IMPACT: {item.impact}</span>
                      </div>
                      {item.urgency && (
                        <div className="flex items-center gap-1 text-utopia">
                           <AlertCircle size={14} />
                           <span className="text-[9px] font-black italic uppercase">Urgent</span>
                        </div>
                      )}
                   </div>
                   <p className="text-xs font-bold italic text-neutral-600 leading-relaxed max-w-md">
                      "{item.desc}"
                   </p>
                   <div className="flex justify-end mt-6">
                      <Button variant={item.urgency ? "primary" : "outline"} size="sm" icon={ChevronRight} className="technical-label text-[10px]">
                         {item.action}
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Mini Stats & Insights */}
        <div className="space-y-8">
           {/* Accuracy Metric */}
           <div className="industrial-card p-8 flex flex-col items-center justify-center text-center bg-black text-white">
              <div className="relative mb-6">
                 <svg className="w-24 h-24 rotate-[-90deg]">
                    <circle cx="48" cy="48" r="40" className="stroke-neutral-800 fill-none" strokeWidth="8" />
                    <circle cx="48" cy="48" r="40" className="stroke-utopia fill-none" strokeWidth="8" strokeDasharray="251" strokeDashoffset="25" />
                 </svg>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-2xl font-black italic">90%</span>
                 </div>
              </div>
              <h4 className="text-xs font-black italic tracking-tight uppercase mb-1">Model Precision</h4>
              <p className="text-[9px] technical-label text-neutral-500">Confidence score for current predictions</p>
           </div>

           {/* Performance Trends */}
           <div className="industrial-card p-6">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-xs font-black italic tracking-tight uppercase">Scoring Velocity</h4>
                 <ArrowUpRight size={14} className="text-emerald-500" />
              </div>
              <div className="h-40">
                 <LeadsTrendChart data={scoringData} height={160} width={280} />
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] technical-label text-neutral-400">AVG SCORE</span>
                    <span className="text-sm font-black italic uppercase">86.2%</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] technical-label text-neutral-400">DELTA</span>
                    <span className="text-sm font-black italic uppercase text-emerald-500">+4.2%</span>
                 </div>
              </div>
           </div>

           {/* Trigger Efficiency */}
           <div className="industrial-card p-6 flex flex-col gap-4">
              <h4 className="text-xs font-black italic tracking-tight uppercase">Top Automation Triggers</h4>
              <div className="space-y-3 italic">
                 <TriggerItem label="PMS: Checkout" score={98} />
                 <TriggerItem label="LTV Segment Update" score={85} />
                 <TriggerItem label="Bulk SMS Response" score={72} />
                 <TriggerItem label="Manual Lead Import" score={64} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TriggerItem({ label, score }: { label: string, score: number }) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] technical-label text-black uppercase">{label}</span>
          <span className="text-[10px] font-black italic text-utopia">{score}%</span>
       </div>
       <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-black transition-all" style={{ width: `${score}%` }} />
       </div>
    </div>
  );
}
