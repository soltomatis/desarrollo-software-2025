'use client';

import React from 'react';
import { Habitacion } from '@/interfaces/Habitacion';
import { EstadoHabitacion } from '@/interfaces/EstadoHabitacion';

interface GrillaProps {
  habitaciones: Habitacion[];
  fechaDesde: string;
  fechaHasta: string;
}

export default function GrillaDisponibilidad({ habitaciones, fechaDesde, fechaHasta }: GrillaProps) {

  const generarDias = (inicio: string, fin: string) => {
    const lista = [];
    const actual = new Date(inicio);
    const final = new Date(fin);
    actual.setMinutes(actual.getMinutes() + actual.getTimezoneOffset());
    final.setMinutes(final.getMinutes() + final.getTimezoneOffset());

    while (actual <= final) {
      lista.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }
    return lista;
  };

  const dias = generarDias(fechaDesde, fechaHasta);

  const obtenerColor = (habitacion: Habitacion, fechaActual: string) => {
    const estadoEncontrado = habitacion.historiaEstados.find((estado) => {
      return fechaActual >= estado.fechaInicio && fechaActual <= estado.fechaFin;
    });

    if (!estadoEncontrado) {
      return '#28a745';
    }


    const tipoEstado = estadoEncontrado.estado.toUpperCase();

    switch (tipoEstado) {
      case 'RESERVADA': return '#fd7e14';
      case 'OCUPADA':   return '#dc3545';
      case 'FUERA_DE_SERVICIO': return '#000000'; 
      default: return '#28a745';
    }
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px' }}>
        
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
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#f8f9fa', position: 'sticky', left: 0 }}>
                {dia}
              </td>

              {habitaciones.map((hab) => {
                const colorFondo = obtenerColor(hab, dia);
                return (
                  <td key={`${hab.numeroHabitacion}-${dia}`} style={{ border: '1px solid #ddd', textAlign: 'center', padding: 0 }}>
                    <div 
                      title={`Hab: ${hab.numeroHabitacion} - Fecha: ${dia}`} 
                      style={{ 
                        backgroundColor: colorFondo, 
                        width: '100%', 
                        height: '40px', 
                        transition: 'opacity 0.2s'
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
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#28a745', marginRight: 5 }}></div> Libre</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#fd7e14', marginRight: 5 }}></div> Reservada</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#dc3545', marginRight: 5 }}></div> Ocupada</div>
        <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 15, height: 15, backgroundColor: '#000000', marginRight: 5 }}></div> Fuera de Servicio</div>
      </div>
    </div>
  );
}