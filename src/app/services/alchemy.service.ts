import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const baseUrl = 'https://eth-mainnet.g.alchemy.com/v2/eHQO1zpvcF93q5MNe2ZOZAiFl5oiG_5k';


@Injectable({
  providedIn: 'root'
})
export class AlchemyService {


  address: any = '';

  constructor(
    private http: HttpClient,
  ) { 
    if(localStorage.getItem('walletAddress')){
      this.address = localStorage.getItem('walletAddress')
    }
  }

  cacheAddress(address: string){
    localStorage.setItem('walletAddress', address);
  }

  clearAddress(){
    localStorage.clear();
  }

  getNftsByWallet(address: string): Observable<any> {
    let path = `${baseUrl}/getNFTs?owner=${address}&filters[]=SPAM&filters[]=AIRDROPS`;
    return this.http.get(path as any)
  }

  
  
}
