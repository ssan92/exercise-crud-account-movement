import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { Movimiento } from '../models/movimiento.model';

/**
 * MovimientoService: Gestión de datos de movimientos bancarios
 * SRP: Solo se encarga de operaciones CRUD
 * DI: Se inyecta en componentes que lo necesiten
 */
@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'http://localhost:8080/api/movimientos';
  private movimientos$ = new BehaviorSubject<Movimiento[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Obtiene movimientos de un cliente con filtro de fecha
   * GET /api/movimientos/cliente/{clienteId}?fechaInicio=yyyy-MM-dd
   */
  obtenerPorCliente(clienteId: string | number, fechaInicio?: string): Observable<Movimiento[]> {
    this.loading$.next(true);
    let url = `${this.apiUrl}/cliente/${clienteId}`;
    
    if (fechaInicio) {
      url += `?fechaInicio=${fechaInicio}`;
    }

    return this.http.get<Movimiento[]>(url).pipe(
      tap(movimientos => {
        console.log('✓ Movimientos cargados:', movimientos);
        this.movimientos$.next(movimientos);
        this.loading$.next(false);
      }),
      catchError((error) => {
        console.error('✗ Error cargando movimientos:', error);
        this.movimientos$.next([]);
        this.loading$.next(false);
        throw error;
      }),
      shareReplay(1)
    );
  }

  /**
   * Obtiene todos los movimientos cargados
   */
  obtenerTodos(): Movimiento[] {
    return this.movimientos$.value;
  }

  /**
   * Observable del estado de carga
   */
  obtenerLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Obtiene los tipos de movimiento disponibles
   */
  obtenerTiposMovimiento(): Array<{ valor: string; etiqueta: string }> {
    return [
      { valor: 'DEBITO', etiqueta: 'Débito' },
      { valor: 'CREDITO', etiqueta: 'Crédito' }
    ];
  }

  /**
   * Busca movimientos por número de cuenta
   */
  buscarPorNumeroCuenta(numeroCuenta: string): Movimiento[] {
    return this.movimientos$.value.filter(m =>
      m.numeroCuenta.toLowerCase().includes(numeroCuenta.toLowerCase())
    );
  }

  /**
   * Busca movimientos por tipo
   */
  buscarPorTipo(tipo: string): Movimiento[] {
    return this.movimientos$.value.filter(m => m.tipoMovimiento === tipo);
  }

  /**
   * Crea un nuevo movimiento
   * POST /api/movimientos
   */
  crear(movimiento: Omit<Movimiento, 'id' | 'fecha'>): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, movimiento)
      .pipe(
        tap(nuevoMovimiento => {
          const movimientosActuales = this.movimientos$.value;
          this.movimientos$.next([...movimientosActuales, nuevoMovimiento]);
          console.log('✓ Movimiento creado:', nuevoMovimiento);
        }),
        catchError((error) => {
          console.error('✗ Error creando movimiento:', error);
          throw error;
        })
      );
  }

  /**
   * Elimina un movimiento
   * DELETE /api/movimientos/{id}
   */
  eliminar(id: string | number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        tap(() => {
          const movimientosActuales = this.movimientos$.value;
          const movimientosFiltrados = movimientosActuales.filter(m => m.id !== id);
          this.movimientos$.next(movimientosFiltrados);
          console.log('✓ Movimiento eliminado:', id);
        }),
        catchError((error) => {
          console.error('✗ Error eliminando movimiento:', error);
          throw error;
        })
      );
  }
}
