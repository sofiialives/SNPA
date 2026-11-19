"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../../lib/auth";
import CrmShell from "../../components/CrmShell";

function Guard({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/crm/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLogin) router.replace("/crm/login");
    if (user && isLogin) router.replace("/crm");
  }, [loading, user, isLogin, router]);

  if (isLogin) return children;
  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-green-dark/50">Chargement...</div>;
  }
  return <CrmShell>{children}</CrmShell>;
}

export default function CrmLayout({ children }) {
  return (
    <AuthProvider>
      <Guard>{children}</Guard>
    </AuthProvider>
  );
}
