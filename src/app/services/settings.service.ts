import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SwiperOptions } from 'swiper';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  

  slideEffect: SwiperOptions = {
    effect: 'slide'
  }
  cardsEffect: SwiperOptions = {
    effect: 'cards'
  }
  coverflowEffect: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 300
  }
  
  effects = [this.slideEffect, this.cardsEffect, this.coverflowEffect];

  config: SwiperOptions = {
    slidesPerView: 1,
    centeredSlides: true,
    effect: 'slide',
    virtual: true,
    pagination: false,
    scrollbar: { draggable: true },
    keyboard: { enabled: true },
  }



  bgColor = 'bg-zinc-700';
  bgColorSubscription: Subject<string> = new Subject<string>()
  

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

  updateBgColor(color: string) {
    this.bgColor = color;
    this.bgColorSubscription.next(this.bgColor);
  }


  updateConfig(config: SwiperOptions) {
    this.config = config;
    this.configSubscription.next(this.config);
  }

  updateEffects(i: number){
    if(i === 2){
      this.config.slidesPerView = this.coverflowEffect.slidesPerView;
      this.config.spaceBetween = this.coverflowEffect.spaceBetween;
      this.config.effect = 'slide';
      this.updateConfig(this.config);
    } else {
      //default
      this.config.slidesPerView = 1;
      this.config.spaceBetween = 0;
      //
      this.config.effect = this.effects[i].effect;
      this.updateConfig(this.config);
    }

  }

  cacheConfig(config: SwiperOptions) {
    localStorage.setItem('swiperConfig', JSON.stringify(config))
  }
}
