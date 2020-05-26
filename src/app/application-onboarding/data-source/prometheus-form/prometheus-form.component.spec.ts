import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusFormComponent } from './prometheus-form.component';

describe('PrometheusFormComponent', () => {
  let component: PrometheusFormComponent;
  let fixture: ComponentFixture<PrometheusFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrometheusFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrometheusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
