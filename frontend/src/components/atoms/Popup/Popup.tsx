import { FC } from 'react';
import { PopupProps } from './IPopup';

const Popup: FC<PopupProps> = ({ isOpen, titleId, variant = 'compact', children }) => {
  if (!isOpen) {
    return null;
  }

  const containerClasses = {
    compact:
      'flex min-h-[240px] w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-[#24452a] bg-[#386641] shadow-[0_18px_40px_rgba(0,0,0,0.18)]',
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(6,17,7,0.5)] p-6"
      role="presentation"
    >
      <div
        className={containerClasses[variant]}
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
