import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else if (isSignUp) {
        setError('Check your email for the confirmation link!');
        setTimeout(() => navigate('/'), 3000);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-[#f5f5f5] p-8 shadow-lg">
          <h1 className="text-[32px] font-bold tracking-tight text-black mb-2">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-[15px] font-medium text-slate-600 mb-8">
            {isSignUp
              ? 'Join our community of skilled professionals'
              : 'Sign in to access your profile and services'}
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="mt-4 rounded-full bg-black py-3 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="w-full text-sm font-semibold text-slate-600 hover:text-black transition"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
