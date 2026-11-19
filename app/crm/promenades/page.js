"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { WALK_STATUS_LABELS, ANIMAL_TYPE_LABELS } from "../../../lib/labels";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function PromenadesPage() {
  const { token, user } = useAuth();
  const isStaff = ["ADMINISTRATOR", "STAFF", "ADOPTION_MANAGER"].includes(user.role);

  const [date, setDate] = useState(todayStr());
  const [grid, setGrid] = useState(null);
  const [view, setView] = useState("grille");
  const [notWalked, setNotWalked] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerChoice, setVolunteerChoice] = useState({}); // animalId+slot -> volunteerId
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get(`/api/walks?date=${date}`, { token }).then(setGrid).catch((e) => setError(e.message));
  }, [date, token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.get("/api/walks/not-walked?days=2", { token }).then((r) => setNotWalked(r.animals)).catch(() => {});
    if (isStaff) {
      api.get("/api/team/volunteers", { token }).then((r) => setVolunteers(r.volunteers)).catch(() => {});
    }
  }, [token, isStaff]);

  async function book(animalId, slot) {
    setError(null);
    setSaving(true);
    const key = `${animalId}_${slot}`;
    const volunteerId = isStaff ? volunteerChoice[key] : undefined;
    if (isStaff && !volunteerId) {
      setError("Choisissez d'abord un bénévole pour réserver ce créneau.");
      setSaving(false);
      return;
    }
    try {
      await api.post("/api/walks", { animalId, date, slot, volunteerId }, { token });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function start(walkId) {
    setSaving(true);
    try { await api.patch(`/api/walks/${walkId}/start`, {}, { token }); load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }
  async function end(walkId) {
    setSaving(true);
    try { await api.patch(`/api/walks/${walkId}/end`, {}, { token }); load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-green-dark">Promenades</h1>
        <div className="flex gap-2">
          <button onClick={() => setView("grille")} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${view === "grille" ? "border-green bg-green text-white" : "border-black/10 bg-white text-green-dark"}`}>Grille du jour</button>
          <button onClick={() => setView("non-sorties")} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${view === "non-sorties" ? "border-green bg-green text-white" : "border-black/10 bg-white text-green-dark"}`}>Non sorties</button>
        </div>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      {view === "grille" && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => setDate(addDays(date, -1))} className="btn-secondary !px-3 !py-1.5">← Veille</button>
            <span className="font-medium text-green-dark">{new Date(date + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" })}</span>
            <button onClick={() => setDate(addDays(date, 1))} className="btn-secondary !px-3 !py-1.5">Lendemain →</button>
          </div>

          <div className="space-y-3">
            {grid?.animals.map((a) => (
              <div key={a.animalId} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-green-dark">{a.animalName} <span className="text-xs font-normal text-green-dark/50">({ANIMAL_TYPE_LABELS[a.type]})</span></p>
                  {a.walkBanned && <span className="badge bg-red-100 text-red-700">Sorties interdites{a.walkBanReason ? ` — ${a.walkBanReason}` : ""}</span>}
                </div>
                {!a.walkBanned && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.slots.map((s) => {
                      const key = `${a.animalId}_${s.slot}`;
                      if (!s.booked) {
                        return (
                          <div key={s.slot} className="flex flex-col items-start gap-1 rounded-lg border border-dashed border-green/30 p-2">
                            <span className="text-xs font-medium text-green-dark/70">{s.slot}</span>
                            {isStaff && (
                              <select className="input !py-1 !text-xs" value={volunteerChoice[key] || ""} onChange={(e) => setVolunteerChoice((v) => ({ ...v, [key]: e.target.value }))}>
                                <option value="">Bénévole…</option>
                                {volunteers.map((v) => <option key={v.id} value={v.id}>{v.first_name} {v.last_name}</option>)}
                              </select>
                            )}
                            <button disabled={saving} onClick={() => book(a.animalId, s.slot)} className="text-xs font-medium text-terracotta hover:underline disabled:opacity-40">
                              + Réserver
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div key={s.slot} className="flex flex-col items-start gap-1 rounded-lg bg-beige p-2">
                          <span className="text-xs font-medium text-green-dark/70">{s.slot} · {s.volunteerName}</span>
                          <span className="badge bg-white">{WALK_STATUS_LABELS[s.status]}</span>
                          {s.status === "RESERVED" && (
                            <button disabled={saving} onClick={() => start(s.walkId)} className="text-xs font-medium text-terracotta hover:underline">Départ →</button>
                          )}
                          {s.status === "IN_PROGRESS" && (
                            <button disabled={saving} onClick={() => end(s.walkId)} className="text-xs font-medium text-terracotta hover:underline">Retour ✓</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {!grid && <p className="text-green-dark/50">Chargement...</p>}
          </div>
        </>
      )}

      {view === "non-sorties" && (
        <div className="card overflow-hidden">
          <div className="divide-y divide-black/5">
            {notWalked.length === 0 && <p className="p-4 text-sm text-green-dark/50">Tous les animaux ont été sortis récemment.</p>}
            {notWalked.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-green-dark">{a.name}</p>
                  <p className="text-xs text-green-dark/50">{ANIMAL_TYPE_LABELS[a.type]} · dernière sortie : {a.last_walk ? new Date(a.last_walk).toLocaleDateString("fr-FR") : "jamais"}</p>
                </div>
                {a.walk_banned && <span className="badge bg-red-100 text-red-700">Interdites</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
