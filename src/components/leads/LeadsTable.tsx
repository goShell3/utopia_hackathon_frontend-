'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lead, LeadSegment, LeadSource } from '@/types';

const SEGMENT_COLORS: Record<LeadSegment, string> = {
  hot: 'bg-utopia',
  warm: 'bg-amber-400',
  cold: 'bg-blue-400',
  unqualified: 'bg-neutral-300',
};

const SEGMENT_LABELS: Record<LeadSegment, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
  unqualified: 'Unqualified',
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  pms: 'PMS',
  csv: 'CSV',
  meta_ads: 'Meta Ads',
  data_broker: 'Data Broker',
  manual: 'Manual',
};

const PAGE_SIZE = 10;

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

export function LeadsTable({ leads, isLoading }: LeadsTableProps) {
  const router = useRouter();

  return (
    <div className="industrial-card p-0 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            <th className="p-4 technical-label text-neutral-400">Customer Identity</th>
            <th className="p-4 technical-label text-neutral-400">Phone</th>
            <th className="p-4 technical-label text-neutral-400">Source</th>
            <th className="p-4 technical-label text-neutral-400">Segment</th>
            <th className="p-4 technical-label text-neutral-400 text-right">Score</th>
            <th className="p-4 technical-label text-neutral-400"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {isLoading ? (
            Array(PAGE_SIZE).fill(0).map((_, i) => (
              <tr key={i}>
                <td colSpan={6} className="p-4">
                  <div className="h-4 bg-neutral-100 rounded animate-pulse w-full" />
                </td>
              </tr>
            ))
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <p className="technical-label text-neutral-300 uppercase">No leads found</p>
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => router.push(`/leads/${lead.id}`)}
                className="hover:bg-neutral-50 transition-colors group cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 rounded-[1px] flex items-center justify-center font-bold text-xs italic shrink-0">
                      {lead.first_name[0]}{lead.last_name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black italic tracking-tight">{lead.first_name} {lead.last_name}</span>
                      {lead.email && <span className="text-[10px] technical-label text-neutral-400">{lead.email}</span>}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-mono text-black">{lead.phone}</span>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-2 py-1 bg-neutral-100 rounded-[1px]">
                    {SOURCE_LABELS[lead.source] ?? lead.source}
                  </span>
                </td>
                <td className="p-4">
                  {lead.segment ? (
                    <div className="flex items-center gap-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full', SEGMENT_COLORS[lead.segment as LeadSegment] ?? 'bg-neutral-300')} />
                      <span className="text-xs font-bold italic tracking-tight">{SEGMENT_LABELS[lead.segment as LeadSegment] ?? lead.segment}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] technical-label text-neutral-300">—</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {lead.conversion_score != null ? (
                    <div className="flex flex-col items-end">
                      <span className={cn('text-sm font-black italic',
                        lead.conversion_score >= 80 ? 'text-utopia' :
                        lead.conversion_score >= 50 ? 'text-amber-500' : 'text-black'
                      )}>
                        {lead.conversion_score}
                      </span>
                      <span className="text-[8px] technical-label text-neutral-400">
                        {lead.conversion_probability != null ? `${Math.round(lead.conversion_probability)}% CONV` : 'SCORE'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] technical-label text-neutral-300">—</span>
                  )}
                </td>
                <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => router.push('/messages')}
                      className="p-2 hover:bg-neutral-200 rounded-[1px] transition-colors"
                    >
                      <MessageSquare size={14} className="text-black" />
                    </button>
                    <button className="p-2 hover:bg-neutral-200 rounded-[1px] transition-colors">
                      <MoreVertical size={14} className="text-neutral-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
