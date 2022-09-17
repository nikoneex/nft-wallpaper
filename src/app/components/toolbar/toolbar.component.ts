import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { faExpand, faPlus, faSun, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';
import { SwiperOptions } from 'swiper';
import { Subscription, Observable, startWith, map, Subject } from 'rxjs';
import { BlockdaemonService } from 'src/app/services/blockdaemon.service';
import { FormControl } from '@angular/forms';
import { ICollectionModel } from 'src/app/models/nft';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { WallpaperService } from 'src/app/services/wallpaper.service';
import * as _ from 'lodash'
import { MatInput } from '@angular/material/input';



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
  @Input() loadByUrl: boolean = false;


  form: FormControl = new FormControl();
  collection: ICollectionModel[] = [
    {
      name: '',
      contracts: [],
      id: '',
      logo: '',
      verified: false
    }
  ];
  _collection: Subscription;

  filteredResults: Subject<ICollectionModel[]> = new Subject<ICollectionModel[]>();

  addressVal: string = '';
  isFullscreen: boolean = false;
  isDarkmode: boolean = false;
  isAutoplay: boolean = false;
  showClock: boolean = false;
  bgColor: string = 'bg-sky-100';
  _bgColor: Subscription;

  colorPalette: any = {
    colors: [
      'slate', 'stone', 'red', 'orange', 
      'amber', 'yellow', 'lime', 'green', 'emerald', 
      'teal', 'cyan', 'sky', 'blue', 'indigo', 
      'violet', 'purple', 'pink', 'rose'],
    variants: ['200', '300', '400', '500', '600', '700', '800']
  }
  colors: any[] = [];

  swiperConfig: SwiperOptions = {};
  _configSubscription: Subscription;




  constructor(
    private as: AlchemyService,
    private bd: BlockdaemonService,
    private settings: SettingsService,
    private wps: WallpaperService
  ) {
    this.addressVal = this.as.address;
    this.swiperConfig = this.settings.config;
    this._configSubscription = this.settings.config$.subscribe( config => {
      this.swiperConfig = config;
    });
    this._bgColor = this.settings.bgColor$.subscribe( color => {
      this.bgColor = color;
    });
    this._collection = this.wps.collection$.subscribe( collection => {
      this.collection = collection
    });
    this.onNameSearch = _.debounce(this.onNameSearch, 800);
  }

  ngOnInit(): void {
    this.checkWakeLock();
    this.colors = this.getColors(this.colorPalette);
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
        this.bd.searchByName(name).subscribe(res => {
          this.collection = res.data;
          this.filteredResults.next(res.data);
        })
        // let data: any = [
        //   {
        //   name: 'Niko',
        //   id: '',
        //   logo: '',
        //   verified: false,
        //   contracts: ['']
        //   },
        //   {
        //   name: 'Carmel',
        //   id: '',
        //   logo: '',
        //   verified: false,
        //   contracts: ['']
        //   },
        //   {
        //   name: 'Dylan',
        //   id: '',
        //   logo: '',
        //   verified: false,
        //   contracts: ['']
        //   },
        //   {
        //   name: 'Dad',
        //   id: '',
        //   logo: '',
        //   verified: false,
        //   contracts: ['']
        //   },
        // ]
        // this.filteredResults.next(data)
      }
    }
  }

  loadCollection(e:MatAutocompleteSelectedEvent) {
    this.wps.isLoading(true);
    let collection = _.find(this.collection, {name: e.option.value})
    this.as.getNftsByContract(collection?.contracts[0]).subscribe( res => {
      this.wps.isLoading(false);
      this.wps.updateCollection(res.nfts)
    })

    // this.bd.getAssetsByContract(collection?.contracts[0]).subscribe(res => {
    //   console.log(res)
    // }, error => {
    // })
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
    this.settings.updateConfig(this.swiperConfig);
  }


  loadAddress(address: string){
    if ( address.length == 0 ) return
    this.wps.cacheAddress(address);
    this.wps.collection$.next([]);
    this.wps.isLoading(true);
    // this.bd.getAssetsByWallet(address).subscribe( collection => {
    //   this.loading = false;
    //   this.wps.collectionSubscription.next(collection.data);
    // })
    this.as.getNftsByWallet(address).subscribe( res => {
      this.collection = res.ownedNfts;
      this.wps.isLoading(false);
      this.wps.collection$.next(res.ownedNfts)
    })
  }

  getColors(colorPallete: any){
    let bgColors: any[] = []
    _.each(colorPallete.colors, color => {
      _.each(colorPallete.variants, variant => {
        let bgColor = `bg-${color}-${variant}`
        bgColors.push(bgColor)
      })
    })
    // let neutral = ['bg-neutral-800', 'bg-neutral-700', 'bg-neutral-600', 'bg-neutral-500', 'bg-neutral-400', 'bg-neutral-300', 'bg-neutral-200'];
    // _.each(neutral, item => {
    //   bgColors.unshift(item)
    // })
    return bgColors
  }

  updateBgColor(color: string) {
    this.settings.updateBgColor(color);
  }

  resetBgColor() {
    this.settings.updateBgColor('bg-zinc-700');
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

    isAutoplay ? this.settings.updateConfig(onAutoplay) : this.settings.updateConfig(offAutoplay)
  }

  updateEffect(i: number){
    this.settings.updateEffects(i);
  }

  toggleClock(showClock: boolean) {
    console.log(showClock)
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

  shuffle(){
    let shuffled = _.shuffle(this.collection);
    this.wps.updateCollection(shuffled);
  }
}
