import { FC } from 'react';
import { IAuthModeToggleProps } from './IAuthModeToggle';

const AuthModeToggle: FC<IAuthModeToggleProps> = ({ mode, onModeChange }) => (
  <div className="flex gap-1 rounded-xl bg-[#386641]/5 p-1 text-[10px]">
    <button
      type="button"
      onClick={() => onModeChange('signin')}
      className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
        mode === 'signin'
          ? 'bg-[#386641] text-[#a4c3b2] shadow-sm'
          : 'text-[#386641]/60 hover:bg-[#386641]/10 hover:text-[#386641]'
      }`}
    >
      Sign in
    </button>
    <button
      type="button"
      onClick={() => onModeChange('signup')}
      className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
        mode === 'signup'
          ? 'bg-[#386641] text-[#a4c3b2] shadow-sm'
          : 'text-[#386641]/60 hover:bg-[#386641]/10 hover:text-[#386641]'
      }`}
    >
      Sign up
    </button>
  </div>
);

export default AuthModeToggle;
