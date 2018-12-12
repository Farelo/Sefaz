import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaBateriaBaixaComponent } from './categoria-bateria-baixa.component';

describe('CategoriaBateriaBaixaComponent', () => {
  let component: CategoriaBateriaBaixaComponent;
  let fixture: ComponentFixture<CategoriaBateriaBaixaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaBateriaBaixaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaBateriaBaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
