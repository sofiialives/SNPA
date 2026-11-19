import Link from "next/link";
import Logo from "./Logo";

const LINKS = [
  { href: "/animaux", label: "Nos animaux" },
  { href: "/a-propos", label: "À propos" },
  { href: "/benevolat", label: "Devenir bénévole" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-[15px] font-medium text-green-dark md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-terracotta">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/animaux" className="btn-primary !px-5 !py-2 text-sm">
          Adopter →
        </Link>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-black/5 px-4 py-2 text-sm font-medium text-green-dark md:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 hover:text-terracotta">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
