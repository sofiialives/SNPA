"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("snpa_token") : null;
    if (!saved) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me", { token: saved })
      .then((data) => {
        setToken(saved);
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("snpa_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("snpa_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("snpa_token");
    setToken(null);
    setUser(null);
    router.push("/crm/login");
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}

export const ROLE_LABELS = {
  ADMINISTRATOR: "Administrateur·rice",
  VETERINARIAN: "Vétérinaire",
  ADOPTION_MANAGER: "Responsable des adoptions",
  STAFF: "Membre du personnel",
  VOLUNTEER: "Bénévole",
};

export { ApiError };
