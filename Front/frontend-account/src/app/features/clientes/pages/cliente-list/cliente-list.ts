import { Component, OnInit } from '@angular/core';
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

  /**
   * Constructor con inyección de dependencias (DI)
   * Sigue el principio SOLID de inversión de dependencias
   */
  constructor(private clienteService: ClienteService) {}

  /**
   * Ciclo de vida: Se ejecuta al iniciar el componente
   * Carga los datos del servicio
   */
  ngOnInit(): void {
    this.cargarClientes();
  }

  /**
   * Carga todos los clientes desde el servicio
   */
  private cargarClientes(): void {
    this.clienteService.obtenerTodos$().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = [...this.clientes];
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        alert('Error al cargar los clientes');
      }
    });
  }

  /**
   * Ejecuta la búsqueda de clientes por nombre
   */
  public buscar(): void {
    if (this.busqueda.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clienteService.buscarPorNombre(this.busqueda);
    }
  }

  /**
   * Abre el formulario para crear un nuevo cliente
   */
  public abrirNuevo(): void {
    this.clienteSeleccionado = null;
    this.verFormulario = true;
  }

  /**
   * Abre el formulario para editar un cliente existente
   */
  public onEdit(cliente: Cliente): void {
    // Clone para evitar mutaciones accidentales (Clean Code)
    this.clienteSeleccionado = { ...cliente };
    this.verFormulario = true;
  }

  /**
   * Elimina un cliente con confirmación
   */
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

  /**
   * Guarda (crear o actualizar) un cliente
   */
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

  /**
   * Cancela la edición y vuelve a la lista
   */
  public cancelar(): void {
    this.verFormulario = false;
    this.clienteSeleccionado = null;
  }

  /**
   * TrackBy para optimizar el renderizado de listas (perfomance)
   * Solo redibuja items necesarios cuando cambian
   */
  public trackByCliente(index: number, cliente: Cliente): string {
    return cliente.identificacion;
  }
}