import React from 'react';
import { CaseStatus } from '../lib/types';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'VERIFICATION':
        return {
          bg: 'bg-[#FEF3C7] dark:bg-amber-950/40',
          text: 'text-[#D97706] dark:text-amber-400',
          dot: 'bg-[#D97706]',
          icon: 'schedule'
        };
      case 'UNDERSTANDING':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-300',
          dot: 'bg-blue-600',
          icon: 'psychology'
        };
      case 'ACTION REQUIRED':
        return {
          bg: 'bg-red-100 dark:bg-red-950/40',
          text: 'text-red-700 dark:text-red-400',
          dot: 'bg-red-600',
          icon: 'warning'
        };
      case 'READY FOR ACTION':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-600',
          icon: 'check_circle'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-slate-100 dark:bg-[#161F30]',
          text: 'text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-500',
          icon: 'task_alt'
        };
      case 'SUBMITTED':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-950/40',
          text: 'text-indigo-700 dark:text-indigo-300',
          dot: 'bg-indigo-600',
          icon: 'send'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          dot: 'bg-gray-500',
          icon: 'radio_button_unchecked'
        };
    }
  };

  const style = getStatusStyles();
  const padding =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider ${padding} ${style.bg} ${style.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span className="material-symbols-outlined text-[14px] leading-none">{style.icon}</span>
      <span>{status}</span>
    </span>
  );
};
