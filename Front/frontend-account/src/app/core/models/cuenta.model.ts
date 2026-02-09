// Modelo Cuenta (numeroCuenta es el id)
export interface Cuenta {
  numeroCuenta: string;
  tipoCuenta: 'AHORRO' | 'CORRIENTE' | 'DEPOSITO';
  saldoInicial: number;
  estado: boolean;
  clienteId: number | string;
}
