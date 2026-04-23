import { FC } from 'react';
import '@atoms/CloseIconButton/CloseIconButton.css';
import { ICloseIconButtonProps } from './ICloseIconButton';

const CloseIconButton: FC<ICloseIconButtonProps> = ({
  onClick,
  ariaLabel = 'Close',
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    className="close-icon-button"
    onClick={onClick}
    aria-label={ariaLabel}
    {...rest}
  >
    <svg
      className="close-icon-button-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default CloseIconButton;
