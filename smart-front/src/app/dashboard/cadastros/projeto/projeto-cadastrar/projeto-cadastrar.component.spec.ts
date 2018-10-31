import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoCadastrarComponent } from './projeto-cadastrar.component';

describe('PlataformaCadastrarComponent', () => {
  let component: ProjetoCadastrarComponent;
  let fixture: ComponentFixture<ProjetoCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjetoCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetoCadastrarComponent);
    component = fixture.componentInstance; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
