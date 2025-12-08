'use client';

import { useState } from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
import GrillaDisponibilidad from '@/components/GrillaDisponibilidad';
import Link from 'next/link';
import { AuthGate } from '@/components/AuthGate';
import ToastNotification from '@/components/ToastNotification';

interface FechasBusqueda {
  desde: string;
  hasta: string;
}

export default function ConsultarEstadoHabitaciones() {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [fechasBusqueda, setFechasBusqueda] = useState<FechasBusqueda | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Obtener token de manera segura (solo en cliente)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const traerHabitaciones = async (desde: string, hasta: string) => {
    if (!token) {
      throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
    }

    const res = await fetch(
      `http://localhost:8080/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
      }
      throw new Error('Error al conectar con el servidor');
    }

    return res.json();
  };

  const validarFechaDesde = (fecha: string): boolean => {
    if (!fecha || fecha.trim() === '') {
      setErrorValidacion('La fecha "Desde fecha" es obligatoria');
      return false;
    }

    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      setErrorValidacion('La fecha "Desde fecha" tiene un formato inválido');
      return false;
    }

    setErrorValidacion('');
    return true;
  };

  const validarFechaHasta = (fechaDesdeVal: string, fechaHastaVal: string): boolean => {
    if (!fechaHastaVal || fechaHastaVal.trim() === '') {
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

    setErrorValidacion('');
    return true;
  };

  const handleFechaDesdeChange = (fecha: string) => {
    setFechaDesde(fecha);
    if (errorValidacion) {
      setErrorValidacion('');
    }
  };

  const handleFechaHastaChange = (fecha: string) => {
    setFechaHasta(fecha);
    if (errorValidacion) {
      setErrorValidacion('');
    }
  };

  const consultarEstado = async () => {
    if (!validarFechaDesde(fechaDesde)) {
      document.getElementById('input-fecha-desde')?.focus();
      return;
    }

    if (!validarFechaHasta(fechaDesde, fechaHasta)) {
      document.getElementById('input-fecha-hasta')?.focus();
      return;
    }

    setCargando(true);
    setMostrarResultados(false);
    setHabitaciones([]);
    setErrorValidacion('');

    try {
      const datos = await traerHabitaciones(fechaDesde, fechaHasta);

      setHabitaciones(datos);
      setFechasBusqueda({ desde: fechaDesde, hasta: fechaHasta });
      setMostrarResultados(true);

      if (datos.length === 0) {
        setToast({ message: 'No hay habitaciones disponibles para el rango de fechas seleccionado.', type: 'info' });
      }

    } catch (error: any) {
      console.error('Error al buscar habitaciones:', error);
      const mensaje = error.message || 'Error al conectar con el servidor. Intente nuevamente.';
      setErrorValidacion(mensaje);
      setToast({ message: mensaje, type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const cancelarOperacion = () => {
    setFechaDesde('');
    setFechaHasta('');
    setErrorValidacion('');
    setHabitaciones([]);
    setMostrarResultados(false);
    setFechasBusqueda(null);

    document.getElementById('input-fecha-desde')?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      consultarEstado();
    }
  };

  return (
    <AuthGate>
      <div className="container" style={{
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        <h1 style={{
          fontSize: '2rem',
          marginBottom: '10px',
          color: '#333'
        }}>
          Estado de Habitaciones
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

        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '30px',
          borderRadius: '10px',
          border: '1px solid #ddd',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            marginBottom: '20px',
            color: '#555'
          }}>
            Consultar Disponibilidad
          </h2>

          {/* PASO 2: Sistema muestra los campos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto auto',
            gap: '15px',
            alignItems: 'end',
            marginBottom: '20px'
          }}>

            <div>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333',
                fontSize: '1rem'
              }}>
                Desde fecha: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="input-fecha-desde"
                type="date"
                value={fechaDesde}
                onChange={(e) => handleFechaDesdeChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="dd/mm/aaaa"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  border: errorValidacion && !fechaDesde ? '2px solid #dc3545' : '1px solid #ccc',
                  borderRadius: '5px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  backgroundColor: '#fff'
                }}
                autoFocus
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333',
                fontSize: '1rem'
              }}>
                Hasta fecha: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="input-fecha-hasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => handleFechaHastaChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="dd/mm/aaaa"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  border: errorValidacion && !fechaHasta ? '2px solid #dc3545' : '1px solid #ccc',
                  borderRadius: '5px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            <div>
              <button
                onClick={consultarEstado}
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
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!cargando) e.currentTarget.style.backgroundColor = '#0056b3';
                }}
                onMouseLeave={(e) => {
                  if (!cargando) e.currentTarget.style.backgroundColor = '#007bff';
                }}
              >
                {cargando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div>
              <button
                onClick={cancelarOperacion}
                disabled={cargando}
                style={{
                  padding: '12px 25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#333',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!cargando) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!cargando) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>

          {errorValidacion && (
            <div style={{
              color: '#dc3545',
              padding: '12px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              {errorValidacion}
            </div>
          )}

          {cargando && (
            <div style={{
              padding: '15px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '5px',
              color: '#0056b3',
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Consultando estado de habitaciones...
            </div>
          )}

        </div>

        {mostrarResultados && habitaciones.length > 0 && fechasBusqueda && (
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                color: '#555',
                margin: 0
              }}>
                Resultados ({habitaciones.length} habitaciones)
              </h2>

              <div style={{
                fontSize: '0.9rem',
                color: '#666',
                backgroundColor: '#f8f9fa',
                padding: '8px 15px',
                borderRadius: '5px',
                border: '1px solid #dee2e6'
              }}>
                📆 {new Date(fechasBusqueda.desde).toLocaleDateString('es-AR')}
                {' → '}
                {new Date(fechasBusqueda.hasta).toLocaleDateString('es-AR')}
              </div>
            </div>

            <GrillaDisponibilidad
              habitaciones={habitaciones}
              fechaDesde={fechasBusqueda.desde}
              fechaHasta={fechasBusqueda.hasta}
            />

            <div style={{
              marginTop: '25px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{
                fontSize: '1rem',
                marginBottom: '15px',
                color: '#333',
                fontWeight: 'bold'
              }}>
                Leyenda de Estados:
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#28a745',
                    borderRadius: '3px',
                    border: '1px solid #1e7e34'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>Libre</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#dc3545',
                    borderRadius: '3px',
                    border: '1px solid #bd2130'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>Ocupada</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#6c757d',
                    borderRadius: '3px',
                    border: '1px solid #545b62'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>Fuera de Servicio</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#ffc107',
                    borderRadius: '3px',
                    border: '1px solid #d39e00'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>Reservada</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {mostrarResultados && habitaciones.length === 0 && !cargando && (
          <div style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#555',
              marginBottom: '10px'
            }}>
              No se encontraron habitaciones
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              No hay habitaciones disponibles para el rango de fechas seleccionado.
            </p>
          </div>
        )}

        {/* 🔹 Toast de notificaciones */}
        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthGate>
  );
}
