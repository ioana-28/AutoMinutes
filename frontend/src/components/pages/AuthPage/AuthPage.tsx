import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@organisms/AuthForm/AuthForm';
import AuthTemplate from '@templates/AuthTemplate/AuthTemplate';
import AuthModeToggle from '@molecules/AuthModeToggle/AuthModeToggle';
import { AuthMode } from '@organisms/AuthForm/AuthTypes';
import { createUser, loginUser } from '@/api/userApi';
import logoImg from '@/assets/logo.png';

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      if (mode === 'signin') {
        setError('Wrong email or password');
      } else {
        setError('Please enter a valid email address.');
      }
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
      logo={<img src={logoImg} alt="AutoMinutes Logo" className="w-full drop-shadow-2xl" />}
      formTitle={mode === 'signin' ? 'Sign In' : 'Sign Up'}
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
    />
  );
};

export default AuthPage;
