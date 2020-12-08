import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnakerComponent } from './spinnaker.component';

describe('SpinnakerComponent', () => {
  let component: SpinnakerComponent;
  let fixture: ComponentFixture<SpinnakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
