import { notFound } from "next/navigation";
import SiteHeader from "../../../../components/SiteHeader";
import SiteFooter from "../../../../components/SiteFooter";
import { API_URL } from "../../../../lib/api";
import DemandeForm from "./DemandeForm";

async function getAnimal(id) {
  const res = await fetch(`${API_URL}/api/animals/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.animal;
}

export const metadata = { title: "Demande d'adoption — SNPA" };

export default async function DemandePage({ params }) {
  const animal = await getAnimal(params.id);
  if (!animal) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="mb-1 text-sm text-green-dark/50">Accueil / Catalogue / {animal.name} / Demande</p>
        <h1 className="mb-6 text-2xl font-bold text-green-dark">Demande d'adoption pour {animal.name}</h1>
        <DemandeForm animal={animal} />
      </main>
      <SiteFooter />
    </>
  );
}
