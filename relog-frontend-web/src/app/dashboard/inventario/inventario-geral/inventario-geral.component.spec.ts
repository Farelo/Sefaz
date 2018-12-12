import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioGeralComponent } from './inventario-geral.component';

describe('InventarioGeralComponent', () => {
  let component: InventarioGeralComponent;
  let fixture: ComponentFixture<InventarioGeralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioGeralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
