import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

import { forkJoin } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

import { IssuesService } from './issues.service';
import { PreloaderService } from '../core/components';

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

  displayedColumns: string[] = ['select', 'id', 'name', 'delete'];
  dataSource = new MatTableDataSource<IIssue>(this.issuesSrv.issuesList$.getValue());
  selection = new SelectionModel<IIssue>(true, []);
  searchForm = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private router: Router,
    private issuesSrv: IssuesService,
    private preloaderSrv: PreloaderService
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

  goToTask(event: MouseEvent, taskId: string): void {
    event.stopPropagation();
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

  deleteIssues(): void {
    this.preloaderSrv.isBusy$.next(true);
    forkJoin(this.selection.selected.map(issue => this.issuesSrv.deleteIssue(issue.id))).pipe(
      switchMapTo(this.issuesSrv.fetchIssues())
    ).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.refreshDataSource();
    });
  }

  deleteIssue(id: string): void {
    event.stopPropagation();

    this.preloaderSrv.isBusy$.next(true);
    this.issuesSrv.deleteIssue(id).pipe(
      switchMapTo(this.issuesSrv.fetchIssues())
    ).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.refreshDataSource();
    });
  }

  private refreshDataSource(): void {
    this.dataSource = new MatTableDataSource<IIssue>(this.issuesSrv.issuesList$.getValue());
    this.selection = new SelectionModel<IIssue>(true, []);
  }

}
