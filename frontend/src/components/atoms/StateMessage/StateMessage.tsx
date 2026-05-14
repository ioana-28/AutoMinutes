import { FC } from 'react';
import { StateMessageProps, StateMessageVariant } from './IStateMessage';

const getVariantClasses = (variant: StateMessageVariant) => {
  switch (variant) {
    case 'loading':
    case 'placeholder':
      return 'rounded-2xl border border-dashed border-border-muted bg-surface p-10 text-center text-text-primary';
    case 'error':
      return 'rounded-2xl border border-danger-border bg-danger-bg p-6 text-center text-danger-text';
    case 'info':
      return 'rounded-2xl border border-info-border bg-info-bg p-6 text-center text-info-text';
    default:
      return 'rounded-2xl border border-dashed border-border-muted bg-surface p-10 text-center text-text-primary';
  }
};

const StateMessage: FC<StateMessageProps> = ({ variant, message }) => (
  <div className={getVariantClasses(variant)}>{message}</div>
);

export default StateMessage;
