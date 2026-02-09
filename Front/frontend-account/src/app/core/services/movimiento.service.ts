import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Movimiento } from '../models/movimiento.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'http://localhost:8080/api/movimientos';

  constructor(private http: HttpClient) {}

  obtenerPorCliente(clienteId: string | number, fechaInicio?: string, fechaFin?: string): Observable<Movimiento[]> {
    let url = `${this.apiUrl}/cliente/${clienteId}`;
    const params: string[] = [];
    if (fechaInicio?.trim()) params.push(`fechaInicio=${encodeURIComponent(fechaInicio.trim())}`);
    if (fechaFin?.trim()) params.push(`fechaFin=${encodeURIComponent(fechaFin.trim())}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<Movimiento[]>(url).pipe(
      map((movimientos) => (Array.isArray(movimientos) ? movimientos : []).map((m) => ({
        ...m,
        id: (m as { movimientoId?: string | number }).movimientoId ?? m.id
      }))),
      tap(movimientos => console.log('Movimientos cargados:', movimientos?.length ?? 0)),
      catchError((error) => {
        console.error('Error cargando movimientos:', error);
        throw error;
      })
    );
  }

  obtenerTiposMovimiento(): Array<{ valor: string; etiqueta: string }> {
    return [
      { valor: 'DEBITO', etiqueta: 'Débito' },
      { valor: 'CREDITO', etiqueta: 'Crédito' }
    ];
  }

  crear(payload: { numeroCuenta: string; tipoMovimiento: 'DEBITO' | 'CREDITO'; valor: number }): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, payload).pipe(
      map((res) => ({
        ...res,
        id: (res as { movimientoId?: string | number }).movimientoId ?? res.id
      })),
      catchError((error) => {
        console.error('Error creando movimiento:', error);
        throw error;
      })
    );
  }

  eliminar(id: string | number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error eliminando movimiento:', error);
        throw error;
      })
    );
  }
}
