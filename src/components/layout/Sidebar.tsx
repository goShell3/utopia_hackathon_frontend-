'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  MessageSquare, 
  Database, 
  Settings, 
  BarChart3,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Leads', icon: Users, href: '/leads' },
  { name: 'Campaigns', icon: Megaphone, href: '/campaigns' },
  { name: 'Messages', icon: MessageSquare, href: '/messages' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Data Import', icon: Database, href: '/import' },
  { name: 'Integrations', icon: Settings, href: '/integrations' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-sidebar fixed left-0 top-0 text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-utopia rounded flex items-center justify-center">
          <span className="font-bold text-lg">U</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Utopia</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white",
                isActive && "bg-utopia text-white sidebar-item-active"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Plan */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Plan</p>
            <p className="text-sm font-semibold">Enterprise Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
