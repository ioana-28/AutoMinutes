export type StateMessageVariant = 'loading' | 'error' | 'placeholder';

export interface StateMessageProps {
  variant: StateMessageVariant;
  message: string;
}
