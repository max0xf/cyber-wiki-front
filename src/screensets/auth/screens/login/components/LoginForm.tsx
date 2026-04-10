/**
 * Login Form component
 */

import { useState, type FormEvent } from 'react';
import { Button, Input, Label, Alert } from '@hai3/uikit';
import { loginAction } from '../../../actions/auth';

interface LoginFormProps {
  error: string | null;
  isLoading: boolean;
  t: (key: string) => string;
}

export function LoginForm({ error, isLoading, t }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate
    if (!username.trim()) {
      setValidationError(t('usernameRequired'));
      return;
    }
    if (!password.trim()) {
      setValidationError(t('passwordRequired'));
      return;
    }

    // Dispatch login action
    loginAction({ username: username.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="destructive">
          {validationError || error}
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">{t('username')}</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('usernamePlaceholder')}
          disabled={isLoading}
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('loggingIn') : t('login')}
      </Button>
    </form>
  );
}
