import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaCadastrarComponent } from './planta-cadastrar.component';

describe('PlantaCadastrarComponent', () => {
  let component: PlantaCadastrarComponent;
  let fixture: ComponentFixture<PlantaCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantaCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantaCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
