'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, helperText, error, options, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-on-surface select-none tracking-tight">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full h-12 px-4 pr-10 rounded-xl border appearance-none transition-all text-sm text-on-surface bg-surface-container-lowest dark:bg-[#161F30] focus-civic disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-error dark:border-rose-500 focus:ring-error'
                : 'border-outline-variant/50 dark:border-[#334155] hover:border-outline-variant'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="material-symbols-outlined pointer-events-none absolute right-3.5 text-on-surface-variant text-base">
            expand_more
          </span>
        </div>

        {error ? (
          <p id={errorId} className="text-xs font-semibold text-error dark:text-rose-400 flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-xs">error</span>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-on-surface-variant mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
