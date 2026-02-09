import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap(clientes => console.log('Clientes cargados:', clientes?.length ?? 0)),
      catchError((error) => {
        console.error('Error cargando clientes:', error);
        throw error;
      })
    );
  }

  obtenerTodos$(): Observable<Cliente[]> {
    return this.obtenerTodos();
  }

  obtenerPorId(clienteId: string | number): Observable<Cliente> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.get<Cliente>(url).pipe(
      catchError((error) => {
        console.error('Error obteniendo cliente:', error);
        throw error;
      })
    );
  }

  buscarPorNombre(nombre: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      map(clientes => {
        const nombreLower = nombre.toLowerCase();
        return clientes.filter(c =>
          c.nombre.toLowerCase().includes(nombreLower)
        );
      }),
      catchError((error) => {
        console.error('Error buscando clientes:', error);
        throw error;
      })
    );
  }

  crear(cliente: Omit<Cliente, 'clienteid'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      catchError((error) => {
        console.error('Error creando cliente:', error);
        throw error;
      })
    );
  }

  actualizar(clienteId: string | number, cliente: Partial<Cliente>): Observable<Cliente> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.put<Cliente>(url, cliente).pipe(
      catchError((error) => {
        console.error('Error actualizando cliente:', error);
        throw error;
      })
    );
  }

  eliminar(clienteId: string | number): Observable<void> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error eliminando cliente:', error);
        throw error;
      })
    );
  }
}
