import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const apiKey = 'U8jB2Za4EHMgRE56k8oAKD4HQkklBQmb3xjLYt7-WuZGmdHF'
// const baseUrl = 'https://ubiquity.api.blockdaemon.com/universal/v1/nft/ethereum/mainnet';
const baseUrl = 'https://svc.blockdaemon.com/universal/v1/ethereum/mainnet';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
});
const reqOptions = { headers }

@Injectable({
  providedIn: 'root'
})
export class BlockdaemonService {

  constructor(
    private http: HttpClient
  ) { }

  searchByName(name: string): Observable<any>{
    let path = `${baseUrl}/collections/search?name=${name}&verified=true&page_size=10`;
    return this.http.get(path as any, reqOptions)
  }

  getAssetsByWallet(address: string | undefined): Observable<any>{
    let path = `${baseUrl}/assets?wallet_address=${address}`;
    return this.http.get(path as any, reqOptions)
  }

  getAssetsByContract(address: string | undefined): Observable<any>{
    let path = `${baseUrl}/assets?contract_address=${address}`;
    return this.http.get(path as any, reqOptions)
  }
}
