import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorCadastrarComponent } from './setor-cadastrar.component';

describe('SetorCadastrarComponent', () => {
  let component: SetorCadastrarComponent;
  let fixture: ComponentFixture<SetorCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetorCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetorCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
