import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaCadastrarComponent } from './plataforma-cadastrar.component';

describe('PlataformaCadastrarComponent', () => {
  let component: PlataformaCadastrarComponent;
  let fixture: ComponentFixture<PlataformaCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlataformaCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlataformaCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
