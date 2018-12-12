import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaSemSinalComponent } from './categoria-sem-sinal.component';

describe('CategoriaSemSinalComponent', () => {
  let component: CategoriaSemSinalComponent;
  let fixture: ComponentFixture<CategoriaSemSinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaSemSinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaSemSinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
