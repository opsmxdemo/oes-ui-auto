import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxButtonComponent } from './button.component';

describe('OpsMxButtonComponent', () => {
  let component: OpsMxButtonComponent;
  let fixture: ComponentFixture<OpsMxButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
