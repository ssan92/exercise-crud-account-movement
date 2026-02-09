import { TestBed } from '@angular/core/testing';
import { CuentaFormComponent } from './cuenta-form';

describe('CuentaFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaFormComponent]
    }).compileComponents();
  });

  it('debe emitir onSave con los datos del formulario cuando submit() se llama con formulario válido', () => {
    const fixture = TestBed.createComponent(CuentaFormComponent);
    const component = fixture.componentInstance;
    component.tiposCuenta = [{ valor: 'AHORRO', etiqueta: 'Cuenta de Ahorro' }];
    component.clientes = [{ clienteId: 1, nombre: 'Juan', identificacion: '123', genero: 'MASCULINO', edad: 25, direccion: 'Calle 1', telefono: '123', contrasena: 'xxx', estado: true }];

    const onSaveSpy = vi.fn();
    component.onSave.subscribe(onSaveSpy);

    component.cuentaForm.patchValue({
      numeroCuenta: '1001-2023-001',
      tipoCuenta: 'AHORRO',
      saldoInicial: 5000,
      clienteId: 1,
      estado: true
    });

    component.submit();

    expect(onSaveSpy).toHaveBeenCalledTimes(1);
    expect(onSaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        numeroCuenta: '1001-2023-001',
        tipoCuenta: 'AHORRO',
        saldoInicial: 5000,
        clienteId: 1,
        estado: true
      })
    );
  });
});
