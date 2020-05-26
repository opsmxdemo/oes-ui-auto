import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatadogFormComponent } from './datadog-form.component';

describe('DatadogFormComponent', () => {
  let component: DatadogFormComponent;
  let fixture: ComponentFixture<DatadogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatadogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatadogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
