"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Huesped } from "@/interfaces/Huesped";
import { AuthGate } from "@/components/AuthGate";

export default function PaginaBorrarHuesped() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const huespedId = searchParams.get("id");

  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!huespedId) {
      setError("ID de huésped no encontrado en la URL.");
      setCargando(false);
      return;
    }

    const fetchHuesped = async () => {
      try {
        const respuesta = await fetch(`/api/huespedes/buscarPorId?id=${huespedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!respuesta.ok) throw new Error("Error al cargar huésped");
        const datos: Huesped = await respuesta.json();
        setHuesped(datos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchHuesped();
  }, [huespedId, token]);

  const manejarBorrar = async () => {
    if (!huesped) return;

    try {
      const resVerificar = await fetch(`/api/huespedes/verificar-historial?id=${huesped.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resVerificar.ok) throw new Error("Error al verificar historial");
      const historialCheck = await resVerificar.json();

      if (historialCheck.tieneHistorial) {
        alert(historialCheck.mensaje);
        router.push("/");
        return;
      }

      if (!window.confirm("¿Está seguro que desea borrar este huésped?")) return;

      const resBorrar = await fetch(`/api/huespedes/borrar?id=${huesped.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resBorrar.ok) throw new Error("Error al borrar huésped");

      alert("✅ Huésped eliminado exitosamente.");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthGate>
      <div style={{ padding: "40px" }}>
        <h1>Confirmar Eliminación de Huésped</h1>
        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: "red"