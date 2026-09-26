'use client';

import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-bold text-on-surface select-none tracking-tight">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full p-3.5 rounded-xl border transition-all text-sm text-on-surface bg-surface-container-lowest dark:bg-[#161F30] placeholder:text-on-surface-variant/50 focus-civic disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed ${
            error
              ? 'border-error dark:border-rose-500 focus:ring-error'
              : 'border-outline-variant/50 dark:border-[#334155] hover:border-outline-variant'
          } ${className}`}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
