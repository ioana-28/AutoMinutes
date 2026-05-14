import { FC } from 'react';
import { IListRowProps } from './IListRow';

const ListRow: FC<IListRowProps> = ({
  leftSlot,
  rightSlot,
  variant = 'none',
  className = '',
  onClick,
}) => {
  const baseClasses = 'flex w-full items-center justify-between transition-colors';

  const variantClasses = {
    pill: 'rounded-full border-[2px] border-[#1e3522] bg-[#efebe2] px-5 py-1 hover:bg-[#e6e0d7] focus-within:ring-2 focus-within:ring-[#386641]/40',
    rounded:
      'rounded-[18px] border-[3px] border-[#1e3522] bg-[#efebe2] px-6 py-3 transition-colors',
    card: 'rounded-[10px] border px-3 py-1 text-left transition-colors',
    none: '',
  };

  const Component = onClick ? 'button' : 'div';
  const typeProps = onClick ? { type: 'button' as const } : {};

  return (
    <Component
      {...typeProps}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
    >
      <div className="flex min-w-0 items-center gap-4 flex-1">{leftSlot}</div>
      <div className="flex items-center gap-3">{rightSlot}</div>
    </Component>
  );
};

export default ListRow;
