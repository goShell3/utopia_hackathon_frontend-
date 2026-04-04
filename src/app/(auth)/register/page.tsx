'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { ApiError } from '@/lib/api/client';
import { registerSchema, type RegisterFormData } from '@/lib/validation/auth';
import { cn } from '@/lib/utils';

const ROLES = ['owner', 'manager', 'staff'] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  const isPending = isRegistering || isLoggingIn;

  const { register: field, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'staff' },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError('');
    try {
      await register({ full_name: data.full_name, email: data.email, password: data.password, hotel_id: data.hotel_id, role: data.role });
      await login({ email: data.email, password: data.password });
      router.replace('/');
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    }
  }

  const inputClass = (hasError: boolean) => cn(
    "w-full bg-neutral-50 border py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400",
    hasError ? "border-rose-400" : "border-neutral-200"
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black italic text-2xl">U</div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">Utopia</h1>
            <p className="text-[10px] technical-label text-neutral-500">Enterprise Hotel CRM</p>
          </div>
        </div>

        <div className="bg-white p-8 space-y-6">
          <div>
            <h2 className="display-header text-2xl italic text-black">Create Account</h2>
            <p className="technical-label text-neutral-400 mt-1">Register your hotel workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Full Name</label>
              <input {...field('full_name')} type="text" placeholder="John Doe" className={inputClass(!!errors.full_name)} />
              {errors.full_name && <p className="text-[10px] text-rose-500 font-bold italic">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Email Address</label>
              <input {...field('email')} type="email" autoComplete="email" placeholder="you@hotel.com" className={inputClass(!!errors.email)} />
              {errors.email && <p className="text-[10px] text-rose-500 font-bold italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Password</label>
              <div className="relative">
                <input {...field('password')} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className={cn(inputClass(!!errors.password), "pr-10")} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 font-bold italic">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Confirm Password</label>
              <div className="relative">
                <input {...field('confirm_password')} type={showConfirm ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" className={cn(inputClass(!!errors.confirm_password), "pr-10")} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-[10px] text-rose-500 font-bold italic">{errors.confirm_password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Hotel ID</label>
              <input {...field('hotel_id')} type="text" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className={inputClass(!!errors.hotel_id)} />
              {errors.hotel_id && <p className="text-[10px] text-rose-500 font-bold italic">{errors.hotel_id.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="technical-label text-neutral-500">Role</label>
              <select {...field('role')} className={cn(inputClass(!!errors.role), "uppercase")}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-[10px] text-rose-500 font-bold italic">{errors.role.message}</p>}
            </div>

            {serverError && (
              <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold italic">{serverError}</div>
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
