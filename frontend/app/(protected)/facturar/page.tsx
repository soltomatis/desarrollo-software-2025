'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HuespedesEstadia from '@/components/HuespedEstadia';
import ResumenFactura from '@/components/ResumenFactura';
import { FacturaPreliminar, ItemFactura } from '@/interfaces/FacturaPreliminar';
import { AuthGate } from '@/components/AuthGate';

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
        return resumenFactura.items.filter(item => selectedConsumoIds.includes(item.id));
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
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;
        return edad < 18;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggleConsumo = (itemId: number) => {
        setSelectedConsumoIds(prevIds =>
            prevIds.includes(itemId) ? prevIds.filter(id => id !== itemId) : [...prevIds, itemId]
        );
    };

    const buscarTercero = async () => {
        if (!cuitTercero) return;
        try {
            const response = await fetch(`/api/factura/buscar-cuit?cuit=${cuitTercero}`, {
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
        } catch {
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
            const url = `/api/estadia/buscar?numeroHabitacion=${formData.numeroHabitacion}&horaMinutoSalida=${formData.horaSalida}`;
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (respuesta.ok) {
                const data = await respuesta.json(); 
                setEstadiaEncontrada(data);
                setBusquedaExitosa(true);
            } else {
                const errorTexto = await respuesta.text();
                throw new Error(errorTexto || 'Estadía no encontrada o error en la búsqueda.');
            }
        } catch (err: any) {
            setError(`Error en la búsqueda: ${err.message}`);
        }
    };

    const calcularResumenFactura = async (estadiaId: number, huespedId: number | null, responsableId: number | null) => {
        setResumenFactura(null); 
        setError(null);
        setSelectedConsumoIds([]);
        try {
            const urlCalculo = `/api/factura/resumen`; 
            const datosCalculo = { estadiaId, huespedId, responsableId };
            const respuesta = await fetch(urlCalculo, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(datosCalculo),
            });
            if (respuesta.ok) {
                const resumen: FacturaPreliminar = await respuesta.json();
                const itemsFiltrados: ItemFactura[] = resumen.items.filter((item, index, self) =>
                    index === self.findIndex((t) => t.descripcion === item.descripcion)
                );
                setResumenFactura({ ...resumen, items: itemsFiltrados });
            } else {
                const errorTexto = await respuesta.text();
                throw new Error(errorTexto || 'Error al calcular el resumen de la factura.');
            }
        } catch (err: any) {
            setError(`Error en el cálculo: ${err.message}`);
        }
    };

    const manejarHuespedSeleccionado = async (id: number) => {
        const huesped = estadiaEncontrada.huespedes.find((h: any) => h.id === id);
        if (huesped?.persona?.fechaNacimiento && esMenorDeEdad(huesped.persona.fechaNacimiento)) {
            alert("⚠️ La persona seleccionada es menor de edad. Por favor elija otra.");
            return;
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
            const urlGenerar = `/api/factura/generar`; 
            const datosFacturacion = {
                estadiaId: estadiaEncontrada.id,
                huespedId: huespedResponsableId,  
                responsableId: responsableTerceroId, 
                idsConsumosSeleccionados: selectedConsumoIds, 
            };
            const respuestaFinal = await fetch(urlGenerar, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
    <AuthGate>
        <div className="facturacion-root" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#333' }}>Facturación</h1>
        <p style={{ marginTop: 0, marginBottom: 18, color: '#555' }}>
            Busque la estadía por número de habitación y hora de salida.
        </p>

        <div style={{
            backgroundColor: '#f9f9f9',
            padding: 18,
            borderRadius: 10,
            marginBottom: 20,
            border: '1px solid #eee'
        }}>
            {error && (
            <div style={{
                backgroundColor: '#fff0f0',
                color: '#b00020',
                padding: 10,
                borderRadius: 6,
                marginBottom: 12,
                border: '1px solid #f4c2c2',
                fontWeight: 600
            }}>{error}</div>
            )}

            <form onSubmit={manejarBusqueda} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12, alignItems: 'end' }}>
            <div>
                <label style={{ display: 'block', fontSize: 13, color: '#222', marginBottom: 6 }}>Número de Habitación</label>
                <input
                type="text"
                id="numeroHabitacion"
                name="numeroHabitacion"
                value={formData.numeroHabitacion}
                onChange={handleChange}
                required
                placeholder="Ej: 101"
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    background: '#fff'
                }}
                />
            </div>

            <div>
                <label style={{ display: 'block', fontSize: 13, color: '#222', marginBottom: 6 }}>Hora de Salida</label>
                <input
                type="time"
                id="horaSalida"
                name="horaSalida"
                value={formData.horaSalida}
                onChange={handleChange}
                required
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    background: '#fff'
                }}
                />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                type="submit"
                style={{
                    padding: '10px 16px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
                >
                Buscar Estadía
                </button>
            </div>
            </form>
        </div>

        {estadiaEncontrada && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
            <div>
                <div className="facturacion-root" style={{ marginBottom: 12 }}>
                <h2 style={{ margin: '6px 0', color: '#222' }}>Huéspedes</h2>
                <div data-huespedes className="panel" style={{ background: '#fff', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                    <HuespedesEstadia
                    huespedes={estadiaEncontrada.huespedes}
                    onHuespedSeleccionado={manejarHuespedSeleccionado}
                    />
                </div>
                </div>

                <div className="facturacion-root" style={{ marginTop: 12 }}>
                <h3 style={{ margin: '6px 0', color: '#222' }}>Facturar a un tercero</h3>
                <div data-huespedes className="panel" style={{ background: '#fff', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                    {!modoTercero ? (
                    <button
                        onClick={() => setModoTercero(true)}
                        style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #ccc',
                        background: '#f5f7fa',
                        cursor: 'pointer'
                        }}
                    >
                        Ingresar CUIT Tercero
                    </button>
                    ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="CUIT"
                            value={cuitTercero}
                            onChange={(e) => setCuitTercero(e.target.value)}
                            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                        />
                        <button onClick={buscarTercero} style={{ padding: '8px 12px', borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none' }}>Buscar</button>
                        <button onClick={() => { setModoTercero(false); cancelarTercero(); }} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cerrar</button>
                        </div>

                        {terceroEncontrado && (
                        <div style={{ padding: 10, borderRadius: 6, background: '#f7fff6', border: '1px solid #e6ffed' }}>
                            <div><strong>Razón Social:</strong> {terceroEncontrado.razonSocial}</div>
                            <div><strong>CUIT:</strong> {terceroEncontrado.cuit}</div>
                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <button onClick={aceptarTercero} style={{ padding: '8px 10px', borderRadius: 6, background: '#16a34a', color: '#fff', border: 'none' }}>Aceptar</button>
                            <button onClick={cancelarTercero} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Cancelar</button>
                            </div>
                        </div>
                        )}

                        {mostrarFormularioAlta && (
                        <div style={{ padding: 10, borderRadius: 6, background: '#fff7e6', border: '1px solid #ffedd5' }}>
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>Dar Alta Responsable</div>
                            <div style={{ fontSize: 13, color: '#444' }}>Simulación — no hay formulario en esta vista.</div>
                            <div style={{ marginTop: 8 }}>
                            <button onClick={() => { alert("Responsable simulado"); setMostrarFormularioAlta(false); setModoTercero(false); }} style={{ padding: '8px 10px', borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none' }}>Simular Alta</button>
                            </div>
                        </div>
                        )}
                    </div>
                    )}
                </div>
                </div>
            </div>

            <aside className="facturacion-root">
                <h2 style={{ margin: '6px 0', color: '#222' }}>Resumen</h2>
                <div style={{ background: '#fff', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                {resumenFactura ? (
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
                ) : (
                    <div style={{ color: '#666', fontSize: 14 }}>Seleccione un huésped o busque un tercero para calcular el resumen.</div>
                )}
                </div>
            </aside>
            </div>
        )}
        <style jsx>{`

                .facturacion-root > h1,
                .facturacion-root > p,
                .facturacion-root > h2,
                .facturacion-root > h3,
                .facturacion-root > div > h2,
                .facturacion-root > div > h3 {
                    color: #fff !important;
                }
                
            /* Forzar texto negro en paneles blancos e inputs */
            .panel,
            .tercero-card,
            aside,
            .panel * {
                color: #000 !important;
            }

            /* Inputs, selects y textareas en negro (incluye placeholders legibles) */
            input, select, textarea {
                color: #000 !important;
            }

            /* Placeholder ligeramente gris, legible sobre fondo blanco */
            input::placeholder,
            textarea::placeholder {
                color: #6b6b6b !important;
                opacity: 1;
            }

            /* Asegurar títulos y párrafos en negro en las secciones principales */
            h1, h2, h3, p, label, .section-title {
                color: #000 !important;
            }

            /* Si tu componente ResumenFactura o HuespedesEstadia usan colores internos
                que no heredan, este selector intentará forzarlos también (último recurso). */
            .panel :is(div, span, p, li, td, th) {
                color: #000 !important;
            }
        `}</style>

        </div>
    </AuthGate>
    );
};

export default FacturacionPage;