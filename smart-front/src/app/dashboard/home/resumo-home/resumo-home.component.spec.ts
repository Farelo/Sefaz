import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoHomeComponent } from './resumo-home.component';

describe('ResumoHomeComponent', () => {
  let component: ResumoHomeComponent;
  let fixture: ComponentFixture<ResumoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
