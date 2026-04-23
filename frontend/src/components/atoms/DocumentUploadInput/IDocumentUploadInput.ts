import { ChangeEventHandler, InputHTMLAttributes } from 'react';

export interface IDocumentUploadInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onChange: ChangeEventHandler<HTMLInputElement>;
  id?: string;
  selectedFileName?: string;
}
