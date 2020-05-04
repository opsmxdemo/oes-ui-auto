import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAccountsComponent } from './dynamic-accounts.component';

describe('DynamicAccountsComponent', () => {
  let component: DynamicAccountsComponent;
  let fixture: ComponentFixture<DynamicAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
