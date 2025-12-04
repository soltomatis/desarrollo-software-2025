"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Huesped } from '@/interfaces/Huesped'; 

const URL_BASE_API = 'http://localhost:8080'; 

export default function PaginaBorrarHuesped() {
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const huespedId = searchParams.get('id'); 
    
    const [huesped, setHuesped] = useState<Huesped | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    interface HistorialCheck {
        tieneHistorial: boolean;
        mensaje: string;
    }
    useEffect(() => {
        if (!huespedId) {
            setError("ID de huésped no encontrado en la URL.");
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
                console.warn("Error al parsear el huésped de sessionStorage. Recurriendo a fetch.", e);
            }
        }
        const fetchHuesped = async () => {
            try {
                const url = `${URL_BASE_API}/api/huespedes/buscarPorId?id=${huespedId}`; 
                console.log(`Fallback: Haciendo fetch a: ${url}`);
                
                const respuesta = await fetch(url);

                if (!respuesta.ok) {
                    throw new Error(`Error al cargar huésped: ${respuesta.status}`);
                }

                const datos: Huesped = await respuesta.json();
                setHuesped(datos);
            } catch (err: any) {
                console.error("Error al cargar huésped:", err);
                setError(`No se pudo cargar la información del huésped: ${err.message}`);
            } finally {
                setCargando(false);
            }
        };

        fetchHuesped();
    }, [huespedId]);

const manejarBorrar = async () => {
        if (!huesped || !huesped.id) return;

        setError(null);

        try {
            const urlVerificar = `${URL_BASE_API}/api/huespedes/verificar-historial?id=${huesped.id}`;
            const resVerificar = await fetch(urlVerificar, { method: 'GET' });

            if (!resVerificar.ok) {
                const errText = await resVerificar.text();
                throw new Error(`Fallo al consultar historial: ${errText}`);
            }

            const historialCheck: HistorialCheck = await resVerificar.json();

            
            if (historialCheck.tieneHistorial) {
                alert(historialCheck.mensaje + "\nPRESIONE ACEPTAR PARA CONTINUAR…");
                
                router.push('/'); 
                return;
            } else {
                
                const confirmacion = window.confirm(
                    `${historialCheck.mensaje}\n\nPRESIONE ACEPTAR PARA ELIMINAR O CANCELAR PARA MANTENER.`
                );

                if (!confirmacion) {
                    return;
                }
                
                const urlBorrar = `${URL_BASE_API}/api/huespedes/borrar?id=${huesped.id}`;
                const resBorrar = await fetch(urlBorrar, { method: 'DELETE' });
                
                const mensajeBorrar = await resBorrar.text();

                if (!resBorrar.ok) {
                    setError(`Error al intentar borrar: ${mensajeBorrar || resBorrar.statusText}`);
                    return;
                }
                
                // Éxito
                alert("✅ Huésped eliminado exitosamente.");
                router.push('/');
            }

        } catch (err: any) {
            console.error("Error en el proceso de borrado:", err);
            setError(`Ocurrió un error inesperado: ${err.message}`);
        }
    };

    if (cargando) {
        return <div style={containerStyle}>Cargando detalles del huésped...</div>;
    }

    if (error) {
        return <div style={containerStyle}><p style={{color: 'red'}}>ERROR: {error}</p></div>;
    }

    if (!huesped) {
        return <div style={containerStyle}>No se encontraron datos del huésped.</div>;
    }

    return (
        <div style={containerStyle}>
            <h1>Confirmar Eliminación de Huésped</h1>
            <p>Por favor, revisa los detalles antes de confirmar la eliminación de la base de datos.</p>

            <div style={detailsBoxStyle}>
                <DetailRow label="ID" value={huesped.id.toString()} />
                <DetailRow label="Apellido y Nombre" value={`${huesped.apellido}, ${huesped.nombre}`} />
                <DetailRow label="Documento" value={`${huesped.tipo_documento} ${huesped.num_documento}`} />
                <DetailRow label="Email" value={huesped.email} />
                <DetailRow label="Nacionalidad" value={huesped.nacionalidad} />
            </div>

            <div style={buttonContainerStyle}>
                <button 
                    onClick={() => router.push('/')}
                    style={cancelButtonStyle}
                >
                    Cancelar
                </button>
                <button 
                    onClick={manejarBorrar}
                    style={deleteButtonStyle}
                >
                    Borrar Huésped
                </button>
            </div>
        </div>
    );
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={detailRowStyle}>
        <span style={labelStyle}>{label}:</span>
        <span style={valueStyle}>{value}</span>
    </div>
);

const containerStyle: React.CSSProperties = { 
    padding: '40px', 
    maxWidth: '600px', 
    margin: 'auto', 
    fontFamily: 'Arial, sans-serif', 
    color: '#333' 
};

const detailsBoxStyle: React.CSSProperties = {
    border: '1px solid #ff4d4f', 
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff0f0',
    marginTop: '20px',
    marginBottom: '30px',
};

const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px dotted #ff4d4f'
};

const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginRight: '15px'
};

const valueStyle: React.CSSProperties = {
    textAlign: 'right'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between'
};

const cancelButtonStyle: React.CSSProperties = { 
    padding: '12px 25px', 
    backgroundColor: '#ccc', 
    color: '#333', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    transition: 'background-color 0.3s'
};

const deleteButtonStyle: React.CSSProperties = { 
    padding: '12px 25px', 
    backgroundColor: '#ff4d4f',
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    transition: 'background-color 0.3s'
};