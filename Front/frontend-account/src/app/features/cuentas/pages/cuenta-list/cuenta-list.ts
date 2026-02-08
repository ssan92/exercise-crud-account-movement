import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cuenta } from '../../../../core/models/cuenta.model';
import { CuentaService } from '../../../../core/services/cuenta.service';
import { CuentaFormComponent } from '../cuenta-form/cuenta-form';

/**
 * CuentaListComponent: Listado de cuentas bancarias
 * SRP: Orquesta la lista, búsqueda y operaciones CRUD
 * DI: Inyecta CuentaService
 */
@Component({
  selector: 'app-cuenta-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CuentaFormComponent],
  templateUrl: './cuenta-list.html',
  styleUrl: './cuenta-list.css'
})
export class CuentaListComponent implements OnInit {
  // Propiedades públicas
  public cuentas: Cuenta[] = [];
  public cuentasFiltradas: Cuenta[] = [];
  public verFormulario = false;
  public cuentaSeleccionada: Cuenta | null = null;
  public busqueda = '';

  // Tipos de cuenta para filtrado
  public tiposCuenta: Array<{ valor: string; etiqueta: string }> = [];

  /**
   * Constructor con inyección de dependencias
   */
  constructor(private cuentaService: CuentaService) {}

  /**
   * Ciclo de vida: Se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.cargarCuentas();
    this.tiposCuenta = this.cuentaService.obtenerTiposCuenta();
  }

  /**
   * Carga todas las cuentas desde el servicio
   */
  private cargarCuentas(): void {
    this.cuentaService.obtenerTodas$().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.cuentasFiltradas = [...this.cuentas];
      },
      error: (error) => {
        console.error('Error cargando cuentas:', error);
        alert('Error al cargar las cuentas');
      }
    });
  }

  /**
   * Ejecuta la búsqueda de cuentas por número
   */
  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.cuentasFiltradas = [...this.cuentas];
    } else {
      this.cuentasFiltradas = this.cuentaService.buscarPorNumeroCuenta(this.busqueda);
    }
  }

  /**
   * Abre el formulario para crear una nueva cuenta
   */
  public abrirNueva(): void {
    this.cuentaSeleccionada = null;
    this.verFormulario = true;
  }

  /**
   * Abre el formulario para editar una cuenta existente
   */
  public onEdit(cuenta: Cuenta): void {
    // Clone para evitar mutaciones accidentales
    this.cuentaSeleccionada = { ...cuenta };
    this.verFormulario = true;
  }

  /**
   * Elimina una cuenta con confirmación
   */
  public onDelete(cuentaId: string | number | undefined): void {
    if (!cuentaId) return;

    if (confirm('¿Está seguro de eliminar esta cuenta?')) {
      this.cuentaService.eliminar(cuentaId).subscribe({
        next: () => {
          this.cargarCuentas();
          this.buscar();
        },
        error: (error) => {
          console.error('Error eliminando cuenta:', error);
          alert('Error al eliminar la cuenta');
        }
      });
    }
  }

  /**
   * Guarda (crear o actualizar) una cuenta
   */
  public guardar(cuentaData: Cuenta): void {
    if (this.cuentaSeleccionada?.id) {
      // Actualizar cuenta existente
      const id = this.cuentaSeleccionada.id;
      this.cuentaService.actualizar(id, cuentaData).subscribe({
        next: () => {
          this.cargarCuentas();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error actualizando cuenta:', error);
          alert('Error al actualizar la cuenta');
        }
      });
    } else {
      // Crear nueva cuenta
      const { id, ...datosNuevo } = cuentaData;
      this.cuentaService.crear(datosNuevo).subscribe({
        next: () => {
          this.cargarCuentas();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error creando cuenta:', error);
          alert('Error al crear la cuenta');
        }
      });
    }
  }

  /**
   * Cancela la edición y vuelve a la lista
   */
  public cancelar(): void {
    this.verFormulario = false;
    this.cuentaSeleccionada = null;
  }

  /**
   * TrackBy para optimizar el renderizado
   */
  public trackByCuenta(index: number, cuenta: Cuenta): string | number {
    return cuenta.id || index;
  }

  /**
   * Obtiene la etiqueta del tipo de cuenta
   */
  public obtenerEtiquetaTipo(tipo: string): string {
    const encontrado = this.tiposCuenta.find(t => t.valor === tipo);
    return encontrado ? encontrado.etiqueta : tipo;
  }

  /**
   * Formatea el saldo para mostrar
   */
  public formatearSaldo(saldo: number | undefined): string {
    if (!saldo) return '$ 0.00';
    return `$ ${saldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
