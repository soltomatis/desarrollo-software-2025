"use client";

import { useState } from "react";
import Link from "next/link";
import ToastNotification from "@/components/ToastNotification";
import { AuthGate } from "@/components/AuthGate";

export default function CancelarReservaPage() {
  const [criterios, setCriterios] = useState({
    apellido: "",
    nombre: "",
    numeroHabitacion: "",
    tipoHabitacion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [reservas, setReservas] = useState<any[]>([]);
  const [reservasSeleccionadas, setReservasSeleccionadas] = useState<Set<number>>(new Set());
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const validarFormulario = (): boolean => {
    if (!criterios.apellido.trim()) {
      setErrorValidacion("El campo apellido no puede estar vacío");
      return false;
    }
    setErrorValidacion("");
    return true;
  };

  const buscarReservas = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    setMostrarResultados(false);
    setReservas([]);
    setReservasSeleccionadas(new Set());

    try {
      const params = new URLSearchParams();
      Object.entries(criterios).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });

      const response = await fetch(`/api/reservas/buscar?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al buscar reservas");

      const data = await response.json();
      setReservas(data);
      setMostrarResultados(true);
    } catch (error: any) {
      setToast({ message: error.message || "Error al buscar reservas", type: "error" });
    } finally {
      setCargando(false);
    }
  };

  const cancelarReservas = async () => {
    if (reservasSeleccionadas.size === 0) {
      setToast({ message: "Debe seleccionar al menos una reserva", type: "error" });
      return;
    }

    if (!window.confirm("¿Está seguro que desea cancelar las reservas seleccionadas?")) return;

    setCargando(true);
    try {
      const response = await fetch("/api/reservas/cancelar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idsReservas: Array.from(reservasSeleccionadas) }),
      });

      if (!response.ok) throw new Error("Error al cancelar reservas");

      const resultado = await response.json();
      setToast({ message: resultado.mensaje || "Reservas canceladas", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Error al cancelar reservas", type: "error" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthGate>
      <div style={{ padding: "40px" }}>
        <h1>Cancelar Reserva</h1>
        <Link href="/">← Volver al inicio</Link>

        {/* Formulario de búsqueda */}
        {/* ... resto del formulario igual, usando buscarReservas y cancelarReservas ... */}

        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthGate>
  );
}