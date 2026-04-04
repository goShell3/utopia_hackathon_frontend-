'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  FileUp, 
  Settings, 
  Cpu, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Leads', icon: Users, href: '/leads' },
  { label: 'Campaigns', icon: Zap, href: '/campaigns' },
  { label: 'Messages', icon: MessageSquare, href: '/messages' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Data Import', icon: FileUp, href: '/data-import' },
  { label: 'Integrations', icon: Share2, href: '/integrations' },
  { label: 'AI Insights', icon: Cpu, href: '/ai-insights' },
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

      {/* Account / Settings Summary */}
      <div className="p-4 m-4 rounded-xl bg-white/5 border border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-utopia flex items-center justify-center font-bold text-xs italic">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black italic tracking-tight uppercase">John Doe</span>
            <span className="text-[9px] technical-label text-neutral-500">Administrator</span>
          </div>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-utopia w-3/4 h-full" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[9px] technical-label text-neutral-500">Usage</span>
          <span className="text-[9px] font-bold text-white tracking-widest">75%</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-8 border-t border-white/5">
        <span className="text-[8px] technical-label text-neutral-600">Enterprise Scale CMS</span>
      </div>
    </aside>
  );
}

