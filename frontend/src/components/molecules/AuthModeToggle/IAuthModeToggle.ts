import { AuthMode } from '@organisms/AuthForm/AuthTypes';

export interface IAuthModeToggleProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}
