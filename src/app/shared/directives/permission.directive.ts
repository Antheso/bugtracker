import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

import { UserService, Roles } from '../../core/services';

@Directive({
  selector: '[bgPermission]'
})
export class PermissionDirective {

  @Input('bgPermission') public role: Roles;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private userSrv: UserService
  ) { }


  ngOnInit() {
    const userPerm = this.userSrv.user ? this.userSrv.user.roleId : 0;

    if (userPerm >= this.role && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (userPerm < this.role && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }

}
