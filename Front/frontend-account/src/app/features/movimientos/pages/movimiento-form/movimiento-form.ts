import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
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

/**
 * MovimientoFormComponent: Formulario para crear movimientos
 * - Permite seleccionar cliente y cargar sus cuentas dinámicamente
 * - Reactive Forms para validaciones robustas
 * - Comunica con el padre mediante eventos
 */
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

  /**
   * Constructor con inyección de dependencias
   */
  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private clienteService: ClienteService,
    private cuentaService: CuentaService
  ) {
    this.movimientoForm = this.crearFormulario();
  }

  /**
   * Se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.cargarClientes();
    this.tiposMovimiento = this.movimientoService.obtenerTiposMovimiento();
    this.configurarCambiosCliente();
  }

  /**
   * Se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga la lista de clientes
   */
  private cargarClientes(): void {
    this.clienteService.obtenerTodos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          console.log('✓ Clientes cargados:', clientes);
        },
        error: (error) => {
          console.error('✗ Error cargando clientes:', error);
          alert('Error al cargar los clientes');
        }
      });
  }

  /**
   * Configura el listener para cambios en el control de cliente
   */
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

  /**
   * Carga las cuentas del cliente seleccionado
   */
  private cargarCuentasDelCliente(clienteId: string | number): void {
    this.cargandoCuentas = true;
    this.cuentaService.obtenerPorClienteId$(clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cuentas) => {
          this.cuentas = cuentas;
          this.cargandoCuentas = false;
          console.log(`✓ Cuentas del cliente ${clienteId} cargadas:`, cuentas);
        },
        error: (error) => {
          console.error(`✗ Error cargando cuentas del cliente ${clienteId}:`, error);
          this.cuentas = [];
          this.cargandoCuentas = false;
          alert('Error al cargar las cuentas del cliente');
        }
      });
  }

  /**
   * Crea la estructura del formulario con validaciones
   */
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

  /**
   * Obtiene un control del formulario
   */
  public obtenerControl(nombre: string) {
    return this.movimientoForm.get(nombre);
  }

  /**
   * Verifica si un campo tiene un error específico
   */
  public tieneError(nombreCampo: string, tipoError: string): boolean {
    const control = this.movimientoForm.get(nombreCampo);
    return !!(control && control.hasError(tipoError) && control.touched);
  }

  /**
   * Obtiene el nombre del cliente seleccionado
   */
  public obtenerNombreClienteSeleccionado(): string {
    const clienteId = this.movimientoForm.get('clienteId')?.value;
    const cliente = this.clientes.find(c => c.clienteId === clienteId);
    return cliente?.nombre || '';
  }

  /**
   * Obtiene el número de cuenta seleccionada
   */
  public obtenerNumeroCuentaSeleccionada(): void {
    const cuentaId = this.movimientoForm.get('cuentaId')?.value;
    const cuenta = this.cuentas.find(c => c.id === cuentaId);
    
    if (cuenta) {
      this.movimientoForm.patchValue({
        numeroCuenta: cuenta.numeroCuenta
      }, { emitEvent: false });
    }
  }

  /**
   * Valida que el número de cuenta sea válido (solo números)
   */
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

  /**
   * Valida que el valor sea correcto
   */
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

  /**
   * Envía el formulario (crear movimiento)
   */
  public submit(): void {
    console.log('▶ submit() llamado');
    console.log('Formulario válido:', this.movimientoForm.valid);
    console.log('Valor formulario:', this.movimientoForm.value);
    console.log('Errores:', this.movimientoForm.errors);
    
    // Log de errores en cada control
    Object.keys(this.movimientoForm.controls).forEach(key => {
      const control = this.movimientoForm.get(key);
      if (control?.invalid) {
        console.log(`Campo '${key}' inválido:`, control.errors);
      }
    });

    if (!this.movimientoForm.valid) {
      console.warn('❌ Formulario inválido, marcando como tocado');
      Object.keys(this.movimientoForm.controls).forEach(key => {
        this.movimientoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.enviando = true;
    const datosFormulario = this.movimientoForm.value;
    
    // Construir el objeto movimiento solo con los campos necesarios
    const movimiento: Omit<Movimiento, 'id' | 'fecha'> = {
      numeroCuenta: datosFormulario.numeroCuenta,
      tipoMovimiento: datosFormulario.tipoMovimiento,
      valor: datosFormulario.valor,
      clienteId: datosFormulario.clienteId,
      cuentaId: datosFormulario.cuentaId
    };

    console.log('📤 Enviando movimiento:', movimiento);
    this.movimientoService.crear(movimiento).subscribe({
      next: (movimientoCreado) => {
        console.log('✓ Movimiento creado exitosamente:', movimientoCreado);
        this.movimientoForm.reset({ tipoMovimiento: 'DEBITO' });
        this.cuentas = [];
        this.onSave.emit(movimientoCreado);
        this.enviando = false;
      },
      error: (error) => {
        console.error('✗ Error al crear el movimiento:', error);
        alert('Error al crear el movimiento. Por favor, intente nuevamente.');
        this.enviando = false;
      }
    });
  }

  /**
   * Cancela la operación
   */
  public cancelar(): void {
    this.movimientoForm.reset({ tipoMovimiento: 'DEBITO' });
    this.cuentas = [];
    this.onCancel.emit();
  }
}
