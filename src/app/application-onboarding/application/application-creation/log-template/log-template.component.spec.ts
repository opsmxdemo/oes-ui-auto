import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTemplateComponent } from './log-template.component';

describe('LogTemplateComponent', () => {
  let component: LogTemplateComponent;
  let fixture: ComponentFixture<LogTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
