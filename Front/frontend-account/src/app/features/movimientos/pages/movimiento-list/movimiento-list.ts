import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimiento } from '../../../../core/models/movimiento.model';
import { MovimientoService } from '../../../../core/services/movimiento.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MovimientoFormComponent } from '../movimiento-form/movimiento-form';
import { Cliente } from '../../../../core/models/cliente.model';

/**
 * MovimientoListComponent: Listado de movimientos bancarios
 * SRP: Orquesta la lista, búsqueda y operaciones CRUD
 * DI: Inyecta MovimientoService
 */
@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovimientoFormComponent],
  templateUrl: './movimiento-list.html',
  styleUrl: './movimiento-list.css'
})
export class MovimientoListComponent implements OnInit {
  // Propiedades públicas
  public movimientos: Movimiento[] = [];
  public movimientosFiltrados: Movimiento[] = [];
  public verFormulario = false;
  public clientes: Cliente[] = [];
  public clienteSeleccionado: string | number = '';
  public fechaInicio = '';
  public busqueda = '';
  public cargando = false;

  /**
   * Constructor con inyección de dependencias
   */
  constructor(
    private movimientoService: MovimientoService,
    private clienteService: ClienteService
  ) {}

  /**
   * Ciclo de vida: Se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.cargarClientes();
  }

  /**
   * Carga la lista de clientes para el selector
   */
  private cargarClientes(): void {
    this.clienteService.obtenerTodos$().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        alert('Error al cargar los clientes');
      }
    });
  }

  /**
   * Carga los movimientos de un cliente específico
   */
  private cargarMovimientos(): void {
    if (!this.clienteSeleccionado) {
      alert('Por favor, seleccione un cliente');
      return;
    }

    this.cargando = true;
    this.movimientoService.obtenerPorCliente(this.clienteSeleccionado, this.fechaInicio).subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos;
        this.movimientosFiltrados = [...this.movimientos];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando movimientos:', error);
        alert('Error al cargar los movimientos');
        this.cargando = false;
        this.movimientos = [];
        this.movimientosFiltrados = [];
      }
    });
  }

  /**
   * Ejecuta la búsqueda de movimientos por número de cuenta
   */
  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.movimientosFiltrados = [...this.movimientos];
    } else {
      this.movimientosFiltrados = this.movimientoService.buscarPorNumeroCuenta(this.busqueda);
    }
  }

  /**
   * Aplica filtros (cliente y fecha)
   */
  public aplicarFiltros(): void {
    this.cargarMovimientos();
  }

  /**
   * Limpia los filtros
   */
  public limpiarFiltros(): void {
    this.clienteSeleccionado = '';
    this.fechaInicio = '';
    this.busqueda = '';
    this.movimientos = [];
    this.movimientosFiltrados = [];
  }

  /**
   * Abre el formulario para crear un nuevo movimiento
   */
  public abrirNuevo(): void {
    this.verFormulario = true;
  }

  /**
   * Elimina un movimiento con confirmación
   */
  public onDelete(movimientoId: string | number | undefined): void {
    if (!movimientoId) return;

    if (confirm('¿Está seguro de eliminar este movimiento? Esta acción no se puede deshacer.')) {
      this.movimientoService.eliminar(movimientoId).subscribe({
        next: () => {
          this.cargarMovimientos(); // Recarga la lista
          alert('Movimiento eliminado correctamente');
        },
        error: (error) => {
          console.error('Error eliminando movimiento:', error);
          alert('Error al eliminar el movimiento');
        }
      });
    }
  }

  /**
   * Maneja el evento cuando se guarda un movimiento
   */
  public guardar(movimiento: Movimiento): void {
    console.log('✓ Movimiento guardado:', movimiento);
    this.cancelar();
    // Recarga los movimientos si aún hay un cliente seleccionado
    if (this.clienteSeleccionado) {
      this.cargarMovimientos();
    }
  }

  /**
   * Cancela la edición y vuelve a la lista
   */
  public cancelar(): void {
    this.verFormulario = false;
  }

  /**
   * TrackBy para optimizar el renderizado de listas
   */
  public trackByMovimiento(index: number, movimiento: Movimiento): string | number {
    return movimiento.id || index;
  }

  /**
   * Obtiene el nombre del cliente a partir del ID
   */
  public obtenerNombreCliente(clienteId: string | number | undefined): string {
    if (!clienteId) return 'N/A';
    const cliente = this.clientes.find(c => c.clienteId === clienteId);
    return cliente ? cliente.nombre : 'N/A';
  }

  /**
   * Formatea la fecha para mostrar
   */
  public formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
      return fecha;
    }
  }

  /**
   * Formatea el valor monetario
   */
  public formatearValor(valor: number | undefined): string {
    if (!valor) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(valor);
  }
}
