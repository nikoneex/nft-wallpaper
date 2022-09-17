import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { BlockdaemonService } from 'src/app/services/blockdaemon.service';
import { OpenseaService } from 'src/app/services/opensea.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WallpaperService } from 'src/app/services/wallpaper.service';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  bgColor: string = 'bg-zinc-700';
  _bgColor: Subscription;
  screenWidth: number = 0;

  loadByUrl: boolean = false;

  isMobile: boolean = false;


  constructor(
    private settings: SettingsService,
    private route: ActivatedRoute,
    private wps: WallpaperService,
    private as: AlchemyService,
    private bd: BlockdaemonService,
  ) {
    this._bgColor = this.settings.bgColor$.subscribe( color => {
      this.bgColor = color;
    });
    this.getScreenSize();
   }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 1024;
  }

  ngOnInit(): void {
    this.route.params.subscribe( routes => {
      if(routes['address']){
        this.loadByUrl = true;
        this.wps.isLoading(true);
        this.as.getNftsByWallet(routes['address']).subscribe( collection => {
          this.wps.updateCollection(collection.ownedNfts)
          this.wps.isLoading(false);
        })
      } else if (routes['contract']) {
        this.loadByUrl = true;
        this.wps.isLoading(true);
        this.as.getNftsByContract(routes['contract']).subscribe( res => {
          this.wps.isLoading(false);
          this.wps.updateCollection(res.nfts)
        })
        // this.bd.getAssetsByContract(routes['contract']).subscribe( collection => {
        //   this.wps.updateCollection(collection.ownedNfts)
        //   this.wps.isLoading(false);
        // })
      }
      else {
        this.wps.updateCollection([])
      }
    })
  }

}
