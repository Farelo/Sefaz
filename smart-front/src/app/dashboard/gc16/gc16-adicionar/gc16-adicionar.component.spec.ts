import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gc16AdicionarComponent } from './gc16-adicionar.component';

describe('Gc16AdicionarComponent', () => {
  let component: Gc16AdicionarComponent;
  let fixture: ComponentFixture<Gc16AdicionarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gc16AdicionarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gc16AdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
