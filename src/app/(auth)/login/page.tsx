'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
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
            <h2 className="display-header text-2xl italic text-black">Access Portal</h2>
            <p className="technical-label text-neutral-400 mt-1">Authenticate to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@hotel.com"
                className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 py-3 px-4 pr-10 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold italic">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" icon={LogIn} className="w-full mt-2" isLoading={isPending}>
              {isPending ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-[10px] technical-label text-neutral-400">
            No account?{' '}
            <Link href="/register" className="text-black font-black italic hover:underline uppercase">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
