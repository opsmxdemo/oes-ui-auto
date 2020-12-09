import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationServiceComponent } from './application-service.component';

describe('ApplicationServiceComponent', () => {
  let component: ApplicationServiceComponent;
  let fixture: ComponentFixture<ApplicationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
