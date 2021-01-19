import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioPosicoesComponent } from './inventario-posicoes.component';

describe('InventarioPosicoesComponent', () => {
  let component: InventarioPosicoesComponent;
  let fixture: ComponentFixture<InventarioPosicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioPosicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioPosicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
