import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricTemplateConfigComponent } from './metric-template-config.component';

describe('MetricTemplateConfigComponent', () => {
  let component: MetricTemplateConfigComponent;
  let fixture: ComponentFixture<MetricTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
