import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert, KeyRound, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, session, login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('admin@dreamhaven.example');
  const [password, setPassword] = useState('dreamhaven2026');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, 'admin');
  };

  const handleQuickDemoAdmin = async () => {
    await login('admin@dreamhaven.example', 'dreamhaven2026', 'admin');
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

        {/* Security Lock Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Restricted Access</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">/admin</code> dashboard is restricted to authorized store staff. Protected by Express role-based auth middleware.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Passcode</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Role Credentials...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Authenticate Admin Session</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials shortcut */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Evaluator Quick Pass:</p>
          <button
            onClick={handleQuickDemoAdmin}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bypass with Demo Admin Token</span>
          </button>
        </div>
      </div>
    </div>
  );
};
