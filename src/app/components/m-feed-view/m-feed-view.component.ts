import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { WallpaperService } from 'src/app/services/wallpaper.service';

@Component({
  selector: 'app-m-feed-view',
  templateUrl: './m-feed-view.component.html',
  styleUrls: ['./m-feed-view.component.scss']
})
export class MFeedViewComponent implements OnInit {

  collection: any[] = []
  _collection: Subscription;

  loading: boolean = false;
  _loading: Subscription;

  feedLayout: number = 1;
  _feedLayout: Subscription;

  refreshing: boolean = false;

  constructor(
    private settings: SettingsService,
    private cdref: ChangeDetectorRef,
    private wps: WallpaperService
  ) {
    this.collection = this.wps.collection;
    this._collection = this.wps.collection$.subscribe( collection => {
      this.refreshing = true;
      this.collection = collection;
      this.cdref.detectChanges();
      this.refreshing = false;
    })
    this._loading = this.wps.loading$.subscribe( loading => {
      this.loading = loading;
    })
    this._feedLayout = this.settings.feedLayout$.subscribe( layout => {
      this.feedLayout = layout;
      this.cdref.detectChanges();
    })
  }

  ngOnInit(): void {
  }
  



}
