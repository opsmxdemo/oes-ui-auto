import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAnalysisChartComponent } from './time-analysis-chart.component';

describe('TimeAnalysisChartComponent', () => {
  let component: TimeAnalysisChartComponent;
  let fixture: ComponentFixture<TimeAnalysisChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeAnalysisChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAnalysisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
