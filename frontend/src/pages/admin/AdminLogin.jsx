import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpRight, Lock } from "lucide-react";

export default function AdminLogin() {
  const { login, user, checking } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!checking && user) {
    const from = location.state?.from || "/admin";
    return <Navigate to={from} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="page-admin-login" className="min-h-screen bg-[color:var(--ink)] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[color:var(--bone)] px-3 py-2 inline-flex items-center">
            <img src="/brand/logo.png" alt="Magnrey" className="h-8 w-auto object-contain" />
          </div>
        </div>
        <div className="border border-[color:var(--gold)]/30 p-10 bg-[color:var(--ink-soft)]">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-[color:var(--gold)]" />
            <span className="eyebrow">Partner Console</span>
          </div>
          <h1 className="font-serif-display text-4xl text-[color:var(--bone)] leading-tight">Sign in.</h1>
          <p className="text-white/60 text-[14px] mt-3">Private access for the founding partner.</p>

          <form onSubmit={submit} className="mt-10 space-y-5" data-testid="admin-login-form">
            <div>
              <label className="field-label">Email</label>
              <input
                required
                type="email"
                data-testid="admin-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="assist@magnrey.com"
                className="input-field"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                required
                type="password"
                data-testid="admin-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={busy} data-testid="admin-login-submit" className="btn-gold w-full justify-center disabled:opacity-60">
              {busy ? "Signing in…" : (<>Enter Console <ArrowUpRight size={16} /></>)}
            </button>
          </form>
        </div>
        <p className="text-white/40 text-[11px] font-mono-brand tracking-wider uppercase mt-6 text-center">
          Not the partner? <a href="/" className="text-[color:var(--gold)] hover:underline">Return to site</a>
        </p>
      </div>
    </div>
  );
}
