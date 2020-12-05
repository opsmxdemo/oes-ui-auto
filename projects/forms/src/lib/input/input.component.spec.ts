import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxInputComponent } from './input.component';

describe('OpsMxInputComponent', () => {
  let component: OpsMxInputComponent;
  let fixture: ComponentFixture<OpsMxInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
