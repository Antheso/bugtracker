import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService, IUser } from '../core/services';
import { IProjectRole } from '../projects';
import { IProject } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projectRoles$ = new BehaviorSubject<IProjectRole[]>(void 0);
  public users$ = new BehaviorSubject<IUser[]>(void 0);
  public project$ = new BehaviorSubject<IProject>(void 0);

  constructor(
    private api: ApiService
  ) { }

  fetchRoles(): Observable<IProjectRole[]> {
    return this.api.get('api/project/roles').pipe(
      tap(roles => this.projectRoles$.next(roles))
    );
  }

  fetchUsers(): Observable<IUser[]> {
    return this.api.get('api/users').pipe(
      tap(users => this.users$.next(users))
    );
  }

  fetchProject(projectId: string): Observable<any> {
    return this.api.get(`api/projects/${projectId}`).pipe(
      tap(project => this.project$.next(project))
    );
  }

  createProject(project: IProject): Observable<any> {
    return this.api.post('api/projects', project, (err) => throwError(err));
  }

  patchProject(project: IProject): Observable<any> {
    return this.api.patch('api/projects', project);
  }

}
