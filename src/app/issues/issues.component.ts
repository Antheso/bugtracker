import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

import { IssuesService } from './issues.service';

export interface IIssue {
  id: string;
  name: string;
}

@Component({
  selector: 'bg-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent {

  displayedColumns: string[] = ['select', 'id', 'name'];
  dataSource = new MatTableDataSource<IIssue>(this.issuesSrv.issuesList$.getValue());
  selection = new SelectionModel<IIssue>(true, []);
  searchForm = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private router: Router,
    private issuesSrv: IssuesService
  ) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: IIssue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  goToTask(taskId: string): void {
    this.router.navigateByUrl(`/watch-ticket/${taskId}`);
  }

  searchTasks(): void {
    this.dataSource.filter = this.searchForm.value.search || '';
    this.dataSource._filterData(this.issuesSrv.issuesList$.getValue())
  }

  resetFilter(): void {
    this.searchForm.reset();
    this.searchTasks();
  }

}
