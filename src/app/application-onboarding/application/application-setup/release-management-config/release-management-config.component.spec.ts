import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseManagementConfigComponent } from './release-management-config.component';

describe('ReleaseManagementConfigComponent', () => {
  let component: ReleaseManagementConfigComponent;
  let fixture: ComponentFixture<ReleaseManagementConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseManagementConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseManagementConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
