import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export interface ICloseIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
}
