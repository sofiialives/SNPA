import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import AnimalCard from "../components/AnimalCard";
import { API_URL } from "../lib/api";

async function getLongestWaiting() {
  try {
    const res = await fetch(`${API_URL}/api/animals/longest-waiting?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.animals;
  } catch {
    return [];
  }
}

const REASONS = [
  {
    title: "Des animaux suivis avec soin",
    text: "Chaque pensionnaire a un dossier médical à jour, tenu par notre équipe et notre vétérinaire.",
  },
  {
    title: "Un accompagnement avant et après l'adoption",
    text: "Rencontre encadrée, conseils personnalisés : nous vous aidons à trouver le compagnon qui vous correspond.",
  },
  {
    title: "Une équipe locale, disponible",
    text: "Nos bénévoles et notre personnel sont présents toute la semaine pour répondre à vos questions.",
  },
];

export default async function HomePage() {
  const waiting = await getLongestWaiting();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-terracotta">
              SNPA · Le refuge animalier
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-green-dark sm:text-4xl">
              Chaque patte mérite un foyer.
            </h1>
            <p className="mt-4 max-w-md text-green-dark/80">
              Découvrez les chiens, chats et autres animaux qui attendent une famille au refuge SNPA,
              et suivez facilement votre demande d'adoption, du premier regard jusqu'à l'adoption.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/animaux" className="btn-primary">Voir les animaux</Link>
              <Link href="/a-propos" className="btn-secondary">Comment ça marche</Link>
            </div>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl2 border border-black/5 bg-beige text-green-dark/40">
            photo / vidéo du refuge
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-green-dark/50">
            Trois raisons de nous choisir
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-green-dark">
                  ●
                </div>
                <p className="font-semibold text-green-dark">{r.title}</p>
                <p className="mt-1.5 text-sm text-green-dark/70">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {waiting.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-green-dark/50">
                  Animaux qui cherchent un foyer
                </p>
                <p className="mt-1 text-sm text-green-dark/60">
                  Ils attendent depuis le plus longtemps — ce sont souvent eux qu'on oublie de regarder.
                </p>
              </div>
              <Link href="/animaux" className="hidden text-sm font-medium text-terracotta hover:underline sm:block">
                Voir tous les animaux →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {waiting.map((a) => (
                <AnimalCard key={a.id} animal={a} />
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-green-dark">Une question avant d'adopter ?</p>
              <p className="mt-1 text-sm text-green-dark/70">Notre équipe vous répond directement, sans détour.</p>
            </div>
            <Link href="/contact" className="btn-secondary shrink-0">Nous contacter</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
