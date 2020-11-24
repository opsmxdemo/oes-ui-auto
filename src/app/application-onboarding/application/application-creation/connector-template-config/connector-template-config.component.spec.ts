import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorTemplateConfigComponent } from './connector-template-config.component';

describe('ConnectorTemplateConfigComponent', () => {
  let component: ConnectorTemplateConfigComponent;
  let fixture: ComponentFixture<ConnectorTemplateConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectorTemplateConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
