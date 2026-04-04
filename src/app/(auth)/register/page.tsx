'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { ApiError } from '@/lib/api/client';
import type { Role } from '@/types';

const ROLES: Role[] = ['owner', 'manager', 'staff'];

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const [form, setForm] = useState({ full_name: '', email: '', password: '', hotel_id: '', role: 'staff' as Role });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isPending = isRegistering || isLoggingIn;

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black italic text-2xl">U</div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">Utopia</h1>
            <p className="text-[10px] technical-label text-neutral-500">Enterprise Hotel CRM</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 space-y-6">
          <div>
            <h2 className="display-header text-2xl italic text-black">Create Account</h2>
            <p className="technical-label text-neutral-400 mt-1">Register your hotel workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Full Name</label>
              <input type="text" value={form.full_name} onChange={e => set('full_name', e.target.value)} required placeholder="John Doe"
                className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400" />
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Email Address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" placeholder="you@hotel.com"
                className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400" />
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required autoComplete="new-password" placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 pr-10 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Hotel ID</label>
              <input type="text" value={form.hotel_id} onChange={e => set('hotel_id', e.target.value)} required placeholder="uuid of your hotel"
                className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400" />
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black uppercase">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {error && (
              <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold italic">{error}</div>
            )}

            <Button type="submit" variant="primary" size="lg" icon={UserPlus} className="w-full mt-2" isLoading={isPending}>
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-[10px] technical-label text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-black italic hover:underline uppercase">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
