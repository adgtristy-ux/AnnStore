import { useState } from 'react';
import { adminLogin } from '../services/api';

export default function AdminLogin({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both fields.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-card w-full max-w-sm shadow-modal anim-scale">
        <div className="px-6 pt-6 pb-2">
          <h2 className="font-heading text-xl text-ink mb-1">Admin login</h2>
          <p className="text-ink-light text-sm">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6 pt-3 space-y-3">
          {error && (
            <div className="bg-danger-light text-danger text-sm px-3 py-2 rounded-card border border-danger/15">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1" htmlFor="admin-user">
              Username
            </label>
            <input
              id="admin-user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-light mb-1" htmlFor="admin-pass">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input-field"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
