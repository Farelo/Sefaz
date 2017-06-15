import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerCadastrarComponent } from './scanner-cadastrar.component';

describe('ScannerCadastrarComponent', () => {
  let component: ScannerCadastrarComponent;
  let fixture: ComponentFixture<ScannerCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
