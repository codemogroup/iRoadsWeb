import { TestBed, inject } from '@angular/core/testing';

import { GlobalSharingService } from './global-sharing.service';

describe('GlobalSharingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalSharingService]
    });
  });

  it('should be created', inject([GlobalSharingService], (service: GlobalSharingService) => {
    expect(service).toBeTruthy();
  }));
});
