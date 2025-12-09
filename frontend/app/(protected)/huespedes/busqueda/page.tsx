'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Huesped, CriteriosBusquedaHuesped, TipoDocumento } from '@/interfaces/Huesped';
import { AuthGate } from '@/components/AuthGate';
import ToastNotification from '@/components/ToastNotification';

const tiposDocumentoDisponibles: TipoDocumento[] = ['DNI', 'LE', 'LC', 'Pasaporte', 'Otro'];

export default function PaginaBuscarHuesped() {
  const router = useRouter();

  const [criterios, setCriterios] = useState<CriteriosBusquedaHuesped>({
    apellido: '',
    nombre: '',
    tipo_documento: '',
    num_documento: '',
  });

  const [resultadosBusqueda, setResultadosBusqueda] = useState<Huesped[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [huespedSeleccionado, setHuespedSeleccionado] = useState<Huesped | null>(null);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCriterios({
      ...criterios,
      [e.target.name]: e.target.value,
    });
    setErrorValidacion('');
  };

  const manejarSeleccion = (huesped: Huesped) => {
    if (huespedSeleccionado && huespedSeleccionado.id === huesped.id) {
      setHuespedSeleccionado(null);
    } else {
      setHuespedSeleccionado(huesped);
    }
  };

  const manejarBusqueda = async (e: FormEvent) => {
    e.preventDefault();
    
    setCargando(true);
    setBusquedaRealizada(true);
    setResultadosBusqueda([]);
    setErrorValidacion('');

    try {
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      const params = new URLSearchParams({
        apellido: criterios.apellido,
        nombre: criterios.nombre,
        tipo_documento: criterios.tipo_documento,
        num_documento: criterios.num_documento,
      });

      const url = `/api/huespedes/buscar?${params.toString()}`;
      const respuesta = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al buscar huéspedes');
      }

      const datos: Huesped[] = await respuesta.json();
      setResultadosBusqueda(datos);

      if (datos.length === 0) {
        setToast({ message: 'No se encontraron huéspedes que coincidan con los criterios especificados.', type: 'info' });
      }
    } catch (error: any) {
      console.error('Error al buscar huéspedes:', error);
      setToast({ message: error.message || 'Error al buscar huéspedes', type: 'error' });
    } finally {
      setCargando(false);
    }
  };
  const manejarModificar = () => {
    if (huespedSeleccionado) {
      try {
        sessionStorage.setItem('huespedParaModificar', JSON.stringify(huespedSeleccionado));
      } catch (e) {
        console.error('Error al guardar en sessionStorage:', e);
      }
      router.push(`/huespedes/modificar?id=${huespedSeleccionado.id}`);
    }
  };
  const manejarBorrar = () => {
    if (huespedSeleccionado) {
      try {
        sessionStorage.setItem('huespedParaBorrar', JSON.stringify(huespedSeleccionado));
      } catch (e) {
        console.error('Error al guardar en sessionStorage:', e);
      }
      router.push(`/huespedes/borrar?id=${huespedSeleccionado.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      manejarBusqueda(e as any);
    }
  };

  return (
    <AuthGate>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
          Buscar Huésped
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
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#555' }}>
            Criterios de Búsqueda
          </h2>

          <form onSubmit={manejarBusqueda} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Apellido: 
              </label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={criterios.apellido}
                onChange={manejarCambio}
                onKeyPress={handleKeyPress}
                placeholder="Ej: García"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '1rem'
                , color: '#1a1a1a'
                }}
                disabled={cargando}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Nombre:
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={criterios.nombre}
                onChange={manejarCambio}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Juan"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '1rem', 
                  color: '#1a1a1a'
                }}
                disabled={cargando}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Tipo de Documento:
              </label>
              <select
                name="tipo_documento"
                id="tipo_documento"
                value={criterios.tipo_documento}
                onChange={manejarCambio}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '1rem', color: '#1a1a1a'
                }}
                disabled={cargando}
              >
                <option value="">Cualquiera</option>
                {tiposDocumentoDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Número de Documento:
              </label>
              <input
                type="text"
                name="num_documento"
                id="num_documento"
                value={criterios.num_documento}
                onChange={manejarCambio}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 12345678"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '1rem', color: '#1a1a1a'
                }}
                disabled={cargando}
              />
            </div>
          </form>

          {errorValidacion && (
            <div style={{
              color: '#dc3545',
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              fontSize: '0.95rem',
              fontWeight: 'bold'
            }}>
              {errorValidacion}
            </div>
          )}

          <button
            onClick={manejarBusqueda as any}
            disabled={cargando}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: cargando ? '#ccc' : '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#007bff';
            }}
          >
            {cargando ? 'Buscando...' : 'Buscar Huésped'}
          </button>
        </div>

        {busquedaRealizada && resultadosBusqueda.length > 0 && (
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '1.3rem', color: '#555', margin: 0, marginBottom: '20px' }}>
              Resultados de Búsqueda ({resultadosBusqueda.length})
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem',
                color: '#000'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Seleccionar</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Apellido</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Documento</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosBusqueda.map((huesped) => {
                    const isSelected = huespedSeleccionado && huespedSeleccionado.id === huesped.id;
                    return (
                      <tr key={huesped.id} style={{
                        borderBottom: '1px solid #dee2e6',
                        backgroundColor: isSelected ? '#e6f7ff' : 'transparent'
                      }}>
                        <td style={{ padding: '12px' }}>
                          <input
                            type="radio"
                            name="radioHuesped"
                            value={huesped.id}
                            checked={isSelected || false}
                            onChange={() => manejarSeleccion(huesped)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '12px' }}>{huesped.id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{huesped.apellido}</td>
                        <td style={{ padding: '12px' }}>{huesped.nombre}</td>
                        <td style={{ padding: '12px' }}>
                          {huesped.tipo_documento} {huesped.num_documento}
                        </td>
                        <td style={{ padding: '12px' }}>{huesped.email || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>

                  <button
                    onClick={manejarModificar}
                    disabled={!huespedSeleccionado || cargando}
                    style={{
                      flex: 1,
                      padding: '15px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: (!huespedSeleccionado || cargando) ? '#ccc' : '#007bff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: (!huespedSeleccionado || cargando) ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!huespedSeleccionado || cargando) return;
                        e.currentTarget.style.backgroundColor = '#0056b3';
                    }}
                    onMouseLeave={(e) => {
                        if (!huespedSeleccionado || cargando) return;
                        e.currentTarget.style.backgroundColor = '#007bff';
                    }}
                  >
                    Modificar
                  </button>

                  <button
                    onClick={manejarBorrar}
                    disabled={!huespedSeleccionado || cargando}
                    style={{
                      flex: 1,
                      padding: '15px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: (!huespedSeleccionado || cargando) ? '#ccc' : '#dc3545', 
                      border: 'none',
                      borderRadius: '5px',
                      cursor: (!huespedSeleccionado || cargando) ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!huespedSeleccionado || cargando) return;
                        e.currentTarget.style.backgroundColor = '#bd2130';
                    }}
                    onMouseLeave={(e) => {
                        if (!huespedSeleccionado || cargando) return;
                        e.currentTarget.style.backgroundColor = '#dc3545';
                    }}
                  >
                    Borrar
                  </button>

                </div>
          </div>
        )}

        {busquedaRealizada && resultadosBusqueda.length === 0 && !cargando && (
          <div style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginTop: '30px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '10px' }}>
              No se encontraron huéspedes
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              No hay huéspedes que coincidan con los criterios de búsqueda especificados.
            </p>
          </div>
        )}

        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthGate>
  );
}