import { Component, OnInit } from '@angular/core';
import * as m from 'moment';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  
  time = m().format('h:mm a');
  date = m().format('dddd MMM D, YYYY')

  constructor() {
    setInterval(() => {
      this.time = m().format('h:mm a');
      this.date = m().format('dddd MMM D, YYYY');
    },1000)
  }

  ngOnInit(): void {
  }



}
