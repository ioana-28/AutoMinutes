import { FormEvent } from 'react';
import { AuthMode } from './AuthTypes';

export interface IAuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  fullName: string;
  error: string;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
}
