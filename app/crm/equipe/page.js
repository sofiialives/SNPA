"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { ROLE_LABELS } from "../../../lib/auth";
import { formatDate } from "../../../lib/labels";

const ROLES = ["ADMINISTRATOR", "VETERINARIAN", "ADOPTION_MANAGER", "STAFF", "VOLUNTEER"];
const STATUS_LABELS = { PENDING: "En attente", ACTIVE: "Actif", INVITED: "Invité" };
const EMPTY_INVITE = { firstName: "", lastName: "", email: "", role: "STAFF" };

export default function EquipePage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState(EMPTY_INVITE);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get("/api/team", { token }).then((r) => setUsers(r.users)).catch((e) => setError(e.message));
  }
  useEffect(() => { load(); }, [token]);

  async function submitInvite(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/api/team/invite", invite, { token });
      setInvite(EMPTY_INVITE);
      setShowInvite(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function approve(id) {
    setSaving(true);
    try { await api.patch(`/api/team/${id}/approve`, {}, { token }); load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function changeRole(id, role) {
    setSaving(true);
    try { await api.patch(`/api/team/${id}/role`, { role }, { token }); load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm("Supprimer définitivement ce compte ?")) return;
    setSaving(true);
    try { await api.del(`/api/team/${id}`, { token }); load(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  const pending = users.filter((u) => u.status === "PENDING");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-dark">Équipe</h1>
        <button onClick={() => setShowInvite((v) => !v)} className="btn-primary !px-4 !py-2 text-sm">
          {showInvite ? "Annuler" : "+ Inviter un employé"}
        </button>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      {showInvite && (
        <form onSubmit={submitInvite} className="card grid gap-3 p-4 sm:grid-cols-2">
          <div>
            <label className="label">Prénom *</label>
            <input required className="input" value={invite.firstName} onChange={(e) => setInvite({ ...invite, firstName: e.target.value })} />
          </div>
          <div>
            <label className="label">Nom *</label>
            <input required className="input" value={invite.lastName} onChange={(e) => setInvite({ ...invite, lastName: e.target.value })} />
          </div>
          <div>
            <label className="label">Email *</label>
            <input required type="email" className="input" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Rôle *</label>
            <select className="input" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
              {ROLES.filter((r) => r !== "VOLUNTEER").map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50">Envoyer l'invitation</button>
            <p className="mt-1 text-xs text-green-dark/50">Un mot de passe provisoire est envoyé par email (simulé en démo).</p>
          </div>
        </form>
      )}

      {pending.length > 0 && (
        <div className="card p-4">
          <p className="label">Bénévoles en attente de validation</p>
          <div className="mt-2 space-y-2">
            {pending.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg bg-beige px-3 py-2">
                <span className="text-sm text-green-dark">{u.first_name} {u.last_name} — {u.email}</span>
                <button disabled={saving} onClick={() => approve(u.id)} className="text-sm font-medium text-terracotta hover:underline">Valider</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-green-dark/50">
              <th className="px-4 py-3">Employé</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Depuis</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-black/5 last:border-0 hover:bg-beige/30">
                <td className="px-4 py-3 text-green-dark">{u.first_name} {u.last_name}</td>
                <td className="px-4 py-3 text-green-dark/70">{u.email}</td>
                <td className="px-4 py-3">
                  <select className="input !w-auto !py-1 text-sm" value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><span className="badge bg-sage/20 text-green-dark">{STATUS_LABELS[u.status] || u.status}</span></td>
                <td className="px-4 py-3 text-green-dark/60">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(u.id)} className="text-sm font-medium text-terracotta hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
