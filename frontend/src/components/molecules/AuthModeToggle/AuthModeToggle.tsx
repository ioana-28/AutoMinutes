import { FC } from 'react';
import { IAuthModeToggleProps } from './IAuthModeToggle';

const AuthModeToggle: FC<IAuthModeToggleProps> = ({ mode, onModeChange }) => (
  <div className="flex gap-2 rounded-full bg-[#e9e0d3] p-1 text-xs">
    <button
      type="button"
      onClick={() => onModeChange('signin')}
      className={`rounded-full px-3 py-1 font-semibold transition-colors ${
        mode === 'signin'
          ? 'bg-[#1d3528] text-[#f6f2ea]'
          : 'text-[#355245] hover:text-[#1d3528]'
      }`}
    >
      Sign in
    </button>
    <button
      type="button"
      onClick={() => onModeChange('signup')}
      className={`rounded-full px-3 py-1 font-semibold transition-colors ${
        mode === 'signup'
          ? 'bg-[#1d3528] text-[#f6f2ea]'
          : 'text-[#355245] hover:text-[#1d3528]'
      }`}
    >
      Create
    </button>
  </div>
);

export default AuthModeToggle;
