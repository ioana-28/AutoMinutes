import { FC } from 'react';
import Input from '@atoms/Input/Input';
import { IAuthFormProps } from './IAuthForm';

const AuthForm: FC<IAuthFormProps> = ({
  mode,
  email,
  password,
  fullName,
  error,
  isSubmitting,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onFullNameChange,
}) => (
  <form className="mt-8 space-y-5" onSubmit={onSubmit}>
    {mode === 'signup' ? (
      <div>
        <label className="text-xs font-semibold text-[#4a6c5b]">Full name</label>
        <Input
          className="mt-2"
          placeholder="Your name"
          value={fullName}
          autoComplete="off"
          onChange={(event) => onFullNameChange(event.target.value)}
        />
      </div>
    ) : null}

    <div>
      <label className="text-xs font-semibold text-[#4a6c5b]">Email address</label>
      <Input
        className="mt-2"
        placeholder="Your email"
        type="email"
        value={email}
        autoComplete="off"
        onChange={(event) => onEmailChange(event.target.value)}
      />
    </div>

    <div>
      <label className="text-xs font-semibold text-[#4a6c5b]">Password</label>
      <Input
        className="mt-2"
        placeholder="Your password"
        type="password"
        value={password}
        autoComplete="off"
        onChange={(event) => onPasswordChange(event.target.value)}
      />
    </div>

    {error ? (
      <p className="rounded-xl border border-[#e7c8aa] bg-[#faaaaa] px-4 py-3 text-sm text-[#9b3d1f]">
        {error}
      </p>
    ) : null}

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full rounded-2xl bg-[#386641] px-4 py-4 text-sm font-bold text-[#a4c3b2] shadow-sm transition-all hover:bg-[#2f5737] hover:shadow-md active:scale-[0.98] ${
        isSubmitting ? 'cursor-not-allowed opacity-70 active:scale-100' : ''
      }`}
    >
      {isSubmitting ? 'Authenticating...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
    </button>
  </form>
);

export default AuthForm;
