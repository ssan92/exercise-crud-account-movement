import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, finalize, shareReplay } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';

/**
 * ClienteService: Responsable de la gestión de datos de clientes
 * Principio SRP (Single Responsibility Principle): Solo maneja lógica de clientes
 * Principio DI (Dependency Injection): Se inyecta en componentes que lo necesiten
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';
  private clientes$ = new BehaviorSubject<Cliente[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private clientesCache$: Observable<Cliente[]>;

  constructor(private http: HttpClient) {
    this.clientesCache$ = this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap(clientes => {
        console.log('✓ Clientes cargados:', clientes);
        this.clientes$.next(clientes);
      }),
      catchError((error) => {
        console.error('✗ Error cargando clientes:', error);
        this.clientes$.next([]);
        throw error;
      }),
      shareReplay(1)
    );
    // Iniciar la carga
    this.clientesCache$.subscribe();
  }

  /**
   * Obtiene todos los clientes
   */
  obtenerTodos(): Cliente[] {
    return this.clientes$.value;
  }

  /**
   * Observable de todos los clientes
   * Usa shareReplay para asegurar que todos los suscriptores obtengan el mismo resultado
   */
  obtenerTodos$(): Observable<Cliente[]> {
    return this.clientesCache$;
  }

  /**
   * Obtiene un cliente por ID
   */
  obtenerPorId(clienteId: string | number): Cliente | undefined {
    return this.clientes$.value.find(c => c.clienteId === clienteId);
  }

  /**
   * Busca clientes por nombre (búsqueda parcial)
   */
  buscarPorNombre(nombre: string): Cliente[] {
    const nombreLower = nombre.toLowerCase();
    return this.clientes$.value.filter(c =>
      c.nombre.toLowerCase().includes(nombreLower)
    );
  }

  /**
   * Crea un nuevo cliente en el servidor
   */
  crear(cliente: Omit<Cliente, 'clienteid'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente)
      .pipe(
        tap(nuevoCliente => {
          const clientesActuales = this.clientes$.value;
          this.clientes$.next([...clientesActuales, nuevoCliente]);
        }),
        catchError((error) => {
          console.error('Error creando cliente:', error);
          throw error;
        })
      );
  }

  /**
   * Actualiza un cliente existente en el servidor
   */
  actualizar(clienteId: string | number, cliente: Partial<Cliente>): Observable<Cliente> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.put<Cliente>(url, cliente)
      .pipe(
        tap(clienteActualizado => {
          const clientesActuales = this.clientes$.value;
          const index = clientesActuales.findIndex(c => c.clienteId === clienteId);
          if (index !== -1) {
            clientesActuales[index] = clienteActualizado;
            this.clientes$.next([...clientesActuales]);
          }
        }),
        catchError((error) => {
          console.error('Error actualizando cliente:', error);
          throw error;
        })
      );
  }

  /**
   * Elimina un cliente del servidor
   */
  eliminar(clienteId: string | number): Observable<any> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.delete(url)
      .pipe(
        tap(() => {
          const clientesActuales = this.clientes$.value;
          this.clientes$.next(clientesActuales.filter(c => c.clienteId !== clienteId));
        }),
        catchError((error) => {
          console.error('Error eliminando cliente:', error);
          throw error;
        })
      );
  }
}
