import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { API_URL } from "../../../lib/api";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, formatDate } from "../../../lib/labels";

async function getTracking(token) {
  try {
    const res = await fetch(`${API_URL}/api/adoption-requests/track/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const metadata = { title: "Suivi de votre demande — SNPA" };

const STEPS = ["NEW", "UNDER_REVIEW", "MEETING_SCHEDULED", "APPROVED", "ADOPTED"];

export default async function SuiviPage({ params, searchParams }) {
  const data = await getTracking(params.token);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        {!data ? (
          <div className="card p-8 text-center">
            <p className="font-semibold text-green-dark">Lien de suivi introuvable</p>
            <p className="mt-2 text-sm text-green-dark/60">
              Vérifiez le lien reçu par email, ou contactez-nous si le problème persiste.
            </p>
          </div>
        ) : (
          <div className="card p-8">
            {searchParams?.nouveau && (
              <p className="mb-5 rounded-lg bg-green/10 px-4 py-3 text-sm text-green-dark">
                Votre demande a bien été envoyée. Conservez ce lien pour suivre son avancement.
              </p>
            )}
            <p className="text-sm text-green-dark/60">Demande d'adoption pour</p>
            <h1 className="text-2xl font-bold text-green-dark">{data.animalName}</h1>
            <p className="mt-1 text-sm text-green-dark/60">Déposée le {formatDate(data.createdAt)}</p>

            <div className="mt-6">
              <span className={`badge text-sm ${REQUEST_STATUS_COLORS[data.status]}`}>
                {REQUEST_STATUS_LABELS[data.status]}
              </span>
            </div>

            {data.status !== "REJECTED" && (
              <ol className="mt-8 space-y-3">
                {STEPS.map((s) => {
                  const reached = STEPS.indexOf(data.status) >= STEPS.indexOf(s) || data.status === "ADOPTED";
                  const current = data.status === s;
                  return (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          reached ? "bg-green text-white" : "bg-black/10 text-green-dark/40"
                        }`}
                      >
                        {reached ? "✓" : ""}
                      </span>
                      <span className={current ? "font-semibold text-green-dark" : "text-green-dark/70"}>
                        {REQUEST_STATUS_LABELS[s]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            {data.meeting && (
              <p className="mt-6 rounded-lg bg-beige px-4 py-3 text-sm text-green-dark">
                Rencontre programmée le {formatDate(data.meeting.date)} à {data.meeting.slot}, au refuge.
              </p>
            )}

            <p className="mt-8 text-xs text-green-dark/50">
              Dernière mise à jour le {formatDate(data.updatedAt)}. Pour toute question, contactez-nous.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
