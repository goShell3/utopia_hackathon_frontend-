'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown, 
  Search, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Settings,
  MoreVertical,
  Check
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

const usersData = [
  { id: 1, name: 'John Doe', email: 'john@utopia.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sara Miller', email: 'sara@utopia.com', role: 'Marketing', status: 'Active' },
  { id: 3, name: 'Arjun Gupta', email: 'arjun@utopia.com', role: 'Analyst', status: 'Inactive' },
  { id: 4, name: 'Elena Vance', email: 'elena@utopia.com', role: 'Staff', status: 'Active' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Identity Management</h1>
          <p className="technical-label text-neutral-500 mt-1">Role-based access control (RBAC)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={Lock} className="bg-white">
            Audit Logs
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            Create User
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="industrial-card p-4 flex items-center gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-utopia transition-colors" />
          <input 
            type="text" 
            placeholder="Search identities by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-200 py-2.5 pl-10 pr-4 text-sm font-black placeholder:font-normal placeholder:technical-label focus:outline-none focus:ring-1 focus:ring-utopia/10"
          />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" icon={ShieldCheck} className="bg-white px-4">Role: All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Table */}
        <div className="lg:col-span-2 industrial-card p-0 rounded-none overflow-hidden h-fit">
          <table className="w-full text-left border-collapse italic">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 technical-label text-neutral-400 font-bold">Authorized Entity</th>
                <th className="p-4 technical-label text-neutral-400 font-bold">Security Role</th>
                <th className="p-4 technical-label text-neutral-400 font-bold text-right">State</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-[1px] font-black italic shadow-md">
                           {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black italic tracking-tight">{user.name}</span>
                           <span className="text-[10px] technical-label text-neutral-400 uppercase">{user.email}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                     <div className={cn(
                       "w-fit px-3 py-1 text-[10px] technical-label font-bold border rounded-[1px]",
                       user.role === 'Admin' ? "bg-utopia text-white border-utopia" : "bg-white text-black border-black"
                     )}>
                        {user.role}
                     </div>
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        )} />
                        <span className="text-[10px] font-black italic uppercase tracking-tighter">{user.status}</span>
                     </div>
                  </td>
                  <td className="p-4 text-right">
                     <button className="text-neutral-300 hover:text-black group-hover:opacity-100 opacity-0 transition-all">
                        <MoreVertical size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permissions / Quick Config Panel */}
        <div className="industrial-card p-6 flex flex-col space-y-8 bg-neutral-50/50">
           <div>
              <h3 className="display-header text-xl italic uppercase">Role Matrix Configuration</h3>
              <p className="technical-label text-neutral-500">Fine-grained permission mapping</p>
           </div>
           
           <div className="space-y-6">
              <PermissionToggle label="Modify Lead Database" enabled />
              <PermissionToggle label="Execute SMS Campaigns" enabled />
              <PermissionToggle label="Export CSV/Analytics" enabled />
              <PermissionToggle label="Integration Protocol Access" />
              <PermissionToggle label="System Identity Management" />
           </div>

           <div className="pt-6 border-t border-neutral-200">
              <Button variant="primary" size="md" className="w-full" icon={ShieldCheck}>
                 Update Role Matrix
              </Button>
              <button className="w-full text-center mt-4 text-[10px] technical-label text-rose-500 font-black italic uppercase hover:underline">
                 Revoke Global Access
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function PermissionToggle({ label, enabled }: { label: string, enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-neutral-100 rounded-[1px] hover:border-black transition-all group cursor-pointer">
       <span className="text-xs font-black italic tracking-tighter uppercase">{label}</span>
       <div className={cn(
         "w-5 h-5 rounded-full flex items-center justify-center border-2",
         enabled ? "bg-black border-black text-white" : "bg-white border-neutral-200 text-transparent"
       )}>
          <Check size={12} strokeWidth={4} />
       </div>
    </div>
  );
}
