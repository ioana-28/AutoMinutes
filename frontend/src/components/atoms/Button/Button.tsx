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
    nav: 'rounded-xl border border-transparent px-[15px] py-[5px] text-[0.80rem] text-white font-semibold  hover:text-[#cbebd8]',
    'nav-active':
      'rounded-lg border border-transparent  px-[10px] py-[5px] text-[0.80rem] font-semibold text-[#cbebd8] underline underline-offset-4 decoration-0.9 decoration-[#cbebd8]',
    'icon-close':
      'h-10 w-10 rounded-[20%] bg-transparent text-[#faaaaa] hover:bg-[#436E4C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'choose-file':
      'rounded-lg border border-[#d1d5db] bg-[#efebe2] px-[14px] py-[10px] text-[0.95rem] font-semibold text-black hover:border-[#668c75] hover:bg-[#E6E0DA]',
    'icon-ghost':
      'h-10 w-10 rounded-full border border-[#7f9d86] bg-[#efebe2] text-[#1f2937] hover:bg-[#e6e0da] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'icon-delete':
       'h-10 w-10 rounded-full border border-[#7f9d86] bg-[#faaaaa] text-[#1f2937] hover:bg-[#FF99AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'add':
      'h-10 w-10 rounded-full border border-[#7f9d86] bg-[#efebe2] text-[#2d6a4f] hover:bg-[#e6e0da] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641] focus-visible:outline-offset-2',
    'text-summary':
      'w-[200px] whitespace-nowrap rounded-lg border border-[#d1d5db] bg-[#efebe2] py-[40px] text-[1.40rem] text-[#386641] hover:text-[#274c35] hover:bg-[#e6e0da] focus-visible:outline focus-visible:outline-[#386641] focus-visible:outline-offset-2',
       
     
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
