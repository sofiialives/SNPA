"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, ROLE_LABELS } from "../lib/auth";
import Logo from "./Logo";

const NAV = [
  { href: "/crm", label: "Dashboard", roles: null },
  { href: "/crm/animaux", label: "Animaux", roles: ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF", "VETERINARIAN"] },
  { href: "/crm/demandes", label: "Demandes d'adoption", roles: ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF"] },
  { href: "/crm/rendez-vous", label: "Rendez-vous", roles: ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF"] },
  { href: "/crm/promenades", label: "Promenades", roles: null },
  { href: "/crm/dossiers-medicaux", label: "Dossiers médicaux", roles: ["ADMINISTRATOR", "VETERINARIAN", "STAFF"] },
  { href: "/crm/statistiques", label: "Statistiques", roles: ["ADMINISTRATOR", "ADOPTION_MANAGER", "STAFF"] },
  { href: "/crm/equipe", label: "Équipe et rôles", roles: ["ADMINISTRATOR"] },
];

export default function CrmShell({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const visibleNav = NAV.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-ivory">
      <aside className="hidden w-60 shrink-0 border-r border-black/5 bg-white md:block">
        <div className="border-b border-black/5 px-5 py-4">
          <Link href="/crm" className="flex items-center gap-1.5 font-bold text-green-dark">
            <Logo />
            <span className="text-xs font-semibold text-green-dark/40">CRM</span>
          </Link>
        </div>
        <nav className="space-y-0.5 p-3">
          {visibleNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/crm" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-green text-white" : "text-green-dark hover:bg-beige"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white px-4 py-3 sm:px-6">
          <select
            className="rounded-lg border border-black/10 bg-ivory px-3 py-1.5 text-sm text-green-dark md:hidden"
            value={pathname}
            onChange={(e) => router.push(e.target.value)}
          >
            {visibleNav.map((item) => (
              <option key={item.href} value={item.href}>{item.label}</option>
            ))}
          </select>
          <span className="hidden text-sm text-green-dark/50 md:block">SNPA CRM</span>
          <div className="flex items-center gap-3">
            <span className="badge border border-green/20 bg-ivory text-xs text-green-dark">
              Rôle : {ROLE_LABELS[user.role]}
            </span>
            <span className="hidden text-sm text-green-dark sm:block">{user.firstName} {user.lastName}</span>
            <button onClick={logout} className="text-sm font-medium text-terracotta hover:underline">
              Déconnexion
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
