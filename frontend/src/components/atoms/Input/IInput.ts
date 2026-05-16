import { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'text' | 'file' | 'date' | 'compact';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  icon?: ReactNode;
}
