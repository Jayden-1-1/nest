import React from 'react';
import { TaskStatus } from '../../types/task';
import { useTranslation } from '../../locales';

interface StatusPillProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  variant?: 'pill' | 'ghost';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  variant = 'pill',
  className = '',
}) => {
  const { t } = useTranslation();

  const isSmall = size === 'sm';
  const label = t.statuses[status];

  if (variant === 'ghost') {
    switch (status) {
      case 'TODO':
        return (
          <span className={`inline-flex items-center gap-1.5 font-caption font-medium text-secondary ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E9B92]" />
            <span className="text-[12px]">{label}</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className={`inline-flex items-center gap-1.5 font-caption font-semibold text-primary ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[12px]">{label}</span>
          </span>
        );
      case 'DONE':
        return (
          <span className={`inline-flex items-center gap-1.5 font-caption font-medium text-emerald-700 dark:text-emerald-400 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-[12px]">{label}</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className={`inline-flex items-center gap-1.5 font-caption font-semibold text-error ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="text-[12px]">{label}</span>
          </span>
        );
      case 'NEEDS_REVISION':
        return (
          <span className={`inline-flex items-center gap-1.5 font-caption font-medium text-amber-700 dark:text-amber-400 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[12px]">{label}</span>
          </span>
        );
    }
  }

  // Standard Pill
  switch (status) {
    case 'TODO':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] font-caption font-medium uppercase tracking-wider
            bg-[#F5F3EF] dark:bg-[#1E2028] text-[#121316] dark:text-[#E8E5DD] border border-[#DCD7CB] dark:border-[#2E303A]
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E9B92]" />
          {label}
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] font-caption font-semibold uppercase tracking-wider
            bg-[#EEF3FF] dark:bg-[#111A30] text-[#0A3ED9] dark:text-[#6CA0FF] border border-[#C5D7FF] dark:border-[#1D3261]
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4CFF] animate-pulse" />
          {label}
        </span>
      );
    case 'DONE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] font-caption font-semibold uppercase tracking-wider
            bg-[#F0F4F1] dark:bg-[#122119] text-[#1B432C] dark:text-[#79C998] border border-[#C8DBCF] dark:border-[#1E3E2D]
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <svg className="w-2.5 h-2.5 text-[#225939] dark:text-[#79C998]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 12 12">
            <polyline points="2 6 5 9 10 3" />
          </svg>
          {label}
        </span>
      );
    case 'OVERDUE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] font-caption font-semibold uppercase tracking-wider
            bg-[#FDF2F2] dark:bg-[#261214] text-[#B91C1C] dark:text-[#F87171] border border-[#FACDCD] dark:border-[#4C1D24]
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
          {label}
        </span>
      );
    case 'NEEDS_REVISION':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] font-caption font-semibold uppercase tracking-wider
            bg-[#FEF8EE] dark:bg-[#261A0C] text-[#92400E] dark:text-[#FBBF24] border border-[#F8DFB5] dark:border-[#4D3414]
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          {label}
        </span>
      );
  }
};
