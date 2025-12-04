"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Huesped, CriteriosBusquedaHuesped, TipoDocumento } from '@/interfaces/Huesped'; 
import { useRouter } from 'next/navigation';

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
  const [cargando, setCargando] = useState<boolean>(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false);
  const [huespedSeleccionado, setHuespedSeleccionado] = useState<Huesped | null>(null);
  
  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCriterios({ 
        ...criterios, 
        [e.target.name]: e.target.value 
    });
  };
  const manejarSeleccion = (huesped: Huesped) => {
    if (huespedSeleccionado && huespedSeleccionado.id === huesped.id) {
        setHuespedSeleccionado(null);
    } else {
        setHuespedSeleccionado(huesped);
    }
};

    const URL_BASE_API = 'http://localhost:8080'; 

    const manejarBusqueda = async (e: FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setBusquedaRealizada(true);
        setResultadosBusqueda([]);

        try {
            const parametrosBusqueda = {
                apellido: criterios.apellido,
                nombre: criterios.nombre,
                tipo_documento: criterios.tipo_documento, 
                num_documento: criterios.num_documento,  
            };

            const params = new URLSearchParams(parametrosBusqueda as any);

            const url = `${URL_BASE_API}/api/huespedes/buscar?${params.toString()}`;

            console.log("URL de Búsqueda Enviada:", url); 

            const respuesta = await fetch(url);
            
            if (!respuesta.ok) {
                const errorBody = await respuesta.text();
                console.error("Detalle del Error 500 (Back-end):", errorBody);
                throw new Error(`Error en la búsqueda: ${respuesta.statusText}. Revisar logs del servidor.`);
            }

            const datos: Huesped[] = await respuesta.json();
            setResultadosBusqueda(datos);
            
        } catch (error) {
            console.error("Error al buscar huéspedes:", error);
            alert('Hubo un error al conectar con el servidor. Inténtalo de nuevo. Revisa la consola para detalles del 500.');
        } finally {
            setCargando(false);
        }
    };

    const manejarSiguiente = () => {
    if (huespedSeleccionado) {
        try {
            sessionStorage.setItem('huespedParaBorrar', JSON.stringify(huespedSeleccionado));
        } catch (e) {
            console.error("Error al guardar en sessionStorage:", e);
        }
        router.push(`/huespedes/borrar?id=${huespedSeleccionado.id}`);
    }
};

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif',color: '#000000' }}>
      <h1>🗑️ Buscar Huésped para Eliminar</h1>

      <form onSubmit={manejarBusqueda} style={formStyle}>
        
        <div>
          <label htmlFor="apellido">Apellido:</label>
          <input type="text" name="apellido" id="apellido" value={criterios.apellido} onChange={manejarCambio} style={inputStyle} />
        </div>

        <div>
          <label htmlFor="nombre">Nombres:</label>
          <input type="text" name="nombre" id="nombre" value={criterios.nombre} onChange={manejarCambio} style={inputStyle} />
        </div>

        <div>
          <label htmlFor="tipoDocumento">Tipo de Documento:</label>
          <select name="tipoDocumento" id="tipoDocumento" value={criterios.tipo_documento} onChange={manejarCambio} style={inputStyle}>
            <option value="">Cualquiera</option>
            {tiposDocumentoDisponibles.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="numeroDocumento">Número de Documento:</label>
          <input type="text" name="numeroDocumento" id="numeroDocumento" value={criterios.num_documento} onChange={manejarCambio} style={inputStyle} />
        </div>
        
        <div style={{ gridColumn: '1 / span 2', textAlign: 'right', marginTop: '10px' }}>
          <button type="submit" disabled={cargando} style={buttonStyle}>
            {cargando ? 'Buscando...' : '🔎 Buscar Huésped'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '30px' }}>
        {cargando && <p>Cargando resultados...</p>}

        {!cargando && busquedaRealizada && resultadosBusqueda.length > 0 && (
          <>
            <h2>Resultados Encontrados ({resultadosBusqueda.length})</h2>
            <table style={tableStyle}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Apellido, Nombre</th>
                    <th style={tableHeaderStyle}>Documento</th>
                    <th style={tableHeaderStyle}>Seleccionar</th> 
                    </tr>
                </thead>
                <tbody>
                    {resultadosBusqueda.map((huesped, index) => {
                    const isSelected = !!huespedSeleccionado && huespedSeleccionado.id === huesped.id;
                    
                    return (
                        <tr 
                        key={huesped.id ?? index} 
                        style={{ 
                            borderBottom: '1px solid #eee',
                            backgroundColor: isSelected ? '#e6f7ff' : 'transparent' 
                        }}
                        > 
                        <td style={tableCellStyle}>{huesped.id}</td>
                        <td style={tableCellStyle}>{huesped.apellido}, {huesped.nombre}</td>
                        <td style={tableCellStyle}>{huesped.tipo_documento} {huesped.num_documento}</td>
                        <td style={tableCellStyle}>
                                    <input 
                                    type="radio" 
                                    name="radioHuesped" 
                                    value={huesped.id} 
                                    checked={isSelected} 
                                    onChange={() => manejarSeleccion(huesped)}
                                    style={{ cursor: 'pointer' }}
                                    />
                                </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button 
                        onClick={manejarSiguiente}
                        disabled={!huespedSeleccionado}
                        style={{ 
                        ...buttonStyle, 
                        backgroundColor: huespedSeleccionado ? '#1890ff' : '#ccc',
                        cursor: huespedSeleccionado ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Siguiente
                    </button>
                </div>
          </>
        )}

        {!cargando && busquedaRealizada && resultadosBusqueda.length === 0 && (
          <p style={{ padding: '15px', border: '1px solid #ffcc00', backgroundColor: '#fffbe5', color: '#665100', borderRadius: '4px' }}>
            No se encontraron huéspedes que coincidan con los criterios especificados.
          </p>
        )}
      </div>
    </div>
  );
}

const formStyle: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '15px', 
    border: '1px solid #ccc', 
    padding: '20px', 
    borderRadius: '8px',
    backgroundColor: '#f9f9f9' 
};

const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '8px', 
    boxSizing: 'border-box', 
    borderRadius: '4px', 
    border: '1px solid #ddd', 
    marginTop: '5px' 
};

const buttonStyle: React.CSSProperties = { 
    padding: '10px 20px', 
    backgroundColor: '#0070f3', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    transition: 'background-color 0.3s'
};

const tableStyle: React.CSSProperties = { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '15px' ,
    color: '#ddd'
};

const tableHeaderStyle: React.CSSProperties = { 
    padding: '12px', 
    textAlign: 'left', 
    borderBottom: '2px solid #aaa' ,
    color: '#ddd'
};

const tableCellStyle: React.CSSProperties = { 
    padding: '10px', 
    borderBottom: '1px solid #eee' 
};
