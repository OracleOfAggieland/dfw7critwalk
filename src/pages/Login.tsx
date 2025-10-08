import { useState } from 'react';
import { loginAsTeam } from '../services/auth.service';
import { Logo } from '../assets/Logo';

export function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password === import.meta.env.VITE_TEAM_LOGIN_PASSWORD) {
      const result = await loginAsTeam();
      if (!result.success) {
        setError('Login failed. Please try again.');
      }
    } else {
      setError('Incorrect password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Logo size="large" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crit Walk Dashboard</h1>
          <p className="text-gray-600">DFW7 RME Team Login</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter team password"
              className="input-field text-base"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full min-h-[56px] text-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Distribution Facility Maintenance Team
        </p>
      </div>
    </div>
  );
}
