/**
 * Modelo Cliente - Interfaz para clientes bancarios
 */
export interface Cliente {
  clienteId?: string | number;
  nombre: string;
  genero: 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'Masculino' | 'Femenino' | 'Otro';
  edad: number | string;
  identificacion: string;
  direccion: string;
  telefono: string;
  contrasena: string;
  estado?: boolean;
}