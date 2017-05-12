import { TestBed, inject } from '@angular/core/testing';

import { DiscoveryQueryService } from './discovery-query.service';

describe('DiscoveryQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscoveryQueryService]
    });
  });

  it('should ...', inject([DiscoveryQueryService], (service: DiscoveryQueryService) => {
    expect(service).toBeTruthy();
  }));
});
