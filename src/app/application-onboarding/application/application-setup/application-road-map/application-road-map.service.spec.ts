import { TestBed } from '@angular/core/testing';

import { ApplicationRoadMapService } from './application-road-map.service';

describe('ApplicationRoadMapService', () => {
  let service: ApplicationRoadMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationRoadMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
