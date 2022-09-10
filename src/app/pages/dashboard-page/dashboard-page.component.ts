import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { OpenseaService } from 'src/app/services/opensea.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  bgColor: string = '';
  _bgColor: Subscription;

  constructor(
    private settings: SettingsService
  ) {
    this._bgColor = this.settings.bgColorSubscription.subscribe( color => {
      this.bgColor = color;
    })
   }

  ngOnInit(): void {
  }

}
