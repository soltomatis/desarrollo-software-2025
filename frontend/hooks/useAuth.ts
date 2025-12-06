"use client";

import { useState, useEffect, useCallback } from "react";

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

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const checkSession = useCallback(async () => {
    const token = getToken();
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
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    // Incluso con skipInitialCheck, si hay token, validamos para poblar user
    if (skipInitialCheck) {
      const token = getToken();
      if (token) {
        checkSession();
      } else {
        setLoading(false);
      }
      return;
    }
    checkSession();
  }, [skipInitialCheck, checkSession, getToken]);

  // Escuchar cambios de token (logout/login desde otra pestaña, etc.)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setLoading(true);
        checkSession();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [checkSession]);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Credenciales inválidas");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setUser({ username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, logout };
}