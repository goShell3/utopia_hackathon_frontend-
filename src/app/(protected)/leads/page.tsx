'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileDown, Plus, ChevronDown, Search, Users,
  Filter, X, Upload, MessageSquare, MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { CreateLeadModal } from '@/components/leads/CreateLeadModal';
import { LeadsPagination } from '@/components/leads/LeadsPagination';
import { cn } from '@/lib/utils';
import { leads as ALL_LEADS, matchLeadToSegment } from '@/data/lead';
import type { Lead, Segment } from '@/data/lead';

const PAGE_SIZE = 10;

const SEGMENTS: (Segment & { color: string })[] = [
  { id: 's1', name: 'Addis VIP', color: 'bg-utopia', filters: { city: 'Addis Ababa', tags: ['vip'] } },
  { id: 's2', name: 'Recent PMS', color: 'bg-blue-500', filters: { source: ['pms'], lastStayDaysAgo: 90 } },
  { id: 's3', name: 'Meta Leads', color: 'bg-violet-500', filters: { source: ['meta'] } },
  { id: 's4', name: 'Diaspora Summer', color: 'bg-emerald-500', filters: { tags: ['diaspora'] } },
  { id: 's5', name: 'Uncontacted', color: 'bg-neutral-400', filters: { tags: [] } },
];

