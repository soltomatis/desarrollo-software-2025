'use client';

import { useState } from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
import MostrarEstado from '@/components/MostrarEstado'; 
import Link from 'next/link';


async function traerHabitaciones(desde: string, hasta: string) {

  const res = await fetch(`http://localhost:8080/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`);
  if (!res.ok) throw new Error('Error al conectar con el servidor');
  return res.json();
}

export default function PaginaEstado() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState(false);

  const buscar = async (desde: string, hasta: string) => {
    setCargando(true);
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

      <MostrarEstado onSearch={buscar} />

      {cargando && <p>Cargando datos...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {habitaciones.map((hab) => (
          <div key={hab.numeroHabitacion} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h2 style={{ margin: 0 }}>Habitación {hab.numeroHabitacion}</h2>
            <p>Tipo: {hab.tipo}</p>
            <p>Capacidad: {hab.cantidadHuespedes} personas</p>
            
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
              <strong>Estados en este rango:</strong>
              <ul>
                {hab.historiaEstados.map((estado, index) => (
                  <li key={index}> 
                    {estado.estado} ({estado.fechaInicio} - {estado.fechaFin})
                  </li>
                ))}
                {hab.historiaEstados.length === 0 && <li>Sin cambios de estado (Disponible)</li>}
              </ul>
            </div>
          </div>
        ))}
      </div>
        <Link href="/" style={{ display: 'block', marginBottom: '20px', color: 'blue' }}>← Volver al inicio</Link>
    </div>
  );
}