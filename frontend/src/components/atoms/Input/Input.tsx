import { forwardRef } from 'react';
import { InputProps } from './IInput';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', className = '', type, icon, ...rest }, ref) => {
    const baseClasses =
      'w-full rounded-xl border border-[#386641]/10 bg-[#efebe2] text-[#1f2937] shadow-sm';
    const variantClasses = {
      text: `min-h-[34px] ${icon ? 'pl-10 pr-4' : 'px-4'} py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all`,
      file: 'min-h-[44px] p-2',
      date: `min-h-[34px] ${icon ? 'pl-10 pr-4' : 'px-4'} py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all`,
      compact: `min-h-[28px] ${icon ? 'pl-8 pr-3' : 'px-3'} py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] transition-all`,
    };
    const resolvedType =
      type ?? (variant === 'file' ? 'file' : variant === 'date' ? 'date' : 'text');

    return (
      <div className="relative flex w-full flex-col gap-2">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#386641]/60">
            {icon}
          </div>
        )}
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
