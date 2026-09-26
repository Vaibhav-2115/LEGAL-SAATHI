'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'muted' | 'bareAct';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default:
        'bg-surface-container-lowest dark:bg-[#0F131C] border border-outline-variant/30 dark:border-[#1E293B] shadow-sm',
      elevated:
        'bg-surface-container-lowest dark:bg-[#161F30] border border-outline-variant/50 dark:border-[#334155] shadow-md',
      muted:
        'bg-surface-container-low dark:bg-[#161F30]/60 border border-outline-variant/20 dark:border-[#1E293B]',
      bareAct:
        'bg-[#F8FAFC] dark:bg-[#161F30]/80 border-l-4 border-l-[#1E3A8A] dark:border-l-[#6366F1] border border-outline-variant/30 dark:border-[#1E293B]'
    }[variant];

    return (
      <div
        ref={ref}
        className={`rounded-2xl transition-all duration-150 text-left ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`p-5 sm:p-6 pb-3 flex flex-col gap-1 border-b border-outline-variant/20 dark:border-[#1E293B]/60 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <h3
      className={`font-heading text-lg sm:text-xl font-bold text-on-surface leading-tight tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <p className={`text-xs sm:text-sm text-on-surface-variant leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return <div className={`p-5 sm:p-6 ${className}`} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`p-4 sm:p-5 pt-3 border-t border-outline-variant/20 dark:border-[#1E293B]/60 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
