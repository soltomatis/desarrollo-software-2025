export type EstadoTipo = 'LIBRE'| 'OCUPADA' | 'FUERA_DE_SERVICIO' | 'RESERVADA';

export interface EstadoHabitacion {
  id: number;
  estado: EstadoTipo;     
  fechaInicio: string;       
  fechaFin: string;          
}