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
    nav: 'rounded-md border border-transparent px-3 py-1.5 text-xs text-white/90 font-medium hover:text-[#a4c3b2]  focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50',
    'nav-active':
      'rounded-md border border-transparent px-3 py-1.5 text-xs font-semibold text-[#a4c3b2] underline decoration-0.9 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50',
    'icon-close':
      'h-8 w-8 rounded-md bg-transparent text-[#faaaaa] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    'choose-file':
      'rounded-lg border border-[#d1d5db] bg-[#efebe2] px-[12px] py-[6px] text-[0.9rem] font-semibold text-black hover:border-[#668c75] hover:bg-[#E6E0DA]',
    'icon-ghost':
      'h-8 w-8 rounded-md text-[#1f2937] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    'icon-delete':
      'h-8 w-8 rounded-md text-[#d64545] hover:bg-[#faaaaa]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    add: 'h-8 w-8 rounded-md text-[#2d6a4f] hover:bg-[#2d6a4f]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    'generate-summary':
      'rounded-md border border-[#2d6a4f] bg-[#2d6a4f] px-3 py-1.5 text-xs font-semibold text-[#f6f1e8] shadow-[0_10px_18px_-14px_rgba(45,106,79,0.85)] hover:bg-[#245840] hover:border-[#245840] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    reprocess:
      'rounded-md border border-[#7f9d86] bg-[#a4c3b2] px-2 py-1.5 text-xs font-semibold text-[#1f2937] hover:bg-[#8eb09e] hover:border-[#8eb09e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#386641]',
    'text-summary':
      'w-[200px] whitespace-nowrap rounded-lg border border-[#7f9d86]/30 bg-white/40 py-[30px] text-[1.2rem] text-[#386641] hover:bg-white/60 focus-visible:outline focus-visible:outline-[#386641]',
    link: 'px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#386641] hover:text-[#2d6a4f] hover:underline decoration-2 underline-offset-4 transition-all',
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
