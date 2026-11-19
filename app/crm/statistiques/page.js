"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { ANIMAL_TYPE_LABELS } from "../../../lib/labels";

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-dark/50">{label}</p>
      <p className="mt-1 text-3xl font-bold text-green-dark">{value}</p>
    </div>
  );
}

export default function StatistiquesPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/api/stats", { token }).then(setStats).catch(() => {});
  }, [token]);

  if (!stats) return <p className="text-green-dark/50">Chargement...</p>;

  const maxMonth = Math.max(1, ...stats.adoptionsByMonth.map((m) => m.count));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-green-dark">Statistiques</h1>
      <p className="text-xs text-green-dark/50">
        Vue d'ensemble du refuge — aucune statistique individuelle par employé n'est affichée ici.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Animaux au refuge" value={stats.animalsTotal} />
        <Stat label="Adoptions totales" value={stats.adoptionsTotal} />
        <Stat label="Demandes refusées" value={stats.rejectedTotal} />
        <Stat label="Délai moyen d'adoption" value={stats.avgDaysToAdopt != null ? `${stats.avgDaysToAdopt} j` : "—"} />
      </div>

      <div className="card p-5">
        <p className="label">Adoptions par mois</p>
        {stats.adoptionsByMonth.length === 0 && <p className="text-sm text-green-dark/50">Pas encore de données.</p>}
        <div className="mt-3 flex items-end gap-3" style={{ height: 160 }}>
          {stats.adoptionsByMonth.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-green" style={{ height: `${Math.max(6, (m.count / maxMonth) * 130)}px` }} />
              <span className="text-xs text-green-dark/60">{m.count}</span>
              <span className="text-[10px] text-green-dark/40">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <p className="label">Animaux présents par type</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {stats.animalsByType.map((t) => (
            <div key={t.type} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-terracotta" />
              <span className="text-sm text-green-dark">{ANIMAL_TYPE_LABELS[t.type] || t.type} — {t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
