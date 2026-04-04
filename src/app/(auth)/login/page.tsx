'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { ApiError } from '@/lib/api/client';
import { loginSchema, type LoginFormData } from '@/lib/validation/auth';
import { cn } from '@/lib/utils';

const DEMO_INFO = {
  title: 'Demo Access',
  description: 'Use any email and password to authenticate',
  color: 'border-l-utopia',
};

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError('');
    try {
      await login(data);
      router.replace('/dashboard');
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex items-stretch gap-6 w-full max-w-3xl">

        {/* Login Card */}
        <div className="w-full max-w-md shrink-0 flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black italic text-2xl">U</div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">Utopia</h1>
              <p className="text-[10px] technical-label text-neutral-500">Enterprise Hotel Lead Generator</p>
            </div>
          </div>

          <div className="bg-white p-8 space-y-6 flex-1">
            <div>
              <h2 className="display-header text-2xl italic text-black">Access Portal</h2>
              <p className="technical-label text-neutral-400 mt-1">Authenticate to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="technical-label text-neutral-500">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@hotel.com"
                  className={cn(
                    "w-full bg-neutral-50 border py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400",
                    errors.email ? "border-rose-400" : "border-neutral-200"
                  )}
                />
                {errors.email && <p className="text-[10px] text-rose-500 font-bold italic">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="technical-label text-neutral-500">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full bg-neutral-50 border py-3 px-4 pr-10 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400",
                      errors.password ? "border-rose-400" : "border-neutral-200"
                    )}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-500 font-bold italic">{errors.password.message}</p>}
              </div>

              {serverError && (
                <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold italic">
                  {serverError}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" icon={LogIn} className="w-full mt-2" isLoading={isPending}>
                {isPending ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-[10px] technical-label text-neutral-400">
              No account?{' '}
              <Link href="/register" className="text-black font-black italic hover:underline uppercase">Register here</Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="w-56 shrink-0 flex flex-col">
          <div className="mb-12 h-12 flex items-center">
            <p className="text-[10px] technical-label text-neutral-600 uppercase">Demo Access</p>
          </div>
          <div className={cn("bg-neutral-900 border-l-4 p-4 flex flex-col gap-3 flex-1", DEMO_INFO.color)}>
            <div>
              <p className="text-xs font-black italic uppercase text-white tracking-tight">{DEMO_INFO.title}</p>
              <p className="text-[10px] technical-label text-neutral-400 mt-1 leading-relaxed">{DEMO_INFO.description}</p>
            </div>
            <div className="flex justify-end mt-auto">
              <button
                onClick={() => handleSubmit(onSubmit)()}
                className="text-[10px] font-black italic uppercase text-utopia hover:text-white transition-colors"
              >
                Continue to dashboard →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
