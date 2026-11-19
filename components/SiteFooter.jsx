import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-beige/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm italic text-green-dark/70">Chaque patte mérite un foyer.</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-dark/60">Navigation</h3>
          <ul className="space-y-1.5 text-sm text-green-dark">
            <li><Link href="/animaux" className="hover:text-terracotta">Nos animaux</Link></li>
            <li><Link href="/a-propos" className="hover:text-terracotta">À propos du refuge</Link></li>
            <li><Link href="/benevolat" className="hover:text-terracotta">Devenir bénévole</Link></li>
            <li><Link href="/crm/login" className="hover:text-terracotta">Espace équipe</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-dark/60">Contact</h3>
          <ul className="space-y-1.5 text-sm text-green-dark">
            <li><Link href="/contact" className="hover:text-terracotta">Nous écrire</Link></li>
            <li>Horaires : du mardi au samedi, 10h–18h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 px-4 py-4 text-center text-xs text-green-dark/50">
        © {new Date().getFullYear()} SNPA — Le refuge animalier
      </div>
    </footer>
  );
}
