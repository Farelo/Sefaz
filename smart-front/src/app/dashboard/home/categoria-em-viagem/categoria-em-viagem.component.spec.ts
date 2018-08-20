import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEmViagemComponent } from './categoria-em-viagem.component';

describe('CategoriaEmViagemComponent', () => {
  let component: CategoriaEmViagemComponent;
  let fixture: ComponentFixture<CategoriaEmViagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaEmViagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaEmViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
