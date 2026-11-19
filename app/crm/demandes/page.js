"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, formatDate } from "../../../lib/labels";

const TABS = ["TOUS", "NEW", "UNDER_REVIEW", "MEETING_SCHEDULED", "APPROVED", "REJECTED", "ADOPTED"];

export default function DemandesPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("TOUS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/adoption-requests", { token }).then((r) => setRequests(r.requests)).finally(() => setLoading(false));
  }, [token]);

  const filtered = requests.filter((r) => tab === "TOUS" || r.status === tab);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-green-dark">Demandes d'adoption</h1>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              tab === t ? "border-green bg-green text-white" : "border-black/10 bg-white text-green-dark"
            }`}
          >
            {t === "TOUS" ? "Tous" : REQUEST_STATUS_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-green-dark/50">
              <th className="px-4 py-3">Famille</th>
              <th className="px-4 py-3">Animal</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Déposée</th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="px-4 py-6 text-green-dark/50" colSpan={6}>Chargement...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td className="px-4 py-6 text-green-dark/50" colSpan={6}>Aucune demande.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-beige/30">
                <td className="px-4 py-3 text-green-dark">{r.familyFirstName} {r.familyLastName}</td>
                <td className="px-4 py-3 text-green-dark/80">{r.animalName}</td>
                <td className="px-4 py-3"><span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span></td>
                <td className="px-4 py-3 text-green-dark/60">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3 text-green-dark/60">{r.responsibleName || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/crm/demandes/${r.id}`} className="text-sm font-medium text-terracotta hover:underline">Ouvrir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-green-dark/50">
        Cycle de vie : Nouvelle → En cours d'examen → Rencontre programmée → Approuvée/Refusée → Adoptée.
      </p>
    </div>
  );
}
