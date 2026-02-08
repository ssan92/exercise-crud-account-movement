import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../../core/models/cliente.model';

/**
 * ClienteFormComponent: Responsable de la presentación e interacción del formulario de clientes
 * - Separación de responsabilidad: Solo maneja la UI del formulario
 * - Input/Output: Comunica con el padre (ClienteListComponent)
 * - Reactive Forms: Gestión robusta de validaciones
 */
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteFormComponent implements OnChanges {
  // Propiedades de entrada
  @Input() clienteParaEditar: Cliente | null = null;

  // Propiedades de salida (eventos)
  @Output() onSave = new EventEmitter<Cliente>();
  @Output() onCancel = new EventEmitter<void>();

  // Propiedades locales
  public clienteForm: FormGroup;
  private readonly EDAD_MINIMA = 18;
  private readonly NOMBRE_MINIMO = 3;

  /**
   * Constructor con inyección del FormBuilder
   */
  constructor(private fb: FormBuilder) {
    this.clienteForm = this.crearFormulario();
  }

  /**
   * Crea la estructura del formulario con validaciones
   * Principio: Centralizar la configuración del formulario
   */
  private crearFormulario(): FormGroup {
    return this.fb.group({
      clienteId: [null], // Campo oculto para ediciones
      nombre: ['', [
        Validators.required,
        Validators.minLength(this.NOMBRE_MINIMO)
      ]],
      genero: ['Masculino', Validators.required],
      edad: [0, [
        Validators.required,
        Validators.min(this.EDAD_MINIMA)
      ]],
      identificacion: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      contrasena: ['', Validators.required],
      estado: [true]
    });
  }

  /**
   * Hook de ciclo de vida: Se dispara cuando el @Input cambia
   * Carga los datos en el formulario cuando viene una edición
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteParaEditar'] && this.clienteParaEditar) {
      this.cargarClienteEnFormulario(this.clienteParaEditar);
    }
  }

  /**
   * Carga los datos del cliente en el formulario (para ediciones)
   */
  private cargarClienteEnFormulario(cliente: Cliente): void {
    this.clienteForm.patchValue(cliente);
  }

  /**
   * Obtiene el control del formulario de un campo específico
   * Útil para validaciones en la plantilla
   */
  public obtenerControl(nombreControl: string) {
    return this.clienteForm.get(nombreControl);
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  public tieneError(nombreControl: string, tipoError: string): boolean {
    const control = this.obtenerControl(nombreControl);
    return control ? control.hasError(tipoError) && control.touched : false;
  }

  /**
   * Envía el formulario (crear o actualizar)
   * Solo se ejecuta si el formulario es válido
   */
  public submit(): void {
    if (this.clienteForm.valid) {
      // Emitimos el objeto completo al componente padre
      this.onSave.emit(this.clienteForm.value);
      this.resetearFormulario();
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.clienteForm.markAllAsTouched();
    }
  }

  /**
   * Cancela la operación y vuelve a la lista
   */
  public cancel(): void {
    this.onCancel.emit();
    this.resetearFormulario();
  }

  /**
   * Reinicia el formulario a su estado inicial
   */
  private resetearFormulario(): void {
    this.clienteForm.reset({
      genero: 'Masculino',
      estado: true
    });
  }

  /**
   * Determina el texto del botón según si es creación o edición
   */
  public obtenerTextoBoton(): string {
    return this.clienteParaEditar ? 'Actualizar Cliente' : 'Guardar Cliente';
  }
}