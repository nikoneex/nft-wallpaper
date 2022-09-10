import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import SwiperCore, { Keyboard, Pagination, Navigation, Virtual, SwiperOptions, Autoplay, EffectFade, EffectFlip, EffectCube, EffectCards, EffectCreative, EffectCoverflow } from 'swiper';
import { INft } from 'src/app/models/nft';
import * as _ from 'lodash'
import { SettingsService } from 'src/app/services/settings.service';
import { SwiperComponent } from 'swiper/angular';
import { WallpaperService } from 'src/app/services/wallpaper.service';
import { User } from 'src/app/models/user';


SwiperCore.use([Autoplay, Keyboard, Pagination, Navigation, Virtual, EffectFade, EffectFlip, EffectCube, EffectCards, EffectCreative, EffectCoverflow ]);

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WallpaperComponent implements OnInit, OnDestroy {

  @ViewChild('swiper') SwiperComponent?: SwiperComponent;

  loading: boolean = false;
  _loading: Subscription;

  swiperConfig: SwiperOptions = {};
  _config: Subscription;
  collection: any[] = []
  _collection: Subscription;
  user: User = {
    address: this.wps.address
  }

  refreshing = false;

  constructor(
    private settings: SettingsService,
    private cdref: ChangeDetectorRef,
    private wps: WallpaperService
  ) { 
    this.swiperConfig = this.settings.config;
    this._config = this.settings.configSubscription.subscribe( config => {
      this.refreshing = true;
      this.swiperConfig = config;
      this.cdref.detectChanges();
      this.refreshing = false;
    })
    this.collection = this.wps.collection;
    this._collection = this.wps.collectionSubscription.subscribe( collection => {
      this.collection = collection;
      this.cdref.detectChanges();
    })
    this._loading = this.wps.loadingSubscription.subscribe( loading => {
      this.loading = loading;
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cdref.detach();
    this._config.unsubscribe();
  }

  parseNfts(nftList: INft[]) {
    return _.filter(nftList, function(o) {return !o.error}) as INft[]
  }

  onSwiper(swiper:any) {
    console.log(swiper);
  }
  onSlideChange(event: any) {
    console.log(event);
  }

}
