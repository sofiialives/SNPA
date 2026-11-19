"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ApiError } from "../../../../lib/auth";
import { api } from "../../../../lib/api";

export default function NewAnimalPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", type: "CHIEN", breed: "", sex: "MALE", ageYears: 0, ageMonths: 0,
    description: "", vaccinated: false, sterilized: false, chipped: false,
    compatEnfants: "INCONNU", compatChats: "INCONNU", compatChiens: "INCONNU",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await api.post("/api/animals", form, { token });
      router.push(`/crm/animaux/${data.animal.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-xl font-bold text-green-dark">Ajouter un animal</h1>
      <form onSubmit={onSubmit} className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nom *</label>
            <input required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="label">Race</label>
            <input className="input" value={form.breed} onChange={(e) => set("breed", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Type *</label>
            <select className="input" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="CHIEN">Chien</option>
              <option value="CHAT">Chat</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div>
            <label className="label">Sexe *</label>
            <select className="input" value={form.sex} onChange={(e) => set("sex", e.target.value)}>
              <option value="MALE">Mâle</option>
              <option value="FEMELLE">Femelle</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Âge (ans)</label>
              <input type="number" min="0" className="input" value={form.ageYears} onChange={(e) => set("ageYears", +e.target.value)} />
            </div>
            <div>
              <label className="label">Mois</label>
              <input type="number" min="0" max="11" className="input" value={form.ageMonths} onChange={(e) => set("ageMonths", +e.target.value)} />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={4} className="input" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-green-dark">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.vaccinated} onChange={(e) => set("vaccinated", e.target.checked)} /> Vacciné</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.sterilized} onChange={(e) => set("sterilized", e.target.checked)} /> Stérilisé</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.chipped} onChange={(e) => set("chipped", e.target.checked)} /> Pucé</label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[["compatEnfants", "Ok enfants"], ["compatChats", "Ok chats"], ["compatChiens", "Ok chiens"]].map(([field, label]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <select className="input" value={form[field]} onChange={(e) => set(field, e.target.value)}>
                <option value="INCONNU">Non renseigné</option>
                <option value="OUI">Oui</option>
                <option value="NON">Non</option>
              </select>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Création..." : "Créer la fiche"}
        </button>
      </form>
    </div>
  );
}
