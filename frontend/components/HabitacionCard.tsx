import React from 'react';
import { Habitacion } from '@/interfaces/Habitacion';

interface ReservaHabitacionInfo {
    habitacion: Habitacion;
    fecha_inicio: string;
    fecha_fin: string;
}

interface HabitacionCardProps {
    reservaInfo: ReservaHabitacionInfo;
}

function formatReservaDate(dateStr: string, time: '12:00hs' | '10:00hs'): string {
    const date = new Date(dateStr + 'T00:00:00'); // Añade T00:00:00 para evitar problemas de zona horaria
    
    // Configuración para español (Argentina/Chile, etc.)
    const locale = 'es-ES'; 
    
    // Obtener nombre del día (ej: "lunes")
    const nombreDia = date.toLocaleDateString(locale, { weekday: 'long' });
    
    // Obtener fecha dd/mm/aaaa
    const fecha = date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Capitalizar el nombre del día
    const nombreDiaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

    return `${nombreDiaCapitalizado}, ${fecha}, ${time}`;
}


const HabitacionCard: React.FC<HabitacionCardProps> = ({ reservaInfo }) => {
    
    const { habitacion, fecha_inicio, fecha_fin } = reservaInfo;
    
    // Aplicamos los formatos solicitados
    const ingresoFormato = formatReservaDate(fecha_inicio, '12:00hs');
    const egresoFormato = formatReservaDate(fecha_fin, '10:00hs');

    // Función para obtener la capacidad total de camas
    const getCapacidadCamas = () => {
        const individual = habitacion.cantidadCamaI || 0;
        const doble = (habitacion.cantidadCamaD || 0) * 2;
        const king = (habitacion.cantidadCamaKS || 0) * 2;
        return individual + doble + king;
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-md p-4 bg-white">
            
            {/* Título y Tipo de Habitación */}
            <h3 className="text-xl font-bold text-indigo-700 mb-2">
                Habitación N° {habitacion.numeroHabitacion}
            </h3>
            <p className="text-gray-600 mb-2">
                Tipo: <span className="font-semibold">{habitacion.tipo}</span>
            </p>

            <hr className="my-2 border-gray-200"/>

            {/* Detalles de Ingreso */}
            <div className="p-2 bg-green-50 rounded mb-1">
                <span className="text-gray-700 font-medium block">Ingreso:</span>
                <span className="text-green-800 font-bold">{ingresoFormato}</span>
            </div>

            {/* Detalles de Egreso */}
            <div className="p-2 bg-red-50 rounded">
                <span className="text-gray-700 font-medium block">Egreso:</span>
                <span className="text-red-800 font-bold">{egresoFormato}</span>
            </div>
            
        </div>
    );
};

export default HabitacionCard;

export type { ReservaHabitacionInfo };