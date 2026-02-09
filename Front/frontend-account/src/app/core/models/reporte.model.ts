// Modelo Reporte (estado de cuenta PDF base64)
export interface Reporte {
  clienteId: number;
  nombre?: string;
  identificacion?: string;
  contenido: string; // Base64 del PDF
  formato: string;
  fechaGeneracion?: Date;
}
