import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact — SNPA, le refuge animalier" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-green-dark">Contact</h1>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="label">Adresse</p>
            <p className="mb-4 text-green-dark/80">12 chemin du Refuge, 76000 Rouen</p>
            <p className="label">Téléphone</p>
            <p className="mb-4 text-green-dark/80">02 35 00 00 00</p>
            <p className="label">Email</p>
            <p className="mb-4 text-green-dark/80">contact@snpa-refuge.fr</p>
            <p className="label">Horaires d'ouverture</p>
            <p className="mb-4 text-green-dark/80">Mardi – samedi, 10h – 18h</p>
            <div className="mt-6 flex aspect-video items-center justify-center rounded-xl2 border border-black/5 bg-beige text-sm text-green-dark/40">
              carte
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-dark/50">Nous écrire</p>
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
