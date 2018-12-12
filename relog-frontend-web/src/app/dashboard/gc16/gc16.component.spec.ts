import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gc16Component } from './gc16.component';

describe('Gc16Component', () => {
  let component: Gc16Component;
  let fixture: ComponentFixture<Gc16Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gc16Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gc16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
