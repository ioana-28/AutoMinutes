import { FC } from 'react';
import { IQuickFilterGroupProps } from './IQuickFilterGroup';

const QuickFilterGroup: FC<IQuickFilterGroupProps> = ({
  activeFilter,
  onFilterChange,
  className = '',
}) => {
  const timeButtons = [
    { id: 'past', label: 'Past Due' },
    { id: '3days', label: 'Due in 3 days' },
    { id: '1week', label: 'Due in a week' },
    { id: 'later', label: 'Later' },
  ] as const;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {timeButtons.map((btn) => {
        const isActive = activeFilter === btn.id;
        return (
          <button
            key={btn.id}
            onClick={() => onFilterChange(isActive ? 'all' : btn.id)}
            className={`rounded-full border-[1.5px] px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
              isActive
                ? 'border-[#3d5f46] bg-[#3d5f46] text-[#f6f2ea] shadow-sm'
                : 'border-[#3d5f46]/20 bg-black/5 text-[#3d5f46] hover:border-[#3d5f46]/40 hover:bg-black/10'
            }`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilterGroup;
