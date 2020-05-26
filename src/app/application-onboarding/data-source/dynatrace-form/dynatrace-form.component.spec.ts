import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynatraceFormComponent } from './dynatrace-form.component';

describe('DynatraceFormComponent', () => {
  let component: DynatraceFormComponent;
  let fixture: ComponentFixture<DynatraceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynatraceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynatraceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
