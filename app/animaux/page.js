import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AnimalCard from "../../components/AnimalCard";
import CatalogueFilters from "../../components/CatalogueFilters";
import { API_URL } from "../../lib/api";

export const metadata = {
  title: "Nos animaux à l'adoption — SNPA, le refuge animalier",
  description: "Parcourez les chiens, chats et autres animaux disponibles à l'adoption au refuge SNPA.",
};

async function getAnimals(searchParams) {
  const sp = new URLSearchParams();
  if (searchParams.type) sp.set("type", searchParams.type);
  if (searchParams.enfants) sp.set("enfants", searchParams.enfants);
  if (searchParams.chats) sp.set("chats", searchParams.chats);
  if (searchParams.chiens) sp.set("chiens", searchParams.chiens);

  try {
    const res = await fetch(`${API_URL}/api/animals?${sp.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.animals;
  } catch {
    return [];
  }
}

export default async function CataloguePage({ searchParams }) {
  const animals = await getAnimals(searchParams);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="mb-1 text-sm text-green-dark/50">Accueil / Catalogue</p>
        <h1 className="mb-6 text-2xl font-bold text-green-dark">Nos animaux à l'adoption</h1>
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <CatalogueFilters />
          <div>
            <p className="mb-4 text-sm text-green-dark/60">
              {animals.length} animal{animals.length > 1 ? "aux" : ""} disponible{animals.length > 1 ? "s" : ""}
            </p>
            {animals.length === 0 ? (
              <p className="card p-8 text-center text-green-dark/60">
                Aucun animal ne correspond à ces critères pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {animals.map((a) => (
                  <AnimalCard key={a.id} animal={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
