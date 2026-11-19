// Tous les intitulés visibles par l'équipe sont en français — demande explicite de Sophie
// ("Karim ne parle pas anglais"). Les valeurs stockées en base restent des codes techniques
// stables (ex. UNDER_REVIEW) ; seul l'affichage est traduit ici, en un seul endroit.

export const ANIMAL_STATUS_LABELS = {
  DISPONIBLE: "Disponible",
  RESERVE: "Réservé",
  ADOPTE: "Adopté",
  EN_SOINS: "En soins",
};

export const ANIMAL_STATUS_COLORS = {
  DISPONIBLE: "bg-green/10 text-green-dark",
  RESERVE: "bg-sage/20 text-green-dark",
  ADOPTE: "bg-black/10 text-green-dark/70",
  EN_SOINS: "bg-terracotta-light/25 text-terracotta",
};

export const REQUEST_STATUS_LABELS = {
  NEW: "Nouvelle",
  UNDER_REVIEW: "En cours d'examen",
  MEETING_SCHEDULED: "Rencontre programmée",
  APPROVED: "Approuvée",
  REJECTED: "Refusée",
  ADOPTED: "Adoptée",
};

export const REQUEST_STATUS_COLORS = {
  NEW: "bg-sage/20 text-green-dark",
  UNDER_REVIEW: "bg-terracotta-light/25 text-terracotta",
  MEETING_SCHEDULED: "bg-green/10 text-green-dark",
  APPROVED: "bg-green text-white",
  REJECTED: "bg-red-100 text-red-700",
  ADOPTED: "bg-green-dark text-white",
};

export const ANIMAL_TYPE_LABELS = {
  CHIEN: "Chien",
  CHAT: "Chat",
  AUTRE: "Autre",
};

export const SEX_LABELS = { MALE: "Mâle", FEMELLE: "Femelle" };

export const TRIBOOL_LABELS = { OUI: "Oui", NON: "Non", INCONNU: "Non renseigné" };

export const WALK_STATUS_LABELS = {
  RESERVED: "Réservée",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELED: "Annulée",
};

export function ageLabel(years, months) {
  if (years === 0 && months > 0) return `${months} mois`;
  if (years > 0 && months > 0) return `${years} an${years > 1 ? "s" : ""} ${months} mois`;
  return `${years} an${years > 1 ? "s" : ""}`;
}

export function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
