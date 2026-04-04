'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Zap, Bell, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useMe, useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

function ProfileDropdown() {
  const router = useRouter();
  const { data: user } = useMe();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-2 group"
      >
        <div className={cn(
          "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border transition-colors",
          open ? "border-utopia" : "border-gray-200 group-hover:border-utopia"
        )}>
          <UserCircle className="w-full h-full text-gray-400" />
        </div>
        <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-neutral-200 shadow-lg z-50">
          {/* User info */}
          <div className="p-4 border-b border-neutral-100">
            <p className="text-sm font-black italic tracking-tight">{user?.full_name}</p>
            <p className="text-[10px] technical-label text-neutral-400 mt-0.5">{user?.email}</p>
            <div className="mt-2 inline-flex px-2 py-0.5 bg-black text-white text-[9px] font-black italic uppercase rounded-[1px]">
              {user?.role}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-500 hover:bg-rose-50 transition-colors group"
            >
              <LogOut size={14} />
              <span className="text-xs font-black italic uppercase tracking-tight">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-utopia transition-colors" />
          <input
            type="text"
            placeholder="Search leads, campaigns, analytics..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-utopia/10 focus:border-utopia transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="primary" icon={Plus}>Add Lead</Button>
        <Button variant="primary" icon={Zap}>Create Campaign</Button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-utopia rounded-full border-2 border-white" />
        </button>

        <ProfileDropdown />
      </div>
    </header>
  );
}
