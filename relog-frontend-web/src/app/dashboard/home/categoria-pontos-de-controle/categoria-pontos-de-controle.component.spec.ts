import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPontosDeControleComponent } from './categoria-pontos-de-controle.component';

describe('CategoriaPontosDeControleComponent', () => {
  let component: CategoriaPontosDeControleComponent;
  let fixture: ComponentFixture<CategoriaPontosDeControleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaPontosDeControleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaPontosDeControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
