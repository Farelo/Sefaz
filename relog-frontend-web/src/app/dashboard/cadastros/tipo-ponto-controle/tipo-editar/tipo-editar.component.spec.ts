import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEditarComponent } from './tipo-editar.component';

describe('TipoEditarComponent', () => {
  let component: TipoEditarComponent;
  let fixture: ComponentFixture<TipoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
