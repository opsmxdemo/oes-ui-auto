import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTopicsComponent } from './log-topics.component';

describe('LogTopicsComponent', () => {
  let component: LogTopicsComponent;
  let fixture: ComponentFixture<LogTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
