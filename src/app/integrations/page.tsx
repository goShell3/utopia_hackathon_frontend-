'use client';

import React from 'react';
import { 
  Plus, 
  Settings, 
  Zap, 
  ExternalLink, 
  RefreshCcw, 
  ShieldCheck, 
  AlertCircle,
  MoreVertical,
  Layers,
  Search,
  MessageCircle,
  BarChart3,
  Globe
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

const integrationsData = [
  { 
    id: 1, 
    name: 'TotalEnergies PMS', 
    category: 'PMS', 
    status: 'Connected', 
    lastSync: '5m ago',
    icon: Globe,
    desc: 'Bi-directional guest profile and stay history synchronization.'
  },
  { 
    id: 2, 
    name: 'Meta Ads Manager', 
    category: 'Marketing', 
    status: 'Connected', 
    lastSync: '1h ago',
    icon: BarChart3,
    desc: 'Import leads from Facebook & Instagram lead forms.'
  },
  { 
    id: 3, 
    name: 'AWS Pinpoint', 
    category: 'SMS Gateway', 
    status: 'Disconnected', 
    lastSync: 'Never',
    icon: MessageCircle,
    desc: 'High-throughput enterprise SMS delivery service.'
  },
  { 
    id: 4, 
    name: 'Opera Cloud', 
    category: 'PMS', 
    status: 'Inactive', 
    lastSync: '2d ago',
    icon: Layers,
    desc: 'Oracle Hospitality cloud node integration.'
  }
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Connection Grid</h1>
          <p className="technical-label text-neutral-500 mt-1">External protocol management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={RefreshCcw} className="bg-white">
            Sync All
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            New Node
          </Button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-4 scrollbar-hide overflow-x-auto pb-4">
         <CategoryButton label="All Nodes" active />
         <CategoryButton label="PMS (2)" />
         <CategoryButton label="Marketing (1)" />
         <CategoryButton label="SMS Gateway (1)" />
         <CategoryButton label="Analytics (0)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {integrationsData.map((node) => (
          <div key={node.id} className="industrial-card p-0 flex flex-col group">
            <div className="p-6 flex items-start justify-between border-b border-neutral-100">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-[1px] shadow-lg">
                     <node.icon size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-black italic uppercase leading-none">{node.name}</h3>
                     <span className="text-[10px] technical-label text-neutral-500 mt-1 block uppercase">{node.category}</span>
                  </div>
               </div>
               <div className={cn(
                 "px-3 py-1 text-[10px] font-black italic uppercase rounded-[1px] border",
                 node.status === 'Connected' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                 node.status === 'Disconnected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                 "bg-neutral-50 text-neutral-400 border-neutral-100"
               )}>
                  {node.status}
               </div>
            </div>

            <div className="p-6 bg-neutral-50/50 flex-1">
               <p className="text-sm text-neutral-600 font-bold italic leading-relaxed mb-6">
                  "{node.desc}"
               </p>
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                     <span className="text-[10px] technical-label text-neutral-400">STATE: ACTIVE</span>
                     <span className="text-xs font-black italic uppercase mt-0.5">{node.lastSync} SYNC</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] technical-label text-neutral-400">LATENCY: LOW</span>
                     <span className="text-xs font-black italic uppercase mt-0.5">240MS AVG</span>
                  </div>
               </div>
            </div>

            <div className="p-4 flex items-center justify-between bg-white mt-auto">
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={Settings} className="bg-white px-4">Config</Button>
               </div>
               <div className="flex items-center gap-2">
                  {node.status === 'Connected' ? (
                     <Button variant="outline" size="sm" icon={ExternalLink} className="bg-white border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                        Disconnect
                     </Button>
                  ) : (
                     <Button variant="primary" size="sm" icon={Zap}>
                        Initialize
                     </Button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Summary Panel */}
      <div className="industrial-card p-6 bg-black text-white relative overflow-hidden">
         <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-utopia flex items-center justify-center rounded-[1px]">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h3 className="display-header text-xl italic uppercase">Data Protocol Integrity</h3>
                  <p className="text-[10px] technical-label text-neutral-500 uppercase tracking-widest mt-1">Enterprise encryption enabled (AES-256)</p>
               </div>
            </div>
            <div className="text-right">
               <span className="text-3xl font-black italic tracking-tighter">100%</span>
               <span className="block text-[8px] technical-label text-emerald-500 uppercase">Secure Streams</span>
            </div>
         </div>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-32 bg-utopia/5 -skew-x-12 translate-x-12 translate-y-[-2rem]" />
         <div className="absolute top-0 right-1/4 w-32 h-full bg-white/5 -skew-x-12" />
      </div>
    </div>
  );
}

function CategoryButton({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={cn(
      "px-6 py-2 whitespace-nowrap text-[10px] technical-label border-[1.5px] uppercase transition-all",
      active 
        ? "bg-black text-white border-black" 
        : "bg-white text-neutral-400 border-neutral-200 hover:border-black hover:text-black"
    )}>
       {label}
    </button>
  );
}
