import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultadosFacturasComponent } from './resultados-facturas.component';

describe('ResultadosFacturasComponent', () => {
  let component: ResultadosFacturasComponent;
  let fixture: ComponentFixture<ResultadosFacturasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadosFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadosFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
