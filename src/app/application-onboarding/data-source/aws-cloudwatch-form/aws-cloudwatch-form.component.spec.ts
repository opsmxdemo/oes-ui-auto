import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsCloudwatchFormComponent } from './aws-cloudwatch-form.component';

describe('AwsCloudwatchFormComponent', () => {
  let component: AwsCloudwatchFormComponent;
  let fixture: ComponentFixture<AwsCloudwatchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsCloudwatchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsCloudwatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
