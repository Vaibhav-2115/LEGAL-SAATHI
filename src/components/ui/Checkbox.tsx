'use client';

import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, error, id, disabled, checked, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className={`flex items-start gap-3 text-left ${className}`}>
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* Accessible 22x22px checkbox container */}
          <div
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              if (input && !disabled) input.click();
            }}
            className={`w-[22px] h-[22px] rounded-md border-2 transition-all flex items-center justify-center cursor-pointer select-none ${
              disabled
                ? 'border-outline-variant/40 bg-surface-container-low dark:bg-[#161F30] cursor-not-allowed opacity-50'
                : 'border-[#CBD5E1] dark:border-[#334155] bg-surface-container-lowest dark:bg-[#161F30] hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2'
            } peer-checked:bg-[#1E3A8A] peer-checked:border-[#1E3A8A] dark:peer-checked:bg-[#3B82F6] dark:peer-checked:border-[#3B82F6]`}
          >
            <span className="material-symbols-outlined text-white text-[16px] font-black opacity-0 peer-checked:opacity-100 transition-opacity">
              check
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor={checkboxId}
            className={`text-sm font-semibold select-none cursor-pointer leading-tight ${
              disabled ? 'text-on-surface-variant/50 cursor-not-allowed' : 'text-on-surface'
            }`}
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-on-surface-variant mt-0.5 leading-normal">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs font-semibold text-error dark:text-rose-400 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
