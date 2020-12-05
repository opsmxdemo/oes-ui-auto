import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxFormGridComponent } from './form-grid.component';

describe('FormGridComponent', () => {
  let component: OpsMxFormGridComponent;
  let fixture: ComponentFixture<OpsMxFormGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxFormGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxFormGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
