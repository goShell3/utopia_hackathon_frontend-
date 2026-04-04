'use client';

import { useState, useEffect } from 'react';
import { FileDown, Plus } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { LeadsFilterBar } from '@/components/leads/LeadsFilterBar';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadsPagination } from '@/components/leads/LeadsPagination';
import { CreateLeadModal } from '@/components/leads/CreateLeadModal';
import { useLeads } from '@/hooks/useLeads';
import type { LeadSegment, LeadSource } from '@/types';

const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segment, setSegment] = useState<LeadSegment | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

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
          <Button variant="outline" size="md" icon={FileDown} className="bg-white">Export JSON</Button>
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
