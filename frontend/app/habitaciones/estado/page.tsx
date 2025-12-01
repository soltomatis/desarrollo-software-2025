'use client';

import { useState } from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
import MostrarEstado from '@/components/MostrarEstado';
import GrillaDisponibilidad from '@/components/GrillaDisponibilidad'; 
import Link from 'next/link';

async function traerHabitaciones(desde: string, hasta: string) {
  const res = await fetch(`http://localhost:8080/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`);
  if (!res.ok) throw new Error('Error al conectar con el servidor');
  return res.json();
}

export default function PaginaEstado() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState(false);
  // Necesitamos guardar las fechas buscadas para pasarlas a la grilla
  const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string, hasta: string } | null>(null);

  const buscar = async (desde: string, hasta: string) => {
    setCargando(true);
    setFechasBusqueda({ desde, hasta }); // Guardamos las fechas
    try {
      const datos = await traerHabitaciones(desde, hasta);
      setHabitaciones(datos);
    } catch (error) {
      alert("Error al buscar habitaciones");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px', color: '#333' }}>
      <h1>Estado de Habitaciones</h1>
      <Link href="/" style={{ display: 'block', marginBottom: '20px', color: 'blue' }}>← Volver al inicio</Link>

      <MostrarEstado onSearch={buscar} />

      {cargando && <p>Cargando datos...</p>}

      {/* Si hay habitaciones Y tenemos rango de fechas, mostramos la Grilla */}
      {habitaciones.length > 0 && fechasBusqueda && (
        <GrillaDisponibilidad 
          habitaciones={habitaciones} 
          fechaDesde={fechasBusqueda.desde} 
          fechaHasta={fechasBusqueda.hasta} 
        />
      )}

      {habitaciones.length === 0 && fechasBusqueda && !cargando && (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}