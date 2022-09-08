import { TestBed } from '@angular/core/testing';

import { SwiperConfigService } from './swiper-config.service';

describe('SwiperConfigService', () => {
  let service: SwiperConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwiperConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
