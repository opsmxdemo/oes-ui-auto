import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeaturesComponent } from './service-features.component';

describe('ServiceFeaturesComponent', () => {
  let component: ServiceFeaturesComponent;
  let fixture: ComponentFixture<ServiceFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
