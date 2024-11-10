'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const Input = ({
  label,
  prefix,
  suffix,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-gray-400 text-sm">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          {...props}
          className={`w-full bg-[#252525] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            prefix ? 'pl-6' : ''
          } ${suffix ? 'pr-6' : ''} ${className}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};