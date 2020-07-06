import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StacketHorizontalBarChartComponent } from './stacket-horizontal-bar-chart.component';

describe('StacketHorizontalBarChartComponent', () => {
  let component: StacketHorizontalBarChartComponent;
  let fixture: ComponentFixture<StacketHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StacketHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StacketHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
