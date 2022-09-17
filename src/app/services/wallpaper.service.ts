import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  collection: any[] = [];
  collection$: Subject<any> = new Subject<any>();
  address: any = '';
  loading$: Subject<boolean> = new Subject<boolean>();

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
    this.collection$.next(collection);
  }

  cacheCollection(collection: any[]){
    localStorage.setItem('collection', JSON.stringify(collection))
  }

  isLoading(loading: boolean) {
    this.loading$.next(loading);
  }
}
