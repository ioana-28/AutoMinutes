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
        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4a6c5b]">
          Full name
        </label>
        <Input
          className="mt-2"
          placeholder="Ada Lovelace"
          value={fullName}
          onChange={(event) => onFullNameChange(event.target.value)}
        />
      </div>
    ) : null}

    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4a6c5b]">
        Email address
      </label>
      <Input
        className="mt-2"
        placeholder="you@company.com"
        type="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
      />
    </div>

    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4a6c5b]">
        Password
      </label>
      <Input
        className="mt-2"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
      />
    </div>

    {error ? (
      <p className="rounded-xl border border-[#e7c8aa] bg-[#f8e7d2] px-4 py-3 text-sm text-[#9b3d1f]">
        {error}
      </p>
    ) : null}

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full rounded-2xl bg-[#1d3528] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#f6f2ea] transition-transform hover:-translate-y-0.5 hover:bg-[#234130] ${
        isSubmitting ? 'cursor-not-allowed opacity-70 hover:translate-y-0' : ''
      }`}
    >
      {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
    </button>
  </form>
);

export default AuthForm;
