import { TestBed, inject } from '@angular/core/testing';

import { HttpWeatherplanetApiRequestService } from './http-weatherplanet-api-request.service';

describe('HttpWeatherplanetApiRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpWeatherplanetApiRequestService]
    });
  });

  it('should be created', inject([HttpWeatherplanetApiRequestService], (service: HttpWeatherplanetApiRequestService) => {
    expect(service).toBeTruthy();
  }));
});
