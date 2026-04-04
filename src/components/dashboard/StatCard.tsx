'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'white' | 'black';
  active?: boolean;
  href?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon,
  variant = 'white',
  active = false,
  href
}: StatCardProps) {
  const card = (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "relative p-6 h-32 flex flex-col justify-between transition-all duration-200 rounded-[1px]",
        variant === 'white' ? "industrial-card" : "industrial-card-black",
        active && "ring-1 ring-accent-green"
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn(
          "technical-label leading-tight max-w-[70%]",
          variant === 'black' ? "text-neutral-400" : "text-neutral-500"
        )}>
          {label}
        </span>
        <Icon className={cn(
          "w-4 h-4",
          variant === 'black' ? "text-neutral-500" : "text-neutral-400"
        )} strokeWidth={2.5} />
      </div>

      <div className="flex items-baseline gap-2">
        <span className={cn(
          "display-header text-4xl",
          variant === 'black' ? "text-white" : "text-black"
        )}>
          {typeof value === 'string' && value.startsWith('#') ? (
            <>
              <span className="text-2xl opacity-50 mr-0.5">#</span>
              {value.substring(1)}
            </>
          ) : value}
        </span>
      </div>

      {active && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        </div>
      )}
      
      {/* Industrial accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] w-8",
        variant === 'black' ? "bg-accent-green" : "bg-neutral-200"
      )} />
    </motion.div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}
