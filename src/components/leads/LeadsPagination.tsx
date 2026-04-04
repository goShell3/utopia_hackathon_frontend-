'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadsPaginationProps {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LeadsPagination({ page, pages, total, pageSize, onPageChange }: LeadsPaginationProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 -mt-8">
      <span className="text-[10px] technical-label text-neutral-500">
        {total > 0
          ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total} leads`
          : 'No results'}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const n = page <= 3 ? i + 1 : page - 2 + i;
          if (n < 1 || n > pages) return null;
          return (
            <button key={n} onClick={() => onPageChange(n)}
              className={cn('w-7 h-7 flex items-center justify-center text-[10px] font-bold transition-colors',
                n === page ? 'bg-black text-white' : 'hover:bg-neutral-100 text-neutral-500'
              )}>
              {n}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page === pages}
          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
