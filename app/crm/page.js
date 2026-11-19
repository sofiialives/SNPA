"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, formatDate } from "../../lib/labels";

const CAN_SEE_REQUESTS = ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF"];

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [animalsTotal, setAnimalsTotal] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date().toISOString().slice(0, 10);
    setToday(d);

    api.get("/api/animals?publicOnly=false", { token }).then((r) => setAnimalsTotal(r.animals.length)).catch(() => {});

    if (CAN_SEE_REQUESTS.includes(user.role)) {
      api.get("/api/adoption-requests", { token }).then((r) => setRequests(r.requests)).catch(() => {});
    }
    if (user.role === "ADMINISTRATOR") {
      api.get("/api/team/pending", { token }).then((r) => setPendingVolunteers(r.users)).catch(() => {});
    }
    if (["ADMINISTRATOR", "VETERINARIAN", "STAFF"].includes(user.role)) {
      api.get("/api/medical-records/vaccine-reminders", { token }).then((r) => setReminders(r.reminders)).catch(() => {});
    }
  }, [user, token]);

  const activeRequests = requests.filter((r) => !["REJECTED", "ADOPTED"].includes(r.status));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-green-dark">Bonjour {user.firstName} 👋</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Animaux au total" value={animalsTotal} />
        {CAN_SEE_REQUESTS.includes(user.role) && (
          <StatCard label="Demandes en cours" value={activeRequests.length} />
        )}
        {user.role === "ADMINISTRATOR" && (
          <StatCard label="Bénévoles en attente" value={pendingVolunteers.length} href="/crm/equipe" />
        )}
        <StatCard label="Rappels vaccins (30 j)" value={reminders.length} href="/crm/dossiers-medicaux" />
      </div>

      {CAN_SEE_REQUESTS.includes(user.role) && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-dark/50">Dernières demandes</p>
            <Link href="/crm/demandes" className="text-sm text-terracotta hover:underline">Tout voir →</Link>
          </div>
          <div className="divide-y divide-black/5">
            {requests.slice(0, 5).map((r) => (
              <Link key={r.id} href={`/crm/demandes/${r.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-beige/40">
                <span className="text-green-dark">{r.familyFirstName} {r.familyLastName} — {r.animalName}</span>
                <span className={`badge ${REQUEST_STATUS_COLORS[r.status]}`}>{REQUEST_STATUS_LABELS[r.status]}</span>
              </Link>
            ))}
            {requests.length === 0 && <p className="py-4 text-sm text-green-dark/50">Aucune demande pour le moment.</p>}
          </div>
        </div>
      )}

      {reminders.length > 0 && (
        <div className="card p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Rappels de vaccin à venir</p>
          <ul className="space-y-1.5 text-sm text-green-dark">
            {reminders.map((r) => (
              <li key={r.id}>
                <Link href={`/crm/dossiers-medicaux?animal=${r.animal_id}`} className="hover:text-terracotta">
                  {r.animal_name} — rappel le {formatDate(r.vaccine_reminder_date)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Raccourcis</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/crm/promenades" className="btn-secondary !px-4 !py-2 text-sm">Promenades du jour</Link>
          {CAN_SEE_REQUESTS.includes(user.role) && (
            <Link href="/crm/rendez-vous" className="btn-secondary !px-4 !py-2 text-sm">Rendez-vous</Link>
          )}
          <Link href="/crm/animaux" className="btn-secondary !px-4 !py-2 text-sm">Animaux</Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }) {
  const content = (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-dark/50">{label}</p>
      <p className="mt-1 text-2xl font-bold text-green-dark">{value === null ? "—" : value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
