import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { BlockdaemonService } from 'src/app/services/blockdaemon.service';
import { OpenseaService } from 'src/app/services/opensea.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WallpaperService } from 'src/app/services/wallpaper.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  bgColor: string = 'bg-zinc-700';
  _bgColor: Subscription;

  loadByUrl: boolean = false;

  constructor(
    private settings: SettingsService,
    private route: ActivatedRoute,
    private wps: WallpaperService,
    private as: AlchemyService,
    private bd: BlockdaemonService
  ) {
    this._bgColor = this.settings.bgColorSubscription.subscribe( color => {
      this.bgColor = color;
    })
   }

  ngOnInit(): void {
    this.route.params.subscribe( routes => {
      if(routes['address']){
        this.loadByUrl = true;
        this.wps.loadingSubscription.next(true);
        this.as.getNftsByWallet(routes['address']).subscribe( collection => {
          this.wps.updateCollection(collection.ownedNfts)
          this.wps.loadingSubscription.next(false);
        })
      } else if (routes['contract']) {
        this.loadByUrl = true;
        this.wps.loadingSubscription.next(true);
        this.bd.getAssetsByContract(routes['contract']).subscribe( collection => {
          this.wps.updateCollection(collection.ownedNfts)
          this.wps.loadingSubscription.next(false);
        })
      }
      else {
        this.wps.updateCollection([])
      }
    })
  }

}
