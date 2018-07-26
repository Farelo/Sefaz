import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioEquipamentoGeralComponent } from './inventario-equipamento-geral.component';

describe('InventarioEquipamentoGeralComponent', () => {
  let component: InventarioEquipamentoGeralComponent;
  let fixture: ComponentFixture<InventarioEquipamentoGeralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioEquipamentoGeralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioEquipamentoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
