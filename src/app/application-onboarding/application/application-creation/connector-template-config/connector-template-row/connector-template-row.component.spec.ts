import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorTemplateRowComponent } from './connector-template-row.component';

describe('ConnectorTemplateRowComponent', () => {
  let component: ConnectorTemplateRowComponent;
  let fixture: ComponentFixture<ConnectorTemplateRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectorTemplateRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorTemplateRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
