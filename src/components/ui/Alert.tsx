'use client';

import React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className = '',
  variant = 'info',
  icon,
  children,
  ...props
}) => {
  const defaultIcons = {
    info: 'info',
    success: 'verified',
    warning: 'warning',
    error: 'error'
  };

  const currentIcon = icon || defaultIcons[variant];

  const variantClasses = {
    info: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-blue-200',
    success: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200',
    warning: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200',
    error: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
  }[variant];

  const iconClasses = {
    info: 'text-[#0051D5] dark:text-[#3B82F6]',
    success: 'text-[#16A34A] dark:text-[#10B981]',
    warning: 'text-[#D97706] dark:text-[#F59E0B]',
    error: 'text-[#DC2626] dark:text-[#EF4444]'
  }[variant];

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start gap-3 text-left ${variantClasses} ${className}`}
      {...props}
    >
      <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${iconClasses}`}>
        {currentIcon}
      </span>
      <div className="flex-1 flex flex-col gap-0.5 text-xs sm:text-sm">{children}</div>
    </div>
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <h4 className={`font-heading font-bold text-sm leading-tight ${className}`} {...props}>
      {children}
    </h4>
  );
};

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`text-xs opacity-90 leading-relaxed mt-0.5 ${className}`} {...props}>
      {children}
    </div>
  );
};
