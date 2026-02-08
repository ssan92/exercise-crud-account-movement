import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoListComponent } from './movimiento-list';

describe('MovimientoListComponent', () => {
  let component: MovimientoListComponent;
  let fixture: ComponentFixture<MovimientoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
