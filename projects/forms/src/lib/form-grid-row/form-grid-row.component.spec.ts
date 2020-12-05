import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxFormGridRowComponent } from './form-grid-row.component';

describe('FormGridRowComponent', () => {
  let component: OpsMxFormGridRowComponent;
  let fixture: ComponentFixture<OpsMxFormGridRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxFormGridRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxFormGridRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
