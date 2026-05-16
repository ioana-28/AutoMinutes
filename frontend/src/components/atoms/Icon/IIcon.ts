import { SVGProps } from 'react';

export type IconName =
  | 'chevron-down'
  | 'chevron-up'
  | 'close'
  | 'filter'
  | 'info'
  | 'trash'
  | 'save'
  | 'edit'
  | 'file'
  | 'bolt'
  | 'back'
  | 'refresh'
  | 'user';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}
