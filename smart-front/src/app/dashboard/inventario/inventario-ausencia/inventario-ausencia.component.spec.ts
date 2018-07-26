import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioAusenciaComponent } from './inventario-ausencia.component';

describe('InventarioAusenciaComponent', () => {
  let component: InventarioAusenciaComponent;
  let fixture: ComponentFixture<InventarioAusenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioAusenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioAusenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
