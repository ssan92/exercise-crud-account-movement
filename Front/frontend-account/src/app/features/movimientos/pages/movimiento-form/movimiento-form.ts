import { Component, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movimiento } from '../../../../core/models/movimiento.model';
import { Cliente } from '../../../../core/models/cliente.model';
import { Cuenta } from '../../../../core/models/cuenta.model';
import { MovimientoService } from '../../../../core/services/movimiento.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { CuentaService } from '../../../../core/services/cuenta.service';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimiento-form.html',
  styleUrl: './movimiento-form.css'
})
export class MovimientoFormComponent implements OnInit, OnDestroy {
  // Propiedades de salida (eventos)
  @Output() onSave = new EventEmitter<Movimiento>();
  @Output() onCancel = new EventEmitter<void>();

  // Propiedades locales
  public movimientoForm: FormGroup;
  public clientes: Cliente[] = [];
  public cuentas: Cuenta[] = [];
  public tiposMovimiento: Array<{ valor: string; etiqueta: string }> = [];
  public enviando = false;
  public cargandoCuentas = false;

  private readonly VALOR_MINIMO = 0.01;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private clienteService: ClienteService,
    private cuentaService: CuentaService,
    private cdr: ChangeDetectorRef
  ) {
    this.movimientoForm = this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarClientes();
    this.tiposMovimiento = this.movimientoService.obtenerTiposMovimiento();
    this.configurarCambiosCliente();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarClientes(): void {
    this.clienteService.obtenerTodos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  private configurarCambiosCliente(): void {
    const clienteControl = this.movimientoForm.get('clienteId');
    
    if (clienteControl) {
      clienteControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((clienteId) => {
          if (clienteId) {
            this.cargarCuentasDelCliente(clienteId);
            // Limpiar la selección de cuenta
            this.movimientoForm.patchValue({ cuentaId: '' });
          } else {
            this.cuentas = [];
          }
        });
    }
  }

  private cargarCuentasDelCliente(clienteId: string | number): void {
    this.cargandoCuentas = true;
    this.cdr.detectChanges();
    this.cuentaService.obtenerPorClienteId$(clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cuentas) => {
          this.cuentas = Array.isArray(cuentas) ? [...cuentas] : [];
          this.cargandoCuentas = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando cuentas del cliente:', error);
          this.cuentas = [];
          this.cargandoCuentas = false;
          this.cdr.detectChanges();
          alert('Error al cargar las cuentas del cliente');
        }
      });
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      clienteId: ['', Validators.required],
      cuentaId: ['', Validators.required],
      numeroCuenta: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      tipoMovimiento: ['DEBITO', Validators.required],
      valor: [0, [
        Validators.required,
        Validators.min(this.VALOR_MINIMO)
      ]]
    });
  }

  public obtenerControl(nombre: string) {
    return this.movimientoForm.get(nombre);
  }

  public tieneError(nombreCampo: string, tipoError: string): boolean {
    const control = this.movimientoForm.get(nombreCampo);
    return !!(control && control.hasError(tipoError) && control.touched);
  }

  public obtenerNombreClienteSeleccionado(): string {
    const clienteId = this.movimientoForm.get('clienteId')?.value;
    const cliente = this.clientes.find(c => c.clienteId === clienteId);
    return cliente?.nombre || '';
  }

  public obtenerNumeroCuentaSeleccionada(): void {
    const numeroCuenta = this.movimientoForm.get('cuentaId')?.value;
    const cuenta = this.cuentas.find(c => c.numeroCuenta === numeroCuenta);
    
    if (cuenta) {
      this.movimientoForm.patchValue({
        numeroCuenta: cuenta.numeroCuenta
      }, { emitEvent: false });
    }
  }

  public obtenerErrorNumeroCuenta(): string {
    const control = this.movimientoForm.get('numeroCuenta');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'El número de cuenta es requerido';
    }
    if (control.hasError('pattern')) {
      return 'Solo se aceptan números';
    }
    return '';
  }

  public obtenerErrorValor(): string {
    const control = this.movimientoForm.get('valor');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'El valor es requerido';
    }
    if (control.hasError('min')) {
      return 'El valor debe ser mayor a 0';
    }
    return '';
  }

  public submit(): void {
    if (!this.movimientoForm.valid) {
      Object.keys(this.movimientoForm.controls).forEach(key => {
        this.movimientoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;
    const datosFormulario = this.movimientoForm.value;
    const payload = {
      numeroCuenta: String(datosFormulario.numeroCuenta ?? '').trim(),
      tipoMovimiento: datosFormulario.tipoMovimiento as 'DEBITO' | 'CREDITO',
      valor: Number(datosFormulario.valor)
    };

    this.movimientoService.crear(payload).subscribe({
      next: (movimientoCreado) => {
        this.movimientoForm.reset({ tipoMovimiento: 'DEBITO' });
        this.cuentas = [];
        this.onSave.emit(movimientoCreado);
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al crear el movimiento:', error);
        alert('Error al crear el movimiento. Por favor, intente nuevamente.');
        this.enviando = false;
      }
    });
  }

  public cancelar(): void {
    this.movimientoForm.reset({ tipoMovimiento: 'DEBITO' });
    this.cuentas = [];
    this.onCancel.emit();
  }
}
