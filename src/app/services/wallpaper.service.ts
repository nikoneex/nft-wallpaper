import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  collection: any[] = [];
  collectionSubscription: Subject<any> = new Subject<any>();
  address: any = '';
  loadingSubscription: Subject<boolean> = new Subject<boolean>();

  constructor() {
    if(localStorage.getItem('walletAddress')){
      this.address = localStorage.getItem('walletAddress');
    }
  }

  cacheAddress(address: string){
    localStorage.setItem('walletAddress', address);
  }

  clearAddress(){
    localStorage.clear();
  }

  updateCollection(collection: any[]) {
    this.collection = collection;
    this.collectionSubscription.next(collection);
  }

  cacheCollection(collection: any[]){
    localStorage.setItem('collection', JSON.stringify(collection))
  }

  isLoading(loading: boolean) {
    this.loadingSubscription.next(loading);
  }
}
