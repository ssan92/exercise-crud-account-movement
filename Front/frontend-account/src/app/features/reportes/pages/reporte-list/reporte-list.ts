import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ReporteService } from '../../../../core/services/reporte.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reporte-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-list.html',
  styleUrl: './reporte-list.css'
})
export class ReporteListComponent implements OnInit, OnDestroy {
  // Propiedades públicas
  public clientes: Cliente[] = [];
  public clienteSeleccionado: number | null = null;
  public fechaInicio: string = '';
  public fechaFin: string = '';
  public cargando = false;
  public reporteUrl: string | null = null;
  // URL saneada para el iframe
  public reporteUrlSafe: SafeResourceUrl | null = null;
  public reporteBase64: string | null = null;
  public errorMensaje: string | null = null;

  // Gestión de suscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private clienteService: ClienteService,
    private reporteService: ReporteService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Liberar URL de objeto si existe
    if (this.reporteUrl) {
      URL.revokeObjectURL(this.reporteUrl);
    }
  }

  private cargarClientes(): void {
    this.clienteService
      .obtenerTodos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes = Array.isArray(clientes) ? [...clientes] : [];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando clientes:', error);
          this.errorMensaje = 'Error al cargar los clientes';
        }
      });
  }

  public obtenerNombreCliente(): string {
    if (!this.clienteSeleccionado) return '';
    const cliente = this.clientes.find(c => c.clienteId === this.clienteSeleccionado);
    return cliente ? cliente.nombre : '';
  }

  public generarReporte(): void {
    if (!this.clienteSeleccionado) {
      this.errorMensaje = 'Debe seleccionar un cliente';
      return;
    }

    this.cargando = true;
    this.errorMensaje = null;

    this.reporteService
      .obtenerEstadoCuenta$(this.clienteSeleccionado, this.fechaInicio || undefined, this.fechaFin || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.reporteBase64 = response.pdfBase64;
          const blob = this.reporteService.base64ToBlob(response.pdfBase64);
          const urlString = URL.createObjectURL(blob);
          this.cargando = false;
          setTimeout(() => {
            if (this.reporteUrl) {
              URL.revokeObjectURL(this.reporteUrl);
            }
            this.reporteUrl = urlString;
            this.reporteUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlString);
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          console.error('Error obteniendo reporte:', error);
          this.errorMensaje =
            error.error?.message || 'Error al generar el reporte. Intente nuevamente.';
          this.cargando = false;
        }
      });
  }

  public descargarReporte(): void {
    if (!this.reporteBase64 || !this.clienteSeleccionado) return;

    const blob = this.reporteService.base64ToBlob(this.reporteBase64);
    const nombreCliente = this.obtenerNombreCliente().replace(/\s+/g, '_');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `reporte_${nombreCliente}_${fecha}.pdf`;

    this.reporteService.descargarPDF(blob, nombreArchivo);
  }

  public limpiarReporte(): void {
    if (this.reporteUrl) {
      URL.revokeObjectURL(this.reporteUrl);
    }
    this.reporteUrl = null;
    this.reporteUrlSafe = null;
    this.reporteBase64 = null;
    this.errorMensaje = null;
  }

  public limpiarFiltros(): void {
    this.clienteSeleccionado = null;
    this.fechaInicio = '';
    this.fechaFin = '';
    this.limpiarReporte();
  }
}
