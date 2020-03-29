import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';

import { ReplaySubject, Subject, of } from 'rxjs';
import { take, takeUntil, catchError } from 'rxjs/operators';

import { PreloaderService } from '../core/components';
import { ProjectService } from './project.service';
import { IUser, UserService } from '../core/services';
import { IProjectRole } from '../projects';

enum ProjectRoles {
  Worker,
  Manager,
  Admin
}

@Component({
  selector: 'bg-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements AfterViewInit, OnDestroy {

  projectForm: FormGroup;
  readonly = this.route.snapshot.data.readonly;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'delete'];
  dataSource = new MatTableDataSource([]);
  userOptions: IUser[];
  roleOptions: IProjectRole[];
  userManageForm: FormGroup;
  filteredUserOptions: ReplaySubject<IUser[]> = new ReplaySubject(1);
  error = '';
  @ViewChild('userSelect') userSelect: MatSelect;

  private _onDestroy = new Subject<void>();

  get projectIdControl(): AbstractControl {
    return this.projectForm.get('projectId');
  }

  get projectNameControl(): AbstractControl {
    return this.projectForm.get('projectName');
  }

  get descriptionControl(): AbstractControl {
    return this.projectForm.get('description');
  }

  get isPrivateControl(): AbstractControl {
    return this.projectForm.get('isPrivate');
  }

  get usersControl(): AbstractControl {
    return this.projectForm.get('users');
  }

  get userControl(): AbstractControl {
    return this.userManageForm.get('user');
  }

  get projectRoleIdControl(): AbstractControl {
    return this.userManageForm.get('projectRoleId');
  }

  get userFilterControl(): AbstractControl {
    return this.userManageForm.get('userFilter');
  }

  get routeReadonly(): boolean {
    return this.route.snapshot.data.readonly;
  }

  get isAdmin(): boolean {
    const proj = this.projectSrv.project$.getValue();
    return proj && proj.currUserRole === ProjectRoles.Admin.toString();
  }

  get isManager(): boolean {
    const proj = this.projectSrv.project$.getValue();
    return proj && proj.currUserRole === ProjectRoles.Manager.toString();
  }

  constructor(
    private route: ActivatedRoute,
    private preloaderSrv: PreloaderService,
    private router: Router,
    private projectSrv: ProjectService,
    private userSrv: UserService
  ) {
    this.userOptions = this.projectSrv.users$.getValue();
    this.roleOptions = this.projectSrv.projectRoles$.getValue();
    this.initUserManageForm();
    this.initForm();
  }

  submit(): void {
    this.projectForm.markAllAsTouched();

    if (this.projectForm.invalid && (this.projectForm.dirty || this.projectForm.touched)) {
      return;
    }

    if (this.route.snapshot.data.readonly) {
      this.preloaderSrv.isBusy$.next(true);
      this.projectSrv.patchProject({
        ...this.projectSrv.project$.getValue(),
        ...this.projectForm.value
      }).subscribe(() => {
        this.preloaderSrv.isBusy$.next(false);
        this.router.navigateByUrl('/projects');
      });
      return;
    }

    this.preloaderSrv.isBusy$.next(true);
    this.projectSrv.createProject(this.projectForm.value).pipe(
      catchError(err => {
        console.log(err);
        this.error = err.error.error;
        return of(void 0);
      })
    ).subscribe((resp) => {
      this.preloaderSrv.isBusy$.next(false);
      if (resp) {
        this.router.navigateByUrl('/projects');
      }
    });
  }

  cancel(event: MouseEvent): void {
    event.preventDefault();

    if (this.route.snapshot.data.readonly) {
      this.patchFormFromCache();
    } else {
      this.router.navigateByUrl('/projects');
    }
  }

  edit(): void {
    this.readonly = false;

    this.projectForm.enable();
    this.projectIdControl.disable();
    this.userManageForm.enable();
    // if (this.isAuthorOrAdmin) {
    //   this.ticketForm.enable();

    //   return;
    // }

    // if (this.isAssignee) {
    //   this.statusIdControl.enable();
    // }
  }

  addUser(): void {
    this.userManageForm.markAllAsTouched();

    if (this.userManageForm.invalid && (this.userManageForm.dirty || this.userManageForm.touched)) {
      return;
    }

    this.dataSource.data.push({
      ...this.userManageForm.value.user,
      projectRoleId: this.userManageForm.value.projectRoleId
    });
    this.dataSource._updateChangeSubscription();
    this.filterAvaliableUsers();
    this.initUserManageForm();
    this.projectForm.markAsTouched();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoleNameById(id: number): string {
    const role = this.roleOptions.find(item => item.projectRoleId === id);
    return role && role.projectRoleName;
  }

  deleteUser(userId: number): void {
    this.dataSource.data = this.dataSource.data.filter(item => item.userId !== userId);
    this.filterAvaliableUsers();
    this.projectForm.markAsTouched();
  }

  ngOnInit() {
    this.filteredUserOptions.next(this.userOptions.slice());
    this.filterAvaliableUsers();

    this.userFilterControl.valueChanges.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {
      this.filterUsers();
    });
  }

  ngAfterViewInit(): void {
    this.filteredUserOptions.pipe(
        take(1),
        takeUntil(this._onDestroy)
      ).subscribe(() => this.userSelect.compareWith = (a: IUser, b: IUser) => a && b && a.userId === b.userId);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private patchFormFromCache(): void {
    const cacheProj = this.projectSrv.project$.getValue();

    this.projectForm.patchValue(cacheProj);
    this.projectForm.disable();
    this.userManageForm.disable();
    this.dataSource.data = [...cacheProj.users];
    this.filterAvaliableUsers();
    this.readonly = true;
  }

  private initForm(): void {
    this.projectForm = new FormGroup({
      projectId: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]),
      projectName: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      isPrivate: new FormControl(false),
      users: new FormControl([])
    });

    if (this.route.snapshot.data.readonly) {
      this.patchFormFromCache();
    }
  }

  private initUserManageForm(): void {
    this.userManageForm = new FormGroup({
      user: new FormControl({
        value: this.userOptions[0],
        disabled: this.readonly
      }, [Validators.required]),
      userFilter: new FormControl(),
      projectRoleId: new FormControl({
        value: this.roleOptions[0].projectRoleId,
        disabled: this.readonly
      })
    })
  }

  private filterUsers(): void {
    if (!this.userOptions) {
      return;
    }

    let search = this.userFilterControl.value;

    if (!search) {
      this.filteredUserOptions.next(this.userOptions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUserOptions.next(
      this.userOptions.filter(user => user.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterAvaliableUsers(): void {
    this.userOptions = this.projectSrv.users$.getValue().filter(user => (user.userId !== this.userSrv.user.userId) && !this.dataSource.data.some(item => item.userId === user.userId));
    this.filteredUserOptions.next(this.userOptions);
    this.usersControl.patchValue(this.dataSource.data);

    if (this.userOptions.length) {
      this.userControl.patchValue(this.userOptions[0]);
    }
  }

}
