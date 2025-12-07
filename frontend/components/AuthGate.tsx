"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

type AuthGateProps = {
  children: ReactNode;
  requiredRole?: string; // más flexible para futuros roles
};

export function AuthGate({ children, requiredRole }: AuthGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // ⏳ esperamos a que termine la carga inicial del hook

    // 🔒 Si no hay usuario y no estamos en /login → redirigimos a login
    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    // ✅ Si hay usuario y estamos en /login → redirigimos al home
    if (user && pathname === "/login") {
      router.replace("/");
      return;
    }

    // 🚫 Si hay restricción de rol y no coincide → redirigimos a /403
    if (user && requiredRole && user.role !== requiredRole) {
      router.replace("/403");
    }
  }, [loading, user, requiredRole, pathname, router]);

  // ⏳ Mientras el hook valida sesión, mostramos pantalla de carga
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  // ✅ Si pasó todas las validaciones, renderizamos el contenido protegido
  return <>{children}</>;
}