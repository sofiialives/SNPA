"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";

function nextSaturdayFrom(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = (6 - day + 7) % 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function RendezVousPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const demandeId = params.get("demande");

  const [date, setDate] = useState(() => nextSaturdayFrom(new Date().toISOString().slice(0, 10)));
  const [grid, setGrid] = useState(null);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(demandeId || "");

  const load = useCallback(() => {
    api.get(`/api/meetings?date=${date}`, { token }).then(setGrid).catch((e) => setError(e.message));
  }, [date, token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.get("/api/adoption-requests?status=UNDER_REVIEW", { token }).then((r) => setPendingRequests(r.requests)).catch(() => {});
  }, [token]);

  async function book(slot) {
    if (!selectedRequest) {
      setError("Sélectionnez d'abord une demande à programmer.");
      return;
    }
    setError(null);
    try {
      await api.post("/api/meetings", { adoptionRequestId: selectedRequest, date, slot }, { token });
      load();
      router.replace(`/crm/demandes/${selectedRequest}`);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-green-dark">Rendez-vous</h1>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setDate(addDays(date, -7))} className="btn-secondary !px-3 !py-1.5">← Samedi précédent</button>
          <span className="font-medium text-green-dark">{new Date(date + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" })}</span>
          <button onClick={() => setDate(addDays(date, 7))} className="btn-secondary !px-3 !py-1.5">Samedi suivant →</button>
        </div>
      </div>

      <div className="card p-4">
        <p className="label">Programmer une rencontre pour</p>
        <select className="input" value={selectedRequest} onChange={(e) => setSelectedRequest(e.target.value)}>
          <option value="">— Choisir une demande « En cours d'examen » —</option>
          {pendingRequests.map((r) => (
            <option key={r.id} value={r.id}>{r.familyFirstName} {r.familyLastName} — {r.animalName}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-black/5">
          {grid?.slots.map((s) => (
            <div key={s.slot} className="flex items-center gap-4 p-4">
              <span className="w-16 shrink-0 font-medium text-green-dark">{s.slot}</span>
              <div className="flex flex-1 flex-wrap gap-2">
                {s.bookings.map((b) => (
                  <span key={b.id} className="badge bg-green/10 text-green-dark">{b.family} · {b.animal}</span>
                ))}
                {!s.full && (
                  <button onClick={() => book(s.slot)} className="rounded-full border border-dashed border-green/30 px-3 py-1 text-sm text-green-dark hover:bg-beige">
                    + Réserver ce créneau
                  </button>
                )}
                {s.full && s.bookings.length === 0 && <span className="text-sm text-green-dark/40">—</span>}
              </div>
              {s.full && <span className="badge bg-terracotta-light/25 text-terracotta">complet</span>}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-green-dark/50">
        Limite : 2 familles par créneau, uniquement le samedi, créneaux de 30 minutes.
      </p>
    </div>
  );
}
