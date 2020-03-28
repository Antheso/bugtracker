import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSelect } from '@angular/material/select';

import { Subject, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators'

import { ISelectOption } from '../core/interfaces';
import { TicketService } from './ticket.service';
import { ITask, IComment } from './interfaces';
import { PreloaderService } from '../core/components';
import { UserService, Roles, IUser } from '../core/services';
import { ITableProject, ProjectsService } from '../projects';

@Component({
  selector: 'bg-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements AfterViewInit, OnDestroy {
  projectOptions: ITableProject[] = [];
  priorityOptions: ISelectOption[] = [];
  stateOptions: ISelectOption[] = [];
  typeOptions: ISelectOption[] = [];
  assigneeOptions: IUser[] = [];
  ticketForm: FormGroup;
  readonly = this.route.snapshot.data.readonly;
  filteredProjectOptions: ReplaySubject<ITableProject[]> = new ReplaySubject(1);
  filteredAssigneeOptions: ReplaySubject<IUser[]> = new ReplaySubject(1);
  comments: IComment[] = [];
  @ViewChild('assigneeSelect') assigneeSelect: MatSelect;
  @ViewChild('projectSelect') projectSelect: MatSelect;

  get activeRoute(): ActivatedRoute {
    return this.route;
  }

  get descriptionControl(): AbstractControl {
    return this.ticketForm.get('description');
  }

  get summaryControl(): AbstractControl {
    return this.ticketForm.get('summary');
  }

  get priorityIdControl(): AbstractControl {
    return this.ticketForm.get('priorityId');
  }

  get typeIdControl(): AbstractControl {
    return this.ticketForm.get('typeId');
  }

  get statusIdControl(): AbstractControl {
    return this.ticketForm.get('statusId');
  }

  get assigneeControl(): AbstractControl {
    return this.ticketForm.get('assignee');
  }

  get assigneeFilterControl(): AbstractControl {
    return this.ticketForm.get('assigneeFilter');
  }

  get projectControl(): AbstractControl {
    return this.ticketForm.get('project');
  }

  get projectFilterControl(): AbstractControl {
    return this.ticketForm.get('projectFilter');
  }

  get commentControl(): AbstractControl {
    return this.ticketForm.get('comment');
  }

  get isAuthorOrAdmin(): boolean {
    if (!this.currentTicket) {
      return true;
    }

    if (!this.userSrv.user) {
      return false;
    }

    return this.currentTicket.author.userId === this.userSrv.user.userId || this.userSrv.user.roleId === Roles.Admin;
  }

  get isAssignee(): boolean {
    if (!this.userSrv.user) {
      return false;
    }

    return this.currentTicket.assignee.userId === this.userSrv.user.userId;
  }

  private currentTicket: ITask;
  private _onDestroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketSrv: TicketService,
    private preloaderSrv: PreloaderService,
    private userSrv: UserService,
    private projectsSrv: ProjectsService
  ) {
    this.projectOptions = this.projectsSrv.projects$.getValue();
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
    this.filteredAssigneeOptions.next(this.assigneeOptions.slice());
    this.filteredProjectOptions.next(this.projectOptions.slice());

    this.assigneeFilterControl.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.filterAssignee();
    });
    this.projectFilterControl.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.filterProjects();
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit(): void {
    this.initSearchSelect();
  }

  displayProjectsFn(item: ITableProject): string {
    return item && item.projectName ? item.projectName : '';
  }

  submit(): void {
    this.ticketForm.markAllAsTouched();

    if (this.ticketForm.invalid && (this.ticketForm.dirty || this.ticketForm.touched)) {
      return;
    }

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
      this.router.navigateByUrl('/');
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

    if (this.isAuthorOrAdmin) {
      this.ticketForm.enable();

      return;
    }

    if (this.isAssignee) {
      this.statusIdControl.enable();
    }
  }

  addComment(): void {
    const comment = {
      text: this.ticketForm.get('comment').value,
      user: this.userSrv.user,
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
        },
        [Validators.required]),
        projectFilter: new FormControl(),
        description: new FormControl({
          value: task.description,
          disabled: this.readonly
        }),
        summary: new FormControl({
          value: task.summary,
          disabled: this.readonly
        },
        [Validators.required, Validators.maxLength(120)]),
        priorityId: new FormControl({
          value: task.priorityId,
          disabled: this.readonly
        },
        [Validators.required]),
        typeId: new FormControl({
          value: task.typeId,
          disabled: this.readonly
        },
        [Validators.required]),
        statusId: new FormControl({
          value: task.statusId,
          disabled: this.readonly
        },
        [Validators.required]),
        assignee: new FormControl({
          value: task.assignee,
          disabled: this.readonly
        },
        [Validators.required]),
        assigneeFilter: new FormControl(),
        comment: new FormControl('')
      });

      return;
    }

    this.ticketForm = new FormGroup({
      project: new FormControl(this.projectOptions[0], [Validators.required]),
      projectFilter: new FormControl(),
      description: new FormControl(''),
      summary: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      priorityId: new FormControl(this.priorityOptions[0].value, [Validators.required]),
      typeId: new FormControl(this.typeOptions[0].value, [Validators.required]),
      statusId: new FormControl(this.stateOptions[0].value, [Validators.required]),
      assignee: new FormControl(this.assigneeOptions[0], [Validators.required]),
      assigneeFilter: new FormControl(),
      comment: new FormControl('')
    });
  }

  private initSearchSelect(): void {
    this.filteredAssigneeOptions.pipe(
        take(1),
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        if (this.assigneeSelect) {
          this.assigneeSelect.compareWith = (a: IUser, b: IUser) => a && b && a.userId === b.userId;
        }
      });

    this.filteredProjectOptions.pipe(
      take(1),
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      if (this.projectSelect) {
        this.projectSelect.compareWith = (a: ITableProject, b: ITableProject) => a && b && a.projectId === b.projectId;
      }
    });
  }

  private filterAssignee(): void {
    if (!this.assigneeOptions) {
      return;
    }

    let search = this.assigneeFilterControl.value;

    if (!search) {
      this.filteredAssigneeOptions.next(this.assigneeOptions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredAssigneeOptions.next(
      this.assigneeOptions.filter(assignee => assignee.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterProjects(): ITableProject[] {
    if (!this.projectOptions) {
      return;
    }

    let search = this.projectFilterControl.value;

    if (!search) {
      this.filteredProjectOptions.next(this.projectOptions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredProjectOptions.next(
      this.projectOptions.filter(project => project.projectName.toLowerCase().indexOf(search) > -1)
    );
  }

}
