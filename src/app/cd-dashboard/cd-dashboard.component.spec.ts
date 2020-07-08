import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdDashboardComponent } from './cd-dashboard.component';

describe('CdDashboardComponent', () => {
  let component: CdDashboardComponent;
  let fixture: ComponentFixture<CdDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
