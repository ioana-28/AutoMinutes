import { FC } from 'react';
import { SelectProps } from './ISelect';

const Select: FC<SelectProps> = ({
  options,
  placeholder,
  variant = 'default',
  className = '',
  ...rest
}) => {
  const baseClasses =
    'min-h-[34px] w-full rounded-md border border-[#7f9d86]/40 bg-[#efebe2] text-[#1f2937]';
  const variantClasses = {
    default:
      'px-1.5 py-0.5 sm:px-3 sm:py-1 text-[0.75rem] sm:text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-[#386641] transition-shadow',
    compact:
      'min-h-[24px] sm:min-h-[28px] px-1 sm:px-2 py-0 sm:py-0.5 text-[0.7rem] sm:text-[0.85rem] focus:outline-none focus:ring-1 focus:ring-[#386641] transition-shadow',
  };

  return (
    <select className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()} {...rest}>
      {placeholder ? (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
