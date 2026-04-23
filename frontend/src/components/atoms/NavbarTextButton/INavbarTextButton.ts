import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export interface INavbarTextButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
