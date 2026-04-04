'use client';

import React from 'react';
import { 
  Search, 
  Plus, 
  Zap, 
  Bell, 
  UserCircle 
} from 'lucide-react';
import { Button } from '@/components/shared/Button';

export function TopBar() {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
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

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="primary" icon={Plus}>
          Add Lead
        </Button>
        <Button variant="primary" icon={Zap}>
          Create Campaign
        </Button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-utopia rounded-full border-2 border-white" />
        </button>

        <button className="flex items-center gap-3 pl-2 group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-utopia transition-colors">
            <UserCircle className="w-full h-full text-gray-400" />
          </div>
        </button>
      </div>
    </header>
  );
}
