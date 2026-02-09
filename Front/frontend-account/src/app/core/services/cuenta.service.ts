import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Cuenta } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:8080/api/cuentas';

  constructor(private http: HttpClient) {}

  obtenerTodas$(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.apiUrl).pipe(
      tap(cuentas => console.log('Cuentas cargadas:', cuentas?.length ?? 0)),
      catchError((error) => {
        console.error('Error cargando cuentas:', error);
        throw error;
      })
    );
  }

  obtenerPorNumeroCuenta(numeroCuenta: string): Observable<Cuenta> {
    const url = `${this.apiUrl}/${numeroCuenta}`;
    return this.http.get<Cuenta>(url).pipe(
      catchError((error) => {
        console.error('Error obteniendo cuenta:', error);
        throw error;
      })
    );
  }

  obtenerPorClienteId$(clienteId: string | number): Observable<Cuenta[]> {
    const url = `${this.apiUrl}/cliente/${clienteId}`;
    return this.http.get<Cuenta[]>(url).pipe(
      catchError((error) => {
        console.error('Error cargando cuentas del cliente:', error);
        throw error;
      })
    );
  }

  buscarPorNumeroCuenta(numeroCuenta: string): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.apiUrl).pipe(
      map(cuentas => {
        const numeroLower = numeroCuenta.toLowerCase();
        return cuentas.filter(c =>
          c.numeroCuenta.toLowerCase().includes(numeroLower)
        );
      }),
      catchError((error) => {
        console.error('Error buscando cuentas:', error);
        throw error;
      })
    );
  }

  crear(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.apiUrl, cuenta).pipe(
      catchError((error) => {
        console.error('Error creando cuenta:', error);
        throw error;
      })
    );
  }

  actualizar(numeroCuenta: string, cuenta: Partial<Cuenta>): Observable<Cuenta> {
    const url = `${this.apiUrl}/cuenta/${numeroCuenta}`;
    return this.http.put<Cuenta>(url, cuenta).pipe(
      catchError((error) => {
        console.error('Error actualizando cuenta:', error);
        throw error;
      })
    );
  }

  eliminar(numeroCuenta: string): Observable<void> {
    const url = `${this.apiUrl}/cuenta/${numeroCuenta}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error eliminando cuenta:', error);
        throw error;
      })
    );
  }

  obtenerTiposCuenta(): Array<{ valor: string; etiqueta: string }> {
    return [
      { valor: 'AHORRO', etiqueta: 'Cuenta de Ahorro' },
      { valor: 'CORRIENTE', etiqueta: 'Cuenta Corriente' }
    ];
  }
}
