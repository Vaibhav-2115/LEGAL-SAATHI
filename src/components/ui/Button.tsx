'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base classes adhering to Stitch Civic Trust & Clarity
    const baseClasses =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 select-none cursor-pointer focus-civic disabled:cursor-not-allowed disabled:opacity-50';

    // Variant classes
    const variantClasses = {
      primary:
        'bg-[#1E3A8A] text-white hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] shadow-sm active:scale-[0.99]',
      secondary:
        'bg-surface-container-low dark:bg-[#161F30] text-on-surface border border-outline-variant/40 dark:border-[#334155] hover:bg-surface-container dark:hover:bg-[#1E293B]',
      outline:
        'border-2 border-outline-variant/60 dark:border-[#334155] bg-transparent text-on-surface hover:bg-surface-container-low dark:hover:bg-[#161F30]',
      ghost:
        'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-[#161F30]',
      destructive:
        'bg-[#FEE2E2] dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-300 border border-rose-300/40 hover:bg-[#DC2626] hover:text-white dark:hover:bg-[#DC2626] dark:hover:text-white',
      link:
        'text-primary dark:text-[#3B82F6] underline-offset-4 hover:underline p-0 h-auto font-semibold'
    }[variant];

    // Size classes (ensuring accessible minimum touch heights)
    const sizeClasses = {
      sm: 'h-9 px-3 text-xs gap-1.5',
      default: 'h-11 px-5 text-sm gap-2',
      lg: 'h-12 px-7 text-base gap-2.5',
      icon: 'h-10 w-10 p-0 shrink-0'
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin text-sm leading-none mr-1.5">
            progress_activity
          </span>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
