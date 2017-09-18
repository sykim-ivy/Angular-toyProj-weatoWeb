import { TestBed, inject } from '@angular/core/testing';

import { HttpCommonInfoService } from './http-common-info.service';

describe('CommonInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCommonInfoService]
    });
  });

  it('should be created', inject([HttpCommonInfoService], (service: HttpCommonInfoService) => {
    expect(service).toBeTruthy();
  }));
});
