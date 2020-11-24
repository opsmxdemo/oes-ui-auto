import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorTemplateComponent } from './connector-template.component';

describe('ConnectorTemplateComponent', () => {
  let component: ConnectorTemplateComponent;
  let fixture: ComponentFixture<ConnectorTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectorTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
