import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransaccionComponent } from './transaccion.component';

describe('TransaccionComponent', () => {
  let component: TransaccionComponent;
  let fixture: ComponentFixture<TransaccionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
