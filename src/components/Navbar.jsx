import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center pt-6 sm:pt-8 px-4">
      <nav className="relative flex items-center justify-between rounded-[20px] sm:rounded-full bg-[#f8f8f8] px-5 sm:px-8 py-3 w-full max-w-4xl shadow-sm border border-slate-100">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-extrabold tracking-tight text-[18px] sm:text-[22px] hover:opacity-80 transition shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor" className="sm:w-7 sm:h-7">
            <g transform="skewX(-12) translate(4, 0)">
              <rect x="2" y="6" width="7" height="20" rx="1.5" />
              <rect x="19" y="6" width="7" height="20" rx="1.5" />
              <rect x="5" y="12.5" width="20" height="7" rx="1.5" />
            </g>
          </svg>
          Hunar Connect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[14px] font-medium text-slate-700 hover:text-black transition">
            Workers
          </Link>
          <a href="#" className="text-[14px] font-medium text-slate-700 hover:text-black transition">
            Services
          </a>
        </div>

        {/* Right Side (Auth & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 border-r border-slate-200 pr-4 mr-1">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline text-xs font-semibold text-slate-400 uppercase tracking-widest">User</span>
                <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{user.email.split('@')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-bold text-black hover:bg-slate-50 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-900 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 right-0 z-50 md:hidden rounded-3xl bg-white p-4 shadow-xl border border-slate-100 flex flex-col gap-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900"
            >
              Workers
            </Link>
            <a href="#" className="px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-700">Services</a>
            <div className="h-[1px] bg-slate-100 my-1 mx-2" />
            {user ? (
              <div className="p-2 space-y-3">
                <div className="px-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-black">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-xl bg-black py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
