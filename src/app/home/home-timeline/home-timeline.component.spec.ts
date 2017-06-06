import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTimelineComponent } from './home-timeline.component';

describe('HomeTimelineComponent', () => {
  let component: HomeTimelineComponent;
  let fixture: ComponentFixture<HomeTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
