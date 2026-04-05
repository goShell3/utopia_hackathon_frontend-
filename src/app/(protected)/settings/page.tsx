'use client';

import React, { useState } from 'react';
import { User, Building2, Bell, Shield, Trash2, Save, Eye, EyeOff, Check, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMe } from '@/hooks/useAuth';
import { EVENT_CATEGORY_COLORS } from '../../../../events';
import type { EventCategory } from '../../../../events';

const ALL_CATEGORIES = Object.keys(EVENT_CATEGORY_COLORS) as EventCategory[];
const DEMAND_LEVELS = ['extreme', 'high', 'medium', 'low'] as const;
type DemandLevel = typeof DEMAND_LEVELS[number];
const DEMAND_COLORS: Record<DemandLevel, string> = {
  extreme: 'bg-rose-500',
  high:    'bg-orange-400',
  medium:  'bg-yellow-400',
  low:     'bg-neutral-300',
};

type Tab = 'profile' | 'hotel' | 'notifications' | 'security' | 'events' | 'danger';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'hotel', label: 'Hotel', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function Input({ defaultValue, placeholder, type = 'text' }: { defaultValue?: string; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic focus:border-black transition-colors outline-none"
    />
  );
}

function SaveButton({ onClick }: { onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  function handle() {
    setSaved(true);
    onClick?.();
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <button
      onClick={handle}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black italic uppercase tracking-tight transition-all',
        saved ? 'bg-accent-green text-white' : 'bg-black text-white hover:bg-neutral-800'
      )}
    >
      {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
    </button>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-sm font-black italic uppercase tracking-tight">{label}</p>
        {description && <p className="text-[10px] technical-label text-neutral-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={cn(
          'w-10 h-5 rounded-full transition-colors relative shrink-0',
          on ? 'bg-black' : 'bg-neutral-200'
        )}
      >
        <span className={cn(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
          on ? 'left-5' : 'left-0.5'
        )} />
      </button>
    </div>
  );
}

