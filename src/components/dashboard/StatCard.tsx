'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendLabel, 
  icon: Icon, 
  iconColor, 
  iconBg 
}: StatCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      className="utopia-card p-6 flex flex-col gap-4 group"
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          iconBg
        )}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-colors",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 tracking-tight">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
          {trendLabel && (
            <span className="text-xs text-gray-400 font-medium">{trendLabel}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
