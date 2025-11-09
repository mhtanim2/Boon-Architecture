import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, RequiredPrivilege } from '../../services';
@Directive({
  selector: '[appHasPrivilegeNgIf]',
  standalone: true,
})
export class HasPrivilegeNgIfDirective implements OnInit {
  @Input() appHasPrivilegeNgIf: RequiredPrivilege[] = [];

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const hasAtLeastOnePrivilege = await this.authService.checkPrivileges(...this.appHasPrivilegeNgIf);
    if (hasAtLeastOnePrivilege) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
