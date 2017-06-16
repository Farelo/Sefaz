import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbalagemCadastroComponent } from './embalagem-cadastro.component';

describe('EmbalagemCadastroComponent', () => {
  let component: EmbalagemCadastroComponent;
  let fixture: ComponentFixture<EmbalagemCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbalagemCadastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbalagemCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
