import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'

import { ISelectOption } from '../core/interfaces';

@Component({
  selector: 'bg-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {

  projectOptions: ISelectOption[] = [
    {
      value: 'Project#1',
      name: 'Project#1'
    },
    {
      value: 'Project#2',
      name: 'Project#2'
    },
    {
      value: 'Project#3',
      name: 'Project#3'
    }
  ];
  assigneeOptions: ISelectOption[] = [
    {
      value: 'Assignee#1',
      name: 'Assignee#1'
    },
    {
      value: 'Assignee#2',
      name: 'Assignee#2'
    },
    {
      value: 'Assignee#3',
      name: 'Assignee#3'
    }
  ];
  filteredProjectOptions: Observable<ISelectOption[]>;
  filteredAssigneeOptions: Observable<ISelectOption[]>;
  priorityOptions: ISelectOption[] = [
    {
      value: 'Minor',
      name: 'Minor'
    },
    {
      value: 'Normal',
      name: 'Normal'
    },
    {
      value: 'Critical',
      name: 'Critical'
    },
  ];
  typeOptions: ISelectOption[] = [
    {
      value: 'Bug',
      name: 'Bug'
    },
    {
      value: 'Task',
      name: 'Task'
    }
  ];
  stateOptions: ISelectOption[] = [
    {
      value: 'To do',
      name: 'To do'
    },
    {
      value: 'In progress',
      name: 'In progress'
    },
    {
      value: 'QA',
      name: 'QA'
    },
    {
      value: 'Rework',
      name: 'Rework'
    },
    {
      value: 'Done',
      name: 'Done'
    }
  ];
  readonly = this.route.snapshot.data.readonly;
  ticketForm = new FormGroup({
    projectName: new FormControl({
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
    priority: new FormControl({
      value: this.priorityOptions[0].value,
      disabled: this.readonly
    }),
    type: new FormControl({
      value: this.typeOptions[0].value,
      disabled: this.readonly
    }),
    state: new FormControl({
      value: this.stateOptions[0].value,
      disabled: this.readonly
    }),
    assignee: new FormControl({
      value: this.assigneeOptions[0],
      disabled: this.readonly
    }),
  });


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredProjectOptions = this.ticketForm.controls.projectName.valueChanges
      .pipe(
        map((value: ISelectOption) => value ? value.name : ''),
        map(name => name ? this._filter(name, this.projectOptions) : this.projectOptions.slice()),
        tap(data => console.log(data))
      );

    this.filteredAssigneeOptions = this.ticketForm.controls.assignee.valueChanges
      .pipe(
        map((value: ISelectOption) => value ? value.name : ''),
        map(name => name ? this._filter(name, this.assigneeOptions) : this.assigneeOptions.slice())
      );
  }

  displayProjectFn(project: ISelectOption): string {
    return project && project.name ? project.name : '';
  }

  displayAssigneeFn(assignee: ISelectOption): string {
    return assignee && assignee.name ? assignee.name : '';
  }

  submit(): void {
    console.log(this.ticketForm.value);
  }

  cancel(event: MouseEvent): void {
    event.preventDefault();

    if (this.route.snapshot.data.readonly) {
      this.ticketForm.disable();
      this.readonly = true;
    } else {
      this.router.navigateByUrl('/issues');
    }
  }

  edit(): void {
    this.readonly = false;

    this.ticketForm.enable();
  }

  private _filter(name: string, options: ISelectOption[]): ISelectOption[] {
    const filterValue = name.toLowerCase();

    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
