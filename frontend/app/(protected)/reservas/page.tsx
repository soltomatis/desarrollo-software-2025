'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Habitacion } from '@/interfaces/Habitacion';
import GrillaSeleccionReserva, { BloqueSeleccionado, GrillaRef } from '@/components/GrillaSeleccionReserva';
import HabitacionCard, { ReservaHabitacionInfo } from '@/components/HabitacionCard';
import ToastNotification from '@/components/ToastNotification';
import Link from 'next/link';
import { AuthGate } from '@/components/AuthGate';

interface HuespedDTO {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  ocupacion: string;
  condicionIVA: string;
  tipo_documento: string;
  num_documento: number;
  cuit: number;
  fecha_nacimiento: string;
  direccion: DireccionDTO;
  nacionalidad: string;
}

interface DireccionDTO {
  calle: string;
  numero: number;
  departamento: string;
  piso: number;
  codigoPostal: number | null;
  localidad: string;
  provincia: string;
  pais: string;
}

export default function ReservarHabitacion() {
  const router = useRouter();
  const grillaRef = useRef<GrillaRef>(null);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string; hasta: string } | null>(null);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState<BloqueSeleccionado[]>([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarModalHuesped, setMostrarModalHuesped] = useState(false);
  const [huespedData, setHuespedData] = useState<HuespedDTO>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: 'huesped_temp@hotel.com',
    ocupacion: 'Sin especificar',
    condicionIVA: 'CONSUMIDOR_FINAL',
    tipo_documento: 'DNI',
    num_documento: 99999999,
    cuit: 20999999990,
    fecha_nacimiento: '2000-01-01',
    nacionalidad: 'Argentina',
    direccion: {
      calle: 'Av. Temporal',
      numero: 1,
      departamento: '',
      piso: 0,
      codigoPostal: null,
      localidad: 'Ciudad Temporal',
      provincia: 'Provincia Temporal',
      pais: 'Argentina'
    }
  });

  const [errorValidacion, setErrorValidacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const validarFechas = (): boolean => {
    if (!fechaDesde || !fechaHasta) {
      setErrorValidacion('Debe seleccionar ambas fechas');
      return false;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      setErrorValidacion('La fecha "Desde" no puede ser posterior a la fecha "Hasta"');
      return false;
    }

    setErrorValidacion('');
    return true;
  };

  const buscarHabitaciones = async () => {
    if (!validarFechas()) {
      return;
    }

    setCargando(true);
    setHabitaciones([]);
    setBloquesSeleccionados([]);
    setMostrarResumen(false);
    setFechasBusqueda({ desde: fechaDesde, hasta: fechaHasta });

    try {
      const res = await fetch(
        `http://localhost:8080/api/habitaciones/estado?desde=${fechaDesde}&hasta=${fechaHasta}`, {
            headers: { Authorization: `Bearer ${token}` }
       });

      if (!res.ok) throw new Error('Error al conectar con el servidor');

      const datos: Habitacion[] = await res.json();
      setHabitaciones(datos);

    } catch (error) {
      setToast({ message: 'Error al obtener la disponibilidad.', type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccion = (bloques: BloqueSeleccionado[]) => {
    setBloquesSeleccionados(bloques);

    if (bloques.length === 0) {
      setMostrarResumen(false);
      return;
    }
  };

  const handleConflictoCelda = (mensaje: string) => {
    setToast({ message: mensaje, type: 'error' });
  };

  const listaHabitacionesParaMostrar: ReservaHabitacionInfo[] = bloquesSeleccionados.flatMap(
    (bloque) =>
      bloque.habitaciones
        .map((habNum) => {
          const habCompleta = habitaciones.find((h) => h.numeroHabitacion === habNum);
          return habCompleta
            ? {
                habitacion: habCompleta,
                fecha_inicio: bloque.fechaInicio,
                fecha_fin: bloque.fechaFin
              }
            : null;
        })
        .filter(Boolean) as ReservaHabitacionInfo[]
  );

  const mostrarOpciones = () => {
    if (bloquesSeleccionados.length > 0 && !mostrarResumen) {
      setMostrarResumen(true);
    }
  };

  const aceptarSeleccion = () => {
    if (bloquesSeleccionados.length === 0) {
      setToast({ message: 'Debe seleccionar al menos una habitación', type: 'error' });
      return;
    }
    setMostrarModalHuesped(true);
  };

  const rechazarSeleccion = () => {
    if (grillaRef.current) {
      grillaRef.current.limpiarSeleccion();
    }
    setBloquesSeleccionados([]);
    setMostrarResumen(false);
    setToast({ message: 'Selección rechazada. Puede realizar una nueva selección.', type: 'info' });
  };

  const cancelarCasoUso = () => {
    setFechaDesde('');
    setFechaHasta('');
    setHabitaciones([]);
    setBloquesSeleccionados([]);
    setMostrarResumen(false);
    setMostrarModalHuesped(false);
    setFechasBusqueda(null);
    setErrorValidacion('');
    setToast({ message: 'Caso de uso cancelado', type: 'info' });
  };

  const handleChangeHuesped = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHuespedData((prev) => ({
      ...prev,
      [name]: name === 'num_documento' ? parseInt(value) || 0 : value
    }));
  };

  const validarHuesped = (): boolean => {
    if (!huespedData.apellido || !huespedData.nombre || !huespedData.telefono) {
      setToast({ message: 'Debe completar Apellido, Nombre y Teléfono', type: 'error' });
      return false;
    }
    return true;
  };

  const confirmarReserva = async () => {
    if (!validarHuesped()) {
      return;
    }

    const listaHabitacionesReservadas = bloquesSeleccionados.flatMap((bloque) =>
      bloque.habitaciones
        .map((habNum) => {
          const habCompleta = habitaciones.find((h) => h.numeroHabitacion === habNum);
          return habCompleta
            ? {
                habitacion: habCompleta,
                fecha_inicio: bloque.fechaInicio,
                fecha_fin: bloque.fechaFin
              }
            : null;
        })
        .filter(Boolean)
    );

    const reservaDTO = {
      listaHabitacionesReservadas,
      huespedPrincipal: huespedData
    };

    const confirmacion = window.confirm(
      `¿Confirmar la reserva de ${listaHabitacionesReservadas.length} habitación(es) para ${huespedData.nombre} ${huespedData.apellido}?`
    );

    if (!confirmacion) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reservas/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservaDTO)
      });

      if (!res.ok) throw new Error('Error al crear reserva');

      setToast({ message: '¡Reserva realizada con éxito! Redirigiendo...', type: 'success' });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/');

    } catch (error: any) {
      setToast({ message: `Error al crear la reserva: ${error.message}`, type: 'error' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarHabitaciones();
    }
  };

  if (bloquesSeleccionados.length > 0 && !mostrarResumen) {
    mostrarOpciones();
  }

  return (
    <AuthGate>
      <div className="container" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
          Reservar Habitación
        </h1>

        <Link
          href="/"
          style={{
            display: 'block',
            marginBottom: '30px',
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          ← Volver al inicio
        </Link>

        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}
        >
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#555' }}>
            Consultar Disponibilidad
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto auto',
              gap: '15px',
              alignItems: 'end',
              marginBottom: '20px'
            }}
          >
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                Desde fecha: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => {
                  setFechaDesde(e.target.value);
                  if (errorValidacion) setErrorValidacion('');
                }}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#fff'
                }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                Hasta fecha: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => {
                  setFechaHasta(e.target.value);
                  if (errorValidacion) setErrorValidacion('');
                }}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            <div>
              <button
                onClick={buscarHabitaciones}
                disabled={cargando}
                style={{
                  padding: '12px 25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: cargando ? '#ccc' : '#007bff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {cargando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div>
              <button
                onClick={cancelarCasoUso}
                disabled={cargando}
                style={{
                  padding: '12px 25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#333',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px',
                  cursor: cargando ? 'not-allowed' : 'pointer'
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>

          {errorValidacion && (
            <div
              style={{
                color: '#dc3545',
                padding: '12px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '5px',
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
               {errorValidacion}
            </div>
          )}

          {cargando && (
            <div
              style={{
                padding: '15px',
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '5px',
                color: '#0056b3',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              Consultando disponibilidad...
            </div>
          )}
        </div>

        {habitaciones.length > 0 && fechasBusqueda && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#555' }}>
              Seleccione Habitaciones
            </h2>

            <GrillaSeleccionReserva
              habitaciones={habitaciones}
              fechaDesde={fechasBusqueda.desde}
              fechaHasta={fechasBusqueda.hasta}
              onSelect={manejarSeleccion}
              ref={grillaRef}
              onConflict={handleConflictoCelda}
            />
          </div>
        )}

        {mostrarResumen && listaHabitacionesParaMostrar.length > 0 && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#555' }}>
              Resumen de Habitaciones Seleccionadas
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}
            >
              {listaHabitacionesParaMostrar.map((reserva, index) => (
                <HabitacionCard key={index} reservaInfo={reserva} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={rechazarSeleccion}
                style={{
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                RECHAZAR
              </button>

              <button
                onClick={aceptarSeleccion}
                style={{
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#28a745',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                ACEPTAR
              </button>
            </div>
          </div>
        )}

        {mostrarModalHuesped && (
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
              zIndex: 1000
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                width: '450px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>
                Reserva a nombre de:
              </h2>
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.95rem' }}>
                Complete los datos del huésped principal
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                    Apellido: <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    name="apellido"
                    value={huespedData.apellido}
                    onChange={handleChangeHuesped}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                    Nombre: <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    name="nombre"
                    value={huespedData.nombre}
                    onChange={handleChangeHuesped}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                    Teléfono: <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    name="telefono"
                    value={huespedData.telefono}
                    onChange={handleChangeHuesped}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setMostrarModalHuesped(false)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#333',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarReserva}
                  style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: '#28a745',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}

        {habitaciones.length === 0 && fechasBusqueda && !cargando && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '40px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '10px' }}>
              No se encontraron habitaciones
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              No hay habitaciones disponibles para el rango de fechas seleccionado.
            </p>
          </div>
        )}

        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthGate>
  );
}