"use client";

import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";

// 🔹 Definimos las opciones de navegación por rol
const optionsByRole: Record<string, { href: string; label: string }[]> = {
  ROLE_ADMIN: [
    { href: "/habitaciones/estado", label: "📊 Visualizar Estado de Habitaciones" },
    { href: "/reservas", label: "📅 Reservar Habitaciones" },
    { href: "/cancelar-reserva", label: "❌ Cancelar Reserva" },
    { href: "/huespedes/busqueda", label: "️Dar de baja Huésped" },
    { href: "/facturar", label: "📑 Facturar" },
  ],
  ROLE_CONSERJE: [
    { href: "/habitaciones/estado", label: "📊 Visualizar Estado de Habitaciones" },
    { href: "/reservas", label: "📅 Reservar Habitaciones" },
    { href: "/cancelar-reserva", label: "❌ Cancelar Reserva" },
    { href: "/huespedes/busqueda", label: "️Dar de baja Huésped" },
    { href: "/facturar", label: "📑 Facturar" },
  ],
};

export default function Home() {
  const { user } = useAuth();

  return (
    <AuthGate>
      <div className="container" style={{ padding: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Sistema de Gestión Hotelera
        </h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Selecciona una funcionalidad para continuar:
        </p>

        {/* 🔹 Renderizamos las opciones según el rol del usuario */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          {user?.role &&
            optionsByRole[user.role]?.map((opt) => (
              <Link
                key={opt.href}
                href={opt.href}
                className="nav-option nav-option-secondary"
              >
                {opt.label}
              </Link>
            ))}
        </nav>
      </div>
    </AuthGate>
  );
}