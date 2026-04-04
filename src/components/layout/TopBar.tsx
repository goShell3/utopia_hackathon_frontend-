'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, UserCircle, LogOut, ChevronDown } from 'lucide-react';
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
              Staff
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
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">

        <Link href="/notifications" className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-utopia rounded-full border-2 border-white" />
        </Link>

        <ProfileDropdown />
      </div>
    </header>
  );
}
