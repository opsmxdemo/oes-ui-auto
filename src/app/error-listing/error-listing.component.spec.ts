import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorListingComponent } from './error-listing.component';

describe('ErrorListingComponent', () => {
  let component: ErrorListingComponent;
  let fixture: ComponentFixture<ErrorListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
