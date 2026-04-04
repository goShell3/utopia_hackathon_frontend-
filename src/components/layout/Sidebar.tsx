'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  MessageSquare, 
  FileUp, 
  Settings, 
  Share2,
  ChevronRight,
  CalendarDays,
  Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Calendar', icon: CalendarDays, href: '/calendar' },
  { label: 'Campaigns', icon: Zap, href: '/campaigns' },
  { label: 'Campaign ADs', icon: Megaphone, href: '/campaign-ads' },
  { label: 'Leads', icon: Users, href: '/leads' },
  { label: 'Messages', icon: MessageSquare, href: '/messages' },
  { label: 'Data Import', icon: FileUp, href: '/data-import' },
  { label: 'Integrations', icon: Share2, href: '/integrations' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-black text-white fixed left-0 top-0 flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic text-xl">
            U
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Utopia</h1>
        </div>
        <p className="text-[10px] technical-label text-neutral-500 mt-2">v.0.1.0-alpha</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-utopia text-white shadow-lg shadow-utopia/30" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-bold tracking-tight uppercase italic">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 animate-in fade-in slide-in-from-left-2" />}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}

