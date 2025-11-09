import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, RequiredPrivilege } from '../../services';

@Directive({
  selector: '[appHasPrivilege]',
  standalone: true,
})
export class HasPrivilegeDirective implements OnInit {
  @Input() appHasPrivilege: RequiredPrivilege[] = [];

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const hasAtLeastOnePrivilege = await this.authService.checkPrivileges(...this.appHasPrivilege);
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
