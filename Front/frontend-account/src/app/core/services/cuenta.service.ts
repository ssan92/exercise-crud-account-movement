import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, finalize, shareReplay } from 'rxjs/operators';
import { Cuenta } from '../models/cuenta.model';

/**
 * CuentaService: Gestión de datos de cuentas bancarias
 * SRP: Solo se encarga de operaciones CRUD
 * DI: Se inyecta en componentes que la necesiten
 */
@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:8080/api/cuentas';
  private cuentas$ = new BehaviorSubject<Cuenta[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private cuentasCache$: Observable<Cuenta[]>;

  constructor(private http: HttpClient) {
    this.cuentasCache$ = this.http.get<Cuenta[]>(this.apiUrl).pipe(
      tap(cuentas => {
        console.log('✓ Cuentas cargadas:', cuentas);
        this.cuentas$.next(cuentas);
      }),
      catchError((error) => {
        console.error('✗ Error cargando cuentas:', error);
        this.cuentas$.next([]);
        throw error;
      }),
      shareReplay(1)
    );
    // Iniciar la carga
    this.cuentasCache$.subscribe();
  }

  /**
   * Obtiene todas las cuentas
   * GET /api/cuentas
   */
  obtenerTodas(): Cuenta[] {
    return this.cuentas$.value;
  }

  /**
   * Observable de todas las cuentas
   * Usa shareReplay para asegurar que todos los suscriptores obtengan el mismo resultado
   */
  obtenerTodas$(): Observable<Cuenta[]> {
    return this.cuentasCache$;
  }

  /**
   * Obtiene una cuenta por ID
   */
  obtenerPorId(id: string | number): Cuenta | undefined {
    return this.cuentas$.value.find(c => c.id === id);
  }

  /**
   * Obtiene cuentas por clienteId (desde caché local)
   */
  obtenerPorClienteId(clienteId: string | number): Cuenta[] {
    return this.cuentas$.value.filter(c => c.clienteId === clienteId);
  }

  /**
   * Obtiene cuentas por clienteId desde el servidor
   * GET /api/cuentas/cliente/{clienteId}
   */
  obtenerPorClienteId$(clienteId: string | number): Observable<Cuenta[]> {
    const url = `${this.apiUrl}/cliente/${clienteId}`;
    return this.http.get<Cuenta[]>(url).pipe(
      tap(cuentas => {
        console.log(`✓ Cuentas del cliente ${clienteId} cargadas:`, cuentas);
      }),
      catchError((error) => {
        console.error(`✗ Error cargando cuentas del cliente ${clienteId}:`, error);
        throw error;
      })
    );
  }

  /**
   * Busca cuentas por número de cuenta
   */
  buscarPorNumeroCuenta(numeroCuenta: string): Cuenta[] {
    return this.cuentas$.value.filter(c =>
      c.numeroCuenta.toLowerCase().includes(numeroCuenta.toLowerCase())
    );
  }

  /**
   * Crea una nueva cuenta
   * POST /api/cuentas
   */
  crear(cuenta: Omit<Cuenta, 'id'>): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.apiUrl, cuenta)
      .pipe(
        tap(nuevaCuenta => {
          const cuentasActuales = this.cuentas$.value;
          this.cuentas$.next([...cuentasActuales, nuevaCuenta]);
        }),
        catchError((error) => {
          console.error('Error creando cuenta:', error);
          throw error;
        })
      );
  }

  /**
   * Actualiza una cuenta existente
   * PUT /api/cuentas/{id}
   */
  actualizar(id: string | number, cuenta: Partial<Cuenta>): Observable<Cuenta> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Cuenta>(url, cuenta)
      .pipe(
        tap(cuentaActualizada => {
          const cuentasActuales = this.cuentas$.value;
          const index = cuentasActuales.findIndex(c => c.id === id);
          if (index !== -1) {
            cuentasActuales[index] = cuentaActualizada;
            this.cuentas$.next([...cuentasActuales]);
          }
        }),
        catchError((error) => {
          console.error('Error actualizando cuenta:', error);
          throw error;
        })
      );
  }

  /**
   * Elimina una cuenta por ID
   * DELETE /api/cuentas/{id}
   */
  eliminar(id: string | number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        tap(() => {
          const cuentasActuales = this.cuentas$.value;
          this.cuentas$.next(cuentasActuales.filter(c => c.id !== id));
        }),
        catchError((error) => {
          console.error('Error eliminando cuenta:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene los tipos de cuenta disponibles
   */
  obtenerTiposCuenta(): Array<{ valor: string; etiqueta: string }> {
    return [
      { valor: 'AHORRO', etiqueta: 'Cuenta de Ahorro' },
      { valor: 'CORRIENTE', etiqueta: 'Cuenta Corriente' }
    ];
  }
}
