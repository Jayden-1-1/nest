import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  PawPrint, 
  GraduationCap, 
  Users, 
  HeartPulse, 
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { TaskCategory, SchoolSubject } from '../../types/task';
import { useTranslation } from '../../locales';

interface CategoryBadgeProps {
  category: TaskCategory;
  schoolSubject?: SchoolSubject;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const CATEGORY_ICONS: Record<TaskCategory, LucideIcon> = {
  CHORES: Home,
  SHOPPING: ShoppingBag,
  PETS: PawPrint,
  SCHOOL: GraduationCap,
  FAMILY: Users,
  HEALTH: HeartPulse,
  OTHER: Sparkles,
};

export const CATEGORY_COLORS: Record<TaskCategory, { badge: string; text: string; bg: string; border: string }> = {
  CHORES: {
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  SHOPPING: {
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  PETS: {
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  SCHOOL: {
    badge: 'bg-primary/10 text-primary border-primary/25',
    text: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/25',
  },
  FAMILY: {
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  HEALTH: {
    badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
    text: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  OTHER: {
    badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  schoolSubject,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const Icon = CATEGORY_ICONS[category] || Sparkles;
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  const label = t.categories?.[category] || category;
  const subjectLabel = schoolSubject && t.schoolSubjects?.[schoolSubject] ? ` · ${t.schoolSubjects[schoolSubject]}` : '';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${colors.badge} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span className="truncate tracking-wide font-headline">
        {label}{subjectLabel}
      </span>
    </span>
  );
};
