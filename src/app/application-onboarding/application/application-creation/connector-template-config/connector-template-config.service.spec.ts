import { TestBed } from '@angular/core/testing';

import { ConnectorTemplateConfigService } from './connector-template-config.service';

describe('ConnectorTemplateConfigService', () => {
  let service: ConnectorTemplateConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorTemplateConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
