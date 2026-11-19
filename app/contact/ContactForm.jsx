"use client";

import { useState } from "react";
import { api, ApiError } from "../../lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post("/api/contact", form);
      setStatus({ ok: true, text: "Merci, votre message a bien été envoyé !" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ ok: false, text: err instanceof ApiError ? err.message : "Une erreur est survenue." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Nom</label>
        <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="label">Email</label>
        <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea required rows={4} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      {status && (
        <p className={status.ok ? "text-sm text-green-dark" : "text-sm text-terracotta"}>{status.text}</p>
      )}
      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
