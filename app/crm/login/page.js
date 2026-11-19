"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ApiError } from "../../../lib/auth";
import Logo from "../../../components/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/crm");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="mb-1 text-center text-lg font-bold text-green-dark">Espace équipe</h1>
        <p className="mb-6 text-center text-sm text-green-dark/60">Connectez-vous au CRM du refuge</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-terracotta">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-green-dark/40">
          Comptes de démo : sophie@snpa-refuge.fr · ines@snpa-refuge.fr · karim@snpa-refuge.fr<br />
          mot de passe : snpa2026
        </p>
      </div>
    </div>
  );
}
