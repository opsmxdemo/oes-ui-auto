import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTagsComponent } from './log-tags.component';

describe('LogTagsComponent', () => {
  let component: LogTagsComponent;
  let fixture: ComponentFixture<LogTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
