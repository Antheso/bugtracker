import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ApiService } from '../core/services';
import { ITask } from './interfaces';
import { ISelectOption } from '../core/interfaces';

type IOptionsMap = Array<{
  from: string;
  to: string;
}>

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public task$ = new BehaviorSubject<ITask>(void 0);
  public projectOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public priorityOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public statusOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public typeOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public assigneeOptions$ = new BehaviorSubject<ISelectOption[]>([]);

  constructor(
    private api: ApiService
  ) { }

  fetchProjects(): Observable<ISelectOption[]> {
    return this.api.get('api/projects').pipe(
      map(projects => this.mapToSelectOption(projects, [
        {
          from: 'projectId',
          to: 'value'
        },
        {
          from: 'projectName',
          to: 'name'
        }
      ])),
      tap(projects => this.projectOptions$.next(projects))
    );
  }

  fetchPriorities(): Observable<ISelectOption[]> {
    return this.api.get('api/priorities').pipe(
      map(priorities => this.mapToSelectOption(priorities, [
        {
          from: 'priorityId',
          to: 'value'
        },
        {
          from: 'priorityName',
          to: 'name'
        }
      ])),
      tap(priorities => this.priorityOptions$.next(priorities))
    );
  }

  fetchStatuses(): Observable<ISelectOption[]> {
    return this.api.get('api/statuses').pipe(
      map(statuses => this.mapToSelectOption(statuses, [
        {
          from: 'statusId',
          to: 'value'
        },
        {
          from: 'statusName',
          to: 'name'
        }
      ])),
      tap(statuses => this.statusOptions$.next(statuses))
    );
  }

  fetchTypes(): Observable<ISelectOption[]> {
    return this.api.get('api/types').pipe(
      map(types => this.mapToSelectOption(types, [
        {
          from: 'typeId',
          to: 'value'
        },
        {
          from: 'typeName',
          to: 'name'
        }
      ])),
      tap(types => this.typeOptions$.next(types))
    );
  }

  fetchAssignees(): Observable<ISelectOption[]> {
    return this.api.get('api/users').pipe(
      map(assignees => this.mapToSelectOption(assignees, [
        {
          from: 'userId',
          to: 'value'
        }
      ])),
      tap(assignees => this.assigneeOptions$.next(assignees))
    );
  }

  fetchTask(id: string): Observable<ITask> {
    return this.api.get(`api/issues/${id}`).pipe(
      tap(task => this.task$.next(task))
    );
  }

  createTask(task: ITask): Observable<void> {
    return this.api.post('api/issues', task);
  }

  patchTask(task: ITask): Observable<void> {
    return this.api.patch(`api/issues/${task.id}`, task);
  }

  private mapToSelectOption(options: any[], optionsMap: IOptionsMap): ISelectOption[] {
    return options.map(item => {
      optionsMap.forEach(elem => item[elem.to] = item[elem.from]);

      return item;
    })
  }

}
