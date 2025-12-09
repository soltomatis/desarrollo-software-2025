"use client";

import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";

const optionsByRole: Record<string, { href: string; label: string; actionId: string }[]> = {
  ROLE_ADMIN: [
    { href: "/habitaciones/estado", label: "📊 Visualizar Estado de Habitaciones", actionId: "estado" },
    { href: "/reservas", label: "📅 Reservar Habitaciones", actionId: "reservar" },
    { href: "/cancelar-reserva", label: "❌ Cancelar Reserva", actionId: "cancelar" },
    { href: "/huespedes/busqueda", label: "🗑️ Dar de baja Huésped", actionId: "baja" },
    { href: "/huespedes/busqueda", label: "️✏️ Modificar Huésped", actionId: "modificar" },
    { href: "/facturar", label: "📑 Facturar", actionId: "facturar" },
  ],
  ROLE_CONSERJE: [
    { href: "/habitaciones/estado", label: "📊 Visualizar Estado de Habitaciones", actionId: "estado" },
    { href: "/reservas", label: "📅 Reservar Habitaciones", actionId: "reservar" },
    { href: "/cancelar-reserva", label: "❌ Cancelar Reserva", actionId: "cancelar" },
    { href: "/huespedes/busqueda", label: "🗑️ Dar de baja Huésped", actionId: "baja" },
    { href: "/huespedes/busqueda", label: "️✏️ Modificar Huésped", actionId: "modificar" },
    { href: "/facturar", label: "📑 Facturar", actionId: "facturar" },
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
                key={opt.actionId}
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