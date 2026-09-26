'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'precedent' | 'neutral';
  size?: 'sm' | 'default';
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  icon,
  children,
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  const variantClasses = {
    default:
      'bg-primary/10 text-primary dark:text-primary-fixed border border-primary/25',
    secondary:
      'bg-secondary/10 text-secondary dark:text-secondary-fixed border border-secondary/25',
    success:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/50',
    warning:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/50',
    destructive:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40 dark:border-rose-800/50',
    precedent:
      'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300/40 dark:border-indigo-800/50',
    neutral:
      'bg-surface-container-low dark:bg-[#161F30] text-on-surface-variant border border-outline-variant/30'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[13px] leading-none shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
