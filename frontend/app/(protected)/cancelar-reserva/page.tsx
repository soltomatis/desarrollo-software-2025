'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToastNotification from '@/components/ToastNotification';
import { AuthGate } from '@/components/AuthGate';

interface Direccion {
  calle: string;
  numero: number;
  departamento?: string;
  piso?: number;
  codigoPostal?: number;
  localidad: string;
  provincia: string;
  pais: string;
}

interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  ocupacion: string;
  tipo_documento: string;
  num_documento: number;
  cuit?: number;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  direccion?: Direccion;
  condicionIVA?: string;
}

interface Habitacion {
  numeroHabitacion: number;
  tipo: string;
  cantidadHuespedes: number;
  cantidadCamaI: number;
  cantidadCamaD: number;
  cantidadCamaKS: number;
}

interface ReservaHabitacion {
  id?: number;
  habitacion: Habitacion;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Reserva {
  id: number;
  huespedPrincipal: Huesped;
  listaHabitacionesReservadas: ReservaHabitacion[];
}

interface CriterioBusqueda {
  apellido: string;
  nombre: string;
  numeroHabitacion: string;
  tipoHabitacion: string;
  fechaInicio: string;
  fechaFin: string;
}

export default function CancelarReservaPage() {
  const [criterios, setCriterios] = useState<CriterioBusqueda>({
    apellido: '',
    nombre: '',
    numeroHabitacion: '',
    tipoHabitacion: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservasSeleccionadas, setReservasSeleccionadas] = useState<Set<number>>(new Set());
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const validarFormulario = (): boolean => {
    if (!criterios.apellido.trim()) {
      setErrorValidacion('El campo apellido no puede estar vacío');
      return false;
    }
    setErrorValidacion('');
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
      if (criterios.apellido) params.append('apellido', criterios.apellido);
      if (criterios.nombre) params.append('nombre', criterios.nombre);
      if (criterios.numeroHabitacion) params.append('numeroHabitacion', criterios.numeroHabitacion);
      if (criterios.tipoHabitacion) params.append('tipoHabitacion', criterios.tipoHabitacion);
      if (criterios.fechaInicio) params.append('fechaInicio', criterios.fechaInicio);
      if (criterios.fechaFin) params.append('fechaFin', criterios.fechaFin);

      const response = await fetch(`/api/reservas/buscar?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al buscar reservas');
      const data = await response.json();

      if (Array.isArray(data) && data.length === 0) {
        setToast({ message: 'No existen reservas para los criterios de búsqueda', type: 'info' });
        setMostrarResultados(true);
        return;
      }

      setReservas(data);
      setMostrarResultados(true);
    } catch (error: any) {
      setToast({ message: error.message || 'Error al buscar reservas', type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const toggleSeleccion = (idReserva: number) => {
    const nuevasSeleccionadas = new Set(reservasSeleccionadas);
    if (nuevasSeleccionadas.has(idReserva)) {
      nuevasSeleccionadas.delete(idReserva);
    } else {
      nuevasSeleccionadas.add(idReserva);
    }
    setReservasSeleccionadas(nuevasSeleccionadas);
  };

  const seleccionarTodas = () => {
    if (reservasSeleccionadas.size === reservas.length) {
      setReservasSeleccionadas(new Set());
    } else {
      setReservasSeleccionadas(new Set(reservas.map(r => r.id)));
    }
  };

  const cancelarReservas = async () => {
    if (reservasSeleccionadas.size === 0) {
      setToast({ message: 'Debe seleccionar al menos una reserva', type: 'error' });
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro que desea cancelar ${reservasSeleccionadas.size} reserva(s)?\n\n` +
      `Esta acción:\n- Cancelará las reservas seleccionadas\n- Liberará las habitaciones asociadas\n- No se puede deshacer`
    );
    if (!confirmacion) return;

    setCargando(true);
    try {
      const response = await fetch(`/api/reservas/cancelar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idsReservas: Array.from(reservasSeleccionadas) })
      });

      if (!response.ok) throw new Error('Error al cancelar reservas');
      const resultado = await response.json();

      setToast({ message: resultado.mensaje || 'Reservas canceladas', type: 'success' });
      setReservas([]);
      setReservasSeleccionadas(new Set());
      setMostrarResultados(false);
      setCriterios({
        apellido: '',
        nombre: '',
        numeroHabitacion: '',
        tipoHabitacion: '',
        fechaInicio: '',
        fechaFin: ''
      });
    } catch (error: any) {
      setToast({ message: error.message || 'Error al cancelar reservas', type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const deshacerSeleccion = () => {
    setReservasSeleccionadas(new Set());
    document.getElementById('input-apellido')?.focus();
  };

  const handleCriterioChange = (campo: keyof CriterioBusqueda, valor: string) => {
    setCriterios(prev => ({ ...prev, [campo]: valor }));
    if (campo === 'apellido' && errorValidacion) setErrorValidacion('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') buscarReservas();
  };

  return (
    <AuthGate>
      <div className="container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>Cancelar Reserva</h1>
        <Link href="/" style={{ display: 'block', marginBottom: '30px', color: '#0070f3', textDecoration: 'none' }}>
          ← Volver al inicio
        </Link>

        {/* Formulario de búsqueda con UI completa */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>Buscar Reservas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>Apellido: <span style={{ color: 'red' }}>*</span></label>
              <input
                id="input-apellido"
                type="text"
                value={criterios.apellido}
                onChange={(e) => handleCriterioChange('apellido', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: García"
                autoFocus
                className="nav-option"
                disabled={cargando}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Nombre:</label>
              <input
                type="text"
                value={criterios.nombre}
                onChange={(e) => handleCriterioChange('nombre', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Juan"
                className="nav-option"
                disabled={cargando}
              />
            </div>
                        <div>
              <label style={{ fontWeight: 'bold' }}>Nº Habitación:</label>
              <input
                type="number"
                value={criterios.numeroHabitacion}
                onChange={(e) => handleCriterioChange('numeroHabitacion', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 101"
                className="nav-option"
                disabled={cargando}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Tipo Habitación:</label>
              <input
                type="text"
                value={criterios.tipoHabitacion}
                onChange={(e) => handleCriterioChange('tipoHabitacion', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Suite"
                className="nav-option"
                disabled={cargando}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Fecha Inicio:</label>
              <input
                type="date"
                value={criterios.fechaInicio}
                onChange={(e) => handleCriterioChange('fechaInicio', e.target.value)}
                className="nav-option"
                disabled={cargando}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Fecha Fin:</label>
              <input
                type="date"
                value={criterios.fechaFin}
                onChange={(e) => handleCriterioChange('fechaFin', e.target.value)}
                className="nav-option"
                disabled={cargando}
              />
            </div>
          </div>

          {errorValidacion && (
            <div style={{
              color: '#dc3545',
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}>
              {errorValidacion}
            </div>
          )}

          <button
            onClick={buscarReservas}
            disabled={cargando}
            className="nav-option nav-option-secondary"
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              fontWeight: 'bold',
              backgroundColor: cargando ? '#ccc' : '#007bff',
              color: 'white'
            }}
          >
            {cargando ? 'Buscando...' : 'Buscar Reservas'}
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultados && reservas.length > 0 && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Resultados de Búsqueda ({reservas.length})</h2>
              <button onClick={seleccionarTodas} className="nav-option nav-option-secondary">
                {reservasSeleccionadas.size === reservas.length ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th>Seleccionar</th>
                    <th>ID</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>Habitaciones</th>
                    <th>Tipo</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={reservasSeleccionadas.has(reserva.id)}
                          onChange={() => toggleSeleccion(reserva.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>{reserva.id}</td>
                      <td>{reserva.huespedPrincipal.apellido}</td>
                      <td>{reserva.huespedPrincipal.nombre}</td>
                      <td>
                        {reserva.listaHabitacionesReservadas.map((rh, index) => (
                          <span key={index}>
                            {rh.habitacion.numeroHabitacion}
                            {index < reserva.listaHabitacionesReservadas.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </td>
                      <td>{reserva.listaHabitacionesReservadas.map(rh => rh.habitacion.tipo).join(', ')}</td>
                      <td>{reserva.listaHabitacionesReservadas[0]?.fecha_inicio || '-'}</td>
                      <td>{reserva.listaHabitacionesReservadas[0]?.fecha_fin || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button
                onClick={cancelarReservas}
                disabled={cargando || reservasSeleccionadas.size === 0}
                className="nav-option nav-option-secondary"
                style={{
                  flex: 1,
                  backgroundColor: (cargando || reservasSeleccionadas.size === 0) ? '#ccc' : '#dc3545',
                  color: 'white'
                }}
              >
                {cargando ? 'Cancelando...' : `ACEPTAR (${reservasSeleccionadas.size})`}
              </button>
              <button
                onClick={deshacerSeleccion}
                disabled={cargando}
                className="nav-option nav-option-secondary"
                style={{ flex: 1, backgroundColor: '#f8f9fa', color: '#333' }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}

        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AuthGate>
  );
}