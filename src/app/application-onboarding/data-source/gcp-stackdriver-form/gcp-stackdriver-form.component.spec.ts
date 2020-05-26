import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcpStackdriverFormComponent } from './gcp-stackdriver-form.component';

describe('GcpStackdriverFormComponent', () => {
  let component: GcpStackdriverFormComponent;
  let fixture: ComponentFixture<GcpStackdriverFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcpStackdriverFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcpStackdriverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
