import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, take, mapTo } from 'rxjs/operators';

import { ThemeService } from './core/services';

@Component({
  selector: 'bg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isRouteResolved: Observable<boolean> = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    take(1),
    mapTo(true)
  );

  get themeStyles() {
    return this.themeSrv.currenThemeStyles;
  }

  constructor(
    private router: Router,
    private themeSrv: ThemeService
  ) {}

}
