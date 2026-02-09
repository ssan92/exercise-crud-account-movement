import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ClienteFormComponent } from '../cliente-form/cliente-form';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteFormComponent],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteListComponent implements OnInit {
  // Propiedades públicas
  public clientes: Cliente[] = [];
  public clientesFiltrados: Cliente[] = [];
  public verFormulario = false;
  public clienteSeleccionado: Cliente | null = null;
  public busqueda = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private cargarClientes(): void {
    this.clienteService.obtenerTodos().subscribe({
      next: (clientes) => {
        const copia = Array.isArray(clientes) ? [...clientes] : [];
        this.clientes = copia;
        this.clientesFiltrados = [...copia];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        alert('Error al cargar los clientes');
      }
    });
  }

  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clienteService.buscarPorNombre(this.busqueda).subscribe({
        next: (list) => (this.clientesFiltrados = list),
        error: (err) => {
          console.error('Error buscando clientes:', err);
          this.clientesFiltrados = [];
        }
      });
    }
  }

  public abrirNuevo(): void {
    this.clienteSeleccionado = null;
    this.verFormulario = true;
  }

  public onEdit(cliente: Cliente): void {
    // Clone para evitar mutaciones accidentales (Clean Code)
    this.clienteSeleccionado = { ...cliente };
    this.verFormulario = true;
  }

  public onDelete(clienteId: string | number | undefined): void {
    if (!clienteId) return;

    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.clienteService.eliminar(clienteId).subscribe({
        next: () => {
          this.cargarClientes();
          this.buscar(); // Actualiza la búsqueda si estaba activa
        },
        error: (error) => {
          console.error('Error eliminando cliente:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  public guardar(clienteData: Cliente): void {
    if (this.clienteSeleccionado) {
      // Actualizar cliente existente
      this.clienteService.actualizar(clienteData.clienteId!, clienteData).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error actualizando cliente:', error);
          alert('Error al actualizar el cliente');
        }
      });
    } else {
      // Crear nuevo cliente (NO incluir clienteId, lo genera el backend)
      const { clienteId, ...datosNuevo } = clienteData;
      this.clienteService.crear(datosNuevo).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelar();
        },
        error: (error) => {
          console.error('Error creando cliente:', error);
          alert('Error al crear el cliente');
        }
      });
    }
  }

  public cancelar(): void {
    this.verFormulario = false;
    this.clienteSeleccionado = null;
  }


}