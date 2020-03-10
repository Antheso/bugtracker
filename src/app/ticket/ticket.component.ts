import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'

import { ISelectOption, IProjectOption, IAssigneeOption } from '../core/interfaces';
import { TicketService } from './ticket.service';
import { ITask, IComment } from './interfaces';
import { PreloaderService } from '../core/components';

@Component({
  selector: 'bg-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  projectOptions: IProjectOption[] = [];
  priorityOptions: ISelectOption[] = [];
  stateOptions: ISelectOption[] = [];
  typeOptions: ISelectOption[] = [];
  assigneeOptions: IAssigneeOption[] = [];
  ticketForm: FormGroup;
  readonly = this.route.snapshot.data.readonly;
  filteredProjectOptions: Observable<IProjectOption[]>;
  filteredAssigneeOptions: Observable<IAssigneeOption[]>;
  comments: IComment[] = [];

  get activeRoute(): ActivatedRoute {
    return this.route;
  }

  private currentTicket: ITask;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketSrv: TicketService,
    private preloaderSrv: PreloaderService
  ) {
    this.projectOptions = this.ticketSrv.projectOptions$.getValue();
    this.priorityOptions = this.ticketSrv.priorityOptions$.getValue();
    this.stateOptions = this.ticketSrv.statusOptions$.getValue();
    this.typeOptions = this.ticketSrv.typeOptions$.getValue();
    this.assigneeOptions = this.ticketSrv.assigneeOptions$.getValue();

    if (this.route.snapshot.data.readonly) {
      this.currentTicket = this.ticketSrv.task$.getValue();
      this.comments = this.ticketSrv.comments$.getValue();
    }

    this.initForm(this.currentTicket);
  }

  ngOnInit() {
    this.filteredProjectOptions = this.ticketForm.controls.project.valueChanges
      .pipe(
        map((value: IProjectOption) => value ? value.projectName : ''),
        map(name => name ? this._filterProjects(name, this.projectOptions) : this.projectOptions.slice())
      );

    this.filteredAssigneeOptions = this.ticketForm.controls.assignee.valueChanges
      .pipe(
        map((value: IAssigneeOption) => value ? value.name : ''),
        map(name => name ? this._filterAssignee(name, this.assigneeOptions) : this.assigneeOptions.slice())
      );
  }

  displayAssigneeFn(item: IAssigneeOption): string {
    return item && item.name ? item.name : '';
  }

  displayProjectsFn(item: IProjectOption): string {
    return item && item.projectName ? item.projectName : '';
  }

  submit(): void {
    if (this.route.snapshot.data.readonly) {
      const task = {
        ...this.currentTicket,
        ...<ITask>this.ticketForm.value
      };

      this.preloaderSrv.isBusy$.next(true);
      this.ticketSrv.patchTask(task).subscribe(() => {
        this.preloaderSrv.isBusy$.next(false);
        this.router.navigateByUrl('/issues');
      });
      return;
    }

    this.preloaderSrv.isBusy$.next(true);
    this.ticketSrv.createTask(<ITask>this.ticketForm.value).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.initForm();
    })
  }

  cancel(event: MouseEvent): void {
    event.preventDefault();

    if (this.route.snapshot.data.readonly) {
      this.ticketForm.patchValue(this.ticketSrv.task$.getValue());
      Object.entries(this.ticketForm.controls).forEach(([key, value]) => {
        if (key !== 'comment') {
          value.disable();
        }
      });
      this.readonly = true;
    } else {
      this.router.navigateByUrl('/issues');
    }
  }

  edit(): void {
    this.readonly = false;

    this.ticketForm.enable();
  }

  addComment(): void {
    const comment = {
      text: this.ticketForm.get('comment').value,
      user: {
        name: 'Bohdan',
        userId: '5ab8d9db-a014-41cd-a485-79d79caaa9a1'
      },
      timestamp: +new Date(),
      issueId: this.currentTicket.number
    };

    this.preloaderSrv.isBusy$.next(true);
    this.ticketSrv.createComment(comment).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.comments.push(comment);
      this.ticketForm.get('comment').reset();
    });
  }

  private initForm(task?: ITask): void {
    if (task) {
      this.ticketForm = new FormGroup({
        project: new FormControl({
          value: task.project,
          disabled: this.readonly
        }),
        description: new FormControl({
          value: task.description,
          disabled: this.readonly
        }),
        summary: new FormControl({
          value: task.summary,
          disabled: this.readonly
        }),
        priorityId: new FormControl({
          value: task.priorityId,
          disabled: this.readonly
        }),
        typeId: new FormControl({
          value: task.typeId,
          disabled: this.readonly
        }),
        statusId: new FormControl({
          value: task.statusId,
          disabled: this.readonly
        }),
        assignee: new FormControl({
          value: task.assignee,
          disabled: this.readonly
        }),
        comment: new FormControl('')
      });

      return;
    }

    this.ticketForm = new FormGroup({
      project: new FormControl(this.projectOptions[0]),
      description: new FormControl(''),
      summary: new FormControl(''),
      priorityId: new FormControl(this.priorityOptions[0].value),
      typeId: new FormControl(this.typeOptions[0].value),
      statusId: new FormControl(this.stateOptions[0].value),
      assignee: new FormControl(this.assigneeOptions[0]),
      comment: new FormControl('')
    });
  }

  private _filterAssignee(name: string, options: IAssigneeOption[]): IAssigneeOption[] {
    const filterValue = name.toLowerCase();

    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterProjects(name: string, options: IProjectOption[]): IProjectOption[] {
    const filterValue = name.toLowerCase();

    return options.filter(option => option.projectName.toLowerCase().indexOf(filterValue) === 0);
  }

}
