import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioRemovidoComponent } from './inventario-removido.component';

describe('InventarioRemovidoComponent', () => {
  let component: InventarioRemovidoComponent;
  let fixture: ComponentFixture<InventarioRemovidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioRemovidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioRemovidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
