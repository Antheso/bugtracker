import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'

import { ISelectOption } from '../core/interfaces';
import { TicketService } from './ticket.service';
import { ITask, IComment } from './interfaces';
import { PreloaderService } from '../core/components';

@Component({
  selector: 'bg-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  projectOptions: ISelectOption[] = [];
  priorityOptions: ISelectOption[] = [];
  stateOptions: ISelectOption[] = [];
  typeOptions: ISelectOption[] = [];
  assigneeOptions: ISelectOption[] = [];
  ticketForm: FormGroup;
  readonly = this.route.snapshot.data.readonly;
  filteredProjectOptions: Observable<ISelectOption[]>;
  filteredAssigneeOptions: Observable<ISelectOption[]>;
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
    this.initForm();
  }

  ngOnInit() {
    if (this.route.snapshot.data.readonly) {
      this.currentTicket = this.ticketSrv.task$.getValue();
      this.comments = this.ticketSrv.comments$.getValue();
      this.ticketForm.patchValue(this.currentTicket);
    }

    this.filteredProjectOptions = this.ticketForm.controls.project.valueChanges
      .pipe(
        map((value: ISelectOption) => value ? value.name : ''),
        map(name => name ? this._filter(name, this.projectOptions) : this.projectOptions.slice())
      );

    this.filteredAssigneeOptions = this.ticketForm.controls.assignee.valueChanges
      .pipe(
        map((value: ISelectOption) => value ? value.name : ''),
        map(name => name ? this._filter(name, this.assigneeOptions) : this.assigneeOptions.slice())
      );
  }

  displayItemFn(item: ISelectOption): string {
    return item && item.name ? item.name : '';
  }

  submit(): void {
    if (this.route.snapshot.data.readonly) {
      const task = <ITask>this.ticketForm.value;
      task.id = this.currentTicket.id;

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
      this.ticketForm.patchValue(this.currentTicket);
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
        id: '5ab8d9db-a014-41cd-a485-79d79caaa9a1'
      },
      timestamp: +new Date(),
      issueId: this.currentTicket.id
    };

    this.preloaderSrv.isBusy$.next(true);
    this.ticketSrv.createComment(comment).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.comments.push(comment);
      this.ticketForm.get('comment').reset();
    });
  }

  private initForm(): void {
    this.ticketForm = new FormGroup({
      project: new FormControl({
        value: this.projectOptions[0],
        disabled: this.readonly
      }),
      description: new FormControl({
        value: '',
        disabled: this.readonly
      }),
      summary: new FormControl({
        value: '',
        disabled: this.readonly
      }),
      priorityId: new FormControl({
        value: this.priorityOptions[0].value,
        disabled: this.readonly
      }),
      typeId: new FormControl({
        value: this.typeOptions[0].value,
        disabled: this.readonly
      }),
      statusId: new FormControl({
        value: this.stateOptions[0].value,
        disabled: this.readonly
      }),
      assignee: new FormControl({
        value: this.assigneeOptions[0],
        disabled: this.readonly
      }),
      comment: new FormControl('')
    });
  }

  private _filter(name: string, options: ISelectOption[]): ISelectOption[] {
    const filterValue = name.toLowerCase();

    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
