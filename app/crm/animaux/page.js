"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import { api } from "../../../lib/api";
import { ANIMAL_STATUS_LABELS, ANIMAL_STATUS_COLORS, ANIMAL_TYPE_LABELS, ageLabel } from "../../../lib/labels";

const TABS = ["TOUS", "DISPONIBLE", "RESERVE", "EN_SOINS", "ADOPTE"];

export default function AnimauxListPage() {
  const { token, user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [tab, setTab] = useState("TOUS");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/animals?publicOnly=false", { token })
      .then((r) => setAnimals(r.animals))
      .finally(() => setLoading(false));
  }, [token]);

  const canCreate = ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF"].includes(user.role);

  const filtered = animals
    .filter((a) => tab === "TOUS" || a.status === tab)
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-green-dark">Animaux</h1>
        {canCreate && (
          <Link href="/crm/animaux/nouveau" className="btn-primary !px-4 !py-2 text-sm">+ Ajouter un animal</Link>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                tab === t ? "border-green bg-green text-white" : "border-black/10 bg-white text-green-dark"
              }`}
            >
              {t === "TOUS" ? "Tous" : ANIMAL_STATUS_LABELS[t]}
            </button>
          ))}
        </div>
        <input
          placeholder="Rechercher..."
          className="input w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-green-dark/50">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Type · Race</th>
              <th className="px-4 py-3">Âge</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Promenades</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-green-dark/50" colSpan={6}>Chargement...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td className="px-4 py-6 text-green-dark/50" colSpan={6}>Aucun animal.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-black/5 last:border-0 hover:bg-beige/30">
                <td className="px-4 py-3 font-medium text-green-dark">{a.name}</td>
                <td className="px-4 py-3 text-green-dark/70">{ANIMAL_TYPE_LABELS[a.type]} · {a.breed || "—"}</td>
                <td className="px-4 py-3 text-green-dark/70">{ageLabel(a.ageYears, a.ageMonths)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${ANIMAL_STATUS_COLORS[a.status]}`}>{ANIMAL_STATUS_LABELS[a.status]}</span>
                </td>
                <td className="px-4 py-3">
                  {a.walkBanned ? (
                    <span className="badge bg-red-100 text-red-700">interdites</span>
                  ) : (
                    <span className="badge bg-green/10 text-green-dark">autorisées</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/crm/animaux/${a.id}`} className="text-sm font-medium text-terracotta hover:underline">
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-green-dark/50">
        Le statut « Réservé » est appliqué dès qu'une demande est approuvée — l'animal ne peut pas être réservé à nouveau tant que ce statut est actif.
      </p>
    </div>
  );
}
