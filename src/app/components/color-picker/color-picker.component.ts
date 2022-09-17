import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import * as _ from 'lodash'


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {


  initColors: boolean = false;

  bgColor: string = '';
  _bgColor: Subscription;

  colorPalette: any = {
    colors: [
      'slate', 'stone', 'red', 'orange', 
      'amber', 'yellow', 'lime', 'green', 'emerald', 
      'teal', 'cyan', 'sky', 'blue', 'indigo', 
      'violet', 'purple', 'pink', 'rose'],
    variants: ['200', '300', '400', '500', '600', '700', '800']
  }
  colors: any[] = [];

  constructor(
    private settings: SettingsService
  ) {
    this._bgColor = this.settings.bgColor$.subscribe( color => {
      this.bgColor = color;
    })
  }

  ngOnInit(): void {
    this.initColors = true;
    setTimeout(() => {
      this.initColors = false;
    }, 400)
    this.colors = this.getColors(this.colorPalette);
  }

  updateBgColor(color: string) {
    this.settings.updateBgColor(color);
  }

  getColors(colorPallete: any){
    let bgColors: any[] = []
    _.each(colorPallete.colors, color => {
      _.each(colorPallete.variants, variant => {
        let bgColor = `bg-${color}-${variant}`
        bgColors.push(bgColor)
      })
    })
    return bgColors
  }

  resetBgColor() {
    this.settings.updateBgColor('bg-zinc-700');
  }

}
