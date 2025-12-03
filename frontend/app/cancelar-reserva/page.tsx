'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToastNotification from '@/components/ToastNotification';

export default function CancelarReservaPage() {
  const [idReserva, setIdReserva] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const validarID = (valor: string): boolean => {
    const numero = parseInt(valor);

    if (isNaN(numero)) {
      setErrorValidacion('ID inválido. Debe ser un número.');
      return false;
    }

    if (numero <= 0) {
      setErrorValidacion('ID inválido. Debe ser mayor a 0. Corrija e intente nuevamente.');
      return false;
    }

    setErrorValidacion('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setIdReserva(valor);

    if (valor) {
      validarID(valor);
    } else {
      setErrorValidacion('');
    }
  };

  const confirmarCancelacion = async () => {

    if (!validarID(idReserva)) {
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro que desea cancelar la reserva ID: ${idReserva}?\n\nEsta acción eliminará:\n- La reserva\n- Los estados RESERVADA de las habitaciones\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    setCargando(true);

    try {
      const response = await fetch(`http://localhost:8080/api/reservas/cancelar/${idReserva}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Reserva no encontrada con ID: ${idReserva}`);
        }

        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la reserva');
      }

      setToast({
        message: 'Reserva cancelada con éxito',
        type: 'success'
      });

      setIdReserva('');
      setErrorValidacion('');

    } catch (error: any) {
      console.error('Error al cancelar reserva:', error);

      setToast({
        message: error.message || 'Error al cancelar la reserva',
        type: 'error'
      });
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && idReserva && !errorValidacion) {
      confirmarCancelacion();
    }
  };

  return (
    <div className="container" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>

      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
        ❌ Cancelar Reserva
      </h1>

      <Link href="/" style={{ display: 'block', marginBottom: '30px', color: '#0070f3', textDecoration: 'none' }}>
        ← Volver al inicio
      </Link>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>
          Solicitud de Cancelación
        </h2>

        <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.95rem' }}>
          Ingrese el ID de la reserva que desea cancelar:
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333'
          }}>
            ID de Reserva: *
          </label>
          <input
            type="text"
            value={idReserva}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ej: 123"
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              border: errorValidacion ? '2px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px',
              outline: 'none',
              transition: 'border 0.2s'
            }}
            disabled={cargando}
          />

          {errorValidacion && (
            <div style={{
              color: '#dc3545',
              marginTop: '8px',
              padding: '10px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              ⚠️ {errorValidacion}
            </div>
          )}
        </div>

        <button
          onClick={confirmarCancelacion}
          disabled={cargando || !idReserva || !!errorValidacion}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: (cargando || !idReserva || !!errorValidacion) ? '#ccc' : '#dc3545',
            border: 'none',
            borderRadius: '5px',
            cursor: (cargando || !idReserva || !!errorValidacion) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (!cargando && idReserva && !errorValidacion) {
              e.currentTarget.style.backgroundColor = '#c82333';
            }
          }}
          onMouseLeave={(e) => {
            if (!cargando && idReserva && !errorValidacion) {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }
          }}
        >
          {cargando ? 'Cancelando reserva...' : 'Cancelar Reserva'}
        </button>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '5px',
          fontSize: '0.85rem',
          color: '#856404'
        }}>
          ℹ️ <strong>Nota:</strong> Al cancelar una reserva se eliminarán todos los estados RESERVADA
          de las habitaciones asociadas y la reserva completa del sistema.
        </div>
      </div>

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}