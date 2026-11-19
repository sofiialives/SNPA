"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../lib/auth";
import { api } from "../../../../lib/api";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, formatDate, formatDateTime } from "../../../../lib/labels";

const NEXT_STATUSES = {
  NEW: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["REJECTED"], // la programmation d'une rencontre passe par /crm/rendez-vous
  MEETING_SCHEDULED: ["APPROVED", "REJECTED"],
  APPROVED: ["ADOPTED", "REJECTED"],
  REJECTED: [],
  ADOPTED: [],
};

export default function DemandeDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [staff, setStaff] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    const data = await api.get(`/api/adoption-requests/${id}`, { token });
    setRequest(data.request);
  }

  useEffect(() => {
    load();
    api.get("/api/team/staff", { token }).then((r) => setStaff(r.staff)).catch(() => {});
  }, [id]);

  async function changeStatus(status) {
    setSaving(true);
    setError(null);
    try {
      const data = await api.patch(`/api/adoption-requests/${id}/status`, { status }, { token });
      setRequest(data.request);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function assign(responsibleId) {
    const data = await api.patch(`/api/adoption-requests/${id}/responsible`, { responsibleId: responsibleId || null }, { token });
    setRequest(data.request);
  }

  if (!request) return <p className="text-green-dark/50">Chargement...</p>;

  const allowed = NEXT_STATUSES[request.status] || [];

  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-sm text-green-dark/50"><Link href="/crm/demandes" className="hover:underline">Demandes d'adoption</Link> / {request.familyFirstName} {request.familyLastName}</p>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-green-dark">{request.familyFirstName} {request.familyLastName}</h1>
            <p className="text-sm text-green-dark/60">Pour {request.animalName} · déposée le {formatDate(request.createdAt)}</p>
          </div>
          <span className={`badge ${REQUEST_STATUS_COLORS[request.status]}`}>{REQUEST_STATUS_LABELS[request.status]}</span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Email" value={request.email} />
          <Info label="Téléphone" value={request.phone} />
          <Info label="Adresse" value={request.address || "—"} />
          <Info label="Enfants" value={request.hasChildren ? (request.childrenAges || "Oui") : "Non"} />
          <Info label="Jardin" value={request.hasGarden ? "Oui" : "Non"} />
          <Info label="Autres animaux" value={request.otherAnimals || "—"} />
          <Info label="Absence quotidienne" value={request.dailyAloneHours || "—"} />
          <Info label="Expérience" value={request.experience || "—"} />
        </dl>

        <div className="mt-4 border-t border-black/5 pt-4">
          <p className="label">Motivation</p>
          <p className="text-sm text-green-dark/80">{request.motivation}</p>
        </div>

        {request.meeting && (
          <p className="mt-4 rounded-lg bg-beige px-4 py-3 text-sm text-green-dark">
            Rencontre programmée le {formatDate(request.meeting.date)} à {request.meeting.slot}.
          </p>
        )}

        <div className="mt-5 border-t border-black/5 pt-4">
          <p className="label">Responsable</p>
          <select className="input" value={request.responsibleId || ""} onChange={(e) => assign(e.target.value)}>
            <option value="">Non assigné</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 border-t border-black/5 pt-4">
          <p className="label">Changer le statut</p>
          <div className="flex flex-wrap gap-2">
            {allowed.map((s) => (
              <button key={s} disabled={saving} onClick={() => changeStatus(s)} className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50">
                → {REQUEST_STATUS_LABELS[s]}
              </button>
            ))}
            {request.status === "UNDER_REVIEW" && (
              <button onClick={() => router.push(`/crm/rendez-vous?demande=${request.id}`)} className="btn-primary !px-4 !py-2 text-sm">
                Programmer une rencontre →
              </button>
            )}
            {allowed.length === 0 && request.status !== "UNDER_REVIEW" && (
              <p className="text-sm text-green-dark/50">Aucune transition possible (dossier clos).</p>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}
        </div>

        <p className="mt-4 text-xs text-green-dark/40">Dernière mise à jour : {formatDateTime(request.updatedAt)}</p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-green-dark/40">{label}</p>
      <p className="text-green-dark/80">{value}</p>
    </div>
  );
}
