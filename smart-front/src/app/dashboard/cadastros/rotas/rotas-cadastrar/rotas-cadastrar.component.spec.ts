import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotasCadastrarComponent } from './rotas-cadastrar.component';

describe('RotasCadastrarComponent', () => {
  let component: RotasCadastrarComponent;
  let fixture: ComponentFixture<RotasCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotasCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotasCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
