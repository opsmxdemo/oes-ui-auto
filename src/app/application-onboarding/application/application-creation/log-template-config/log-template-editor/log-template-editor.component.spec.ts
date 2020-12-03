import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTemplateEditorComponent } from './log-template-editor.component';

describe('LogTemplateEditorComponent', () => {
  let component: LogTemplateEditorComponent;
  let fixture: ComponentFixture<LogTemplateEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTemplateEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
