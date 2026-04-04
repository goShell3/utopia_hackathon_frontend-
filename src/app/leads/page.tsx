'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  MoreVertical, 
  MessageSquare, 
  Mail, 
  Star,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

// Mock Data
const leadsData = [
  { id: '1', name: 'Almaz Belay', phone: '+251 911 234 567', source: 'PMS Integration', status: 'Inbound', ltv: 1250, score: 92 },
  { id: '2', name: 'Kebede Mekonnen', phone: '+251 922 111 222', source: 'Meta Ads', status: 'Engaged', ltv: 450, score: 68 },
  { id: '3', name: 'Sara Tesfaye', phone: '+251 910 555 666', source: 'CSV Export', status: 'Lost', ltv: 0, score: 12 },
  { id: '4', name: 'Brook Haile', phone: '+251 912 888 777', source: 'Data Broker', status: 'Nurture', ltv: 2100, score: 85 },
  { id: '5', name: 'Leila Ibrahim', phone: '+251 966 333 444', source: 'PMS Integration', status: 'Converted', ltv: 4200, score: 98 },
  { id: '6', name: 'Dawit Girma', phone: '+251 911 777 999', source: 'Meta Ads', status: 'Inbound', ltv: 150, score: 45 },
];

export default function LeadsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Lead Management</h1>
          <p className="technical-label text-neutral-500 mt-1">High fidelity customer segmentation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={FileDown} className="bg-white">
            Export JSON
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="industrial-card p-4 flex items-center gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search leads by name, phone, or score..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-200 py-2.5 pl-10 pr-4 text-sm font-bold placeholder:font-normal placeholder:technical-label focus:outline-none focus:ring-1 focus:ring-utopia/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Filter} className="bg-white px-3">
            Source: All
          </Button>
          <Button variant="outline" size="sm" icon={Star} className="bg-white px-3">
            Score: 80+
          </Button>
        </div>
      </div>

      {/* Table Interface */}
      <div className="industrial-card p-0 rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 technical-label text-neutral-400">Customer Identity</th>
              <th className="p-4 technical-label text-neutral-400">Communication Node</th>
              <th className="p-4 technical-label text-neutral-400">Source Protocol</th>
              <th className="p-4 technical-label text-neutral-400">Workflow Status</th>
              <th className="p-4 technical-label text-neutral-400 text-right">LTV Score</th>
              <th className="p-4 technical-label text-neutral-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leadsData.map((lead) => (
              <tr key={lead.id} className="hover:bg-neutral-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 rounded-[1px] flex items-center justify-center font-bold text-xs italic">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-black italic tracking-tight">{lead.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-mono technical-label text-black">{lead.phone}</span>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-2 py-1 bg-neutral-100 rounded-[1px]">
                    {lead.source}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      lead.status === 'Converted' ? "bg-emerald-500" : 
                      lead.status === 'Inbound' ? "bg-utopia" : "bg-neutral-400"
                    )} />
                    <span className="text-xs font-bold italic tracking-tight">{lead.status}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-sm font-black italic",
                      lead.ltv > 1000 ? "text-utopia" : "text-black"
                    )}>
                      ${lead.ltv.toLocaleString()}
                    </span>
                    <span className="text-[8px] technical-label text-neutral-400">RANK: {lead.score}%</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-neutral-200 rounded-[1px] transition-colors">
                      <MessageSquare size={14} className="text-black" />
                    </button>
                    <button className="p-2 hover:bg-neutral-200 rounded-[1px] transition-colors">
                      <MoreVertical size={14} className="text-neutral-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination / Summary Footer */}
      <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 mt-[-2rem]">
        <div className="flex items-center gap-4">
          <span className="text-[10px] technical-label text-neutral-500">Showing 6 of 2,400 active nodes</span>
          <div className="flex items-center gap-1">
             {[1,2,3,4].map(n => (
               <button key={n} className={cn(
                 "w-6 h-6 flex items-center justify-center text-[10px] font-bold technical-label hover:bg-neutral-100",
                 n === 1 ? "bg-black text-white" : "text-neutral-500"
               )}>
                 {n}
               </button>
             ))}
          </div>
        </div>
        <Button variant="outline" size="sm" icon={ChevronDown} className="bg-white technical-label text-[10px] px-4">
          Rows: 10
        </Button>
      </div>
    </div>
  );
}
