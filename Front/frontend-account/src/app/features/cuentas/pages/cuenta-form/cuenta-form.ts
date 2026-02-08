import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cuenta } from '../../../../core/models/cuenta.model';
import { Cliente } from '../../../../core/models/cliente.model';

/**
 * CuentaFormComponent: Formulario para crear/editar cuentas
 * SRP: Solo se encarga de la presentación del formulario
 * Input/Output: Comunica con el componente padre (CuentaListComponent)
 */
@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta-form.html',
  styleUrl: './cuenta-form.css'
})
export class CuentaFormComponent implements OnChanges {
  // Propiedades de entrada
  @Input() cuentaParaEditar: Cuenta | null = null;
  @Input() tiposCuenta: Array<{ valor: string; etiqueta: string }> = [];
  @Input() clientes: Cliente[] = [];

  // Propiedades de salida (eventos)
  @Output() onSave = new EventEmitter<Cuenta>();
  @Output() onCancel = new EventEmitter<void>();

  // Propiedades locales
  public cuentaForm: FormGroup;
  private readonly SALDO_MINIMO = 0;

  /**
   * Constructor con inyección del FormBuilder
   */
  constructor(private fb: FormBuilder) {
    this.cuentaForm = this.crearFormulario();
  }

  /**
   * Crea la estructura del formulario con validaciones
   */
  private crearFormulario(): FormGroup {
    return this.fb.group({
      id: [null],
      numeroCuenta: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      tipoCuenta: ['AHORRO', Validators.required],
      saldoInicial: [0, [
        Validators.required,
        Validators.min(this.SALDO_MINIMO)
      ]],
      clienteId: ['', Validators.required],
      saldo: [0],
      estado: [true],
      fechaCreacion: [''],
      fechaActualizacion: ['']
    });
  }

  /**
   * Hook de ciclo de vida: Se dispara cuando el @Input cambia
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cuentaParaEditar'] && this.cuentaParaEditar) {
      this.cargarCuentaEnFormulario(this.cuentaParaEditar);
    }
  }

  /**
   * Carga los datos de la cuenta en el formulario (para ediciones)
   */
  private cargarCuentaEnFormulario(cuenta: Cuenta): void {
    this.cuentaForm.patchValue(cuenta);
  }

  /**
   * Obtiene el control del formulario de un campo específico
   */
  public obtenerControl(nombreControl: string) {
    return this.cuentaForm.get(nombreControl);
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
   */
  public submit(): void {
    if (this.cuentaForm.valid) {
      // Asegurar que saldo = saldoInicial si está creando
      const datosFormulario = this.cuentaForm.value;
      if (!datosFormulario.id) {
        datosFormulario.saldo = datosFormulario.saldoInicial;
      }

      this.onSave.emit(datosFormulario);
      this.resetearFormulario();
    } else {
      this.cuentaForm.markAllAsTouched();
    }
  }

  /**
   * Cancela la operación
   */
  public cancel(): void {
    this.onCancel.emit();
    this.resetearFormulario();
  }

  /**
   * Reinicia el formulario a su estado inicial
   */
  private resetearFormulario(): void {
    this.cuentaForm.reset({
      tipoCuenta: 'AHORRO',
      estado: true
    });
  }

  /**
   * Determina el texto del botón
   */
  public obtenerTextoBoton(): string {
    return this.cuentaParaEditar ? 'Actualizar Cuenta' : 'Crear Cuenta';
  }
}
