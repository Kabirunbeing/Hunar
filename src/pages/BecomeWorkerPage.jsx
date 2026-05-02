import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CATEGORIES, AREAS } from '../data/mockData';

export default function BecomeWorkerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    category: CATEGORIES[1], // Skip 'All'
    area: AREAS[1], // Skip 'All areas'
    experienceYears: '',
    bio: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user) {
      setError('You must be signed in to submit an application.');
      return;
    }

    setLoading(true);

    try {
      const { data: existingWorker, error: workerCheckError } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (workerCheckError) {
        throw workerCheckError;
      }

      if (existingWorker) {
        setError('Your worker profile is already approved.');
        setLoading(false);
        return;
      }

      const { data: existingApplication, error: appCheckError } = await supabase
        .from('worker_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (appCheckError) {
        throw appCheckError;
      }

      if (existingApplication) {
        setError(`You already have an application (${existingApplication.status}).`);
        setLoading(false);
        return;
      }

      const { error: submitError } = await supabase
        .from('worker_applications')
        .insert([{
          user_id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          category: formData.category,
          area: formData.area,
          experience_years: parseInt(formData.experienceYears, 10),
          bio: formData.bio,
        }]);

      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        category: CATEGORIES[1],
        area: AREAS[1],
        experienceYears: '',
        bio: '',
      });
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="rounded-3xl bg-[#f5f5f5] p-8 shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 font-serif text-slate-900">Sign in to apply</h2>
          <p className="text-slate-600 font-medium text-[15px] mb-6">
            You need a Hunar Connect account to become a worker. 
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full rounded-full bg-black py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-black mb-3 font-serif">
            Become a Worker
          </h1>
          <p className="text-[16px] font-medium text-slate-500 max-w-lg mx-auto">
            Join Hunar Connect to offer your premium services locally. Fill out the application and we'll process it within 24 hours.
          </p>
        </div>

        <div className="rounded-[24px] sm:rounded-[32px] bg-[#f8f8f8] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          {success ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Application Submitted!</h3>
              <p className="text-slate-500 font-medium mb-8">We will review your details and get back to you soon.</p>
              <button
                onClick={() => navigate('/')}
                className="rounded-full bg-slate-200 px-8 py-3 text-[15px] font-bold text-black hover:bg-slate-300 transition"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Asad Ali"
                    className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Primary Service
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black bg-white appearance-none"
                    required
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Base Area
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black bg-white appearance-none"
                    required
                  >
                    {AREAS.filter(a => a !== 'All areas').map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="0"
                  max="50"
                  className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Short Bio / Pitch
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about your skills and why they should choose you..."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-[15px] outline-none font-medium focus:border-black focus:ring-1 focus:ring-black resize-none"
                  required
                ></textarea>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-[14px] text-red-600 font-bold">
                  {error}
                </div>
              )}

              <div className="mt-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-black py-4 text-[16px] font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}