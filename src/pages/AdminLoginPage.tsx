import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowLeft, AlertCircle, Info, Database } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { FishPondCanvas } from '../components/FishPondCanvas';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, login, isLoading, error: authError, isDemoMode } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setFormError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-[#020e21] text-white">
      {/* Background canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <FishPondCanvas />
        <div className="absolute inset-0 bg-[#020e21]/80 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300/80 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fish Pond Home</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <Shield className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              ADMINISTRATOR LOGIN
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/70 mt-1.5">
              Secure access for reviewing & approving freshers challenges
            </p>
          </div>

          {/* Mode Indicator Callout */}
          {isDemoMode ? (
            <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">Interactive Demo Mode Active</span>
                <span className="text-[11px] opacity-90 leading-tight block">
                  Supabase credentials are not yet configured in <code className="text-cyan-300 font-mono">.env</code>. You can log in with demo admin email (e.g. <span className="underline">admin@fishpond.edu</span> / any password) to preview all dashboard capabilities.
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Connected to live Supabase Auth</span>
            </div>
          )}

          {(formError || authError) && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl glass-input text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In As Administrator</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              🔒 Admin accounts must be created in Supabase Auth and added to the <code className="text-cyan-300 font-mono">admin_users</code> table. Public self-registration is permanently disabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
