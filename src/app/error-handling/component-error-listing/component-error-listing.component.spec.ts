import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompLevelErrorListingComponent } from './component-error-listing.component';

describe('ComponentErrorListingComponent', () => {
  let component: CompLevelErrorListingComponent;
  let fixture: ComponentFixture<CompLevelErrorListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompLevelErrorListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompLevelErrorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
