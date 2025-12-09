'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Huesped, TipoDocumento, CondicionIVA, Direccion } from '@/interfaces/Huesped';
import { AuthGate } from '@/components/AuthGate';
import ToastNotification from '@/components/ToastNotification';

const tiposDocumentoDisponibles: TipoDocumento[] = ['DNI', 'LE', 'LC', 'Pasaporte', 'Otro'];
const condicionesIVADisponibles: CondicionIVA[] = ['RESPONSABLE_INSCRIPTO' ,'MONOTRIBUTO','CONSUMIDOR_FINAL' ,'EXENTO'];

const INITIAL_ADDRESS_STATE: Direccion = {
  calle: '',
  numero: 0,
  piso: 0,
  departamento: '',
  codigoPostal: 0,
  localidad: '',
  provincia: '',
  pais: '',
};

const INITIAL_HUESPED_STATE: Huesped = {
  id: 0,
  nombre: '',
  apellido: '',
  tipo_documento: 'DNI',
  num_documento: '',
  cuit: 0,
  fecha_nacimiento: '',
  nacionalidad: '',
  telefono: '',
  email: '',
  ocupacion: '',
  condicionIVA: 'CONSUMIDOR_FINAL',
  direccion: INITIAL_ADDRESS_STATE,
};


export default function PaginaModificarHuesped() {
  const router = useRouter();
  const [huesped, setHuesped] = useState<Huesped>(INITIAL_HUESPED_STATE);
  const [cargando, setCargando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formatIsoToInputDate = (isoString: string): string => {
    return new Date(isoString).toISOString().split('T')[0]; 
  };
  useEffect(() => {
    const data = sessionStorage.getItem('huespedParaModificar');
    if (data) {
      try {
        const huespedData: Huesped = JSON.parse(data);

        let fechaInput = '';
        if (huespedData.fecha_nacimiento) {
            try {
                fechaInput = formatIsoToInputDate(String(huespedData.fecha_nacimiento));
            } catch (e) {
                console.warn("Fecha inválida en sessionStorage:", huespedData.fecha_nacimiento);
                fechaInput = '';
            }
        }
        
        setHuesped({
          ...huespedData,
          fecha_nacimiento: fechaInput as any, 
          direccion: huespedData.direccion || INITIAL_ADDRESS_STATE,
        });

      } catch (e) {
        console.error("Error al parsear datos del huésped:", e);
        setToast({ message: 'Error al cargar los datos del huésped. Vuelva a buscarlo.', type: 'error' });
      }
    } else {
      setToast({ message: 'No se encontraron datos del huésped. Redirigiendo a la búsqueda.', type: 'info' });
      setTimeout(() => router.push('/huespedes/buscar'), 2000);
    }
  }, [router]);

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('direccion.')) {
      const dirField = name.split('.')[1];
      setHuesped(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [dirField]: ['numero', 'piso', 'codigoPostal'].includes(dirField) ? Number(value) : value,
        },
      }));
    } else {
      setHuesped(prev => ({
        ...prev,
        [name]: ['num_documento', 'cuit'].includes(name) ? Number(value) : value,
      }));
    }
    setErrorValidacion('');
  };

  const manejarModificacion = async (e: FormEvent) => {
    e.preventDefault();
    if (!huesped.id) return;

    setCargando(true);
    setErrorValidacion('');

    try {
      if (!token) throw new Error('No hay token de autenticación.');

      const huespedDTO: Partial<Huesped> = {};
      
      const dataToSend = {
          ...huesped,
          fecha_nacimiento: huesped.fecha_nacimiento ? huesped.fecha_nacimiento : null
      };

      const url = `/api/huespedes/modificar/${huesped.id}`;

      const respuesta = await fetch(url, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSend),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error desconocido al guardar los cambios.');
      }

      const huespedActualizado: Huesped = await respuesta.json();
      setToast({ message: `Huésped ${huespedActualizado.apellido} actualizado con éxito.`, type: 'success' });

      sessionStorage.removeItem('huespedParaModificar');
      setTimeout(() => router.push('/huespedes/busqueda'), 3000);

    } catch (error: any) {
      console.error('Error al modificar huésped:', error);
      setToast({ message: error.message || 'Error al modificar huésped.', type: 'error' });
    } finally {
      setCargando(false);
    }
  };


  if (huesped.id === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#007bff' }}>Cargando datos del huésped...</h1>
      </div>
    );
  }
// ESTILO BASE PARA INPUTS Y SELECTS
const fieldStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    color: '#555',
};

// ESTILO BASE PARA LABELS
const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#000',
};

