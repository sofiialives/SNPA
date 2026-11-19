"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { formatDateTime } from "../../../lib/labels";

const EMPTY_FORM = { diagnostic: "", description: "", walkBanActivated: false, walkBanLifted: false, vaccineReminderDate: "" };

export default function DossiersMedicauxPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const canWrite = ["ADMINISTRATOR", "VETERINARIAN", "STAFF"].includes(user.role);

  const [animals, setAnimals] = useState([]);
  const [animalId, setAnimalId] = useState(params.get("animal") || "");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/animals?publicOnly=false", { token }).then((r) => setAnimals(r.animals)).catch(() => {});
  }, [token]);

  const loadRecords = useCallback(() => {
    if (!animalId) { setRecords([]); return; }
    api.get(`/api/medical-records/animal/${animalId}`, { token }).then((r) => setRecords(r.records)).catch((e) => setError(e.message));
  }, [animalId, token]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  function selectAnimal(id) {
    setAnimalId(id);
    router.replace(id ? `/crm/dossiers-medicaux?animal=${id}` : "/crm/dossiers-medicaux");
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/medical-records", { animalId, ...form }, { token });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const selected = animals.find((a) => String(a.id) === String(animalId));

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-xl font-bold text-green-dark">Dossiers médicaux</h1>

      <div className="card p-4">
        <p className="label">Animal</p>
        <select className="input" value={animalId} onChange={(e) => selectAnimal(e.target.value)}>
          <option value="">— Choisir un animal —</option>
          {animals.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {animalId && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-dark/60">Historique pour {selected?.name || "cet animal"} — immuable, non modifiable.</p>
            {canWrite && (
              <button onClick={() => setShowForm((v) => !v)} className="btn-primary !px-3 !py-1.5 text-sm">
                {showForm ? "Annuler" : "+ Nouvelle entrée"}
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={submit} className="card space-y-3 p-4">
              <div>
                <label className="label">Diagnostic *</label>
                <input required className="input" value={form.diagnostic} onChange={(e) => setForm({ ...form, diagnostic: e.target.value })} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.walkBanActivated} onChange={(e) => setForm({ ...form, walkBanActivated: e.target.checked, walkBanLifted: e.target.checked ? false : form.walkBanLifted })} />
                  Interdire les sorties
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.walkBanLifted} onChange={(e) => setForm({ ...form, walkBanLifted: e.target.checked, walkBanActivated: e.target.checked ? false : form.walkBanActivated })} />
                  Lever l'interdiction de sortie
                </label>
              </div>
              <div>
                <label className="label">Rappel de vaccin (date)</label>
                <input type="date" className="input" value={form.vaccineReminderDate} onChange={(e) => setForm({ ...form, vaccineReminderDate: e.target.value })} />
              </div>
              {error && <p className="text-sm text-terracotta">{error}</p>}
              <button disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50">Enregistrer</button>
            </form>
          )}

          <div className="space-y-3">
            {records.length === 0 && <p className="text-sm text-green-dark/50">Aucune entrée pour cet animal.</p>}
            {records.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-green-dark">{r.diagnostic}</p>
                  <p className="text-xs text-green-dark/40">{formatDateTime(r.created_at)} · {r.author_name}</p>
                </div>
                {r.description && <p className="mt-1 text-sm text-green-dark/80">{r.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.walk_ban_activated && <span className="badge bg-red-100 text-red-700">Sorties interdites</span>}
                  {r.walk_ban_lifted && <span className="badge bg-green/10 text-green-dark">Interdiction levée</span>}
                  {r.vaccine_reminder_date && <span className="badge bg-sage/20 text-green-dark">Rappel vaccin : {formatDateTime(r.vaccine_reminder_date)}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
