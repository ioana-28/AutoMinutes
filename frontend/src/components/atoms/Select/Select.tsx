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
    'min-h-[42px] w-full rounded-lg border border-[#7f9d86] bg-[#efebe2] text-[#1f2937]';
  const variantClasses = {
    default:
      'px-3 py-[10px] text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] focus:ring-offset-1',
    compact:
      'px-3 py-[8px] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#a4c3b2] focus:ring-offset-1',
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
