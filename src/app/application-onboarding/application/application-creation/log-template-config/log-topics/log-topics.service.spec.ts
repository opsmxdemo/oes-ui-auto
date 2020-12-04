import { TestBed } from '@angular/core/testing';

import { LogTopicsService } from './log-topics.service';

describe('LogTopicsService', () => {
  let service: LogTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogTopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
