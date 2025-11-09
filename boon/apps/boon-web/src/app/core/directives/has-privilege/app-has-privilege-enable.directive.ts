import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, RequiredPrivilege } from '../../services';

@Directive({
  selector: '[appHasPrivilegeEnable]',
  standalone: true,
})
export class HasPrivilegeEnableDirective implements OnInit {
  @Input() appHasPrivilegeEnable: RequiredPrivilege[] = [];

  isEnabled = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private element: ElementRef,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const hasAtLeastOnePrivilege = await this.authService.checkPrivileges(...this.appHasPrivilegeEnable);
    if (hasAtLeastOnePrivilege) {
      if (!this.isEnabled) {
        this.isEnabled = true;
        this.element.nativeElement.disabled = false;
      }
    } else {
      this.isEnabled = false;
      this.element.nativeElement.disabled = true;
    }
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
