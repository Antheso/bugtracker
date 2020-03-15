import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSelect } from '@angular/material/select';

import { Subject, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators'

import { ISelectOption, IProjectOption, IAssigneeOption } from '../core/interfaces';
import { TicketService } from './ticket.service';
import { ITask, IComment } from './interfaces';
import { PreloaderService } from '../core/components';

@Component({
  selector: 'bg-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements AfterViewInit, OnDestroy {
  projectOptions: IProjectOption[] = [];
  priorityOptions: ISelectOption[] = [];
  stateOptions: ISelectOption[] = [];
  typeOptions: ISelectOption[] = [];
  assigneeOptions: IAssigneeOption[] = [];
  ticketForm: FormGroup;
  readonly = this.route.snapshot.data.readonly;
  filteredProjectOptions: ReplaySubject<IProjectOption[]> = new ReplaySubject(1);
  filteredAssigneeOptions: ReplaySubject<IAssigneeOption[]> = new ReplaySubject(1);
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

  private currentTicket: ITask;
  private _onDestroy = new Subject<void>();

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

  displayProjectsFn(item: IProjectOption): string {
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
      ).subscribe(() => this.assigneeSelect.compareWith = (a: IAssigneeOption, b: IAssigneeOption) => a && b && a.userId === b.userId);

    this.filteredProjectOptions.pipe(
      take(1),
      takeUntil(this._onDestroy)
    ).subscribe(() => this.projectSelect.compareWith = (a: IProjectOption, b: IProjectOption) => a && b && a.projectId === b.projectId);
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

  private filterProjects(): IProjectOption[] {
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
