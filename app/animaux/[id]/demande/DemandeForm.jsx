"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../../../../lib/api";

export default function DemandeForm({ animal }) {
  const router = useRouter();
  const [form, setForm] = useState({
    familyFirstName: "",
    familyLastName: "",
    email: "",
    phone: "",
    address: "",
    motivation: "",
    hasChildren: false,
    childrenAges: "",
    hasGarden: false,
    otherAnimals: "",
    dailyAloneHours: "",
    experience: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post("/api/adoption-requests", { animalId: animal.id, ...form });
      router.push(`/suivi/${data.trackingToken}?nouveau=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Prénom *</label>
            <input required className="input" value={form.familyFirstName} onChange={(e) => set("familyFirstName", e.target.value)} />
          </div>
          <div>
            <label className="label">Nom *</label>
            <input required className="input" value={form.familyLastName} onChange={(e) => set("familyLastName", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Email *</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="label">Téléphone *</label>
            <input required className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Adresse du domicile</label>
          <input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} />
        </div>

        <div>
          <label className="label">Pourquoi souhaitez-vous adopter {animal.name} ? *</label>
          <textarea required rows={4} className="input" value={form.motivation} onChange={(e) => set("motivation", e.target.value)} />
        </div>

        <div className="card space-y-4 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-dark/50">Conditions de vie</p>

          <label className="flex items-center gap-2 text-sm text-green-dark">
            <input type="checkbox" checked={form.hasChildren} onChange={(e) => set("hasChildren", e.target.checked)} />
            Il y a des enfants au foyer
          </label>
          {form.hasChildren && (
            <div>
              <label className="label">Âge des enfants</label>
              <input className="input" placeholder="ex. 8 et 11 ans" value={form.childrenAges} onChange={(e) => set("childrenAges", e.target.value)} />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-green-dark">
            <input type="checkbox" checked={form.hasGarden} onChange={(e) => set("hasGarden", e.target.checked)} />
            Vous disposez d'un jardin
          </label>

          <div>
            <label className="label">Autres animaux au foyer</label>
            <input className="input" placeholder="ex. un chat de 5 ans, aucun..." value={form.otherAnimals} onChange={(e) => set("otherAnimals", e.target.value)} />
          </div>

          <div>
            <label className="label">Temps d'absence dans la journée</label>
            <input className="input" placeholder="ex. 4-5h en semaine" value={form.dailyAloneHours} onChange={(e) => set("dailyAloneHours", e.target.value)} />
          </div>

          <div>
            <label className="label">Expérience avec les animaux</label>
            <textarea rows={3} className="input" value={form.experience} onChange={(e) => set("experience", e.target.value)} />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-terracotta-light/20 px-4 py-3 text-sm text-terracotta">{error}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Envoi..." : "Envoyer la demande"}
        </button>
        <p className="text-xs text-green-dark/50">
          * Après l'envoi, vous recevrez un email avec un lien personnel pour suivre l'avancement de votre dossier.
        </p>
      </div>

      <aside className="card h-fit p-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Vous faites une demande pour</p>
        <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-beige text-sm text-green-dark/40">
          {animal.mainPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={animal.mainPhotoUrl} alt={animal.name} className="h-full w-full rounded-lg object-cover" />
          ) : (
            "photo"
          )}
        </div>
        <p className="mt-3 font-semibold text-green-dark">{animal.name}</p>
        <p className="text-sm text-green-dark/60">{animal.breed}</p>
        <div className="my-4 border-t border-black/5" />
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Et ensuite</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-green-dark/70">
          <li>Notre équipe examine votre dossier</li>
          <li>Rencontre programmée au refuge, le samedi</li>
          <li>Décision et, si tout va bien, adoption !</li>
        </ul>
      </aside>
    </form>
  );
}
