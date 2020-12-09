import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRoadMapComponent } from './application-road-map.component';

describe('ApplicationRoadMapComponent', () => {
  let component: ApplicationRoadMapComponent;
  let fixture: ComponentFixture<ApplicationRoadMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationRoadMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationRoadMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
