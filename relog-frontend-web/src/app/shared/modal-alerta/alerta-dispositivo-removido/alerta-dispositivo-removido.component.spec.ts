import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaDispositivoRemovidoComponent } from './alerta-dispositivo-removido.component';

describe('AlertaDispositivoRemovidoComponent', () => {
  let component: AlertaDispositivoRemovidoComponent;
  let fixture: ComponentFixture<AlertaDispositivoRemovidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaDispositivoRemovidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaDispositivoRemovidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
