import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { Observable, merge } from 'rxjs';

import { PreloaderService } from './preloader.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'bg-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent {

  @Input() resolved = false;

  public isBusy$: Observable<boolean>;

  constructor (
    private router: Router,
    private preloaderSrv: PreloaderService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    const routerBusy$ = this.router.events.pipe(
      filter(e => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel),
      map(e => e instanceof NavigationStart)
    );

    this.isBusy$ = merge(this.preloaderSrv.isBusy$, routerBusy$).pipe(
      tap(() => this.cd.detectChanges())
    );
  }

}
