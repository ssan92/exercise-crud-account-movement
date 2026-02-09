import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cuenta } from '../../../../core/models/cuenta.model';
import { Cliente } from '../../../../core/models/cliente.model';

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

  constructor(private fb: FormBuilder) {
    this.cuentaForm = this.crearFormulario();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
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
      estado: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cuentaParaEditar'] && this.cuentaParaEditar) {
      this.cargarCuentaEnFormulario(this.cuentaParaEditar);
    }
  }

  private cargarCuentaEnFormulario(cuenta: Cuenta): void {
    const valor = {
      ...cuenta,
      tipoCuenta: this.normalizarTipoCuenta(cuenta.tipoCuenta)
    };
    this.cuentaForm.patchValue(valor);
    this.cuentaForm.get('numeroCuenta')?.disable();
    this.cuentaForm.get('clienteId')?.disable();
  }

  private normalizarTipoCuenta(tipo: Cuenta['tipoCuenta']): 'AHORRO' | 'CORRIENTE' | 'DEPOSITO' {
    const t = String(tipo ?? '').toUpperCase();
    if (t === 'CORRIENTE' || t === 'DEPOSITO') return t;
    return 'AHORRO';
  }

  public obtenerControl(nombreControl: string) {
    return this.cuentaForm.get(nombreControl);
  }

  public tieneError(nombreControl: string, tipoError: string): boolean {
    const control = this.obtenerControl(nombreControl);
    return control ? control.hasError(tipoError) && control.touched : false;
  }

  public submit(): void {
    if (this.cuentaForm.valid) {
      const datosFormulario = this.cuentaParaEditar
        ? (this.cuentaForm.getRawValue() as Cuenta)
        : (this.cuentaForm.value as Cuenta);
      this.onSave.emit(datosFormulario);
      this.resetearFormulario();
    } else {
      this.cuentaForm.markAllAsTouched();
    }
  }

  public cancel(): void {
    this.onCancel.emit();
    this.resetearFormulario();
  }

  private resetearFormulario(): void {
    this.cuentaForm.get('numeroCuenta')?.enable();
    this.cuentaForm.get('clienteId')?.enable();
    this.cuentaForm.reset({
      tipoCuenta: 'AHORRO',
      estado: true
    });
  }

  public obtenerTextoBoton(): string {
    return this.cuentaParaEditar ? 'Actualizar Cuenta' : 'Crear Cuenta';
  }
}
