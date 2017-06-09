import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorCadastrarComponent } from './fornecedor-cadastrar.component';

describe('FornecedorCadastrarComponent', () => {
  let component: FornecedorCadastrarComponent;
  let fixture: ComponentFixture<FornecedorCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
