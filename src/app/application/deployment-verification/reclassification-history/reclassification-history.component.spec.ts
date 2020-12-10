import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclassificationHistoryComponent } from './reclassification-history.component';

describe('ReclassificationHistoryComponent', () => {
  let component: ReclassificationHistoryComponent;
  let fixture: ComponentFixture<ReclassificationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclassificationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclassificationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
