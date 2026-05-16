import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@organisms/AuthForm/AuthForm';
import AuthTemplate from '@templates/AuthTemplate/AuthTemplate';
import AuthModeToggle from '@molecules/AuthModeToggle/AuthModeToggle';
import AuthFeatureCard from '@molecules/AuthFeatureCard/AuthFeatureCard';
import { AuthMode } from '@organisms/AuthForm/AuthTypes';
import { createUser, loginUser } from '@/api/userApi';

const USER_ID_STORAGE_KEY = 'userId';

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
    <AuthTemplate
      brandLabel="AutoMinutes"
      title="Capture clarity from every conversation."
      description="Sign in to keep your meetings, action items, and transcripts in one calm place."
      featureCards={
        <>
          <AuthFeatureCard
            title="Structured summaries"
            description="AutoMinutes distills key decisions and next steps automatically."
          />
          <AuthFeatureCard
            title="Shareable action lists"
            description="Track follow-ups without jumping between different tools."
          />
        </>
      }
      formTitle={mode === 'signin' ? 'Welcome back' : 'Create your account'}
      modeToggleSlot={<AuthModeToggle mode={mode} onModeChange={setMode} />}
      formSlot={
        <AuthForm
          mode={mode}
          email={email}
          password={password}
          fullName={fullName}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onFullNameChange={setFullName}
        />
      }
      helperText={
        <>
          <span className="font-['JetBrains_Mono']">Local only:</span> we store your user id in the
          browser to remember you.
        </>
      }
    />
  );
};

export default AuthPage;
