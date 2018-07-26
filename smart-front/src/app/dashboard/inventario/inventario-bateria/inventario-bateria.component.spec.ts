import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioBateriaComponent } from './inventario-bateria.component';

describe('InventarioBateriaComponent', () => {
  let component: InventarioBateriaComponent;
  let fixture: ComponentFixture<InventarioBateriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioBateriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioBateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