function EventsSettingsPanel() {
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(new Set(ALL_CATEGORIES));
  const [visibleDemandLevels, setVisibleDemandLevels] = useState<Set<DemandLevel>>(new Set(DEMAND_LEVELS));
  const [leadTimeMultiplier, setLeadTimeMultiplier] = useState(1);
  const [showImpactRadius, setShowImpactRadius] = useState(true);
  const [autoFetchOnOpen, setAutoFetchOnOpen] = useState(false);
  const [defaultTimeframe, setDefaultTimeframe] = useState<'14' | '30' | '90'>('30');

  function toggleCategory(cat: EventCategory) {
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  function toggleDemand(level: DemandLevel) {
    setVisibleDemandLevels(prev => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }

  return (
    <div className="industrial-card p-8 space-y-8">
      <div>
        <h2 className="display-header text-xl italic">Events</h2>
        <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Configure event display and behaviour across the calendar</p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest">Active Categories</p>
        <div className="flex flex-col gap-1">
          {ALL_CATEGORIES.map(cat => {
            const active = activeCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left',
                  active ? 'border-neutral-200 bg-neutral-50' : 'border-transparent opacity-40'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: EVENT_CATEGORY_COLORS[cat] }} />
                <span className="text-[11px] font-black italic uppercase tracking-tight flex-1">{cat}</span>
                <span className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                  active ? 'bg-black border-black' : 'border-neutral-300'
                )}>
                  {active && <span className="w-2 h-2 bg-white rounded-sm" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Demand levels */}
      <div className="space-y-3">
        <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest">Visible Demand Levels</p>
        <div className="flex flex-col gap-1">
          {DEMAND_LEVELS.map(level => {
            const active = visibleDemandLevels.has(level);
            return (
              <button
                key={level}
                onClick={() => toggleDemand(level)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left',
                  active ? 'border-neutral-200 bg-neutral-50' : 'border-transparent opacity-40'
                )}
              >
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', DEMAND_COLORS[level])} />
                <span className="text-[11px] font-black italic uppercase tracking-tight flex-1">{level}</span>
                <span className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                  active ? 'bg-black border-black' : 'border-neutral-300'
                )}>
                  {active && <span className="w-2 h-2 bg-white rounded-sm" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Lead time multiplier */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest">Lead Time Multiplier</p>
          <span className="text-sm font-black italic">{leadTimeMultiplier}×</span>
        </div>
        <input
          type="range"
          min={0.5} max={3} step={0.5}
          value={leadTimeMultiplier}
          onChange={e => setLeadTimeMultiplier(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="flex justify-between">
          <span className="technical-label text-[9px] text-neutral-400">0.5×</span>
          <span className="technical-label text-[9px] text-neutral-400">3×</span>
        </div>
        <p className="text-[10px] text-neutral-400">
          At <span className="font-black text-black">{leadTimeMultiplier}×</span>, a 30-day lead becomes <span className="font-black text-black">{30 * leadTimeMultiplier} days</span>.
        </p>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Fetch defaults */}
      <div className="space-y-3">
        <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest">Fetch Defaults</p>
        <div className="space-y-1">
          <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-2">Default Timeframe</p>
          <div className="flex gap-2">
            {(['14', '30', '90'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDefaultTimeframe(d)}
                className={cn(
                  'flex-1 py-2 rounded-xl border text-xs font-black italic uppercase tracking-tight transition-all',
                  defaultTimeframe === d ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                )}
              >
                {d === '14' ? '2 Weeks' : d === '30' ? '1 Month' : '3 Months'}
              </button>
            ))}
          </div>
        </div>
        <Toggle label="Auto-fetch on Calendar Open" description="Automatically fetch events when opening the calendar" defaultChecked={autoFetchOnOpen} />
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Map options */}
      <div className="space-y-1">
        <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">Map Options</p>
        <Toggle label="Show Impact Radius" description="Display km radius overlay on the event map" defaultChecked={showImpactRadius} />
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { data: user } = useMe();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="display-header text-4xl italic tracking-tighter">Settings</h1>
        <p className="technical-label text-neutral-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <nav className="flex flex-col gap-1 w-48 shrink-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-black italic uppercase tracking-tight transition-all text-left',
                tab === t.id
                  ? t.id === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-black text-white'
                  : t.id === 'danger' ? 'text-rose-400 hover:bg-rose-50' : 'text-neutral-400 hover:bg-neutral-100 hover:text-black'
              )}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 max-w-xl">

          {/* Profile */}
          {tab === 'profile' && (
            <div className="industrial-card p-8 space-y-6">
              <div>
                <h2 className="display-header text-xl italic">Profile</h2>
                <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Your personal account details</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-black italic text-xl">
                  {user?.full_name?.split(' ').map(n => n[0]).join('') ?? 'U'}
                </div>
                <div>
                  <p className="text-sm font-black italic uppercase">{user?.full_name ?? 'User'}</p>
                  <p className="technical-label text-[9px] text-neutral-400">{user?.email ?? '—'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-black text-white text-[9px] font-black italic uppercase rounded-[1px]">
                    Staff
                  </span>
                </div>
              </div>

              <div className="h-px bg-neutral-100" />

              <div className="grid grid-cols-2 gap-6">
                <Field label="Full Name">
                  <Input defaultValue={user?.full_name} placeholder="Your full name" />
                </Field>
                <Field label="Email">
                  <Input defaultValue={user?.email} placeholder="your@email.com" type="email" />
                </Field>
                <Field label="Language">
                  <select className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 text-sm font-bold italic focus:border-black transition-colors outline-none">
                    <option>English</option>
                    <option>Amharic</option>
                  </select>
                </Field>
              </div>

              <div className="flex justify-end pt-2">
                <SaveButton />
              </div>
            </div>
          )}

          {/* Hotel */}
          {tab === 'hotel' && (
            <div className="industrial-card p-8 space-y-6">
              <div>
                <h2 className="display-header text-xl italic">Hotel</h2>
                <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Your hotel profile and branding</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Field label="Hotel Name">
                  <Input defaultValue="Utopia Grand Hotel" />
                </Field>
                <Field label="Hotel ID">
                  <Input defaultValue={user?.hotel_id} />
                </Field>
                <Field label="Country">
                  <Input defaultValue="Ethiopia" />
                </Field>
                <Field label="City">
                  <Input defaultValue="Addis Ababa" />
                </Field>
                <Field label="Phone">
                  <Input defaultValue="+251 911 000 000" type="tel" />
                </Field>
                <Field label="Website">
                  <Input defaultValue="https://utopia.hotel" />
                </Field>
              </div>

              <Field label="Address">
                <Input defaultValue="Bole Road, Addis Ababa, Ethiopia" />
              </Field>

              <div className="flex justify-end pt-2">
                <SaveButton />
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="industrial-card p-8 space-y-6">
              <div>
                <h2 className="display-header text-xl italic">Notifications</h2>
                <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Control what you get notified about</p>
              </div>

              <div>
                <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">Campaigns</p>
                <Toggle label="Campaign Activated" description="When a campaign goes live" defaultChecked />
                <Toggle label="Campaign Completed" description="When a campaign finishes" defaultChecked />
                <Toggle label="Campaign Paused" description="When a campaign is paused" />
              </div>

              <div>
                <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">Leads</p>
                <Toggle label="New Leads Imported" description="When leads are added to the system" defaultChecked />
                <Toggle label="Lead Score Updated" description="When AI re-scores leads" />
              </div>

              <div>
                <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">System</p>
                <Toggle label="Data Sync Complete" description="When PMS sync finishes" defaultChecked />
                <Toggle label="SMS Delivery Reports" description="Delivery status updates" defaultChecked />
                <Toggle label="Security Alerts" description="Unusual login or access activity" defaultChecked />
              </div>

              <div className="flex justify-end pt-2">
                <SaveButton />
              </div>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="industrial-card p-8 space-y-6">
              <div>
                <h2 className="display-header text-xl italic">Security</h2>
                <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Manage your password and access</p>
              </div>

              <div className="space-y-6">
                <Field label="Current Password">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full h-10 border-b-2 border-neutral-100 bg-neutral-50 px-3 pr-10 text-sm font-bold italic focus:border-black transition-colors outline-none"
                    />
                    <button onClick={() => setShowPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="New Password">
                  <Input type="password" placeholder="••••••••" />
                </Field>
                <Field label="Confirm New Password">
                  <Input type="password" placeholder="••••••••" />
                </Field>
              </div>

              <div className="h-px bg-neutral-100" />

              <div>
                <p className="text-[9px] font-black italic uppercase text-neutral-400 tracking-widest mb-3">Sessions</p>
                <Toggle label="Two-Factor Authentication" description="Require OTP on login" />
                <Toggle label="Session Timeout" description="Auto logout after 30 minutes of inactivity" defaultChecked />
              </div>

              <div className="flex justify-end pt-2">
                <SaveButton />
              </div>
            </div>
          )}

          {/* Events */}
          {tab === 'events' && (
            <EventsSettingsPanel />
          )}

          {/* Danger Zone */}
          {tab === 'danger' && (
            <div className="industrial-card p-8 space-y-6 border-rose-200">
              <div>
                <h2 className="display-header text-xl italic text-rose-500">Danger Zone</h2>
                <p className="technical-label text-[9px] text-neutral-400 mt-0.5">Irreversible actions — proceed with caution</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Clear All Leads', desc: 'Permanently delete all leads from the database. This cannot be undone.', label: 'Clear Leads' },
                  { title: 'Reset Campaigns', desc: 'Delete all campaigns and their associated data and statistics.', label: 'Reset Campaigns' },
                  { title: 'Delete Hotel Account', desc: 'Permanently delete your hotel account and all associated data.', label: 'Delete Account' },
                ].map(action => (
                  <div key={action.title} className="flex items-center justify-between p-4 border border-rose-100 rounded-xl bg-rose-50/50">
                    <div>
                      <p className="text-sm font-black italic uppercase tracking-tight text-rose-600">{action.title}</p>
                      <p className="text-[10px] technical-label text-neutral-400 mt-0.5 max-w-xs">{action.desc}</p>
                    </div>
                    <button className="shrink-0 flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-500 rounded-xl text-xs font-black italic uppercase tracking-tight hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                      {action.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
