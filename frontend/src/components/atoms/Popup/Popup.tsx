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
        {children}
      </div>
    </div>
  );
};

export default Popup;
