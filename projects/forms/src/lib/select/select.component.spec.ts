import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxSelectComponent } from './select.component';

describe('OpsMxSelectComponent', () => {
  let component: OpsMxSelectComponent;
  let fixture: ComponentFixture<OpsMxSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
