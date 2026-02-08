/**
 * Modelo Cuenta - Interfaz para las cuentas bancarias
 */
export interface Cuenta {
  id?: string | number;
  numeroCuenta: string;
  tipoCuenta: 'AHORRO' | 'CORRIENTE' | 'DEPOSITO';
  saldoInicial: number;
  saldo?: number;
  estado: boolean;
  clienteId: number | string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
