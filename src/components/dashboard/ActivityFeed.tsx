'use client';

import React from 'react';
import { 
  MessageSquare, 
  UserPlus, 
  RefreshCcw, 
  Settings, 
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'sms' | 'lead' | 'sync' | 'system';
  user?: string;
  message: string;
  timestamp: string;
}

const typeConfig: Record<ActivityItem['type'], { icon: LucideIcon, color: string, bg: string }> = {
  sms: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  lead: { icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  sync: { icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' },
  system: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 leading-none">Recent Activity</h3>
        <button className="text-xs font-semibold text-utopia hover:underline flex items-center gap-0.5">
          View All <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {items.map((item, idx) => (
          <div key={item.id} className="relative flex gap-4 group">
            {/* Timeline Line */}
            {idx !== items.length - 1 && (
              <div className="absolute left-5 top-10 w-px h-10 bg-gray-100" />
            )}

            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-110",
              typeConfig[item.type].bg
            )}>
              {React.createElement(typeConfig[item.type].icon, { 
                size: 18, 
                className: typeConfig[item.type].color 
              })}
            </div>

            <div className="flex flex-col pt-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                {item.user && (
                   <span className="text-sm font-bold text-gray-900">{item.user}</span>
                )}
                <span className="text-xs font-medium text-gray-400">{item.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &quot;{item.message}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
