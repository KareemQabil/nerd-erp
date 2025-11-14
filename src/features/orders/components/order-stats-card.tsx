import React from 'react';
import { LucideIcon } from 'lucide-react';

interface OrderStatsCardProps {
  title: string;
  titleEn: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function OrderStatsCard({ 
  title, 
  titleEn, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  trend 
}: OrderStatsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`text-sm font-inter ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[var(--on-surface-variant)]">{title}</p>
        <p className="font-inter">{value}</p>
      </div>
    </div>
  );
}
