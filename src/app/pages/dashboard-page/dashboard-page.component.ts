import { Component, OnInit } from '@angular/core';
import { AlchemyService } from 'src/app/services/alchemy.service';
import { OpenseaService } from 'src/app/services/opensea.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
