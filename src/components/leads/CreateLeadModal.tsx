'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useCreateLead } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import type { LeadSource, ConsentStatus } from '@/types';

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  country: z.string().min(2, 'Required'),
  language: z.string().min(1),
  source: z.enum(['pms', 'csv', 'meta_ads', 'data_broker', 'manual']),
  consent_status: z.enum(['opted_in', 'opted_out', 'pending']),
});

type FormData = z.infer<typeof schema>;

interface CreateLeadModalProps {
  onClose: () => void;
}

const inputClass = (hasError: boolean) => cn(
  'w-full bg-neutral-50 border py-2.5 px-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-neutral-400',
  hasError ? 'border-rose-400' : 'border-neutral-200'
);

export function CreateLeadModal({ onClose }: CreateLeadModalProps) {
  const { mutateAsync: createLead, isPending } = useCreateLead();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: 'en', source: 'manual', consent_status: 'pending' },
  });

  async function onSubmit(data: FormData) {
    await createLead({
      ...data,
      email: data.email || undefined,
      source: data.source as LeadSource,
      consent_status: data.consent_status as ConsentStatus,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="display-header text-xl italic">New Lead</h2>
            <p className="technical-label text-neutral-400 mt-0.5">Manual entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">First Name</label>
              <input {...register('first_name')} placeholder="Almaz" className={inputClass(!!errors.first_name)} />
              {errors.first_name && <p className="text-[10px] text-rose-500 font-bold italic">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">Last Name</label>
              <input {...register('last_name')} placeholder="Belay" className={inputClass(!!errors.last_name)} />
              {errors.last_name && <p className="text-[10px] text-rose-500 font-bold italic">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="technical-label text-neutral-500">Phone (E.164)</label>
            <input {...register('phone')} placeholder="+251911234567" className={inputClass(!!errors.phone)} />
            {errors.phone && <p className="text-[10px] text-rose-500 font-bold italic">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="technical-label text-neutral-500">Email (optional)</label>
            <input {...register('email')} type="email" placeholder="guest@hotel.com" className={inputClass(!!errors.email)} />
            {errors.email && <p className="text-[10px] text-rose-500 font-bold italic">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">Country (ISO)</label>
              <input {...register('country')} placeholder="ET" className={inputClass(!!errors.country)} />
              {errors.country && <p className="text-[10px] text-rose-500 font-bold italic">{errors.country.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">Language</label>
              <select {...register('language')} className={inputClass(false)}>
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">Source</label>
              <select {...register('source')} className={inputClass(!!errors.source)}>
                <option value="manual">Manual</option>
                <option value="pms">PMS</option>
                <option value="csv">CSV</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="data_broker">Data Broker</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="technical-label text-neutral-500">Consent</label>
              <select {...register('consent_status')} className={inputClass(!!errors.consent_status)}>
                <option value="pending">Pending</option>
                <option value="opted_in">Opted In</option>
                <option value="opted_out">Opted Out</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
            <Button type="button" variant="outline" size="md" onClick={onClose} className="bg-white">Cancel</Button>
            <Button type="submit" variant="primary" size="md" isLoading={isPending}>
              {isPending ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
