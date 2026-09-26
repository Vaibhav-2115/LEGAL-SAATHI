'use client';

import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  className = '',
  orientation = 'horizontal',
  label,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full bg-outline-variant/30 dark:bg-[#1E293B] ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={`relative flex items-center w-full my-4 select-none ${className}`} {...props}>
        <div className="flex-grow border-t border-outline-variant/30 dark:border-[#1E293B]" />
        <span className="flex-shrink mx-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-grow border-t border-outline-variant/30 dark:border-[#1E293B]" />
      </div>
    );
  }

  return (
    <hr
      className={`w-full border-t border-outline-variant/30 dark:border-[#1E293B] my-4 ${className}`}
      {...props}
    />
  );
};
