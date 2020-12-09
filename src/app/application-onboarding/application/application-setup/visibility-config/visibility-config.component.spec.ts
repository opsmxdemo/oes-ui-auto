import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityConfigComponent } from './visibility-config.component';

describe('VisibilityConfigComponent', () => {
  let component: VisibilityConfigComponent;
  let fixture: ComponentFixture<VisibilityConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
