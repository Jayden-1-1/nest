import React from 'react';
import { TaskPriority } from '../../types/task';
import { useTranslation } from '../../locales';

interface PriorityTagProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
  className?: string;
}

export const PriorityTag: React.FC<PriorityTagProps> = ({
  priority,
  size = 'md',
  className = '',
}) => {
  const { t } = useTranslation();
  const label = t.priorities[priority];
  const isSmall = size === 'sm';

  switch (priority) {
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] bg-surface-container text-on-surface-variant font-caption font-medium border border-surface-container-high
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-2.5 bg-outline rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-outline-variant/40 rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-outline-variant/40 rounded-[0.5px]" />
          </span>
          <span className="uppercase tracking-wider">{label}</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] bg-surface-container-high text-on-surface font-caption font-medium border border-outline-variant
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-2.5 bg-on-surface rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-on-surface rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-outline-variant/40 rounded-[0.5px]" />
          </span>
          <span className="uppercase tracking-wider">{label}</span>
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-[3px] bg-on-surface text-surface font-caption font-semibold tracking-wider
            ${isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'} ${className}`}
        >
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-2.5 bg-primary-fixed rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-primary-fixed rounded-[0.5px]" />
            <span className="w-1 h-2.5 bg-primary-fixed rounded-[0.5px]" />
          </span>
          <span className="uppercase tracking-wider text-error dark:text-red-400 font-bold">||| {label}</span>
        </span>
      );
  }
};
