import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMxHelptextComponent } from './helptext.component';

describe('OpsMxHelptextComponent', () => {
  let component: OpsMxHelptextComponent;
  let fixture: ComponentFixture<OpsMxHelptextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsMxHelptextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsMxHelptextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
