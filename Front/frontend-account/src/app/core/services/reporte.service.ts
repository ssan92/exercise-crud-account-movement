import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reporte } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:8080/api/reportes';
  private reporteSubject = new BehaviorSubject<Reporte | null>(null);
  public reporte$ = this.reporteSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerEstadoCuenta$(clienteId: number, fechaInicio?: string, fechaFin?: string): Observable<any> {
    let url = `${this.apiUrl}/estado-cuenta?formato=pdf&clienteId=${clienteId}`;
    
    if (fechaInicio) {
      url += `&fechaInicio=${fechaInicio}`;
    }
    
    if (fechaFin) {
      url += `&fechaFin=${fechaFin}`;
    }

    return this.http.get<any>(url, { responseType: 'json' }).pipe(
      tap((response) => {
        console.log('Reporte obtenido, tamaño base64:', response.pdfBase64?.length || 0);
        this.reporteSubject.next(response);
      }),
      catchError((error) => {
        console.error('Error obteniendo reporte:', error);
        throw error;
      })
    );
  }

  base64ToBlob(base64: string): Blob {
    // Si el base64 tiene el prefijo data:, removerlo
    let binaryString = base64;
    if (base64.includes(',')) {
      binaryString = base64.split(',')[1];
    }

    const byteCharacters = atob(binaryString);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  crearUrlSegura(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  descargarPDF(blob: Blob, nombre: string = 'reporte.pdf'): void {
    const url = this.crearUrlSegura(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }
}
