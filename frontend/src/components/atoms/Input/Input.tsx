import { forwardRef } from 'react';
import { InputProps } from './IInput';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', className = '', type, ...rest }, ref) => {
    const baseClasses = 'w-full rounded-md border border-[#7f9d86]/40 bg-[#efebe2] text-[#1f2937]';
    const variantClasses = {
      text: 'min-h-[36px] px-3 py-[6px] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-[#386641] transition-shadow',
      file: 'min-h-[36px] p-[6px]',
      date: 'min-h-[36px] px-3 py-[4px] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-[#386641] transition-shadow',
      compact:
        'min-h-[28px] px-2 py-[2px] text-xs focus:outline-none focus:ring-1 focus:ring-[#386641] transition-shadow',
    };
    const resolvedType =
      type ?? (variant === 'file' ? 'file' : variant === 'date' ? 'date' : 'text');

    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          type={resolvedType}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
