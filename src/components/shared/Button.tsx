'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className, 
  isLoading,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-black text-white hover:bg-neutral-800 border-black',
    secondary: 'bg-white text-black hover:bg-neutral-50 border-neutral-200',
    outline: 'bg-transparent border border-black text-black hover:bg-neutral-50',
    danger: 'bg-white border-red-200 text-red-500 hover:bg-red-50',
    ghost: 'bg-transparent text-neutral-500 hover:text-black border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] gap-1.5 tracking-wider',
    md: 'px-6 py-2.5 text-xs gap-2 tracking-widest',
    lg: 'px-8 py-3.5 text-sm gap-3 tracking-[0.2em]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center font-black italic uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-[1.5px] rounded-[1px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn('w-4 h-4', size === 'lg' && 'w-5 h-5')} strokeWidth={2.5} />}
      <span className="relative z-10">{children}</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-[inherit]">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* Subtle industrial inner shadow for black variant */}
      {variant === 'primary' && (
        <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none rounded-[inherit]" />
      )}
    </motion.button>
  );
}
