import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';

import { TicketService } from './ticket.service';
import { ITask } from './interfaces';
import { ISelectOption } from '../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TicketResolver implements Resolve<Observable<[ITask, ...ISelectOption[][]]> | Observable<ISelectOption[][]>> {

  constructor(
    private ticketSrv: TicketService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<[ITask, ...ISelectOption[][]]> | Observable<ISelectOption[][]> {
    if (route.params.ticketId) {
      return forkJoin(
        this.ticketSrv.fetchTask(route.params.ticketId),
        this.ticketSrv.fetchProjects(),
        this.ticketSrv.fetchPriorities(),
        this.ticketSrv.fetchStatuses(),
        this.ticketSrv.fetchTypes(),
        this.ticketSrv.fetchAssignees()
      );
    }

    return forkJoin(
      this.ticketSrv.fetchProjects(),
      this.ticketSrv.fetchPriorities(),
      this.ticketSrv.fetchStatuses(),
      this.ticketSrv.fetchTypes(),
      this.ticketSrv.fetchAssignees()
    );
  }

}
