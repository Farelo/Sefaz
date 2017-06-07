import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbalagemDetalheComponent } from './embalagem-detalhe.component';

describe('EmbalagemDetalheComponent', () => {
  let component: EmbalagemDetalheComponent;
  let fixture: ComponentFixture<EmbalagemDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbalagemDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbalagemDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
