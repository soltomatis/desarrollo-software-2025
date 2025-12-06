"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type AuthGateProps = {
  children: ReactNode;
  requiredRole?: string; // más flexible para futuros roles
};

export function AuthGate({ children, requiredRole }: AuthGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // esperamos a que termine la carga

    if (!user) {
      router.replace("/login"); // usamos replace para evitar volver atrás
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/403");
    }
  }, [loading, user, requiredRole, router]);

  if (loading) {
    return <p>Cargando sesión...</p>; // aquí podrías poner un spinner
  }

  return <>{children}</>;
}