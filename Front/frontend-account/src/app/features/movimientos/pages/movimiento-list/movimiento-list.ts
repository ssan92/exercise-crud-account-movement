import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimiento } from '../../../../core/models/movimiento.model';
import { MovimientoService } from '../../../../core/services/movimiento.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MovimientoFormComponent } from '../movimiento-form/movimiento-form';
import { Cliente } from '../../../../core/models/cliente.model';

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
  public fechaDesde = '';
  public fechaHasta = '';
  public busqueda = '';
  public cargando = false;

  constructor(
    private movimientoService: MovimientoService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private cargarClientes(): void {
    this.clienteService.obtenerTodos$().subscribe({
      next: (clientes) => {
        this.clientes = Array.isArray(clientes) ? [...clientes] : [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        alert('Error al cargar los clientes');
      }
    });
  }

  private cargarMovimientos(): void {
    if (!this.clienteSeleccionado) {
      alert('Por favor, seleccione un cliente');
      return;
    }

    this.cargando = true;
    this.movimientoService.obtenerPorCliente(this.clienteSeleccionado, this.fechaDesde, this.fechaHasta).subscribe({
      next: (movimientos) => {
        const copia = Array.isArray(movimientos) ? [...movimientos] : [];
        this.movimientos = copia;
        this.movimientosFiltrados = [...copia];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando movimientos:', error);
        alert('Error al cargar los movimientos');
        this.cargando = false;
        this.movimientos = [];
        this.movimientosFiltrados = [];
        this.cdr.detectChanges();
      }
    });
  }

  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.movimientosFiltrados = [...this.movimientos];
    } else {
      const numeroLower = this.busqueda.toLowerCase();
      this.movimientosFiltrados = this.movimientos.filter(m =>
        m.numeroCuenta.toLowerCase().includes(numeroLower)
      );
    }
  }

  public aplicarFiltros(): void {
    this.cargarMovimientos();
  }

  public limpiarFiltros(): void {
    this.clienteSeleccionado = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.busqueda = '';
    this.movimientos = [];
    this.movimientosFiltrados = [];
  }

  public abrirNuevo(): void {
    this.verFormulario = true;
  }

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

  public guardar(movimiento: Movimiento): void {
    this.cancelar();
    // Recarga los movimientos si aún hay un cliente seleccionado
    if (this.clienteSeleccionado) {
      this.cargarMovimientos();
    }
  }

  public cancelar(): void {
    this.verFormulario = false;
  }

  public trackByMovimiento(index: number, movimiento: Movimiento): string | number {
    return movimiento.id || index;
  }

  public obtenerNombreCliente(clienteId: string | number | undefined): string {
    if (!clienteId) return 'N/A';
    const cliente = this.clientes.find(c => c.clienteId === clienteId);
    return cliente ? cliente.nombre : 'N/A';
  }

  public formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    try {
      const d = new Date(fecha);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return fecha;
    }
  }

  public formatearValor(valor: number | undefined): string {
    if (!valor) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(valor);
  }
}
