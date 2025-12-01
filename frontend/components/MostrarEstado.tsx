'use client'; 

import React, { useState } from 'react';

interface MostrarEstadoProps {
  onSearch: (fechaDesde: string, fechaHasta: string) => void; 
}

export default function MostrarEstado({ onSearch }: MostrarEstadoProps) {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const manejarClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (desde && hasta) {
      onSearch(desde, hasta);
    } else {
      alert("Por favor selecciona ambas fechas");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3>Filtrar por Fecha</h3>
      <form onSubmit={manejarClick} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem' }}>Fecha Desde:</label>
          <input 
            type="date" 
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem' }}>Fecha Hasta:</label>
          <input 
            type="date" 
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Buscar
        </button>

      </form>
    </div>
  );
}