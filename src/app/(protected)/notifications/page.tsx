'use client';

import React, { useState } from 'react';
import { Bell, Zap, Users, MessageSquare, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'campaign' | 'lead' | 'sms' | 'alert' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  campaign: Zap,
  lead: Users,
  sms: MessageSquare,
  alert: AlertCircle,
  system: Bell,
};

const COLOR_MAP: Record<NotificationType, string> = {
  campaign: 'bg-utopia/10 text-utopia',
  lead: 'bg-blue-50 text-blue-500',
  sms: 'bg-emerald-50 text-emerald-500',
  alert: 'bg-rose-50 text-rose-500',
  system: 'bg-neutral-100 text-neutral-500',
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'campaign', title: 'Campaign Activated', message: 'Welcome SMS Blast is now live and targeting 1,240 leads.', timestamp: '2 min ago', read: false },
  { id: '2', type: 'lead', title: 'New Leads Imported', message: '320 new leads were imported from TotalEnergies PMS.', timestamp: '15 min ago', read: false },
  { id: '3', type: 'sms', title: 'SMS Delivery Report', message: '98.2% delivery rate on Churn Prevention campaign.', timestamp: '1 hour ago', read: false },
  { id: '4', type: 'alert', title: 'Campaign Paused', message: 'Upsell Offer campaign was paused due to low engagement.', timestamp: '3 hours ago', read: true },
  { id: '5', type: 'system', title: 'Data Sync Complete', message: 'PMS database synchronization completed successfully.', timestamp: '5 hours ago', read: true },
  { id: '6', type: 'lead', title: 'Lead Score Updated', message: '45 leads were re-scored and moved to the hot segment.', timestamp: 'Yesterday', read: true },
  { id: '7', type: 'campaign', title: 'Campaign Completed', message: 'Loyalty Bonus campaign reached its target audience.', timestamp: 'Yesterday', read: true },
  { id: '8', type: 'sms', title: 'Bulk SMS Sent', message: '5,400 messages dispatched for Q2 Campaign Launch.', timestamp: '2 days ago', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selected, setSelected] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setSelected(prev => prev?.id === id ? { ...prev, read: true } : prev);
  }

  function openNotification(n: Notification) {
    setSelected(n);
  }

  function closeModal() {
    setSelected(null);
  }

  const SelectedIcon = selected ? ICON_MAP[selected.type] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Notifications</h1>
          <p className="technical-label text-neutral-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-black italic uppercase text-neutral-400 hover:text-black transition-colors mt-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 text-xs font-black italic uppercase rounded-lg transition-colors',
              filter === f ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-300">
            <Bell className="w-10 h-10" />
            <span className="technical-label text-[10px]">No unread notifications</span>
          </div>
        ) : filtered.map(n => {
          const Icon = ICON_MAP[n.type];
          return (
            <li
              key={n.id}
              onClick={() => openNotification(n)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                n.read
                  ? 'border-neutral-100 bg-white hover:border-neutral-200'
                  : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
              )}
            >
              <div className={cn('p-2 rounded-lg shrink-0', COLOR_MAP[n.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black italic uppercase tracking-tight">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-utopia shrink-0" />}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{n.message}</p>
                <p className="technical-label text-[9px] text-neutral-400 mt-1.5">{n.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {selected && SelectedIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', COLOR_MAP[selected.type])}>
                  <SelectedIcon className="w-4 h-4" />
                </div>
                <span className="technical-label text-[9px] uppercase text-neutral-400">{selected.type}</span>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="display-header text-xl italic tracking-tight">{selected.title}</h2>
                {!selected.read && <span className="w-2 h-2 rounded-full bg-utopia shrink-0 mt-2" />}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{selected.message}</p>
              <p className="technical-label text-[9px] text-neutral-400">{selected.timestamp}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end">
              {!selected.read ? (
                <button
                  onClick={() => markRead(selected.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-black italic uppercase tracking-tight hover:bg-neutral-800 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as read
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-black italic uppercase text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Already read
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
