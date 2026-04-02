import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
