import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCadastrarComponent } from './tipo-cadastrar.component';

describe('TipoCadastrarComponent', () => {
  let component: TipoCadastrarComponent;
  let fixture: ComponentFixture<TipoCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
