export type StateMessageVariant = 'loading' | 'error' | 'placeholder' | "info";

export interface StateMessageProps {
  variant: StateMessageVariant;
  message: string;
}
