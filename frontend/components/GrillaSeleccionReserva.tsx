'use client';

import React from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
 
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
}

export default function GrillaSeleccionReserva({ habitaciones, fechaDesde, fechaHasta, onSelect }: GrillaProps) {
    const [celdaInicioTemporal, setCeldaInicioTemporal] = React.useState<{ hab: number, dia: string } | null>(null);
    const [seleccionesAcumuladas, setSeleccionesAcumuladas] = React.useState<
        { habitaciones: number[], fechaInicio: string, fechaFin: string }[]
    >([]);
  
  const generarDias = (inicio: string, fin: string) => {
    const lista = [];
    const actual = new Date(inicio + 'T00:00:00'); 
    const final = new Date(fin + 'T00:00:00'); 

    while (actual <= final) {
      // El toISOString() genera YYYY-MM-DDT... por lo que tomamos solo la parte de la fecha
      lista.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }
    return lista;
  };
  
  const dias = generarDias(fechaDesde, fechaHasta);

  const obtenerColor = (habitacion: Habitacion, fechaActual: string) => {
    // Busca si la fecha actual cae dentro de algún estado reportado por el backend
    const estadoEncontrado = habitacion.historiaEstados.find((estado) => {
      // Usamos >= y <= para incluir los días de inicio y fin
      return fechaActual >= estado.fechaInicio && fechaActual <= estado.fechaFin;
    });

    if (!estadoEncontrado) {
      return '#28a745'; // VERDE: Libre (por defecto)
    }

    const tipoEstado = estadoEncontrado.estado.toUpperCase();

    switch (tipoEstado) {
      case 'RESERVADA': return '#fd7e14'; // Naranja
      case 'OCUPADA':   return '#dc3545'; // Rojo
      case 'FUERA_SERVICIO': // Usamos el nombre del enum de Java
      case 'FUERA_DE_SERVICIO': return '#000000'; // Negro
      default: return '#28a745'; // Verde por si acaso
    }
  };
const combinarMultiplesSelecciones = (
    selecciones: { habitaciones: number[], fechaInicio: string, fechaFin: string }[]
) => {
    if (selecciones.length === 0) {
        return { habitaciones: [], fechaInicio: null, fechaFin: null };
    }

    // Aplanar y obtener habitaciones únicas
    const todasHabsSet = new Set<number>();
    selecciones.forEach(s => s.habitaciones.forEach(h => todasHabsSet.add(h)));
    const habitacionesUnicas = Array.from(todasHabsSet);

    // Encontrar el rango de fechas MÍNIMO y MÁXIMO
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
  // ------------------------- Lógica de Selección (Manejo del Mouse) --------------------------
const handleClick = (habNum: number, dia: string) => {
    const celdaActual = { hab: habNum, dia };

    if (!celdaInicioTemporal) {
        // 1. PRIMER CLIC: Inicia un nuevo bloque
        setCeldaInicioTemporal(celdaActual);
        // Reseteamos las selecciones acumuladas solo si quieres que el primer clic borre todo.
        // Si quieres permitir añadir a una selección existente, omite la línea siguiente.
        // setSeleccionesAcumuladas([]); // <--- Opción para borrar todo
        
    } else {
        // 2. SEGUNDO CLIC: Finaliza el bloque y lo acumula
        
        // El punto final es la celda actual
        const celdaFinTemporal = celdaActual;
        
        // Calcula el rango rectangular final
        const nuevoRango = procesarSeleccion(celdaInicioTemporal, celdaFinTemporal);

        // 💡 3. Guarda el nuevo rango en la lista acumulada
        const nuevaLista = [...seleccionesAcumuladas, nuevoRango];
        setSeleccionesAcumuladas(nuevaLista);
        setCeldaInicioTemporal(null);
        
        // 💡 CAMBIO CLAVE: Enviamos la lista completa de bloques
        onSelect(nuevaLista);
    }
};
const limpiarSeleccion = () => {
        setSeleccionesAcumuladas([]);
        setCeldaInicioTemporal(null);
        onSelect([]); // Notificamos al padre que no hay selecciones
    };  

  // ------------------------- Lógica de Procesamiento --------------------------

  /**
   * Normaliza la selección (maneja la dirección del arrastre) y 
   * retorna los números de habitación y las fechas mínima/máxima.
   */
  const procesarSeleccion = (inicio: { hab: number, dia: string }, fin: { hab: number, dia: string }) => {
    const todosDias = generarDias(fechaDesde, fechaHasta);
    const indicesHabitaciones = habitaciones.map(h => h.numeroHabitacion);

    // Determinar el rango de fechas (Min y Max)
    const idxInicioDia = todosDias.indexOf(inicio.dia);
    const idxFinDia = todosDias.indexOf(fin.dia);
    const fechaMin = todosDias[Math.min(idxInicioDia, idxFinDia)];
    const fechaMax = todosDias[Math.max(idxInicioDia, idxFinDia)];

    // Determinar el rango de habitaciones (Min y Max)
    const idxInicioHab = indicesHabitaciones.indexOf(inicio.hab);
    const idxFinHab = indicesHabitaciones.indexOf(fin.hab);
    const numHabMin = Math.min(idxInicioHab, idxFinHab);
    const numHabMax = Math.max(idxInicioHab, idxFinHab);

    // Slice es exclusivo en el final, por eso se usa + 1
    const habsSeleccionadas = indicesHabitaciones.slice(numHabMin, numHabMax + 1);

    return {
        habitaciones: habsSeleccionadas,
        fechaInicio: fechaMin,
        fechaFin: fechaMax
    };
  };

  /**
   * Determina si una celda individual está dentro del rango de selección actual.
   */
 const isSelected = (habNum: number, dia: string) => {
    
    // 1. Verificar si está en las selecciones ya finalizadas
    const estaEnAcumuladas = seleccionesAcumuladas.some(rango => {
        const habSeleccionada = rango.habitaciones.includes(habNum);
        const diaSeleccionado = dia >= rango.fechaInicio && dia <= rango.fechaFin;
        return habSeleccionada && diaSeleccionado;
    });
    
    if (estaEnAcumuladas) return true;

    // 2. Verificar si está en el rango TEMPORAL que se está dibujando (entre el primer clic y el mouse)
    if (celdaInicioTemporal) {
        // En esta nueva lógica de dos clics, solo dibujamos la celda de inicio temporal
        // hasta que se hace el segundo clic.
        return celdaInicioTemporal.hab === habNum && celdaInicioTemporal.dia === dia;
    }

    return false;
};

  // --------------------------------- Renderizado ---------------------------------

  return (
    // Agregamos onMouseUp al div contenedor para que la selección termine incluso si el mouse sale de la celda
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      {seleccionesAcumuladas.length > 0 && (
                <button 
                    onClick={limpiarSeleccion}
                    style={{ marginBottom: '15px', padding: '5px 10px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                    🗑️ Limpiar {seleccionesAcumuladas.length} Bloque(s) Seleccionado(s)
                </button>
            )}
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
                const colorFondo = obtenerColor(hab, dia);
                const estaSeleccionada = isSelected(habNum, dia); 
                
                return (
                  <td key={`${habNum}-${dia}`} style={{ border: '1px solid #ddd', textAlign: 'center', padding: 0 }}>
                    <div 
                      onClick={() => handleClick(habNum, dia)} 
                      title={`Hab: ${habNum} - Fecha: ${dia}`}
                      // Aplicamos el estilo de selección si está dentro del rango temporal de arrastre
                      style={{ 
                        backgroundColor: colorFondo, 
                        width: '100%', 
                        height: '40px', 
                        cursor: 'pointer',
                        outline: estaSeleccionada ? '3px solid blue' : 'none', 
                        opacity: estaSeleccionada ? 0.8 : 1, // Menor opacidad para resaltar
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

      {/* Leyenda de Colores */}
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