'use client';

import { useState, useEffect, useRef } from 'react';
import { FileDown, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { LeadsFilterBar } from '@/components/leads/LeadsFilterBar';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadsPagination } from '@/components/leads/LeadsPagination';
import { CreateLeadModal } from '@/components/leads/CreateLeadModal';
import { useLeads } from '@/hooks/useLeads';
import type { LeadSegment, LeadSource } from '@/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segment, setSegment] = useState<LeadSegment | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'json' | 'csv') => {
    const items = data?.items ?? [];
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'leads.json'; a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['id', 'first_name', 'last_name', 'phone', 'email', 'country', 'source', 'segment', 'consent_status'];
      const rows = items.map(l => headers.map(h => (l as any)[h] ?? '').join(','));
      const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
      URL.revokeObjectURL(url);
    }
    setShowExport(false);
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, segment, source]);

  const { data, isLoading, isFetching } = useLeads({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch || undefined,
    segment: segment || undefined,
    source: source || undefined,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Lead Management</h1>
          <p className="technical-label text-neutral-500 mt-1">High fidelity customer segmentation</p>
        </div>
        <div className="flex items-center gap-3">
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setShowExport(v => !v)}
              className={cn(
                'flex items-center gap-2 h-9 px-4 border text-[10px] font-black italic uppercase transition-colors bg-white',
                showExport ? 'border-black text-black' : 'border-neutral-200 text-neutral-500 hover:border-black hover:text-black'
              )}
            >
              <FileDown size={13} />
              Export
              <ChevronDown size={10} className={cn('transition-transform', showExport && 'rotate-180')} />
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-neutral-200 shadow-xl w-36">
                {(['csv', 'json'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-black italic uppercase hover:bg-neutral-50 transition-colors text-neutral-700"
                  >
                    <FileDown size={11} />
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={() => setShowModal(true)}>Manual Entry</Button>
        </div>
      </div>

      <LeadsFilterBar
        search={search}
        segment={segment}
        source={source}
        isFetching={isFetching}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onSegmentChange={setSegment}
        onSourceChange={setSource}
      />

      <LeadsTable leads={data?.items ?? []} isLoading={isLoading} />

      <LeadsPagination
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {showModal && <CreateLeadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
