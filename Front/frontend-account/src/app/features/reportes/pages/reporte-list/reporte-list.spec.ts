import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteListComponent } from './reporte-list';

describe('ReporteListComponent', () => {
  let component: ReporteListComponent;
  let fixture: ComponentFixture<ReporteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
