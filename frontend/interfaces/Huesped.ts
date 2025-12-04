export type TipoDocumento = 'DNI' | 'LE' | 'LC' | 'Pasaporte' | 'Otro' | '';

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
}

export interface CriteriosBusquedaHuesped {
  apellido: string;
  nombre: string;
  tipo_documento: TipoDocumento | '';
  num_documento: string;
}