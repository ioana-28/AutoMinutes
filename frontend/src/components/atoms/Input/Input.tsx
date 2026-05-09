import { forwardRef } from 'react';
import { InputProps } from './IInput';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', className = '', type, ...rest }, ref) => {
    const baseClasses =
      'min-h-[42px] w-full rounded-lg border border-[#7f9d86] bg-[#efebe2] text-[#1f2937]';
    const variantClasses = {
      text: 'px-3 py-[10px] text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] focus:ring-offset-1',
      file: 'p-[10px]',
    };
    const resolvedType = type ?? (variant === 'file' ? 'file' : 'text');

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
