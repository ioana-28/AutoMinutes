import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export type ButtonVariant = 'nav' | 'nav-active' | 'icon-close' | 'choose-file' | 'icon-ghost' | 'icon-delete' | 'text-summary';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
}
