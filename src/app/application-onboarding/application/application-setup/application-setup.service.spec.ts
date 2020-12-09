import { TestBed } from '@angular/core/testing';

import { ApplicationSetupService } from './application-setup.service';

describe('ApplicationSetupService', () => {
  let service: ApplicationSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