const LAST_STAY_OPTIONS = [
  { label: 'Any time', value: '' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
  { label: 'Last 6 months', value: '180' },
  { label: 'Last year', value: '365' },
];

const SOURCE_LABELS: Record<string, string> = {
  pms: 'PMS', meta: 'Meta', website: 'Website', manual: 'Manual',
};

export default function LeadsPage() {
  const router = useRouter();
  const [allLeads, setAllLeads] = useState<Lead[]>(ALL_LEADS);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [lastStay, setLastStay] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setPage(1); }, [search, source, lastStay, tagFilter, activeSegmentId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeSegment = SEGMENTS.find(s => s.id === activeSegmentId) ?? null;

  const filtered = useMemo(() => {
    let result = allLeads;

    if (activeSegment) {
      result = result.filter(l => matchLeadToSegment(l, activeSegment));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.email?.toLowerCase().includes(q)
      );
    }
    if (source) result = result.filter(l => l.source === source);
    if (tagFilter) {
      const t = tagFilter.toLowerCase().trim();
      result = result.filter(l => l.tags?.some(tag => tag.includes(t)));
    }
    if (lastStay) {
      const days = Number(lastStay);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter(l => l.lastStayDate && new Date(l.lastStayDate) >= cutoff);
    }

    return result;
  }, [allLeads, activeSegment, search, source, tagFilter, lastStay]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [source, lastStay, tagFilter].filter(Boolean).length;

  const clearAll = () => {
    setSearch(''); setSource(''); setLastStay('');
    setTagFilter(''); setActiveSegmentId(null);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'leads.json'; a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['id', 'name', 'phone', 'email', 'city', 'source', 'tags', 'lastStayDate', 'createdAt'];
      const rows = filtered.map(l => headers.map(h => {
        const v = (l as unknown as Record<string, unknown>)[h];
        return Array.isArray(v) ? v.join(';') : (v ?? '');
      }).join(','));
      const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
      URL.revokeObjectURL(url);
    }
    setShowExport(false);
  };

  const handleAddLead = (lead: Lead) => {
    setAllLeads(prev => [lead, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="flex gap-6 animate-in fade-in duration-500 pb-20">

      {/* ── Segment Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-52 shrink-0 space-y-1 pt-1">
        <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest px-2 mb-3">Segments</p>

        <button
          onClick={() => setActiveSegmentId(null)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-[11px] font-black italic uppercase transition-colors rounded-[2px]',
            activeSegmentId === null ? 'bg-black text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
          )}
        >
          <span className="flex items-center gap-2"><Users size={11} /> All Leads</span>
          <span className="text-[9px]">{allLeads.length}</span>
        </button>

        <div className="border-t border-neutral-100 my-2" />

        {SEGMENTS.map(seg => {
          const count = allLeads.filter(l => matchLeadToSegment(l, seg)).length;
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSegmentId(activeSegmentId === seg.id ? null : seg.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-[11px] font-black italic uppercase transition-colors rounded-[2px]',
                activeSegmentId === seg.id ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', seg.color)} />
                {seg.name}
              </span>
              <span className="text-[9px]">{count}</span>
            </button>
          );
        })}

        <div className="border-t border-neutral-100 my-2" />
        <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black italic uppercase text-utopia hover:bg-utopia/5 transition-colors rounded-[2px]">
          <Plus size={10} /> New Segment
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="display-header text-4xl italic tracking-tighter uppercase">Lead Management</h1>
            <p className="technical-label text-neutral-500 mt-1 uppercase tracking-widest text-[10px]">
              High fidelity customer segmentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-9 px-4 border border-neutral-200 text-[10px] font-black italic uppercase bg-white hover:border-black transition-colors">
              <Upload size={12} /> Import
            </button>
            <button className="flex items-center gap-2 h-9 px-4 border border-neutral-200 text-[10px] font-black italic uppercase bg-white hover:border-black transition-colors">
              <MessageSquare size={12} /> Send SMS
            </button>
            <div ref={exportRef} className="relative">
              <button
                onClick={() => setShowExport(v => !v)}
                className={cn(
                  'flex items-center gap-2 h-9 px-4 border text-[10px] font-black italic uppercase transition-colors bg-white',
                  showExport ? 'border-black text-black' : 'border-neutral-200 text-neutral-500 hover:border-black hover:text-black'
                )}
              >
                <FileDown size={12} /> Export
                <ChevronDown size={10} className={cn('transition-transform', showExport && 'rotate-180')} />
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-neutral-200 shadow-xl w-36">
                  {(['csv', 'json'] as const).map(fmt => (
                    <button key={fmt} onClick={() => handleExport(fmt)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-black italic uppercase hover:bg-neutral-50 text-neutral-700">
                      <FileDown size={11} /> {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="primary" size="md" icon={Plus} onClick={() => setShowModal(true)}
              className="font-black italic uppercase">
              Add Lead
            </Button>
          </div>
        </div>

        {/* Context banner */}
        {(activeSegment || activeFilterCount > 0) && (
          <div className="flex items-center justify-between bg-utopia/5 border border-utopia/20 px-4 py-2.5 rounded-[2px]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-utopia animate-pulse" />
              <span className="text-[11px] font-black italic uppercase text-utopia">
                {activeSegment
                  ? `Showing ${filtered.length} leads · Segment: ${activeSegment.name}`
                  : `Showing ${filtered.length} leads · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
              </span>
            </div>
            <button onClick={clearAll} className="text-[9px] font-black uppercase text-utopia hover:underline flex items-center gap-1">
              <X size={10} /> Clear
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className="industrial-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-neutral-200 py-2.5 pl-10 pr-4 text-sm font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={cn(
                'flex items-center gap-2 h-10 px-4 border text-[10px] font-black italic uppercase transition-colors shrink-0',
                showFilters || activeFilterCount > 0
                  ? 'border-utopia text-utopia bg-utopia/5'
                  : 'border-neutral-200 text-neutral-500 bg-white hover:border-black hover:text-black'
              )}
            >
              <Filter size={12} /> Filters
              {activeFilterCount > 0 && (
                <span className="bg-utopia text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-neutral-100 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-neutral-400">Source</label>
                <select value={source} onChange={e => setSource(e.target.value)}
                  className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30">
                  <option value="">All</option>
                  <option value="pms">PMS</option>
                  <option value="meta">Meta</option>
                  <option value="website">Website</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-neutral-400">Last Stay</label>
                <select value={lastStay} onChange={e => setLastStay(e.target.value)}
                  className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-utopia/30">
                  {LAST_STAY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-neutral-400">Tag</label>
                <input value={tagFilter} onChange={e => setTagFilter(e.target.value)}
                  placeholder="e.g. vip"
                  className="w-full bg-white border border-neutral-200 py-2 px-3 text-xs font-bold placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-utopia/30" />
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button onClick={clearAll}
                    className="text-[9px] font-black uppercase text-utopia hover:underline flex items-center gap-1">
                    <X size={10} /> Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="industrial-card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 technical-label text-neutral-400">Name</th>
                <th className="p-4 technical-label text-neutral-400">Phone / Email</th>
                <th className="p-4 technical-label text-neutral-400">City</th>
                <th className="p-4 technical-label text-neutral-400">Source</th>
                <th className="p-4 technical-label text-neutral-400">Tags</th>
                <th className="p-4 technical-label text-neutral-400">Last Stay</th>
                <th className="p-4 technical-label text-neutral-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <p className="technical-label text-neutral-300 uppercase">No leads found</p>
                  </td>
                </tr>
              ) : paginated.map(lead => (
                <tr key={lead.id}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="hover:bg-neutral-50 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-200 rounded-[1px] flex items-center justify-center font-bold text-xs italic shrink-0">
                        {lead.name?.slice(0, 2).toUpperCase() ?? '??'}
                      </div>
                      <span className="text-sm font-black italic tracking-tight">{lead.name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-mono">{lead.phone ?? '—'}</span>
                      {lead.email && <span className="text-[10px] technical-label text-neutral-400">{lead.email}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold italic">{lead.city ?? '—'}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-2 py-1 bg-neutral-100 rounded-[1px]">
                      {SOURCE_LABELS[lead.source] ?? lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags && lead.tags.length > 0
                        ? lead.tags.map(tag => (
                          <span key={tag} className="text-[8px] font-black italic uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-[2px]">
                            {tag}
                          </span>
                        ))
                        : <span className="text-[10px] technical-label text-neutral-300">—</span>
                      }
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] technical-label text-neutral-500">
                      {lead.lastStayDate ?? '—'}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => router.push('/messages')}
                        className="p-2 hover:bg-neutral-200 rounded-[1px] transition-colors">
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

        <LeadsPagination
          page={page}
          pages={pages}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {showModal && <CreateLeadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
