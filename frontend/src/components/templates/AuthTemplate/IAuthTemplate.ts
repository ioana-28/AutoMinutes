import { ReactNode } from 'react';

export interface IAuthTemplateProps {
  brandLabel: string;
  title: string;
  description: string;
  featureCards: ReactNode;
  formTitle: string;
  modeToggleSlot: ReactNode;
  formSlot: ReactNode;
  helperText?: ReactNode;
}
