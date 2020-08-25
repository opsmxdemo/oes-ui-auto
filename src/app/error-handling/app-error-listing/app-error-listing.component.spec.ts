import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppErrorListingComponent } from './app-error-listing.component';

describe('AppErrorListingComponent', () => {
  let component: AppErrorListingComponent;
  let fixture: ComponentFixture<AppErrorListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppErrorListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppErrorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
