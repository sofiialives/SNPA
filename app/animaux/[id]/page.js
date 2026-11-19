import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import AnimalCard from "../../../components/AnimalCard";
import { API_URL } from "../../../lib/api";
import { ANIMAL_STATUS_LABELS, ANIMAL_STATUS_COLORS, ANIMAL_TYPE_LABELS, SEX_LABELS, TRIBOOL_LABELS, ageLabel } from "../../../lib/labels";

async function getAnimal(id) {
  const res = await fetch(`${API_URL}/api/animals/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.animal;
}

async function getSimilar(id) {
  const res = await fetch(`${API_URL}/api/animals/${id}/similar`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.animals;
}

export async function generateMetadata({ params }) {
  const animal = await getAnimal(params.id);
  if (!animal) return {};
  return {
    title: `${animal.name} — à adopter au refuge SNPA`,
    description: animal.description.slice(0, 150),
  };
}

export default async function AnimalPage({ params }) {
  const animal = await getAnimal(params.id);
  if (!animal) notFound();
  const similar = await getSimilar(params.id);

  const compatItems = [
    ["Enfants", animal.compatEnfants],
    ["Chats", animal.compatChats],
    ["Chiens", animal.compatChiens],
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-sm text-green-dark/50">Accueil / Catalogue / {animal.name}</p>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl2 border border-black/5 bg-beige text-green-dark/40">
              {animal.mainPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={animal.mainPhotoUrl} alt={animal.name} className="h-full w-full object-cover" />
              ) : (
                "photo principale"
              )}
            </div>
          </div>

          <div>
            <span className={`badge ${ANIMAL_STATUS_COLORS[animal.status]}`}>{ANIMAL_STATUS_LABELS[animal.status]}</span>
            <h1 className="mt-3 text-3xl font-extrabold text-green-dark">{animal.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {[ANIMAL_TYPE_LABELS[animal.type], animal.breed, ageLabel(animal.ageYears, animal.ageMonths), SEX_LABELS[animal.sex]]
                .filter(Boolean)
                .map((t) => (
                  <span key={t} className="badge border border-green/20 bg-ivory text-green-dark">{t}</span>
                ))}
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Description</h2>
            <p className="mt-2 whitespace-pre-line text-green-dark/80">{animal.description}</p>

            <div className="card mt-5 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Santé (résumé public)</p>
              <div className="flex flex-wrap gap-2">
                {animal.vaccinated && <span className="badge bg-green/10 text-green-dark">✓ vacciné</span>}
                {animal.sterilized && <span className="badge bg-green/10 text-green-dark">✓ stérilisé</span>}
                {animal.chipped && <span className="badge bg-green/10 text-green-dark">✓ pucé</span>}
              </div>
              <p className="mt-3 mb-1 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Compatibilité</p>
              <div className="flex flex-wrap gap-2">
                {compatItems.map(([label, v]) => (
                  <span key={label} className="badge border border-black/10 bg-white text-green-dark">
                    {label} : {TRIBOOL_LABELS[v]}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {animal.status === "DISPONIBLE" || animal.status === "RESERVE" ? (
                <Link href={`/animaux/${animal.id}/demande`} className="btn-primary">
                  Déposer une demande d'adoption
                </Link>
              ) : (
                <span className="rounded-full bg-black/5 px-6 py-3 font-medium text-green-dark/60">
                  {animal.status === "EN_SOINS" ? "Actuellement en soins" : "Déjà adopté"}
                </span>
              )}
              <button className="btn-secondary">Partager</button>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Animaux similaires</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {similar.map((a) => (
                <AnimalCard key={a.id} animal={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
