'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Zap, MessageSquare, FileUp, Settings, Share2,
  ChevronRight, CalendarDays, Megaphone, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';

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
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside className={cn(
      'h-screen bg-black text-white fixed left-0 top-0 flex flex-col z-50 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Brand Header */}
      <div className={cn('flex items-center transition-all duration-300', collapsed ? 'p-4 justify-center' : 'p-8 pb-6')}>
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic text-xl shrink-0">
          U
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Utopia</h1>
            <p className="text-[10px] technical-label text-neutral-500 mt-1">v.0.1.0-alpha</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 space-y-1 overflow-hidden', collapsed ? 'px-2' : 'px-4')}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group flex items-center rounded-lg transition-all duration-200',
                collapsed ? 'justify-center px-2 py-3' : 'justify-between px-4 py-3',
                isActive
                  ? 'bg-utopia text-white shadow-lg shadow-utopia/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <div className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-bold tracking-tight uppercase italic">{item.label}</span>
                )}
              </div>
              {!collapsed && isActive && <ChevronRight className="w-4 h-4 animate-in fade-in slide-in-from-left-2" />}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className={cn('p-4 border-t border-white/10', collapsed ? 'flex justify-center' : '')}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-neutral-500 hover:text-white transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </aside>
  );
}
