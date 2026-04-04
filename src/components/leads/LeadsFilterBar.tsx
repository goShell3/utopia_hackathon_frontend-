'use client';

import { Search, Loader2 } from 'lucide-react';
import type { LeadSegment, LeadSource } from '@/types';

interface LeadsFilterBarProps {
  search: string;
  segment: LeadSegment | '';
  source: LeadSource | '';
  isFetching: boolean;
  isLoading: boolean;
  onSearchChange: (v: string) => void;
  onSegmentChange: (v: LeadSegment | '') => void;
  onSourceChange: (v: LeadSource | '') => void;
}

const selectClass = "bg-white border border-neutral-200 py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30";

export function LeadsFilterBar({
  search, segment, source, isFetching, isLoading,
  onSearchChange, onSegmentChange, onSourceChange,
}: LeadsFilterBarProps) {
  return (
    <div className="industrial-card p-4 flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-white border border-neutral-200 py-2.5 pl-10 pr-4 text-sm font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30"
        />
      </div>

      <select value={segment} onChange={e => onSegmentChange(e.target.value as LeadSegment | '')} className={selectClass}>
        <option value="">Segment: All</option>
        <option value="hot">Hot</option>
        <option value="warm">Warm</option>
        <option value="cold">Cold</option>
        <option value="unqualified">Unqualified</option>
      </select>

      <select value={source} onChange={e => onSourceChange(e.target.value as LeadSource | '')} className={selectClass}>
        <option value="">Source: All</option>
        <option value="pms">PMS</option>
        <option value="csv">CSV</option>
        <option value="meta_ads">Meta Ads</option>
        <option value="data_broker">Data Broker</option>
        <option value="manual">Manual</option>
      </select>

      {isFetching && !isLoading && (
        <Loader2 size={16} className="animate-spin text-neutral-400 shrink-0" />
      )}
    </div>
  );
}
