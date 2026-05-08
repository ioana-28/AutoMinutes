import { InputHTMLAttributes } from 'react';

export type InputVariant = 'text' | 'file';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}
