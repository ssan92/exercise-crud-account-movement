import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ReporteService } from '../../../../core/services/reporte.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * ReporteListComponent: Generador de reportes de estado de cuenta
 * SRP: Orquesta los filtros y muestra el PDF del reporte
 * DI: Inyecta ClienteService y ReporteService
 */
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
  public reporteBase64: string | null = null;
  public errorMensaje: string | null = null;

  // Gestión de suscripciones
  private destroy$ = new Subject<void>();

  /**
   * Constructor con inyección de dependencias
   */
  constructor(
    private clienteService: ClienteService,
    private reporteService: ReporteService
  ) {}

  /**
   * Ciclo de vida: Se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.cargarClientes();
  }

  /**
   * Ciclo de vida: Limpieza de suscripciones
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Liberar URL de objeto si existe
    if (this.reporteUrl) {
      URL.revokeObjectURL(this.reporteUrl);
    }
  }

  /**
   * Carga la lista de clientes disponibles
   */
  private cargarClientes(): void {
    this.clienteService
      .obtenerTodos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          console.log('✅ Clientes cargados:', clientes.length);
        },
        error: (error) => {
          console.error('❌ Error cargando clientes:', error);
          this.errorMensaje = 'Error al cargar los clientes';
        }
      });
  }

  /**
   * Obtiene el nombre del cliente seleccionado
   */
  public obtenerNombreCliente(): string {
    if (!this.clienteSeleccionado) return '';
    const cliente = this.clientes.find(c => c.clienteId === this.clienteSeleccionado);
    return cliente ? cliente.nombre : '';
  }

  /**
   * Genera el reporte de estado de cuenta
   */
  public generarReporte(): void {
    if (!this.clienteSeleccionado) {
      this.errorMensaje = 'Debe seleccionar un cliente';
      return;
    }

    this.cargando = true;
    this.errorMensaje = null;

    console.log('🔄 Generando reporte para cliente:', this.clienteSeleccionado, 'Fecha inicio:', this.fechaInicio || 'sin filtro', 'Fecha fin:', this.fechaFin || 'sin filtro');

    this.reporteService
      .obtenerEstadoCuenta$(this.clienteSeleccionado, this.fechaInicio || undefined, this.fechaFin || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Reporte recibido, tamaño:', response.pdfBase64?.length || 0);
          this.reporteBase64 = response.pdfBase64;

          // Convertir base64 a blob
          const blob = this.reporteService.base64ToBlob(response.pdfBase64);
          this.reporteUrl = this.reporteService.crearUrlSegura(blob);

          this.cargando = false;
          console.log('📄 PDF listo para mostrar');
        },
        error: (error) => {
          console.error('❌ Error obteniendo reporte:', error);
          this.errorMensaje =
            error.error?.message || 'Error al generar el reporte. Intente nuevamente.';
          this.cargando = false;
        }
      });
  }

  /**
   * Descarga el reporte en PDF
   */
  public descargarReporte(): void {
    if (!this.reporteBase64 || !this.clienteSeleccionado) return;

    const blob = this.reporteService.base64ToBlob(this.reporteBase64);
    const nombreCliente = this.obtenerNombreCliente().replace(/\s+/g, '_');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `reporte_${nombreCliente}_${fecha}.pdf`;

    this.reporteService.descargarPDF(blob, nombreArchivo);
    console.log('⬇️ Descargando:', nombreArchivo);
  }

  /**
   * Limpia el reporte mostrado
   */
  public limpiarReporte(): void {
    if (this.reporteUrl) {
      URL.revokeObjectURL(this.reporteUrl);
    }
    this.reporteUrl = null;
    this.reporteBase64 = null;
    this.errorMensaje = null;
  }

  /**
   * Limpia todos los filtros
   */
  public limpiarFiltros(): void {
    this.clienteSeleccionado = null;
    this.fechaInicio = '';
    this.fechaFin = '';
    this.limpiarReporte();
  }
}
