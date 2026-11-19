"use client";

import { useState } from "react";
import { api, ApiError } from "../../lib/api";

export default function BenevoleForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/auth/register-volunteer", form);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-green-dark">Inscription envoyée !</p>
        <p className="mt-2 text-sm text-green-dark/70">
          Votre demande a été transmise à l'administrateur du refuge. Vous recevrez un email dès que votre
          compte sera validé — vous pourrez alors réserver des créneaux de promenade.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Prénom *</label>
          <input required className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className="label">Nom *</label>
          <input required className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Email *</label>
        <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="label">Téléphone *</label>
        <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div>
        <label className="label">Mot de passe *</label>
        <input required type="password" minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      {error && <p className="text-sm text-terracotta">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Envoi..." : "Envoyer ma candidature"}
      </button>
      <p className="text-xs text-green-dark/50">
        Votre compte devra être validé par l'administrateur du refuge avant de pouvoir réserver des promenades.
      </p>
    </form>
  );
}
