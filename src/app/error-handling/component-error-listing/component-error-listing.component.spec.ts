import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentErrorListingComponent } from './component-error-listing.component';

describe('ComponentErrorListingComponent', () => {
  let component: ComponentErrorListingComponent;
  let fixture: ComponentFixture<ComponentErrorListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentErrorListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentErrorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
