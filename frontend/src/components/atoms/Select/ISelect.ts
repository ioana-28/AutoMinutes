import { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectVariant = 'default' | 'compact';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  variant?: SelectVariant;
}
