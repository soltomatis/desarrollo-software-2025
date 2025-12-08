'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Huesped } from '@/interfaces/Huesped';
import { AuthGate } from '@/components/AuthGate';
import ToastNotification from '@/components/ToastNotification';

export default function PaginaBorrarHuesped() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const huespedId = searchParams.get('id');

  const [huesped, setHuesped] = useState<Huesped | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  interface HistorialCheck {
    tieneHistorial: boolean;
    mensaje: string;
  }

  useEffect(() => {
    if (!huespedId) {
      setError('ID de huésped no encontrado en la URL.');
      setCargando(false);
      return;
    }

    const storedHuespedJson = sessionStorage.getItem('huespedParaBorrar');
    if (storedHuespedJson) {
      try {
        const storedHuesped: Huesped = JSON.parse(storedHuespedJson);
        if (storedHuesped.id.toString() === huespedId) {
          setHuesped(storedHuesped);
          setCargando(false);
          sessionStorage.removeItem('huespedParaBorrar');
          return;
        }
      } catch (e) {
        console.warn('Error al parsear el huésped de sessionStorage. Recurriendo a fetch.', e);
      }
    }

    const fetchHuesped = async () => {
      try {
        if (!token) {
          throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
        }

        const url = `/api/huespedes/buscarPorId?id=${huespedId}`;
        const respuesta = await fetch(url, { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        if (!respuesta.ok) {
          if (respuesta.status === 401) {
            throw new Error('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
          }
          throw new Error(`Error al cargar huésped: ${respuesta.status}`);
        }

        const datos: Huesped = await respuesta.json();
        setHuesped(datos);
      } catch (err: any) {
        setError(`No se pudo cargar la información del huésped: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };

    fetchHuesped();
  }, [huespedId, token]);

  const manejarBorrar = async () => {
    if (!huesped || !huesped.id) return;
    setError(null);

    try {
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      const urlVerificar = `/api/huespedes/verificar-historial?id=${huesped.id}`;
      const resVerificar = await fetch(urlVerificar, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resVerificar.ok) {
        if (resVerificar.status === 401) {
          throw new Error('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Fallo al consultar historial');
      }

      const historialCheck: HistorialCheck = await resVerificar.json();

      if (historialCheck.tieneHistorial) {
        setToast({ message: historialCheck.mensaje, type: 'info' });
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }

      const confirmacion = window.confirm(
        `${historialCheck.mensaje}\n\nPRESIONE ACEPTAR PARA ELIMINAR O CANCELAR PARA MANTENER.`
      );

      if (!confirmacion) return;

      const urlBorrar = `/api/huespedes/borrar?id=${huesped.id}`;
      const resBorrar = await fetch(urlBorrar, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resBorrar.ok) {
        const mensajeBorrar = await resBorrar.text();
        setToast({ message: `Error al intentar borrar: ${mensajeBorrar || resBorrar.statusText}`, type: 'error' });
        return;
      }

      setToast({ message: 'Huésped eliminado exitosamente.', type: 'success' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setToast({ message: `Error: ${err.message}`, type: 'error' });
    }
  };

  if (cargando) {
    return (
      <AuthGate>
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p>Cargando detalles del huésped...</p>
        </div>
      </AuthGate>
    );
  }

  if (error) {
    return (
      <AuthGate>
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ color: 'red', fontSize: '1.1rem' }}>ERROR: {error}</p>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        </div>
      </AuthGate>
    );
  }

  if (!huesped) {
    return (
      <AuthGate>
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <p>No se encontraron datos del huésped.</p>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
          Confirmar Eliminación de Huésped
        </h1>

        <Link
          href="/huespedes/buscar"
          style={{
            display: 'block',
            marginBottom: '30px',
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          ← Volver a búsqueda
        </Link>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          Por favor, revisa los detalles antes de confirmar la eliminación de la base de datos.
        </p>

        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          border: '2px solid #dc3545',
          boxShadow: '0 2px 8px rgba(220,53,69,0.15)',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.3rem', color: '#dc3545', marginTop: 0, marginBottom: '20px' }}>
            Información del Huésped a Eliminar
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <DetailRow label="ID" value={huesped.id.toString()} />
            <DetailRow label="Apellido" value={huesped.apellido} />
            <DetailRow label="Nombre" value={huesped.nombre} />
            <DetailRow label="Documento" value={`${huesped.tipo_documento} ${huesped.num_documento}`} />
            <DetailRow label="Email" value={huesped.email || '-'} />
            <DetailRow label="Nacionalidad" value={huesped.nacionalidad || '-'} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => router.push('/huespedes/buscar')}
            style={{
              flex: 1,
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
          >
            Cancelar
          </button>

          <button
            onClick={manejarBorrar}
            style={{
              flex: 1,
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#dc3545',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }}
          >
            Eliminar Huésped
          </button>
        </div>

        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthGate>
  );
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid #dee2e6'
  }}>
    <span style={{ fontWeight: 'bold', color: '#333' }}>{label}:</span>
    <span style={{ color: '#666' }}>{value}</span>
  </div>
);