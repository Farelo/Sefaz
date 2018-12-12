import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FamiliaCadastroComponent } from './familia-cadastro.component';

describe('EmbalagemCadastroComponent', () => {
  let component: FamiliaCadastroComponent;
  let fixture: ComponentFixture<FamiliaCadastroComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamiliaCadastroComponent ]
    })
    .compileComponents();  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliaCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