return (
    <AuthGate>
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>
                Modificar Huésped (ID: {huesped.id})
            </h1>

            <Link
                href="/huespedes/buscar"
                style={{
                    display: 'block',
                    marginBottom: '30px',
                    color: '#0070f3',
                    textDecoration: 'none',
                    fontSize: '1rem',
                }}
            >
                ← Volver a la Búsqueda
            </Link>

            <form
                onSubmit={manejarModificacion}
                style={{
                    backgroundColor: '#f9f9f9',
                    padding: '30px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <h2
                    style={{
                        marginBottom: '20px',
                        color: '#555',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '10px',
                    }}
                >
                    Datos Personales
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '25px',
                        marginBottom: '20px',
                    }}
                >
                    <div>
                        <label htmlFor="nombre" style={labelStyle}>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={huesped.nombre}
                            onChange={manejarCambio}
                            required
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="apellido" style={labelStyle}>Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            id="apellido"
                            value={huesped.apellido}
                            onChange={manejarCambio}
                            required
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="tipo_documento" style={labelStyle}>
                            Tipo Documento
                        </label>
                        <select
                            name="tipo_documento"
                            id="tipo_documento"
                            value={huesped.tipo_documento}
                            onChange={manejarCambio}
                            required
                            style={fieldStyle}
                        >
                            {tiposDocumentoDisponibles.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="num_documento" style={labelStyle}>
                            Número Documento
                        </label>
                        <input
                            type="text"
                            name="num_documento"
                            id="num_documento"
                            value={huesped.num_documento}
                            onChange={manejarCambio}
                            required
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={huesped.email}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono" style={labelStyle}>Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            id="telefono"
                            value={huesped.telefono}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="fecha_nacimiento" style={labelStyle}>
                            Fecha Nacimiento
                        </label>
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            id="fecha_nacimiento"
                            value={huesped.fecha_nacimiento as string}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="nacionalidad" style={labelStyle}>Nacionalidad</label>
                        <input
                            type="text"
                            name="nacionalidad"
                            id="nacionalidad"
                            value={huesped.nacionalidad}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="ocupacion" style={labelStyle}>Ocupación</label>
                        <input
                            type="text"
                            name="ocupacion"
                            id="ocupacion"
                            value={huesped.ocupacion}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="condicionIVA" style={labelStyle}>
                            Condición IVA
                        </label>
                        <select
                            name="condicionIVA"
                            id="condicionIVA"
                            value={huesped.condicionIVA}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        >
                            {condicionesIVADisponibles.map((cond) => (
                                <option key={cond} value={cond}>
                                    {cond.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2
                    style={{
                        marginTop: '30px',
                        marginBottom: '20px',
                        color: '#555',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '10px',
                    }}
                >
                    Dirección
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '25px',
                        marginBottom: '30px',
                    }}
                >
                    <div>
                        <label htmlFor="direccion.calle" style={labelStyle}>Calle</label>
                        <input
                            type="text"
                            name="direccion.calle"
                            id="direccion.calle"
                            value={huesped.direccion.calle}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.numero" style={labelStyle}>Número</label>
                        <input
                            type="number"
                            name="direccion.numero"
                            id="direccion.numero"
                            value={huesped.direccion.numero || ''}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.piso" style={labelStyle}>Piso</label>
                        <input
                            type="number"
                            name="direccion.piso"
                            id="direccion.piso"
                            value={huesped.direccion.piso || ''}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.departamento" style={labelStyle}>
                            Departamento
                        </label>
                        <input
                            type="text"
                            name="direccion.departamento"
                            id="direccion.departamento"
                            value={huesped.direccion.departamento}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.codigoPostal" style={labelStyle}>
                            Código Postal
                        </label>
                        <input
                            type="number"
                            name="direccion.codigoPostal"
                            id="direccion.codigoPostal"
                            value={huesped.direccion.codigoPostal || ''}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.localidad" style={labelStyle}>
                            Localidad
                        </label>
                        <input
                            type="text"
                            name="direccion.localidad"
                            id="direccion.localidad"
                            value={huesped.direccion.localidad}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.provincia" style={labelStyle}>Provincia</label>
                        <input
                            type="text"
                            name="direccion.provincia"
                            id="direccion.provincia"
                            value={huesped.direccion.provincia}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="direccion.pais" style={labelStyle}>País</label>
                        <input
                            type="text"
                            name="direccion.pais"
                            id="direccion.pais"
                            value={huesped.direccion.pais}
                            onChange={manejarCambio}
                            style={fieldStyle}
                        />
                    </div>
                </div>

                {errorValidacion && (
                    <div style={{ color: 'red', marginBottom: '20px' }}>
                        {errorValidacion}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={cargando}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: cargando ? '#ccc' : '#007bff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: cargando ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    {cargando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>

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