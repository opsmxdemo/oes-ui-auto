import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentVerificationConfigComponent } from './development-verification-config.component';

describe('DevelopmentVerificationConfigComponent', () => {
  let component: DevelopmentVerificationConfigComponent;
  let fixture: ComponentFixture<DevelopmentVerificationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentVerificationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentVerificationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
