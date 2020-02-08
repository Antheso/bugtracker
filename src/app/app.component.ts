import { Component } from '@angular/core';

import { ThemeService } from './core/services';

@Component({
  selector: 'bg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  get themeStyles() {
    return this.themeSrv.currenThemeStyles;
  }

  constructor(
    private themeSrv: ThemeService
  ) {}

}
