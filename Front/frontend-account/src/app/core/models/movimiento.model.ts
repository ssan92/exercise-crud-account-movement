/**
 * Modelo Movimiento - Interfaz para movimientos bancarios
 */
export interface Movimiento {
  id?: string | number;
  numeroCuenta: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  valor: number;
  fecha?: string;
  clienteId?: number | string;
  descripcion?: string;
  cuentaId?: number | string;
}
