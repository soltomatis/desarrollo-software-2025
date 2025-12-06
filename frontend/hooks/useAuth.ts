"use client";

import { useState, useEffect } from "react";

interface User {
  username: string;
  role: string;
}

interface UseAuthOptions {
  skipInitialCheck?: boolean;
}

export function useAuth({ skipInitialCheck = false }: UseAuthOptions = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔎 Chequeo inicial de sesión con JWT
  useEffect(() => {
    if (skipInitialCheck) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.username, role: data.role });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error al verificar sesión:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [skipInitialCheck]);

  // 🔑 Login con JWT
  const login = async (username: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data = await res.json();

    // Guardamos el token JWT
    localStorage.setItem("token", data.token);

    setUser({ username: data.username, role: data.role });
    return data;
  };

  // 🚪 Logout con JWT
  const logout = () => {
    localStorage.removeItem("token"); // basta con borrar el token
    setUser(null);
  };

  return { user, loading, login, logout };
}