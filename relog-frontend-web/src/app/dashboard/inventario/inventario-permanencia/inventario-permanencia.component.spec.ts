import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioPermanenciaComponent } from './inventario-permanencia.component';

describe('InventarioPermanenciaComponent', () => {
  let component: InventarioPermanenciaComponent;
  let fixture: ComponentFixture<InventarioPermanenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioPermanenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioPermanenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
