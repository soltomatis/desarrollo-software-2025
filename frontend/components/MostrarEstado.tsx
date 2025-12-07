"use client";

import React, { useState } from "react";

interface MostrarEstadoProps {
  onSearch: (fechaDesde: string, fechaHasta: string) => void;
}

export default function MostrarEstado({ onSearch }: MostrarEstadoProps) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const manejarClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (desde && hasta) {
      onSearch(desde, hasta);
    } else {
      alert("Por favor selecciona ambas fechas");
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        width: "100%", // 🔹 ocupa todo el ancho disponible
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Filtrar por Fecha</h3>
      <form
        onSubmit={manejarClick}
        style={{
          display: "flex",
          flexWrap: "wrap", // 🔹 permite que se apilen en pantallas pequeñas
          gap: "15px",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "5px" }}>
            Fecha Desde:
          </label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="nav-option"
            style={{ width: "100%" }} // 🔹 input ocupa todo el ancho
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "5px" }}>
            Fecha Hasta:
          </label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="nav-option"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <button
            type="submit"
            className="nav-option nav-option-secondary"
            style={{ width: "100%", minWidth: "120px" }} // 🔹 botón más adaptable
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}