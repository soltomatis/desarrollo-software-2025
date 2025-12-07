'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HuespedesEstadia from '@/components/HuespedEstadia';
import ResumenFactura from '@/components/ResumenFactura';
import { FacturaPreliminar, ItemFactura } from '@/interfaces/FacturaPreliminar';

interface EstadiaBusquedaForm {
    numeroHabitacion: string;
    horaSalida: string;
}

const FacturacionPage = () => {
    const [formData, setFormData] = useState<EstadiaBusquedaForm>({
        numeroHabitacion: '',
        horaSalida: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [busquedaExitosa, setBusquedaExitosa] = useState(false);
    const [estadiaEncontrada, setEstadiaEncontrada] = useState<any>(null);
    const [huespedResponsableId, setHuespedResponsableId] = useState<number | null>(null);
    const [resumenFactura, setResumenFactura] = useState<FacturaPreliminar | null>(null);
    const [huespedSeleccionado, setHuespedSeleccionado] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [selectedConsumoIds, setSelectedConsumoIds] = useState<number[]>([]);
    const [modoTercero, setModoTercero] = useState(false);
    const [cuitTercero, setCuitTercero] = useState('');
    const [terceroEncontrado, setTerceroEncontrado] = useState<any>(null);
    const [mostrarFormularioAlta, setMostrarFormularioAlta] = useState(false);
    const [responsableTerceroId, setResponsableTerceroId] = useState<number | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const getItemsSeleccionados = () => {
        if (!resumenFactura || !resumenFactura.items) return [];
        return resumenFactura.items.filter(item => 
            selectedConsumoIds.includes(item.id)
        );
    };
    const subtotalBrutoSeleccionado = getItemsSeleccionados().reduce((sum, item) => sum + (item.valor ?? 0), 0);
    const IVA_RATE = 0.21;
    const subtotalNetoSeleccionado = subtotalBrutoSeleccionado / (1 + IVA_RATE);
    const montoIVASeleccionado = subtotalBrutoSeleccionado - subtotalNetoSeleccionado;
    const totalAPagarSeleccionado = subtotalBrutoSeleccionado;

    const esMenorDeEdad = (fechaNacimientoStr: string): boolean => {
        const fechaNacimiento = new Date(fechaNacimientoStr);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        return edad < 18;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleToggleConsumo = (itemId: number) => {
        setSelectedConsumoIds(prevIds => {
            if (prevIds.includes(itemId)) {
                return prevIds.filter(id => id !== itemId);
            } else {
                return [...prevIds, itemId];
            }
        });
    };
    const buscarTercero = async () => {
        if (!cuitTercero) return;
        
        try {
            const response = await fetch(`http://localhost:8080/api/factura/buscar-cuit?cuit=${cuitTercero}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
            
            if (response.ok) {
                const data = await response.json();
                setTerceroEncontrado(data);
                setMostrarFormularioAlta(false);
            } else if (response.status === 404) {
                setTerceroEncontrado(null);
                if (confirm("El CUIT no existe. ¿Desea dar de alta un nuevo Responsable?")) {
                    setMostrarFormularioAlta(true); 
                }
            }
        } catch (error) {
            alert("Error de conexión al buscar tercero");
        }
    };

    const aceptarTercero = () => {
        if (terceroEncontrado) {
            setHuespedResponsableId(null);
            setHuespedSeleccionado(null); 
            setResponsableTerceroId(terceroEncontrado.id); 

            calcularResumenFactura(estadiaEncontrada.id, null, terceroEncontrado.id);
            setModoTercero(false);
        }
    };

    const cancelarTercero = () => {
        setTerceroEncontrado(null);
        setCuitTercero('');
        setMostrarFormularioAlta(false);
    };

    const manejarBusqueda = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setBusquedaExitosa(false);
        setEstadiaEncontrada(null);
        setResumenFactura(null);

        if (!formData.numeroHabitacion || !formData.horaSalida) {
            setError('Ambos campos (Número de Habitación y Hora de Salida) son obligatorios.');
            return;
        }

        try {
            const URL_BASE_API = 'http://localhost:8080/api'; 
            const url = `${URL_BASE_API}/estadia/buscar?numeroHabitacion=${formData.numeroHabitacion}&horaMinutoSalida=${formData.horaSalida}`;

            const respuesta = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` },
            });
            
            if (respuesta.ok) {
                const data = await respuesta.json(); 
                
                setEstadiaEncontrada(data);
                setBusquedaExitosa(true);
                console.log('Estadía encontrada:', data);

            } else {
                const errorTexto = await respuesta.text();
                throw new Error(errorTexto || 'Estadía no encontrada o error en la búsqueda.');
            }

        } catch (err: any) {
            console.error('Error durante la búsqueda:', err);
            setError(`Error en la búsqueda: ${err.message}`);
        }
    };
    const calcularResumenFactura = async (estadiaId: number, huespedId: number | null, responsableId: number | null) => {
        setResumenFactura(null); 
        setError(null);
        setSelectedConsumoIds([]);
        
        try {
            const URL_BASE_API = 'http://localhost:8080/api';
            const urlCalculo = `${URL_BASE_API}/factura/resumen`; 

            const datosCalculo = {
                estadiaId: Number(estadiaId), 
                huespedId: huespedId, 
                responsableId: responsableId, 
            };

            const respuesta = await fetch(urlCalculo, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` },
                body: JSON.stringify(datosCalculo),
            });

            if (respuesta.ok) {
                const resumen: FacturaPreliminar = await respuesta.json();
                
                const itemsFiltrados: ItemFactura[] = resumen.items.filter((item, index, self) => 
                    index === self.findIndex((t) => (
                        t.descripcion === item.descripcion 
                    ))
                );
                const resumenFiltrado: FacturaPreliminar = { ...resumen, items: itemsFiltrados };

                if (resumenFiltrado.items.length === 0) {
                } else {
                    setResumenFactura(resumenFiltrado); 
                }
            } else {
                const errorTexto = await respuesta.text();
                throw new Error(errorTexto || 'Error al calcular el resumen de la factura.');
            }
        } catch (err: any) {
            console.error('Error durante el cálculo:', err);
            setError(`Error en el cálculo: ${err.message}`);
        }
    };

    const manejarHuespedSeleccionado = async (id: number) => {
        const huesped = estadiaEncontrada.huespedes.find((h: any) => h.id === id);

        if (huesped && huesped.persona && huesped.persona.fechaNacimiento) {
            if (esMenorDeEdad(huesped.persona.fechaNacimiento)) {
                alert("⚠️ La persona seleccionada es menor de edad. Por favor elija otra.");
                return;
            }
        }

        setHuespedResponsableId(id);
        setResumenFactura(null); 
        setError(null);
        setSelectedConsumoIds([]);

        await calcularResumenFactura(estadiaEncontrada.id, id, null);
    };

    const manejarAceptarFactura = async (selectedConsumoIds: number[]) => { 
        if (selectedConsumoIds.length === 0) {
            alert("Por favor, selecciona al menos un ítem para facturar.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const URL_BASE_API = 'http://localhost:8080/api';
            const urlGenerar = `${URL_BASE_API}/factura/generar`; 
            
            const datosFacturacion = {
                estadiaId: estadiaEncontrada.id,
                huespedId: huespedResponsableId,  
                responsableId: responsableTerceroId, 
                idsConsumosSeleccionados: selectedConsumoIds, 
            };

            const respuestaFinal = await fetch(urlGenerar, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` },
                body: JSON.stringify(datosFacturacion),
            });
            
            if (respuestaFinal.ok) {
                const facturaId: number = await respuestaFinal.json();
                alert(`🎉 ¡Factura N° ${facturaId} generada y registrada con éxito!`);

                setResumenFactura(null); 
                
                if (huespedResponsableId) {
                await calcularResumenFactura(estadiaEncontrada.id, huespedResponsableId, null);
            } else if (responsableTerceroId) {
                await calcularResumenFactura(estadiaEncontrada.id, null, responsableTerceroId);
            }
                
            } else {
                const errorTexto = await respuestaFinal.text();
                throw new Error(errorTexto || 'Error desconocido al generar la factura.');
            }

        } catch (err: any) {
            console.error('Error al persistir factura:', err);
            setError(`Error en la generación final: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Facturación - Búsqueda de Estadía</h1>
            <p>Ingrese el número de habitación y la hora de salida para facturar.</p>

            <form onSubmit={manejarBusqueda}>
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="numeroHabitacion">Número de Habitación:</label>
                    <input
                        type="text"
                        id="numeroHabitacion"
                        name="numeroHabitacion"
                        value={formData.numeroHabitacion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="horaSalida">Hora de Salida (HH:MM):</label>
                    <input
                        type="time"
                        id="horaSalida"
                        name="horaSalida"
                        value={formData.horaSalida}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Buscar Estadía</button>
            </form>
            {estadiaEncontrada && estadiaEncontrada.huespedes && (
                <>
                    <HuespedesEstadia 
                        huespedes={estadiaEncontrada.huespedes}
                        onHuespedSeleccionado={manejarHuespedSeleccionado}
                    />
                    <div style={{ marginTop: '30px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
                        <h3>O facturar a un Tercero (Flujo 5.B)</h3>
                        
                        {!modoTercero ? (
                            <button onClick={() => setModoTercero(true)}>Ingresar CUIT Tercero</button>
                        ) : (
                            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Ingrese CUIT" 
                                        value={cuitTercero} 
                                        onChange={(e) => setCuitTercero(e.target.value)}
                                    />
                                    <button onClick={buscarTercero}>Buscar</button>
                                    <button onClick={() => { setModoTercero(false); cancelarTercero(); }}>Cerrar</button>
                                </div>

                                {terceroEncontrado && (
                                    <div style={{ marginTop: '15px', border: '1px solid green', padding: '10px' }}>
                                        <p><strong>Razón Social:</strong> {terceroEncontrado.razonSocial}</p>
                                        <p><strong>CUIT:</strong> {terceroEncontrado.cuit}</p>
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button 
                                                onClick={aceptarTercero} 
                                                style={{ backgroundColor: 'green', color: 'white' }}>
                                                ACEPTAR
                                            </button>
                                            <button 
                                                onClick={cancelarTercero}
                                                style={{ backgroundColor: 'red', color: 'white' }}>
                                                CANCELAR
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mostrarFormularioAlta && (
                                    <div style={{ marginTop: '15px', border: '1px solid orange', padding: '10px' }}>
                                        <h4>CU03: Dar Alta de Responsable de Pago</h4>
                                        <p>Aquí se cargaría el formulario para ingresar la Razón Social y demás datos necesarios.</p>
                                        <button onClick={() => { alert("Responsable dado de alta (Simulado). Volviendo al punto 5."); setMostrarFormularioAlta(false); setModoTercero(false); }}>
                                            Simular Alta y Aceptar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {resumenFactura && (
                        <ResumenFactura
                            resumen={resumenFactura}
                            onAceptarFactura={() => manejarAceptarFactura(selectedConsumoIds)}
                            isLoading={isLoading}
                            selectedIds={selectedConsumoIds}
                            onToggleItemSelection={handleToggleConsumo}
                            subtotalNetoCalculado={subtotalNetoSeleccionado}
                            montoIVACalculado={montoIVASeleccionado}
                            totalAPagarCalculado={totalAPagarSeleccionado}
                        />
                    )}
                </>
            )}
        </div>
    );
};


export default FacturacionPage;