import { ChangeEvent } from 'react';
import clsx from 'clsx';

interface InputProps {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  lastValue?: string | number;
  className?: string;
}

export const Input = ({
  value,
  onChange,
  placeholder,
  label,
  lastValue,
  className,
}: InputProps) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
      )}
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "w-full px-4 py-2 bg-[#1E1E1E] text-white rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "placeholder-gray-500 text-lg",
          className
        )}
      />
      {lastValue && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          @{lastValue}
        </span>
      )}
    </div>
  );
};