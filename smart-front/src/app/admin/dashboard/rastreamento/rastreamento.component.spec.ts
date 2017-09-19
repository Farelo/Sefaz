import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RastreamentoComponent } from './rastreamento.component';

describe('RastreamentoComponent', () => {
  let component: RastreamentoComponent;
  let fixture: ComponentFixture<RastreamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RastreamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RastreamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
