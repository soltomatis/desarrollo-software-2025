import { EstadoHabitacion } from './EstadoHabitacion';

export interface Habitacion {
  numeroHabitacion: number; 
  tipo: string;
  cantidadHuespedes: number;
  cantidadCamaI: number;
  cantidadCamaD: number;
  cantidadCamaKS: number;
  historiaEstados: EstadoHabitacion[]; 
}