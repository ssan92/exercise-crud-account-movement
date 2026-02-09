import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cuenta } from '../../../../core/models/cuenta.model';
import { Cliente } from '../../../../core/models/cliente.model';
import { CuentaService } from '../../../../core/services/cuenta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { CuentaFormComponent } from '../cuenta-form/cuenta-form';

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

  // Clientes para el selector del formulario
  public clientes: Cliente[] = [];

  constructor(
    private cuentaService: CuentaService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tiposCuenta = this.cuentaService.obtenerTiposCuenta();
    this.cargarClientes();
  }

  private cargarCuentas(): void {
    this.cuentaService.obtenerTodas$().subscribe({
      next: (cuentas) => {
        const copia = Array.isArray(cuentas) ? [...cuentas] : [];
        this.cuentas = copia;
        this.cuentasFiltradas = [...copia];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando cuentas:', error);
        alert('Error al cargar las cuentas');
      }
    });
  }

  private cargarClientes(): void {
    this.clienteService.obtenerTodos().subscribe({
      next: (clientes) => {
        this.clientes = Array.isArray(clientes) ? [...clientes] : [];
        this.cdr.detectChanges();
        this.cargarCuentas();
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.cargarCuentas();
      }
    });
  }

  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.cuentasFiltradas = [...this.cuentas];
    } else {
      this.cuentaService.buscarPorNumeroCuenta(this.busqueda).subscribe({
        next: (list) => (this.cuentasFiltradas = list),
        error: (err) => {
          console.error('Error buscando cuentas:', err);
          this.cuentasFiltradas = [];
        }
      });
    }
  }

  public abrirNueva(): void {
    this.cuentaSeleccionada = null;
    this.verFormulario = true;
  }

  public onEdit(cuenta: Cuenta): void {
    // Clone para evitar mutaciones accidentales
    this.cuentaSeleccionada = { ...cuenta };
    this.verFormulario = true;
  }

  public onDelete(numeroCuenta: string | undefined): void {
    if (!numeroCuenta) return;

    if (confirm('¿Está seguro de eliminar esta cuenta?')) {
      this.cuentaService.eliminar(numeroCuenta).subscribe({
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

  public guardar(cuentaData: Cuenta): void {
    if (this.cuentaSeleccionada?.numeroCuenta) {
      this.cuentaService.actualizar(this.cuentaSeleccionada.numeroCuenta, cuentaData).subscribe({
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
      this.cuentaService.crear(cuentaData).subscribe({
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

  public cancelar(): void {
    this.verFormulario = false;
    this.cuentaSeleccionada = null;
  }

  public trackByCuenta(index: number, cuenta: Cuenta): string {
    return cuenta.numeroCuenta;
  }

  public obtenerNombreCliente(clienteId: string | number | undefined): string {
    if (clienteId == null || clienteId === '') return 'N/A';
    const cliente = this.clientes.find(c => c.clienteId === clienteId || String(c.clienteId) === String(clienteId));
    return cliente ? cliente.nombre : String(clienteId);
  }

  public obtenerEtiquetaTipo(tipo: string): string {
    const encontrado = this.tiposCuenta.find(t => t.valor === tipo);
    return encontrado ? encontrado.etiqueta : tipo;
  }

  public formatearSaldo(saldo: number | undefined): string {
    if (!saldo) return '$ 0.00';
    return `$ ${saldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
