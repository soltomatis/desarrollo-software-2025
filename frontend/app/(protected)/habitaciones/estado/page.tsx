"use client";

import { useState } from "react";
import { Habitacion } from "@/interfaces/Habitacion";
import GrillaDisponibilidad from "@/components/GrillaDisponibilidad";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import MostrarEstado from "@/components/MostrarEstado";

export default function ConsultarEstadoHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string; hasta: string } | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const buscar = async (desde: string, hasta: string) => {
    setCargando(true);
    setError(null);
    setFechasBusqueda({ desde, hasta });
    setHabitaciones([]);

    try {
      const res = await fetch(`/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al conectar con el servidor");
      const datos = await res.json();
      setHabitaciones(datos);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthGate>
      <div className="container" style={{ padding: "40px", color: "#333" }}>
        <h1>Estado de Habitaciones</h1>
        <Link href="/" style={{ display: "block", marginBottom: "20px", color: "blue" }}>
          ← Volver al inicio
        </Link>

        {/* 🔹 Usamos el componente MostrarEstado para el formulario */}
        <MostrarEstado onSearch={buscar} />

        {cargando && <p>Cargando datos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 🔹 Si hay habitaciones y fechas, mostramos la grilla */}
        {habitaciones.length > 0 && fechasBusqueda && (
          <GrillaDisponibilidad
            habitaciones={habitaciones}
            fechaDesde={fechasBusqueda.desde}
            fechaHasta={fechasBusqueda.hasta}
          />
        )}

        {/* 🔹 Si no hay resultados */}
        {habitaciones.length === 0 && fechasBusqueda && !cargando && !error && (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </AuthGate>
  );
}