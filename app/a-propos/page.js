import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "À propos du refuge — SNPA",
  description: "Découvrez le refuge SNPA, notre équipe et comment se déroule une adoption.",
};

const STEPS = [
  { n: 1, title: "Parcourez nos animaux", text: "Consultez les fiches de nos pensionnaires et trouvez celui qui vous correspond." },
  { n: 2, title: "Déposez une demande", text: "Remplissez le formulaire en ligne : notre équipe l'examine sous quelques jours." },
  { n: 3, title: "Rencontre au refuge", text: "Une rencontre est organisée le samedi, puis nous validons ensemble l'adoption." },
];

const TEAM = [
  { name: "Sophie Morin", role: "Responsable du refuge" },
  { name: "Inès Benali", role: "Soigneuse" },
  { name: "Karim Djebbar", role: "Accueil & adoptions" },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-terracotta">À propos du refuge</p>
            <h1 className="text-2xl font-bold text-green-dark sm:text-3xl">Un refuge à taille humaine</h1>
            <p className="mt-4 text-green-dark/80">
              Le refuge SNPA accueille, soigne et accompagne vers l'adoption des chiens, chats et autres
              animaux abandonnés ou recueillis. Toute notre équipe veille à ce que chaque animal reçoive
              les soins et l'attention dont il a besoin jusqu'à trouver une famille.
            </p>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl2 border border-black/5 bg-beige text-green-dark/40">
            photo du refuge
          </div>
        </div>

        <section className="mt-16">
          <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Comment ça marche</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 font-semibold text-green-dark">
                  {s.n}
                </div>
                <p className="font-semibold text-green-dark">{s.title}</p>
                <p className="mt-1 text-sm text-green-dark/70">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-green-dark/50">L'équipe</p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center">
                <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-beige text-xs text-green-dark/40">
                  photo
                </div>
                <p className="font-medium text-green-dark">{m.name}</p>
                <p className="text-xs text-green-dark/60">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
