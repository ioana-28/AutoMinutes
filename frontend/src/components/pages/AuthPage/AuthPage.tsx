import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@atoms/Input/Input';
import { createUser, loginUser } from '@/api/userApi';

const USER_ID_STORAGE_KEY = 'userId';

type AuthMode = 'signin' | 'signup';

const AuthPage: FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || (mode === 'signup' && !fullName.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      setIsSubmitting(true);

      if (mode === 'signin') {
        const user = await loginUser({
          email: normalizedEmail,
          password: normalizedPassword,
        });
        if (typeof user.id !== 'number') {
          throw new Error('Invalid login response.');
        }
        localStorage.setItem(USER_ID_STORAGE_KEY, String(user.id));
        window.dispatchEvent(new Event('auth:changed'));
      } else {
        const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] ?? '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const user = await createUser({
          email: normalizedEmail,
          password: normalizedPassword,
          firstName: firstName || null,
          lastName: lastName || null,
          role: 'USER',
          activityStatus: 'ACTIVE',
        });
        if (typeof user.id !== 'number') {
          throw new Error('Invalid signup response.');
        }
        localStorage.setItem(USER_ID_STORAGE_KEY, String(user.id));
        window.dispatchEvent(new Event('auth:changed'));
      }

      navigate('/meeting-list', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to authenticate.';
      setError(message || 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1b12] text-[#f6f2ea]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(140,189,152,0.45),_transparent_55%)]" />
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#f4b860] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-64 w-64 rounded-full bg-[#7fd1b9] opacity-20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-stretch gap-8 px-6 py-16 md:flex-row md:items-center">
        <section className="flex-1 font-['Space_Grotesk']">
          <p className="text-sm uppercase tracking-[0.35em] text-[#a6d4b4]">AutoMinutes</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
            Capture clarity from every conversation.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[#d7e7dc]">
            Sign in to keep your meetings, action items, and transcripts in one calm place.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-[#cfe1d6] md:grid-cols-2">
            <div className="rounded-2xl border border-[#2b3f34] bg-[#132319] p-4">
              <p className="font-semibold">Structured summaries</p>
              <p className="mt-2 text-[#b9d0c4]">
                AutoMinutes distills key decisions and next steps automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-[#2b3f34] bg-[#132319] p-4">
              <p className="font-semibold">Shareable action lists</p>
              <p className="mt-2 text-[#b9d0c4]">
                Track follow-ups without jumping between different tools.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-md rounded-3xl border border-[#294035] bg-[#f6f2ea] p-8 text-[#152218] shadow-[0_30px_80px_rgba(7,14,10,0.45)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#4a6c5b]">Get started</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
            </div>
            <div className="flex gap-2 rounded-full bg-[#e9e0d3] p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
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
                onClick={() => setMode('signup')}
                className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-[#1d3528] text-[#f6f2ea]'
                    : 'text-[#355245] hover:text-[#1d3528]'
                }`}
              >
                Create
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4a6c5b]">
                  Full name
                </label>
                <Input
                  className="mt-2"
                  placeholder="Ada Lovelace"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
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
                onChange={(event) => setEmail(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
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

          <div className="mt-6 text-xs text-[#4a6c5b]">
            <span className="font-['JetBrains_Mono']">Local only:</span> we store your user id in the
            browser to remember you.
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
