import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPontoControleComponent } from './tipo-ponto-controle.component';

describe('TipoPontoControleComponent', () => {
  let component: TipoPontoControleComponent;
  let fixture: ComponentFixture<TipoPontoControleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoPontoControleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPontoControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
