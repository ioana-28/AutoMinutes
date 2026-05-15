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
    pill: 'rounded-full border border-[#1e3522]/30 bg-transparent px-4 py-0.5 hover:bg-black/5',
    rounded:
      'rounded-lg border border-[#1e3522]/30 bg-transparent px-4 py-1 transition-colors',
    card: 'rounded-md border border-[#1e3522]/20 px-2 py-0.5 text-left transition-colors',
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
