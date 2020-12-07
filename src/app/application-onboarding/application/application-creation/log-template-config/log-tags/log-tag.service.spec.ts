import { TestBed } from '@angular/core/testing';

import { LogTagService } from './log-tag.service';

describe('LogTagService', () => {
  let service: LogTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
