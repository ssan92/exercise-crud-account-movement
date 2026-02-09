import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../../core/models/cliente.model';

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

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.crearFormulario();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      clienteId: [null], // Campo oculto para ediciones
      nombre: ['', [
        Validators.required,
        Validators.minLength(this.NOMBRE_MINIMO)
      ]],
      genero: ['MASCULINO', Validators.required],
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteParaEditar'] && this.clienteParaEditar) {
      this.cargarClienteEnFormulario(this.clienteParaEditar);
    }
  }

  private cargarClienteEnFormulario(cliente: Cliente): void {
    const valor = {
      ...cliente,
      genero: this.normalizarGenero(cliente.genero)
    };
    this.clienteForm.patchValue(valor);
  }

  private normalizarGenero(genero: Cliente['genero']): 'MASCULINO' | 'FEMENINO' | 'OTRO' {
    const g = String(genero ?? '').toUpperCase();
    if (g === 'FEMENINO' || g === 'OTRO') return g;
    return 'MASCULINO';
  }

  public obtenerControl(nombreControl: string) {
    return this.clienteForm.get(nombreControl);
  }

  public tieneError(nombreControl: string, tipoError: string): boolean {
    const control = this.obtenerControl(nombreControl);
    return control ? control.hasError(tipoError) && control.touched : false;
  }

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

  public cancel(): void {
    this.onCancel.emit();
    this.resetearFormulario();
  }

  private resetearFormulario(): void {
    this.clienteForm.reset({
      genero: 'MASCULINO',
      estado: true
    });
  }

  public obtenerTextoBoton(): string {
    return this.clienteParaEditar ? 'Actualizar Cliente' : 'Guardar Cliente';
  }
}