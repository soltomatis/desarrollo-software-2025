import React, { useState } from 'react';

interface Huesped {
    id: number;
    nombre: string;
    apellido: string;
    tipo_documento: string; 
    num_documento: string; 
}

interface HuespedesEstadiaProps {
    huespedes: Huesped[];
    onHuespedSeleccionado: (huespedId: number) => void;
}

const HuespedesEstadia: React.FC<HuespedesEstadiaProps> = ({ 
    huespedes, 
    onHuespedSeleccionado 
}) => {
    
    const [huespedSeleccionadoId, setHuespedSeleccionadoId] = useState<number | null>(null);

    const manejarSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = Number(e.target.value);
        setHuespedSeleccionadoId(id);
        onHuespedSeleccionado(id);
    };

    if (!huespedes || huespedes.length === 0) {
        return <p>No hay huéspedes registrados para esta estadía.</p>;
    }

return (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h2>👥 Huéspedes en la Estadía</h2>
            <p>Seleccione el **Huésped Responsable** de la Factura.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>Seleccionar</th>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Nombre Completo</th>
                        <th style={tableHeaderStyle}>Documento</th> 
                    </tr>
                </thead>
                <tbody>
                    {huespedes.map((huesped) => (
                        <tr key={huesped.id} style={tableRowStyle(huesped.id === huespedSeleccionadoId)}>
                            <td style={tableCellStyle}>
                                <input
                                    type="radio"
                                    name="huesped-facturacion"
                                    value={huesped.id}
                                    checked={huesped.id === huespedSeleccionadoId}
                                    onChange={manejarSeleccion}
                                />
                            </td>
                            <td style={tableCellStyle}>{huesped.id}</td>
                            <td style={tableCellStyle}>
                                <strong>{huesped.apellido.toUpperCase()}</strong>, {huesped.nombre}
                            </td>
                            <td style={tableCellStyle}>
                                {huesped.tipo_documento}: {huesped.num_documento}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        
    );
};

const tableHeaderStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
};

const tableCellStyle: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #eee',
    textAlign: 'left',
};

const tableRowStyle = (isSelected: boolean): React.CSSProperties => ({
    backgroundColor: isSelected ? '#e0f7fa' : 'white', // Resalta la fila seleccionada
    cursor: 'pointer',
});

export default HuespedesEstadia;