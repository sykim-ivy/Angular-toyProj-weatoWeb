import { TestBed, inject } from '@angular/core/testing';

import { HttpTourApiRequestService } from './http-tour-api-request.service';

describe('HttpTourApiRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpTourApiRequestService]
    });
  });

  it('should be created', inject([HttpTourApiRequestService], (service: HttpTourApiRequestService) => {
    expect(service).toBeTruthy();
  }));
});
