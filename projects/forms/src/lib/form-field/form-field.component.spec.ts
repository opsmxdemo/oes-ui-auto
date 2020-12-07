import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxFormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: OpsMxFormFieldComponent;
  let fixture: ComponentFixture<OpsMxFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
