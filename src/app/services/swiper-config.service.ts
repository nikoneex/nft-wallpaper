import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SwiperOptions } from 'swiper';

@Injectable({
  providedIn: 'root'
})
export class SwiperConfigService {

  config: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 100,
    centeredSlides: true,
    virtual: true,
    pagination: false,
    scrollbar: { draggable: true },
    keyboard: { enabled: true },
  }

  

  configSubscription: Subject<SwiperOptions> = new Subject<SwiperOptions>()

  // config : SwiperOptions = {
  //   slidesPerView: 1,
  //   spaceBetween: 50,
  //   centeredSlides: true,
  //   virtual: true,
  //   autoplay: false,
  //   pagination: false,
  //   scrollbar: { draggable: true },
  // };

  constructor() { 
  }


  updateConfig(config: SwiperOptions) {
    this.config = config;
    this.configSubscription.next(this.config);
  }

  cacheConfig(config: SwiperOptions) {
    localStorage.setItem('swiperConfig', JSON.stringify(config))
  }
}
