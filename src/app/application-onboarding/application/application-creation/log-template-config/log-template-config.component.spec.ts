import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTemplateConfigComponent } from './log-template-config.component';

describe('LogTemplateConfigComponent', () => {
  let component: LogTemplateConfigComponent;
  let fixture: ComponentFixture<LogTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
