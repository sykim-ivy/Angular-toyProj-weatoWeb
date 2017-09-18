import { TestBed, inject } from '@angular/core/testing';

import { HttpNavermapV3ApiRequestService } from './http-navermap-v3-api-request.service';

describe('HttpNavermapV3ApiRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpNavermapV3ApiRequestService]
    });
  });

  it('should be created', inject([HttpNavermapV3ApiRequestService], (service: HttpNavermapV3ApiRequestService) => {
    expect(service).toBeTruthy();
  }));
});
