import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CuentaService } from './cuenta.service';
import { Cuenta } from '../models/cuenta.model';

describe('CuentaService', () => {
  let service: CuentaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CuentaService]
    });
    service = TestBed.inject(CuentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe retornar la lista de cuentas al llamar obtenerTodas$', () => {
    const cuentasMock: Cuenta[] = [
      {
        numeroCuenta: '1001-2023-001',
        tipoCuenta: 'AHORRO',
        saldoInicial: 5000,
        estado: true,
        clienteId: 1
      }
    ];

    let resultado: Cuenta[] = [];
    service.obtenerTodas$().subscribe((cuentas) => {
      resultado = cuentas;
    });

    const req = httpMock.expectOne('http://localhost:8080/api/cuentas');
    expect(req.request.method).toBe('GET');
    req.flush(cuentasMock);

    expect(resultado).toEqual(cuentasMock);
    expect(resultado.length).toBe(1);
  });
});
