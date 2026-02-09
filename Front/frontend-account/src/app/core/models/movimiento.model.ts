// Modelo Movimiento
export interface Movimiento {
  id?: string | number;
  movimientoId?: string | number;
  numeroCuenta: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  valor: number;
  fecha?: string;
  saldo?: number;
  clienteId?: number | string;
  descripcion?: string;
  cuentaId?: number | string;
}
