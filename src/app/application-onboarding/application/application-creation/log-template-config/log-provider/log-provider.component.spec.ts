import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogProviderComponent } from './log-provider.component';

describe('LogProviderComponent', () => {
  let component: LogProviderComponent;
  let fixture: ComponentFixture<LogProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
