import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationformdetailsComponent } from './correlationformdetails.component';

describe('CorrelationformdetailsComponent', () => {
  let component: CorrelationformdetailsComponent;
  let fixture: ComponentFixture<CorrelationformdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelationformdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationformdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
