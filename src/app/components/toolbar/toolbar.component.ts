import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { faExpand, faPlus, faSun, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { SwiperConfigService } from 'src/app/services/swiper-config.service';
import { SwiperOptions } from 'swiper';
import { Subscription, Observable, startWith, map, Subject } from 'rxjs';
import * as _ from 'lodash'
import { BlockdaemonService } from 'src/app/services/blockdaemon.service';
import {FormControl} from '@angular/forms';
import { ICollectionModel } from 'src/app/models/nft';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { WallpaperService } from 'src/app/services/wallpaper.service';
import { add } from 'lodash';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  //Icons
  faExpand = faExpand
  faPlus = faPlus
  faSun = faSun
  faPlay = faPlayCircle

  @ViewChild('addressInput') addressInput!: HTMLInputElement;
  @ViewChild('fullscreenBtn') fsBtn!: HTMLButtonElement;
  @ViewChild('auto', { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;

  form: FormControl = new FormControl();
  results: ICollectionModel[] = [
    {
      name: '',
      contracts: [],
      id: '',
      logo: '',
      verified: false
    }
  ];
  filteredResults: Subject<ICollectionModel[]> = new Subject<ICollectionModel[]>();


  addressVal: string = '';
  isFullscreen: boolean = false;
  isDarkmode: boolean = false;
  isAutoplay: boolean = false;

  swiperConfig: SwiperOptions = {};
  _configSubscription: Subscription;




  constructor(
    private as: AlchemyService,
    private bd: BlockdaemonService,
    private swiper: SwiperConfigService,
    private wps: WallpaperService
  ) {
    this.addressVal = this.as.address;
    this.swiperConfig = this.swiper.config;
    this._configSubscription = this.swiper.configSubscription.subscribe( config => {
      this.swiperConfig = config;
      console.log(this.swiperConfig)
    })
  }

  ngOnInit(): void {
    this.checkWakeLock();
  }

  async checkWakeLock(){
    const anyNav: any = navigator
    if ('wakeLock' in navigator) {
      try {
        anyNav["wakeLock"].request("screen");
     } catch(err) {
        console.log(err);
     }
    }
  }

  onNameSearch(name: string, e:KeyboardEvent) {
    if(name.length === 0){
      this.filteredResults.next([]);
    } else {
      if(e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowLeft' || e.code == 'ArrowRight'){
        return
      } else {
        // this.bd.searchByName(name).subscribe(res => {
        //   this.results = res.data;
        //   this.filteredResults.next(res.data);
        // })
      }
    }
  }

  loadCollection(e:MatAutocompleteSelectedEvent) {
    let collection = _.find(this.results, {name: e.option.value})
    console.log(collection)

    this.bd.getAssetsByContract(collection?.contracts[0]).subscribe(res => {
      console.log(res)
    })
  }


  formatLabel(value: number) {
    let label: number
    //in seconds
    let delaySteps = [3, 5, 10, 15, 20, 30, 60, 120, 180, 240, 300];
    label = delaySteps[value];
    if (label >= 60) {
      return Math.round(label / 60) + 'm';
    }
    return label + 's';
  }

  updateDelay(value: number){
    let delay: number;
    //in seconds
    let delaySteps = [3, 5, 10, 15, 20, 30, 60, 120, 180, 240, 300];

    delay = delaySteps[value] * 1000;

    this.swiperConfig.autoplay = { delay };
    this.swiper.updateConfig(this.swiperConfig);
  }


  loadAddress(address: string){
    this.wps.cacheAddress(address);
    this.bd.getAssetsByWallet(address).subscribe( collection => {
      this.wps.collectionSubscription.next(collection.data);
    })
  }

  toggleDarkmode(isDarkmode: boolean) {
    const doc = document.getElementById('html');

    isDarkmode ? doc?.classList.add('dark') : doc?.classList.remove('dark')
  }

  toggleAutoplay(isAutoplay: boolean) {
    let onAutoplay = _.cloneDeep(this.swiperConfig);
    onAutoplay.autoplay = { delay: 3000 };
    let offAutoplay = _.cloneDeep(this.swiperConfig);
    offAutoplay.autoplay = false;

    isAutoplay ? this.swiper.updateConfig(onAutoplay) : this.swiper.updateConfig(offAutoplay)
  }

  toggleFullscreen() {
    this.isFullscreen ? this.closeFullscreen() : this.openFullscreen();
    this.isFullscreen = !this.isFullscreen
  }
  openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }
  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  removeFocus(id: string) {
    document.getElementById(id)?.blur();
  }
}
