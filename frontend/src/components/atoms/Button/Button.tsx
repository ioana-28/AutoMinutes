import { FC } from 'react';
import { ButtonProps } from './IButton';

const Button: FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'nav',
  className = '',
  type = 'button',
  ...rest
}) => {
  const hasIconAndLabel = Boolean(icon && label);
  const baseClasses = `inline-flex items-center justify-center transition-colors ${
    hasIconAndLabel ? 'gap-2' : ''
  }`;

  const variantClasses: Record<string, string> = {
    nav: 'rounded-lg border border-[#d1d5db] bg-[#a4c3b2] px-[14px] py-[10px] text-[0.95rem] font-semibold text-black hover:border-[#668c75] hover:bg-[#cbebd8]',
    'nav-active':
      'rounded-lg border border-[#668c75] bg-[#73ab8e] px-[14px] py-[10px] text-[0.95rem] font-semibold text-[#122617] hover:bg-[#73ab8e] hover:border-[#668c75]',
    'icon-close':
      'h-10 w-10 rounded-[20%] bg-transparent text-[#faaaaa] hover:bg-[#436E4C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'choose-file':
      'rounded-lg border border-[#d1d5db] bg-[#efebe2] px-[14px] py-[10px] text-[0.95rem] font-semibold text-black hover:border-[#668c75] hover:bg-[#E6E0DA]',
    'icon-ghost':
      'h-10 w-10 rounded-full border border-[#7f9d86] bg-[#efebe2] text-[#1f2937] hover:bg-[#e6e0da] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'icon-delete':
       'h-10 w-10 rounded-full border border-[#7f9d86] bg-[#faaaaa] text-[#1f2937] hover:bg-[#FF99AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'text-summary':
     'rounded-lg border-[#d1d5db] bg-[#efebe2] px-[30px] py-[20px] text-[0.95rem] font-medium text-[#386641]   hover:text-[#274c35] hover:bg-[#e6e0da] focus-visible:outline-[#386641] focus-visible:outline-offset-2',
       
     
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      {icon ? <span className="inline-flex items-center justify-center">{icon}</span> : null}
      {label ? <span>{label}</span> : null}
    </button>
  );
};

export default Button;
