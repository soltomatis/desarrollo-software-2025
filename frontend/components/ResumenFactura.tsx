import React from 'react';
import { FacturaPreliminar, ItemFactura } from '@/interfaces/FacturaPreliminar';


interface ResumenFacturaProps {
    resumen: FacturaPreliminar; 
    onAceptarFactura: () => void; 
    isLoading: boolean;
    selectedIds: number[];
    onToggleItemSelection: (itemId: number) => void;
    subtotalNetoCalculado: number;
    montoIVACalculado: number;
    totalAPagarCalculado: number;
}

const ResumenFactura: React.FC<ResumenFacturaProps> = ({ resumen, onAceptarFactura, isLoading ,selectedIds, onToggleItemSelection,subtotalNetoCalculado, 
    montoIVACalculado, 
    totalAPagarCalculado }) => {

    const formatCurrency = (amount: number | null | undefined) => {
    const safeAmount = amount ?? 0; 
    return `$ ${safeAmount.toFixed(2)}`;
    };

    return (
        <div style={{ marginTop: '30px', border: '2px solid #007bff', padding: '20px', backgroundColor: '#f9f9f9' }}>
            
            <h3>📋 Factura Preliminar</h3>
            <p>Responsable: 
                <strong>{resumen.nombreResponsable}</strong> 
                ({resumen.tipoDocumento}: {resumen.numeroDocumento})
            </p>
            
            <hr />

            <h4>Detalle de Cargos:</h4>
            <ul>
                {resumen.items.map((item: ItemFactura, index: number) => (
                    <li key={index} style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => onToggleItemSelection(item.id)}
                            style={{ marginRight: '10px' }}
                        />
                        <span>✔ {item.descripcion}</span>
                        <span>{formatCurrency(item.valor)}</span>
                    </li>
                ))}
            </ul>
            
            <hr />
            {resumen.tipoFactura === 'A' ? (
                    <>
                        <p>Subtotal Neto: <span>{formatCurrency(subtotalNetoCalculado)}</span></p> 
                        <p>IVA (21%): <span>{formatCurrency(montoIVACalculado)}</span></p>
                    </>
                ) : (
                    <>
                        <p>Subtotal (IVA Incluido): <span>{formatCurrency(totalAPagarCalculado)}</span></p> 
                        {montoIVACalculado > 0 && <p style={{ color: '#aaa', fontSize: '0.9em' }}>*IVA incluido: {formatCurrency(montoIVACalculado)}</p>}
                    </>
                )}

                <h3 style={{ color: 'green', borderTop: '2px solid #007bff', paddingTop: '10px', marginTop: '10px' }}>
                    TOTAL A PAGAR: <span>{formatCurrency(totalAPagarCalculado)}</span>
                </h3>

            <p style={{ fontWeight: 'bold' }}>Tipo de Factura a Generar: 
                <span style={{ color: resumen.tipoFactura === 'A' ? '#d9534f' : '#337ab7' }}> Factura {resumen.tipoFactura}</span>
            </p>

            <button 
                onClick={onAceptarFactura}
                disabled={isLoading}
                style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#5cb85c', 
                    color: 'white', 
                    border: 'none', 
                    marginTop: '15px', 
                    cursor: isLoading ? 'not-allowed' : 'pointer' 
                }}
            >
                {isLoading ? 'Generando Factura...' : 'ACEPTAR y Generar Factura'}
            </button>
        </div>
    );
};

export default ResumenFactura;