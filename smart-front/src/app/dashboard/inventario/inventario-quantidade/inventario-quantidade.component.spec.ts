import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioQuantidadeComponent } from './inventario-quantidade.component';

describe('InventarioQuantidadeComponent', () => {
  let component: InventarioQuantidadeComponent;
  let fixture: ComponentFixture<InventarioQuantidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioQuantidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioQuantidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
