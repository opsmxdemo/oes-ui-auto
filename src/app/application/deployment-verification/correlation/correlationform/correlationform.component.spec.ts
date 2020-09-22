import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationformComponent } from './correlationform.component';

describe('CorrelationformComponent', () => {
  let component: CorrelationformComponent;
  let fixture: ComponentFixture<CorrelationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
