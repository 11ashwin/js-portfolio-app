import { useState } from 'react';
import { login, setToken } from '../../services/api.js';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await login(email, password);
      setToken(data.token);
      onSuccess(data.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="login-view">
      <h1>Admin access</h1>
      <p>Hiring inquiries dashboard — sign in with your admin credentials.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="l-email">Email</label>
          <input type="email" id="l-email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="l-password">Password</label>
          <input type="password" id="l-password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <div className="login-err show">{error}</div>}
      </form>
    </div>
  );
}
