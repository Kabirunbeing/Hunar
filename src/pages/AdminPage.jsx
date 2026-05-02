import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [applications, setApplications] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session, redirecting to auth');
        navigate('/auth');
        return;
      }

      setUserEmail(session.user.email);
      console.log('Session found for:', session.user.email);

      // Fetch user's profile to check role - use regular select first
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError(`Profile error: ${profileError.message}`);
        setLoading(false);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.error('Profile not found for user:', session.user.id);
        setError('Profile not found. Your profile may not have been created yet.');
        setUserRole('not-found');
        setLoading(false);
        return;
      }

      const profile = profiles[0];
      setUserRole(profile.role);
      console.log('User role:', profile.role);

      if (profile.role !== 'admin') {
        console.log('User is not admin, redirecting');
        navigate('/');
        return;
      }

      console.log('Admin access granted');
      setIsAdmin(true);
      fetchApplications();
    } catch (err) {
      console.error('Admin check error:', err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('worker_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application) => {
    setProcessingId(application.id);
    setError('');
    setSuccessMsg('');

    try {
      const { data: existingWorker, error: workerCheckError } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', application.user_id)
        .maybeSingle();

      if (workerCheckError) throw workerCheckError;

      // Always mark the application approved once actioned
      const { error: updateError } = await supabase
        .from('worker_applications')
        .update({ status: 'approved' })
        .eq('id', application.id);

      if (updateError) throw updateError;

      if (!existingWorker) {
        const workerData = {
          user_id: application.user_id,
          full_name: application.full_name,
          phone: application.phone,
          category: application.category,
          area: application.area,
          experience_years: application.experience_years,
          bio: application.bio,
          avatar_tone: ['sunset', 'sky', 'mint', 'sand', 'rose', 'graphite', 'ocean', 'copper'][Math.floor(Math.random() * 8)],
          verified: true,
        };

        const { error: workerError } = await supabase
          .from('workers')
          .insert([workerData]);

        if (workerError) throw workerError;
        setSuccessMsg(`${application.full_name} approved! ✓ They're now in the marketplace.`);
      } else {
        setSuccessMsg(`${application.full_name} was already approved.`);
      }

      setApplications((prev) => prev.filter((item) => item.id !== application.id));
    } catch (err) {
      console.error('❌ [Admin] Approval error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (application) => {
    setProcessingId(application.id);
    setError('');
    setSuccessMsg('');

    try {
      const { error: rejectError } = await supabase
        .from('worker_applications')
        .update({ status: 'rejected' })
        .eq('id', application.id);

      if (rejectError) throw rejectError;

      setSuccessMsg(`${application.full_name}'s application was rejected.`);
      setApplications((prev) => prev.filter((item) => item.id !== application.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error && !isAdmin) {
    return (
      <div className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-[32px] font-bold text-black font-serif mb-6">Admin Access Denied</h1>
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-medium">
            {error}
          </div>
          <p className="text-slate-600 mb-4">Email: {userEmail}</p>
          <p className="text-slate-600 mb-4">Current Role: {userRole || 'checking...'}</p>
          {userRole !== 'admin' && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm space-y-3">
              <p className="font-semibold">Quick Fix:</p>
              <p>1. Open your Supabase Dashboard</p>
              <p>2. Go to <strong>SQL Editor</strong></p>
              <p>3. Create a new query and paste:</p>
              <code className="block bg-white px-3 py-2 rounded border border-blue-200 font-mono text-xs mb-2 overflow-x-auto">
                UPDATE public.profiles SET role='admin' WHERE email='{userEmail}';
              </code>
              <p>4. Click <strong>Run</strong></p>
              <p>5. Come back here and <button onClick={() => window.location.reload()} className="underline font-semibold">refresh this page</button></p>
              {userRole === 'not-found' && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="font-semibold mb-2">Profile Not Found?</p>
                  <p>Try logging out and logging back in first to trigger profile creation.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-black font-serif mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 font-medium">Welcome, {userEmail}</p>
          <p className="text-slate-500 text-sm">Review and approve worker applications</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[15px]">
            ✓ {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-medium text-[15px]">
            ✗ {error}
          </div>
        )}

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-slate-500 font-medium">No pending applications at this time.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                      {app.full_name}
                    </h3>
                    <p className="text-[14px] text-slate-600 mb-3">
                      <span className="font-semibold text-slate-700">{app.category}</span>
                      {' '} • {' '}
                      <span>{app.area}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-[14px]">
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500">Phone</p>
                        <p className="font-semibold text-slate-900">{app.phone}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500">Experience</p>
                        <p className="font-semibold text-slate-900">{app.experience_years} years</p>
                      </div>
                    </div>
                    {app.bio && (
                      <div className="mb-4">
                        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-1">Bio</p>
                        <p className="text-[14px] text-slate-700 leading-relaxed">{app.bio}</p>
                      </div>
                    )}
                    <p className="text-[12px] text-slate-400">
                      Submitted {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:w-[200px] shrink-0">
                    <button
                      onClick={() => handleApprove(app)}
                      disabled={processingId === app.id}
                      className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {processingId === app.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(app)}
                      disabled={processingId === app.id}
                      className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      {processingId === app.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
