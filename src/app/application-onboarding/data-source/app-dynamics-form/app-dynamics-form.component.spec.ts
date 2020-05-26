import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDynamicsFormComponent } from './app-dynamics-form.component';

describe('AppDynamicsFormComponent', () => {
  let component: AppDynamicsFormComponent;
  let fixture: ComponentFixture<AppDynamicsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDynamicsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDynamicsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
