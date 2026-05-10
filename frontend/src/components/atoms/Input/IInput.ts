import { InputHTMLAttributes } from 'react';

export type InputVariant = 'text' | 'file' | 'date';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}
