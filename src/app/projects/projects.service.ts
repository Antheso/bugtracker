import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '../core/services';
import { ITableProject, IProjectRole } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public projects$ = new BehaviorSubject<ITableProject[]>([]);
  public projectRoles$ = new BehaviorSubject<IProjectRole[]>([]);

  constructor(
    private api: ApiService
  ) { }

  fetchProjects(): Observable<ITableProject[]> {
    return this.api.get('api/projects').pipe(
      tap(projects => this.projects$.next(projects))
    );
  }

  fetchRoles(): Observable<IProjectRole[]> {
    return this.api.get('api/project/roles').pipe(
      tap(roles => this.projectRoles$.next(roles))
    );
  }

}
