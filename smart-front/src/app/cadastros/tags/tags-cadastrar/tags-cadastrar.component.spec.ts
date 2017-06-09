import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsCadastrarComponent } from './tags-cadastrar.component';

describe('TagsCadastrarComponent', () => {
  let component: TagsCadastrarComponent;
  let fixture: ComponentFixture<TagsCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
