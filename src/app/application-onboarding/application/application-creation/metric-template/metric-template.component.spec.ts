import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricTemplateComponent } from './metric-template.component';

describe('MetricTemplateComponent', () => {
  let component: MetricTemplateComponent;
  let fixture: ComponentFixture<MetricTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
