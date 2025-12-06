"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { Huesped, CriteriosBusquedaHuesped, TipoDocumento } from "@/interfaces/Huesped";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";

const tiposDocumentoDisponibles: TipoDocumento[] = ["DNI", "LE", "LC", "Pasaporte", "Otro"];

export default function PaginaBuscarHuesped() {
  const router = useRouter();
  const [criterios, setCriterios] = useState<CriteriosBusquedaHuesped>({
    apellido: "",
    nombre: "",
    tipo_documento: "",
    num_documento: "",
  });

  const [resultadosBusqueda, setResultadosBusqueda] = useState<Huesped[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [huespedSeleccionado, setHuespedSeleccionado] = useState<Huesped | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCriterios({ ...criterios, [e.target.name]: e.target.value });
  };

  const manejarBusqueda = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setBusquedaRealizada(true);
    setResultadosBusqueda([]);

    try {
      const params = new URLSearchParams(criterios as any);
      const respuesta = await fetch(`/api/huespedes/buscar?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) throw new Error("Error en la búsqueda");
      const datos: Huesped[] = await respuesta.json();
      setResultadosBusqueda(datos);
    } catch (error: any) {
      alert(error.message || "Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const manejarSiguiente = () => {
    if (huespedSeleccionado) {
      sessionStorage.setItem("huespedParaBorrar", JSON.stringify(huespedSeleccionado));
      router.push(`/huespedes/borrar?id=${huespedSeleccionado.id}`);
    }
  };

  return (
    <AuthGate>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <h1>🗑️ Buscar Huésped para Eliminar</h1>
        {/* Formulario y tabla igual, usando manejarBusqueda y manejarSiguiente */}
      </div>
    </AuthGate>
  );
}