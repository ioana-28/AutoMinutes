import { forwardRef } from 'react';
import { InputProps } from './IInput';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', className = '', type, ...rest }, ref) => {
    const baseClasses =
      'w-full rounded-xl border border-[#386641]/10 bg-[#efebe2] text-[#1f2937] shadow-sm';
    const variantClasses = {
      text: 'min-h-[44px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all',
      file: 'min-h-[44px] p-2',
      date: 'min-h-[44px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all',
      compact:
        'min-h-[32px] px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all',
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
