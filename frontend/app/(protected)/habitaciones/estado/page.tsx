"use client";

import { useState } from "react";
import { Habitacion } from "@/interfaces/Habitacion";
import GrillaDisponibilidad from "@/components/GrillaDisponibilidad";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";

export default function ConsultarEstadoHabitaciones() {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState("");
  const [cargando, setCargando] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const consultarEstado = async () => {
    if (!fechaDesde || !fechaHasta) {
      setErrorValidacion("Debe ingresar ambas fechas");
      return;
    }

    setCargando(true);
    setMostrarResultados(false);
    setHabitaciones([]);

    try {
      const res = await fetch(`/api/habitaciones/estado?desde=${fechaDesde}&hasta=${fechaHasta}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al conectar con el servidor");
      const datos = await res.json();
      setHabitaciones(datos);
      setMostrarResultados(true);
    } catch (error: any) {
      setErrorValidacion(error.message || "Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthGate>
      <div style={{ padding: "40px" }}>
        <h1>Estado de Habitaciones</h1>
        <Link href="/">← Volver al inicio</Link>

        {/* Formulario de fechas */}
        {/* ... resto igual, usando consultarEstado ... */}

        {mostrarResultados && <GrillaDisponibilidad habitaciones={habitaciones} fechaDesde={fechaDesde} fechaHasta={fechaHasta} />}
      </div>
    </AuthGate>
  );
}