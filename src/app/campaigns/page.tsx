'use client';

import React from 'react';
import { 
  Zap, 
  Plus, 
  Send, 
  Calendar, 
  BarChart3, 
  Clock, 
  BellRing,
  Settings,
  MoreVertical,
  ChevronRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

const campaignData = [
  { id: '1', name: 'Welcome SMS Automation', status: 'Active', sent: 12402, conv: 24.5, type: 'Event-Driven' },
  { id: '2', name: 'Churn Prevention Flow', status: 'Active', sent: 8900, conv: 12.8, type: 'Segment-Based' },
  { id: '3', name: 'Valentine\'s Special offer', status: 'Draft', sent: 0, conv: 0, type: 'Bulk Broadcast' },
  { id: '4', name: 'Loyalty Bonus Update', status: 'Active', sent: 3200, conv: 35.2, type: 'Triggered' },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Campaign Engine</h1>
          <p className="technical-label text-neutral-500 mt-1">Automated lifecycle management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={Calendar} className="bg-white">
            Schedule
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Campaign List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignData.map((campaign) => (
          <div key={campaign.id} className="industrial-card p-6 flex flex-col justify-between group">
            <div className="flex items-start justify-between mb-4">
               <div className={cn(
                 "p-2 rounded-full",
                 campaign.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"
               )}>
                 <Zap size={16} />
               </div>
               <button className="text-neutral-300 hover:text-black">
                 <MoreVertical size={16} />
               </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-black italic tracking-tight uppercase leading-tight">{campaign.name}</h3>
              <p className="technical-label text-[9px] text-neutral-400 mt-1">{campaign.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100 mb-4">
               <div className="flex flex-col">
                 <span className="text-xs font-black italic">{campaign.sent.toLocaleString()}</span>
                 <span className="text-[8px] technical-label text-neutral-400 uppercase">SENT</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-black italic text-utopia">{campaign.conv}%</span>
                 <span className="text-[8px] technical-label text-neutral-400 uppercase">CONV</span>
               </div>
            </div>

            <div className="flex items-center justify-between">
               <div className={cn(
                 "text-[8px] font-black italic uppercase px-2 py-0.5 rounded-[1px]",
                 campaign.status === 'Active' ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-500"
               )}>
                 {campaign.status}
               </div>
               <button className="flex items-center gap-1 text-[9px] font-bold technical-label text-neutral-400 hover:text-black transition-colors">
                  Edit <ChevronRight size={10} />
               </button>
            </div>
          </div>
        ))}
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

        {/* Builder Canvas Mockup */}
        <div className="h-[400px] border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-white/50 backdrop-blur-sm">
           
           {/* Flow Path */}
           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-200 z-0" />

           <div className="flex items-center gap-16 relative z-10">
              
              {/* Trigger Node */}
              <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-utopia text-white flex items-center justify-center rounded-2xl shadow-xl shadow-utopia/20">
                    <Zap size={32} />
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Trigger</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">PMS: Guest Checkout</p>
                 </div>
              </div>

              {/* Condition Node */}
              <div className="flex flex-col items-center gap-4">
                 <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-2xl rotate-45 shadow-lg">
                    <BarChart3 className="-rotate-45" size={24} />
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Condition</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">LTV Rank &gt; 80%</p>
                 </div>
              </div>

              {/* Action Node */}
              <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-white border-2 border-neutral-200 text-black flex items-center justify-center rounded-2xl shadow-md">
                    <MessageSquare size={32} />
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black italic uppercase">Action</span>
                    <p className="text-xs font-bold bg-white px-3 py-1 border border-neutral-200 mt-1 shadow-sm uppercase italic">Send "VIP Loyalty" SMS</p>
                 </div>
              </div>

              {/* Add Node */}
              <div className="flex flex-col items-center gap-4">
                 <button className="w-12 h-12 border-2 border-dashed border-neutral-300 text-neutral-400 flex items-center justify-center rounded-2xl hover:border-utopia hover:text-utopia transition-all group">
                    <Plus size={24} className="group-hover:scale-125 transition-transform" />
                 </button>
              </div>

           </div>

           {/* Workspace Background Decoration */}
           <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-3 py-1 bg-white border border-neutral-200 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] technical-label text-black">Active Stream</span>
              </div>
           </div>

           <div className="absolute bottom-4 right-4 flex items-center gap-2">
             <span className="text-[9px] technical-label text-neutral-400">Powered by Utopia AI</span>
             <Sparkles className="w-3 h-3 text-utopia" />
           </div>

        </div>

        {/* SMS Preview Area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="text-sm font-black italic tracking-tight uppercase">Template Editor</h4>
              <div className="industrial-card p-4 h-48 relative">
                 <textarea 
                    className="w-full h-full bg-transparent border-none appearance-none outline-none text-sm font-bold resize-none leading-relaxed italic"
                    defaultValue="Hello {{name}}, thank you for choosing Utopia! As a VIP guest, we've credited your account with 200 Loyalty points for your recent stay."
                 />
                 <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-2 py-0.5 bg-neutral-100 text-[10px] text-neutral-500 font-bold uppercase italic border border-neutral-200 rounded-[1px] cursor-pointer hover:bg-neutral-200">
                       {{name}}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-[10px] text-neutral-500 font-bold uppercase italic border border-neutral-200 rounded-[1px] cursor-pointer hover:bg-neutral-200">
                       {{last_stay}}
                    </span>
                 </div>
                 <div className="absolute bottom-4 right-4 text-[10px] technical-label text-neutral-400">
                    142 / 160 Characters
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-sm font-black italic tracking-tight uppercase">Live Preview (Mobile)</h4>
              <div className="w-full max-w-[280px] mx-auto border-4 border-black rounded-[2.5rem] p-3 aspect-[9/16] bg-neutral-100 relative overflow-hidden">
                 <div className="h-6 w-full flex justify-center mb-4">
                    <div className="w-20 h-4 bg-black rounded-b-xl" />
                 </div>
                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 relative mb-2">
                    <p className="text-[11px] font-bold text-black italic leading-tight">
                       Hello Almaz Belay, thank you for choosing Utopia! As a VIP guest, we've credited your account with 200 Loyalty points for your recent stay.
                    </p>
                    <div className="absolute top-half left-[-10px] w-4 h-4 bg-white rotate-45 border-l border-b border-neutral-200" />
                 </div>
                 <span className="text-[9px] text-neutral-400 text-center block mt-2">10:42 AM · Sent via SMS Gateway</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
