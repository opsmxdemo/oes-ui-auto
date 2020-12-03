import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTemplateFormComponent } from './log-template-form.component';

describe('LogTemplateFormComponent', () => {
  let component: LogTemplateFormComponent;
  let fixture: ComponentFixture<LogTemplateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTemplateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
