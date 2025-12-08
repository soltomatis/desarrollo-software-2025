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
  const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string; hasta: string } | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState("");
  const [cargando, setCargando] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const validarFechaDesde = (fecha: string): boolean => {
    if (!fecha || fecha.trim() === "") {
      setErrorValidacion('La fecha "Desde fecha" es obligatoria');
      return false;
    }
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      setErrorValidacion('La fecha "Desde fecha" tiene un formato inválido');
      return false;
    }
    setErrorValidacion("");
    return true;
  };

  const validarFechaHasta = (fechaDesdeVal: string, fechaHastaVal: string): boolean => {
    if (!fechaHastaVal || fechaHastaVal.trim() === "") {
      setErrorValidacion('La fecha "Hasta fecha" es obligatoria');
      return false;
    }
    const fechaHastaObj = new Date(fechaHastaVal);
    if (isNaN(fechaHastaObj.getTime())) {
      setErrorValidacion('La fecha "Hasta fecha" tiene un formato inválido');
      return false;
    }
    const fechaDesdeObj = new Date(fechaDesdeVal);
    if (fechaHastaObj < fechaDesdeObj) {
      setErrorValidacion('La fecha "Hasta fecha" no puede ser anterior a "Desde fecha"');
      return false;
    }
    setErrorValidacion("");
    return true;
  };

  const consultarEstado = async () => {
    if (!validarFechaDesde(fechaDesde)) {
      document.getElementById("input-fecha-desde")?.focus();
      return;
    }
    if (!validarFechaHasta(fechaDesde, fechaHasta)) {
      document.getElementById("input-fecha-hasta")?.focus();
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
      setFechasBusqueda({ desde: fechaDesde, hasta: fechaHasta });
      setMostrarResultados(true);
    } catch (error: any) {
      setErrorValidacion(error.message || "Error al conectar con el servidor. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const cancelarOperacion = () => {
    setFechaDesde("");
    setFechaHasta("");
    setErrorValidacion("");
    setHabitaciones([]);
    setMostrarResultados(false);
    setFechasBusqueda(null);
    document.getElementById("input-fecha-desde")?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") consultarEstado();
  };

  return (
    <AuthGate>
      <div className="container" style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#333" }}>Estado de Habitaciones</h1>

        <Link href="/" style={{ display: "block", marginBottom: "30px", color: "#0070f3", textDecoration: "none" }}>
          ← Volver al inicio
        </Link>

        {/* Formulario de búsqueda */}
        <div style={{ backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "10px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", color: "#555" }}>Consultar Disponibilidad</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "15px", alignItems: "end" }}>
            <div>
              <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                Desde fecha: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="input-fecha-desde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                autoFocus
              />
            </div>

            <div>
              <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                Hasta fecha: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="input-fecha-hasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
              />
            </div>

            <div>
              <button
                onClick={consultarEstado}
                disabled={cargando}
                className="nav-option nav-option-main"
              >
                {cargando ? "Buscando..." : "Buscar"}
              </button>
            </div>

            <div>
              <button
                onClick={cancelarOperacion}
                disabled={cargando}
                className="nav-option nav-option-secondary"
              >
                CANCELAR
              </button>
            </div>
          </div>

          {errorValidacion && (
            <div style={{ color: "#dc3545", marginTop: "15px", padding: "12px", backgroundColor: "#f8d7da", borderRadius: "5px" }}>
              {errorValidacion}
            </div>
          )}

          {cargando && (
            <div style={{ padding: "15px", backgroundColor: "#e7f3ff", borderRadius: "5px", color: "#0056b3", textAlign: "center" }}>
              Consultando estado de habitaciones...
            </div>
          )}
        </div>

        {/* Resultados */}
        {mostrarResultados && habitaciones.length > 0 && fechasBusqueda && (
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.3rem", color: "#555" }}>
                Resultados ({habitaciones.length} habitaciones)
              </h2>
              <div style={{ fontSize: "0.9rem", color: "#666", backgroundColor: "#f8f9fa", padding: "8px 15px", borderRadius: "5px" }}>
                📆 {new Date(fechasBusqueda.desde).toLocaleDateString("es-AR")} →{" "}
                {new Date(fechasBusqueda.hasta).toLocaleDateString("es-AR")}
              </div>
            </div>

            <GrillaDisponibilidad habitaciones={habitaciones} fechaDesde={fechasBusqueda.desde} fechaHasta={fechasBusqueda.hasta} />
          </div>
        )}

        {mostrarResultados && habitaciones.length === 0 && !cargando && (
          <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🔍</div>
            <h3 style={{ fontSize: "1.3rem", color: "#555", marginBottom: "10px" }}>No se encontraron habitaciones</h3>
            <p style={{ color: "#666" }}>No hay habitaciones disponibles para el rango de fechas seleccionado.</p>
          </div>
        )}
      </div>
    </AuthGate>
  );
}