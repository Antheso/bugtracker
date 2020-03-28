import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ApiService, IUser } from '../core/services';
import { ITask, IComment } from './interfaces';
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
  public comments$ = new BehaviorSubject<IComment[]>([]);
  public priorityOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public statusOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public typeOptions$ = new BehaviorSubject<ISelectOption[]>([]);
  public assigneeOptions$ = new BehaviorSubject<IUser[]>([]);

  constructor(
    private api: ApiService
  ) { }

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

  fetchAssignees(): Observable<IUser[]> {
    return this.api.get('api/users').pipe(
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
    return this.api.patch(`api/issues/${task.number}`, task);
  }

  fetchComments(id: string): Observable<IComment[]> {
    return this.api.get(`api/comments/${id}`).pipe(
      tap(comments => this.comments$.next(comments))
    );
  }

  createComment(comment: IComment): Observable<void> {
    return this.api.post(`api/comments`, comment);
  }

  private mapToSelectOption(options: any[], optionsMap: IOptionsMap): ISelectOption[] {
    return options.map(item => {
      optionsMap.forEach(elem => item[elem.to] = item[elem.from]);

      return item;
    })
  }

}
