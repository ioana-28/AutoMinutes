import { FC } from 'react';
import { PopupProps } from './IPopup';

const Popup: FC<PopupProps> = ({
  isOpen,
  titleId,
  variant = 'compact',
  overlayClassName,
  panelClassName,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  const containerClasses = {
    compact:
      'flex min-h-[240px] w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-[#24452a] bg-[#386641] shadow-[0_18px_40px_rgba(0,0,0,0.18)]',
    popover:
      'flex w-[260px] flex-col gap-3 overflow-hidden rounded-[14px] border border-[#7f9d86] bg-[#efebe2] px-4 py-3 text-[#1f2937] shadow-[0_12px_28px_-16px_rgba(15,23,42,0.5)]',
    confirm:
      'flex min-h-[240px] w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-[#24452a] bg-[#386641] shadow-[0_18px_40px_rgba(0,0,0,0.18)]',
  };

  const confirmContentClasses =
    'flex flex-1 flex-col gap-4 text-[#f1f5f9] [&_h2]:m-0 [&_h2]:w-full [&_h2]:bg-[#cad2c5] [&_h2]:px-4 [&_h2]:py-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-black [&_p]:px-5 [&_p]:text-lg [&_p]:font-semibold [&_p]:text-center [&_[data-popup-actions]]:mt-auto [&_[data-popup-actions]]:flex [&_[data-popup-actions]]:flex-wrap [&_[data-popup-actions]]:justify-center [&_[data-popup-actions]]:gap-3 [&_[data-popup-actions]]:px-5 [&_[data-popup-actions]]:pb-5 [&_[data-popup-error]]:mx-5 [&_[data-popup-error]]:rounded-lg [&_[data-popup-error]]:border [&_[data-popup-error]]:border-[#b33a3a] [&_[data-popup-error]]:bg-[#f4c7c7] [&_[data-popup-error]]:px-3 [&_[data-popup-error]]:py-2 [&_[data-popup-error]]:text-sm [&_[data-popup-error]]:text-[#6b1f1f] [&_[data-popup-danger]]:border-[#513030] [&_[data-popup-danger]]:bg-[#e0b7b7] [&_[data-popup-danger]]:text-[#2e1111] [&_[data-popup-danger]]:hover:bg-[#d8a9a9]';

  const overlayClasses = {
    compact: 'fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(6,17,7,0.5)] p-6',
    popover: 'absolute z-[120]',
    confirm: 'fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(6,17,7,0.5)] p-6',
  };

  return (
    <div
      className={`${overlayClasses[variant]} ${overlayClassName ?? ''}`.trim()}
      role="presentation"
    >
      <div
        className={`${containerClasses[variant]} ${panelClassName ?? ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {variant === 'confirm' ? (
          <div className={confirmContentClasses}>{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Popup;
