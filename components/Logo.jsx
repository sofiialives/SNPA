// Emplacement réservé pour le logo officiel SNPA, en attente de validation par le
// conseil d'administration (cf. retour de Sophie Morin). Marque simple et générique,
// à remplacer par le logo définitif dès validation — ne pas enrichir ce placeholder.
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="30" r="10" fill="#2E4238" />
        <circle cx="10" cy="17" r="5.5" fill="#2E4238" />
        <circle cx="23" cy="9" r="5.5" fill="#2E4238" />
        <circle cx="36" cy="17" r="5.5" fill="#2E4238" />
      </svg>
      <span className="font-extrabold tracking-tight text-green-dark">SNPA</span>
    </span>
  );
}
