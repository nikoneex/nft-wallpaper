import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const baseUrl = 'https://api.opensea.io/api/v1';


@Injectable({
  providedIn: 'root'
})
export class OpenseaService {


  constructor(
    private http: HttpClient
  ) { }

  getCollections(): Observable<any> {
    let path = `${baseUrl}/collections`;
    return this.http.get(path)
  }
  
}
