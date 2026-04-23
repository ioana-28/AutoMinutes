import { ChangeEventHandler, InputHTMLAttributes } from 'react';

export interface IMeetingTitleInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id?: string;
  label?: string;
}
