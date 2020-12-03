import { TestBed } from '@angular/core/testing';

import { LogTemplateConfigService } from './log-template-config.service';

describe('LogTemplateConfigService', () => {
  let service: LogTemplateConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogTemplateConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
