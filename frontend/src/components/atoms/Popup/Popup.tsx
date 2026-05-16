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
      'flex min-h-[240px] w-full max-w-[420px] flex-col overflow-hidden rounded-xl border border-[#7f9d86]/30 bg-[#efebe2] shadow-[0_20px_50px_rgba(0,0,0,0.15)]',
    popover:
      'flex w-[260px] flex-col gap-3 overflow-hidden rounded-lg border border-[#7f9d86]/30 bg-[#efebe2] px-4 py-3 text-[#1f2937] shadow-[0_12px_28px_-16px_rgba(15,23,42,0.5)]',
    confirm:
      'flex min-h-[200px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl border border-[#7f9d86]/30 bg-[#efebe2] shadow-[0_20px_50px_rgba(0,0,0,0.15)]',
  };

  const confirmContentClasses =
    'flex flex-1 flex-col gap-4 text-[#1f2937] [&_h2]:m-0 [&_h2]:w-full [&_h2]:bg-[#cad2c5]/40 [&_h2]:px-5 [&_h2]:py-3 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-[#3d5f46] [&_p]:px-6 [&_p]:pt-2 [&_p]:text-sm [&_p]:font-medium [&_p]:text-center [&_[data-popup-actions]]:mt-auto [&_[data-popup-actions]]:flex [&_[data-popup-actions]]:justify-center [&_[data-popup-actions]]:gap-3 [&_[data-popup-actions]]:px-6 [&_[data-popup-actions]]:pb-6 [&_[data-popup-error]]:mx-6 [&_[data-popup-error]]:rounded-lg [&_[data-popup-error]]:border [&_[data-popup-error]]:border-[#b33a3a]/30 [&_[data-popup-error]]:bg-[#f4c7c7]/30 [&_[data-popup-error]]:px-3 [&_[data-popup-error]]:py-2 [&_[data-popup-error]]:text-xs [&_[data-popup-error]]:text-[#6b1f1f]';

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
        {variant === 'confirm' ? <div className={confirmContentClasses}>{children}</div> : children}
      </div>
    </div>
  );
};

export default Popup;
