import { ReactNode } from 'react';

export interface IAuthTemplateProps {
  logo: ReactNode;
  formTitle: string;
  modeToggleSlot: ReactNode;
  formSlot: ReactNode;
  helperText?: ReactNode;
}
