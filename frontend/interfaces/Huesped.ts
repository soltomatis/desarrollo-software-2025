export type TipoDocumento = 'DNI' | 'LE' | 'LC' | 'Pasaporte' | 'Otro' | '';
export type CondicionIVA = 
    | 'RESPONSABLE_INSCRIPTO' 
    | 'MONOTRIBUTO' 
    | 'CONSUMIDOR_FINAL' 
    | 'EXENTO';
export interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: TipoDocumento;
  num_documento: string;
  email: string;
  nacionalidad: string;
  fecha_nacimiento?: string;
  telefono?: string;
  cuit?: number; 
  ocupacion?: string; 
  condicionIVA: CondicionIVA;
  direccion: Direccion;
}

export interface CriteriosBusquedaHuesped {
  apellido: string;
  nombre: string;
  tipo_documento: TipoDocumento | '';
  num_documento: string;
}
export interface Direccion {

  calle: string;
  numero: number;
  piso: number;
  departamento: string;
  codigoPostal: number;
  localidad: string;
  provincia: string;
  pais: string;
}