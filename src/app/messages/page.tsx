'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  CheckCheck,
  User,
  Plus,
  Zap,
  Filter,
  Paperclip,
  Smile,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

const conversations = [
  { id: 1, name: 'Almaz Belay', lastMsg: 'Thank you for the loyalty points!', time: '2m', unread: true, status: 'Responded' },
  { id: 2, name: 'Kebede Mekonnen', lastMsg: 'When is my next stay scheduled?', time: '1h', status: 'Delivered' },
  { id: 3, name: 'Leila Ibrahim', lastMsg: 'Confirmed booking for April 12.', time: '2h', status: 'Sent' },
  { id: 4, name: 'Brook Haile', lastMsg: 'Can I get a late checkout?', time: '5h', status: 'Delivered' },
];

const messageHistory = [
  { id: 1, sender: 'System', text: 'Hello Almaz, your stay is confirmed! We look forward to seeing you.', time: '10:00 AM' },
  { id: 2, sender: 'User', text: 'Thank you! Is breakfast included?', time: '10:05 AM' },
  { id: 3, sender: 'System', text: 'Yes, breakfast is served from 6AM to 10AM daily.', time: '10:10 AM' },
  { id: 4, sender: 'User', text: 'Great, thanks.', time: '10:12 AM' },
  { id: 5, sender: 'System', text: 'As a VIP guest, we\'ve credited your account with 200 Loyalty points.', time: '2:15 PM' },
  { id: 6, sender: 'User', text: 'Thank you for the loyalty points!', time: '2:17 PM' },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(1);

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar / Conversation List */}
      <div className="w-80 flex flex-col industrial-card p-0 h-full overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="display-header text-xl italic uppercase tracking-tighter mb-4">Inbox Stream</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-neutral-100 border border-neutral-200 py-2 pl-9 pr-3 text-[10px] technical-label focus:outline-none focus:ring-1 focus:ring-utopia/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 italic">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={cn(
                "p-4 cursor-pointer transition-all hover:bg-neutral-50",
                activeConv === conv.id ? "bg-black text-white" : "text-black"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-black italic tracking-tight">{conv.name}</span>
                <span className={cn(
                  "text-[8px] technical-label",
                  activeConv === conv.id ? "text-neutral-500" : "text-neutral-400"
                )}>{conv.time}</span>
              </div>
              <p className={cn(
                "text-[10px] truncate max-w-[180px]",
                activeConv === conv.id ? "text-neutral-400" : "text-neutral-500"
              )}>
                {conv.lastMsg}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  {conv.status === 'Responded' ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-utopia" />
                  ) : (
                    <CheckCheck size={10} className={activeConv === conv.id ? "text-utopia" : "text-neutral-400"} />
                  )}
                  <span className="text-[8px] technical-label uppercase">{conv.status}</span>
                </div>
                {conv.unread && activeConv !== conv.id && (
                  <span className="w-2 h-2 bg-utopia rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col industrial-card p-0 overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-[1px] font-black italic shadow-md">
              {conversations.find(c => c.id === activeConv)?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-sm font-black italic uppercase tracking-tight">{conversations.find(c => c.id === activeConv)?.name}</h3>
              <span className="text-[9px] technical-label text-emerald-500 uppercase">Identity Verified · E.164 Secure</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Zap} className="bg-white">Automation</Button>
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30 italic">
          {messageHistory.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col max-w-[70%] space-y-1",
              msg.sender === 'System' ? "ml-auto items-end" : "items-start"
            )}>
              <div className={cn(
                "p-4 shadow-sm",
                msg.sender === 'System' ? "bg-black text-white rounded-l-2xl rounded-tr-2xl" : "bg-white text-black border border-neutral-200 rounded-r-2xl rounded-tl-2xl"
              )}>
                <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[8px] technical-label text-neutral-400 uppercase tracking-widest">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white border-t border-neutral-200">
          <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-utopia/10 transition-all flex items-end gap-2">
            <div className="flex items-center gap-1 mb-1">
              <button className="p-1.5 text-neutral-400 hover:text-black hover:bg-white rounded-lg transition-colors"><Paperclip size={18} /></button>
              <button className="p-1.5 text-neutral-400 hover:text-black hover:bg-white rounded-lg transition-colors"><Smile size={18} /></button>
            </div>
            <textarea
              placeholder="Protocol: Enter secure SMS content..."
              className="flex-1 bg-transparent border-none outline-none text-xs font-bold italic resize-none py-2 min-h-[40px] max-h-32"
            />
            <button className="bg-utopia text-white p-3 rounded-lg hover:bg-utopia/90 transition-all shadow-lg shadow-utopia/20 -translate-y-0.5">
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 px-2">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-amber-500" />
              <span className="text-[9px] technical-label text-neutral-400 uppercase italic">AI Suggested: "Sounds great. When would you like..."</span>
            </div>
            <span className="text-[9px] technical-label text-neutral-300">120 / 160 GSM</span>
          </div>
        </div>
      </div>

      {/* Bulk SMS / Segment Panel */}
      <div className="w-80 flex flex-col space-y-6">
        <div className="industrial-card p-6 bg-utopia text-white border-none shadow-xl shadow-utopia/20">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} />
            <h3 className="display-header text-xl italic uppercase font-black">Bulk Signal</h3>
          </div>
          <p className="text-[10px] technical-label text-white/50 mb-6 font-bold uppercase tracking-widest leading-relaxed">Broadcast encrypted SMS packets to customer segments</p>
          <Button variant="outline" size="md" className="w-full bg-white text-utopia border-none hover:bg-white/90" icon={Plus}>
            Broadcast Manually
          </Button>
        </div>

        <div className="industrial-card p-6 flex-1 flex flex-col">
          <h3 className="text-sm font-black italic uppercase tracking-tight mb-4">Segment Targets</h3>
          <div className="space-y-3 flex-1 overflow-y-auto mb-6 italic">
            <SegmentItem label="High LTV VIPs" count="1,240" />
            <SegmentItem label="Recent Checkouts" count="842" active />
            <SegmentItem label="Churn Risk (30d)" count="4,923" />
            <SegmentItem label="Meta Ad Leads" count="212" />
          </div>
          <Button variant="primary" size="md" className="w-full" icon={Filter}>
            Apply Segment
          </Button>
        </div>
      </div>
    </div>
  );
}

function SegmentItem({ label, count, active }: { label: string, count: string, active?: boolean }) {
  return (
    <div className={cn(
      "p-3 border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02]",
      active ? "bg-black border-black text-white" : "bg-white border-neutral-100 text-black hover:border-black"
    )}>
      <span className="text-[10px] font-black italic tracking-widest uppercase">{label}</span>
      <span className={cn(
        "text-[9px] technical-label px-1.5 py-0.5 rounded-[1px]",
        active ? "bg-white text-black" : "bg-neutral-100 text-neutral-500"
      )}>{count}</span>
    </div>
  );
}
