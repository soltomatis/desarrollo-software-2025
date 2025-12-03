'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
export interface GrillaRef {
    limpiarSeleccion: () => void;
}
export interface BloqueSeleccionado {
    habitaciones: number[];
    fechaInicio: string;
    fechaFin: string;
}
interface GrillaProps {
  habitaciones: Habitacion[];
  fechaDesde: string;
  fechaHasta: string;
  onSelect: (bloques: BloqueSeleccionado[]) => void; 
  onConflict: (message: string) => void;
}

const GrillaSeleccionReserva: React.ForwardRefRenderFunction<GrillaRef, GrillaProps> = (
    { habitaciones, fechaDesde, fechaHasta, onSelect, onConflict }, 
    ref 
) => {
     const [celdaInicioTemporal, setCeldaInicioTemporal] = React.useState<{ hab: number, dia: string } | null>(null);
    const [seleccionesAcumuladas, setSeleccionesAcumuladas] = React.useState<
     { habitaciones: number[], fechaInicio: string, fechaFin: string }[]
    >([]);
  
  const generarDias = (inicio: string, fin: string) => {
    const lista = [];
    const actual = new Date(inicio + 'T00:00:00'); 
    const final = new Date(fin + 'T00:00:00'); 

    while (actual <= final) {
      lista.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }
    return lista;
  };
  
  const dias = generarDias(fechaDesde, fechaHasta);

const obtenerColor = (habitacion: Habitacion, fechaActual: string) => {

    const estadosAplicables = habitacion.historiaEstados.filter((estado) => {
        return fechaActual >= estado.fechaInicio && fechaActual <= estado.fechaFin;
    });

    if (estadosAplicables.length === 0) {
        return '#28a745'; 
    }

    estadosAplicables.sort((a, b) => {
        if (a.fechaInicio < b.fechaInicio) return 1;
        if (a.fechaInicio > b.fechaInicio) return -1; 
        return 0;
    });
    const estadoEncontrado = estadosAplicables[0];

    const tipoEstado = estadoEncontrado.estado.toUpperCase();

    switch (tipoEstado) {
        case 'RESERVADA': return '#fd7e14';
        case 'OCUPADA':   return '#dc3545'; 
        case 'FUERA_SERVICIO': 
        case 'FUERA_DE_SERVICIO': return '#000000'; 
        default: return '#28a745'; 
    }
};
const combinarMultiplesSelecciones = (
    selecciones: { habitaciones: number[], fechaInicio: string, fechaFin: string }[]
) => {
    if (selecciones.length === 0) {
        return { habitaciones: [], fechaInicio: null, fechaFin: null };
    }

    const todasHabsSet = new Set<number>();
    selecciones.forEach(s => s.habitaciones.forEach(h => todasHabsSet.add(h)));
    const habitacionesUnicas = Array.from(todasHabsSet);

    let minFecha = selecciones[0].fechaInicio;
    let maxFecha = selecciones[0].fechaFin;
    
    selecciones.forEach(s => {
        if (s.fechaInicio < minFecha) minFecha = s.fechaInicio;
        if (s.fechaFin > maxFecha) maxFecha = s.fechaFin;
    });

    return {
        habitaciones: habitacionesUnicas,
        fechaInicio: minFecha,
        fechaFin: maxFecha
    };
};
const esLibre = (habitacion: Habitacion, dia: string) => {
    return obtenerColor(habitacion, dia) === '#28a745'; 
};


const handleClick = (habNum: number, dia: string) => {
    const celdaActual = { hab: habNum, dia };

    if (!celdaInicioTemporal) {
        setCeldaInicioTemporal(celdaActual);
        
    } else {
        const celdaFinTemporal = celdaActual;
        
        const nuevoRango = procesarSeleccion(celdaInicioTemporal, celdaFinTemporal);

        const hayConflicto = habitaciones.some(hab => {
            if (nuevoRango.habitaciones.includes(hab.numeroHabitacion)) {
                const diasRango = generarDias(nuevoRango.fechaInicio, nuevoRango.fechaFin);
                
                return diasRango.some(fecha => {
                    return !esLibre(hab, fecha); 
                });
            }
          });
            const hayConflictoAcumulado = seleccionesAcumuladas.some(rangoAcumulado => {
            // 1. Verificar si hay al menos una habitación en común
            const habitacionesEnComun = rangoAcumulado.habitaciones.some(hab => 
                nuevoRango.habitaciones.includes(hab)
            );
            
            // Si hay habitaciones en común Y los rangos de fechas se superponen, hay conflicto.
            if (habitacionesEnComun) {
                return seSuperponenRangosFechas(
                    nuevoRango.fechaInicio, nuevoRango.fechaFin,
                    rangoAcumulado.fechaInicio, rangoAcumulado.fechaFin
                );
            }
            return false;
        });

        if (hayConflicto) {
            onConflict("El rango seleccionado contiene habitaciones no disponibles.");
            setCeldaInicioTemporal(null); 
            return; 
        }
        if (hayConflictoAcumulado) {
            onConflict("El nuevo rango se superpone con una reserva ya seleccionada. Limpia la selección para empezar de nuevo.");
            setCeldaInicioTemporal(null);
            return; 
        }

        const nuevaLista = [...seleccionesAcumuladas, nuevoRango];
        setSeleccionesAcumuladas(nuevaLista);
        setCeldaInicioTemporal(null);
        
        onSelect(nuevaLista);
    }
};
const limpiarSeleccion = () => {
      setSeleccionesAcumuladas([]);
      setCeldaInicioTemporal(null);
      onSelect([]); 
}; 
const seSuperponenRangosFechas = (inicioA: string, finA: string, inicioB: string, finB: string) => {
    return !((inicioA > finB) || (inicioB > finA));
};
React.useImperativeHandle(ref, () => ({
    limpiarSeleccion,
}));

  const procesarSeleccion = (inicio: { hab: number, dia: string }, fin: { hab: number, dia: string }) => {
    const todosDias = generarDias(fechaDesde, fechaHasta);
    const indicesHabitaciones = habitaciones.map(h => h.numeroHabitacion);

    const idxInicioDia = todosDias.indexOf(inicio.dia);
    const idxFinDia = todosDias.indexOf(fin.dia);
    const fechaMin = todosDias[Math.min(idxInicioDia, idxFinDia)];
    const fechaMax = todosDias[Math.max(idxInicioDia, idxFinDia)];

    const idxInicioHab = indicesHabitaciones.indexOf(inicio.hab);
    const idxFinHab = indicesHabitaciones.indexOf(fin.hab);
    const numHabMin = Math.min(idxInicioHab, idxFinHab);
    const numHabMax = Math.max(idxInicioHab, idxFinHab);

    const habsSeleccionadas = indicesHabitaciones.slice(numHabMin, numHabMax + 1);

    return {
        habitaciones: habsSeleccionadas,
        fechaInicio: fechaMin,
        fechaFin: fechaMax
    };
  };

const isSelected = (habNum: number, dia: string) => {
    const estaEnAcumuladas = seleccionesAcumuladas.some(rango => {
        const habSeleccionada = rango.habitaciones.includes(habNum);
        const diaSeleccionado = dia >= rango.fechaInicio && dia <= rango.fechaFin;
        return habSeleccionada && diaSeleccionado;
    });
    return estaEnAcumuladas; 
};


  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px', userSelect: 'none' }}>
        
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', position: 'sticky', left: 0, zIndex: 2 }}>
              Fecha \ Habitación
            </th>
            {habitaciones.map((hab) => (
              <th key={hab.numeroHabitacion} style={{ padding: '10px', border: '1px solid #ddd', backgroundColor: '#e9ecef', minWidth: '80px' }}>
                {hab.numeroHabitacion}
                <br />
                <span style={{ fontSize: '0.7em', fontWeight: 'normal' }}>{hab.tipo}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dias.map((dia) => (
            <tr key={dia}>
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#f8f9fa', position: 'sticky', left: 0, zIndex: 1 }}>
                {dia}
              </td>

              {habitaciones.map((hab) => {
                const habNum = hab.numeroHabitacion;
                const estaSeleccionada = isSelected(habNum, dia); 
                const colorOriginal = obtenerColor(hab, dia);
                const estaEnAcumuladas = seleccionesAcumuladas.some(rango => {
                  const habSeleccionada = rango.habitaciones.includes(habNum);
                  const diaSeleccionado = dia >= rango.fechaInicio && dia <= rango.fechaFin;
                  return habSeleccionada && diaSeleccionado;
              });
                const esCeldaTemporal = !estaEnAcumuladas && (celdaInicioTemporal?.hab === habNum && celdaInicioTemporal?.dia === dia);

                const colorFondoFinal = estaEnAcumuladas ? '#fd7e14' : colorOriginal;

                
                return (
                  <td key={`${habNum}-${dia}`} style={{ border: '1px solid #ddd', textAlign: 'center', padding: 0 }}>
                    <div 
                      onClick={() => handleClick(habNum, dia)} 
                      title={`Hab: ${habNum} - Fecha: ${dia}`}
                      style={{ 
                        backgroundColor: colorFondoFinal,
                        width: '100%', 
                        height: '40px', 
                        cursor: 'pointer',
                        outline: esCeldaTemporal ? '3px solid blue' : 'none', 
                        opacity: esCeldaTemporal ? 0.8 : 1, 
                        transition: 'opacity 0.2s, outline 0.1s'
                      }} 
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#28a745', marginRight: 5, borderRadius: '3px' }}></div> Libre</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#fd7e14', marginRight: 5, borderRadius: '3px' }}></div> Reservada</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#dc3545', marginRight: 5, borderRadius: '3px' }}></div> Ocupada</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#000000', marginRight: 5, borderRadius: '3px' }}></div> Fuera de Servicio</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: 'blue', marginRight: 5, borderRadius: '3px', outline: '3px solid blue', opacity: 0.5 }}></div> Selección Actual</div>

      </div>
    </div>
  );
}
export default React.forwardRef<GrillaRef, GrillaProps>(GrillaSeleccionReserva);