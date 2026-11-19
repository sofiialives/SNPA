import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BenevoleForm from "./BenevoleForm";

export const metadata = { title: "Devenir bénévole — SNPA" };

export default function BenevolatPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-terracotta">Bénévolat</p>
        <h1 className="mb-4 text-2xl font-bold text-green-dark">Devenir bénévole promeneur</h1>
        <p className="mb-8 text-green-dark/80">
          Nos bénévoles promènent les animaux du refuge toute la semaine, de 9h à 18h. Après inscription,
          votre compte est validé par l'administrateur du refuge avant de pouvoir réserver vos créneaux.
        </p>
        <BenevoleForm />
      </main>
      <SiteFooter />
    </>
  );
}
