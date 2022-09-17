import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription } from 'rxjs';
import { ICollectionModel } from 'src/app/models/nft';
import { BlockdaemonService } from 'src/app/services/blockdaemon.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WallpaperService } from 'src/app/services/wallpaper.service';
import * as _ from 'lodash'
import { AlchemyService } from 'src/app/services/alchemy.service';


@Component({
  selector: 'app-m-toolbar',
  templateUrl: './m-toolbar.component.html',
  styleUrls: ['./m-toolbar.component.scss']
})
export class MToolbarComponent implements OnInit {
  faExpand = faExpand
  form: FormControl = new FormControl();


  @Input() loadByUrl: boolean = false;

  filteredResults: Subject<ICollectionModel[]> = new Subject<ICollectionModel[]>();

  bgColor: string = 'bg-sky-100';
  _bgColor: Subscription;

  addressVal: string = '';

  collection: ICollectionModel[] = [];
  _collection: Subscription;


  constructor(
    private settings: SettingsService,
    private wps: WallpaperService,
    private bd: BlockdaemonService,
    private as: AlchemyService
  ) {
    this._bgColor = this.settings.bgColor$.subscribe( color => {
      this.bgColor = color;
    });
    this._collection = this.wps.collection$.subscribe( collection => {
      this.collection = collection
    });
    this.onNameSearch = _.debounce(this.onNameSearch, 800);
  }

  ngOnInit(): void {
  }

  updateGrid(e: number){
    this.settings.updateLayout(e);
  }


  removeFocus(id: string) {
    document.getElementById(id)?.blur();
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

}
