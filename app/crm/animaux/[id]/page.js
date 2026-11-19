"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../lib/auth";
import { api } from "../../../../lib/api";
import { ANIMAL_STATUS_LABELS, ANIMAL_STATUS_COLORS, ANIMAL_TYPE_LABELS, SEX_LABELS, ageLabel } from "../../../../lib/labels";

export default function AnimalDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const canEdit = ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF", "VETERINARIAN"].includes(user.role);

  async function load() {
    const data = await api.get(`/api/animals/${id}`, { token });
    setAnimal(data.animal);
  }

  useEffect(() => { load(); }, [id]);

  async function updateStatus(status) {
    setSaving(true);
    setMessage(null);
    try {
      const data = await api.patch(`/api/animals/${id}`, { status }, { token });
      setAnimal(data.animal);
      setMessage({ ok: true, text: "Statut mis à jour." });
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleWalkBan(banned) {
    const reason = banned ? prompt("Motif de l'interdiction de sortie :") : null;
    if (banned && !reason) return;
    setSaving(true);
    try {
      const data = await api.patch(`/api/animals/${id}/walk-ban`, { banned, reason }, { token });
      setAnimal(data.animal);
    } finally {
      setSaving(false);
    }
  }

  if (!animal) return <p className="text-green-dark/50">Chargement...</p>;

  return (
    <div className="max-w-3xl space-y-5">
      <p className="text-sm text-green-dark/50"><Link href="/crm/animaux" className="hover:underline">Animaux</Link> / {animal.name}</p>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-green-dark">{animal.name}</h1>
            <p className="mt-1 text-sm text-green-dark/60">
              {ANIMAL_TYPE_LABELS[animal.type]} · {animal.breed || "—"} · {ageLabel(animal.ageYears, animal.ageMonths)} · {SEX_LABELS[animal.sex]}
            </p>
          </div>
          <span className={`badge ${ANIMAL_STATUS_COLORS[animal.status]}`}>{ANIMAL_STATUS_LABELS[animal.status]}</span>
        </div>

        <p className="mt-4 whitespace-pre-line text-green-dark/80">{animal.description}</p>

        {canEdit && (
          <div className="mt-5 border-t border-black/5 pt-4">
            <p className="label">Changer le statut</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ANIMAL_STATUS_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  disabled={saving || animal.status === val}
                  onClick={() => updateStatus(val)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium disabled:opacity-40 ${
                    animal.status === val ? "border-green bg-green text-white" : "border-black/10 bg-white text-green-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {animal.status === "EN_SOINS" && (
              <p className="mt-2 text-xs text-terracotta">
                Tant que ce statut est actif, aucune demande d'adoption ne peut être déposée pour {animal.name}.
              </p>
            )}
          </div>
        )}

        <div className="mt-5 border-t border-black/5 pt-4">
          <p className="label">Promenades</p>
          {animal.walkBanned ? (
            <div>
              <span className="badge bg-red-100 text-red-700">Interdites{animal.walkBanReason ? ` — ${animal.walkBanReason}` : ""}</span>
              {canEdit && (
                <button onClick={() => toggleWalkBan(false)} disabled={saving} className="ml-3 text-sm font-medium text-terracotta hover:underline">
                  Lever l'interdiction
                </button>
              )}
            </div>
          ) : (
            <div>
              <span className="badge bg-green/10 text-green-dark">Autorisées</span>
              {canEdit && (
                <button onClick={() => toggleWalkBan(true)} disabled={saving} className="ml-3 text-sm font-medium text-terracotta hover:underline">
                  Interdire les sorties
                </button>
              )}
            </div>
          )}
        </div>

        {message && (
          <p className={`mt-4 text-sm ${message.ok ? "text-green-dark" : "text-terracotta"}`}>{message.text}</p>
        )}
      </div>

      <Link href={`/crm/dossiers-medicaux?animal=${animal.id}`} className="btn-secondary !px-4 !py-2 text-sm">
        Voir le dossier médical →
      </Link>
    </div>
  );
}
