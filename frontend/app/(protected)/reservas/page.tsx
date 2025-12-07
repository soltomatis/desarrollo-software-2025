'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Habitacion } from '@/interfaces/Habitacion';
import MostrarEstado from '@/components/MostrarEstado';
import GrillaSeleccionReserva, { BloqueSeleccionado, GrillaRef } from '@/components/GrillaSeleccionReserva';
import HabitacionCard, { ReservaHabitacionInfo } from '@/components/HabitacionCard';
import ToastNotification from '@/components/ToastNotification';
import Link from 'next/link';
import { AuthGate } from '@/components/AuthGate';

interface HuespedDTO { /* igual que antes */ }
interface DireccionDTO { /* igual que antes */ }
interface HuespedModalProps { /* igual que antes */ }

export default function PaginaNuevaReserva() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string, hasta: string } | null>(null);
  const [mostrarModalHuesped, setMostrarModalHuesped] = useState(false);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState<BloqueSeleccionado[]>([]);
  const [mostrarBotonReserva, setMostrarBotonReserva] = useState(false);
  const grillaRef = useRef<GrillaRef>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const closeToast = () => setToast(null);

  const cancelarSeleccion = () => {
    if (grillaRef.current) grillaRef.current.limpiarSeleccion();
    else setBloquesSeleccionados([]);
    setMostrarBotonReserva(false);
    setToast({ message: "Selección de reserva rechazada. Seleccione un nuevo rango.", type: 'info' });
  };

  const buscar = async (desde: string, hasta: string) => {
    setCargando(true);
    setHabitaciones([]);
    setFechasBusqueda({ desde, hasta });
    try {
      const res = await fetch(`/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al conectar con el servidor');
      const datos: Habitacion[] = await res.json();
      setHabitaciones(datos);
    } catch (error) {
      setToast({ message: "Error al obtener la disponibilidad.", type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccion = (bloques: BloqueSeleccionado[]) => {
    setBloquesSeleccionados(bloques);
    setMostrarBotonReserva(bloques.length > 0);
  };

  const realizarReserva = async () => {
    if (bloquesSeleccionados.length === 0 || !huespedData.nombre || !huespedData.apellido) {
      alert("Selecciona bloques y completa los datos del huésped principal.");
      return;
    }

    const listaHabitacionesReservadas = bloquesSeleccionados.flatMap(bloque =>
      bloque.habitaciones.map(habNum => {
        const habCompleta = habitaciones.find(h => h.numeroHabitacion === habNum);
        return habCompleta ? {
          habitacion: habCompleta,
          fecha_inicio: bloque.fechaInicio,
          fecha_fin: bloque.fechaFin
        } : null;
      }).filter(Boolean)
    );

    const reservaDTO = { listaHabitacionesReservadas, huespedPrincipal: huespedData };

    const confirmacion = window.confirm(`¿Confirmar la reserva de ${listaHabitacionesReservadas.length} bloques para ${huespedData.nombre} ${huespedData.apellido}?`);
    if (!confirmacion) return;

    try {
      const res = await fetch(`/api/reservas/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservaDTO)
      });
      if (!res.ok) throw new Error('Error al crear reserva');
      setToast({ message: "¡Reserva realizada con éxito! Redirigiendo...", type: 'success' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/');
    } catch (error: any) {
      setToast({ message: `Fallo en la reserva: ${error.message}`, type: 'error' });
    }
  };

  const [huespedData, setHuespedData] = useState<HuespedDTO>({ /* valores iniciales */ });

  const handleChangeHuesped = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHuespedData(prev => ({ ...prev, [name]: name === 'num_documento' ? parseInt(value) || 0 : value }));
  };

  const listaHabitacionesParaMostrar: ReservaHabitacionInfo[] = bloquesSeleccionados.flatMap(bloque =>
    bloque.habitaciones.map(habNum => {
      const habCompleta = habitaciones.find(h => h.numeroHabitacion === habNum);
      return habCompleta ? { habitacion: habCompleta, fecha_inicio: bloque.fechaInicio, fecha_fin: bloque.fechaFin } : null;
    }).filter(Boolean)
  );

  return (
    <AuthGate>
      <div className="container" style={{ padding: '40px', color: '#333' }}>
        <h1>📅 Nueva Reserva</h1>
        <Link href="/" style={{ display: 'block', marginBottom: '20px', color: 'blue' }}>← Volver al inicio</Link>

        <MostrarEstado onSearch={buscar} />

        {cargando && <p>Cargando datos...</p>}

        {habitaciones.length > 0 && fechasBusqueda && (
          <>
            <GrillaSeleccionReserva
              habitaciones={habitaciones}
              fechaDesde={fechasBusqueda.desde}
              fechaHasta={fechasBusqueda.hasta}
              onSelect={manejarSeleccion}
              ref={grillaRef}
              onConflict={(msg) => setToast({ message: msg, type: 'error' })}
            />

            {mostrarBotonReserva && (
              <>
                <h2>Resumen de Habitaciones Seleccionadas</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {listaHabitacionesParaMostrar.map((reserva, index) => (
                    <HabitacionCard key={index} reservaInfo={reserva!} />
                  ))}
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                  <button onClick={cancelarSeleccion} className="nav-option nav-option-secondary" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    RECHAZAR
                  </button>
                  <button onClick={() => setMostrarModalHuesped(true)} className="nav-option nav-option-secondary" style={{ backgroundColor: 'green', color: 'white' }}>
                    ACEPTAR
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {mostrarModalHuesped && (
          <HuespedModal
            huespedData={huespedData}
            onChange={handleChangeHuesped}
            onClose={() => setMostrarModalHuesped(false)}
            onSave={realizarReserva}
          />
        )}

        {habitaciones.length === 0 && fechasBusqueda && !cargando && <p>No se encontraron habitaciones.</p>}

        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={closeToast} />}
      </div>
    </AuthGate>
  );
}

const HuespedModal: React.FC<HuespedModalProps> = ({ huespedData, onChange, onClose, onSave }) => {
  const isFormValid = huespedData.apellido && huespedData.nombre && huespedData.telefono;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <h2>Datos del Huésped Principal</h2>
        <p>Por favor, complete los datos para finalizar la reserva.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input
            name="apellido"
            placeholder="Apellido"
            value={huespedData.apellido}
            onChange={onChange}
            required
            className="nav-option"
          />
          <input
            name="nombre"
            placeholder="Nombre"
            value={huespedData.nombre}
            onChange={onChange}
            required
            className="nav-option"
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={huespedData.telefono}
            onChange={onChange}
            required
            className="nav-option"
          />
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="nav-option nav-option-secondary">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!isFormValid}
            className="nav-option nav-option-secondary"
            style={{
              backgroundColor: isFormValid ? 'green' : '#aaa',
              color: 'white',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};